import React, { useState } from 'react';
import { Button, IconButton } from '../../components/ui/Button';
import { Input, EmailInput, PhoneInput, CPFInput, CNPJInput } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TextArea } from '../../components/ui/TextArea';
import { Checkbox } from '../../components/ui/Checkbox';
import { Radio } from '../../components/ui/Radio';
import { DateInput } from '../../components/ui/DateInput';
import { TimeInput } from '../../components/ui/TimeInput';
import { Modal } from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';
import { Switch } from '../../components/ui/Switch';
import { MultiSelect } from '../../components/ui/MultiSelect';
import { Badge, StatusPill, Tag } from '../../components/ui/Badge';
import { Avatar, AvatarGroup } from '../../components/ui/Avatar';
import { DropdownMenu, ActionMenu } from '../../components/ui/DropdownMenu';
import { FilterDropdown, MultiFilterDropdown } from '../../components/ui/FilterDropdown';
import { Camera, Edit, Trash, Download, Eye } from 'lucide-react';

const Components: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  // Estados para inputs normais
  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [inputValue3, setInputValue3] = useState('');
  const [inputValue4, setInputValue4] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  // Estados para inputs com máscaras
  const [emailValue, setEmailValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [cpfValue, setCpfValue] = useState('');
  const [cpfResponsavelValue, setCpfResponsavelValue] = useState('');
  const [cnpjValue, setCnpjValue] = useState('');

  // Estados para seletores
  const [selectValue, setSelectValue] = useState('');
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);

  // Estados para checkboxes e radios
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchValue, setSwitchValue] = useState(false);

  // Estados para data e hora
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');

  // Estados para textarea
  const [textAreaValue, setTextAreaValue] = useState('');

  // Estados para filtros e tags
  const [activeFilter, setActiveFilter] = useState('todos');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    status: 'todos',
    type: 'todos'
  });
  const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind']);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-krooa-dark mb-8">Sistema de Componentes Krooa</h1>

        {/* Inputs com Máscaras */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Inputs com Máscaras e Validações</h2>

          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-krooa-dark mb-4">Máscaras Específicas</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">CPF - Máscara: 000.000.000-00</p>
                  <CPFInput
                    label="CPF"
                    value={cpfValue}
                    onChange={(value) => setCpfValue(value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Validação automática de CPF</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">CPF Responsável - Mesma máscara e validação</p>
                  <CPFInput
                    label="CPF do Responsável"
                    value={cpfResponsavelValue}
                    onChange={(value) => setCpfResponsavelValue(value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Mesmo componente CPFInput, apenas label diferente</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">CNPJ - Máscara: 00.000.000/0000-00</p>
                  <CNPJInput
                    label="CNPJ"
                    value={cnpjValue}
                    onChange={(value) => setCnpjValue(value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Validação automática de CNPJ</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Telefone - Máscara: (00) 00000-0000</p>
                  <PhoneInput
                    label="Telefone/WhatsApp"
                    value={phoneValue}
                    onChange={(value) => setPhoneValue(value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Suporta telefone fixo e celular</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Email - Validação de formato</p>
                  <EmailInput
                    label="E-mail"
                    value={emailValue}
                    onChange={(value) => setEmailValue(value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Valida formato de e-mail</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Data - DD/MM/AAAA (digitável + calendário)</p>
                  <DateInput
                    label="Data de Nascimento"
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Digite ou clique no ícone para abrir calendário</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Horário - HH:MM com dropdown</p>
                  <TimeInput
                    label="Horário"
                    value={timeValue}
                    onChange={setTimeValue}
                    floating
                    fullWidth
                  />
                  <p className="text-xs text-gray-400 mt-1">Dropdown com intervalos de 30min</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Inputs Padrão */}
          <Card>
            <h3 className="text-lg font-semibold text-krooa-dark mb-4">Inputs Padrão e Variações</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Input Tradicional (rounded-xl)</p>
                  <Input
                    label="Input Padrão"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Digite algo..."
                    floating={false}
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Input com Floating Label (rounded-lg)</p>
                  <Input
                    label="Nome Completo"
                    value={inputValue2}
                    onChange={(e) => setInputValue2(e.target.value)}
                    floating
                    fullWidth
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Input com Erro</p>
                  <Input
                    label="Campo Obrigatório"
                    value={inputValue3}
                    onChange={(e) => setInputValue3(e.target.value)}
                    error="Este campo é obrigatório"
                    floating
                    fullWidth
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Input Desabilitado</p>
                  <Input
                    label="Campo Desabilitado"
                    value="Texto desabilitado"
                    disabled
                    onChange={() => {}}
                    floating
                    fullWidth
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Input de Senha</p>
                  <Input
                    type="password"
                    label="Senha"
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    floating
                    fullWidth
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Select Simples</p>
                  <Select
                    label="Unidade"
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                    options={[
                      { value: '', label: 'Selecione uma opção' },
                      { value: 'op1', label: 'Unidade Principal' },
                      { value: 'op2', label: 'Unidade Centro' },
                      { value: 'op3', label: 'Unidade Sul' }
                    ]}
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">MultiSelect - Seleção Múltipla</p>
                  <MultiSelect
                    label="Unidades Permitidas"
                    placeholder="Selecione as unidades"
                    options={[
                      { value: '1', label: 'Unidade Principal' },
                      { value: '2', label: 'Unidade Centro' },
                      { value: '3', label: 'Unidade Sul' }
                    ]}
                    value={multiSelectValue}
                    onChange={setMultiSelectValue}
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">TextArea</p>
                  <TextArea
                    label="Observações"
                    value={textAreaValue}
                    onChange={(e) => setTextAreaValue(e.target.value)}
                    placeholder="Digite observações..."
                    rows={4}
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Input com Prefixo/Sufixo</p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">R$</span>
                    <Input
                      value={inputValue4}
                      onChange={(e) => setInputValue4(e.target.value)}
                      className="pl-10 pr-10"
                      placeholder="0,00"
                      floating={false}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-3">Checkboxes</p>
                <div className="space-y-2">
                  <Checkbox
                    label="Checkbox normal"
                    checked={checkboxValue}
                    onChange={setCheckboxValue}
                  />
                  <Checkbox
                    label="Checkbox desabilitado"
                    checked={true}
                    disabled
                    onChange={() => {}}
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Radio Buttons</p>
                <div className="space-y-2">
                  <Radio
                    label="Opção 1"
                    name="radio-group"
                    value="option1"
                    checked={radioValue === 'option1'}
                    onChange={(e) => setRadioValue(e.target.value)}
                  />
                  <Radio
                    label="Opção 2"
                    name="radio-group"
                    value="option2"
                    checked={radioValue === 'option2'}
                    onChange={(e) => setRadioValue(e.target.value)}
                  />
                  <Radio
                    label="Opção 3 (Desabilitada)"
                    name="radio-group"
                    value="option3"
                    disabled
                    checked={false}
                    onChange={() => {}}
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Switch</p>
                <Switch
                  label="Toggle Switch"
                  checked={switchValue}
                  onChange={setSwitchValue}
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Botões */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Botões</h2>
          <Card>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-3">Variantes</p>
                <div className="flex gap-3 flex-wrap">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="outline">Outline</Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">Tamanhos</p>
                <div className="flex gap-3 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">Estados</p>
                <div className="flex gap-3">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                  <Button loading>Loading</Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">Full Width</p>
                <Button fullWidth>Full Width Button</Button>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">Icon Buttons</p>
                <div className="flex gap-3">
                  <IconButton>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </IconButton>
                  <IconButton variant="primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </IconButton>
                  <IconButton variant="danger">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </IconButton>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Badges and Pills */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Badges, Pills e Tags</h2>
          <Card>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-3">Badges - Variantes</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="success">Sucesso</Badge>
                  <Badge variant="error">Erro</Badge>
                  <Badge variant="warning">Aviso</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="primary">Primary</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Badges - Tamanhos</p>
                <div className="flex gap-2 items-center">
                  <Badge size="xs">Extra Small</Badge>
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Status Pills com Ícone e Dot</p>
                <div className="flex gap-2 flex-wrap">
                  <StatusPill variant="success" dot>Ativo</StatusPill>
                  <StatusPill variant="error" dot>Inativo</StatusPill>
                  <StatusPill variant="warning" dot>Pendente</StatusPill>
                  <StatusPill variant="info" icon={<Eye className="w-3 h-3" />}>Visualizando</StatusPill>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Tags Removíveis</p>
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag, index) => (
                    <Tag
                      key={tag}
                      label={tag}
                      variant="info"
                      onRemove={() => setTags(tags.filter((_, i) => i !== index))}
                    />
                  ))}
                  <button
                    onClick={() => setTags([...tags, `Tag ${tags.length + 1}`])}
                    className="px-2 py-0.5 text-sm text-gray-500 hover:text-gray-700"
                  >
                    + Adicionar
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Avatars */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Avatars</h2>
          <Card>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-3">Tamanhos de Avatar</p>
                <div className="flex gap-3 items-center">
                  <Avatar size="xs" name="João Silva" />
                  <Avatar size="sm" name="Maria Santos" />
                  <Avatar size="md" name="Pedro Costa" />
                  <Avatar size="lg" name="Ana Lima" />
                  <Avatar size="xl" name="Carlos Oliveira" />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Avatar com Imagem</p>
                <div className="flex gap-3 items-center">
                  <Avatar
                    src="https://via.placeholder.com/150"
                    alt="User"
                    size="md"
                  />
                  <Avatar
                    src="https://via.placeholder.com/150"
                    alt="User"
                    size="lg"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Avatar com Fallback Icon</p>
                <div className="flex gap-3 items-center">
                  <Avatar
                    fallbackIcon={<Camera className="w-4 h-4 text-gray-400" />}
                    size="md"
                  />
                  <Avatar
                    fallbackIcon={<Camera className="w-6 h-6 text-gray-400" />}
                    size="lg"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Grupo de Avatars</p>
                <AvatarGroup max={4}>
                  <Avatar name="João Silva" />
                  <Avatar name="Maria Santos" />
                  <Avatar name="Pedro Costa" />
                  <Avatar name="Ana Lima" />
                  <Avatar name="Carlos Oliveira" />
                  <Avatar name="Paula Souza" />
                </AvatarGroup>
              </div>
            </div>
          </Card>
        </section>

        {/* Dropdown Menus */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Dropdown Menus</h2>
          <Card>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-3">Dropdown Menu Básico</p>
                <DropdownMenu
                  trigger={<Button variant="outline">Menu de Opções</Button>}
                  items={[
                    { label: 'Editar', icon: <Edit className="w-4 h-4" />, onClick: () => {} },
                    { label: 'Download', icon: <Download className="w-4 h-4" />, onClick: () => {} },
                    { label: '', divider: true, onClick: () => {} },
                    { label: 'Excluir', icon: <Trash className="w-4 h-4" />, variant: 'danger', onClick: () => {} }
                  ]}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Action Menu (Botão de Ações)</p>
                <div className="flex gap-4">
                  <ActionMenu
                    items={[
                      { label: 'Visualizar', onClick: () => {} },
                      { label: 'Editar', onClick: () => {} },
                      { label: 'Duplicar', onClick: () => {} },
                      { label: '', divider: true, onClick: () => {} },
                      { label: 'Excluir', variant: 'danger', onClick: () => {} }
                    ]}
                  />
                  <ActionMenu
                    triggerOnHover
                    items={[
                      { label: 'Opção 1', onClick: () => {} },
                      { label: 'Opção 2', onClick: () => {} },
                      { label: 'Opção 3 (Desabilitada)', disabled: true, onClick: () => {} }
                    ]}
                  />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Filter Dropdowns */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Filtros Dropdown</h2>
          <Card>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-3">Filter Dropdown Simples</p>
                <FilterDropdown
                  options={[
                    { id: 'todos', label: 'Todos', count: 25 },
                    { id: 'ativos', label: 'Ativos', count: 18 },
                    { id: 'inativos', label: 'Inativos', count: 7 },
                    { id: 'pendentes', label: 'Pendentes', count: 3 }
                  ]}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Multi Filter Dropdown</p>
                <MultiFilterDropdown
                  filters={[
                    {
                      id: 'status',
                      label: 'Status',
                      options: [
                        { id: 'todos', label: 'Todos', count: 50 },
                        { id: 'ativo', label: 'Ativo', count: 35 },
                        { id: 'inativo', label: 'Inativo', count: 15 }
                      ]
                    },
                    {
                      id: 'type',
                      label: 'Tipo',
                      options: [
                        { id: 'todos', label: 'Todos', count: 50 },
                        { id: 'profissional', label: 'Profissional', count: 20 },
                        { id: 'administrativo', label: 'Administrativo', count: 30 }
                      ]
                    }
                  ]}
                  activeFilters={activeFilters}
                  onFilterChange={(filterId, optionId) => {
                    setActiveFilters(prev => ({ ...prev, [filterId]: optionId }));
                  }}
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Cards</h2>
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-krooa-dark mb-2">Card Simples</h3>
              <p className="text-gray-600">Este é um card básico com sombra e padding padrão (p-6).</p>
            </Card>

            <Card className="border-2 border-krooa-green">
              <h3 className="text-lg font-semibold text-krooa-dark mb-2">Card com Borda</h3>
              <p className="text-gray-600">Card com borda personalizada em verde Krooa.</p>
            </Card>

            <Card className="bg-gradient-to-br from-krooa-blue to-krooa-dark text-white">
              <h3 className="text-lg font-semibold mb-2">Card Gradiente</h3>
              <p className="text-white/90">Card com gradiente de fundo usando cores da marca.</p>
            </Card>
          </div>
        </section>

        {/* Modal */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Modal</h2>
          <Card>
            <Button onClick={() => setShowModal(true)}>Abrir Modal</Button>

            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              title="Modal de Exemplo"
            >
              <p className="text-gray-600 mb-4">
                Este é um modal com overlay escuro e animação de entrada/saída.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={() => setShowModal(false)}>
                  Confirmar
                </Button>
              </div>
            </Modal>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Components;