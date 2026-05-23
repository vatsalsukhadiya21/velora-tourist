import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variantStyles = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger:
    'inline-flex items-center justify-center bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20 rounded-xl font-medium transition-all cursor-pointer',
};

const sizeStyles = {
  sm: '!text-xs !px-3 !py-1.5',
  md: '!text-sm !px-4 !py-2.5',
  lg: '!text-base !px-6 !py-3.5',
  xl: '!text-lg !px-8 !py-4',
};

const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      className = '',
      isLoading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={`${variantStyles[variant]} ${sizeStyles[size]} ${
          fullWidth ? 'w-full' : ''
        } gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          <>
            {LeftIcon && <LeftIcon className="w-4 h-4" />}
            {children}
            {RightIcon && <RightIcon className="w-4 h-4" />}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
