import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlobeAltIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import PageTransition from '../components/layout/PageTransition';
import FilterBar from '../components/ui/FilterBar';
import ExperienceCard from '../components/cards/ExperienceCard';
import FeaturedCard from '../components/cards/FeaturedCard';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { CardSkeletonGrid, FeaturedSkeleton } from '../components/ui/SkeletonLoader';
import { getAllPosts, searchPosts, getTrendingPosts, getCategories } from '../api/postApi';
import { toggleLike } from '../api/likeApi';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';

export default function ExplorePage() {
  // ─── Data State ───
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

  // ─── Filter State ───
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // ─── Interaction State ───
  const [likedPosts, setLikedPosts] = useState(new Set());

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedSearch = useDebounce(searchQuery, 400);

  // ─── Initialize from URL params ───
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const country = searchParams.get('country') || '';
    const sort = searchParams.get('sort') || 'newest';
    setSearchQuery(q);
    setSelectedCountry(country);
    setSortBy(sort);

    // Category from URL — resolve slug to ID after categories load
    // (handled in the categories fetch effect)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Fetch categories on mount ───
  useEffect(() => {
    getCategories()
      .then(({ data }) => {
        setCategories(data);
        // Resolve category slug from URL
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

  // ─── Fetch featured/trending posts on mount ───
  useEffect(() => {
    setFeaturedLoading(true);
    getTrendingPosts(0, 3)
      .then(({ data }) => {
        const content = data.content || data;
        setFeaturedPosts(Array.isArray(content) ? content : []);
      })
      .catch(() => setFeaturedPosts([]))
      .finally(() => setFeaturedLoading(false));
  }, []);

  // ─── Fetch posts when filters change ───
  useEffect(() => {
    fetchPosts(true);
    // Sync URL params
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

  // ─── Core fetch function ───
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

  // ─── Like handler (closure-safe) ───
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
        /* silently fail */
      }
    },
    [isAuthenticated, navigate]
  );

  // ─── Clear all filters ───
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedCountry('');
    setSortBy('newest');
  };

  const hasMore = currentPage + 1 < totalPages;
  const hasActiveFilters =
    searchQuery || selectedCategory || selectedCountry || sortBy !== 'newest';

  return (
    <PageTransition>
      {/* ═══════════════════════════════════════════
          HERO HEADER
          ═══════════════════════════════════════════ */}
      <section className="relative pt-8 pb-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/8 rounded-full blur-[100px]" />
          <div className="absolute top-12 right-1/4 w-56 h-56 bg-violet/8 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-[Outfit] mb-3">
              Explore{' '}
              <span className="gradient-text">Experiences</span>
            </h1>
            <p className="text-muted text-base sm:text-lg max-w-xl">
              Discover travel stories from real explorers around the world
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED POSTS (only when no filters active)
          ═══════════════════════════════════════════ */}
      {!hasActiveFilters && (
        <section className="pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {featuredLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FeaturedSkeleton />
                <div className="hidden lg:grid grid-rows-2 gap-4">
                  <FeaturedSkeleton />
                  <FeaturedSkeleton />
                </div>
              </div>
            ) : featuredPosts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Primary featured card */}
                <FeaturedCard post={featuredPosts[0]} index={0} />
                {/* Secondary cards */}
                {featuredPosts.length > 1 && (
                  <div className="grid grid-rows-1 lg:grid-rows-2 gap-4">
                    {featuredPosts.slice(1, 3).map((post, i) => (
                      <FeaturedCard key={post.id} post={post} index={i + 1} />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          STICKY FILTER BAR
          ═══════════════════════════════════════════ */}
      <section className="sticky top-20 z-30 bg-surface/80 backdrop-blur-2xl border-b border-line py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          RESULTS GRID
          ═══════════════════════════════════════════ */}
      <section className="py-8 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <CardSkeletonGrid count={8} />
          ) : error ? (
            /* ─── Error State ─── */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-6">
                <svg
                  className="w-9 h-9 text-danger"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-[Outfit] text-foreground mb-2">
                Something went wrong
              </h3>
              <p className="text-muted text-sm mb-8 max-w-md">{error}</p>
              <Button
                variant="secondary"
                onClick={() => fetchPosts(true)}
              >
                Try Again
              </Button>
            </motion.div>
          ) : posts.length === 0 ? (
            /* ─── Empty State ─── */
            <EmptyState
              icon={hasActiveFilters ? MagnifyingGlassIcon : GlobeAltIcon}
              title={
                hasActiveFilters
                  ? 'No experiences found'
                  : 'No experiences yet'
              }
              description={
                hasActiveFilters
                  ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
                  : 'Be the first to share a travel experience! The world is waiting for your stories.'
              }
              actionLabel={hasActiveFilters ? 'Clear Filters' : 'Share an Experience'}
              actionTo={hasActiveFilters ? undefined : '/create'}
              onAction={hasActiveFilters ? clearFilters : undefined}
            />
          ) : (
            /* ─── Post Grid ─── */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {posts.map((post) => (
                  <ExperienceCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    isLiked={likedPosts.has(post.id)}
                  />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12 flex justify-center"
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    isLoading={loadingMore}
                    onClick={() => fetchPosts(false)}
                  >
                    Load More Experiences
                  </Button>
                </motion.div>
              )}

              {/* End message */}
              {!hasMore && posts.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-faint text-sm mt-12"
                >
                  You&apos;ve reached the end — {totalElements}{' '}
                  {totalElements === 1 ? 'experience' : 'experiences'} total
                </motion.p>
              )}
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
