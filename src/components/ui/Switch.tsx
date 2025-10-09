interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function Switch({ checked, onChange, label, disabled = false, size = 'md' }: SwitchProps) {
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
            block rounded-full transition-colors
            ${size === 'sm' ? 'w-8 h-5' : 'w-10 h-6'}
            ${checked ? 'bg-krooa-green' : 'bg-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        <div
          className={`
            absolute left-0.5 top-0.5 bg-white rounded-full transition-transform
            ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
            ${checked ? (size === 'sm' ? 'transform translate-x-3' : 'transform translate-x-4') : ''}
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