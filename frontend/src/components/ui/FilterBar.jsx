import { motion, AnimatePresence } from 'framer-motion';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';
import CategoryPill from './CategoryPill';
import { COUNTRIES } from '../../utils/constants';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'trending', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

const selectClass =
  'bg-card border border-line text-xs sm:text-sm text-foreground rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 outline-none focus:border-accent transition-colors appearance-none cursor-pointer pr-7';

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2355556a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
  backgroundPosition: 'right 0.4rem center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '1rem',
};

export default function FilterBar({
  categories = [],
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedSort,
  onSortChange,
  onClearFilters,
  resultCount,
  compact = false,
}) {
  const hasActiveFilters =
    searchQuery || selectedCategory || selectedCountry || selectedSort !== 'newest';

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search stories, places, travelers..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className={selectClass}
            style={selectStyle}
            aria-label="Filter by country"
          >
            <option value="">All countries</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className={selectClass}
            style={selectStyle}
            aria-label="Sort stories"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={onClearFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-accent hover:text-violet bg-accent/10 hover:bg-accent/15 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
                Clear
              </motion.button>
            )}
          </AnimatePresence>

          {resultCount !== undefined && (
            <span className="text-xs text-faint hidden sm:inline">
              {resultCount} {resultCount === 1 ? 'story' : 'stories'}
            </span>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div className="relative -mx-1">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide px-1">
          <CategoryPill
            label="All"
            emoji="✨"
            isActive={!selectedCategory}
            onClick={() => onCategoryChange(null)}
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              label={cat.name}
              emoji={cat.emoji}
              isActive={selectedCategory === cat.id}
              onClick={() =>
                onCategoryChange(selectedCategory === cat.id ? null : cat.id)
              }
            />
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0.5 w-8 bg-gradient-to-l from-surface/95 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
