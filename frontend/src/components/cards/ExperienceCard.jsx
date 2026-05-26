import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  MapPinIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';

function formatCount(num) {
  if (!num) return '0';
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

export default function ExperienceCard({ post, onLike, isLiked = false, onSave, isSaved = false }) {
  const coverImage = post.imageUrls?.[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      className="group relative bg-card border border-line rounded-2xl overflow-hidden hover:border-line-light transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5"
    >
      {/* ─── Image Section ─── */}
      <Link to={`/post/${post.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-elevated">
          {coverImage ? (
            <img
              src={coverImage}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-faint">
              <svg
                className="w-12 h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z"
                />
              </svg>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Category badge */}
          {post.categoryName && (
            <div className="absolute top-4 left-4">
              <Badge text={post.categoryName} />
            </div>
          )}

          {/* Multi-image indicator */}
          {post.imageUrls?.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] text-white/90 font-medium flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {post.imageUrls.length}
            </div>
          )}

          {/* Location */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/90 text-sm">
            <MapPinIcon className="w-3.5 h-3.5" />
            <span className="drop-shadow-md">
              {post.city ? `${post.city}, ` : ''}
              {post.country}
            </span>
          </div>
        </div>
      </Link>

      {/* ─── Content Section ─── */}
      <div className="p-5">
        <Link to={`/post/${post.id}`}>
          <h3 className="text-lg font-bold font-[Outfit] text-foreground line-clamp-1 mb-1.5 group-hover:text-accent transition-colors duration-300">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-muted line-clamp-2 leading-relaxed mb-4">
          {post.description}
        </p>

        {/* Footer: Author + Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-line">
          <Link
            to={`/profile/${post.author?.id}`}
            className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
          >
            <Avatar user={post.author} size="xs" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground/80 truncate">
                {post.author?.displayName || post.author?.username}
              </p>
              <p className="text-[10px] text-faint">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                onLike?.(post.id);
              }}
              className={`flex items-center gap-1 text-xs transition-colors ${
                isLiked
                  ? 'text-rose'
                  : 'text-muted hover:text-rose'
              }`}
            >
              {isLiked ? (
                <HeartSolid className="w-4 h-4" />
              ) : (
                <HeartIcon className="w-4 h-4" />
              )}
              <span>{formatCount(post.likeCount)}</span>
            </button>
            <span className="flex items-center gap-1 text-xs text-muted">
              <ChatBubbleLeftIcon className="w-4 h-4" />
              <span>{formatCount(post.commentCount)}</span>
            </span>
            {onSave && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onSave(post.id);
                }}
                className={`flex items-center text-xs transition-colors ${
                  isSaved
                    ? 'text-amber hover:text-amber/70'
                    : 'text-muted hover:text-amber'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save'}
              >
                {isSaved ? (
                  <BookmarkSolid className="w-4 h-4" />
                ) : (
                  <BookmarkIcon className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
