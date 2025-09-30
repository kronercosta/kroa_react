import React, { useState, useRef, useEffect } from 'react';

interface TimeInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  fullWidth?: boolean;
  floating?: boolean;
  className?: string;
}

export function TimeInput({
  label,
  value,
  onChange,
  error,
  fullWidth = false,
  floating = true, // Mudando o padrão para true
  className = ''
}: TimeInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Gerar opções de tempo de meia em meia hora
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(time);
    }
  }

  // Encontrar índice de 08:00 para scroll inicial
  const defaultTimeIndex = timeOptions.findIndex(t => t === '08:00');

  // Máscara de tempo
  const handleTimeMask = (inputValue: string): string => {
    let cleaned = inputValue.replace(/\D/g, '');
    if (cleaned.length > 4) {
      cleaned = cleaned.substring(0, 4);
    }
    if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}:${cleaned.substring(2)}`;
    }
    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = handleTimeMask(e.target.value);
    onChange(maskedValue);
  };

  const handleTimeSelect = (time: string) => {
    onChange(time);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll para 08:00 quando abrir
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const timeElement = dropdownRef.current.querySelector(`[data-time="${value || '08:00'}"]`);
      if (timeElement) {
        timeElement.scrollIntoView({ block: 'center' });
      } else if (defaultTimeIndex >= 0) {
        const defaultElement = dropdownRef.current.children[defaultTimeIndex];
        if (defaultElement) {
          defaultElement.scrollIntoView({ block: 'center' });
        }
      }
    }
  }, [isOpen, value, defaultTimeIndex]);

  // Filtrar opções baseado no valor digitado
  const filteredOptions = value
    ? timeOptions.filter(time => time.startsWith(value))
    : timeOptions;

  const hasValue = value && value.length > 0;

  if (floating && label) {
    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              setIsOpen(true);
            }}
            onBlur={() => setIsFocused(false)}
            className={`
              peer w-full h-10 rounded-lg border border-gray-300 px-3 py-2 pr-8
              focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
              disabled:bg-gray-50 disabled:text-gray-500
              ${error ? 'border-red-300' : ''}
              ${className}
            `}
            placeholder=" "
            maxLength={5}
          />

          <label
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none
              ${hasValue || isFocused
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

          {/* Botão dropdown */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown de horários */}
          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              {filteredOptions.map((time) => (
                <button
                  key={time}
                  type="button"
                  data-time={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`
                    w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors
                    ${value === time ? 'bg-krooa-green/10 text-krooa-green font-medium' : 'text-gray-700'}
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  // Versão sem floating label
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className={`
            w-full rounded-xl border border-gray-300 px-4 py-2.5 pr-10
            focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-red-300' : ''}
            ${className}
          `}
          placeholder="00:00"
          maxLength={5}
        />

        {/* Botão dropdown */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown de horários */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            {filteredOptions.map((time) => (
              <button
                key={time}
                type="button"
                data-time={time}
                onClick={() => handleTimeSelect(time)}
                className={`
                  w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors
                  ${value === time ? 'bg-krooa-green/10 text-krooa-green font-medium' : 'text-gray-700'}
                `}
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Versão compacta
export function CompactTimeInput(props: TimeInputProps) {
  return <TimeInput {...props} floating={true} fullWidth={true} />;
}