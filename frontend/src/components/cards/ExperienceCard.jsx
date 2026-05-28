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

export default function ExperienceCard({
  post,
  onLike,
  isLiked = false,
  onSave,
  isSaved = false,
  variant = 'grid',
}) {
  const coverImage = post.imageUrls?.[0];
  const isFeed = variant === 'feed';
  const showSave = Boolean(onSave);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: isFeed ? -4 : -6 }}
      transition={{ duration: 0.35 }}
      className={`group relative bg-card border border-line rounded-2xl overflow-hidden hover:border-line-light transition-all duration-300 ${
        isFeed ? 'hover:shadow-xl hover:shadow-accent/5' : 'hover:shadow-2xl hover:shadow-accent/5'
      }`}
    >
      {/* ─── Author strip (feed variant) ─── */}
      {isFeed && (
        <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2">
          <Link
            to={`/profile/${post.author?.id}`}
            className="flex items-center gap-2.5 min-w-0 hover:opacity-85 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar user={post.author} size="xs" className="shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {post.author?.displayName || post.author?.username}
              </p>
              <p className="text-[10px] text-faint">{formatDate(post.createdAt)}</p>
            </div>
          </Link>
          {post.categoryName && (
            <Badge text={post.categoryName} className="shrink-0 !text-[10px]" />
          )}
        </div>
      )}

      {/* ─── Image ─── */}
      <Link to={`/post/${post.id}`} className="block">
        <div
          className={`relative overflow-hidden bg-elevated ${
            isFeed ? 'aspect-[16/10]' : 'aspect-[4/3]'
          }`}
        >
          {coverImage ? (
            <img
              src={coverImage}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-faint">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z"
                />
              </svg>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {!isFeed && post.categoryName && (
            <div className="absolute top-3 left-3">
              <Badge text={post.categoryName} />
            </div>
          )}

          {post.imageUrls?.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-md px-2 py-0.5 text-[10px] text-white/90 font-medium">
              {post.imageUrls.length} photos
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/90 text-xs">
            <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="drop-shadow-md truncate max-w-[200px]">
              {post.city ? `${post.city}, ` : ''}
              {post.country}
            </span>
          </div>
        </div>
      </Link>

      {/* ─── Content ─── */}
      <div className={isFeed ? 'px-4 py-3.5' : 'p-4 sm:p-5'}>
        <Link to={`/post/${post.id}`}>
          <h3
            className={`font-bold font-[Outfit] text-foreground line-clamp-2 group-hover:text-accent transition-colors ${
              isFeed ? 'text-base leading-snug mb-1.5' : 'text-lg mb-1.5'
            }`}
          >
            {post.title}
          </h3>
        </Link>
        <p
          className={`text-muted line-clamp-2 leading-relaxed ${
            isFeed ? 'text-sm mb-3' : 'text-sm mb-4'
          }`}
        >
          {post.description}
        </p>

        {/* Footer */}
        <div
          className={`flex items-center justify-between gap-3 ${
            isFeed ? 'pt-3 border-t border-line/80' : 'pt-4 border-t border-line'
          }`}
        >
          {!isFeed && (
            <Link
              to={`/profile/${post.author?.id}`}
              className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity"
            >
              <Avatar user={post.author} size="xs" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground/80 truncate">
                  {post.author?.displayName || post.author?.username}
                </p>
                <p className="text-[10px] text-faint">{formatDate(post.createdAt)}</p>
              </div>
            </Link>
          )}

          {isFeed && (
            <Link
              to={`/post/${post.id}`}
              className="text-xs text-accent hover:text-violet font-medium transition-colors"
            >
              Read story
            </Link>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            <SocialButton
              onClick={() => onLike?.(post.id)}
              active={isLiked}
              activeClass="text-rose bg-rose/10 border-rose/20"
              label={`${formatCount(post.likeCount)} likes`}
              count={formatCount(post.likeCount)}
              icon={
                isLiked ? (
                  <HeartSolid className="w-4 h-4 shrink-0" />
                ) : (
                  <HeartIcon className="w-4 h-4 shrink-0" />
                )
              }
            />
            <span
              className="flex items-center gap-1 min-h-[36px] px-2.5 rounded-lg text-xs text-muted border border-transparent"
              aria-label={`${formatCount(post.commentCount)} comments`}
            >
              <ChatBubbleLeftIcon className="w-4 h-4 shrink-0" />
              <span className="font-medium tabular-nums">{formatCount(post.commentCount)}</span>
            </span>
            {showSave && (
              <SocialButton
                onClick={() => onSave(post.id)}
                active={isSaved}
                activeClass="text-amber bg-amber/10 border-amber/20"
                label={isSaved ? 'Unsave' : 'Save'}
                icon={
                  isSaved ? (
                    <BookmarkSolid className="w-4 h-4" />
                  ) : (
                    <BookmarkIcon className="w-4 h-4" />
                  )
                }
              />
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function SocialButton({ onClick, active, activeClass, label, icon, count }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      aria-label={label}
      className={`flex items-center gap-1 min-h-[36px] px-2.5 rounded-lg text-xs font-medium border transition-colors ${
        count ? 'min-w-0' : 'min-w-[36px]'
      } ${
        active
          ? activeClass
          : 'text-muted border-line/80 bg-elevated/50 hover:text-foreground hover:border-line-light'
      }`}
    >
      {icon}
      {count != null && <span className="tabular-nums">{count}</span>}
    </button>
  );
}
