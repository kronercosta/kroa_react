import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Plus, Edit2, Trash2, X, Check, AlertTriangle, ChevronRight } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  parentValue?: string; // Para suporte a subcategorias
  level?: number; // 0 = categoria, 1 = subcategoria
  children?: Option[]; // Opções filhas
}

interface DeleteConfirmation {
  option: Option;
  showTransfer: boolean;
  transferTo?: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: Option[];
  error?: string;
  fullWidth?: boolean;
  floating?: boolean;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string | string[]; name?: string } }) => void;
  searchable?: boolean;
  multiple?: boolean;
  editable?: boolean;
  addable?: boolean;
  onOptionsChange?: (options: Option[]) => void;
  // Props do modo avançado
  enhanced?: boolean; // Ativa modo avançado com hierarquia
  confirmDelete?: boolean; // Pedir confirmação ao deletar
  allowTransfer?: boolean; // Permitir transferência de registros
  hierarchical?: boolean; // Suporte a níveis hierárquicos
  placeholder?: string;
}

// Função para normalizar texto removendo acentos
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function Select({
  label,
  options: initialOptions,
  error,
  fullWidth = false,
  floating = true,
  className = '',
  value,
  required = false,
  onChange,
  disabled = false,
  name,
  searchable = true,
  multiple = false,
  editable = false,
  addable = false,
  onOptionsChange,
  // Props avançadas
  enhanced = false,
  confirmDelete = false,
  allowTransfer = false,
  hierarchical = false,
  placeholder = "Selecione...",
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [options, setOptions] = useState(initialOptions);
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Suporte para múltipla seleção
  const selectedValues = multiple
    ? (Array.isArray(value) ? value : [])
    : (value ? [value] : []);

  const hasValue = multiple
    ? selectedValues.length > 0
    : value && value !== '';

  const selectedOptions = options.filter(opt => selectedValues.includes(opt.value));
  const selectedOption = !multiple ? options.find(opt => opt.value === value) : null;

  // Organizar opções hierarquicamente quando enhanced
  const getHierarchicalOptions = (): Option[] => {
    if (!enhanced || !hierarchical) return options;

    const categories = options.filter(opt => !opt.parentValue);
    const organized: Option[] = [];

    categories.forEach(cat => {
      organized.push(cat);
      const children = options.filter(opt => opt.parentValue === cat.value);
      if (expandedCategories.has(cat.value)) {
        children.forEach(child => {
          organized.push({ ...child, level: 1 });
        });
      }
    });

    return organized;
  };

  // Contar filhos de uma categoria
  const getChildrenCount = (categoryValue: string): number => {
    return options.filter(opt => opt.parentValue === categoryValue).length;
  };

  // Verificar se categoria tem filhos
  const hasChildren = (option: Option): boolean => {
    return enhanced && hierarchical && !option.parentValue && getChildrenCount(option.value) > 0;
  };

  // Busca melhorada ignorando acentos
  const displayOptions = enhanced ? getHierarchicalOptions() : options;
  const filteredOptions = displayOptions.filter(option => {
    const normalizedLabel = normalizeText(option.label);
    const normalizedSearch = normalizeText(searchTerm);
    return normalizedLabel.includes(normalizedSearch);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (option: Option) => {
    if (multiple) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];

      if (onChange) {
        const syntheticEvent = {
          target: {
            value: newValues,
            name: name
          }
        };
        onChange(syntheticEvent as any);
      }
    } else {
      if (onChange) {
        const syntheticEvent = {
          target: {
            value: option.value,
            name: name
          }
        };
        onChange(syntheticEvent as any);
      }
      setIsOpen(false);
    }
    setSearchTerm('');
  };

  const handleAddNew = () => {
    if (!newItemText.trim() && !searchTerm.trim()) return;

    const textToAdd = newItemText.trim() || searchTerm.trim();
    const newOption: Option = {
      value: `new_${Date.now()}`,
      label: textToAdd,
      parentValue: enhanced && hierarchical && selectedParent ? selectedParent : undefined
    };

    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    onOptionsChange?.(updatedOptions);
    setNewItemText('');
    setSelectedParent('');

    // Auto-selecionar o novo item se não for múltipla seleção
    if (!multiple) {
      handleSelect(newOption);
    }
  };

  const handleEdit = (option: Option) => {
    const updatedOptions = options.map(opt =>
      opt.value === option.value
        ? { ...opt, label: editValue }
        : opt
    );
    setOptions(updatedOptions);
    onOptionsChange?.(updatedOptions);
    setEditingOption(null);
    setEditValue('');
  };

  const handleDeleteRequest = (option: Option) => {
    if (!confirmDelete) {
      handleDelete(option);
      return;
    }

    const hasChildrenOptions = enhanced && hierarchical && getChildrenCount(option.value) > 0;
    setDeleteConfirmation({
      option,
      showTransfer: allowTransfer && hasChildrenOptions
    });
  };

  const handleDelete = (option: Option, transferTo?: string) => {
    let updatedOptions = options.filter(opt => opt.value !== option.value);

    // Se há transferência, atualizar os filhos
    if (transferTo && enhanced && hierarchical) {
      updatedOptions = updatedOptions.map(opt => {
        if (opt.parentValue === option.value) {
          return { ...opt, parentValue: transferTo === 'root' ? undefined : transferTo };
        }
        return opt;
      });
    } else {
      // Remover também os filhos se não houver transferência
      if (enhanced && hierarchical) {
        updatedOptions = updatedOptions.filter(opt => opt.parentValue !== option.value);
      }
    }

    setOptions(updatedOptions);
    onOptionsChange?.(updatedOptions);
    setDeleteConfirmation(null);

    // Se o item deletado estava selecionado, limpar seleção
    if (selectedValues.includes(option.value)) {
      if (multiple) {
        const newValues = selectedValues.filter(v => v !== option.value);
        onChange?.({ target: { value: newValues, name } });
      } else {
        onChange?.({ target: { value: '', name } });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  if (floating && label) {
    return (
      <div ref={containerRef} className={`relative ${fullWidth ? 'w-full' : ''}`}>
        <div className="relative">
          {/* Campo principal que simula o select */}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`
              peer w-full h-10 rounded-lg border border-gray-300 px-3 py-2 pr-8 text-left
              focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${isOpen ? 'border-krooa-green ring-2 ring-krooa-green/20' : ''}
              ${error ? 'border-red-300' : ''}
              ${className}
            `}
          >
            <span className={hasValue ? 'text-gray-900' : 'text-gray-400'}>
              {multiple
                ? selectedOptions.length > 0
                  ? selectedOptions.map(opt => opt.label).join(', ')
                  : 'Selecione...'
                : selectedOption
                  ? selectedOption.label
                  : 'Selecione...'}
            </span>
          </button>

          {/* Ícone da seta */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Label flutuante */}
          <label
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1
              ${hasValue || isOpen
                ? 'top-0 -translate-y-1/2 text-xs text-gray-600'
                : 'top-0 -translate-y-1/2 text-xs text-gray-600'
              }
              ${error ? 'text-red-500' : ''}
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        </div>

        {/* Dropdown customizado */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            {/* Campo de busca */}
            {searchable && (
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green focus:ring-1 focus:ring-krooa-green/20"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}

            {/* Lista de opções */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-3">
                  <div className="text-sm text-gray-500 mb-2">
                    Nenhuma opção encontrada
                  </div>
                  {addable && searchTerm && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-krooa-blue hover:bg-blue-50 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar "{searchTerm}"
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      className={`
                        flex items-center justify-between group
                        ${selectedValues.includes(option.value) ? 'bg-krooa-green/10' : ''}
                        ${highlightedIndex === index ? 'bg-gray-50' : ''}
                        hover:bg-gray-50
                      `}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {editingOption === option.value ? (
                        <div className="flex items-center gap-2 w-full px-3 py-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleEditOption(option.value, editValue);
                              } else if (e.key === 'Escape') {
                                setEditingOption(null);
                                setEditValue('');
                              }
                            }}
                            className="flex-1 px-2 py-1 text-sm border border-krooa-green rounded focus:outline-none focus:ring-1 focus:ring-krooa-green"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleEditOption(option.value, editValue)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingOption(null);
                              setEditValue('');
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`
                              flex-1 px-3 py-2 text-left text-sm transition-colors flex items-center gap-2
                              ${selectedValues.includes(option.value) ? 'text-krooa-dark font-medium' : 'text-gray-700'}
                            `}
                          >
                            {multiple && (
                              <div className={`
                                w-4 h-4 rounded border-2 flex items-center justify-center
                                ${selectedValues.includes(option.value)
                                  ? 'bg-krooa-green border-krooa-green'
                                  : 'border-gray-300'}
                              `}>
                                {selectedValues.includes(option.value) && (
                                  <Check className="w-3 h-3 text-krooa-dark" />
                                )}
                              </div>
                            )}
                            {option.label}
                          </button>
                          {(editable || (addable && options.length > 5)) && (
                            <div className="flex items-center gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {editable && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingOption(option.value);
                                    setEditValue(option.label);
                                  }}
                                  className="p-1 text-gray-400 hover:text-krooa-blue transition-colors"
                                  title="Editar"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              )}
                              {editable && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOption(option.value)}
                                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  {addable && searchTerm && !options.find(opt =>
                    normalizeText(opt.label) === normalizeText(searchTerm)
                  ) && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-krooa-blue hover:bg-blue-50 border-t border-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar "{searchTerm}"
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            w-full h-10 rounded-lg border border-gray-300 px-3 py-2 pr-10 text-left
            focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${isOpen ? 'border-krooa-green ring-2 ring-krooa-green/20' : ''}
            ${error ? 'border-red-300' : ''}
            ${className}
          `}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : 'Selecione...'}
          </span>
        </button>

        {/* Ícone da seta */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown customizado */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          {/* Campo de busca */}
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green focus:ring-1 focus:ring-krooa-green/20"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          {/* Lista de opções */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Nenhuma opção encontrada
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    w-full px-3 py-2 text-left text-sm transition-colors
                    ${option.value === value ? 'bg-krooa-green/10 text-krooa-dark font-medium' : 'text-gray-700'}
                    ${highlightedIndex === index ? 'bg-gray-50' : ''}
                    hover:bg-gray-50
                  `}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}