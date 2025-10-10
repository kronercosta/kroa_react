import React from 'react';
import { ArrowLeft, User } from 'lucide-react';

interface PageHeaderWithAvatarProps {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  avatarColor?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function PageHeaderWithAvatar({
  title,
  subtitle,
  avatarUrl,
  avatarColor = '#10B981',
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
    <div className="flex-shrink-0 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <>
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-gray-300"></div>
              </>
            )}

            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={title}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: avatarColor }}
                >
                  {title ? (
                    <span className="text-white font-bold">
                      {getInitials(title)}
                    </span>
                  ) : (
                    <User className="w-6 h-6 text-white" />
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
      </div>
    </div>
  );
}
