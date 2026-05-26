import { motion } from 'framer-motion';

export default function CategoryPill({
  label,
  emoji,
  isActive = false,
  onClick,
  count,
  className = '',
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap cursor-pointer ${
        isActive
          ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
          : 'bg-card text-muted border-line hover:border-line-light hover:text-foreground hover:bg-elevated'
      } ${className}`}
    >
      {emoji && <span className="text-base leading-none">{emoji}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-xs ml-0.5 ${
            isActive ? 'text-white/70' : 'text-faint'
          }`}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
}
