import React, { useState } from 'react';
import { Button, IconButton } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TextArea } from '../../components/ui/TextArea';
import { Checkbox } from '../../components/ui/Checkbox';
import { Radio } from '../../components/ui/Radio';
import { DatePicker } from '../../components/ui/DatePicker';
import { TimeInput } from '../../components/ui/TimeInput';
import { Modal } from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';
import { Switch } from '../../components/ui/Switch';

const Components: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [switchValue, setSwitchValue] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-krooa-dark mb-8">Sistema de Design Krooa</h1>

        {/* Tipografia */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Tipografia</h2>

          {/* Headings */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-krooa-dark mb-4">Headings</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">H1 - 4xl, Bold, Manrope</p>
                <h1 className="text-4xl font-bold text-krooa-dark">Heading 1 - Sistema de Gestão</h1>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">H2 - 3xl, Bold, Manrope</p>
                <h2 className="text-3xl font-bold text-krooa-dark">Heading 2 - Bem-vindo de volta</h2>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">H3 - 2xl, Semibold, Manrope</p>
                <h3 className="text-2xl font-semibold text-krooa-dark">Heading 3 - Configurações</h3>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">H4 - xl, Semibold, Manrope</p>
                <h4 className="text-xl font-semibold text-krooa-dark">Heading 4 - Seção do Dashboard</h4>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">H5 - lg, Medium, Manrope</p>
                <h5 className="text-lg font-medium text-krooa-dark">Heading 5 - Subtítulo</h5>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">H6 - Base, Medium, Manrope</p>
                <h6 className="text-base font-medium text-krooa-dark">Heading 6 - Item de Lista</h6>
              </div>
            </div>
          </Card>

          {/* Body Text */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-krooa-dark mb-4">Body Text</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Parágrafo - Base, Normal</p>
                <p className="text-base text-gray-700">Este é um parágrafo normal com texto de exemplo para demonstrar o estilo padrão do sistema.</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Small - sm, Normal</p>
                <p className="text-sm text-gray-600">Texto pequeno para informações secundárias</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Extra Small - xs, Normal</p>
                <p className="text-xs text-gray-500">Texto extra pequeno para rodapés e disclaimers</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Lead Text - lg, Normal</p>
                <p className="text-lg text-gray-700">Texto de destaque usado em introduções ou descrições importantes.</p>
              </div>
            </div>
          </Card>

          {/* Variações de Cor e Links */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-krooa-dark mb-4">Variações de Cor e Links</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Links Primários - Uso: Links de navegação principal e CTAs secundários</p>
                <div className="flex gap-4">
                  <a href="#" className="text-krooa-blue hover:text-krooa-dark font-medium">Link Primário</a>
                  <a href="#" className="text-sm text-krooa-blue hover:text-krooa-dark font-medium">Link Pequeno</a>
                  <a href="#" className="text-lg text-krooa-blue hover:text-krooa-dark font-semibold">Link Grande</a>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Links de Ação - Uso: Ações importantes como "Esqueceu a senha"</p>
                <div className="flex gap-4">
                  <a href="#" className="text-krooa-blue hover:text-krooa-dark underline">Link com underline</a>
                  <a href="#" className="text-sm text-krooa-blue hover:text-krooa-dark font-medium">Esqueceu a senha?</a>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Texto Verde - Uso: Indicadores de sucesso, valores positivos</p>
                <div className="space-y-1">
                  <p className="text-green-600">✓ Operação realizada com sucesso</p>
                  <p className="text-green-500 text-sm">Status: Ativo</p>
                  <span className="text-lg font-bold text-green-600">+15%</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Texto Vermelho - Uso: Erros, avisos, valores negativos</p>
                <div className="space-y-1">
                  <p className="text-red-600">✗ Erro ao processar solicitação</p>
                  <p className="text-red-500 text-sm">Campo obrigatório</p>
                  <span className="text-lg font-bold text-red-600">-8%</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Texto Krooa Dark - Uso: Títulos, labels importantes</p>
                <div className="space-y-1">
                  <h4 className="text-krooa-dark font-bold">Título Principal</h4>
                  <label className="text-krooa-dark font-medium">Label do Campo</label>
                  <span className="text-krooa-dark">Texto de destaque</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Texto Cinza - Uso: Informações secundárias, placeholders</p>
                <div className="space-y-1">
                  <p className="text-gray-400">Placeholder text</p>
                  <p className="text-gray-500 text-sm">Informação auxiliar</p>
                  <p className="text-gray-600">Texto secundário normal</p>
                  <p className="text-gray-700">Texto principal do corpo</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Pesos de Fonte */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-krooa-dark mb-4">Pesos de Fonte (Font Weights)</h3>
            <div className="space-y-3">
              <p className="text-xl font-extralight">Extra Light (200) - Raramente usado</p>
              <p className="text-xl font-light">Light (300) - Textos decorativos</p>
              <p className="text-xl font-normal">Normal/Regular (400) - Corpo de texto padrão</p>
              <p className="text-xl font-medium">Medium (500) - Labels e subtítulos</p>
              <p className="text-xl font-semibold">Semibold (600) - Títulos secundários</p>
              <p className="text-xl font-bold">Bold (700) - Títulos principais</p>
              <p className="text-xl font-extrabold">Extra Bold (800) - Destaques especiais</p>
            </div>
          </Card>

          {/* Casos de Uso */}
          <Card>
            <h3 className="text-lg font-semibold text-krooa-dark mb-4">Guia de Uso - Quando Aplicar</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-krooa-dark pl-4">
                <h4 className="font-semibold text-krooa-dark">Krooa Dark (#001F2B)</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Títulos e headings principais</li>
                  <li>• Labels de formulários</li>
                  <li>• Texto de botões primários (sobre fundo verde)</li>
                  <li>• Nomes e informações importantes</li>
                </ul>
              </div>

              <div className="border-l-4 border-krooa-blue pl-4">
                <h4 className="font-semibold text-krooa-blue">Krooa Blue (#30578D)</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Links e ações clicáveis</li>
                  <li>• CTAs secundários</li>
                  <li>• Estados hover (transição para krooa-dark)</li>
                  <li>• Elementos interativos não primários</li>
                </ul>
              </div>

              <div className="border-l-4 border-gray-400 pl-4">
                <h4 className="font-semibold text-gray-700">Escalas de Cinza</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Gray-700/800: Corpo de texto principal</li>
                  <li>• Gray-600: Texto secundário</li>
                  <li>• Gray-500: Descrições e helpers</li>
                  <li>• Gray-400: Placeholders e texto desabilitado</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-600">Verde (Success)</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Mensagens de sucesso</li>
                  <li>• Indicadores positivos</li>
                  <li>• Status ativos</li>
                  <li>• Valores de crescimento</li>
                </ul>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-red-600">Vermelho (Error)</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Mensagens de erro</li>
                  <li>• Validações de formulário</li>
                  <li>• Alertas importantes</li>
                  <li>• Valores negativos</li>
                </ul>
              </div>

              <div className="border-l-4 border-krooa-green pl-4">
                <h4 className="font-semibold text-krooa-dark">Krooa Green (#D8FE64)</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Botão primário (background)</li>
                  <li>• Elementos de destaque visual</li>
                  <li>• Indicadores de seleção ativa</li>
                  <li>• Accent color principal da marca</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Cores */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Paleta de Cores</h2>
          <Card>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="w-full h-24 bg-krooa-green rounded-lg mb-2"></div>
                <p className="font-semibold text-krooa-dark">Krooa Green</p>
                <p className="text-sm text-gray-600">#D8FE64</p>
                <p className="text-xs text-gray-500">Primary Brand Color</p>
              </div>
              <div>
                <div className="w-full h-24 bg-krooa-blue rounded-lg mb-2"></div>
                <p className="font-semibold text-krooa-dark">Krooa Blue</p>
                <p className="text-sm text-gray-600">#30578D</p>
                <p className="text-xs text-gray-500">Secondary Color</p>
              </div>
              <div>
                <div className="w-full h-24 bg-krooa-dark rounded-lg mb-2"></div>
                <p className="font-semibold text-krooa-dark">Krooa Dark</p>
                <p className="text-sm text-gray-600">#001F2B</p>
                <p className="text-xs text-gray-500">Text & Dark Elements</p>
              </div>
              <div>
                <div className="w-full h-24 bg-gray-50 border border-gray-200 rounded-lg mb-2"></div>
                <p className="font-semibold text-krooa-dark">Gray 50</p>
                <p className="text-sm text-gray-600">#F9FAFB</p>
                <p className="text-xs text-gray-500">Background Light</p>
              </div>
              <div>
                <div className="w-full h-24 bg-gray-600 rounded-lg mb-2"></div>
                <p className="font-semibold text-krooa-dark">Gray 600</p>
                <p className="text-sm text-gray-600">#4B5563</p>
                <p className="text-xs text-gray-500">Secondary Text</p>
              </div>
              <div>
                <div className="w-full h-24 bg-red-600 rounded-lg mb-2"></div>
                <p className="font-semibold text-krooa-dark">Red 600</p>
                <p className="text-sm text-gray-600">#DC2626</p>
                <p className="text-xs text-gray-500">Error & Danger</p>
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

        {/* Inputs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Formulários</h2>

          {/* Especificações dos Inputs */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-krooa-dark mb-4">Especificações de Input</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-krooa-dark mb-2">Input com Floating Label</h4>
                  <code className="text-xs text-gray-600 block">
                    rounded-lg border border-gray-300 px-3 py-2
                  </code>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li>• Border radius: rounded-lg (0.5rem)</li>
                    <li>• Padding: px-3 (12px) py-2 (8px)</li>
                    <li>• Focus: border-krooa-green ring-2 ring-krooa-green/20</li>
                    <li>• Placeholder: " " (espaço vazio)</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-krooa-dark mb-2">Input Tradicional</h4>
                  <code className="text-xs text-gray-600 block">
                    rounded-xl border border-gray-300 px-4 py-2.5
                  </code>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li>• Border radius: rounded-xl (0.75rem)</li>
                    <li>• Padding: px-4 (16px) py-2.5 (10px)</li>
                    <li>• Focus: border-krooa-green ring-2 ring-krooa-green/20</li>
                    <li>• Label: Separado acima do input</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Input Tradicional (rounded-xl)</p>
                  <Input
                    label="Input Padrão"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Digite algo..."
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Input com Floating Label (rounded-lg)</p>
                  <Input
                    label="E-mail"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    floating
                    fullWidth
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Input com Erro</p>
                  <Input
                    label="Campo Obrigatório"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
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
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    floating
                    fullWidth
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Select
                  label="Select"
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                  options={[
                    { value: '', label: 'Selecione uma opção' },
                    { value: 'op1', label: 'Opção 1' },
                    { value: 'op2', label: 'Opção 2' },
                    { value: 'op3', label: 'Opção 3' }
                  ]}
                />

                <DatePicker
                  label="Data"
                  value={dateValue}
                  onChange={setDateValue}
                />

                <TimeInput
                  label="Horário"
                  value={timeValue}
                  onChange={setTimeValue}
                  floating
                  fullWidth
                />

                <TextArea
                  label="Texto Longo"
                  value={textAreaValue}
                  onChange={(e) => setTextAreaValue(e.target.value)}
                  placeholder="Digite um texto longo..."
                  rows={4}
                />
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

        {/* Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Cards</h2>
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-krooa-dark mb-2">Card Simples</h3>
              <p className="text-gray-600">Este é um card básico com sombra e padding padrão.</p>
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

        {/* Espaçamentos */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Sistema de Espaçamento</h2>
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-500">p-1</div>
                <div className="bg-krooa-green/20 p-1 border border-krooa-green">4px</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-500">p-2</div>
                <div className="bg-krooa-green/20 p-2 border border-krooa-green">8px</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-500">p-3</div>
                <div className="bg-krooa-green/20 p-3 border border-krooa-green">12px</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-500">p-4</div>
                <div className="bg-krooa-green/20 p-4 border border-krooa-green">16px</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-500">p-6</div>
                <div className="bg-krooa-green/20 p-6 border border-krooa-green">24px</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-500">p-8</div>
                <div className="bg-krooa-green/20 p-8 border border-krooa-green">32px</div>
              </div>
            </div>
          </Card>
        </section>

        {/* Border Radius */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Border Radius</h2>
          <Card>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-24 h-24 bg-krooa-green rounded-sm mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">rounded-sm</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-krooa-green rounded mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">rounded</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-krooa-green rounded-lg mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">rounded-lg</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-krooa-green rounded-xl mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">rounded-xl</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-krooa-green rounded-2xl mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">rounded-2xl</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-krooa-green rounded-3xl mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">rounded-3xl</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-krooa-green rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">rounded-full</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Sombras */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-6">Sombras</h2>
          <Card>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="font-semibold text-krooa-dark">shadow-sm</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="font-semibold text-krooa-dark">shadow</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="font-semibold text-krooa-dark">shadow-md</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="font-semibold text-krooa-dark">shadow-lg</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <p className="font-semibold text-krooa-dark">shadow-xl</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-2xl">
                <p className="font-semibold text-krooa-dark">shadow-2xl</p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Components;