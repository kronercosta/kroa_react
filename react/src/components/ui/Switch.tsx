import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, disabled = false }: SwitchProps) {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`
            block w-10 h-6 rounded-full transition-colors
            ${checked ? 'bg-krooa-green' : 'bg-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        <div
          className={`
            absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform
            ${checked ? 'transform translate-x-4' : ''}
          `}
        />
      </div>
      {label && (
        <span className="ml-3 text-sm text-gray-700">
          {label}
        </span>
      )}
    </label>
  );
}