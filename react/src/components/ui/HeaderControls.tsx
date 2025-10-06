import { useState, useEffect, useRef } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { useRegion } from '../../contexts/RegionContext';
import { useGlobalLanguage } from '../../hooks/useGlobalLanguage';
import { useUITranslation } from '../../hooks/useUITranslation';

export function HeaderControls() {
  const { currentLanguage, changeLanguage } = useGlobalLanguage();
  const uiTranslations = useUITranslation();

  const [selectedTimezone, setSelectedTimezone] = useState('São Paulo - Brasília');
  const [currentTime, setCurrentTime] = useState('--:--');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [timezoneDropdownOpen, setTimezoneDropdownOpen] = useState(false);

  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const timezoneDropdownRef = useRef<HTMLDivElement>(null);

  const timezones = [
    { name: 'Fernando de Noronha', code: 'UTC-02:00' },
    { name: 'São Paulo - Brasília', code: 'UTC-03:00' },
    { name: 'Fortaleza - Salvador', code: 'UTC-03:00' },
    { name: 'Recife - Natal', code: 'UTC-03:00' },
    { name: 'Manaus', code: 'UTC-04:00' },
    { name: 'Rio Branco', code: 'UTC-05:00' }
  ];

  const languages = [
    { code: 'PT', name: uiTranslations?.headerControls?.languages?.PT || 'Português', flag: '🇧🇷' },
    { code: 'EN', name: uiTranslations?.headerControls?.languages?.EN || 'English', flag: '🇺🇸' },
    { code: 'ES', name: uiTranslations?.headerControls?.languages?.ES || 'Español', flag: '🇪🇸' }
  ];

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
      if (timezoneDropdownRef.current && !timezoneDropdownRef.current.contains(event.target as Node)) {
        setTimezoneDropdownOpen(false);
      }
    }

    if (languageDropdownOpen || timezoneDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [languageDropdownOpen, timezoneDropdownOpen]);

  const handleLanguageChange = (newLanguage: 'PT' | 'EN' | 'ES') => {
    if (newLanguage !== currentLanguage) {
      changeLanguage(newLanguage);
      setLanguageDropdownOpen(false);
      // Refresh da página para aplicar as traduções
      window.location.reload();
    }
  };

  return (
    <>
      {/* Timezone selector */}
      <div className="relative flex-1 sm:flex-initial" ref={timezoneDropdownRef}>
        <button
          onClick={() => setTimezoneDropdownOpen(!timezoneDropdownOpen)}
          className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs sm:text-sm font-medium h-[34px] w-full sm:w-auto"
          title={uiTranslations?.headerControls?.changeTimezone || 'Alterar fuso horário'}
        >
          <Clock className="w-4 h-4" />
          <span>{currentTime}</span>
          <span className="text-xs text-gray-600 hidden sm:inline">
            {timezones.find(tz => tz.name === selectedTimezone)?.code || 'SP/BR'}
          </span>
          <ChevronDown className={`w-3 h-3 transition-transform ${timezoneDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {timezoneDropdownOpen && (
          <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
            <div className="px-3 py-2 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-600">{uiTranslations?.headerControls?.timezoneTitle || 'Fuso Horário'}</h3>
              <p className="text-xs text-gray-500 mt-1">{uiTranslations?.headerControls?.timezoneDescription || 'Selecione o fuso horário da clínica'}</p>
            </div>
            {timezones.map((timezone) => (
              <button
                key={timezone.name}
                onClick={() => {
                  setSelectedTimezone(timezone.name);
                  setTimezoneDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center justify-between ${
                  selectedTimezone === timezone.name
                    ? 'bg-krooa-green/10 text-krooa-dark font-medium'
                    : 'text-gray-700'
                }`}
              >
                <span>{timezone.name}</span>
                <span className="text-xs text-gray-500">{timezone.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Language selector */}
      <div className="relative flex-1 sm:flex-initial" ref={languageDropdownRef}>
        <button
          onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
          className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs sm:text-sm font-medium h-[34px] w-full sm:w-auto"
          title={uiTranslations?.headerControls?.changeLanguage || 'Alterar idioma'}
        >
          <span className="text-base">{languages.find(l => l.code === currentLanguage)?.flag}</span>
          <span className="hidden sm:inline">{currentLanguage}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {languageDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-3 py-2 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-600">{uiTranslations?.headerControls?.languageTitle || 'Idioma'}</h3>
              <p className="text-xs text-gray-500 mt-1">{uiTranslations?.headerControls?.languageDescription || 'Selecione o idioma'}</p>
            </div>
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code as 'PT' | 'EN' | 'ES')}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 ${
                  currentLanguage === language.code
                    ? 'bg-krooa-green/10 text-krooa-dark font-medium'
                    : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
                {currentLanguage === language.code && (
                  <span className="ml-auto text-krooa-green text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
