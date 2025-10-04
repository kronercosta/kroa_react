import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CustomCalendarProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showTime?: boolean;
  timeIntervals?: number;
  label?: string;
  required?: boolean;
  floating?: boolean;
  error?: boolean;
  warning?: boolean;
}

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 50; i <= currentYear + 50; i++) {
    years.push(i);
  }
  return years;
};

const generateTimeOptions = (intervals: number = 15) => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += intervals) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }
  return times;
};

export const CustomCalendar: React.FC<CustomCalendarProps> = ({
  value,
  onChange,
  placeholder = " ",
  disabled = false,
  className = "",
  showTime = false,
  timeIntervals = 15,
  label,
  required = false,
  floating = true,
  error = false,
  warning = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value?.getMonth() ?? new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(value?.getFullYear() ?? new Date().getFullYear());
  const [selectedTime, setSelectedTime] = useState(
    value ? `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}` : '09:00'
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasValue = value !== null && value !== undefined;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayValue = (date: Date | null): string => {
    if (!date) return '';

    if (showTime) {
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return date.toLocaleDateString('pt-BR');
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day: number) => {
    let newDate = new Date(currentYear, currentMonth, day);

    if (showTime && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      newDate.setHours(hours, minutes);
    }

    onChange?.(newDate);
    if (!showTime) {
      setIsOpen(false);
      setIsFocused(false);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);

    if (value) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(value);
      newDate.setHours(hours, minutes);
      onChange?.(newDate);
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    return (
      day === value.getDate() &&
      currentMonth === value.getMonth() &&
      currentYear === value.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(day)}
          className={`
            p-2 text-sm rounded-lg transition-all duration-200 font-medium min-h-[36px] flex items-center justify-center
            ${isSelected(day)
              ? 'bg-gradient-to-br from-krooa-green to-krooa-dark text-white shadow-lg scale-110 ring-2 ring-krooa-green/30 font-bold'
              : isToday(day)
                ? 'bg-krooa-green/15 text-krooa-dark border-2 border-krooa-green/60 font-semibold'
                : 'hover:bg-krooa-green/10 text-gray-700 hover:text-krooa-dark hover:scale-105'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const timeOptions = showTime ? generateTimeOptions(timeIntervals) : [];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && !floating && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={formatDisplayValue(value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              setIsFocused(true);
            }
          }}
          onFocus={() => setIsFocused(true)}
          className={`
            peer w-full h-10 rounded-lg border px-3 py-2 pr-10 text-gray-900 cursor-pointer
            placeholder-transparent
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' :
              warning ? 'border-orange-400 focus:border-orange-500 focus:ring-orange-500/20' :
              'border-gray-300 focus:border-krooa-green focus:ring-krooa-green/20'}
            focus:outline-none focus:ring-2
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `}
        />

        {/* Ícone de calendário */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <Calendar className="w-4 h-4" />
        </div>

        {/* Label flutuante */}
        {label && floating && (
          <label className={`
            absolute left-3 transition-all duration-200 pointer-events-none px-1
            ${disabled ? 'bg-gray-50' : 'bg-white'}
            ${(isFocused || hasValue)
              ? 'top-0 -translate-y-1/2 text-xs'
              : 'top-1/2 -translate-y-1/2 text-sm'
            }
            ${isFocused
              ? 'text-blue-900'
              : error
                ? 'text-red-500'
                : warning
                  ? 'text-orange-500'
                  : 'text-gray-500'
            }
            peer-disabled:text-gray-400
          `}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl" style={{ minWidth: '300px' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <button
              type="button"
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex items-center gap-2 flex-1 justify-center">
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                className="pl-2 pr-6 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-krooa-green bg-white cursor-pointer font-medium text-krooa-dark min-w-[90px]"
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>{month.substring(0, 3)}</option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="pl-2 pr-6 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-krooa-green bg-white cursor-pointer font-medium text-krooa-dark"
              >
                {generateYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 p-2 bg-gray-50/50">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 p-2">
            {renderCalendarDays()}
          </div>

          {/* Time selector */}
          {showTime && (
            <div className="border-t border-gray-100 p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Hora:</span>
                <select
                  value={selectedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-krooa-green bg-white"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center p-3 border-t border-gray-100 bg-gray-50/50">
            <button
              type="button"
              onClick={() => {
                onChange?.(null);
                setIsOpen(false);
                setIsFocused(false);
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpar
            </button>

            <button
              type="button"
              onClick={() => {
                const today = new Date();
                if (showTime) {
                  const [hours, minutes] = selectedTime.split(':').map(Number);
                  today.setHours(hours, minutes);
                }
                onChange?.(today);
                setCurrentMonth(today.getMonth());
                setCurrentYear(today.getFullYear());
              }}
              className="px-3 py-1 text-sm text-krooa-green hover:text-krooa-dark transition-colors font-medium"
            >
              Hoje
            </button>

            {showTime && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsFocused(false);
                }}
                className="px-4 py-2 bg-krooa-green text-white rounded-lg text-sm font-medium hover:bg-krooa-dark transition-colors"
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};