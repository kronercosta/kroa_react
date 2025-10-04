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

interface EnhancedSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
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

export function EnhancedSelect({
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
  confirmDelete = true,
  allowTransfer = true,
  hierarchical = false,
  placeholder = "Selecione...",
  ...props
}: EnhancedSelectProps) {
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

  // Organizar opções hierarquicamente
  const getHierarchicalOptions = (): Option[] => {
    if (!hierarchical) return options;

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

  // Busca melhorada ignorando acentos
  const displayOptions = getHierarchicalOptions();
  const filteredOptions = displayOptions.filter(option => {
    const normalizedLabel = normalizeText(option.label);
    const normalizedSearch = normalizeText(searchTerm);
    return normalizedLabel.includes(normalizedSearch);
  });

  // Contar filhos de uma categoria
  const getChildrenCount = (categoryValue: string): number => {
    return options.filter(opt => opt.parentValue === categoryValue).length;
  };

  // Verificar se categoria tem filhos
  const hasChildren = (option: Option): boolean => {
    return hierarchical && !option.parentValue && getChildrenCount(option.value) > 0;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setNewItemText('');
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

  const toggleCategory = (categoryValue: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryValue)) {
      newExpanded.delete(categoryValue);
    } else {
      newExpanded.add(categoryValue);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSelect = (option: Option, e?: React.MouseEvent) => {
    // Se clicou na seta, apenas expande/colapsa
    const target = e?.target as HTMLElement;
    if (target && target.closest('.expand-arrow')) {
      toggleCategory(option.value);
      return;
    }

    // Categorias com filhos podem ser selecionadas normalmente
    // A expansão só acontece ao clicar na seta

    if (multiple) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];

      onChange?.({
        target: {
          value: newValues,
          name
        }
      });
    } else {
      onChange?.({
        target: {
          value: option.value,
          name
        }
      });
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleAddNew = () => {
    if (!newItemText.trim()) return;

    const newOption: Option = {
      value: `new_${Date.now()}`,
      label: newItemText.trim(),
      parentValue: hierarchical && selectedParent ? selectedParent : undefined
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

    const hasChildrenOptions = hierarchical && getChildrenCount(option.value) > 0;
    setDeleteConfirmation({
      option,
      showTransfer: allowTransfer && hasChildrenOptions
    });
  };

  const handleDelete = (option: Option, transferTo?: string) => {
    let updatedOptions = options.filter(opt => opt.value !== option.value);

    // Se há transferência, atualizar os filhos
    if (transferTo && hierarchical) {
      updatedOptions = updatedOptions.map(opt => {
        if (opt.parentValue === option.value) {
          return { ...opt, parentValue: transferTo === 'root' ? undefined : transferTo };
        }
        return opt;
      });
    } else {
      // Remover também os filhos se não houver transferência
      if (hierarchical) {
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
    if (!isOpen) return;

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
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={`
            border rounded-lg bg-white cursor-pointer flex items-center
            ${fullWidth ? 'w-full' : ''}
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
            ${className}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex-1 px-3 py-2 pr-10">
            {multiple && selectedValues.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map(opt => (
                  <span
                    key={opt.value}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-krooa-blue/10 text-krooa-blue text-sm rounded-md"
                  >
                    {opt.label}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-krooa-green"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(opt, e);
                      }}
                    />
                  </span>
                ))}
              </div>
            ) : (
              <span className={!hasValue ? 'text-gray-400' : ''}>
                {selectedOption?.label || placeholder}
              </span>
            )}
          </div>
          <ChevronDown
            className={`
              absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform
              ${isOpen ? 'rotate-180' : ''}
            `}
          />
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto"
          >
            {searchable && (
              <div className="sticky top-0 bg-white border-b border-gray-100 p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-krooa-green"
                  />
                </div>
              </div>
            )}

            {/* Botão Fixo de Adicionar */}
            {addable && (
              <div className="sticky top-[52px] bg-white border-b border-gray-100 p-2">
                <div className="flex gap-2">
                  {hierarchical && (
                    <select
                      value={selectedParent}
                      onChange={(e) => setSelectedParent(e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-krooa-green"
                    >
                      <option value="">Categoria Principal</option>
                      {options.filter(opt => !opt.parentValue).map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  )}
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newItemText.trim()) {
                        handleAddNew();
                      }
                    }}
                    placeholder="Digite para adicionar..."
                    className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-krooa-green"
                  />
                  <button
                    onClick={handleAddNew}
                    className="px-3 py-1 bg-krooa-green text-white text-sm rounded-md hover:bg-krooa-green/90 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>
            )}

            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  {searchTerm ? 'Nenhum resultado encontrado' : 'Sem opções disponíveis'}
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value);
                  const isHighlighted = index === highlightedIndex;
                  const isCategory = hierarchical && !option.parentValue;
                  const isExpanded = expandedCategories.has(option.value);
                  const childCount = getChildrenCount(option.value);

                  return (
                    <div
                      key={option.value}
                      className={`
                        flex items-center justify-between px-3 py-2 cursor-pointer
                        ${isHighlighted ? 'bg-gray-100' : ''}
                        ${isSelected ? 'bg-krooa-blue/5' : ''}
                        hover:bg-gray-50
                        ${option.level === 1 ? 'pl-8' : ''}
                      `}
                      onClick={(e) => handleSelect(option, e)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {isCategory && hasChildren(option) && (
                          <div
                            className="expand-arrow p-1 hover:bg-gray-200 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategory(option.value);
                            }}
                          >
                            <ChevronRight
                              className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            />
                          </div>
                        )}
                        {multiple && (
                          <div
                            className={`
                              w-4 h-4 border rounded
                              ${isSelected ? 'bg-krooa-green border-krooa-green' : 'border-gray-300'}
                            `}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        )}
                        <span className={`text-sm ${isCategory && !option.parentValue ? 'font-medium' : ''}`}>
                          {option.label}
                          {isCategory && childCount > 0 && (
                            <span className="ml-2 text-xs text-gray-400">({childCount})</span>
                          )}
                        </span>
                      </div>

                      {(editable || addable) && (
                        <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                          {editingOption === option.value ? (
                            <>
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEdit(option);
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingOption(null);
                                    setEditValue('');
                                  }
                                }}
                                className="px-2 py-0.5 text-sm border border-gray-200 rounded"
                                autoFocus
                              />
                              <Check
                                className="w-4 h-4 text-green-500 cursor-pointer hover:text-green-600"
                                onClick={() => handleEdit(option)}
                              />
                              <X
                                className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-600"
                                onClick={() => {
                                  setEditingOption(null);
                                  setEditValue('');
                                }}
                              />
                            </>
                          ) : (
                            <>
                              {editable && (
                                <Edit2
                                  className="w-4 h-4 text-gray-400 hover:text-krooa-blue"
                                  onClick={() => {
                                    setEditingOption(option.value);
                                    setEditValue(option.label);
                                  }}
                                />
                              )}
                              {addable && (
                                <Trash2
                                  className="w-4 h-4 text-gray-400 hover:text-red-500"
                                  onClick={() => handleDeleteRequest(option)}
                                />
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold">Confirmar Exclusão</h3>
            </div>

            <p className="text-gray-600 mb-4">
              Tem certeza que deseja excluir "{deleteConfirmation.option.label}"?
            </p>

            {deleteConfirmation.showTransfer && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  Esta categoria possui subcategorias. O que deseja fazer com elas?
                </p>
                <select
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-krooa-green"
                  onChange={(e) => setDeleteConfirmation({ ...deleteConfirmation, transferTo: e.target.value })}
                >
                  <option value="">Excluir também as subcategorias</option>
                  <option value="root">Mover para categoria principal</option>
                  {options
                    .filter(opt => !opt.parentValue && opt.value !== deleteConfirmation.option.value)
                    .map(cat => (
                      <option key={cat.value} value={cat.value}>
                        Mover para "{cat.label}"
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmation.option, deleteConfirmation.transferTo)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}