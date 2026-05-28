import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlobeAltIcon, MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';
import PageTransition from '../components/layout/PageTransition';
import PageContainer from '../components/layout/PageContainer';
import FilterBar from '../components/ui/FilterBar';
import ExperienceCard from '../components/cards/ExperienceCard';
import FeaturedCard from '../components/cards/FeaturedCard';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { CardSkeletonGrid } from '../components/ui/SkeletonLoader';
import { getAllPosts, searchPosts, getTrendingPosts, getCategories } from '../api/postApi';
import { enrichCategories } from '../utils/constants';
import { toggleLike } from '../api/likeApi';
import { toggleSave } from '../api/savedApi';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());

  const loadMoreRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const country = searchParams.get('country') || '';
    const sort = searchParams.get('sort') || 'newest';
    setSearchQuery(q);
    setSelectedCountry(country);
    setSortBy(sort);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getCategories()
      .then(({ data }) => {
        setCategories(enrichCategories(data));
        const catSlug = searchParams.get('category');
        if (catSlug && data.length) {
          const found = data.find(
            (c) => c.slug === catSlug || c.name.toLowerCase() === catSlug.toLowerCase()
          );
          if (found) setSelectedCategory(found.id);
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setFeaturedLoading(true);
    getTrendingPosts(0, 4)
      .then(({ data }) => {
        const content = data.content || data;
        setFeaturedPosts(Array.isArray(content) ? content : []);
      })
      .catch(() => setFeaturedPosts([]))
      .finally(() => setFeaturedLoading(false));
  }, []);

  useEffect(() => {
    fetchPosts(true);
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (selectedCategory) {
      const cat = categories.find((c) => c.id === selectedCategory);
      if (cat) params.category = cat.slug;
    }
    if (selectedCountry) params.country = selectedCountry;
    if (sortBy !== 'newest') params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, selectedCategory, selectedCountry, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPosts = useCallback(
    async (reset = false) => {
      const targetPage = reset ? 0 : currentPage + 1;
      if (reset) {
        setLoading(true);
        setError('');
      } else {
        setLoadingMore(true);
      }

      try {
        const sortParam =
          sortBy === 'trending'
            ? 'likeCount,desc'
            : sortBy === 'oldest'
            ? 'createdAt,asc'
            : 'createdAt,desc';

        const hasFilters = debouncedSearch || selectedCategory || selectedCountry;

        let response;
        if (hasFilters) {
          response = await searchPosts({
            q: debouncedSearch || undefined,
            categoryId: selectedCategory || undefined,
            country: selectedCountry || undefined,
            page: targetPage,
            size: 12,
            sort: sortParam,
          });
        } else {
          response = await getAllPosts(targetPage, 12, sortParam);
        }

        const data = response.data;
        const content = data.content || [];

        if (reset) {
          setPosts(content);
        } else {
          setPosts((prev) => [...prev, ...content]);
        }
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setCurrentPage(targetPage);
      } catch {
        setError('Failed to load experiences. Please try again.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearch, selectedCategory, selectedCountry, sortBy, currentPage]
  );

  const handleLike = useCallback(
    async (postId) => {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: { pathname: '/explore' } } });
        return;
      }
      try {
        await toggleLike(postId);
        let wasLiked = false;
        setLikedPosts((prev) => {
          const next = new Set(prev);
          wasLiked = next.has(postId);
          if (wasLiked) next.delete(postId);
          else next.add(postId);
          return next;
        });
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likeCount: wasLiked
                    ? Math.max(0, (p.likeCount || 1) - 1)
                    : (p.likeCount || 0) + 1,
                }
              : p
          )
        );
      } catch {
        /* silent */
      }
    },
    [isAuthenticated, navigate]
  );

  const handleSave = useCallback(
    async (postId) => {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: { pathname: '/explore' } } });
        return;
      }
      try {
        await toggleSave(postId);
        setSavedPosts((prev) => {
          const next = new Set(prev);
          if (next.has(postId)) next.delete(postId);
          else next.add(postId);
          return next;
        });
      } catch {
        /* silent */
      }
    },
    [isAuthenticated, navigate]
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedCountry('');
    setSortBy('newest');
  };

  const hasMore = currentPage + 1 < totalPages;
  const hasActiveFilters =
    searchQuery || selectedCategory || selectedCountry || sortBy !== 'newest';

  // Infinite scroll sentinel
  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchPosts(false);
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, fetchPosts]);

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* ─── Feed header (compact) ─── */}
        <section className="border-b border-line/50">
          <PageContainer size="feed" className="py-5 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-accent mb-1.5">
                  Community feed
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold font-[Outfit] text-foreground leading-tight">
                  Stories from{' '}
                  <span className="gradient-text">travelers</span>
                </h1>
                <p className="text-sm text-muted mt-1.5 max-w-md">
                  Discover journeys, react to stories, and save your favorites
                </p>
              </div>
              {!loading && totalElements > 0 && (
                <p className="text-xs text-faint shrink-0">
                  {totalElements} {totalElements === 1 ? 'story' : 'stories'}
                </p>
              )}
            </div>
          </PageContainer>
        </section>

        {/* ─── Trending strip ─── */}
        {!hasActiveFilters && (
          <section className="border-b border-line/40 bg-elevated/30">
            <PageContainer size="feed" className="py-4 sm:py-5">
              <div className="flex items-center gap-2 mb-3">
                <SparklesIcon className="w-4 h-4 text-accent shrink-0" />
                <h2 className="text-sm font-semibold text-foreground">Trending now</h2>
              </div>
              {featuredLoading ? (
                <div className="flex gap-4 overflow-hidden">
                  <div className="shrink-0 w-[280px] h-44 rounded-xl bg-card animate-pulse" />
                  <div className="shrink-0 w-[280px] h-44 rounded-xl bg-card animate-pulse hidden sm:block" />
                </div>
              ) : featuredPosts.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1 snap-x snap-mandatory">
                  {featuredPosts.map((post, i) => (
                    <div
                      key={post.id}
                      className="shrink-0 w-[min(85vw,300px)] sm:w-[300px] snap-start"
                    >
                      <FeaturedCard post={post} index={i} compact />
                    </div>
                  ))}
                </div>
              ) : null}
            </PageContainer>
          </section>
        )}

        {/* ─── Sticky filters ─── */}
        <section className="sticky top-16 z-30 bg-surface/90 backdrop-blur-xl border-b border-line/60 py-3">
          <PageContainer size="feed">
            <FilterBar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              selectedSort={sortBy}
              onSortChange={setSortBy}
              onClearFilters={clearFilters}
              resultCount={loading ? undefined : totalElements}
              compact
            />
          </PageContainer>
        </section>

        {/* ─── Feed ─── */}
        <section className="py-6 sm:py-8">
          <PageContainer size="feed">
            {loading ? (
              <CardSkeletonGrid count={6} />
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <p className="text-muted text-sm mb-6 max-w-md">{error}</p>
                <Button variant="secondary" onClick={() => fetchPosts(true)}>
                  Try Again
                </Button>
              </motion.div>
            ) : posts.length === 0 ? (
              <div className="space-y-8">
                <EmptyState
                  icon={hasActiveFilters ? MagnifyingGlassIcon : GlobeAltIcon}
                  title={
                    hasActiveFilters ? 'No stories found' : 'No stories yet'
                  }
                  description={
                    hasActiveFilters
                      ? 'Try different filters or browse trending stories below.'
                      : 'Be the first to share a travel story with the community.'
                  }
                  actionLabel={hasActiveFilters ? 'Clear Filters' : 'Share a Story'}
                  actionTo={hasActiveFilters ? undefined : '/create'}
                  onAction={hasActiveFilters ? clearFilters : undefined}
                  className="!py-12"
                />
                {hasActiveFilters && featuredPosts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4">
                      Trending you might like
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {featuredPosts.slice(0, 2).map((post, i) => (
                        <FeaturedCard key={post.id} post={post} index={i} compact />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {posts.map((post) => (
                    <ExperienceCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      isLiked={likedPosts.has(post.id)}
                      onSave={handleSave}
                      isSaved={savedPosts.has(post.id)}
                      variant="feed"
                    />
                  ))}
                </div>

                {hasMore && (
                  <div ref={loadMoreRef} className="py-8 flex justify-center">
                    {loadingMore && (
                      <p className="text-xs text-faint animate-pulse">Loading more stories...</p>
                    )}
                  </div>
                )}

                {!hasMore && posts.length > 0 && (
                  <p className="text-center text-faint text-xs pt-6 pb-2">
                    You&apos;ve seen all {totalElements}{' '}
                    {totalElements === 1 ? 'story' : 'stories'}
                  </p>
                )}
              </>
            )}
          </PageContainer>
        </section>
      </div>
    </PageTransition>
  );
}
