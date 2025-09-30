import React, { useState } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  floating?: boolean;
}

export function TextArea({
  label,
  error,
  fullWidth = false,
  floating = true, // Mudando o padrão para true
  className = '',
  value,
  onFocus,
  onBlur,
  ...props
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && String(value).length > 0;

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // TextArea com floating label
  if (floating && label) {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        <div className="relative">
          <textarea
            className={`
              peer w-full rounded-lg border border-gray-300 px-3 pt-5 pb-2
              focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
              disabled:bg-gray-50 disabled:text-gray-500
              resize-y min-h-[100px]
              ${error ? 'border-red-300' : ''}
              ${className}
            `}
            placeholder=" "
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          <label
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none
              ${hasValue || isFocused
                ? 'top-1 text-xs text-gray-600'
                : 'top-3 text-sm text-gray-500'
              }
              peer-focus:top-1 peer-focus:text-xs peer-focus:text-gray-600
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

  // TextArea tradicional
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full rounded-xl border border-gray-300 px-4 py-2.5
          focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
          disabled:bg-gray-50 disabled:text-gray-500
          resize-y min-h-[100px]
          ${error ? 'border-red-300' : ''}
          ${className}
        `}
        value={value}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}