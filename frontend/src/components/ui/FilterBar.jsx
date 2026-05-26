import { motion, AnimatePresence } from 'framer-motion';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';
import CategoryPill from './CategoryPill';
import { COUNTRIES } from '../../utils/constants';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'trending', label: 'Most Popular' },
  { value: 'oldest', label: 'Oldest First' },
];

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
}) {
  const hasActiveFilters =
    searchQuery || selectedCategory || selectedCountry || selectedSort !== 'newest';

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search destinations, experiences, stories..."
      />

      {/* Category Pills — horizontal scroll */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
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
        {/* Fade edges */}
        <div className="absolute right-0 top-0 bottom-1 w-12 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
      </div>

      {/* Country + Sort + Clear Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-faint">
          <FunnelIcon className="w-3.5 h-3.5" />
          <span>Filters</span>
        </div>

        {/* Country Select */}
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="bg-card border border-line text-sm text-foreground rounded-xl px-3 py-2 outline-none focus:border-accent transition-colors appearance-none cursor-pointer pr-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2355556a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25rem',
          }}
        >
          <option value="">All Countries</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Sort Select */}
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-card border border-line text-sm text-foreground rounded-xl px-3 py-2 outline-none focus:border-accent transition-colors appearance-none cursor-pointer pr-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2355556a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25rem',
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={onClearFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-accent hover:text-violet bg-accent/10 hover:bg-accent/15 rounded-xl transition-colors"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
              Clear
            </motion.button>
          )}
        </AnimatePresence>

        {/* Result Count */}
        {resultCount !== undefined && (
          <span className="text-xs text-faint ml-auto">
            {resultCount} {resultCount === 1 ? 'experience' : 'experiences'}
          </span>
        )}
      </div>
    </div>
  );
}
