import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { MultiSelect } from './ui/MultiSelect';
import { useClinic } from '../contexts/ClinicContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { multiplasUnidadesEnabled, centroCustoEnabled } = useClinic();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [configMenuOpen, setConfigMenuOpen] = useState(false);
  const [selectedUnidades, setSelectedUnidades] = useState<string[]>([]);
  const [selectedCentros, setSelectedCentros] = useState<string[]>([]);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const configMenuRef = useRef<HTMLDivElement>(null);

  // Fechar menus quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      if (configMenuRef.current && !configMenuRef.current.contains(event.target as Node)) {
        setConfigMenuOpen(false);
      }
    }

    if (mobileMenuOpen || configMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen, configMenuOpen]);

  // Fechar dropdown mobile quando redimensionar para desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    // Simular logout
    window.location.href = '/login';
  };

  const unidadesOptions = [
    { value: '1', label: 'Unidade Principal' },
    { value: '2', label: 'Unidade Setor Oeste' },
    { value: '3', label: 'Unidade Centro' },
    { value: '4', label: 'Unidade Norte' },
    { value: '5', label: 'Unidade Sul' }
  ];

  const centrosOptions = [
    { value: '1', label: 'Ortodontia' },
    { value: '2', label: 'Endodontia' },
    { value: '3', label: 'Cirurgia' },
    { value: '4', label: 'Periodontia' },
    { value: '5', label: 'Implantodontia' }
  ];

  // Menu de configurações - Array simples com Iconify
  const configItems = [
    {
      title: 'Clínica',
      href: '/configuracoes/clinica',
      icon: 'mdi:office-building-outline',
    },
    {
      title: 'Colaborador',
      href: '/configuracoes/colaborador',
      icon: 'mdi:account-group-outline',
    },
    {
      title: 'Parceiros e Serviços',
      href: '/configuracoes/parceiros',
      icon: 'mdi:briefcase-outline',
    },
    {
      title: 'Evolução',
      href: '/configuracoes/evolucao',
      icon: 'mdi:file-document-outline',
    },
    {
      title: 'Assinatura Digital',
      href: '/configuracoes/assinatura',
      icon: 'mdi:draw-pen',
    },
    {
      title: 'Financeiro',
      href: '/configuracoes/financeiro',
      icon: 'mdi:currency-usd',
    },
    {
      title: 'Landing Page',
      href: '/configuracoes/landing',
      icon: 'mdi:web',
    },
    {
      title: 'Central de Comunicação',
      href: '/configuracoes/comunicacao',
      icon: 'mdi:chat-outline',
    },
  ];

  // Menu mobile - Array simples com Iconify
  const menuItems = [
    {
      title: 'Dashboard Pessoal',
      href: '/dashboard',
      icon: 'mdi:home-outline',
    },
    {
      title: 'Agenda',
      href: '/agenda',
      icon: 'mdi:calendar-outline',
    },
    {
      title: 'Pacientes',
      href: '/pacientes',
      icon: 'mdi:account-group-outline',
    },
    {
      title: 'Financeiro',
      href: '/financeiro',
      icon: 'mdi:currency-usd',
    },
    {
      title: 'CRM',
      href: '/crm',
      icon: 'mdi:message-text-outline',
    },
    {
      title: 'Central de Comunicação',
      href: '/comunicacao',
      icon: 'mdi:chat-outline',
    },
    {
      title: 'BirdID',
      href: '/birdid',
      icon: 'mdi:shield-check-outline',
      badge: true,
    },
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar - Hidden on mobile */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 hidden md:flex`}>
        {/* Header da Sidebar */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 h-16">
          {/* Logo da Sidebar */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'}`}>
            <Logo size="sm" />
          </div>
          <div className={`${sidebarOpen ? 'hidden' : 'block'}`}>
            <Logo size="sm" variant="icon" />
          </div>

          {/* Menu Hamburger Desktop (apenas expande/colapsa sidebar) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Icon icon="mdi:menu" className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <Navigation sidebarOpen={sidebarOpen} />

        {/* User Info e Logout */}
        <div className="mt-auto border-t border-gray-200 p-4 space-y-3">
          {/* Ícone do Colaborador */}
          <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-krooa-green rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-krooa-dark">U</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Usuário</p>
                <p className="text-xs text-gray-500 truncate">usuario@krooa.com</p>
              </div>
            )}
          </div>

          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 px-3' : 'justify-center'} py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group`}
            title="Sair"
          >
            <Icon icon="mdi:logout" className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Sair</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 h-16">
          <div className="flex items-center justify-between h-full">
            {/* Logo Principal */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Menu Hambúrguer Mobile */}
              <div className="relative md:hidden" ref={menuRef}>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <Icon icon="mdi:menu" className="w-5 h-5" />
                </button>

                {/* Dropdown Menu Mobile */}
                {mobileMenuOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[calc(100vh-100px)] overflow-y-auto">
                    {/* Superfiltros no mobile */}
                    {(multiplasUnidadesEnabled || centroCustoEnabled) && (
                      <div className="p-4 border-b border-gray-200 space-y-3">
                        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Filtros</h3>
                        {multiplasUnidadesEnabled && (
                          <MultiSelect
                            placeholder="Todas as Unidades"
                            options={unidadesOptions}
                            value={selectedUnidades}
                            onChange={setSelectedUnidades}
                            multiple={true}
                          />
                        )}
                        {centroCustoEnabled && (
                          <MultiSelect
                            placeholder="Todos os Centros"
                            options={centrosOptions}
                            value={selectedCentros}
                            onChange={setSelectedCentros}
                            multiple={true}
                          />
                        )}
                      </div>
                    )}

                    <div className="py-2">
                      <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Menu Principal</h3>
                      </div>

                      {menuItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.href}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            location.pathname === item.href
                              ? 'bg-krooa-green/10 text-krooa-dark font-semibold border-l-4 border-krooa-green'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon icon={item.icon} className="w-5 h-5" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto w-2 h-2 bg-krooa-green rounded-full animate-pulse"></span>
                          )}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 mt-2 p-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Icon icon="mdi:logout" className="w-5 h-5" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Logo - pequena no mobile, completa no desktop */}
              <img
                src="/Symboll_Gradient_Light.png"
                alt="Krooa"
                className="h-8 sm:hidden object-contain"
              />
              <img
                src="/logo_Full_Gradient_Light.png"
                alt="Krooa"
                className="hidden sm:block h-14 object-contain"
              />
            </div>

            {/* Ações do header - Lado direito */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* 1. Superfiltros - Ocultos no mobile */}
              {(multiplasUnidadesEnabled || centroCustoEnabled) && (
                <div className="hidden md:flex items-center gap-3">
                  {/* Seletor de Unidades (Múltipla Seleção) */}
                  {multiplasUnidadesEnabled && (
                    <MultiSelect
                      placeholder="Todas as Unidades2"
                      options={unidadesOptions}
                      value={selectedUnidades}
                      onChange={setSelectedUnidades}
                      multiple={true}
                    />
                  )}

                  {/* Seletor de Centro de Custo (Seleção Múltipla) */}
                  {centroCustoEnabled && (
                    <MultiSelect
                      placeholder="Todos os Centros"
                      options={centrosOptions}
                      value={selectedCentros}
                      onChange={setSelectedCentros}
                      multiple={true}
                    />
                  )}
                </div>
              )}

              {/* Divisor sutil - Oculto no mobile */}
              {(multiplasUnidadesEnabled || centroCustoEnabled) && (
                <div className="hidden md:block h-6 w-px bg-gray-300"></div>
              )}

              {/* 2. Busca */}
              <button className="text-gray-500 hover:text-gray-700 transition-colors p-1">
                <Icon icon="mdi:magnify" className="w-5 h-5" />
              </button>

              {/* 3. Notificações/Alerta */}
              <button className="relative text-gray-500 hover:text-gray-700 transition-colors p-1">
                <Icon icon="mdi:bell-outline" className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              </button>

              {/* 4. Menu de Configurações */}
              <div className="relative" ref={configMenuRef}>
                <button
                  onClick={() => setConfigMenuOpen(!configMenuOpen)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                >
                  <Icon icon="mdi:cog-outline" className="w-5 h-5" />
                </button>

                {/* Dropdown Menu de Configurações */}
                {configMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700">Configurações</h3>
                    </div>

                    {configItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.href}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setConfigMenuOpen(false)}
                      >
                        <Icon icon={item.icon} className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
          <div className="flex h-full">
            {/* Main Content Area */}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}