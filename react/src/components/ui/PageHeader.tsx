import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  children
}: PageHeaderProps) {

  return (
    <div className="bg-white px-4 sm:px-6 py-4 border-b border-gray-200 flex-shrink-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        {/* Título e subtitle */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-krooa-dark truncate">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>

        {/* Controls - mobile friendly */}
        {children && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
