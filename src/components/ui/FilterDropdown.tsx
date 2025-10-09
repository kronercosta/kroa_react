import React, { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useUITranslation } from '../../hooks/useUITranslation';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface FilterDropdownProps {
  options: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  buttonClassName?: string;
  dropdownClassName?: string;
  showIcon?: boolean;
  showCount?: boolean;
  label?: string;
}

export function FilterDropdown({
  options,
  activeFilter,
  onFilterChange,
  buttonClassName = '',
  dropdownClassName = '',
  showIcon = true,
  showCount = true,
  label
}: FilterDropdownProps) {
  const uiTranslations = useUITranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activeOption = options.find(opt => opt.id === activeFilter);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600
          flex items-center gap-2
          ${buttonClassName}
        `}
        title={label || uiTranslations?.filter?.filter || "Filtrar"}
      >
        {showIcon && <Filter className="w-4 h-4" />}
        {label && <span className="text-sm font-medium">{label}</span>}
        {activeOption && activeOption.id !== 'todos' && (
          <span className="text-xs bg-krooa-green/20 text-krooa-dark px-1.5 py-0.5 rounded-full">
            {activeOption.label}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`
            absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10
            ${dropdownClassName}
          `}
        >
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onFilterChange(option.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-2 text-sm hover:bg-gray-50
                  flex justify-between items-center transition-colors
                  ${activeFilter === option.id
                    ? 'bg-krooa-green/10 text-krooa-dark font-medium'
                    : 'text-gray-700'
                  }
                  ${options[0].id === option.id ? 'rounded-t-lg' : ''}
                  ${options[options.length - 1].id === option.id ? 'rounded-b-lg' : ''}
                `}
              >
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
                {showCount && option.count !== undefined && (
                  <span className="text-xs text-gray-500">({option.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface MultiFilterDropdownProps {
  filters: {
    id: string;
    label: string;
    options: FilterOption[];
  }[];
  activeFilters: Record<string, string>;
  onFilterChange: (filterId: string, optionId: string) => void;
  buttonClassName?: string;
  dropdownClassName?: string;
}

export function MultiFilterDropdown({
  filters,
  activeFilters,
  onFilterChange,
  buttonClassName = '',
  dropdownClassName = ''
}: MultiFilterDropdownProps) {
  const uiTranslations = useUITranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setExpandedFilter(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const hasActiveFilters = Object.values(activeFilters).some(v => v && v !== 'todos');

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600
          flex items-center gap-2
          ${buttonClassName}
        `}
        title={uiTranslations?.filter?.filters || "Filtros"}
      >
        <Filter className="w-4 h-4" />
        {hasActiveFilters && (
          <span className="w-2 h-2 bg-krooa-green rounded-full" />
        )}
      </button>

      {isOpen && (
        <div
          className={`
            absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10
            ${dropdownClassName}
          `}
        >
          <div className="py-2">
            {filters.map((filter) => (
              <div key={filter.id} className="border-b border-gray-100 last:border-b-0">
                <button
                  onClick={() => setExpandedFilter(
                    expandedFilter === filter.id ? null : filter.id
                  )}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center"
                >
                  <span className="text-sm font-medium text-gray-700">{filter.label}</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedFilter === filter.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedFilter === filter.id && (
                  <div className="px-2 pb-2">
                    {filter.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          onFilterChange(filter.id, option.id);
                        }}
                        className={`
                          w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-50
                          flex justify-between items-center
                          ${activeFilters[filter.id] === option.id
                            ? 'bg-krooa-green/10 text-krooa-dark font-medium'
                            : 'text-gray-600'
                          }
                        `}
                      >
                        <span>{option.label}</span>
                        {option.count !== undefined && (
                          <span className="text-xs text-gray-500">({option.count})</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}