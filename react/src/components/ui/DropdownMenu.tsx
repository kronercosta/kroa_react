import React, { useState, useRef, useEffect } from 'react';
import { useUITranslation } from '../../hooks/useUITranslation';

interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  position?: 'left' | 'right';
  className?: string;
  triggerOnHover?: boolean;
}

export function DropdownMenu({
  trigger,
  items,
  position = 'right',
  className = '',
  triggerOnHover = false
}: DropdownMenuProps) {
  const uiTranslations = useUITranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen && !triggerOnHover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, triggerOnHover]);

  const handleMouseEnter = () => {
    if (triggerOnHover) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (triggerOnHover) {
      timeoutRef.current = window.setTimeout(() => {
        setIsOpen(false);
      }, 200);
    }
  };

  const handleClick = () => {
    if (!triggerOnHover) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div onClick={handleClick}>
        {trigger}
      </div>

      <div
        className={`
          absolute top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50
          min-w-[180px]
          ${position === 'right' ? 'right-0' : 'left-0'}
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
          ${triggerOnHover ? 'transition-all duration-200' : ''}
        `}
      >
        <div className="py-1">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider ? (
                <hr className="my-1 border-gray-200" />
              ) : (
                <button
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                  className={`
                    w-full text-left px-4 py-2 text-sm flex items-center gap-2
                    transition-colors
                    ${item.disabled ? 'text-gray-400 cursor-not-allowed' : ''}
                    ${item.variant === 'danger'
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                    ${index === 0 ? 'rounded-t-lg' : ''}
                    ${index === items.length - 1 ? 'rounded-b-lg' : ''}
                  `}
                >
                  {item.icon && (
                    <span className="w-4 h-4">{item.icon}</span>
                  )}
                  {item.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ActionMenuProps {
  items: DropdownMenuItem[];
  position?: 'left' | 'right';
  className?: string;
  buttonClassName?: string;
  triggerOnHover?: boolean;
}

export function ActionMenu({
  items,
  position = 'right',
  className = '',
  buttonClassName = '',
  triggerOnHover = false
}: ActionMenuProps) {
  const uiTranslations = useUITranslation();

  const trigger = (
    <button
      className={`
        p-1.5 rounded-lg transition-all
        bg-gray-100 text-gray-600 hover:bg-gray-200
        ${buttonClassName}
      `}
      title={uiTranslations?.dropdown?.moreOptions || 'Mais opções'}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <DropdownMenu
      trigger={trigger}
      items={items}
      position={position}
      className={className}
      triggerOnHover={triggerOnHover}
    />
  );
}