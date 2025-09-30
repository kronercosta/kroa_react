import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  href: string;
  title: string;
  icon: JSX.Element;
  isActive?: boolean;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    title: 'Dashboard Pessoal',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
      </svg>
    )
  },
  {
    href: '/agenda',
    title: 'Agenda',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    )
  },
  {
    href: '/pacientes',
    title: 'Pacientes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
    )
  },
  {
    href: '/financeiro',
    title: 'Financeiro',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    )
  },
  {
    href: '/crm',
    title: 'CRM',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8m0 0V4a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2"></path>
      </svg>
    )
  },
  {
    href: '/comunicacao',
    title: 'Central de Comunicação',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    )
  },
  {
    href: '/birdid',
    title: 'BirdID',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>
    ),
    badge: 'Ativo'
  },
  {
    href: '/components',
    title: 'Componentes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
      </svg>
    )
  }
];

interface NavigationProps {
  sidebarOpen: boolean;
}

export function Navigation({ sidebarOpen }: NavigationProps) {
  const location = useLocation();

  return (
    <nav className="flex-1 py-4 space-y-1 px-2">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;

        return (
          <div key={item.href} className="relative">
            <Link
              to={item.href}
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
                  {item.icon}
                  {/* Badge pulsante para BirdID quando sidebar fechada */}
                  {!sidebarOpen && item.href === '/birdid' && (
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