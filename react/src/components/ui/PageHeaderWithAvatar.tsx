import React from 'react';
import { ArrowLeft, User } from 'lucide-react';

interface PageHeaderWithAvatarProps {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function PageHeaderWithAvatar({
  title,
  subtitle,
  avatarUrl,
  onBack,
  actions
}: PageHeaderWithAvatarProps) {
  // Gera iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={title}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-krooa-green/20 flex items-center justify-center">
              {title ? (
                <span className="text-krooa-dark font-bold">
                  {getInitials(title)}
                </span>
              ) : (
                <User className="w-6 h-6 text-krooa-dark" />
              )}
            </div>
          )}

          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
