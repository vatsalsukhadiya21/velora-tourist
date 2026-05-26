import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import PageTransition from '../components/layout/PageTransition';
import ExperienceCard from '../components/cards/ExperienceCard';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeletonGrid } from '../components/ui/SkeletonLoader';
import { getSavedPosts } from '../api/savedApi';
import { toggleLike } from '../api/likeApi';
import { toggleSave } from '../api/savedApi';
import { useAuth } from '../hooks/useAuth';

export default function SavedPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ─── State ───
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [likedPosts, setLikedPosts] = useState(new Set());

  // ─── Fetch saved posts ───
  const fetchSaved = useCallback(
    async (reset = false) => {
      const page = reset ? 0 : currentPage + 1;
      if (reset) setLoading(true);
      else setLoadingMore(true);

      try {
        const { data } = await getSavedPosts(page, 12);
        const content = data.content || [];
        if (reset) setPosts(content);
        else setPosts((prev) => [...prev, ...content]);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setCurrentPage(page);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [currentPage]
  );

  useEffect(() => {
    if (isAuthenticated) fetchSaved(true);
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Like handler (closure-safe) ───
  const handleLike = useCallback(
    async (postId) => {
      if (!isAuthenticated) return;
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
    [isAuthenticated]
  );

  // ─── Unsave handler (optimistic removal) ───
  const handleUnsave = useCallback(
    async (postId) => {
      // Optimistic removal from list
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setTotalElements((prev) => Math.max(0, prev - 1));
      try {
        await toggleSave(postId);
      } catch {
        // Revert on failure — re-fetch from server
        fetchSaved(true);
      }
    },
    [fetchSaved]
  );

  const hasMore = currentPage + 1 < totalPages;

  return (
    <PageTransition>
      {/* ─── Header ─── */}
      <section className="relative pt-8 pb-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-amber/6 rounded-full blur-[100px]" />
          <div className="absolute top-8 right-1/4 w-48 h-48 bg-accent/6 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold font-[Outfit] mb-2">
              Saved <span className="gradient-text">Experiences</span>
            </h1>
            <p className="text-muted text-base">
              Your bookmarked travel stories
              {!loading && totalElements > 0 && (
                <span className="text-faint">
                  {' '}
                  · {totalElements} saved
                </span>
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Content ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <CardSkeletonGrid count={6} />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={BookmarkIcon}
            title="No saved experiences"
            description="Bookmark travel experiences you love and they'll appear here for easy access."
            actionLabel="Explore Experiences"
            actionTo="/explore"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ExperienceCard
                    post={post}
                    onLike={handleLike}
                    isLiked={likedPosts.has(post.id)}
                    onSave={handleUnsave}
                    isSaved={true}
                  />
                </motion.div>
              ))}
            </div>

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
                  onClick={() => fetchSaved(false)}
                >
                  Load More
                </Button>
              </motion.div>
            )}

            {!hasMore && posts.length > 0 && (
              <p className="text-center text-faint text-sm mt-12">
                All {totalElements} saved experiences shown
              </p>
            )}
          </>
        )}
      </section>
    </PageTransition>
  );
}
