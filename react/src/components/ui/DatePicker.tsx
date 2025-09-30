import React from 'react';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  floating?: boolean;
}

export function DatePicker({
  label,
  error,
  fullWidth = false,
  floating = true, // Mudando o padrão para true
  className = '',
  value,
  ...props
}: DatePickerProps) {
  const hasValue = value && value !== '';

  if (floating && label) {
    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        <div className="relative">
          <input
            type="date"
            value={value}
            className={`
              peer w-full h-10 rounded-lg border border-gray-300 px-3 py-2
              focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
              disabled:bg-gray-50 disabled:text-gray-500
              ${error ? 'border-red-300' : ''}
              ${className}
            `}
            placeholder=" "
            {...props}
          />

          <label
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none
              ${hasValue
                ? 'top-0 -translate-y-1/2 text-xs bg-white px-1 text-gray-600'
                : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
              }
              peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-gray-600
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
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
      <input
        type="date"
        value={value}
        className={`
          w-full rounded-xl border border-gray-300 px-4 py-2.5
          focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-300' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}