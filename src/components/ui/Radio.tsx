import React from 'react';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Radio({
  label,
  error,
  className = '',
  ...props
}: RadioProps) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="radio"
          className={`
            w-4 h-4 text-krooa-dark border-gray-300
            focus:ring-2 focus:ring-krooa-green/20 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-300' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-3">
          <label className="text-sm text-gray-700 cursor-pointer">
            {label}
          </label>
          {error && (
            <p className="mt-1 text-xs text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}