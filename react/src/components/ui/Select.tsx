import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Plus, Edit2, Trash2, X, Check, AlertTriangle, ChevronRight } from 'lucide-react';
import { Button, IconButton } from './Button';

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
  affectedRecordsCount?: number;
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
  editable?: boolean; // Quando true, permite editar e adicionar novas opções
  onOptionsChange?: (options: Option[]) => void;
  // Props do modo avançado
  enhanced?: boolean; // Ativa modo avançado com hierarquia
  confirmDelete?: boolean; // Pedir confirmação ao deletar
  allowTransfer?: boolean; // Permitir transferência de registros
  hierarchical?: boolean; // Suporte a níveis hierárquicos
  placeholder?: string;
  advancedEdit?: boolean; // Se true, abre modal ao invés de edição inline
  onEdit?: (option: Option) => void; // Callback para quando a edição é salva
  editModalContent?: (option: Option, onSave: (updatedOption: Option) => void, onCancel: () => void) => React.ReactNode; // Conteúdo customizado do modal
  // Props para controle de exclusão
  showDeleteAndReplace?: boolean; // Permitir exclusão com substituição automática
  onDeleteAndReplace?: (deletedOption: Option, replacementOption: Option) => void; // Callback para exclusão com substituição
  deleteConfirmationText?: string; // Texto customizado para confirmação
  allowDeleteWithoutTransfer?: boolean; // Permitir exclusão sem transferir registros (padrão: true)
  getAffectedRecordsCount?: (option: Option) => number; // Função para obter quantidade de registros afetados
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
  onOptionsChange,
  // Props avançadas
  enhanced = false,
  confirmDelete = false,
  allowTransfer = false,
  hierarchical = false,
  placeholder,
  advancedEdit = false,
  onEdit,
  editModalContent,
  // Props de exclusão
  showDeleteAndReplace = false,
  onDeleteAndReplace,
  deleteConfirmationText,
  allowDeleteWithoutTransfer = true,
  getAffectedRecordsCount,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [options, setOptions] = useState(initialOptions);
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation | null>(null);
  const [replacementOption, setReplacementOption] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showAddField, setShowAddField] = useState(false);
  const [editModalOption, setEditModalOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Atualiza o estado interno quando as opções externas mudam
  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

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
      // Se a categoria está expandida, mostra os filhos
      if (expandedCategories.has(cat.value)) {
        children.forEach(child => {
          organized.push({ ...child, level: 1 });
        });
      }
    });

    // Se não há categorias organizadas, retorna todas as opções
    return organized.length > 0 ? organized : options;
  };

  // Contar filhos de uma categoria
  const getChildrenCount = (categoryValue: string): number => {
    return options.filter(opt => opt.parentValue === categoryValue).length;
  };

  // Verificar se categoria tem filhos
  const hasChildren = (option: Option): boolean => {
    return hierarchical && !option.parentValue && getChildrenCount(option.value) > 0;
  };

  // Busca melhorada ignorando acentos
  const displayOptions = hierarchical ? getHierarchicalOptions() : options;

  // Se tem busca e é hierárquico, expande temporariamente todas as categorias que têm match
  const filteredOptions = (() => {
    if (!searchTerm) {
      return displayOptions;
    }

    const normalizedSearch = normalizeText(searchTerm);

    if (hierarchical) {
      // Primeiro, encontra todas as opções que fazem match
      const matchingOptions = options.filter(option => {
        const normalizedLabel = normalizeText(option.label);
        return normalizedLabel.includes(normalizedSearch);
      });

      // Organiza hierarquicamente com todas as categorias relevantes expandidas
      const result: Option[] = [];
      const categoriesToShow = new Set<string>();

      // Identifica categorias que precisam aparecer
      matchingOptions.forEach(opt => {
        if (opt.parentValue) {
          categoriesToShow.add(opt.parentValue);
        } else if (!opt.parentValue) {
          categoriesToShow.add(opt.value);
        }
      });

      // Monta a lista organizada
      options.forEach(opt => {
        if (!opt.parentValue && categoriesToShow.has(opt.value)) {
          // É uma categoria que precisa aparecer
          result.push(opt);
          // Adiciona os filhos que fazem match
          const children = matchingOptions.filter(child => child.parentValue === opt.value);
          children.forEach(child => {
            result.push({ ...child, level: 1 });
          });
        }
      });

      return result;
    } else {
      // Busca normal para não-hierárquico
      return displayOptions.filter(option => {
        const normalizedLabel = normalizeText(option.label);
        return normalizedLabel.includes(normalizedSearch);
      });
    }
  })();

  const toggleCategory = (categoryValue: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryValue)) {
      newExpanded.delete(categoryValue);
    } else {
      newExpanded.add(categoryValue);
    }
    setExpandedCategories(newExpanded);
  };

  // Expande todas as categorias quando modo hierárquico é ativado
  useEffect(() => {
    if (hierarchical) {
      // Pequeno delay para garantir que as opções foram atualizadas
      setTimeout(() => {
        const categories = options.filter(opt => !opt.parentValue);
        const allCategories = new Set(categories.map(cat => cat.value));
        setExpandedCategories(allCategories);
      }, 0);
    } else {
      setExpandedCategories(new Set());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hierarchical, options.length]); // Monitora mudança no número de opções

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        setSearchTerm('');
        setNewItemText('');
        setShowAddField(false);
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

  const handleSelect = (option: Option, e?: React.MouseEvent) => {
    // Se é hierárquico e clicou na seta, apenas expande/colapsa
    const target = e?.target as HTMLElement;
    if (hierarchical && target && target.closest('.expand-arrow')) {
      toggleCategory(option.value);
      return;
    }

    // Se é hierárquico e é uma categoria (não tem parentValue), apenas expande/colapsa
    if (hierarchical && !option.parentValue && hasChildren(option)) {
      toggleCategory(option.value);
      return;
    }

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
    if (!newItemText.trim() && !searchTerm.trim()) return;

    const textToAdd = newItemText.trim() || searchTerm.trim();

    // Se hierárquico e tem uma categoria pai selecionada, adiciona como subcategoria
    let parentValue = undefined;
    if (hierarchical && selectedParent && selectedParent !== 'root') {
      parentValue = selectedParent;
    }

    const newOption: Option = {
      value: `new_${Date.now()}`,
      label: textToAdd,
      parentValue
    };

    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    onOptionsChange?.(updatedOptions);
    setNewItemText('');
    setSearchTerm('');
    setShowAddField(false);
    setSelectedParent(''); // Limpa a seleção do pai

    // Se adicionou como subcategoria, expande a categoria pai
    if (parentValue) {
      const newExpanded = new Set(expandedCategories);
      newExpanded.add(parentValue);
      setExpandedCategories(newExpanded);
    }

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
    const affectedRecordsCount = getAffectedRecordsCount ? getAffectedRecordsCount(option) : 0;

    setDeleteConfirmation({
      option,
      showTransfer: allowTransfer && hasChildrenOptions,
      affectedRecordsCount
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

    // Se há substituição automática, chamar callback
    if (showDeleteAndReplace && replacementOption && onDeleteAndReplace) {
      const replacement = options.find(opt => opt.value === replacementOption);
      if (replacement) {
        onDeleteAndReplace(option, replacement);
      }
    }

    setOptions(updatedOptions);
    onOptionsChange?.(updatedOptions);
    setDeleteConfirmation(null);
    setReplacementOption('');

    // Se o item deletado estava selecionado, substituir pela opção de substituição ou limpar
    if (selectedValues.includes(option.value)) {
      if (multiple) {
        const newValues = selectedValues.filter(v => v !== option.value);
        // Se há substituição, adicionar à seleção
        if (replacementOption && !newValues.includes(replacementOption)) {
          newValues.push(replacementOption);
        }
        onChange?.({ target: { value: newValues, name } });
      } else {
        // Para seleção única, substituir diretamente
        const newValue = replacementOption || '';
        onChange?.({ target: { value: newValue, name } });
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
        } else if (editable && searchTerm.trim()) {
          handleAddNew();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {label && !floating && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={`
            peer border rounded-lg bg-white cursor-pointer flex items-center h-10
            ${fullWidth ? 'w-full' : ''}
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
            ${isFocused ? 'border-krooa-green ring-2 ring-krooa-green/20' : ''}
            ${className}
          `}
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              setIsFocused(true);
            }
          }}
        >
          <div className="flex-1 px-3 py-2 pr-10 overflow-hidden">
            {multiple && selectedValues.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map(opt => (
                  <span
                    key={opt.value}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-krooa-blue/10 text-krooa-blue text-sm rounded-md max-w-full"
                  >
                    <span className="truncate">{opt.label}</span>
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-krooa-green flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(opt, e);
                      }}
                    />
                  </span>
                ))}
              </div>
            ) : (
              <span className={`truncate block ${hasValue ? '' : 'invisible'}`}>
                {selectedOption?.label || ' '}
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

        {floating && label && (
          <label
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1
              ${hasValue || isFocused || isOpen
                ? 'top-0 -translate-y-1/2 text-xs'
                : 'top-1/2 -translate-y-1/2 text-sm'
              }
              ${isFocused || isOpen
                ? 'text-blue-900'
                : error
                  ? 'text-red-500'
                  : 'text-gray-500'
              }
              peer-disabled:text-gray-400
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

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


            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  {searchTerm ? 'Nenhum resultado encontrado' : 'Sem opções disponíveis'}
                  {editable && searchTerm && (
                    <button
                      onClick={handleAddNew}
                      className="mt-2 block w-full text-left px-3 py-2 text-sm text-krooa-blue hover:bg-gray-50"
                    >
                      <Plus className="inline w-4 h-4 mr-1" />
                      Adicionar "{searchTerm}"
                    </button>
                  )}
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value);
                  const isHighlighted = index === highlightedIndex;
                  const isCategory = hierarchical && !option.parentValue;
                  const isExpanded = expandedCategories.has(option.value);
                  const childCount = getChildrenCount(option.value);

                  const isSelectable = !hierarchical || option.parentValue || !hasChildren(option);

                  return (
                    <div
                      key={option.value}
                      className={`
                        group flex items-center justify-between px-3 py-2 transition-colors
                        ${isSelectable ? 'cursor-pointer' : 'cursor-default'}
                        ${isHighlighted && isSelectable && !isSelected ? 'bg-gray-100' : ''}
                        ${isSelected ? 'bg-krooa-green/20 text-krooa-dark' : ''}
                        ${isSelectable && !isSelected ? 'hover:bg-gray-75' : ''}
                        ${option.level === 1 ? 'pl-8' : ''}
                        ${isCategory && hasChildren(option) ? 'bg-gray-100 font-semibold text-gray-700' : ''}
                      `}
                      onClick={(e) => handleSelect(option, e)}
                      onMouseEnter={() => isSelectable && setHighlightedIndex(index)}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {isCategory && hasChildren(option) && (
                          <ChevronRight
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategory(option.value);
                            }}
                            className={`w-4 h-4 text-gray-400 transition-transform cursor-pointer hover:text-gray-600 ${isExpanded ? 'rotate-90' : ''}`}
                          />
                        )}
                        {multiple && isSelectable && (
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

                      {editable && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
                                className="w-3 h-3 text-green-500 cursor-pointer hover:text-green-600"
                                onClick={() => handleEdit(option)}
                              />
                              <X
                                className="w-3 h-3 text-red-500 cursor-pointer hover:text-red-600"
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
                                  className="w-3 h-3 text-gray-400 hover:text-krooa-blue cursor-pointer"
                                  onClick={() => {
                                    if (advancedEdit && editModalContent) {
                                      // Abrir modal de edição avançada
                                      setEditModalOption(option);
                                      setIsOpen(false);
                                    } else {
                                      // Edição inline simples
                                      setEditingOption(option.value);
                                      setEditValue(option.label);
                                    }
                                  }}
                                  title={advancedEdit ? "Edição avançada" : "Editar"}
                                />
                              )}
                              {editable && (
                                <Trash2
                                  className="w-3 h-3 text-gray-400 hover:text-red-500 cursor-pointer"
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

            {/* Botão de adicionar no final do dropdown */}
            {editable && (
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-2">
                {!showAddField ? (
                  <Button
                    onClick={() => setShowAddField(true)}
                    variant="ghost"
                    size="sm"
                    fullWidth
                    icon={<Plus className="w-4 h-4" />}
                    className="text-krooa-blue"
                  >
                    Adicionar novo item
                  </Button>
                ) : (
                  <div className="space-y-2">
                    {hierarchical && (
                      <select
                        value={selectedParent}
                        onChange={(e) => setSelectedParent(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-krooa-green"
                      >
                        <option value="">Selecione o tipo...</option>
                        <option value="root">Categoria Principal</option>
                        {options.filter(opt => !opt.parentValue).map(cat => (
                          <option key={cat.value} value={cat.value}>
                            Subcategoria de {cat.label}
                          </option>
                        ))}
                      </select>
                    )}
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newItemText.trim()) {
                            handleAddNew();
                          }
                          if (e.key === 'Escape') {
                            setShowAddField(false);
                            setNewItemText('');
                            setSelectedParent('');
                          }
                        }}
                        placeholder="Nome do novo item..."
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-krooa-green"
                        autoFocus={!hierarchical}
                      />
                    <Button
                      onClick={handleAddNew}
                      disabled={!newItemText.trim()}
                      variant="primary"
                      size="sm"
                      icon={<Plus className="w-4 h-4" />}
                    >
                      Adicionar
                    </Button>
                    <IconButton
                      onClick={() => {
                        setShowAddField(false);
                        setNewItemText('');
                        setSelectedParent('');
                      }}
                      variant="ghost"
                      size="sm"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4" />
                    </IconButton>
                  </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full transform transition-all">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold text-krooa-dark">
                Excluir {deleteConfirmation.option.label}
              </h3>
              <IconButton
                className="absolute right-4 top-4"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteConfirmation(null);
                  setReplacementOption('');
                }}
              >
                <X className="w-6 h-6" />
              </IconButton>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <div className="space-y-4">
                {/* Alert com contagem de registros */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-800">
                        {deleteConfirmation.affectedRecordsCount || 0} registros serão afetados
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        {deleteConfirmationText ||
                          `Tem certeza que deseja excluir ${deleteConfirmation.option.label}?`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Opções de transferência */}
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">
                    Você pode transferir os dados para outra opção ou excluir permanentemente.
                  </p>

                  {/* Select de transferência */}
                  <div className="relative">
                    <div
                      className="peer border rounded-lg bg-white cursor-pointer flex items-center h-10 border-gray-300"
                      onClick={() => {
                        // Implementar abertura do dropdown se necessário
                      }}
                    >
                      <div className="flex-1 px-3 py-2 pr-10">
                        <span className={replacementOption ? '' : 'text-gray-500'}>
                          {replacementOption
                            ? options.find(opt => opt.value === replacementOption)?.label
                            : 'Não transferir (excluir permanentemente)'
                          }
                        </span>
                      </div>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform" />
                    </div>

                    {/* Dropdown customizado ou select nativo */}
                    <select
                      value={replacementOption}
                      onChange={(e) => setReplacementOption(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                      <option value="">Não transferir (excluir permanentemente)</option>
                      {options
                        .filter(opt => opt.value !== deleteConfirmation.option.value)
                        .map(opt => (
                          <option key={opt.value} value={opt.value}>
                            Transferir para "{opt.label}"
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer com botões */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setDeleteConfirmation(null);
                    setReplacementOption('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(deleteConfirmation.option, replacementOption)}
                >
                  Excluir Permanentemente
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição Avançada */}
      {editModalOption && editModalContent && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {editModalContent(
              editModalOption,
              (updatedOption) => {
                // Salvar a opção atualizada
                const updatedOptions = options.map(opt =>
                  opt.value === updatedOption.value ? updatedOption : opt
                );
                setOptions(updatedOptions);
                onOptionsChange?.(updatedOptions);
                setEditModalOption(null);

                // Se havia callback onEdit, chamar
                if (onEdit) {
                  onEdit(updatedOption);
                }
              },
              () => setEditModalOption(null)
            )}
          </div>
        </div>
      )}
    </div>
  );
}