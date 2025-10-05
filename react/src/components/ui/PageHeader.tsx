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
    <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-krooa-dark">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1 hidden sm:block">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
