import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button, IconButton } from '../../../components/ui/Button';
import {
  Save,
  Trash2,
  Edit,
  Plus,
  X,
  Check,
  Download,
  Upload,
  Search,
  Heart,
  Share2,
  Settings,
  ChevronRight,
  Mail,
  Phone,
  User
} from 'lucide-react';

export default function ButtonShowcase() {
  // Estados para o Button
  const [buttonProps, setButtonProps] = useState({
    variant: 'primary' as const,
    size: 'md' as const,
    fullWidth: false,
    loading: false,
    disabled: false,
    withIcon: false,
    iconPosition: 'left' as const
  });

  // Estados para o IconButton
  const [iconButtonProps, setIconButtonProps] = useState({
    variant: 'ghost' as const,
    size: 'md' as const,
    disabled: false
  });

  // Ícones disponíveis
  const icons = {
    save: <Save className="w-4 h-4" />,
    trash: <Trash2 className="w-4 h-4" />,
    edit: <Edit className="w-4 h-4" />,
    plus: <Plus className="w-4 h-4" />,
    close: <X className="w-4 h-4" />,
    check: <Check className="w-4 h-4" />,
    download: <Download className="w-4 h-4" />,
    upload: <Upload className="w-4 h-4" />,
    search: <Search className="w-4 h-4" />,
  };

  const [selectedIcon, setSelectedIcon] = useState<keyof typeof icons>('save');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Button Showcase</h1>
          <p className="mt-2 text-gray-600">Teste todas as variações e configurações dos botões</p>
        </div>

        {/* Button Normal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configurações do Button */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">Configurações do Button</h2>

            <div className="space-y-6">
              {/* Variante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Variante</label>
                <select
                  value={buttonProps.variant}
                  onChange={(e) => setButtonProps({ ...buttonProps, variant: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                >
                  <option value="primary">Primary (Verde)</option>
                  <option value="secondary">Secondary (Azul)</option>
                  <option value="danger">Danger (Vermelho)</option>
                  <option value="ghost">Ghost (Transparente)</option>
                  <option value="outline">Outline (Bordas)</option>
                  <option value="menu-item">Menu Item</option>
                </select>
              </div>

              {/* Tamanho */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho</label>
                <select
                  value={buttonProps.size}
                  onChange={(e) => setButtonProps({ ...buttonProps, size: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                >
                  <option value="sm">Pequeno</option>
                  <option value="md">Médio</option>
                  <option value="lg">Grande</option>
                </select>
              </div>

              {/* Ícone */}
              {buttonProps.withIcon && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
                    <select
                      value={selectedIcon}
                      onChange={(e) => setSelectedIcon(e.target.value as keyof typeof icons)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                    >
                      <option value="save">Save</option>
                      <option value="trash">Trash</option>
                      <option value="edit">Edit</option>
                      <option value="plus">Plus</option>
                      <option value="close">Close</option>
                      <option value="check">Check</option>
                      <option value="download">Download</option>
                      <option value="upload">Upload</option>
                      <option value="search">Search</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Posição do Ícone</label>
                    <select
                      value={buttonProps.iconPosition}
                      onChange={(e) => setButtonProps({ ...buttonProps, iconPosition: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                    >
                      <option value="left">Esquerda</option>
                      <option value="right">Direita</option>
                    </select>
                  </div>
                </>
              )}

              {/* Toggles */}
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <span className="text-sm font-medium text-gray-700">Largura Total</span>
                  <input
                    type="checkbox"
                    checked={buttonProps.fullWidth}
                    onChange={(e) => setButtonProps({ ...buttonProps, fullWidth: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
                  <span className="text-sm font-medium text-blue-700">Com Ícone</span>
                  <input
                    type="checkbox"
                    checked={buttonProps.withIcon}
                    onChange={(e) => setButtonProps({ ...buttonProps, withIcon: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100">
                  <span className="text-sm font-medium text-yellow-700">Carregando</span>
                  <input
                    type="checkbox"
                    checked={buttonProps.loading}
                    onChange={(e) => setButtonProps({ ...buttonProps, loading: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100">
                  <span className="text-sm font-medium text-red-700">Desabilitado</span>
                  <input
                    type="checkbox"
                    checked={buttonProps.disabled}
                    onChange={(e) => setButtonProps({ ...buttonProps, disabled: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>
              </div>
            </div>
          </Card>

          {/* Preview do Button */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">Preview do Button</h2>

            <div className="space-y-6">
              {/* Preview principal */}
              <div className="flex justify-center p-8 bg-gray-50 rounded-lg">
                <Button
                  variant={buttonProps.variant}
                  size={buttonProps.size}
                  fullWidth={buttonProps.fullWidth}
                  loading={buttonProps.loading}
                  disabled={buttonProps.disabled}
                  icon={buttonProps.withIcon ? icons[selectedIcon] : undefined}
                  iconPosition={buttonProps.iconPosition}
                  onClick={() => console.log('Button clicked!')}
                >
                  {buttonProps.loading ? 'Processando...' : 'Clique Aqui'}
                </Button>
              </div>

              {/* Código */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-700 mb-2">Código:</h3>
                <pre className="text-xs font-mono text-blue-900 overflow-x-auto">
{`<Button
  variant="${buttonProps.variant}"
  size="${buttonProps.size}"
  fullWidth={${buttonProps.fullWidth}}
  loading={${buttonProps.loading}}
  disabled={${buttonProps.disabled}}${buttonProps.withIcon ? `
  icon={<${selectedIcon.charAt(0).toUpperCase() + selectedIcon.slice(1)} />}
  iconPosition="${buttonProps.iconPosition}"` : ''}
>
  ${buttonProps.loading ? 'Processando...' : 'Clique Aqui'}
</Button>`}
                </pre>
              </div>

              {/* Exemplos de uso */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Exemplos Comuns:</h3>
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="primary" icon={<Save className="w-4 h-4" />}>
                      Salvar
                    </Button>
                    <Button variant="secondary" icon={<Edit className="w-4 h-4" />}>
                      Editar
                    </Button>
                    <Button variant="danger" icon={<Trash2 className="w-4 h-4" />}>
                      Excluir
                    </Button>
                    <Button variant="ghost" icon={<X className="w-4 h-4" />}>
                      Cancelar
                    </Button>
                    <Button variant="outline" icon={<Download className="w-4 h-4" />}>
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* IconButton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configurações do IconButton */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">Configurações do IconButton</h2>

            <div className="space-y-6">
              {/* Variante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Variante</label>
                <select
                  value={iconButtonProps.variant}
                  onChange={(e) => setIconButtonProps({ ...iconButtonProps, variant: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="danger">Danger</option>
                  <option value="ghost">Ghost</option>
                  <option value="outline">Outline</option>
                </select>
              </div>

              {/* Tamanho */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho</label>
                <select
                  value={iconButtonProps.size}
                  onChange={(e) => setIconButtonProps({ ...iconButtonProps, size: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-krooa-green"
                >
                  <option value="sm">Pequeno</option>
                  <option value="md">Médio</option>
                  <option value="lg">Grande</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100">
                  <span className="text-sm font-medium text-red-700">Desabilitado</span>
                  <input
                    type="checkbox"
                    checked={iconButtonProps.disabled}
                    onChange={(e) => setIconButtonProps({ ...iconButtonProps, disabled: e.target.checked })}
                    className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                  />
                </label>
              </div>
            </div>
          </Card>

          {/* Preview do IconButton */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">Preview do IconButton</h2>

            <div className="space-y-6">
              {/* Preview principal */}
              <div className="flex justify-center p-8 bg-gray-50 rounded-lg">
                <IconButton
                  variant={iconButtonProps.variant}
                  size={iconButtonProps.size}
                  disabled={iconButtonProps.disabled}
                  onClick={() => console.log('IconButton clicked!')}
                >
                  <Heart className="w-4 h-4" />
                </IconButton>
              </div>

              {/* Galeria de IconButtons */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Exemplos de Uso:</h3>
                <div className="flex gap-3 flex-wrap">
                  <IconButton variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </IconButton>
                  <IconButton variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </IconButton>
                  <IconButton variant="primary">
                    <Plus className="w-4 h-4" />
                  </IconButton>
                  <IconButton variant="danger">
                    <X className="w-4 h-4" />
                  </IconButton>
                  <IconButton variant="secondary">
                    <Settings className="w-4 h-4" />
                  </IconButton>
                  <IconButton variant="outline">
                    <Share2 className="w-4 h-4" />
                  </IconButton>
                </div>
              </div>

              {/* Casos de uso */}
              <div className="space-y-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Ações em lista</span>
                    <div className="flex gap-1">
                      <IconButton variant="ghost" size="sm">
                        <Edit className="w-3 h-3" />
                      </IconButton>
                      <IconButton variant="ghost" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </IconButton>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Modal/Dialog</span>
                    <IconButton variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Showcase de todas as variantes */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">Todas as Variantes</h2>

          <div className="space-y-6">
            {/* Tamanhos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tamanhos</h3>
              <div className="flex gap-3 items-center flex-wrap">
                <Button size="sm">Pequeno</Button>
                <Button size="md">Médio</Button>
                <Button size="lg">Grande</Button>
              </div>
            </div>

            {/* Variantes */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Variantes</h3>
              <div className="flex gap-3 flex-wrap">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </div>

            {/* Menu Item */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Menu Item (Dropdown)</h3>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-64">
                <Button variant="menu-item" fullWidth className="px-4 py-2 text-sm">
                  Visualizar histórico
                </Button>
                <Button variant="menu-item" fullWidth className="px-4 py-2 text-sm">
                  Editar informações
                </Button>
                <Button variant="menu-item" fullWidth className="px-4 py-2 text-sm">
                  Excluir item
                </Button>
              </div>
            </div>

            {/* Estados */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Estados</h3>
              <div className="flex gap-3 flex-wrap">
                <Button>Normal</Button>
                <Button loading>Carregando</Button>
                <Button disabled>Desabilitado</Button>
              </div>
            </div>

            {/* Com ícones */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Com Ícones</h3>
              <div className="flex gap-3 flex-wrap">
                <Button icon={<Mail className="w-4 h-4" />}>
                  Enviar Email
                </Button>
                <Button icon={<Phone className="w-4 h-4" />} iconPosition="right">
                  Ligar Agora
                </Button>
                <Button variant="secondary" icon={<User className="w-4 h-4" />}>
                  Perfil
                </Button>
              </div>
            </div>

            {/* Largura total */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Largura Total</h3>
              <div className="space-y-2">
                <Button fullWidth variant="primary">
                  Botão com Largura Total
                </Button>
                <Button fullWidth variant="outline">
                  Outro Botão com Largura Total
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}