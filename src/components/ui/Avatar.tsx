import React from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg'
};

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  fallbackIcon
}: AvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={`
          ${sizeStyles[size]}
          rounded-full object-cover
          ${className}
        `}
      />
    );
  }

  if (fallbackIcon) {
    return (
      <div
        className={`
          ${sizeStyles[size]}
          rounded-full bg-gray-200 flex items-center justify-center
          ${className}
        `}
      >
        {fallbackIcon}
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizeStyles[size]}
        rounded-full bg-krooa-green/20 flex items-center justify-center
        ${className}
      `}
    >
      <span className="text-krooa-dark font-semibold">
        {name ? getInitials(name) : '?'}
      </span>
    </div>
  );
}

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({
  children,
  max = 3,
  size = 'md',
  className = ''
}: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visibleChildren.map((child, index) => (
        <div key={index} className="relative z-0 hover:z-10 transition-all">
          {React.cloneElement(child as React.ReactElement<AvatarProps>, { size })}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`
            ${sizeStyles[size]}
            rounded-full bg-gray-300 flex items-center justify-center
            relative z-0 hover:z-10 transition-all
            text-gray-700 font-medium
          `}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}