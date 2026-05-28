/**
 * Shared horizontal layout rail for consistent max-width and gutters.
 */
export default function PageContainer({
  children,
  className = '',
  size = 'wide',
  as: Tag = 'div',
}) {
  const maxWidth =
    size === 'full'
      ? 'max-w-7xl'
      : size === 'narrow'
      ? 'max-w-3xl'
      : size === 'feed'
      ? 'max-w-6xl'
      : 'max-w-6xl';

  return (
    <Tag className={`${maxWidth} mx-auto px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
