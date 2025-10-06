import React, { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Select } from '../../../../components/ui/Select';
import { Switch } from '../../../../components/ui/Switch';
import { Button } from '../../../../components/ui/Button';
import { ColaboradorLayout } from '../ColaboradorLayout';
import { useTranslation } from '../../../../hooks/useTranslation';
import translations from './translation.json';

export default function ParametrosColaborador() {
  const { t } = useTranslation(translations);
  const [colaboradorData] = useState({
    nome: 'Dr. João Silva',
    cargo: 'Ortodontista',
    foto: ''
  });

  const [formData, setFormData] = useState({
    unidadePadrao: '',
    centroCustoPadrao: '',
    profissionalPadrao: '',
    bancoPadrao: '',
    idioma: 'pt',
    responsavelOrcamento: false,
    responsavelAgendamento: false,
    notificacoesWhatsapp: true,
    agendamentoOnline: true,
    comissao: '',
    tipoComissao: 'percentual'
  });

  const handleSave = () => {
    console.log('Salvando parâmetros:', formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Opções para os selects
  const unidadeOptions = [
    { value: '1', label: 'Unidade Principal' },
    { value: '2', label: 'Unidade Centro' },
    { value: '3', label: 'Unidade Sul' }
  ];

  const centroCustoOptions = [
    { value: '1', label: 'Centro de Custo Principal' },
    { value: '2', label: 'Centro de Custo Ortodontia' },
    { value: '3', label: 'Centro de Custo Endodontia' }
  ];

  const profissionalOptions = [
    { value: '1', label: 'Dr. João Silva' },
    { value: '2', label: 'Dra. Maria Santos' },
    { value: '3', label: 'Dr. Pedro Costa' }
  ];

  const bancoOptions = [
    { value: '1', label: 'Banco do Brasil - Ag 1234 / CC 5678-9' },
    { value: '2', label: 'Itaú - Ag 4321 / CC 8765-4' },
    { value: '3', label: 'Bradesco - Ag 5678 / CC 1234-5' }
  ];

  const idiomaOptions = [
    { value: 'pt', label: 'Português (Brasil)' },
    { value: 'en', label: 'English (United States)' },
    { value: 'es', label: 'Español' }
  ];

  return (
    <ColaboradorLayout
      colaboradorData={colaboradorData}
      headerControls={
        <>
          <Button variant="outline">{t?.buttons?.cancel || 'Cancelar'}</Button>
          <Button variant="primary" onClick={handleSave}>{t?.buttons?.save || 'Salvar'}</Button>
        </>
      }
    >
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t?.defaultValues?.title || 'Valores Padrão'}</h2>
          <p className="text-sm text-gray-600 mb-4">
            {t?.defaultValues?.description || 'Configure valores padrão para melhorar a usabilidade no dia a dia'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={t?.defaultValues?.defaultUnit || 'Unidade Padrão'}
              value={formData.unidadePadrao}
              onChange={(e) => handleInputChange('unidadePadrao', e.target.value)}
              options={[
                { value: '', label: t?.defaultValues?.defaultUnitPlaceholder || 'Selecione a unidade padrão' },
                ...unidadeOptions
              ]}
            />

            <Select
              label={t?.defaultValues?.defaultCostCenter || 'Centro de Custo Padrão'}
              value={formData.centroCustoPadrao}
              onChange={(e) => handleInputChange('centroCustoPadrao', e.target.value)}
              options={[
                { value: '', label: t?.defaultValues?.defaultCostCenterPlaceholder || 'Selecione o centro de custo padrão' },
                ...centroCustoOptions
              ]}
            />

            <Select
              label={t?.defaultValues?.linkedProfessional || 'Profissional Vinculado'}
              value={formData.profissionalPadrao}
              onChange={(e) => handleInputChange('profissionalPadrao', e.target.value)}
              options={[
                { value: '', label: t?.defaultValues?.linkedProfessionalPlaceholder || 'Selecione o profissional' },
                ...profissionalOptions
              ]}
            />

            <Select
              label={t?.defaultValues?.defaultBank || 'Banco/Conta Padrão'}
              value={formData.bancoPadrao}
              onChange={(e) => handleInputChange('bancoPadrao', e.target.value)}
              options={[
                { value: '', label: t?.defaultValues?.defaultBankPlaceholder || 'Selecione o banco/conta' },
                ...bancoOptions
              ]}
            />

            <Select
              label={t?.defaultValues?.language || 'Idioma Preferido'}
              value={formData.idioma}
              onChange={(e) => handleInputChange('idioma', e.target.value)}
              options={idiomaOptions}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t?.workSettings?.title || 'Configurações de Trabalho'}</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{t?.workSettings?.budgetResponsible || 'Responsável por Orçamentos'}</p>
                <p className="text-sm text-gray-600">{t?.workSettings?.budgetResponsibleDescription || 'Pode criar e aprovar orçamentos'}</p>
              </div>
              <Switch
                checked={formData.responsavelOrcamento}
                onChange={(checked) => handleInputChange('responsavelOrcamento', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{t?.workSettings?.scheduleResponsible || 'Responsável por Agendamentos'}</p>
                <p className="text-sm text-gray-600">{t?.workSettings?.scheduleResponsibleDescription || 'Pode gerenciar agenda de pacientes'}</p>
              </div>
              <Switch
                checked={formData.responsavelAgendamento}
                onChange={(checked) => handleInputChange('responsavelAgendamento', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{t?.workSettings?.whatsappNotifications || 'Notificações via WhatsApp'}</p>
                <p className="text-sm text-gray-600">{t?.workSettings?.whatsappNotificationsDescription || 'Recebe notificações importantes no WhatsApp'}</p>
              </div>
              <Switch
                checked={formData.notificacoesWhatsapp}
                onChange={(checked) => handleInputChange('notificacoesWhatsapp', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{t?.workSettings?.onlineScheduling || 'Permite Agendamento Online'}</p>
                <p className="text-sm text-gray-600">{t?.workSettings?.onlineSchedulingDescription || 'Pacientes podem agendar online com este profissional'}</p>
              </div>
              <Switch
                checked={formData.agendamentoOnline}
                onChange={(checked) => handleInputChange('agendamentoOnline', checked)}
              />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t?.commission?.title || 'Comissão'}</h2>
          <p className="text-sm text-gray-600 mb-4">
            {t?.commission?.description || 'Configure as regras de comissão para este colaborador'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={t?.commission?.type || 'Tipo de Comissão'}
              value={formData.tipoComissao}
              onChange={(e) => handleInputChange('tipoComissao', e.target.value)}
              options={[
                { value: 'percentual', label: t?.commission?.percentage || 'Percentual (%)' },
                { value: 'fixo', label: t?.commission?.fixed || 'Valor Fixo (R$)' },
                { value: 'sem-comissao', label: t?.commission?.none || 'Sem Comissão' }
              ]}
            />

            {formData.tipoComissao !== 'sem-comissao' && (
              <div className="relative">
                <input
                  className="peer w-full h-10 rounded-lg border border-gray-300 px-3 py-2 focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20"
                  placeholder=" "
                  value={formData.comissao}
                  onChange={(e) => handleInputChange('comissao', e.target.value)}
                />
                <label className="absolute left-3 transition-all duration-200 pointer-events-none top-1/2 -translate-y-1/2 text-sm text-gray-500 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-gray-600 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm">
                  {formData.tipoComissao === 'percentual' ? (t?.commission?.percentageLabel || 'Percentual (%)') : (t?.commission?.fixedLabel || 'Valor (R$)')}
                </label>
              </div>
            )}
          </div>
        </Card>
      </div>
    </ColaboradorLayout>
  );
}