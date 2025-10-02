import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function DateInput({
  label,
  value,
  onChange,
  placeholder = "DD/MM/AAAA",
  disabled = false,
  required = false
}: DateInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [displayValue, setDisplayValue] = useState(value ? formatDateForDisplay(value) : '');
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const formatDate = formatDateForDisplay;

  const applyDateMask = (inputValue: string): string => {
    // Remove tudo que não é número
    let cleaned = inputValue.replace(/\D/g, '');

    // Limita a 8 dígitos (DDMMAAAA)
    if (cleaned.length > 8) {
      cleaned = cleaned.substring(0, 8);
    }

    // Aplica a máscara DD/MM/AAAA
    if (cleaned.length >= 5) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}/${cleaned.substring(4)}`;
    } else if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
    }
    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyDateMask(e.target.value);
    setDisplayValue(maskedValue);

    // Se a data estiver completa (DD/MM/AAAA), valida e atualiza
    if (maskedValue.length === 10) {
      const [day, month, year] = maskedValue.split('/');
      const dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const date = new Date(dateString);

      // Verifica se é uma data válida
      if (!isNaN(date.getTime()) &&
          date.getDate() == parseInt(day) &&
          date.getMonth() + 1 == parseInt(month) &&
          date.getFullYear() == parseInt(year)) {
        setSelectedDate(date);
        setCurrentMonth(date);

        // Cria evento sintético para onChange
        const syntheticEvent = {
          target: { value: dateString, name: 'date' },
          currentTarget: { value: dateString, name: 'date' }
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
      }
    }
  };

  const handleCalendarClick = () => {
    if (!disabled) {
      setIsCalendarOpen(!isCalendarOpen);
      if (!selectedDate && value) {
        setSelectedDate(new Date(value));
        setCurrentMonth(new Date(value));
      } else if (!selectedDate) {
        setCurrentMonth(new Date());
      }
    }
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);

    // Format as YYYY-MM-DD for the input value
    const formattedDate = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Update display value with DD/MM/YYYY format
    setDisplayValue(formatDateForDisplay(formattedDate));

    // Create a synthetic event
    const syntheticEvent = {
      target: {
        value: formattedDate,
        name: 'date'
      },
      currentTarget: {
        value: formattedDate,
        name: 'date'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
    setIsCalendarOpen(false);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
           currentMonth.getMonth() === today.getMonth() &&
           currentMonth.getFullYear() === today.getFullYear();
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() &&
           currentMonth.getMonth() === selectedDate.getMonth() &&
           currentMonth.getFullYear() === selectedDate.getFullYear();
  };

  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  // Update displayValue when value prop changes
  useEffect(() => {
    if (value) {
      setDisplayValue(formatDateForDisplay(value));
      setSelectedDate(new Date(value));
    } else {
      setDisplayValue('');
      setSelectedDate(null);
    }
  }, [value]);

  return (
    <div className="relative" ref={calendarRef}>
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={10}
        className={`
          w-full px-3 py-2 h-10 pr-10 border rounded-lg transition-colors
          ${disabled
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300'
            : 'bg-white border-gray-300 hover:border-gray-400'
          }
          ${isFocused || isCalendarOpen ? 'outline-none ring-2 ring-krooa-green/20 border-krooa-green focus:ring-2 focus:ring-krooa-green/20 focus:border-krooa-green' : ''}
        `}
      />

      <label className={`
        absolute left-3 bg-white px-1 text-xs transition-all duration-200 pointer-events-none
        ${displayValue || isFocused || isCalendarOpen ? '-top-2 text-gray-600' : 'top-1/2 -translate-y-1/2 text-gray-500'}
      `}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* Calendar icon - clickable */}
      <button
        type="button"
        onClick={handleCalendarClick}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Custom Calendar Dropdown */}
      {isCalendarOpen && (
        <div className="absolute z-50 mt-1 bg-gray-50 border border-gray-200 rounded-lg shadow-xl p-3" style={{ minWidth: '300px' }}>
          {/* Month/Year Navigation */}
          <div className="flex items-center justify-between mb-3 gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-2 flex-1 justify-center">
              <span className="font-medium">{monthNames[currentMonth.getMonth()]}</span>
              <select
                value={currentMonth.getFullYear()}
                onChange={(e) => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setFullYear(parseInt(e.target.value));
                  setCurrentMonth(newMonth);
                }}
                className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-krooa-green bg-white cursor-pointer"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', paddingRight: '24px', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.25rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25rem' }}
              >
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - 50 + i;
                  return (
                    <option key={year} value={year}>{year}</option>
                  );
                })}
              </select>
            </div>

            <button
              onClick={() => changeMonth(1)}
              className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-600 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth(currentMonth) }, (_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth(currentMonth) }, (_, i) => {
              const day = i + 1;
              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className={`
                    p-2 text-sm rounded transition-colors
                    ${isSelected(day)
                      ? 'bg-krooa-green text-krooa-dark font-medium'
                      : isToday(day)
                      ? 'bg-gray-200 text-gray-900 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                  type="button"
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}