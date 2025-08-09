/**
 * Reusable Button component with variants and sizes
 * Provides consistent button styling across the application
 */

import { forwardRef } from 'react';

/**
 * Button component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'ghost'|'outline'} [props.variant='primary'] - Button variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.disabled] - Whether button is disabled
 * @param {boolean} [props.loading] - Whether button is in loading state
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.rest] - Additional props
 */
export const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  className = '',
  ...rest 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-brand text-white hover:bg-brand/90',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'hover:bg-gray-100',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
  };
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs rounded-md',
    md: 'h-10 px-4 text-sm rounded-md',
    lg: 'h-12 px-6 text-base rounded-lg',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].join(' ');

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';
