import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  fullWidth?: boolean;
  floating?: boolean;
}

export function Select({
  label,
  options,
  error,
  fullWidth = false,
  floating = true, // Mudando o padrão para true
  className = '',
  value,
  ...props
}: SelectProps) {
  const hasValue = value && value !== '';

  if (floating && label) {
    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        <div className="relative">
          <select
            value={value}
            className={`
              peer w-full h-10 rounded-lg border border-gray-300 px-3 py-2 pr-8
              focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
              disabled:bg-gray-50 disabled:text-gray-500
              appearance-none
              ${error ? 'border-red-300' : ''}
              ${className}
            `}
            {...props}
          >
            <option value="" disabled hidden></option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Seta customizada */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <label
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none
              ${hasValue
                ? 'top-0 -translate-y-1/2 text-xs bg-white px-1 text-gray-600'
                : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
              }
              peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-gray-600
              ${error ? 'text-red-500' : ''}
            `}
          >
            {label}
          </label>
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        value={value}
        className={`
          w-full rounded-xl border border-gray-300 px-4 py-2.5
          focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-300' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}