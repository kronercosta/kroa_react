import React, { useState, useEffect, useRef } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { useRegion } from '../../contexts/RegionContext';

export function HeaderControls() {
  const { currentRegion, setRegion, formatCurrency } = useRegion();

  const [selectedTimezone, setSelectedTimezone] = useState('São Paulo - Brasília');
  const [currentTime, setCurrentTime] = useState('--:--');
  const [selectedLanguage, setSelectedLanguage] = useState('PT');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [timezoneDropdownOpen, setTimezoneDropdownOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);

  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const timezoneDropdownRef = useRef<HTMLDivElement>(null);
  const regionDropdownRef = useRef<HTMLDivElement>(null);

  const timezones = [
    { name: 'Fernando de Noronha', code: 'UTC-02:00' },
    { name: 'São Paulo - Brasília', code: 'UTC-03:00' },
    { name: 'Fortaleza - Salvador', code: 'UTC-03:00' },
    { name: 'Recife - Natal', code: 'UTC-03:00' },
    { name: 'Manaus', code: 'UTC-04:00' },
    { name: 'Rio Branco', code: 'UTC-05:00' }
  ];

  const languages = [
    { code: 'PT', name: 'Português', flag: '🇧🇷' },
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'ES', name: 'Español', flag: '🇪🇸' }
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
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
        setRegionDropdownOpen(false);
      }
    }

    if (languageDropdownOpen || timezoneDropdownOpen || regionDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [languageDropdownOpen, timezoneDropdownOpen, regionDropdownOpen]);

  const handleLanguageChange = (newLanguage: string) => {
    if (newLanguage !== selectedLanguage) {
      setSelectedLanguage(newLanguage);
      setLanguageDropdownOpen(false);
    }
  };

  return (
    <>
      {/* Timezone selector */}
      <div className="relative flex-1 sm:flex-initial" ref={timezoneDropdownRef}>
        <button
          onClick={() => setTimezoneDropdownOpen(!timezoneDropdownOpen)}
          className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs sm:text-sm font-medium h-[34px] w-full sm:w-auto"
          title="Alterar fuso horário"
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
              <h3 className="text-xs font-semibold text-gray-600">Fuso Horário</h3>
              <p className="text-xs text-gray-500 mt-1">Selecione o fuso horário da clínica</p>
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

      {/* Region selector */}
      <div className="relative" ref={regionDropdownRef}>
        <button
          onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
          className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs sm:text-sm font-medium h-[34px]"
          title="Alterar região"
        >
          <span className="text-base">{currentRegion === 'BR' ? '🇧🇷' : '🇺🇸'}</span>
          <span className="hidden sm:inline">{currentRegion}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${regionDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {regionDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-3 py-2 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-600">Região</h3>
              <p className="text-xs text-gray-500 mt-1">Selecione a região da clínica</p>
            </div>
            <button
              onClick={() => {
                setRegion('BR');
                setRegionDropdownOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 ${
                currentRegion === 'BR' ? 'bg-krooa-green/10 text-krooa-dark font-medium' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">🇧🇷</span>
              <div className="flex-1">
                <div>Brasil</div>
                <div className="text-xs text-gray-500">Moeda: {formatCurrency(0).split(' ')[0]}</div>
              </div>
            </button>
            <button
              onClick={() => {
                setRegion('US');
                setRegionDropdownOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 ${
                currentRegion === 'US' ? 'bg-krooa-green/10 text-krooa-dark font-medium' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">🇺🇸</span>
              <div className="flex-1">
                <div>United States</div>
                <div className="text-xs text-gray-500">Currency: {formatCurrency(0).split(' ')[0]}</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Language selector */}
      <div className="relative" ref={languageDropdownRef}>
        <button
          onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
          className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs sm:text-sm font-medium h-[34px]"
          title="Alterar idioma"
        >
          <span className="text-base">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
          <span className="hidden sm:inline">{selectedLanguage}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {languageDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-3 py-2 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-600">Idioma</h3>
              <p className="text-xs text-gray-500 mt-1">Selecione o idioma</p>
            </div>
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 ${
                  selectedLanguage === language.code
                    ? 'bg-krooa-green/10 text-krooa-dark font-medium'
                    : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
                {selectedLanguage === language.code && (
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
