import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, ChevronDown, Upload, MapPin, Search, Clock } from 'lucide-react';
import { Icon } from '@iconify/react';
import { SketchPicker } from 'react-color';
import { CustomCalendar } from './CustomCalendar';
import { Button, IconButton } from './Button';
import { useUITranslation } from '../../hooks/useUITranslation';

// Tipos expandidos de máscara
export type MaskType =
  | 'cpf' | 'cnpj' | 'ssn' | 'ein' | 'internationalPhone' | 'cep' | 'date' | 'time' | 'datepicker' | 'datetime' | 'timepicker'
  | 'currency' | 'percentage' | 'creditCard' | 'password' | 'addressNumber' | 'instagram' | 'color' | 'photo' | 'address' | 'none';

export type ValidationType = 'email' | 'cpf' | 'cnpj' | 'ssn' | 'ein' | 'creditCard' | 'none';

// Função para obter nomes de países traduzidos
const getCountries = (translations?: any) => [
  { code: 'BR', name: translations?.input?.countries?.BR || 'Brasil', flag: '🇧🇷', phoneCode: '+55', mask: '(00) 00000-0000' },
  { code: 'US', name: translations?.input?.countries?.US || 'Estados Unidos', flag: '🇺🇸', phoneCode: '+1', mask: '(000) 000-0000' },
  { code: 'PT', name: translations?.input?.countries?.PT || 'Portugal', flag: '🇵🇹', phoneCode: '+351', mask: '000 000 000' },
  { code: 'ES', name: translations?.input?.countries?.ES || 'Espanha', flag: '🇪🇸', phoneCode: '+34', mask: '000 00 00 00' },
  { code: 'FR', name: translations?.input?.countries?.FR || 'França', flag: '🇫🇷', phoneCode: '+33', mask: '0 00 00 00 00' },
  { code: 'DE', name: translations?.input?.countries?.DE || 'Alemanha', flag: '🇩🇪', phoneCode: '+49', mask: '000 00000000' },
  { code: 'IT', name: translations?.input?.countries?.IT || 'Itália', flag: '🇮🇹', phoneCode: '+39', mask: '000 000 0000' },
  { code: 'UK', name: translations?.input?.countries?.UK || 'Reino Unido', flag: '🇬🇧', phoneCode: '+44', mask: '0000 000000' },
  { code: 'AR', name: translations?.input?.countries?.AR || 'Argentina', flag: '🇦🇷', phoneCode: '+54', mask: '00 0000-0000' },
  { code: 'MX', name: translations?.input?.countries?.MX || 'México', flag: '🇲🇽', phoneCode: '+52', mask: '00 0000 0000' },
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

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
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

  // Props para timepicker
  timeIntervals?: number; // Intervalo em minutos (5, 15, 30, etc)
  timeStart?: string; // Hora de início (ex: "08:00")
  timeEnd?: string; // Hora de fim (ex: "18:00")

  // Props para datepicker
  excludedDates?: string[]; // Datas já selecionadas no formato dd/mm/yyyy
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

  // Tratamento especial para Brasil
  if (country.code === 'BR') {
    if (cleaned.length <= 2) {
      // Apenas DDD
      return cleaned.replace(/^(\d{0,2})/, '($1');
    } else if (cleaned.length <= 6) {
      // DDD + início do número
      const ddd = cleaned.substring(0, 2);
      const rest = cleaned.substring(2);

      // Se o 3º dígito é 9, é celular
      if (rest[0] === '9') {
        // Formato celular: (XX) 9XXXX
        return `(${ddd}) ${rest}`;
      } else {
        // Formato fixo: (XX) XXXX
        return `(${ddd}) ${rest}`;
      }
    } else if (cleaned.length <= 10) {
      const ddd = cleaned.substring(0, 2);
      const rest = cleaned.substring(2);

      // Se o 3º dígito é 9, é celular
      if (rest[0] === '9') {
        // Celular com até 10 dígitos: (XX) 9XXXX-XXX
        const firstPart = rest.substring(0, 5);
        const secondPart = rest.substring(5);
        return `(${ddd}) ${firstPart}${secondPart ? '-' + secondPart : ''}`;
      } else {
        // Fixo: (XX) XXXX-XXXX (máximo 10 dígitos total)
        const firstPart = rest.substring(0, 4);
        const secondPart = rest.substring(4, 8);
        return `(${ddd}) ${firstPart}${secondPart ? '-' + secondPart : ''}`;
      }
    } else {
      // Celular completo (11 dígitos)
      const ddd = cleaned.substring(0, 2);
      const rest = cleaned.substring(2, 11); // Máximo 9 dígitos após DDD

      if (rest[0] === '9') {
        // Celular: (XX) 9XXXX-XXXX
        const firstPart = rest.substring(0, 5);
        const secondPart = rest.substring(5, 9);
        return `(${ddd}) ${firstPart}${secondPart ? '-' + secondPart : ''}`;
      } else {
        // Fixo não pode ter 11 dígitos, limitar a 10
        const restFixed = cleaned.substring(2, 10);
        const firstPart = restFixed.substring(0, 4);
        const secondPart = restFixed.substring(4, 8);
        return `(${ddd}) ${firstPart}${secondPart ? '-' + secondPart : ''}`;
      }
    }
  }

  // Para outros países, usar a máscara padrão
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

    case 'ssn':
      return cleaned
        .slice(0, 9)
        .replace(/^(\d{3})(\d)/, '$1-$2')
        .replace(/^(\d{3})-(\d{2})(\d)/, '$1-$2-$3');

    case 'ein':
      return cleaned
        .slice(0, 9)
        .replace(/^(\d{2})(\d)/, '$1-$2');

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
      // Limita a 4 dígitos
      const timeDigits = cleaned.slice(0, 4);

      if (timeDigits.length === 0) return '';

      if (timeDigits.length === 1) {
        // Primeiro dígito da hora
        const firstHour = parseInt(timeDigits);
        if (firstHour > 2) return '0' + timeDigits + ':';
        return timeDigits;
      }

      if (timeDigits.length === 2) {
        // Dois dígitos da hora
        const hours = parseInt(timeDigits);
        if (hours > 23) return '23:';
        return timeDigits;
      }

      if (timeDigits.length === 3) {
        // Hora completa + primeiro dígito dos minutos
        const hours = parseInt(timeDigits.slice(0, 2));
        const firstMinute = parseInt(timeDigits.slice(2, 3));

        // Validar hora
        let validHours = hours;
        if (hours > 23) validHours = 23;

        // Validar primeiro dígito dos minutos (máximo 5)
        let validFirstMinute = firstMinute;
        if (firstMinute > 5) validFirstMinute = 5;

        return validHours.toString().padStart(2, '0') + ':' + validFirstMinute;
      }

      if (timeDigits.length === 4) {
        // Hora e minutos completos
        const hours = parseInt(timeDigits.slice(0, 2));
        const minutes = parseInt(timeDigits.slice(2, 4));

        // Validar hora
        let validHours = hours;
        if (hours > 23) validHours = 23;

        // Validar minutos
        let validMinutes = minutes;
        if (minutes > 59) validMinutes = 59;

        return validHours.toString().padStart(2, '0') + ':' + validMinutes.toString().padStart(2, '0');
      }

      return timeDigits;

    case 'currency':
      const currencyNumericValue = cleaned.replace(/\D/g, '');
      const currencyFloatValue = parseFloat(currencyNumericValue) / 100;
      if (isNaN(currencyFloatValue)) return 'R$ 0,00';
      return currencyFloatValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

    case 'percentage':
      // Remove tudo que não for número (incluindo %)
      let percentageNumericValue = value.replace(/\D/g, '');

      // Se o usuário apagou tudo, retorna vazio
      if (percentageNumericValue === '') return '';

      // Limita a 5 dígitos (para máximo de 100,00%)
      if (percentageNumericValue.length > 5) {
        percentageNumericValue = percentageNumericValue.slice(0, 5);
      }

      // Converte para número e divide por 100 para obter casas decimais automáticas
      const percentageFloatValue = parseFloat(percentageNumericValue) / 100;

      // Limita a 100%
      const limitedValue = Math.min(100, percentageFloatValue);

      // Formata com 2 casas decimais SEM o %
      return limitedValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

    case 'creditCard':
      return cleaned
        .slice(0, 16)
        .replace(/(\d{4})(?=\d)/g, '$1 ');

    case 'addressNumber':
      if (extraData?.noNumber) return 'S/N';
      return value.replace(/\D/g, '');

    case 'instagram':
      // Remove o @ se já existir e caracteres especiais
      const instagramValue = value.replace(/[@\s]/g, '').toLowerCase();
      // Retorna vazio se não tem valor, senão adiciona @
      return instagramValue ? `@${instagramValue}` : '';

    case 'color':
      // Valida e formata cores hex
      if (value.startsWith('#')) {
        return value.slice(0, 7).toUpperCase();
      }
      return value;

    case 'photo':
      // Retorna o nome do arquivo ou vazio
      return value;

    case 'address':
      // Retorna o endereço formatado
      return value;

    default:
      return value;
  }
};

// Função para validar se uma data é válida
const isValidDate = (dateString: string): boolean => {
  // Formato esperado: DD/MM/YYYY
  const parts = dateString.split('/');
  if (parts.length !== 3) return false;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Verificar se os valores são números válidos
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;

  // Verificar limites básicos
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;

  // Criar objeto Date e verificar se é válido
  const date = new Date(year, month - 1, day);

  // Verificar se a data criada corresponde aos valores inseridos
  // (JavaScript ajusta datas inválidas automaticamente, ex: 32/01 vira 01/02)
  return date.getFullYear() === year &&
         date.getMonth() === month - 1 &&
         date.getDate() === day;
};

// Função para validar se um horário é válido
const isValidTime = (timeString: string): boolean => {
  // Formato esperado: HH:MM
  const parts = timeString.split(':');
  if (parts.length !== 2) return false;

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  // Verificar se os valores são números válidos
  if (isNaN(hours) || isNaN(minutes)) return false;

  // Verificar limites
  if (hours < 0 || hours > 23) return false;
  if (minutes < 0 || minutes > 59) return false;

  return true;
};

// Funções de validação
const checkIfIncomplete = (value: string, type: ValidationType): boolean => {
  if (!value) return false;
  const cleaned = value.replace(/\D/g, '');

  switch (type) {
    case 'cpf':
      return cleaned.length > 0 && cleaned.length < 11;
    case 'cnpj':
      return cleaned.length > 0 && cleaned.length < 14;
    case 'ssn':
      return cleaned.length > 0 && cleaned.length < 9;
    case 'ein':
      return cleaned.length > 0 && cleaned.length < 9;
    case 'creditCard':
      return cleaned.length > 0 && cleaned.length < 13;
    case 'phone':
      if (cleaned.length === 0) return false;

      // Para telefones brasileiros, considera incompleto se:
      // - Tem menos que 10 dígitos (mínimo para fixo)
      // - Tem 10 dígitos mas o 3º é 9 (deveria ser celular com 11)
      if (cleaned.length < 10) return true;

      if (cleaned.length === 10) {
        // Se tem 10 dígitos mas o 3º é 9, é um celular incompleto
        const thirdDigit = cleaned.charAt(2);
        return thirdDigit === '9';
      }

      // Se tem mais de 11 dígitos, é inválido (não incompleto)
      if (cleaned.length > 11) return false;

      // 11 dígitos está completo
      return false;
    default:
      return false;
  }
};

const validateValue = (value: string, validation: ValidationType): boolean => {
  const cleaned = value.replace(/\D/g, '');

  switch (validation) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);

    case 'cpf':
      if (cleaned.length !== 11) return false;

      // Elimina CPFs invalidos conhecidos (todos os dígitos iguais)
      if (/^(\d)\1{10}$/.test(cleaned)) return false;

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
      if (cleaned.length !== 14) return false;

      // Validação do CNPJ
      // Elimina CNPJs invalidos conhecidos
      if (/^(\d)\1{13}$/.test(cleaned)) return false;

      // Valida DVs
      let tamanho = cleaned.length - 2;
      let numeros = cleaned.substring(0, tamanho);
      let digitos = cleaned.substring(tamanho);
      let soma = 0;
      let pos = tamanho - 7;

      for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
      }

      let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado !== parseInt(digitos.charAt(0))) return false;

      tamanho = tamanho + 1;
      numeros = cleaned.substring(0, tamanho);
      soma = 0;
      pos = tamanho - 7;

      for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
      }

      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      return resultado === parseInt(digitos.charAt(1));

    case 'ssn':
      return cleaned.length === 9;

    case 'ein':
      return cleaned.length === 9;

    case 'creditCard':
      return cleaned.length >= 13 && cleaned.length <= 19;

    case 'phone':
      // Validação básica para telefones brasileiros
      if (cleaned.length === 10 || cleaned.length === 11) {
        // Verificar DDD válido
        const ddd = parseInt(cleaned.substring(0, 2));
        const validDDDs = [11,12,13,14,15,16,17,18,19,21,22,24,27,28,31,32,33,34,35,37,38,41,42,43,44,45,46,47,48,49,51,53,54,55,61,62,63,64,65,66,67,68,69,71,73,74,75,77,79,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99];

        if (!validDDDs.includes(ddd)) {
          return false;
        }

        // Para celular (11 dígitos), o terceiro dígito deve ser 9
        if (cleaned.length === 11) {
          const thirdDigit = cleaned.charAt(2);
          return thirdDigit === '9';
        }

        // Para telefone fixo (10 dígitos), está válido
        return true;
      }
      return false;

    default:
      return true;
  }
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({
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
  // Props do timepicker
  timeIntervals = 15,
  timeStart = '00:00',
  timeEnd = '23:59',
  // Props do datepicker
  excludedDates = [],
  ...props
}, ref) => {
  const uiTranslations = useUITranslation();
  const countries = getCountries(uiTranslations);
  const [internalValue, setInternalValue] = React.useState(value || '');
  const [isFocused, setIsFocused] = React.useState(false);
  const [isValid, setIsValid] = React.useState(true);
  const [isIncomplete, setIsIncomplete] = React.useState(false);

  // Estados específicos para funcionalidades avançadas
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find(c => c.code === defaultCountry) || countries[0]
  );
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [cardBrand, setCardBrand] = useState<any>(null);
  const [isNoNumber, setIsNoNumber] = useState(false);

  // Estados para endereço com busca
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressCoords, setAddressCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapZoom, setMapZoom] = useState(15);

  // Estados para localValue do endereço
  const [localValue, setLocalValue] = useState('');

  // Estados para upload de foto
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoPosition, setPhotoPosition] = useState({ x: 50, y: 50 });
  const [photoScale, setPhotoScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [tempPhotoPosition, setTempPhotoPosition] = useState({ x: 50, y: 50 });
  const [tempPhotoScale, setTempPhotoScale] = useState(1);

  // Estados para date/time pickers
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeValue, setTimeValue] = useState('');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const displayValue = typeof value !== 'undefined' ? value : internalValue;
  const hasValue = displayValue && displayValue !== '' && displayValue !== 'S/N';

  // Inicializar localValue para cor
  useEffect(() => {
    if (mask === 'color' && displayValue) {
      setLocalValue(displayValue as string);
    }
  }, [mask, displayValue]);

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

  // Fechar color picker ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
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

    // Validar em tempo real durante digitação
    let currentIsValid = true;

    // Validação especial para data
    if (mask === 'date' && newValue) {
      const cleaned = newValue.replace(/\D/g, '');

      // Verifica se está incompleto (menos de 8 dígitos)
      if (cleaned.length > 0 && cleaned.length < 8) {
        setIsIncomplete(true);
        setIsValid(true);
      } else if (cleaned.length === 8) {
        // Data completa - validar se é válida
        setIsIncomplete(false);
        const dateIsValid = isValidDate(newValue);
        setIsValid(dateIsValid);
        currentIsValid = dateIsValid;
      } else {
        setIsIncomplete(false);
        setIsValid(true);
      }
    }
    // Validação especial para horário
    else if (mask === 'time' && newValue) {
      const cleaned = newValue.replace(/\D/g, '');

      // Verifica se está incompleto (menos de 4 dígitos)
      if (cleaned.length > 0 && cleaned.length < 4) {
        setIsIncomplete(true);
        setIsValid(true);
      } else if (cleaned.length === 4) {
        // Horário completo - validar se é válido
        setIsIncomplete(false);
        const timeIsValid = isValidTime(newValue);
        setIsValid(timeIsValid);
        currentIsValid = timeIsValid;
      } else {
        setIsIncomplete(false);
        setIsValid(true);
      }
    }
    // Validação especial para CEP
    else if (mask === 'cep' && newValue) {
      const cleaned = newValue.replace(/\D/g, '');

      // Verifica se está incompleto (menos de 8 dígitos)
      if (cleaned.length > 0 && cleaned.length < 8) {
        setIsIncomplete(true);
        setIsValid(true);
      } else {
        // CEP completo ou vazio
        setIsIncomplete(false);
        setIsValid(true);
      }
    }
    // Validação especial para telefone internacional
    else if (mask === 'internationalPhone' && newValue) {
      const cleaned = newValue.replace(/\D/g, '');

      if (selectedCountry.code === 'BR') {
        // Validação para Brasil - telefones fixos (10 dígitos) e celulares (11 dígitos)
        if (cleaned.length > 0 && cleaned.length < 10) {
          // Telefone incompleto
          setIsIncomplete(true);
          setIsValid(true);
          currentIsValid = false;
        } else if (cleaned.length === 10) {
          // Telefone fixo (10 dígitos) - não deve ter 9 na 3ª posição
          setIsIncomplete(false);
          const phoneIsValid = cleaned.charAt(2) !== '9';
          setIsValid(phoneIsValid);
          currentIsValid = phoneIsValid;
        } else if (cleaned.length === 11) {
          // Telefone celular (11 dígitos) - precisa ter 9 na 3ª posição
          setIsIncomplete(false);
          const phoneIsValid = cleaned.charAt(2) === '9';
          setIsValid(phoneIsValid);
          currentIsValid = phoneIsValid;
        } else if (cleaned.length > 11) {
          // Muito longo
          setIsIncomplete(false);
          setIsValid(false);
          currentIsValid = false;
        } else {
          setIsIncomplete(false);
          setIsValid(true);
          currentIsValid = true;
        }
      } else {
        // Validação para outros países (mínimo 7 dígitos)
        if (cleaned.length > 0 && cleaned.length < 7) {
          setIsIncomplete(true);
          setIsValid(true);
          currentIsValid = false;
        } else if (cleaned.length >= 7) {
          setIsIncomplete(false);
          setIsValid(true);
          currentIsValid = true;
        } else {
          setIsIncomplete(false);
          setIsValid(true);
          currentIsValid = true;
        }
      }
    }
    // Validação normal para outros tipos
    else if (validation !== 'none') {
      if (newValue) {
        // Primeiro verifica se está incompleto
        const incomplete = checkIfIncomplete(newValue, validation);
        setIsIncomplete(incomplete);

        if (!incomplete) {
          // Se não está incompleto, valida se é válido (para CPF e CNPJ)
          if (validation === 'cpf' || validation === 'cnpj') {
            const valid = validateValue(newValue, validation);
            setIsValid(valid);
            currentIsValid = valid;
          } else {
            // Para CEP e outros, se tem a quantidade certa de dígitos, está válido
            setIsValid(true);
            currentIsValid = true;
          }
        } else {
          // Se está incompleto, reseta a validação
          setIsValid(true);
          currentIsValid = true;
        }
      } else {
        // Campo vazio
        setIsIncomplete(false);
        setIsValid(true);
        currentIsValid = true;
      }
    }
    // Se não tem validação e não é data nem time, reseta estados
    else if (mask !== 'date' && mask !== 'time') {
      setIsIncomplete(false);
      setIsValid(true);
      currentIsValid = true;
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

    onChange?.(newValue, currentIsValid, extraData);
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

  const showError = error || (!isValid && hasValue);
  const showWarning = isIncomplete && hasValue;

  // Mensagens de erro personalizadas por tipo de validação
  const getValidationErrorMessage = () => {
    // Verificar se é data incompleta
    if (isIncomplete && mask === 'date') {
      return uiTranslations?.input?.validation?.incompleteDate || 'Data incompleta';
    }

    // Verificar se é data inválida
    if (!isValid && mask === 'date') {
      return uiTranslations?.input?.validation?.invalidDate || 'Data inválida';
    }

    // Verificar se é horário incompleto
    if (isIncomplete && mask === 'time') {
      return uiTranslations?.input?.validation?.incompleteTime || 'Horário incompleto';
    }

    // Verificar se é horário inválido
    if (!isValid && mask === 'time') {
      return uiTranslations?.input?.validation?.invalidTime || 'Horário inválido';
    }

    // Verificar se é telefone incompleto
    if (isIncomplete && mask === 'internationalPhone') {
      if (selectedCountry.code === 'BR') {
        return uiTranslations?.input?.validation?.incompletePhone || 'Telefone incompleto (fixo: 10 dígitos, celular: 11 dígitos)';
      } else {
        return uiTranslations?.input?.validation?.incompletePhone || 'Telefone incompleto (mín. 7 dígitos)';
      }
    }

    // Verificar se é telefone inválido
    if (!isValid && mask === 'internationalPhone') {
      if (selectedCountry.code === 'BR') {
        const cleaned = internalValue.replace(/\D/g, '');
        if (cleaned.length > 11) {
          return uiTranslations?.input?.validation?.phoneTooLong || 'Telefone com muitos dígitos';
        } else if (cleaned.length === 11) {
          return uiTranslations?.input?.validation?.invalidPhone || 'Para celular, digite 9 após o DDD';
        } else if (cleaned.length === 10) {
          return uiTranslations?.input?.validation?.invalidPhone || 'Para fixo, não digite 9 após o DDD';
        } else {
          return uiTranslations?.input?.validation?.invalidPhone || 'Telefone inválido';
        }
      } else {
        return uiTranslations?.input?.validation?.invalidPhone || 'Telefone inválido';
      }
    }

    if (isIncomplete && validation !== 'none') {
      switch (validation) {
        case 'cpf':
          return uiTranslations?.input?.validation?.incompleteCPF || 'CPF incompleto';
        case 'cnpj':
          return uiTranslations?.input?.validation?.incompleteCNPJ || 'CNPJ incompleto';
        case 'ssn':
          return uiTranslations?.input?.validation?.incompleteSSN || 'SSN incompleto';
        case 'ein':
          return uiTranslations?.input?.validation?.incompleteEIN || 'EIN incompleto';
        case 'creditCard':
          return uiTranslations?.input?.validation?.incompleteCard || 'Número do cartão incompleto';
        default:
          return `${label || uiTranslations?.input?.validation?.incompleteField || 'Campo'} ${uiTranslations?.input?.validation?.incompleteField || 'incompleto'}`;
      }
    }
    if (!isValid && validation !== 'none') {
      switch (validation) {
        case 'cpf':
          return uiTranslations?.input?.validation?.invalidCPF || 'CPF inválido';
        case 'cnpj':
          return uiTranslations?.input?.validation?.invalidCNPJ || 'CNPJ inválido';
        case 'email':
          return uiTranslations?.input?.validation?.invalidEmail || 'E-mail inválido';
        case 'ssn':
          return uiTranslations?.input?.validation?.invalidSSN || 'SSN inválido';
        case 'ein':
          return uiTranslations?.input?.validation?.invalidEIN || 'EIN inválido';
        case 'creditCard':
          return uiTranslations?.input?.validation?.invalidCard || 'Número do cartão inválido';
        default:
          return `${label || uiTranslations?.input?.validation?.invalidField || 'Campo'} ${uiTranslations?.input?.validation?.invalidField || 'inválido'}`;
      }
    }
    return '';
  };

  const errorMessage = error || getValidationErrorMessage();

  // Determinar o tipo de input
  const inputType = mask === 'password' && !showPassword ? 'password' :
                   mask === 'color' ? 'color' :
                   // Usar 'tel' para máscaras numéricas (melhor experiência em mobile)
                   mask === 'cpf' || mask === 'cnpj' || mask === 'cep' ||
                   mask === 'date' || mask === 'time' || mask === 'creditCard' ||
                   mask === 'currency' || mask === 'percentage' || mask === 'addressNumber' ||
                   mask === 'ssn' || mask === 'ein' || mask === 'internationalPhone' ? 'tel' :
                   'text';

  // Renderização especial para cor
  if (mask === 'color') {
    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        {label && !floating && (
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={localValue || '#000000'}
            onChange={(e) => {
              const value = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                setLocalValue(value.toUpperCase());
                onChange?.(value.toUpperCase(), true);
              }
              setShowColorPicker(true);
            }}
            onBlur={() => setIsFocused(false)}
            onFocus={() => {
              setIsFocused(true);
              setShowColorPicker(true);
            }}
            placeholder=" "
            disabled={disabled}
            className={`
              peer w-full h-10 rounded-lg border px-3 py-2 pr-14 text-gray-900 font-mono
              placeholder-transparent overflow-hidden
              ${showError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' :
                showWarning ? 'border-orange-400 focus:border-orange-500 focus:ring-orange-500/20' :
                'border-gray-300 focus:border-krooa-green focus:ring-krooa-green/20'}
              focus:outline-none focus:ring-2 transition-colors
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />

          {/* Preview da cor no lado direito */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            <div className="relative w-6 h-6">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                disabled={disabled}
                className="w-6 h-6 rounded border border-gray-200 cursor-pointer shadow-sm
                          hover:border-krooa-green hover:shadow-md transition-all duration-200
                          hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                          relative overflow-hidden group"
                style={{ backgroundColor: localValue || '#000000' }}
                title={uiTranslations?.input?.colorPicker || 'Escolher cor'}
              >
                {/* Efeito de brilho/gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 rounded"></div>

                {/* Indicador de interação */}
                <div className="absolute inset-0 rounded ring-0 group-hover:ring-2 group-hover:ring-krooa-green/30 transition-all duration-200"></div>
              </button>

              {/* Dropdown do seletor de cor com react-color */}
              {showColorPicker && (
                <div ref={colorPickerRef} className="absolute top-full right-0 mt-2 z-50">
                  <SketchPicker
                    color={localValue || '#000000'}
                    onChange={(color) => {
                      const hexColor = color.hex.toUpperCase();
                      setLocalValue(hexColor);
                      onChange?.(hexColor, true);
                    }}
                    onChangeComplete={(color) => {
                      const hexColor = color.hex.toUpperCase();
                      setLocalValue(hexColor);
                      onChange?.(hexColor, true);
                    }}
                    presetColors={[
                      '#00D4AA', '#007B7F', '#00B896', '#00A8B5',
                      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
                      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
                      '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
                      '#000000', '#FFFFFF', '#FF0000', '#00FF00',
                      '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'
                    ]}
                    disableAlpha={true}
                    width="280px"
                  />
                </div>
              )}
            </div>
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
                : showError
                  ? 'text-red-500'
                  : showWarning
                    ? 'text-orange-500'
                    : 'text-gray-500'
              }
              peer-disabled:text-gray-400
            `}>
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}
        </div>

        {/* Mensagem de erro */}
        {(showError || showWarning) && (
          <p className={`mt-1 text-xs ${showError ? 'text-red-500' : 'text-orange-500'}`}>{errorMessage}</p>
        )}
      </div>
    );
  }

  // Renderização especial para datepicker (data com preview de calendário)
  if (mask === 'datepicker') {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        <CustomCalendar
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            if (date) {
              const formatted = date.toLocaleDateString('pt-BR');
              setInternalValue(formatted);
              onChange?.(formatted, true, { date });
            } else {
              setInternalValue('');
              onChange?.('', true);
            }
          }}
          label={label}
          required={required}
          floating={floating}
          disabled={disabled}
          error={!!showError}
          warning={!!showWarning}
          className={className}
          excludedDates={excludedDates}
        />

        {/* Mensagem de erro */}
        {(showError || showWarning) && (
          <p className={`mt-1 text-xs ${showError ? 'text-red-500' : 'text-orange-500'}`}>{errorMessage}</p>
        )}
      </div>
    );
  }

  // Renderização especial para datetime (data e hora com preview de calendário)
  if (mask === 'datetime') {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        <CustomCalendar
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            if (date) {
              const formatted = date.toLocaleString('pt-BR');
              setInternalValue(formatted);
              onChange?.(formatted, true, { date });
            } else {
              setInternalValue('');
              onChange?.('', true);
            }
          }}
          label={label}
          required={required}
          floating={floating}
          disabled={disabled}
          error={!!showError}
          warning={!!showWarning}
          timeIntervals={timeIntervals}
          timeStart={timeStart}
          timeEnd={timeEnd}
          className={className}
          showTime={true}
        />

        {/* Mensagem de erro */}
        {(showError || showWarning) && (
          <p className={`mt-1 text-xs ${showError ? 'text-red-500' : 'text-orange-500'}`}>{errorMessage}</p>
        )}
      </div>
    );
  }

  // Renderização especial para timepicker (hora com seletor)
  if (mask === 'timepicker') {
    const applyTimeMask = (value: string) => {
      // Permite campo vazio
      if (value === '') return '';

      // Remove caracteres inválidos (mantém apenas números)
      const cleaned = value.replace(/\D/g, '');

      // Limita a 4 dígitos
      const timeDigits = cleaned.slice(0, 4);

      if (timeDigits.length === 0) return '';

      if (timeDigits.length === 1) {
        // Primeiro dígito da hora
        const firstHour = parseInt(timeDigits);
        if (firstHour > 2) return '0' + timeDigits + ':';
        return timeDigits;
      }

      if (timeDigits.length === 2) {
        // Dois dígitos da hora
        const hours = parseInt(timeDigits);
        if (hours > 23) return '23:';
        return timeDigits;
      }

      if (timeDigits.length === 3) {
        // Hora completa + primeiro dígito dos minutos
        const hours = parseInt(timeDigits.slice(0, 2));
        const firstMinute = parseInt(timeDigits.slice(2, 3));

        // Validar hora
        let validHours = hours;
        if (hours > 23) validHours = 23;

        // Validar primeiro dígito dos minutos (máximo 5)
        let validFirstMinute = firstMinute;
        if (firstMinute > 5) validFirstMinute = 5;

        return validHours.toString().padStart(2, '0') + ':' + validFirstMinute;
      }

      if (timeDigits.length === 4) {
        // Hora e minutos completos
        const hours = parseInt(timeDigits.slice(0, 2));
        const minutes = parseInt(timeDigits.slice(2, 4));

        // Validar hora
        let validHours = hours;
        if (hours > 23) validHours = 23;

        // Validar minutos
        let validMinutes = minutes;
        if (minutes > 59) validMinutes = 59;

        return validHours.toString().padStart(2, '0') + ':' + validMinutes.toString().padStart(2, '0');
      }

      return timeDigits;
    };

    const handleTimeChange = (value: string) => {
      setTimeValue(value);
      setInternalValue(value);

      // Validar se o horário está completo e é válido
      let isValid = true;
      if (value.includes(':')) {
        const [hours, minutes] = value.split(':').map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          // Verificar se está dentro dos limites válidos
          isValid = hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;

          if (isValid) {
            const today = new Date();
            today.setHours(hours, minutes, 0, 0);
            onChange?.(value, true, { time: today });
          } else {
            onChange?.(value, false);
          }
        } else {
          onChange?.(value, false);
        }
      } else {
        // Horário incompleto
        onChange?.(value, false);
      }
    };

    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        {label && !floating && (
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            type="text"
            value={timeValue || displayValue}
            onChange={(e) => {
              const maskedValue = applyTimeMask(e.target.value);
              setTimeValue(maskedValue);
              setInternalValue(maskedValue);
              handleTimeChange(maskedValue);
            }}
            onFocus={() => {
              setIsFocused(true);
              setShowTimeDropdown(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setShowTimeDropdown(false), 150);
            }}
            disabled={disabled}
            className={`
              peer w-full h-10 rounded-lg border px-3 py-2 pr-10 text-gray-900
              overflow-hidden
              ${showError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' :
                showWarning ? 'border-orange-400 focus:border-orange-500 focus:ring-orange-500/20' :
                'border-gray-300 focus:border-krooa-green focus:ring-krooa-green/20'}
              focus:outline-none focus:ring-2
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${className}
            `}
          />

          {/* Dropdown de sugestões de horário */}
          {showTimeDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {(() => {
                const options = [];

                // Converter timeStart e timeEnd para minutos
                const [startHour, startMinute] = timeStart.split(':').map(Number);
                const [endHour, endMinute] = timeEnd.split(':').map(Number);
                const startMinutes = startHour * 60 + startMinute;
                const endMinutes = endHour * 60 + endMinute;

                // Gerar opções baseadas no intervalo
                for (let totalMinutes = startMinutes; totalMinutes <= endMinutes; totalMinutes += timeIntervals) {
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = totalMinutes % 60;

                  // Garantir que não ultrapasse 23:59
                  if (hours > 23) break;

                  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                  options.push(
                    <button
                      key={timeString}
                      type="button"
                      onClick={() => {
                        handleTimeChange(timeString);
                        setShowTimeDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-krooa-green/10 transition-colors text-sm"
                    >
                      {timeString}
                    </button>
                  );
                }

                return options;
              })()}
            </div>
          )}

          {/* Ícone de relógio */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <Clock className="w-4 h-4" />
          </div>

          {/* Label flutuante */}
          {label && floating && (
            <label className={`
              absolute left-3 transition-all duration-200 pointer-events-none px-1
              ${disabled ? 'bg-gray-50' : 'bg-white'}
              ${(isFocused || timeValue || displayValue)
                ? 'top-0 -translate-y-1/2 text-xs'
                : 'top-1/2 -translate-y-1/2 text-sm'
              }
              ${isFocused
                ? 'text-blue-900'
                : showError
                  ? 'text-red-500'
                  : showWarning
                    ? 'text-orange-500'
                    : 'text-gray-500'
              }
              peer-disabled:text-gray-400
            `}>
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}
        </div>

        {/* Mensagem de erro */}
        {(showError || showWarning) && (
          <p className={`mt-1 text-xs ${showError ? 'text-red-500' : 'text-orange-500'}`}>{errorMessage}</p>
        )}
      </div>
    );
  }

  // Renderização especial para foto
  if (mask === 'photo') {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          onChange?.('', false, { error: 'Por favor, selecione uma imagem válida' });
          return;
        }

        // Criar preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
          setPhotoPosition({ x: 50, y: 50 }); // Reset position
          setPhotoScale(1); // Reset scale
          setIsEditingPhoto(true); // Abre o editor automaticamente
          setTempPhotoPosition({ x: 50, y: 50 });
          setTempPhotoScale(1);
          onChange?.(file.name, true, {
            file,
            preview: reader.result,
            position: { x: 50, y: 50 },
            scale: 1
          });
        };
        reader.readAsDataURL(file);
      }
    };

    const handleRemove = () => {
      setPreview(null);
      setLocalValue('');
      setPhotoPosition({ x: 50, y: 50 });
      setPhotoScale(1);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onChange?.('', true);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if (preview && isEditingPhoto) {
        setIsDragging(true);
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging && preview && isEditingPhoto) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newPosition = {
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y))
        };

        setTempPhotoPosition(newPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleScaleChange = (newScale: number) => {
      setTempPhotoScale(newScale);
    };

    const handleStartEdit = () => {
      setIsEditingPhoto(true);
      setTempPhotoPosition(photoPosition);
      setTempPhotoScale(photoScale);
    };

    const handleSaveEdit = () => {
      setPhotoPosition(tempPhotoPosition);
      setPhotoScale(tempPhotoScale);
      setIsEditingPhoto(false);
      onChange?.(localValue || '', true, {
        position: tempPhotoPosition,
        scale: tempPhotoScale
      });
    };

    const handleCancelEdit = () => {
      setTempPhotoPosition(photoPosition);
      setTempPhotoScale(photoScale);
      setIsEditingPhoto(false);
    };

    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        {label && !floating && (
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          id={`photo-input-${Math.random()}`}
        />

        {!preview ? (
          <label
            htmlFor={fileInputRef.current?.id || `photo-input-${Math.random()}`}
            className={`
              flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg
              cursor-pointer transition-all
              ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-krooa-blue'}
              ${showError ? 'border-red-500 bg-red-50' :
                showWarning ? 'border-orange-400 bg-orange-50' : 'border-gray-300'}
            `}
            onClick={(e) => {
              if (!disabled) {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Clique ou arraste para fazer upload</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF até 10MB</p>
          </label>
        ) : (
          <div className="space-y-4">
            {/* Modo de visualização normal */}
            {!isEditingPhoto ? (
              <div className="flex gap-4 items-center">
                {/* Preview circular */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${preview})`,
                      backgroundPosition: `${photoPosition.x}% ${photoPosition.y}%`,
                      backgroundSize: `${100 * photoScale}%`,
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                </div>

                {/* Botões de ação */}
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Foto carregada</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleStartEdit}
                      variant="secondary"
                      size="sm"
                      disabled={disabled}
                    >
                      Editar posição
                    </Button>
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                    >
                      Trocar foto
                    </Button>
                    <IconButton
                      type="button"
                      onClick={handleRemove}
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                      className="text-red-500 border-red-300 hover:text-red-700 hover:border-red-500 hover:bg-red-50"
                    >
                      <Icon icon="mdi:delete" className="w-4 h-4" />
                    </IconButton>
                  </div>
                </div>
              </div>
            ) : (
              /* Modo de edição */
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  {/* Preview circular editável */}
                  <div
                    className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-krooa-blue cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${preview})`,
                        backgroundPosition: `${tempPhotoPosition.x}% ${tempPhotoPosition.y}%`,
                        backgroundSize: `${100 * tempPhotoScale}%`,
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                    {isDragging && (
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <div className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                          Arraste para posicionar
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controles de edição */}
                  <div className="flex-1 space-y-3">
                    {/* Slider de zoom */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Zoom</label>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={tempPhotoScale}
                        onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-krooa-blue"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>100%</span>
                        <span>{Math.round(tempPhotoScale * 100)}%</span>
                        <span>300%</span>
                      </div>
                    </div>

                    {/* Botões de salvar/cancelar */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleSaveEdit}
                        variant="primary"
                        size="sm"
                        fullWidth
                      >
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                        fullWidth
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Instruções */}
                <p className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                  💡 Arraste a imagem para ajustar a posição • Use o controle de zoom para ajustar o tamanho
                </p>
              </div>
            )}
          </div>
        )}

        {/* Label flutuante */}
        {label && floating && (
          <label className={`
            absolute left-3 transition-all duration-200 pointer-events-none z-10
            ${(preview || isFocused)
              ? `-top-2 text-xs ${disabled ? 'bg-gray-50' : 'bg-white'} px-1 text-blue-900`
              : 'top-6 text-sm text-gray-500'
            }
          `}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        {/* Mensagem de erro */}
        {(showError || showWarning) && (
          <p className={`mt-1 text-sm ${showError ? 'text-red-600' : 'text-orange-600'}`}>{errorMessage}</p>
        )}
      </div>
    );
  }

  // Renderização especial para endereço com mapa circular
  if (mask === 'address') {
    // Simular busca de endereços (em produção, integraria com Google Places API)
    const searchAddress = (query: string) => {
      if (query.length > 2) {
        // Simulação de sugestões
        setSuggestions([
          `${query} - São Paulo, SP`,
          `${query} - Rio de Janeiro, RJ`,
          `${query} - Belo Horizonte, MG`,
          `${query} - Curitiba, PR`,
          `${query} - Porto Alegre, RS`
        ]);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalValue(value);
      searchAddress(value);
      onChange?.(value, true);
    };

    const selectSuggestion = (suggestion: string) => {
      setLocalValue(suggestion);
      // Simular obtenção de coordenadas (em produção viria da API)
      const mockCoords = {
        lat: -23.550520 + (Math.random() - 0.5) * 0.1,
        lng: -46.633308 + (Math.random() - 0.5) * 0.1
      };
      setAddressCoords(mockCoords);
      onChange?.(suggestion, true, {
        formatted: suggestion,
        coordinates: mockCoords
      });
      setShowSuggestions(false);
    };


    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && !floating && (
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        {/* Container integrado do mapa e input */}
        <div className="space-y-2">
          {/* Área do mapa com input integrado */}
          <div
            className={`relative w-full h-56 rounded-lg overflow-hidden border-2 bg-gradient-to-br from-blue-50 via-blue-100 to-green-100 transition-colors ${
              addressCoords
                ? 'border-gray-300 hover:border-krooa-blue'
                : 'border-gray-200'
            }`}
            onClick={addressCoords ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width;
              const y = (e.clientY - rect.top) / rect.height;

              // Atualizar coordenadas baseado no clique
              const newCoords = {
                lat: addressCoords.lat + (0.5 - y) * 0.02,
                lng: addressCoords.lng + (x - 0.5) * 0.02
              };

              setAddressCoords(newCoords);
              onChange?.(localValue, true, {
                formatted: localValue,
                coordinates: newCoords,
                zoom: mapZoom
              });
            } : undefined}
          >
              {/* Fundo do mapa sempre presente */}
              {addressCoords && (
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, #e5e7eb 0, #e5e7eb 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #e5e7eb 0, #e5e7eb 1px, transparent 1px, transparent 20px)',
                    backgroundSize: '100% 100%'
                  }}></div>
                </div>
              )}

              {/* Marcador central quando tem coordenadas */}
              {addressCoords && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" />
                </div>
              )}

              {/* Estado vazio - ícone central */}
              {!addressCoords && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-gray-200" />
                </div>
              )}

              {/* Input de endereço integrado no topo */}
              <div className="absolute top-0 left-0 right-0 p-3">
                <div className="relative">
                  <input
                    ref={ref}
                    type="text"
                    value={localValue}
                    onChange={handleAddressChange}
                    onFocus={() => {
                      setIsFocused(true);
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                      setTimeout(() => setShowSuggestions(false), 200);
                      if (validation !== 'none' && localValue) {
                        const incomplete = checkIfIncomplete(localValue, validation);
                        setIsIncomplete(incomplete);
                        if (!incomplete) {
                          const valid = validateValue(localValue, validation);
                          setIsValid(valid);
                        } else {
                          setIsValid(true);
                        }
                      }
                    }}
                    placeholder="Digite o endereço..."
                    disabled={disabled}
                    className={`
                      w-full pl-10 pr-10 py-2 rounded-lg bg-white/95 backdrop-blur
                      border transition-all shadow-sm
                      ${showError ? 'border-red-500' :
                        showWarning ? 'border-orange-400' :
                        isFocused ? 'border-krooa-blue' : 'border-gray-300'}
                      focus:outline-none focus:ring-2 focus:ring-krooa-blue/20
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
                    `}
                    {...props}
                  />

                  {/* Ícones do input */}
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                  {/* Sugestões */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-20 w-full top-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-60 overflow-auto">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectSuggestion(suggestion)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                        >
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Informações e controles quando tem coordenadas */}
              {addressCoords && (
                <>
                  {/* Card de informações */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-md">
                    <p className="text-xs text-gray-500">Coordenadas</p>
                    <p className="text-xs font-medium text-gray-700">
                      {addressCoords.lat.toFixed(6)}, {addressCoords.lng.toFixed(6)}
                    </p>
                  </div>

                  {/* Controles de zoom */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur rounded-lg shadow-md p-1">
                    <IconButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newZoom = Math.max(10, mapZoom - 1);
                        setMapZoom(newZoom);
                        onChange?.(localValue, true, {
                          formatted: localValue,
                          coordinates: addressCoords,
                          zoom: newZoom
                        });
                      }}
                      variant="ghost"
                      size="sm"
                      disabled={disabled || mapZoom <= 10}
                    >
                      <span className="text-lg leading-none">−</span>
                    </IconButton>
                    <span className="px-2 text-xs min-w-[30px] text-center">{mapZoom}</span>
                    <IconButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newZoom = Math.min(18, mapZoom + 1);
                        setMapZoom(newZoom);
                        onChange?.(localValue, true, {
                          formatted: localValue,
                          coordinates: addressCoords,
                          zoom: newZoom
                        });
                      }}
                      variant="ghost"
                      size="sm"
                      disabled={disabled || mapZoom >= 18}
                    >
                      <span className="text-lg leading-none">+</span>
                    </IconButton>
                  </div>
                </>
              )}
            </div>

          {/* Mensagem de erro */}
          {(showError || showWarning) && (
            <p className={`mt-1 text-sm ${showError ? 'text-red-600' : 'text-orange-600'}`}>{errorMessage}</p>
          )}
        </div>
      </div>
    );
  }

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
              onBlur={() => {
                setIsFocused(false);
                  // Validar no blur para telefone internacional
                if (validation !== 'none' && displayValue) {
                  const incomplete = checkIfIncomplete(displayValue as string, validation);
                  setIsIncomplete(incomplete);
                  if (!incomplete) {
                    const valid = validateValue(displayValue as string, validation);
                    setIsValid(valid);
                  } else {
                    setIsValid(true);
                  }
                }
              }}
              disabled={disabled}
              placeholder=" "
              className={`
                peer w-full rounded-r-lg border border-gray-300 px-3 py-2 h-10
                overflow-hidden
                focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
                disabled:bg-gray-50 disabled:text-gray-500
                ${showError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' :
                  showWarning ? 'border-orange-400 focus:border-orange-500 focus:ring-orange-500/20' : ''}
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
                    : showWarning
                      ? 'text-orange-500'
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
        {(showError || showWarning) && (
          <p className={`mt-1 text-xs ${showError ? 'text-red-500' : 'text-orange-500'}`}>{errorMessage}</p>
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
            onBlur={() => {
              setIsFocused(false);
              // Validar no blur
              if (validation !== 'none' && displayValue) {
                const incomplete = checkIfIncomplete(displayValue as string, validation);
                setIsIncomplete(incomplete);
                if (!incomplete && displayValue) {
                  const valid = validateValue(displayValue as string, validation);
                  setIsValid(valid);
                } else {
                  // Se está incompleto, considerar válido para não mostrar erro vermelho
                  setIsValid(true);
                }
              } else {
                // Campo vazio
                setIsIncomplete(false);
                setIsValid(true);
              }
            }}
            disabled={disabled || (mask === 'addressNumber' && isNoNumber)}
            placeholder=" "
            type={inputType}
            className={`
              peer w-full h-10 rounded-lg border px-3 py-2 text-gray-900
              placeholder-transparent overflow-hidden
              ${showError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' :
                showWarning ? 'border-orange-400 focus:border-orange-500 focus:ring-orange-500/20' :
                'border-gray-300 focus:border-krooa-green focus:ring-krooa-green/20'}
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


          {/* Checkbox "Sem número" */}
          {mask === 'addressNumber' && allowNoNumber && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNoNumber}
                  onChange={handleNoNumberToggle}
                  disabled={disabled}
                  className="w-4 h-4 text-krooa-dark rounded focus:ring-krooa-dark"
                />
                <span className="text-gray-600">{noNumberText}</span>
              </label>
            </div>
          )}

          <label
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none px-1
              ${(disabled || (mask === 'addressNumber' && isNoNumber)) ? 'bg-gray-50' : 'bg-white'}
              ${hasValue || isFocused
                ? 'top-0 -translate-y-1/2 text-xs'
                : 'top-1/2 -translate-y-1/2 text-sm'
              }
              ${isFocused
                ? 'text-blue-900'
                : showError
                  ? 'text-red-500'
                  : showWarning
                    ? 'text-orange-500'
                    : 'text-gray-500'
              }
              peer-disabled:text-gray-400
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        </div>

        {(showError || showWarning) && (
          <p className={`mt-1 text-xs ${showError ? 'text-red-500' : 'text-orange-500'}`}>{errorMessage}</p>
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
          onBlur={() => {
            setIsFocused(false);
            // Validar no blur
            if (validation !== 'none' && localValue) {
              const valid = validateValue(localValue, validation);
              setIsValid(valid);
            }
          }}
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
            ${mask === 'percentage' ? 'pr-8' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Todos os ícones e botões aqui também */}
        {icon && mask !== 'creditCard' && mask !== 'password' && mask !== 'percentage' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* Ícone % para porcentagem */}
        {mask === 'percentage' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
            %
          </div>
        )}

        {mask === 'creditCard' && cardBrand && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className={`text-xl ${cardBrand.color}`}>{cardBrand.logo}</span>
            <span className="text-xs text-gray-600">{cardBrand.name}</span>
          </div>
        )}

        {mask === 'password' && showPasswordToggle && (
          <IconButton
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            variant="ghost"
            size="sm"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </IconButton>
        )}

        {mask === 'addressNumber' && allowNoNumber && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={isNoNumber}
                onChange={handleNoNumberToggle}
                disabled={disabled}
                className="w-4 h-4 text-krooa-dark rounded focus:ring-krooa-dark"
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

Input.displayName = 'Input';