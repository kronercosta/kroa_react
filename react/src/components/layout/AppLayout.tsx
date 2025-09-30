import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Logo } from '../Logo';
import { useClinic } from '../../contexts/ClinicContext';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [crmSubmenuOpen, setCrmSubmenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [configMenuOpen, setConfigMenuOpen] = useState(false);
  const configMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Estados para seletores de unidade e centro de custo
  const { multiplasUnidadesEnabled, centroCustoEnabled } = useClinic();
  const [unidades] = useState([
    { id: 1, name: 'Unidade Principal' },
    { id: 2, name: 'Unidade Setor Oeste' },
    { id: 3, name: 'Unidade Centro' }
  ]);
  const [centrosCusto] = useState([
    { id: 1, name: 'Ortodontia' },
    { id: 2, name: 'Endodontia' },
    { id: 3, name: 'Cirurgia' }
  ]);
  const [selectedUnidades, setSelectedUnidades] = useState<number[]>([]);
  const [selectedCentros, setSelectedCentros] = useState<number[]>([]);
  const [unidadeDropdownOpen, setUnidadeDropdownOpen] = useState(false);
  const [centroDropdownOpen, setCentroDropdownOpen] = useState(false);

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (configMenuRef.current && !configMenuRef.current.contains(event.target as Node)) {
        setConfigMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      href: '/dashboard',
      title: 'Dashboard Pessoal'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/agenda',
      title: 'Agenda'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      href: '/pacientes',
      title: 'Pacientes'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: '/financeiro',
      title: 'Financeiro'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8m0 0V4a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2" />
        </svg>
      ),
      href: '/crm',
      title: 'CRM',
      hasSubmenu: true,
      submenu: [
        { href: '/crm', label: 'CRM' },
        { href: '/crm/whatsapp', label: 'WhatsApp' }
      ]
    },
  ];

  const isActive = (href: string) => {
    if (href === '/crm' && (pathname === '/crm' || pathname === '/crm/whatsapp')) {
      return true;
    }
    return pathname === href;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Lateral - Desktop only */}
      <div className={`
        ${sidebarExpanded ? 'w-64' : 'w-16'}
        hidden lg:flex
        h-full
        bg-white border-r border-gray-200 flex-col relative z-20 transition-all duration-300
      `}>
        {/* Menu Hamburguer no topo */}
        <div className="h-16 flex items-center px-2 border-b border-gray-200">
          {sidebarExpanded ? (
            <div className="flex items-center justify-between w-full">
              <Logo size="md" />
              <button
                onClick={() => setSidebarExpanded(false)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSidebarExpanded(true)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mx-auto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Menu Principal */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {menuItems.map((item, index) => (
            <div key={index} className="relative">
              <Link
                to={item.href}
                className={`flex items-center ${sidebarExpanded ? 'justify-start px-3' : 'justify-center'} h-12 rounded-lg transition-all duration-200 group relative ${
                  isActive(item.href)
                    ? 'bg-krooa-dark text-krooa-green shadow-lg'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title={!sidebarExpanded ? item.title : undefined}
                onMouseEnter={() => item.hasSubmenu && setCrmSubmenuOpen(true)}
                onMouseLeave={() => item.hasSubmenu && setCrmSubmenuOpen(false)}
              >
                <div className="relative flex items-center">
                  <div className="relative">
                    {item.icon}
                  </div>
                  {sidebarExpanded && (
                    <span className="ml-3 whitespace-nowrap">{item.title}</span>
                  )}
                </div>

                {/* Tooltip - apenas quando fechado */}
                {!sidebarExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.title}
                  </div>
                )}
              </Link>

              {/* Submenu do CRM */}
              {item.hasSubmenu && crmSubmenuOpen && (
                <div
                  className={`absolute ${sidebarExpanded ? 'left-full' : 'left-full'} ml-1 top-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50`}
                  onMouseEnter={() => setCrmSubmenuOpen(true)}
                  onMouseLeave={() => setCrmSubmenuOpen(false)}
                >
                  {item.submenu?.map((subitem, subindex) => (
                    <Link
                      key={subindex}
                      to={subitem.href}
                      className={`block px-4 py-2 text-sm whitespace-nowrap hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                        pathname === subitem.href ? 'bg-krooa-green/10 text-krooa-dark font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Menu Inferior - Perfil e Logout */}
        <div className="border-t border-gray-200 p-2 space-y-2">
          <button className={`${sidebarExpanded ? 'w-full flex items-center gap-3 px-3 py-2' : 'w-12 h-12'} bg-krooa-green rounded-full flex items-center justify-center text-krooa-dark font-bold hover:ring-2 hover:ring-krooa-green hover:ring-offset-2 hover:ring-offset-white transition-all`}>
            {sidebarExpanded ? (
              <>
                <span className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">JS</span>
                <span className="text-sm">João Silva</span>
              </>
            ) : (
              'JS'
            )}
          </button>

          <Link
            to="/login"
            className={`flex items-center ${sidebarExpanded ? 'justify-start gap-3 px-3 py-2' : 'justify-center h-10'} text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
            title="Sair"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarExpanded && <span>Sair</span>}
          </Link>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Superior */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Dropdown */}
            <div className="relative lg:hidden" ref={mobileMenuRef}>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Mobile Menu Dropdown */}
              {mobileMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700">Menu</h3>
                  </div>

                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                        isActive(item.href)
                          ? 'bg-krooa-green/10 text-krooa-dark font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  ))}

                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sair</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Logo Krooa */}
            <Logo size="sm" className="hidden lg:block" />
          </div>

          <div className="flex items-center gap-3">
            {/* Seletor de Unidade - Multi-select */}
            {multiplasUnidadesEnabled && unidades.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setUnidadeDropdownOpen(!unidadeDropdownOpen)}
                  className="flex items-center gap-2 text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-1.5 hover:border-krooa-green transition-colors bg-white min-w-[160px]"
                >
                  <span className="flex-1 text-left">
                    {selectedUnidades.length === 0
                      ? 'Todas as Unidades'
                      : selectedUnidades.length === 1
                      ? unidades.find(u => u.id === selectedUnidades[0])?.name
                      : `${selectedUnidades.length} selecionadas`
                    }
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${unidadeDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {unidadeDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                    <button
                      onClick={() => {
                        setSelectedUnidades([]);
                        setUnidadeDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                    >
                      Todas as Unidades
                    </button>
                    {unidades.map(unidade => (
                      <label
                        key={unidade.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUnidades.includes(unidade.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUnidades([...selectedUnidades, unidade.id]);
                            } else {
                              setSelectedUnidades(selectedUnidades.filter(id => id !== unidade.id));
                            }
                          }}
                          className="mr-2 rounded border-gray-300 text-krooa-green focus:ring-krooa-green"
                        />
                        <span className="text-sm text-gray-700">{unidade.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Seletor de Centro de Custo - Multi-select */}
            {centroCustoEnabled && centrosCusto.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setCentroDropdownOpen(!centroDropdownOpen)}
                  className="flex items-center gap-2 text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-1.5 hover:border-krooa-green transition-colors bg-white min-w-[160px]"
                >
                  <span className="flex-1 text-left">
                    {selectedCentros.length === 0
                      ? 'Todos os Centros'
                      : selectedCentros.length === 1
                      ? centrosCusto.find(c => c.id === selectedCentros[0])?.name
                      : `${selectedCentros.length} selecionados`
                    }
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${centroDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {centroDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                    <button
                      onClick={() => {
                        setSelectedCentros([]);
                        setCentroDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                    >
                      Todos os Centros
                    </button>
                    {centrosCusto.map(centro => (
                      <label
                        key={centro.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCentros.includes(centro.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCentros([...selectedCentros, centro.id]);
                            } else {
                              setSelectedCentros(selectedCentros.filter(id => id !== centro.id));
                            }
                          }}
                          className="mr-2 rounded border-gray-300 text-krooa-green focus:ring-krooa-green"
                        />
                        <span className="text-sm text-gray-700">{centro.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Divisor */}
            {(multiplasUnidadesEnabled || centroCustoEnabled) && (
              <div className="h-6 w-px bg-gray-300"></div>
            )}

            {/* Busca */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Notificações */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Configurações */}
            <div className="relative" ref={configMenuRef}>
              <button
                onClick={() => setConfigMenuOpen(!configMenuOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Menu Dropdown de Configurações */}
              {configMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700">Configurações</h3>
                  </div>

                  <Link
                    to="/configuracoes/clinica"
                    onClick={() => setConfigMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>Clínica</span>
                  </Link>

                  <Link
                    to="/configuracoes/colaborador"
                    onClick={() => setConfigMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Colaborador</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Área de Conteúdo */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;