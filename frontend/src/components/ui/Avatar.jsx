const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
  '2xl': 'w-28 h-28 text-3xl',
};

const radiusClasses = {
  rounded: 'rounded-xl',
  full: 'rounded-full',
};

export default function Avatar({
  user,
  size = 'sm',
  shape = 'rounded',
  className = '',
  showRing = false,
}) {
  const base = `${sizeClasses[size]} ${radiusClasses[shape]} ${
    showRing ? 'ring-2 ring-accent/40 ring-offset-2 ring-offset-surface' : ''
  } ${className}`;

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.username || 'User'}
        className={`${base} object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${base} bg-gradient-to-br from-accent to-violet flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-white font-semibold leading-none">
        {user?.username?.charAt(0).toUpperCase() || '?'}
      </span>
    </div>
  );
}
