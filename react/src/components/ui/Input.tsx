import React, { useState, useEffect, useRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  floating?: boolean;
}

export function Input({
  label,
  error,
  fullWidth = false,
  icon,
  floating = true, // Mudando o padrão para true
  className = '',
  onFocus,
  onBlur,
  value,
  placeholder,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && String(value).length > 0;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Input com floating label
  if (floating && label) {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              {icon}
            </div>
          )}
          <input
            className={`
              peer w-full h-10 rounded-lg border border-gray-300 px-3 py-2
              focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
              disabled:bg-gray-50 disabled:text-gray-500
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-300' : ''}
              ${className}
            `}
            placeholder=" "
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          <label
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none
              ${icon ? 'left-10' : ''}
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
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  // Input tradicional (mantido para compatibilidade)
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && !floating && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full rounded-xl border border-gray-300 px-4 py-2.5
            focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
            disabled:bg-gray-50 disabled:text-gray-500
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-300' : ''}
            ${className}
          `}
          placeholder={placeholder}
          value={value}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Componente de Input compacto para formulários densos
export function CompactInput({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}: InputProps) {
  return (
    <Input
      label={label}
      error={error}
      fullWidth={fullWidth}
      floating={true}
      className={className}
      {...props}
    />
  );
}

// Componente de Input com validação de email
interface EmailInputProps extends Omit<InputProps, 'type' | 'onChange'> {
  onChange?: (value: string) => void;
}

export function EmailInput({
  label = 'E-mail',
  error: externalError,
  onBlur,
  onChange,
  value,
  ...props
}: EmailInputProps) {
  const [emailError, setEmailError] = useState<string | undefined>();

  const validateEmail = (email: string) => {
    // Regex mais completa para validação de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    // Só valida se tiver conteúdo
    if (email && email.length > 0) {
      if (!validateEmail(email)) {
        setEmailError('E-mail inválido');
      } else {
        setEmailError(undefined);
      }
    } else {
      setEmailError(undefined);
    }
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value.toLowerCase(); // Converte para minúsculas

    // Chama onChange com o valor
    onChange?.(email);

    // Limpa o erro quando o usuário corrige o email
    if (emailError && email) {
      if (validateEmail(email)) {
        setEmailError(undefined);
      }
    }
  };

  return (
    <Input
      type="email"
      label={label}
      error={externalError || emailError}
      onBlur={handleBlur}
      onChange={handleChange}
      value={value}
      placeholder="exemplo@email.com"
      autoComplete="email"
      {...props}
    />
  );
}

// Componente de Input com máscara e validação de CPF
export function CPFInput({
  label = 'CPF',
  error: externalError,
  onBlur,
  onChange,
  value = '',
  ...props
}: Omit<InputProps, 'type' | 'onChange'> & { onChange?: (value: string) => void }) {
  const [cpfError, setCpfError] = useState<string | undefined>();

  // Formata o CPF com máscara
  const formatCPF = (cpf: string) => {
    // Remove tudo que não for número
    const numbers = cpf.replace(/\D/g, '');

    // Limita a 11 dígitos
    const limited = numbers.substring(0, 11);

    // Aplica a máscara
    if (limited.length <= 3) return limited;
    if (limited.length <= 6) return `${limited.slice(0, 3)}.${limited.slice(3)}`;
    if (limited.length <= 9) return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
  };

  // Valida o CPF
  const validateCPF = (cpf: string) => {
    // Remove caracteres não numéricos
    const cleaned = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cleaned.length !== 11) return false;

    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cleaned)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i]) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleaned[9])) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned[i]) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleaned[10])) return false;

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    onChange?.(formatted);

    // Limpa o erro se o CPF ficar válido enquanto digita
    if (cpfError && formatted.replace(/\D/g, '').length === 11) {
      if (validateCPF(formatted)) {
        setCpfError(undefined);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const cpf = e.target.value;
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length > 0 && cleaned.length < 11) {
      setCpfError('CPF incompleto');
    } else if (cleaned.length === 11 && !validateCPF(cpf)) {
      setCpfError('CPF inválido');
    } else {
      setCpfError(undefined);
    }

    onBlur?.(e);
  };

  return (
    <Input
      label={label}
      error={externalError || cpfError}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="000.000.000-00"
      maxLength={14}
      {...props}
    />
  );
}

// Lista de códigos de país
const countryCodes = [
  { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brasil' },
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'EUA' },
  { code: '+1', country: 'CA', flag: '🇨🇦', name: 'Canadá' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'Reino Unido' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'França' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Alemanha' },
  { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Itália' },
  { code: '+34', country: 'ES', flag: '🇪🇸', name: 'Espanha' },
  { code: '+351', country: 'PT', flag: '🇵🇹', name: 'Portugal' },
  { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japão' },
  { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
  { code: '+54', country: 'AR', flag: '🇦🇷', name: 'Argentina' },
  { code: '+52', country: 'MX', flag: '🇲🇽', name: 'México' },
];

// Componente de Input para Telefone com máscara
interface PhoneInputProps extends Omit<InputProps, 'type' | 'onChange'> {
  label?: string;
  onChange?: (value: string) => void;
  onCountryChange?: (country: typeof countryCodes[0]) => void;
}

export function PhoneInput({
  label = 'Telefone',
  error,
  value = '',
  onChange,
  onCountryChange,
  ...props
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasValue = value && String(value).length > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPhone = (phone: string, country: typeof countryCodes[0]) => {
    // Remove tudo que não for número
    const numbers = phone.replace(/\D/g, '');

    if (country.country === 'BR') {
      // Formato brasileiro: (11) 98765-4321
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    } else if (country.country === 'US' || country.country === 'CA') {
      // Formato americano/canadense: (555) 123-4567
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    } else {
      // Formato genérico para outros países
      if (numbers.length <= 4) return numbers;
      if (numbers.length <= 8) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
      return `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, 12)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value, selectedCountry);
    // Call onChange with just the formatted value string
    onChange?.(formattedPhone);
  };

  const handleCountrySelect = (country: typeof countryCodes[0]) => {
    setSelectedCountry(country);
    setIsOpen(false);
    onCountryChange?.(country);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <div className="relative flex">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 h-10 hover:bg-gray-100"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm text-gray-700">{selectedCountry.code}</span>
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute left-0 z-10 mt-1 max-h-60 w-48 overflow-auto rounded-lg bg-white shadow-lg border border-gray-200">
              {countryCodes.map((country) => (
                <button
                  key={`${country.country}-${country.code}`}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm">{country.name}</span>
                  <span className="ml-auto text-xs text-gray-500">{country.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex-1">
          <input
            type="tel"
            className={`
              peer w-full rounded-r-lg border border-gray-300 px-3 py-2 h-10
              focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
              disabled:bg-gray-50 disabled:text-gray-500
              ${error ? 'border-red-300' : ''}
            `}
            placeholder=" "
            value={value}
            onChange={handlePhoneChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {label && (
            <label
              className={`
                absolute left-3 transition-all duration-200 pointer-events-none
                ${hasValue || isFocused
                  ? 'top-0 -translate-y-1/2 text-xs bg-white px-1 text-gray-600'
                  : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
                }
                peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-gray-600
                ${error ? 'text-red-500' : ''}
              `}
            >
              {label}
            </label>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string }>;
  floating?: boolean;
}

export function Select({
  label,
  error,
  fullWidth = false,
  options,
  floating = false,
  className = '',
  value,
  onFocus,
  onBlur,
  ...props
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && String(value).length > 0;

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Select com floating label
  if (floating && label) {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        <div className="relative">
          <select
            className={`
              peer w-full rounded-xl border border-gray-300 px-4 pt-5 pb-2
              focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
              disabled:bg-gray-50 disabled:text-gray-500
              ${error ? 'border-red-300' : ''}
              ${!hasValue ? 'text-gray-500' : ''}
              ${className}
            `}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          >
            <option value="" className="text-gray-400">Selecione...</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <label
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${hasValue || isFocused
                ? 'top-2 text-xs text-gray-600'
                : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
              }
              ${error ? 'text-red-500' : ''}
            `}
          >
            {label}
          </label>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  // Select tradicional
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && !floating && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        className={`
          w-full rounded-xl border border-gray-300 px-4 py-2.5
          focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-300' : ''}
          ${className}
        `}
        value={value}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export function CompactSelect({
  label,
  error,
  fullWidth = false,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <Select
      label={label}
      error={error}
      fullWidth={fullWidth}
      options={options}
      floating={true}
      className={className}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  floating?: boolean;
}

export function Textarea({
  label,
  error,
  fullWidth = false,
  floating = false,
  className = '',
  value,
  onFocus,
  onBlur,
  ...props
}: TextareaProps) {
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    onBlur?.(e);
  };

  // Textarea com floating label
  if (floating && label) {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        <div className="relative">
          <textarea
            className={`
              peer w-full rounded-xl border border-gray-300 px-4 pt-5 pb-2
              focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
              disabled:bg-gray-50 disabled:text-gray-500
              ${error ? 'border-red-300' : ''}
              ${className}
            `}
            placeholder=" "
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          <label
            className={`
              absolute left-4 top-2 transition-all duration-200 pointer-events-none
              text-xs text-gray-600
              peer-focus:text-krooa-green
              ${error ? 'text-red-500' : ''}
            `}
          >
            {label}
          </label>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  // Textarea tradicional
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && !floating && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full rounded-xl border border-gray-300 px-4 py-2.5
          focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-300' : ''}
          ${className}
        `}
        value={value}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}