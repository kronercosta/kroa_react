import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

export function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const sizes = {
    sm: { height: 32, width: 100 },
    md: { height: 40, width: 125 },
    lg: { height: 48, width: 150 },
    xl: { height: 56, width: 175 }
  };

  const currentSize = sizes[size];

  if (variant === 'text') {
    return (
      <span className={`font-bold text-krooa-dark text-${size === 'sm' ? '2xl' : size === 'md' ? '3xl' : size === 'lg' ? '4xl' : '5xl'}`}>
        krooa
      </span>
    );
  }

  return (
    <img
      src="/logo_Full_Gradient_Light.png"
      alt="Krooa"
      height={currentSize.height}
      width={variant === 'icon' ? currentSize.height : currentSize.width}
      className={`object-contain ${className}`}
    />
  );
}

export function LogoFull({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Logo size="xl" />
      <p className="text-sm text-gray-600 mt-2">Sistema de Gestão Odontológica</p>
    </div>
  );
}