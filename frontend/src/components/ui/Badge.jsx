const variantStyles = {
  default: 'bg-accent/15 text-accent border-accent/20',
  warm: 'bg-amber/15 text-amber border-amber/20',
  rose: 'bg-rose/15 text-rose border-rose/20',
  success: 'bg-success/15 text-success border-success/20',
  muted: 'bg-elevated text-muted border-line',
  violet: 'bg-violet/15 text-violet border-violet/20',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({
  text,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-lg border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {text}
    </span>
  );
}
