import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Input, EmailInput, PhoneInput, CPFInput, CNPJInput } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { DateInput } from '../../../components/ui/DateInput';
import { AutocompleteInput } from '../../../components/ui/AutocompleteInput';

export default function InputShowcase() {
  const [normalInput, setNormalInput] = useState('');
  const [requiredInput, setRequiredInput] = useState('');
  const [filledInput, setFilledInput] = useState('João da Silva');
  const [disabledInput, setDisabledInput] = useState('Campo desabilitado');

  // Estados para Select
  const [normalSelect, setNormalSelect] = useState('');
  const [requiredSelect, setRequiredSelect] = useState('');
  const [filledSelect, setFilledSelect] = useState('SP');
  const [disabledSelect, setDisabledSelect] = useState('RJ');

  // Estados para Select avançado
  const [multipleSelect, setMultipleSelect] = useState<string[]>(['SP', 'RJ']);
  const [editableSelect, setEditableSelect] = useState('');
  const [editableOptions, setEditableOptions] = useState([
    { value: 'SP', label: 'São Paulo' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'MG', label: 'Minas Gerais' }
  ]);

  // Estados para DateInput
  const [normalDate, setNormalDate] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [filledDate, setFilledDate] = useState('15/03/2024');
  const [disabledDate, setDisabledDate] = useState('01/01/2024');

  // Estados para AutocompleteInput
  const [autocompleteValue, setAutocompleteValue] = useState('');
  const [autocompleteRequired, setAutocompleteRequired] = useState('');
  const [autocompleteFilled, setAutocompleteFilled] = useState('Desenvolvedor');
  const [autocompleteDisabled, setAutocompleteDisabled] = useState('Analista');

  // Estados para inputs com máscara
  const [cpfValue, setCpfValue] = useState('');
  const [cnpjValue, setCnpjValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [emailValue, setEmailValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Componente: Input</h1>

        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">Estados do Input</h2>

          {/* Grid com 4 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 1. Normal */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">1) Normal</h3>
              <Input
                label="Nome Completo"
                value={normalInput}
                onChange={(e) => setNormalInput(e.target.value)}
                placeholder=" "
                floating
              />
            </div>

            {/* 2. Obrigatório */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">2) Obrigatório</h3>
              <Input
                label="Nome Completo"
                value={requiredInput}
                onChange={(e) => setRequiredInput(e.target.value)}
                placeholder=" "
                required
                floating
              />
            </div>

            {/* 3. Digitado */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">3) Digitado</h3>
              <Input
                label="Nome Completo"
                value={filledInput}
                onChange={(e) => setFilledInput(e.target.value)}
                placeholder=" "
                floating
              />
            </div>

            {/* 4. Desabilitado */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">4) Desabilitado</h3>
              <Input
                label="Nome Completo"
                value={disabledInput}
                onChange={(e) => setDisabledInput(e.target.value)}
                placeholder=" "
                disabled
                floating
              />
            </div>
          </div>

          {/* Código de exemplo */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Código de Exemplo:</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Normal */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Normal:</p>
                <pre className="text-xs font-mono text-gray-700">
{`<Input
  label="Nome Completo"
  value={normalInput}
  onChange={(e) => setNormalInput(e.target.value)}
  placeholder=" "
  floating
/>`}
                </pre>
              </div>

              {/* Obrigatório */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Obrigatório:</p>
                <pre className="text-xs font-mono text-gray-700">
{`<Input
  label="Nome Completo"
  value={requiredInput}
  onChange={(e) => setRequiredInput(e.target.value)}
  placeholder=" "
  required
  floating
/>`}
                </pre>
              </div>

              {/* Digitado */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Digitado:</p>
                <pre className="text-xs font-mono text-gray-700">
{`<Input
  label="Nome Completo"
  value={filledInput}
  onChange={(e) => setFilledInput(e.target.value)}
  placeholder=" "
  floating
/>`}
                </pre>
              </div>

              {/* Desabilitado */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Desabilitado:</p>
                <pre className="text-xs font-mono text-gray-700">
{`<Input
  label="Nome Completo"
  value={disabledInput}
  onChange={(e) => setDisabledInput(e.target.value)}
  placeholder=" "
  disabled
  floating
/>`}
                </pre>
              </div>
            </div>
          </div>

          {/* Props disponíveis */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Props Disponíveis:</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div><strong>label:</strong> string - Texto do label</div>
                <div><strong>value:</strong> string - Valor do input</div>
                <div><strong>onChange:</strong> function - Callback ao mudar valor</div>
                <div><strong>placeholder:</strong> string - Texto placeholder</div>
                <div><strong>floating:</strong> boolean - Label flutuante (default: true)</div>
                <div><strong>disabled:</strong> boolean - Desabilita o input</div>
                <div><strong>required:</strong> boolean - Campo obrigatório (*)</div>
                <div><strong>error:</strong> string - Mensagem de erro</div>
                <div><strong>fullWidth:</strong> boolean - Largura total</div>
                <div><strong>type:</strong> string - Tipo do input</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Componente Select */}
        <Card className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">Select</h2>

          {/* Grid com 4 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 1. Normal */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">1) Normal</h3>
              <Select
                label="Estado"
                value={normalSelect}
                onChange={(e) => setNormalSelect(e.target.value)}
                options={[
                  { value: '', label: 'Selecione...' },
                  { value: 'SP', label: 'São Paulo' },
                  { value: 'RJ', label: 'Rio de Janeiro' },
                  { value: 'MG', label: 'Minas Gerais' },
                  { value: 'ES', label: 'Espírito Santo' }
                ]}
              />
            </div>

            {/* 2. Obrigatório */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">2) Obrigatório</h3>
              <Select
                label="Estado"
                value={requiredSelect}
                onChange={(e) => setRequiredSelect(e.target.value)}
                required
                options={[
                  { value: '', label: 'Selecione...' },
                  { value: 'SP', label: 'São Paulo' },
                  { value: 'RJ', label: 'Rio de Janeiro' },
                  { value: 'MG', label: 'Minas Gerais' },
                  { value: 'ES', label: 'Espírito Santo' }
                ]}
              />
            </div>

            {/* 3. Selecionado */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">3) Selecionado</h3>
              <Select
                label="Estado"
                value={filledSelect}
                onChange={(e) => setFilledSelect(e.target.value)}
                options={[
                  { value: '', label: 'Selecione...' },
                  { value: 'SP', label: 'São Paulo' },
                  { value: 'RJ', label: 'Rio de Janeiro' },
                  { value: 'MG', label: 'Minas Gerais' },
                  { value: 'ES', label: 'Espírito Santo' }
                ]}
              />
            </div>

            {/* 4. Desabilitado */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">4) Desabilitado</h3>
              <Select
                label="Estado"
                value={disabledSelect}
                onChange={(e) => setDisabledSelect(e.target.value)}
                disabled
                options={[
                  { value: '', label: 'Selecione...' },
                  { value: 'SP', label: 'São Paulo' },
                  { value: 'RJ', label: 'Rio de Janeiro' },
                  { value: 'MG', label: 'Minas Gerais' },
                  { value: 'ES', label: 'Espírito Santo' }
                ]}
              />
            </div>
          </div>

          {/* Código de exemplo */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Código de Exemplo:</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Normal */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Normal:</p>
                <pre className="text-xs font-mono text-gray-700">
{`<Select
  label="Estado"
  value={normalSelect}
  onChange={(e) => setNormalSelect(e.target.value)}
  options={[
    { value: '', label: 'Selecione...' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'ES', label: 'Espírito Santo' }
  ]}
/>`}
                </pre>
              </div>

              {/* Obrigatório */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Obrigatório:</p>
                <pre className="text-xs font-mono text-gray-700">
{`<Select
  label="Estado"
  value={requiredSelect}
  onChange={(e) => setRequiredSelect(e.target.value)}
  required
  options={[
    { value: '', label: 'Selecione...' },
    { value: 'SP', label: 'São Paulo' },
    ...
  ]}
/>`}
                </pre>
              </div>

              {/* Selecionado */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Selecionado:</p>
                <pre className="text-xs font-mono text-gray-700">
{`<Select
  label="Estado"
  value={filledSelect} // "SP"
  onChange={(e) => setFilledSelect(e.target.value)}
  options={[...]
/>`}
                </pre>
              </div>

              {/* Desabilitado */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Desabilitado:</p>
                <pre className="text-xs font-mono text-gray-700">
{`<Select
  label="Estado"
  value={disabledSelect} // "RJ"
  onChange={(e) => setDisabledSelect(e.target.value)}
  disabled
  options={[...]
/>`}
                </pre>
              </div>
            </div>
          </div>

          {/* Props disponíveis */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Props Disponíveis:</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div><strong>label:</strong> string - Texto do label</div>
                <div><strong>value:</strong> string - Valor selecionado</div>
                <div><strong>onChange:</strong> function - Callback ao mudar seleção</div>
                <div><strong>options:</strong> array - Lista de opções {`{value, label}`}</div>
                <div><strong>floating:</strong> boolean - Label flutuante (default: true)</div>
                <div><strong>disabled:</strong> boolean - Desabilita o select</div>
                <div><strong>required:</strong> boolean - Campo obrigatório (*)</div>
                <div><strong>error:</strong> string - Mensagem de erro</div>
                <div><strong>fullWidth:</strong> boolean - Largura total</div>
                <div><strong>placeholder:</strong> string - Texto quando vazio</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Select Avançado */}
        <Card className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">Select Avançado</h2>

          <div className="space-y-8">
            {/* Múltipla Seleção */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-600">Múltipla Seleção</h3>
              <Select
                label="Estados"
                value={multipleSelect}
                onChange={(e) => setMultipleSelect(e.target.value as string[])}
                multiple
                options={[
                  { value: 'SP', label: 'São Paulo' },
                  { value: 'RJ', label: 'Rio de Janeiro' },
                  { value: 'MG', label: 'Minas Gerais' },
                  { value: 'ES', label: 'Espírito Santo' },
                  { value: 'PR', label: 'Paraná' },
                  { value: 'SC', label: 'Santa Catarina' },
                  { value: 'RS', label: 'Rio Grande do Sul' }
                ]}
              />
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-xs font-mono text-gray-700">
                  multiple={'{true}'}
                  <br />
                  value={'{'}[{multipleSelect.map(v => `'${v}'`).join(', ')}]{'}'}
                </p>
              </div>
            </div>

            {/* Editável e Adicionável */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-600">Editável e Adicionável</h3>
              <Select
                label="Cargos"
                value={editableSelect}
                onChange={(e) => setEditableSelect(e.target.value as string)}
                options={editableOptions}
                onOptionsChange={setEditableOptions}
                editable
                addable
              />
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-xs font-mono text-gray-700">
                  editable={'{true}'}
                  <br />
                  addable={'{true}'}
                  <br />
                  onOptionsChange={'{setOptions}'}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  • Digite para buscar (ignora acentos)<br />
                  • Hover sobre item para editar/excluir<br />
                  • Digite novo valor para adicionar
                </p>
              </div>
            </div>

            {/* Busca sem Acentos */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-600">Busca Inteligente</h3>
              <p className="text-xs text-gray-500 mb-2">
                Teste digitar "sao" (sem acento) para encontrar "São Paulo"
              </p>
              <Select
                label="Cidade"
                value=""
                onChange={() => {}}
                options={[
                  { value: 'sp', label: 'São Paulo' },
                  { value: 'rj', label: 'Rio de Janeiro' },
                  { value: 'bh', label: 'Belo Horizonte' },
                  { value: 'br', label: 'Brasília' },
                  { value: 'fl', label: 'Florianópolis' },
                  { value: 'pa', label: 'Porto Alegre' },
                  { value: 'go', label: 'Goiânia' },
                  { value: 'ma', label: 'Macapá' }
                ]}
              />
            </div>
          </div>

          {/* Props adicionais */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Props Adicionais:</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div><strong>multiple:</strong> boolean - Permite múltipla seleção</div>
                <div><strong>editable:</strong> boolean - Permite editar opções</div>
                <div><strong>addable:</strong> boolean - Permite adicionar novas opções</div>
                <div><strong>searchable:</strong> boolean - Mostra campo de busca (default: true)</div>
                <div><strong>onOptionsChange:</strong> function - Callback quando opções mudam</div>
                <div><strong>Busca inteligente:</strong> Ignora acentos automaticamente</div>
              </div>
            </div>
          </div>
        </Card>

        {/* DateInput */}
        <Card className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">DateInput</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 1. Normal */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">1) Normal</h3>
              <DateInput
                label="Data de Nascimento"
                value={normalDate}
                onChange={(e) => setNormalDate(e.target.value)}
              />
            </div>

            {/* 2. Obrigatório */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">2) Obrigatório</h3>
              <DateInput
                label="Data de Nascimento"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                required
              />
            </div>

            {/* 3. Preenchido */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">3) Preenchido</h3>
              <DateInput
                label="Data de Nascimento"
                value={filledDate}
                onChange={(e) => setFilledDate(e.target.value)}
              />
            </div>

            {/* 4. Desabilitado */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">4) Desabilitado</h3>
              <DateInput
                label="Data de Nascimento"
                value={disabledDate}
                onChange={(e) => setDisabledDate(e.target.value)}
                disabled
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recursos:</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <ul className="text-sm space-y-1">
                <li>• Máscara automática DD/MM/AAAA</li>
                <li>• Calendário dropdown ao clicar no ícone</li>
                <li>• Validação de data</li>
                <li>• Permite digitação com separadores automáticos</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* AutocompleteInput */}
        <Card className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">AutocompleteInput</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 1. Normal */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">1) Normal</h3>
              <AutocompleteInput
                label="Cargo/Função"
                value={autocompleteValue}
                onChange={setAutocompleteValue}
                placeholder="Digite ou selecione"
              />
            </div>

            {/* 2. Obrigatório */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">2) Obrigatório</h3>
              <AutocompleteInput
                label="Cargo/Função"
                value={autocompleteRequired}
                onChange={setAutocompleteRequired}
                placeholder="Digite ou selecione"
                required
              />
            </div>

            {/* 3. Preenchido */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">3) Preenchido</h3>
              <AutocompleteInput
                label="Cargo/Função"
                value={autocompleteFilled}
                onChange={setAutocompleteFilled}
                placeholder="Digite ou selecione"
              />
            </div>

            {/* 4. Desabilitado */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">4) Desabilitado</h3>
              <AutocompleteInput
                label="Cargo/Função"
                value={autocompleteDisabled}
                onChange={setAutocompleteDisabled}
                placeholder="Digite ou selecione"
                disabled
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recursos:</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <ul className="text-sm space-y-1">
                <li>• Busca inteligente com sugestões</li>
                <li>• Adicionar nova opção se não existir</li>
                <li>• Gerenciar todas as opções (adicionar, editar, excluir)</li>
                <li>• Ícone de gerenciar ao lado do campo</li>
                <li>• Modal com lista completa de opções</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Inputs com Máscara */}
        <Card className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">Inputs com Máscara</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* CPF */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">CPF</h3>
              <CPFInput
                label="CPF"
                value={cpfValue}
                onChange={setCpfValue}
              />
              <p className="text-xs text-gray-500 mt-1">Máscara: 000.000.000-00</p>
            </div>

            {/* CNPJ */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">CNPJ</h3>
              <CNPJInput
                label="CNPJ"
                value={cnpjValue}
                onChange={setCnpjValue}
              />
              <p className="text-xs text-gray-500 mt-1">Máscara: 00.000.000/0000-00</p>
            </div>

            {/* Telefone */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">Telefone</h3>
              <PhoneInput
                label="Telefone"
                value={phoneValue}
                onChange={setPhoneValue}
              />
              <p className="text-xs text-gray-500 mt-1">Máscara: (00) 0000-0000</p>
            </div>

            {/* Email */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">E-mail</h3>
              <EmailInput
                label="E-mail"
                value={emailValue}
                onChange={setEmailValue}
              />
              <p className="text-xs text-gray-500 mt-1">Validação de e-mail</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Código de Exemplo:</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* CPF */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">CPF:</p>
                <pre className="text-xs font-mono text-gray-700">
{`<CPFInput
  label="CPF"
  value={cpfValue}
  onChange={setCpfValue}
/>`}
                </pre>
              </div>

              {/* CNPJ */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">CNPJ:</p>
                <pre className="text-xs font-mono text-gray-700">
{`<CNPJInput
  label="CNPJ"
  value={cnpjValue}
  onChange={setCnpjValue}
/>`}
                </pre>
              </div>

              {/* Phone */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Telefone:</p>
                <pre className="text-xs font-mono text-gray-700">
{`<PhoneInput
  label="Telefone"
  value={phoneValue}
  onChange={setPhoneValue}
/>`}
                </pre>
              </div>

              {/* Email */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">E-mail:</p>
                <pre className="text-xs font-mono text-gray-700">
{`<EmailInput
  label="E-mail"
  value={emailValue}
  onChange={setEmailValue}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}