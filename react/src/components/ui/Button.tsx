import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'menu-item';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-krooa-green text-krooa-dark hover:shadow-lg hover:bg-opacity-90',
  secondary: 'bg-krooa-blue text-white hover:bg-krooa-dark',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-krooa-dark hover:bg-gray-100',
  outline: 'border border-gray-300 bg-transparent text-krooa-dark hover:bg-gray-50',
  'menu-item': 'bg-transparent text-krooa-dark hover:bg-gray-50 text-left',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};

const radiusStyles: Record<ButtonSize, string> = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  loading = false,
  icon,
  iconPosition = 'left',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        ${radiusStyles[size]} font-semibold transition-all duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Carregando...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
}

// Botão de ícone apenas
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export function IconButton({
  variant = 'ghost',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: IconButtonProps) {
  const iconSizeStyles: Record<ButtonSize, string> = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconRadiusStyles: Record<ButtonSize, string> = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-lg',
  };

  return (
    <button
      className={`
        ${iconRadiusStyles[size]} transition-all duration-200
        inline-flex items-center justify-center
        ${variantStyles[variant]}
        ${iconSizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}