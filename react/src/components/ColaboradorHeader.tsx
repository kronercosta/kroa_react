import React from 'react';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Button } from './ui/Button';
import { Switch } from './ui/Switch';

interface ColaboradorHeaderProps {
  colaboradorData: {
    nome: string;
    cargo: string;
    foto: string;
    status: string;
  };
  isNew: boolean;
  onBack: () => void;
}

export function ColaboradorHeader({ colaboradorData, isNew, onBack }: ColaboradorHeaderProps) {
  const [hasChanges, setHasChanges] = React.useState(false);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            {colaboradorData.foto ? (
              <img
                src={colaboradorData.foto}
                alt={colaboradorData.nome}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-krooa-green/20 flex items-center justify-center">
                {colaboradorData.nome ? (
                  <span className="text-krooa-dark font-bold">
                    {colaboradorData.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                ) : (
                  <User className="w-6 h-6 text-krooa-dark" />
                )}
              </div>
            )}

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isNew ? 'Novo Colaborador' : colaboradorData.nome || 'Carregando...'}
              </h1>
              <p className="text-sm text-gray-500">
                {colaboradorData.cargo || 'Preencha os dados do colaborador'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <Switch
              checked={colaboradorData.status === 'ativo'}
              onChange={() => {}}
            />
            <span className="text-sm font-medium">
              {colaboradorData.status === 'ativo' ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          <Button
            variant="primary"
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}