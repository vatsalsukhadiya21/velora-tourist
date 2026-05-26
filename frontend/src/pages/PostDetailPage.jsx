import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  BookmarkIcon,
  MapPinIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  TrashIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolid,
  BookmarkIcon as BookmarkSolid,
} from '@heroicons/react/24/solid';
import PageTransition from '../components/layout/PageTransition';
import ImageGallery from '../components/ui/ImageGallery';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import CommentCard from '../components/cards/CommentCard';
import ExperienceCard from '../components/cards/ExperienceCard';
import Modal from '../components/ui/Modal';
import { getPostById, searchPosts, deletePost } from '../api/postApi';
import { getComments, addComment, deleteComment } from '../api/commentApi';
import { toggleLike, getLikeStatus } from '../api/likeApi';
import { toggleSave, getSaveStatus } from '../api/savedApi';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';
import { CommentSkeleton } from '../components/ui/SkeletonLoader';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // ─── Post State ───
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ─── Like / Save ───
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // ─── Comments ───
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentPage, setCommentPage] = useState(0);
  const [commentTotalPages, setCommentTotalPages] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  // ─── Related Posts ───
  const [relatedPosts, setRelatedPosts] = useState([]);

  // ─── Delete Confirm ───
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = isAuthenticated && user?.id === post?.author?.id;

  // ─── Fetch post ───
  useEffect(() => {
    setLoading(true);
    setError('');
    getPostById(id)
      .then(({ data }) => {
        setPost(data);
        setLikeCount(data.likeCount || 0);
        setCommentCount(data.commentCount || 0);
        // Fetch related
        if (data.categoryId) {
          searchPosts({ categoryId: data.categoryId, size: 5 })
            .then(({ data: r }) => {
              const content = r.content || [];
              setRelatedPosts(content.filter((p) => p.id !== data.id).slice(0, 4));
            })
            .catch(() => {});
        }
      })
      .catch(() => setError('Experience not found'))
      .finally(() => setLoading(false));
  }, [id]);

  // ─── Fetch like/save status ───
  useEffect(() => {
    if (isAuthenticated && id) {
      getLikeStatus(id)
        .then(({ data }) => setLiked(!!data))
        .catch(() => {});
      getSaveStatus(id)
        .then(({ data }) => setSaved(!!data))
        .catch(() => {});
    }
  }, [id, isAuthenticated]);

  // ─── Fetch comments ───
  const fetchComments = useCallback(
    async (reset = false) => {
      const page = reset ? 0 : commentPage + 1;
      setCommentsLoading(true);
      try {
        const { data } = await getComments(id, page, 10);
        const content = data.content || [];
        if (reset) setComments(content);
        else setComments((prev) => [...prev, ...content]);
        setCommentTotalPages(data.totalPages || 0);
        setCommentPage(page);
      } catch {
        /* silent */
      } finally {
        setCommentsLoading(false);
      }
    },
    [id, commentPage]
  );

  useEffect(() => {
    if (id) fetchComments(true);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Handlers ───
  const handleLike = async () => {
    if (!isAuthenticated) return navigate('/login', { state: { from: { pathname: `/post/${id}` } } });
    try {
      await toggleLike(id);
      setLiked((p) => !p);
      setLikeCount((p) => (liked ? p - 1 : p + 1));
    } catch {
      /* silent */
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return navigate('/login', { state: { from: { pathname: `/post/${id}` } } });
    try {
      await toggleSave(id);
      setSaved((p) => !p);
    } catch {
      /* silent */
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) return navigate('/login', { state: { from: { pathname: `/post/${id}` } } });
    setSubmittingComment(true);
    try {
      const { data } = await addComment(id, commentText.trim());
      setComments((prev) => [data, ...prev]);
      setCommentText('');
      setCommentCount((p) => p + 1);
    } catch {
      /* silent */
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setCommentCount((p) => Math.max(0, p - 1));
    } catch {
      /* silent */
    }
  };

  const handleDeletePost = async () => {
    setDeleting(true);
    try {
      await deletePost(id);
      navigate('/explore', { replace: true });
    } catch {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // ─── Loading / Error ───
  if (loading) return <Loader fullScreen text="Loading experience..." />;

  if (error || !post) {
    return (
      <PageTransition>
        <EmptyState
          icon={MapPinIcon}
          title="Experience not found"
          description="This experience may have been removed or doesn't exist."
          actionLabel="Back to Explore"
          actionTo="/explore"
          className="min-h-[60vh]"
        />
      </PageTransition>
    );
  }

  const hasMoreComments = commentPage + 1 < commentTotalPages;

  return (
    <PageTransition>
      {/* ═══════════════════════════════════
          IMAGE GALLERY
          ═══════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ImageGallery images={post.imageUrls || []} className="rounded-2xl" />
      </section>

      {/* ═══════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════ */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Explore
        </Link>

        {/* ─── Header ─── */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {post.categoryName && (
            <Badge text={post.categoryName} size="md" className="mb-4" />
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-[Outfit] text-foreground leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6">
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4" />
              {post.city ? `${post.city}, ` : ''}
              {post.country}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              {formatDate(post.createdAt)}
            </span>
          </div>
        </motion.header>

        {/* ─── Divider ─── */}
        <div className="h-px bg-gradient-to-r from-transparent via-line-light to-transparent mb-8" />

        {/* ─── Description ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="prose-content mb-8"
        >
          {post.description?.split('\n').map((paragraph, i) =>
            paragraph.trim() ? (
              <p
                key={i}
                className="text-foreground/85 text-base sm:text-lg leading-relaxed mb-4"
              >
                {paragraph}
              </p>
            ) : (
              <br key={i} />
            )
          )}
        </motion.div>

        {/* ─── Divider ─── */}
        <div className="h-px bg-gradient-to-r from-transparent via-line-light to-transparent mb-6" />

        {/* ─── Author Row + Actions ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          {/* Author */}
          <Link
            to={`/profile/${post.author?.id}`}
            className="flex items-center gap-3 group"
          >
            <Avatar user={post.author} size="md" />
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                {post.author?.displayName || post.author?.username}
              </p>
              <p className="text-xs text-muted">@{post.author?.username}</p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                liked
                  ? 'bg-rose/10 border-rose/30 text-rose'
                  : 'bg-card border-line text-muted hover:text-foreground hover:border-line-light'
              }`}
            >
              {liked ? (
                <HeartSolid className="w-4 h-4" />
              ) : (
                <HeartIcon className="w-4 h-4" />
              )}
              {likeCount}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                saved
                  ? 'bg-amber/10 border-amber/30 text-amber'
                  : 'bg-card border-line text-muted hover:text-foreground hover:border-line-light'
              }`}
            >
              {saved ? (
                <BookmarkSolid className="w-4 h-4" />
              ) : (
                <BookmarkIcon className="w-4 h-4" />
              )}
              Save
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-card border border-line text-muted hover:text-foreground hover:border-line-light transition-all"
              title="Share"
            >
              <ShareIcon className="w-4 h-4" />
            </motion.button>

            {isOwner && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setDeleteModalOpen(true)}
                className="p-2.5 rounded-xl bg-card border border-line text-muted hover:text-danger hover:border-danger/30 transition-all"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* ─── Divider ─── */}
        <div className="h-px bg-gradient-to-r from-transparent via-line-light to-transparent mb-8" />

        {/* ═══════════════════════════════════
            COMMENTS SECTION
            ═══════════════════════════════════ */}
        <section>
          <h2 className="text-xl font-bold font-[Outfit] text-foreground mb-6 flex items-center gap-2">
            <ChatBubbleLeftIcon className="w-5 h-5 text-accent" />
            Comments
            <span className="text-sm font-normal text-muted">({commentCount})</span>
          </h2>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <div className="flex gap-3">
                <Avatar user={user} size="sm" className="mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="textarea-field !min-h-[80px]"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      type="submit"
                      size="sm"
                      isLoading={submittingComment}
                      disabled={!commentText.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-card border border-line rounded-xl text-center">
              <p className="text-sm text-muted mb-3">
                Sign in to join the conversation
              </p>
              <Link to="/login" className="btn-primary text-sm !py-2 !px-5">
                Sign In
              </Link>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading && comments.length === 0 ? (
            <CommentSkeleton count={3} />
          ) : comments.length === 0 ? (
            <p className="text-center text-muted text-sm py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div>
              {comments.map((comment, i) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  currentUserId={user?.id}
                  onDelete={handleDeleteComment}
                  index={i}
                />
              ))}

              {hasMoreComments && (
                <div className="mt-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    isLoading={commentsLoading}
                    onClick={() => fetchComments(false)}
                  >
                    Load More Comments
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
      </article>

      {/* ═══════════════════════════════════
          RELATED POSTS
          ═══════════════════════════════════ */}
      {relatedPosts.length > 0 && (
        <section className="py-12 border-t border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold font-[Outfit] text-foreground mb-8">
              More Like This
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPosts.map((p) => (
                <ExperienceCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Delete Confirmation Modal ─── */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Experience"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={deleting} onClick={handleDeletePost}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-muted text-sm">
          Are you sure you want to delete &quot;{post?.title}&quot;? This action
          cannot be undone.
        </p>
      </Modal>
    </PageTransition>
  );
}
