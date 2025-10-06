import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from './Button';
import { useUITranslation } from '../../hooks/useUITranslation';

interface CustomCalendarProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showTime?: boolean;
  timeIntervals?: number;
  timeStart?: string;
  timeEnd?: string;
  label?: string;
  required?: boolean;
  floating?: boolean;
  error?: boolean;
  warning?: boolean;
}

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 50; i <= currentYear + 50; i++) {
    years.push(i);
  }
  return years;
};

const generateTimeOptions = (intervals: number = 15, startTime: string = '00:00', endTime: string = '23:59') => {
  const times = [];

  // Converter timeStart e timeEnd para minutos
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  // Gerar opções baseadas no intervalo
  for (let totalMinutes = startMinutes; totalMinutes <= endMinutes; totalMinutes += intervals) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Garantir que não ultrapasse 23:59
    if (hours > 23) break;

    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    times.push(timeString);
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
  timeStart = '00:00',
  timeEnd = '23:59',
  label,
  required = false,
  floating = true,
  error = false,
  warning = false
}) => {
  const uiTranslations = useUITranslation();

  // Fallback values for months and days
  const monthNames = uiTranslations?.calendar?.months || [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = uiTranslations?.calendar?.days || ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value?.getMonth() ?? new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(value?.getFullYear() ?? new Date().getFullYear());
  const [selectedTime, setSelectedTime] = useState(
    value ? `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}` : '09:00'
  );
  const [inputValue, setInputValue] = useState('');

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

  // Sincronizar selectedTime quando value muda
  useEffect(() => {
    if (value && showTime) {
      const timeString = `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`;
      setSelectedTime(timeString);
    }
  }, [value, showTime]);

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

  const timeOptions = showTime ? generateTimeOptions(timeIntervals, timeStart, timeEnd) : [];

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
          value={isFocused ? inputValue : formatDisplayValue(value)}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            let newInputValue = e.target.value;

            // Aplicar máscara de data/datetime conforme o usuário digita
            if (showTime) {
              // Máscara para datetime: DD/MM/AAAA HH:MM (máximo 12 dígitos)
              const cleaned = newInputValue.replace(/\D/g, '').slice(0, 12);

              if (cleaned.length <= 2) {
                newInputValue = cleaned;
              } else if (cleaned.length <= 4) {
                newInputValue = cleaned.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
              } else if (cleaned.length <= 8) {
                newInputValue = cleaned.replace(/^(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
              } else if (cleaned.length === 9) {
                // Primeiro dígito da hora
                const firstHour = parseInt(cleaned.substring(8, 9));
                if (firstHour > 2) {
                  newInputValue = cleaned.replace(/^(\d{2})(\d{2})(\d{4})(\d)/, '$1/$2/$3 0$4:');
                } else {
                  newInputValue = cleaned.replace(/^(\d{2})(\d{2})(\d{4})(\d)/, '$1/$2/$3 $4');
                }
              } else if (cleaned.length === 10) {
                // Dois dígitos da hora
                const hours = parseInt(cleaned.substring(8, 10));
                if (hours > 23) {
                  newInputValue = cleaned.replace(/^(\d{2})(\d{2})(\d{4})(\d{2})/, '$1/$2/$3 23:');
                } else {
                  newInputValue = cleaned.replace(/^(\d{2})(\d{2})(\d{4})(\d{2})/, '$1/$2/$3 $4');
                }
              } else if (cleaned.length === 11) {
                // Primeiro dígito dos minutos
                const hours = cleaned.substring(8, 10);
                const firstMinute = parseInt(cleaned.substring(10, 11));

                let validHours = Math.min(parseInt(hours) || 0, 23).toString().padStart(2, '0');
                let validFirstMinute = firstMinute;
                if (firstMinute > 5) validFirstMinute = 5;

                newInputValue = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}/${cleaned.substring(4, 8)} ${validHours}:${validFirstMinute}`;
              } else {
                // Hora e minutos completos
                const hours = cleaned.substring(8, 10);
                const minutes = cleaned.substring(10, 12);

                const validHours = Math.min(parseInt(hours) || 0, 23).toString().padStart(2, '0');
                const validMinutes = Math.min(parseInt(minutes) || 0, 59).toString().padStart(2, '0');

                newInputValue = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}/${cleaned.substring(4, 8)} ${validHours}:${validMinutes}`;
              }
            } else {
              // Máscara para date: DD/MM/AAAA (máximo 8 dígitos)
              const cleaned = newInputValue.replace(/\D/g, '').slice(0, 8);

              if (cleaned.length === 1) {
                // Primeiro dígito do dia
                const firstDay = parseInt(cleaned);
                if (firstDay > 3) {
                  newInputValue = '0' + cleaned + '/';
                } else {
                  newInputValue = cleaned;
                }
              } else if (cleaned.length === 2) {
                // Dois dígitos do dia
                const day = parseInt(cleaned);
                if (day > 31) {
                  newInputValue = '31/';
                } else if (day === 0) {
                  newInputValue = '01/';
                } else {
                  newInputValue = cleaned;
                }
              } else if (cleaned.length === 3) {
                // Primeiro dígito do mês
                const day = cleaned.substring(0, 2);
                const firstMonth = parseInt(cleaned.substring(2, 3));

                let validDay = Math.min(Math.max(parseInt(day), 1), 31).toString().padStart(2, '0');

                if (firstMonth > 1) {
                  newInputValue = `${validDay}/0${firstMonth}/`;
                } else {
                  newInputValue = `${validDay}/${firstMonth}`;
                }
              } else if (cleaned.length === 4) {
                // Dois dígitos do mês
                const day = cleaned.substring(0, 2);
                const month = cleaned.substring(2, 4);

                let validDay = Math.min(Math.max(parseInt(day), 1), 31).toString().padStart(2, '0');
                let validMonth = Math.min(Math.max(parseInt(month), 1), 12).toString().padStart(2, '0');

                newInputValue = `${validDay}/${validMonth}`;
              } else {
                // Com ano
                const day = cleaned.substring(0, 2);
                const month = cleaned.substring(2, 4);
                const year = cleaned.substring(4, 8);

                let validDay = Math.min(Math.max(parseInt(day), 1), 31).toString().padStart(2, '0');
                let validMonth = Math.min(Math.max(parseInt(month), 1), 12).toString().padStart(2, '0');

                newInputValue = `${validDay}/${validMonth}/${year}`;
              }
            }

            setInputValue(newInputValue);

            // Tentar parsear a data digitada apenas quando estiver completa
            if (showTime) {
              // Para datetime: DD/MM/AAAA HH:MM
              const match = newInputValue.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/);
              if (match) {
                const [, day, month, year, hour, minute] = match;
                const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
                if (!isNaN(newDate.getTime()) &&
                    parseInt(day) >= 1 && parseInt(day) <= 31 &&
                    parseInt(month) >= 1 && parseInt(month) <= 12 &&
                    parseInt(hour) >= 0 && parseInt(hour) <= 23 &&
                    parseInt(minute) >= 0 && parseInt(minute) <= 59) {
                  onChange?.(newDate);
                }
              }
            } else {
              // Para date: DD/MM/AAAA
              const match = newInputValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
              if (match) {
                const [, day, month, year] = match;
                const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                if (!isNaN(newDate.getTime()) &&
                    parseInt(day) >= 1 && parseInt(day) <= 31 &&
                    parseInt(month) >= 1 && parseInt(month) <= 12) {
                  onChange?.(newDate);
                }
              }
            }
          }}
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              setIsFocused(true);
            }
          }}
          onFocus={() => {
            setIsFocused(true);
            setInputValue(formatDisplayValue(value));
          }}
          onBlur={() => {
            setIsFocused(false);
            setInputValue('');
          }}
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
                  onChange={(e) => {
                    e.stopPropagation();
                    handleTimeChange(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
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
              className="px-3 py-1 text-sm text-krooa-dark hover:text-blue-900 transition-colors font-medium"
            >
              Hoje
            </button>

            {showTime && (
              <Button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsFocused(false);
                }}
                variant="primary"
                size="sm"
              >
                OK
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};