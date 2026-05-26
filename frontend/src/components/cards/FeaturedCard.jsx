import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { formatDate, formatCount } from '../../utils/formatDate';

export default function FeaturedCard({ post, index = 0 }) {
  const coverImage = post.imageUrls?.[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <Link to={`/post/${post.id}`} className="block">
        <div className="relative h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden">
          {/* Background Image */}
          {coverImage ? (
            <img
              src={coverImage}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-elevated" />
          )}

          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

          {/* Category Badge */}
          {post.categoryName && (
            <div className="absolute top-5 left-5">
              <Badge text={post.categoryName} size="md" />
            </div>
          )}

          {/* Image count */}
          {post.imageUrls?.length > 1 && (
            <div className="absolute top-5 right-5 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs text-white/90 font-medium">
              {post.imageUrls.length} photos
            </div>
          )}

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8">
            {/* Location */}
            <div className="flex items-center gap-1.5 text-white/70 text-sm mb-3">
              <MapPinIcon className="w-4 h-4" />
              <span>
                {post.city ? `${post.city}, ` : ''}
                {post.country}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-[Outfit] text-white leading-tight line-clamp-2 mb-2">
              {post.title}
            </h3>

            {/* Description */}
            <p className="text-white/60 text-sm line-clamp-2 mb-4 max-w-lg hidden sm:block">
              {post.description}
            </p>

            {/* Author + Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar user={post.author} size="sm" />
                <div>
                  <p className="text-sm font-medium text-white/90">
                    {post.author?.displayName || post.author?.username}
                  </p>
                  <p className="text-xs text-white/50">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm text-white/60">
                  <HeartIcon className="w-4 h-4" />
                  {formatCount(post.likeCount || 0)}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-white/60">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  {formatCount(post.commentCount || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
