import React from 'react';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary';
type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  rounded?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  warning: 'bg-amber-100 text-amber-800',
  info: 'bg-blue-100 text-blue-800',
  primary: 'bg-krooa-green/20 text-krooa-dark',
  secondary: 'bg-purple-100 text-purple-800'
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-2.5 py-0.5 text-sm',
  md: 'px-3 py-1 text-sm'
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  rounded = true
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${rounded ? 'rounded-full' : 'rounded'}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

interface StatusPillProps extends BadgeProps {
  icon?: React.ReactNode;
  dot?: boolean;
}

export function StatusPill({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  icon,
  dot,
  rounded = true
}: StatusPillProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium
        ${rounded ? 'rounded-full' : 'rounded-lg'}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`
          w-1.5 h-1.5 rounded-full
          ${variant === 'success' ? 'bg-green-500' : ''}
          ${variant === 'error' ? 'bg-red-500' : ''}
          ${variant === 'warning' ? 'bg-amber-500' : ''}
          ${variant === 'info' ? 'bg-blue-500' : ''}
          ${variant === 'primary' ? 'bg-krooa-green' : ''}
          ${variant === 'default' ? 'bg-gray-500' : ''}
        `} />
      )}
      {icon}
      {children}
    </span>
  );
}

interface TagProps {
  label: string;
  onRemove?: () => void;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export function Tag({
  label,
  onRemove,
  variant = 'default',
  size = 'sm',
  className = ''
}: TagProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-lg
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-75 transition-opacity"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}