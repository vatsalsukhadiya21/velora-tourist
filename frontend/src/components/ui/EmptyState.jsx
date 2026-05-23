import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-20 text-center ${className}`}
    >
      {Icon && (
        <div className="w-20 h-20 rounded-2xl bg-elevated border border-line flex items-center justify-center mb-6">
          <Icon className="w-9 h-9 text-faint" />
        </div>
      )}
      <h3 className="text-xl font-bold font-[Outfit] text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-muted text-sm max-w-md mb-8 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel &&
        (actionTo ? (
          <Link to={actionTo} className="btn-primary text-sm px-6 py-2.5">
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="btn-primary text-sm px-6 py-2.5"
          >
            {actionLabel}
          </button>
        ))}
    </motion.div>
  );
}
