import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

interface NavItem {
  title: string;
  url: string;
  icon: string;
  badge?: string;
}

// Array de navegação - apenas adicione/edite aqui para mudar o menu
const navItems: NavItem[] = [
  {
    title: 'Dashboard Pessoal',
    url: '/dashboard',
    icon: 'mdi:home-outline',
  },
  {
    title: 'Agenda',
    url: '/agenda',
    icon: 'mdi:calendar-outline',
  },
  {
    title: 'Pacientes',
    url: '/pacientes',
    icon: 'mdi:account-group-outline',
  },
  {
    title: 'Financeiro',
    url: '/financeiro',
    icon: 'mdi:currency-usd',
  },
  {
    title: 'CRM',
    url: '/crm',
    icon: 'mdi:message-text-outline',
  },
  {
    title: 'Central de Comunicação',
    url: '/comunicacao',
    icon: 'mdi:chat-outline',
  },
  {
    title: 'BirdID',
    url: '/birdid',
    icon: 'mdi:shield-check-outline',
    badge: 'Ativo',
  },
  {
    title: 'Componentes',
    url: '/components',
    icon: 'mdi:view-dashboard-outline',
  },
];

interface NavigationProps {
  sidebarOpen: boolean;
}

export function Navigation({ sidebarOpen }: NavigationProps) {
  const location = useLocation();

  return (
    <nav className="flex-1 py-4 space-y-1 px-2">
      {navItems.map((item) => {
        const isActive = location.pathname === item.url;

        return (
          <div key={item.url} className="relative">
            <Link
              to={item.url}
              className={`
                flex items-center h-12 rounded-lg transition-all duration-200 group relative
                ${sidebarOpen ? 'px-3 space-x-3' : 'justify-center'}
                ${isActive
                  ? 'bg-krooa-green text-krooa-dark'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }
              `}
              title={!sidebarOpen ? item.title : undefined}
            >
              <div className="relative flex items-center">
                <div className="relative">
                  <Icon icon={item.icon} className="w-5 h-5" />
                  {/* Badge pulsante quando sidebar fechada */}
                  {!sidebarOpen && item.badge && (
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-krooa-green rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>

              {/* Label quando sidebar expandida */}
              {sidebarOpen && (
                <span className="flex-1 text-sm font-medium">{item.title}</span>
              )}

              {/* Badge quando sidebar expandida */}
              {sidebarOpen && item.badge && (
                <span className="text-xs bg-krooa-green text-krooa-dark px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}

              {/* Tooltip apenas quando sidebar fechada */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {item.title}
                  {item.badge && (
                    <span className="text-krooa-green text-xs block">{item.badge}</span>
                  )}
                </div>
              )}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}