import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { UnifiedInput } from '../../../components/ui/UnifiedInput';
import type { MaskType, ValidationType } from '../../../components/ui/UnifiedInput';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Calendar, Clock, CreditCard, DollarSign, Hash, Mail, Globe, Phone, MapPin, FileText, Percent, Palette, Camera, Navigation } from 'lucide-react';

export default function UnifiedShowcase() {
  // Estados para o Input Unificado
  const [inputValue, setInputValue] = useState('');
  const [inputData, setInputData] = useState<any>(null);
  const [inputProps, setInputProps] = useState<any>({
    label: 'Campo de Teste',
    required: false,
    disabled: false,
    fullWidth: false,
    mask: 'none' as MaskType,
    validation: 'none' as ValidationType,
    icon: false,
    error: '',
    showPasswordToggle: true,
    defaultCountry: 'BR',
    allowNoNumber: true,
    noNumberText: 'S/N',
    // Props do timepicker
    timeIntervals: 30,
    timeStart: '00:00',
    timeEnd: '23:59'
  });

  // Estados para o Select
  const [selectValue, setSelectValue] = useState<string | string[]>('');
  const [selectProps, setSelectProps] = useState({
    label: 'Select de Teste',
    required: false,
    disabled: false,
    fullWidth: false,
    multiple: false,
    searchable: true,
    editable: false,
    advancedEdit: false,
    hierarchical: false,
    confirmDelete: false,
    error: ''
  });

  // Options básicas para select normal
  const basicOptions = [
    { value: 'SP', label: 'São Paulo' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'PR', label: 'Paraná' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'RS', label: 'Rio Grande do Sul' }
  ];

  // Options hierárquicas para quando o checkbox hierárquico estiver marcado
  const hierarchicalOptions = [
    // Categorias principais
    { value: 'eletronicos', label: 'Eletrônicos' },
    { value: 'roupas', label: 'Roupas' },
    { value: 'alimentos', label: 'Alimentos' },
    { value: 'moveis', label: 'Móveis' },

    // Subcategorias de Eletrônicos
    { value: 'smartphones', label: 'Smartphones', parentValue: 'eletronicos' },
    { value: 'notebooks', label: 'Notebooks', parentValue: 'eletronicos' },
    { value: 'tablets', label: 'Tablets', parentValue: 'eletronicos' },

    // Subcategorias de Roupas
    { value: 'masculino', label: 'Masculino', parentValue: 'roupas' },
    { value: 'feminino', label: 'Feminino', parentValue: 'roupas' },
    { value: 'infantil', label: 'Infantil', parentValue: 'roupas' },

    // Subcategorias de Alimentos
    { value: 'bebidas', label: 'Bebidas', parentValue: 'alimentos' },
    { value: 'carnes', label: 'Carnes', parentValue: 'alimentos' },
    { value: 'laticinios', label: 'Laticínios', parentValue: 'alimentos' },

    // Subcategorias de Móveis
    { value: 'sala', label: 'Sala', parentValue: 'moveis' },
    { value: 'quarto', label: 'Quarto', parentValue: 'moveis' },
    { value: 'cozinha', label: 'Cozinha', parentValue: 'moveis' },
  ];

  const [selectOptions, setSelectOptions] = useState(basicOptions);

  // Atualiza as options quando o checkbox hierárquico muda
  useEffect(() => {
    if (selectProps.hierarchical) {
      setSelectOptions(hierarchicalOptions);
      setSelectValue(''); // Limpa a seleção ao mudar para hierárquico
    } else {
      setSelectOptions(basicOptions);
      setSelectValue(''); // Limpa a seleção ao mudar para normal
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectProps.hierarchical]);

  // Ícones disponíveis
  const iconMap = {
    none: null,
    calendar: <Calendar className="w-4 h-4" />,
    clock: <Clock className="w-4 h-4" />,
    creditCard: <CreditCard className="w-4 h-4" />,
    dollar: <DollarSign className="w-4 h-4" />,
    hash: <Hash className="w-4 h-4" />,
    mail: <Mail className="w-4 h-4" />,
    globe: <Globe className="w-4 h-4" />,
    phone: <Phone className="w-4 h-4" />,
    mapPin: <MapPin className="w-4 h-4" />,
    fileText: <FileText className="w-4 h-4" />,
    percent: <Percent className="w-4 h-4" />,
    palette: <Palette className="w-4 h-4" />,
    camera: <Camera className="w-4 h-4" />,
    navigation: <Navigation className="w-4 h-4" />
  };

  const [selectedIcon, setSelectedIcon] = useState<keyof typeof iconMap>('none');


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Componentes Unificados - Teste Interativo</h1>

        {/* Input Unificado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Controles do Input */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">Configurações do Input</h2>

            <div className="space-y-4">
              {/* Texto do Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label do Campo</label>
                <input
                  type="text"
                  value={inputProps.label}
                  onChange={(e) => setInputProps({ ...inputProps, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                />
              </div>

              {/* Máscara */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Máscara</label>
                <select
                  value={inputProps.mask}
                  onChange={(e) => {
                    const mask = e.target.value as MaskType;
                    // Auto-selecionar validação quando máscara é selecionada
                    let validation = inputProps.validation;
                    if (mask === 'cpf') validation = 'cpf';
                    if (mask === 'cnpj') validation = 'cnpj';
                    if (mask === 'creditCard') validation = 'creditCard';

                    setInputProps({ ...inputProps, mask, validation });
                    setInputValue('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                >
                  <option value="none">Nenhuma</option>
                  <option value="cpf">CPF (000.000.000-00)</option>
                  <option value="cnpj">CNPJ (00.000.000/0000-00)</option>
                  <option value="instagram">Instagram (@usuario)</option>
                  <option value="photo">Foto (Upload de imagem)</option>
                  <option value="password">Senha (••••••••)</option>
                  <option value="internationalPhone">Telefone Internacional (+00 00 0000-0000)</option>
                  <option value="cep">CEP (00000-000)</option>
                  <option value="address">Endereço (Com busca)</option>
                  <option value="addressNumber">Número de Endereço</option>
                  <option value="date">Data (DD/MM/AAAA)</option>
                  <option value="time">Hora (HH:MM)</option>
                  <option value="datepicker">Data com Calendário</option>
                  <option value="datetime">Data/Hora com Calendário</option>
                  <option value="timepicker">Hora com Seletor</option>
                  <option value="currency">Moeda (R$ 0,00)</option>
                  <option value="percentage">Porcentagem (0%)</option>
                  <option value="creditCard">Cartão (0000 0000 0000 0000)</option>
                  <option value="color">Cor (#000000)</option>
                </select>
              </div>

              {/* Validação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validação</label>
                <select
                  value={inputProps.validation}
                  onChange={(e) => setInputProps({ ...inputProps, validation: e.target.value as ValidationType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                >
                  <option value="none">Nenhuma</option>
                  <option value="cpf">CPF Válido</option>
                  <option value="cnpj">CNPJ Válido</option>
                  <option value="email">E-mail</option>
                  <option value="creditCard">Cartão de Crédito</option>
                </select>
              </div>

              {/* Ícone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
                <select
                  value={selectedIcon}
                  onChange={(e) => {
                    const icon = e.target.value as keyof typeof iconMap;
                    setSelectedIcon(icon);
                    setInputProps({ ...inputProps, icon: icon !== 'none' });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                >
                  <option value="none">Nenhum</option>
                  <option value="calendar">Calendário</option>
                  <option value="clock">Relógio</option>
                  <option value="creditCard">Cartão</option>
                  <option value="dollar">Dinheiro</option>
                  <option value="hash">Hash</option>
                  <option value="mail">E-mail</option>
                  <option value="globe">Globo</option>
                  <option value="mapPin">Local</option>
                  <option value="fileText">Documento</option>
                  <option value="percent">Porcentagem</option>
                  <option value="palette">Paleta</option>
                  <option value="camera">Câmera</option>
                  <option value="navigation">Navegação</option>
                </select>
              </div>

              {/* Props específicas para máscaras avançadas */}
              {inputProps.mask === 'timepicker' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Intervalo de Tempo (minutos)</label>
                    <select
                      value={inputProps.timeIntervals || 15}
                      onChange={(e) => setInputProps({ ...inputProps, timeIntervals: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                    >
                      <option value={5}>5 minutos</option>
                      <option value={10}>10 minutos</option>
                      <option value={15}>15 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={60}>60 minutos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Início</label>
                    <input
                      type="time"
                      value={inputProps.timeStart || '00:00'}
                      onChange={(e) => setInputProps({ ...inputProps, timeStart: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Fim</label>
                    <input
                      type="time"
                      value={inputProps.timeEnd || '23:59'}
                      onChange={(e) => setInputProps({ ...inputProps, timeEnd: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                    />
                  </div>
                </div>
              )}

              {inputProps.mask === 'password' && (
                <div>
                  <label className="flex items-center justify-between p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100">
                    <span className="text-sm font-medium text-purple-700">Mostrar Toggle de Senha</span>
                    <input
                      type="checkbox"
                      checked={inputProps.showPasswordToggle !== false}
                      onChange={(e) => setInputProps({ ...inputProps, showPasswordToggle: e.target.checked })}
                      className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                    />
                  </label>
                </div>
              )}

              {inputProps.mask === 'internationalPhone' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">País Padrão</label>
                  <select
                    value={inputProps.defaultCountry || 'BR'}
                    onChange={(e) => setInputProps({ ...inputProps, defaultCountry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                  >
                    <option value="BR">Brasil</option>
                    <option value="US">Estados Unidos</option>
                    <option value="PT">Portugal</option>
                    <option value="ES">Espanha</option>
                    <option value="FR">França</option>
                    <option value="DE">Alemanha</option>
                  </select>
                </div>
              )}

              {inputProps.mask === 'addressNumber' && (
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100">
                    <span className="text-sm font-medium text-orange-700">Permitir "Sem Número"</span>
                    <input
                      type="checkbox"
                      checked={inputProps.allowNoNumber !== false}
                      onChange={(e) => setInputProps({ ...inputProps, allowNoNumber: e.target.checked })}
                      className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                    />
                  </label>
                  {inputProps.allowNoNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Texto do Checkbox</label>
                      <input
                        type="text"
                        value={inputProps.noNumberText || 'S/N'}
                        onChange={(e) => setInputProps({ ...inputProps, noNumberText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Erro personalizado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem de Erro</label>
                <input
                  type="text"
                  value={inputProps.error}
                  onChange={(e) => setInputProps({ ...inputProps, error: e.target.value })}
                  placeholder="Digite uma mensagem de erro..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <span className="text-sm font-medium text-gray-700">Obrigatório</span>
                  <input
                    type="checkbox"
                    checked={inputProps.required}
                    onChange={(e) => setInputProps({ ...inputProps, required: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>


                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <span className="text-sm font-medium text-gray-700">Desabilitado</span>
                  <input
                    type="checkbox"
                    checked={inputProps.disabled}
                    onChange={(e) => setInputProps({ ...inputProps, disabled: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <span className="text-sm font-medium text-gray-700">Largura Total</span>
                  <input
                    type="checkbox"
                    checked={inputProps.fullWidth}
                    onChange={(e) => setInputProps({ ...inputProps, fullWidth: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>
              </div>
            </div>
          </Card>

          {/* Preview do Input */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">Preview do Input</h2>

            <div className="space-y-6">
              <UnifiedInput
                {...inputProps}
                value={inputValue}
                onChange={(value, isValid, data) => {
                  setInputValue(value);
                  setInputData(data);
                }}
                icon={inputProps.icon ? iconMap[selectedIcon] : undefined}
              />

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Estado Atual:</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Valor:</span>
                    <span className="ml-2 font-mono text-krooa-blue">{inputValue || '(vazio)'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Máscara:</span>
                    <span className="ml-2 text-gray-600">{inputProps.mask}</span>
                  </div>
                  <div>
                    <span className="font-medium">Validação:</span>
                    <span className="ml-2 text-gray-600">{inputProps.validation}</span>
                  </div>
                  {inputProps.mask === 'addressNumber' && inputData?.noNumber !== undefined && (
                    <div>
                      <span className="font-medium">Sem número:</span>
                      <span className={`ml-2 font-semibold ${inputData.noNumber ? 'text-green-600' : 'text-gray-600'}`}>
                        {inputData.noNumber ? '✓ Sim' : '✗ Não'}
                      </span>
                    </div>
                  )}
                  {inputProps.mask === 'internationalPhone' && inputData?.country && (
                    <div>
                      <span className="font-medium">País:</span>
                      <span className="ml-2">{inputData.country.flag} {inputData.country.name}</span>
                    </div>
                  )}
                  {inputProps.mask === 'creditCard' && inputData?.brand && (
                    <div>
                      <span className="font-medium">Bandeira:</span>
                      <span className="ml-2 text-green-600 font-semibold">{inputData.brand}</span>
                    </div>
                  )}
                  {inputProps.mask === 'color' && inputValue && (
                    <div>
                      <span className="font-medium">Cor selecionada:</span>
                      <span className="ml-2 inline-flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: inputValue }}
                        />
                        <span className="font-mono text-krooa-blue">{inputValue}</span>
                      </span>
                    </div>
                  )}
                  {inputProps.mask === 'photo' && inputData?.file && (
                    <div>
                      <span className="font-medium">Arquivo:</span>
                      <span className="ml-2 text-krooa-blue">{inputValue}</span>
                    </div>
                  )}
                  {inputProps.mask === 'address' && inputValue && (
                    <div>
                      <span className="font-medium">Endereço:</span>
                      <span className="ml-2 text-krooa-blue text-sm">{inputValue}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-700 mb-2">Código:</h3>
                <pre className="text-xs font-mono text-blue-900 overflow-x-auto">
{`<UnifiedInput
  label="${inputProps.label}"
  mask="${inputProps.mask}"
  validation="${inputProps.validation}"
  required={${inputProps.required}}
  disabled={${inputProps.disabled}}
  fullWidth={${inputProps.fullWidth}}
  ${inputProps.icon ? 'icon={<Icon />}' : ''}
  ${inputProps.error ? `error="${inputProps.error}"` : ''}
  ${inputProps.mask === 'password' && inputProps.showPasswordToggle ? 'showPasswordToggle={true}' : ''}
  ${inputProps.mask === 'internationalPhone' ? `defaultCountry="${inputProps.defaultCountry}"` : ''}
  ${inputProps.mask === 'addressNumber' && inputProps.allowNoNumber ? `allowNoNumber={true}
  noNumberText="${inputProps.noNumberText}"` : ''}
  ${inputProps.mask === 'timepicker' ? `timeIntervals={${inputProps.timeIntervals}}
  timeStart="${inputProps.timeStart}"
  timeEnd="${inputProps.timeEnd}"` : ''}
  value={value}
  onChange={(value, isValid, data) => setValue(value)}
/>`}
                </pre>
              </div>
            </div>
          </Card>
        </div>

        {/* Select Configurável */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controles do Select */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">Configurações do Select</h2>

            <div className="space-y-4">
              {/* Textos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={selectProps.label}
                  onChange={(e) => setSelectProps({ ...selectProps, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                />
              </div>

              {/* Erro personalizado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem de Erro</label>
                <input
                  type="text"
                  value={selectProps.error}
                  onChange={(e) => setSelectProps({ ...selectProps, error: e.target.value })}
                  placeholder="Digite uma mensagem de erro..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <span className="text-sm font-medium text-gray-700">Obrigatório</span>
                  <input
                    type="checkbox"
                    checked={selectProps.required}
                    onChange={(e) => setSelectProps({ ...selectProps, required: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>


                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <span className="text-sm font-medium text-gray-700">Desabilitado</span>
                  <input
                    type="checkbox"
                    checked={selectProps.disabled}
                    onChange={(e) => setSelectProps({ ...selectProps, disabled: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <span className="text-sm font-medium text-gray-700">Largura Total</span>
                  <input
                    type="checkbox"
                    checked={selectProps.fullWidth}
                    onChange={(e) => setSelectProps({ ...selectProps, fullWidth: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100">
                  <span className="text-sm font-medium text-green-700">Múltipla Seleção</span>
                  <input
                    type="checkbox"
                    checked={selectProps.multiple}
                    onChange={(e) => {
                      setSelectProps({ ...selectProps, multiple: e.target.checked });
                      setSelectValue(e.target.checked ? [] : '');
                    }}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
                  <span className="text-sm font-medium text-blue-700">Campo de Busca</span>
                  <input
                    type="checkbox"
                    checked={selectProps.searchable}
                    onChange={(e) => setSelectProps({ ...selectProps, searchable: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100">
                  <span className="text-sm font-medium text-purple-700">Editável (Permite editar e adicionar)</span>
                  <input
                    type="checkbox"
                    checked={selectProps.editable}
                    onChange={(e) => setSelectProps({
                      ...selectProps,
                      editable: e.target.checked,
                      advancedEdit: e.target.checked ? selectProps.advancedEdit : false
                    })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>

                <label className={`flex items-center justify-between p-3 rounded-lg ${
                  selectProps.editable
                    ? 'bg-indigo-50 cursor-pointer hover:bg-indigo-100'
                    : 'bg-gray-50 cursor-not-allowed opacity-60'
                }`}>
                  <span className={`text-sm font-medium ${
                    selectProps.editable ? 'text-indigo-700' : 'text-gray-500'
                  }`}>Edição Avançada (Modal customizado)</span>
                  <input
                    type="checkbox"
                    checked={selectProps.advancedEdit}
                    onChange={(e) => setSelectProps({ ...selectProps, advancedEdit: e.target.checked })}
                    disabled={!selectProps.editable}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green disabled:opacity-50"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-teal-50 rounded-lg cursor-pointer hover:bg-teal-100">
                  <span className="text-sm font-medium text-teal-700">Hierárquico</span>
                  <input
                    type="checkbox"
                    checked={selectProps.hierarchical}
                    onChange={(e) => setSelectProps({ ...selectProps, hierarchical: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100">
                  <span className="text-sm font-medium text-red-700">Confirmar Exclusão</span>
                  <input
                    type="checkbox"
                    checked={selectProps.confirmDelete}
                    onChange={(e) => setSelectProps({ ...selectProps, confirmDelete: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>
              </div>
            </div>
          </Card>

          {/* Preview do Select */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">Preview do Select</h2>

            <div className="space-y-6">
              <Select
                {...selectProps}
                value={selectValue}
                onChange={(e) => setSelectValue(selectProps.multiple ? e.target.value as string[] : e.target.value)}
                options={selectOptions}
                onOptionsChange={selectProps.editable ? setSelectOptions : undefined}
                hierarchical={selectProps.hierarchical}
                confirmDelete={selectProps.confirmDelete}
                advancedEdit={selectProps.advancedEdit}
                onEdit={selectProps.advancedEdit ? (option) => {
                  console.log('Opção editada:', option);
                  alert(`Editando: ${option.label}`);
                } : undefined}
                editModalContent={selectProps.advancedEdit ? (option, onSave, onCancel) => (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Editar Item</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input
                          type="text"
                          defaultValue={option.label}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                          id="edit-name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                        <input
                          type="text"
                          defaultValue={option.value}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                          id="edit-value"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                          rows={3}
                          placeholder="Descrição adicional..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end mt-6">
                      <Button variant="ghost" onClick={onCancel}>
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          const nameInput = document.getElementById('edit-name') as HTMLInputElement;
                          const valueInput = document.getElementById('edit-value') as HTMLInputElement;
                          onSave({
                            value: valueInput?.value || option.value,
                            label: nameInput?.value || option.label
                          });
                        }}
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : undefined}
              />

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Estado Atual:</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Valor Selecionado:</span>
                    <span className="ml-2 font-mono text-krooa-blue">
                      {Array.isArray(selectValue)
                        ? selectValue.join(', ') || '(vazio)'
                        : selectValue || '(vazio)'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Total de Opções:</span>
                    <span className="ml-2 text-gray-600">{selectOptions.length}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-700 mb-2">Código:</h3>
                <pre className="text-xs font-mono text-blue-900 overflow-x-auto">
{`<Select
  label="${selectProps.label}"
  required={${selectProps.required}}
  disabled={${selectProps.disabled}}
  fullWidth={${selectProps.fullWidth}}
  multiple={${selectProps.multiple}}
  searchable={${selectProps.searchable}}
  editable={${selectProps.editable}}
  ${selectProps.advancedEdit ? `advancedEdit={${selectProps.advancedEdit}}` : ''}
  ${selectProps.hierarchical ? `hierarchical={${selectProps.hierarchical}}` : ''}
  ${selectProps.confirmDelete ? `confirmDelete={${selectProps.confirmDelete}}` : ''}
  ${selectProps.error ? `error="${selectProps.error}"` : ''}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  options={options}
  ${selectProps.editable ? 'onOptionsChange={setOptions}' : ''}
  ${selectProps.advancedEdit ? 'onEdit={handleEdit}' : ''}
  ${selectProps.advancedEdit ? 'editModalContent={customModalContent}' : ''}
/>`}
                </pre>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}