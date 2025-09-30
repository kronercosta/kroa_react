'use client';

import React from 'react';

interface SubMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface SubMenuProps {
  items: SubMenuItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  variant?: 'default' | 'withHeader' | 'compact';
  header?: {
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode | string;
    info?: string[];
  };
  className?: string;
}

export function SubMenu({
  items,
  activeItem,
  onItemClick,
  variant = 'default',
  header,
  className = ''
}: SubMenuProps) {

  // Variant with header
  if (variant === 'withHeader' && header) {
    return (
      <div className={`w-full ${className}`}>
        {/* Header Section */}
        <div className="bg-white px-6 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {header.icon && (
              <div className="flex-shrink-0">
                {typeof header.icon === 'string' ? (
                  <div className="w-12 h-12 bg-krooa-green/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{header.icon}</span>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-krooa-green/10 rounded-lg flex items-center justify-center">
                    {header.icon}
                  </div>
                )}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-baseline gap-4">
                {header.title && (
                  <h2 className="text-lg font-bold text-krooa-dark">{header.title}</h2>
                )}
                {header.info && header.info.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {header.info.map((item, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && <span className="text-gray-300">•</span>}
                        <span>{item}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
              {header.subtitle && (
                <p className="text-xs text-gray-500 mt-0.5">{header.subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white px-6 overflow-x-auto">
          <div className="flex gap-1 border-b border-gray-200 min-w-max">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={`
                  relative px-4 py-3 text-sm font-medium transition-all duration-200
                  ${activeItem === item.id
                    ? ''
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {/* Active Tab Background */}
                {activeItem === item.id && (
                  <>
                    <div className="absolute inset-0 bg-krooa-dark rounded-t-lg" />
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-krooa-green" />
                  </>
                )}

                {/* Tab Content */}
                <span className={`relative z-10 flex items-center gap-2 ${
                  activeItem === item.id ? 'text-krooa-green' : ''
                }`}>
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span className={`
                      ml-1 px-1.5 py-0.5 text-xs rounded-full
                      ${activeItem === item.id
                        ? 'bg-krooa-green/20 text-krooa-green'
                        : 'bg-gray-200 text-gray-600'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Compact variant (smaller tabs)
  if (variant === 'compact') {
    return (
      <div className={`w-full bg-white ${className}`}>
        <div className="px-4 overflow-x-auto">
          <div className="flex gap-0.5 border-b border-gray-200 min-w-max">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={`
                  relative px-3 py-2 text-xs font-medium transition-all duration-200
                  ${activeItem === item.id
                    ? ''
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {activeItem === item.id && (
                  <>
                    <div className="absolute inset-0 bg-krooa-dark rounded-t-md" />
                    <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-krooa-green" />
                  </>
                )}

                <span className={`relative z-10 flex items-center gap-1.5 ${
                  activeItem === item.id ? 'text-krooa-green' : ''
                }`}>
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span className="ml-0.5 text-[10px]">
                      ({item.badge})
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`w-full bg-white ${className}`}>
      <div className="px-6 py-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`
                relative px-5 py-2.5 text-sm font-semibold transition-all duration-200 rounded-full
                ${activeItem === item.id
                  ? 'bg-krooa-green text-krooa-dark shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              {item.label}
              {item.badge && (
                <span className={`
                  ml-1.5 px-1.5 py-0.5 text-xs rounded-full
                  ${activeItem === item.id
                    ? 'bg-krooa-dark/10 text-krooa-dark'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}