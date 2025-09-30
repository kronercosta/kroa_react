import React, { useState, useRef, useEffect } from 'react';

interface Option {
  id: string;
  name: string;
}

interface MultiSelectProps {
  placeholder: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
}

export function MultiSelect({ placeholder, options, value, onChange, multiple = false }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (optionId: string) => {
    if (multiple) {
      const newValue = value.includes(optionId)
        ? value.filter(id => id !== optionId)
        : [...value, optionId];
      onChange(newValue);
    } else {
      onChange([optionId]);
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const option = options.find(opt => opt.id === value[0]);
      return option?.name || placeholder;
    }
    return `${value.length} selecionados`;
  };

  return (
    <div className="relative" ref={selectRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-krooa-green focus:ring-2 focus:ring-krooa-green/20 hover:border-krooa-green transition-colors bg-white min-w-[140px]"
      >
        <span className="truncate">{getDisplayText()}</span>
        <svg
          className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${
                value.includes(option.id) ? 'bg-krooa-green/10 text-krooa-dark font-medium' : 'text-gray-700'
              }`}
            >
              {multiple && (
                <div className={`w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center ${
                  value.includes(option.id) ? 'bg-krooa-green border-krooa-green' : ''
                }`}>
                  {value.includes(option.id) && (
                    <svg className="w-3 h-3 text-krooa-dark" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
              <span className="truncate">{option.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}