import React from 'react';
import { X } from 'lucide-react';
import { Button, IconButton } from './Button';

interface AsideProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  title: string;
  children: React.ReactNode;
  saveButtonText?: string;
  showSaveButton?: boolean;
}

export const Aside: React.FC<AsideProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  children,
  saveButtonText = 'Salvar',
  showSaveButton = true
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="fixed right-0 top-0 h-full w-full sm:w-[500px] lg:w-[600px] xl:w-[700px] 2xl:w-[880px] max-w-full sm:max-w-[880px] bg-white/95 backdrop-blur-md shadow-2xl z-50 transform transition-all duration-300 ease-in-out sm:border-l border-gray-100">
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
          {/* Botão X à esquerda */}
          <IconButton
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </IconButton>

          {/* Título centralizado */}
          <h2 className="text-xl font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
            {title}
          </h2>

          {/* Botões à direita */}
          <div className="flex items-center gap-2">
            {showSaveButton && onSave && (
              <Button
                onClick={onSave}
                variant="primary"
              >
                {saveButtonText}
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
          {children}
        </div>
      </div>
    </>
  );
};
