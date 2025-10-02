import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';

// Tipos expandidos de máscara
export type MaskType =
  | 'cpf' | 'cnpj' | 'phone' | 'internationalPhone' | 'cep' | 'date' | 'time'
  | 'currency' | 'percentage' | 'creditCard' | 'password' | 'addressNumber' | 'none';

export type ValidationType = 'email' | 'url' | 'number' | 'cpf' | 'cnpj' | 'phone' | 'creditCard' | 'none';

// Países com códigos e máscaras de telefone
const countries = [
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', phoneCode: '+55', mask: '(00) 00000-0000' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', phoneCode: '+1', mask: '(000) 000-0000' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', phoneCode: '+351', mask: '000 000 000' },
  { code: 'ES', name: 'Espanha', flag: '🇪🇸', phoneCode: '+34', mask: '000 00 00 00' },
  { code: 'FR', name: 'França', flag: '🇫🇷', phoneCode: '+33', mask: '0 00 00 00 00' },
  { code: 'DE', name: 'Alemanha', flag: '🇩🇪', phoneCode: '+49', mask: '000 00000000' },
  { code: 'IT', name: 'Itália', flag: '🇮🇹', phoneCode: '+39', mask: '000 000 0000' },
  { code: 'UK', name: 'Reino Unido', flag: '🇬🇧', phoneCode: '+44', mask: '0000 000000' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', phoneCode: '+54', mask: '00 0000-0000' },
  { code: 'MX', name: 'México', flag: '🇲🇽', phoneCode: '+52', mask: '00 0000 0000' },
];

// Bandeiras de cartão de crédito
const cardBrands = {
  visa: { pattern: /^4/, logo: '💳', name: 'Visa', color: 'text-blue-600' },
  mastercard: { pattern: /^5[1-5]/, logo: '💳', name: 'Mastercard', color: 'text-red-600' },
  amex: { pattern: /^3[47]/, logo: '💳', name: 'Amex', color: 'text-blue-500' },
  elo: { pattern: /^(636368|636369|438935|504175|451416|636297|5067|4576|4011)/, logo: '💳', name: 'Elo', color: 'text-yellow-600' },
  discover: { pattern: /^6(?:011|5)/, logo: '💳', name: 'Discover', color: 'text-orange-500' },
  diners: { pattern: /^3(?:0[0-5]|[68])/, logo: '💳', name: 'Diners', color: 'text-gray-700' },
};

interface UnifiedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  floating?: boolean;
  required?: boolean;

  // Máscara
  mask?: MaskType;

  // Validação
  validation?: ValidationType;

  // Callbacks
  onChange?: (value: string, isValid?: boolean, extraData?: any) => void;
  onChangeEvent?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Props específicas para funcionalidades avançadas
  defaultCountry?: string; // Para telefone internacional
  showPasswordToggle?: boolean; // Para campo de senha
  allowNoNumber?: boolean; // Para número de endereço
  noNumberText?: string; // Texto para "sem número"
}

// Detectar bandeira do cartão
const detectCardBrand = (number: string) => {
  const cleaned = number.replace(/\D/g, '');
  for (const [brand, info] of Object.entries(cardBrands)) {
    if (info.pattern.test(cleaned)) {
      return { brand, ...info };
    }
  }
  return null;
};

// Aplicar máscara de telefone internacional
const applyInternationalPhoneMask = (value: string, country: typeof countries[0]) => {
  const cleaned = value.replace(/\D/g, '');
  let masked = '';
  let digitIndex = 0;

  for (let i = 0; i < country.mask.length && digitIndex < cleaned.length; i++) {
    if (country.mask[i] === '0') {
      masked += cleaned[digitIndex];
      digitIndex++;
    } else if (country.mask[i] !== ' ' && country.mask[i] !== '-' && country.mask[i] !== '(' && country.mask[i] !== ')') {
      masked += country.mask[i];
    } else {
      masked += country.mask[i];
    }
  }

  return masked;
};

// Funções de máscara
const applyMask = (value: string, mask: MaskType, extraData?: any): string => {
  const cleaned = value.replace(/\D/g, '');

  switch (mask) {
    case 'cpf':
      return cleaned
        .slice(0, 11)
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2');

    case 'cnpj':
      return cleaned
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');

    case 'phone':
      if (cleaned.length <= 10) {
        return cleaned
          .replace(/^(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      }
      return cleaned
        .slice(0, 11)
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');

    case 'internationalPhone':
      if (extraData?.country) {
        return applyInternationalPhoneMask(value, extraData.country);
      }
      return value;

    case 'cep':
      return cleaned
        .slice(0, 8)
        .replace(/^(\d{5})(\d)/, '$1-$2');

    case 'date':
      return cleaned
        .slice(0, 8)
        .replace(/^(\d{2})(\d)/, '$1/$2')
        .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');

    case 'time':
      return cleaned
        .slice(0, 4)
        .replace(/^(\d{2})(\d)/, '$1:$2');

    case 'currency':
      const numericValue = cleaned.replace(/\D/g, '');
      const floatValue = parseFloat(numericValue) / 100;
      if (isNaN(floatValue)) return 'R$ 0,00';
      return floatValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

    case 'percentage':
      const percentValue = value.replace(/[^\d,]/g, '').replace(',', '.');
      const numValue = parseFloat(percentValue);
      if (isNaN(numValue)) return '';
      return Math.min(100, numValue).toString().replace('.', ',') + '%';

    case 'creditCard':
      return cleaned
        .slice(0, 16)
        .replace(/(\d{4})(?=\d)/g, '$1 ');

    case 'addressNumber':
      if (extraData?.noNumber) return 'S/N';
      return value.replace(/\D/g, '');

    default:
      return value;
  }
};

// Funções de validação
const validateValue = (value: string, validation: ValidationType): boolean => {
  const cleaned = value.replace(/\D/g, '');

  switch (validation) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);

    case 'url':
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }

    case 'number':
      return !isNaN(Number(value));

    case 'cpf':
      if (cleaned.length !== 11) return false;
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned[i]) * (10 - i);
      }
      let digit = 11 - (sum % 11);
      if (digit > 9) digit = 0;
      if (parseInt(cleaned[9]) !== digit) return false;

      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned[i]) * (11 - i);
      }
      digit = 11 - (sum % 11);
      if (digit > 9) digit = 0;
      return parseInt(cleaned[10]) === digit;

    case 'cnpj':
      return cleaned.length === 14;

    case 'phone':
      return cleaned.length === 10 || cleaned.length === 11;

    case 'creditCard':
      return cleaned.length >= 13 && cleaned.length <= 19;

    default:
      return true;
  }
};

export const UnifiedInput = forwardRef<HTMLInputElement, UnifiedInputProps>(({
  label,
  error,
  fullWidth = false,
  icon,
  floating = true,
  className = '',
  required = false,
  mask = 'none',
  validation = 'none',
  onChange,
  onChangeEvent,
  value,
  disabled = false,
  placeholder,
  type = 'text',
  defaultCountry = 'BR',
  showPasswordToggle = true,
  allowNoNumber = false,
  noNumberText = 'Sem número',
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = React.useState(value || '');
  const [isFocused, setIsFocused] = React.useState(false);
  const [isValid, setIsValid] = React.useState(true);

  // Estados específicos para funcionalidades avançadas
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find(c => c.code === defaultCountry) || countries[0]
  );
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [cardBrand, setCardBrand] = useState<any>(null);
  const [isNoNumber, setIsNoNumber] = useState(false);

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const displayValue = typeof value !== 'undefined' ? value : internalValue;
  const hasValue = displayValue && displayValue !== '' && displayValue !== 'S/N';

  // Detectar bandeira do cartão
  useEffect(() => {
    if (mask === 'creditCard' && displayValue) {
      const brand = detectCardBrand(displayValue as string);
      setCardBrand(brand);
    }
  }, [mask, displayValue]);

  // Fechar dropdown de país ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Aplicar máscara
    if (mask !== 'none' && mask !== 'password') {
      const extraData: any = {};
      if (mask === 'internationalPhone') {
        extraData.country = selectedCountry;
      }
      if (mask === 'addressNumber') {
        extraData.noNumber = isNoNumber;
      }
      newValue = applyMask(newValue, mask, extraData);
    }

    // Validar
    let valid = true;
    if (validation !== 'none' && newValue) {
      valid = validateValue(newValue, validation);
      setIsValid(valid);
    }

    setInternalValue(newValue);

    // Callback com dados extras
    const extraData: any = {};
    if (mask === 'internationalPhone') {
      extraData.country = selectedCountry;
      extraData.fullNumber = `${selectedCountry.phoneCode} ${newValue}`;
    }
    if (mask === 'creditCard' && cardBrand) {
      extraData.brand = cardBrand.brand;
    }
    if (mask === 'addressNumber') {
      extraData.noNumber = isNoNumber;
    }

    // Criar evento sintético para compatibilidade
    if (onChangeEvent) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: newValue
        }
      };
      onChangeEvent(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }

    onChange?.(newValue, valid, extraData);
  };

  const handleNoNumberToggle = () => {
    const newNoNumber = !isNoNumber;
    setIsNoNumber(newNoNumber);

    if (newNoNumber) {
      const value = 'S/N';
      setInternalValue(value);
      onChange?.(value, true, { noNumber: true });
    } else {
      setInternalValue('');
      onChange?.('', true, { noNumber: false });
    }
  };

  const showError = error || (!isValid && !isFocused && hasValue);
  const errorMessage = error || (!isValid ? `${label || 'Campo'} inválido` : '');

  // Determinar o tipo de input
  const inputType = mask === 'password' && !showPassword ? 'password' : 'text';

  // Renderização especial para telefone internacional
  if (mask === 'internationalPhone') {
    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        <div className="relative flex">
          {/* Seletor de país */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              disabled={disabled}
              className="flex items-center gap-1 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-2.5 h-10 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title={`${selectedCountry.name} ${selectedCountry.phoneCode}`}
            >
              <span className="text-lg">{selectedCountry.flag}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
            </button>

            {showCountryDropdown && (
              <div ref={countryDropdownRef} className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {countries.map(country => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(country);
                      setShowCountryDropdown(false);
                      setInternalValue('');
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 text-left">{country.name}</span>
                    <span className="text-xs text-gray-500">{country.phoneCode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input do telefone */}
          <div className="relative flex-1">
            <input
              ref={ref}
              type="tel"
              value={displayValue}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              placeholder=" "
              className={`
                peer w-full rounded-r-lg border border-gray-300 px-3 py-2 h-10
                focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
                disabled:bg-gray-50 disabled:text-gray-500
                ${showError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
              `}
              {...props}
            />
            <label
              className={`
                absolute left-3 transition-all duration-200 pointer-events-none
                ${hasValue || isFocused
                  ? 'top-0 -translate-y-1/2 text-xs bg-white px-1'
                  : 'top-1/2 -translate-y-1/2 text-sm'
                }
                ${isFocused
                  ? 'text-blue-900'
                  : showError
                    ? 'text-red-500'
                    : 'text-gray-500'
                }
                peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-blue-900
              `}
            >
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          </div>
        </div>

        {/* Mensagem de erro */}
        {showError && (
          <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Renderização padrão para outros tipos
  if (floating && label) {
    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        <div className="relative">
          <input
            ref={ref}
            value={displayValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled || (mask === 'addressNumber' && isNoNumber)}
            placeholder=" "
            type={inputType}
            className={`
              peer w-full h-10 rounded-lg border px-3 py-2 text-gray-900
              placeholder-transparent
              ${showError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-krooa-green focus:ring-krooa-green/20'}
              focus:outline-none focus:ring-2
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${icon ? 'pr-10' : ''}
              ${mask === 'creditCard' && cardBrand ? 'pr-24' : ''}
              ${mask === 'password' && showPasswordToggle ? 'pr-10' : ''}
              ${mask === 'addressNumber' && allowNoNumber ? 'pr-24' : ''}
              ${className}
            `}
            {...props}
          />

          {/* Ícone genérico */}
          {icon && mask !== 'creditCard' && mask !== 'password' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          {/* Logo do cartão de crédito */}
          {mask === 'creditCard' && cardBrand && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className={`text-xl ${cardBrand.color}`}>{cardBrand.logo}</span>
              <span className="text-xs text-gray-600">{cardBrand.name}</span>
            </div>
          )}

          {/* Toggle de visualizar senha */}
          {mask === 'password' && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {/* Checkbox "Sem número" */}
          {mask === 'addressNumber' && allowNoNumber && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNoNumber}
                  onChange={handleNoNumberToggle}
                  disabled={disabled}
                  className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                />
                <span className="text-gray-600">{noNumberText}</span>
              </label>
            </div>
          )}

          <label
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1
              ${hasValue || isFocused
                ? 'top-0 -translate-y-1/2 text-xs'
                : 'top-1/2 -translate-y-1/2 text-sm'
              }
              ${isFocused
                ? 'text-blue-900'
                : showError
                  ? 'text-red-500'
                  : 'text-gray-500'
              }
              peer-disabled:text-gray-400
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        </div>

        {showError && (
          <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Renderização sem label flutuante
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && !floating && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled || (mask === 'addressNumber' && isNoNumber)}
          placeholder=" "
          type={inputType}
          className={`
            w-full h-10 rounded-lg border px-3 py-2 text-gray-900
            ${showError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-krooa-green focus:ring-krooa-green/20'}
            focus:outline-none focus:ring-2
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${icon ? 'pr-10' : ''}
            ${mask === 'creditCard' && cardBrand ? 'pr-24' : ''}
            ${mask === 'password' && showPasswordToggle ? 'pr-10' : ''}
            ${mask === 'addressNumber' && allowNoNumber ? 'pr-24' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Todos os ícones e botões aqui também */}
        {icon && mask !== 'creditCard' && mask !== 'password' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {mask === 'creditCard' && cardBrand && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className={`text-xl ${cardBrand.color}`}>{cardBrand.logo}</span>
            <span className="text-xs text-gray-600">{cardBrand.name}</span>
          </div>
        )}

        {mask === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {mask === 'addressNumber' && allowNoNumber && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={isNoNumber}
                onChange={handleNoNumberToggle}
                disabled={disabled}
                className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
              />
              <span className="text-gray-600">{noNumberText}</span>
            </label>
          </div>
        )}
      </div>

      {showError && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
});

UnifiedInput.displayName = 'UnifiedInput';