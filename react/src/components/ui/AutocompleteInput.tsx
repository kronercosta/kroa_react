import React, { useState, useRef, useEffect } from 'react';
import { Search, Edit2, Trash2, Plus, Settings } from 'lucide-react';

interface AutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  floating?: boolean;
  onManage?: () => void; // Callback para abrir modal de gerenciamento
}

export function AutocompleteInput({
  label,
  value,
  onChange,
  suggestions = [],
  placeholder = '',
  disabled = false,
  error,
  fullWidth = true,
  floating = true,
  onManage
}: AutocompleteInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showManageModal, setShowManageModal] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [managedSuggestions, setManagedSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Lista padrão de cargos comuns
  const defaultSuggestions = [
    'Dentista',
    'Ortodontista',
    'Endodontista',
    'Periodontista',
    'Implantodontista',
    'Odontopediatra',
    'Cirurgião Bucomaxilofacial',
    'Protesista',
    'Clínico Geral',
    'Auxiliar de Saúde Bucal',
    'Técnico em Saúde Bucal',
    'Recepcionista',
    'Secretária',
    'Gerente',
    'Coordenador',
    'Supervisor',
    'Assistente Administrativo',
    'Auxiliar Administrativo',
    'Faturista',
    'Financeiro',
    'Recursos Humanos',
    'Marketing',
    'Comercial',
    'Atendente',
    'Telefonista',
    'Segurança',
    'Serviços Gerais',
    'Manutenção',
    'TI - Suporte',
    'Enfermeiro',
    'Técnico de Enfermagem',
    'Médico',
    'Fisioterapeuta',
    'Nutricionista',
    'Psicólogo',
    'Fonoaudiólogo'
  ];

  // Inicializa managedSuggestions com defaultSuggestions na primeira vez
  useEffect(() => {
    if (managedSuggestions.length === 0) {
      setManagedSuggestions(suggestions.length > 0 ? suggestions : defaultSuggestions);
    }
  }, []);

  const allSuggestions = managedSuggestions.length > 0 ? managedSuggestions : (suggestions.length > 0 ? suggestions : defaultSuggestions);

  useEffect(() => {
    if (value && isFocused) {
      const filtered = allSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      // Sempre mostra sugestões quando há texto digitado
      setShowSuggestions(true);
    } else if (isFocused && !value) {
      // Mostra algumas sugestões quando o campo está vazio e focado
      setFilteredSuggestions(allSuggestions.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [value, isFocused, allSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleAddNew = () => {
    const trimmedValue = value.trim();
    if (trimmedValue && !allSuggestions.some(s => s.toLowerCase() === trimmedValue.toLowerCase())) {
      const newSuggestions = [...allSuggestions, trimmedValue];
      setManagedSuggestions(newSuggestions);
      onChange(trimmedValue);
      setShowSuggestions(false);
    }
  };

  const handleEdit = (oldValue: string) => {
    setEditingItem(oldValue);
    setEditValue(oldValue);
  };

  const handleSaveEdit = () => {
    if (editValue && editingItem) {
      const index = managedSuggestions.indexOf(editingItem);
      if (index !== -1) {
        const newSuggestions = [...managedSuggestions];
        newSuggestions[index] = editValue;
        setManagedSuggestions(newSuggestions);
        if (value === editingItem) {
          onChange(editValue);
        }
      }
      setEditingItem(null);
      setEditValue('');
    }
  };

  const handleDelete = (item: string) => {
    setManagedSuggestions(managedSuggestions.filter(s => s !== item));
    if (value === item) {
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && filteredSuggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev =>
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSuggestionClick(filteredSuggestions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setHighlightedIndex(-1);
          break;
      }
    }
  };

  const hasValue = value && value.length > 0;

  if (floating && label) {
    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              if (!value) {
                setFilteredSuggestions(allSuggestions.slice(0, 8));
                setShowSuggestions(true);
              }
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`
              peer w-full h-10 rounded-lg border border-gray-300 px-3 py-2 pr-8
              focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
              disabled:bg-gray-50 disabled:text-gray-500
              ${error ? 'border-red-300' : ''}
            `}
            placeholder=" "
          />

          <label
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none
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

          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              {/* Header com botão de gerenciar */}
              <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <span className="text-xs font-medium text-gray-600">Sugestões</span>
                <button
                  type="button"
                  onClick={() => setShowManageModal(true)}
                  className="flex items-center gap-1 text-xs text-krooa-blue hover:text-krooa-dark font-medium transition-colors"
                >
                  <Settings className="w-3 h-3" />
                  Gerenciar
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {filteredSuggestions.length === 0 ? (
                  <div className="p-3">
                    <div className="text-sm text-gray-500 mb-2">
                      Nenhuma sugestão encontrada para "{value}"
                    </div>
                    {value && (
                      <button
                        type="button"
                        onClick={handleAddNew}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-krooa-blue hover:bg-blue-50 rounded transition-colors font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar "{value}" como novo cargo
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`
                          flex items-center justify-between group hover:bg-gray-50
                          ${highlightedIndex === index ? 'bg-krooa-green/10' : ''}
                        `}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {editingItem === suggestion ? (
                          <div className="flex items-center gap-2 w-full px-3 py-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSaveEdit();
                                } else if (e.key === 'Escape') {
                                  setEditingItem(null);
                                  setEditValue('');
                                }
                              }}
                              className="flex-1 px-2 py-1 text-sm border border-krooa-green rounded focus:outline-none focus:ring-1 focus:ring-krooa-green"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={handleSaveEdit}
                              className="text-green-600 hover:text-green-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(null);
                                setEditValue('');
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="flex-1 px-4 py-2 text-left text-sm text-gray-700"
                            >
                              {suggestion}
                            </button>
                            <div className="flex items-center gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleEdit(suggestion)}
                                className="p-1 text-gray-400 hover:text-krooa-blue transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(suggestion)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {value && !allSuggestions.some(s => s.toLowerCase() === value.toLowerCase()) && (
                      <button
                        type="button"
                        onClick={handleAddNew}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-krooa-blue hover:bg-blue-50 border-t border-gray-100 transition-colors font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar "{value}" como novo cargo
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {/* Modal de gerenciamento */}
        {showManageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Gerenciar Cargos e Funções</h3>
                <button
                  type="button"
                  onClick={() => setShowManageModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="text"
                      id="new-position-input"
                      placeholder="Adicionar novo cargo..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green focus:ring-2 focus:ring-krooa-green/20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          const value = input.value.trim();
                          if (value && !managedSuggestions.includes(value)) {
                            setManagedSuggestions([...managedSuggestions, value]);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('new-position-input') as HTMLInputElement;
                        if (input) {
                          const value = input.value.trim();
                          if (value && !managedSuggestions.includes(value)) {
                            setManagedSuggestions([...managedSuggestions, value]);
                            input.value = '';
                          }
                        }
                      }}
                      className="px-4 py-2 bg-krooa-blue text-white rounded-lg hover:bg-krooa-blue/90 transition-colors flex items-center gap-2 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600 mb-2">Cargos cadastrados ({managedSuggestions.length})</div>
                  {managedSuggestions.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      {editingItem === item ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveEdit();
                              } else if (e.key === 'Escape') {
                                setEditingItem(null);
                                setEditValue('');
                              }
                            }}
                            className="flex-1 px-3 py-1.5 text-sm border border-krooa-green rounded focus:outline-none focus:ring-1 focus:ring-krooa-green"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="p-1.5 text-green-600 hover:text-green-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(null);
                              setEditValue('');
                            }}
                            className="p-1.5 text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm text-gray-700">{item}</span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="p-1.5 text-gray-400 hover:text-krooa-blue transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Tem certeza que deseja excluir "${item}"?`)) {
                                  handleDelete(item);
                                }
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowManageModal(false)}
                  className="px-4 py-2 bg-krooa-blue text-white rounded-lg hover:bg-krooa-blue/90 transition-colors font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Versão sem floating label
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (!value) {
              setFilteredSuggestions(allSuggestions.slice(0, 8));
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full rounded-xl border border-gray-300 px-4 py-2.5 pr-10
            focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-red-300' : ''}
          `}
        />

        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            {/* Header com botão de gerenciar */}
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-medium text-gray-600">Sugestões</span>
              <button
                type="button"
                onClick={() => setShowManageModal(true)}
                className="flex items-center gap-1 text-xs text-krooa-blue hover:text-krooa-dark font-medium transition-colors"
              >
                <Settings className="w-3 h-3" />
                Gerenciar
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredSuggestions.length === 0 ? (
                <div className="p-3">
                  <div className="text-sm text-gray-500 mb-2">
                    Nenhuma sugestão encontrada para "{value}"
                  </div>
                  {value && (
                    <button
                      type="button"
                      onClick={handleAddNew}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-krooa-blue hover:bg-blue-50 rounded transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar "{value}" como novo cargo
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`
                        flex items-center justify-between group hover:bg-gray-50
                        ${highlightedIndex === index ? 'bg-krooa-green/10' : ''}
                      `}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {editingItem === suggestion ? (
                        <div className="flex items-center gap-2 w-full px-3 py-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSaveEdit();
                              } else if (e.key === 'Escape') {
                                setEditingItem(null);
                                setEditValue('');
                              }
                            }}
                            className="flex-1 px-2 py-1 text-sm border border-krooa-green rounded focus:outline-none focus:ring-1 focus:ring-krooa-green"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="text-green-600 hover:text-green-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(null);
                              setEditValue('');
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="flex-1 px-4 py-2 text-left text-sm text-gray-700"
                          >
                            {suggestion}
                          </button>
                          <div className="flex items-center gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleEdit(suggestion)}
                              className="p-1 text-gray-400 hover:text-krooa-blue transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(suggestion)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {value && !allSuggestions.some(s => s.toLowerCase() === value.toLowerCase()) && (
                    <button
                      type="button"
                      onClick={handleAddNew}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-krooa-blue hover:bg-blue-50 border-t border-gray-100 transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar "{value}" como novo cargo
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}