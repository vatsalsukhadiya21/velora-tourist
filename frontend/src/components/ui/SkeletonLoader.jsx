/* ─── Generic Skeleton ─── */
export function Skeleton({ className = '', rounded = 'rounded-lg' }) {
  return (
    <div
      className={`shimmer ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
}

/* ─── Card Skeleton ─── */
export function CardSkeleton() {
  return (
    <div className="bg-card border border-line rounded-2xl overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-[4/3] shimmer" />

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 shimmer rounded-lg" />
        <div className="h-5 w-3/4 shimmer rounded-lg" />
        <div className="space-y-2">
          <div className="h-3.5 w-full shimmer rounded-lg" />
          <div className="h-3.5 w-2/3 shimmer rounded-lg" />
        </div>

        {/* Author row */}
        <div className="flex items-center gap-3 pt-3 border-t border-line">
          <div className="w-8 h-8 rounded-xl shimmer" />
          <div className="space-y-1.5">
            <div className="h-3 w-24 shimmer rounded" />
            <div className="h-2.5 w-16 shimmer rounded" />
          </div>
          <div className="ml-auto flex gap-3">
            <div className="h-3 w-8 shimmer rounded" />
            <div className="h-3 w-8 shimmer rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Featured Card Skeleton ─── */
export function FeaturedSkeleton() {
  return (
    <div className="relative h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-card border border-line">
      <div className="w-full h-full shimmer" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-3">
        <div className="h-3 w-20 shimmer rounded-lg" />
        <div className="h-7 w-2/3 shimmer rounded-lg" />
        <div className="h-4 w-1/2 shimmer rounded-lg hidden sm:block" />
        <div className="flex items-center gap-3 pt-2">
          <div className="w-8 h-8 rounded-xl shimmer" />
          <div className="h-3 w-28 shimmer rounded" />
        </div>
      </div>
    </div>
  );
}

/* ─── Card Grid Skeleton ─── */
export function CardSkeletonGrid({ count = 8, className = '' }) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ─── Text Skeleton ─── */
export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 shimmer rounded ${
            i === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Profile Skeleton ─── */
export function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Cover */}
      <div className="h-48 md:h-64 rounded-2xl shimmer mb-8" />
      {/* Avatar + Info */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-12">
        <div className="w-24 h-24 rounded-2xl shimmer -mt-12 sm:-mt-16 border-4 border-surface" />
        <div className="space-y-3 flex-1">
          <div className="h-6 w-48 shimmer rounded-lg" />
          <div className="h-4 w-32 shimmer rounded" />
          <div className="h-4 w-64 shimmer rounded" />
        </div>
      </div>
      {/* Grid */}
      <CardSkeletonGrid count={6} />
    </div>
  );
}

/* ─── Comment Skeleton ─── */
export function CommentSkeleton({ count = 3 }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 py-4 border-b border-line">
          <div className="w-8 h-8 rounded-xl shimmer flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <div className="h-3.5 w-24 shimmer rounded" />
              <div className="h-3 w-16 shimmer rounded" />
            </div>
            <div className="h-3.5 w-full shimmer rounded" />
            <div className="h-3.5 w-3/4 shimmer rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
