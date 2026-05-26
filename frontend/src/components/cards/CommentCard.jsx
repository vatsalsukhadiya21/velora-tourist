import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrashIcon } from '@heroicons/react/24/outline';
import Avatar from '../ui/Avatar';
import { formatDate } from '../../utils/formatDate';

export default function CommentCard({
  comment,
  currentUserId,
  onDelete,
  index = 0,
}) {
  const isOwner = currentUserId && currentUserId === comment.author?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex gap-3 py-4 border-b border-line last:border-b-0 group"
    >
      {/* Author Avatar */}
      <Link to={`/profile/${comment.author?.id}`} className="flex-shrink-0">
        <Avatar user={comment.author} size="sm" />
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link
            to={`/profile/${comment.author?.id}`}
            className="text-sm font-semibold text-foreground hover:text-accent transition-colors"
          >
            {comment.author?.displayName || comment.author?.username}
          </Link>
          <span className="text-xs text-faint">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-muted leading-relaxed break-words">
          {comment.content}
        </p>
      </div>

      {/* Delete button (owner only) */}
      {isOwner && onDelete && (
        <button
          onClick={() => onDelete(comment.id)}
          className="flex-shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-danger/10 text-faint hover:text-danger transition-all"
          title="Delete comment"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
