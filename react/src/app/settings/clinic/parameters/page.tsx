import React, { useState } from 'react';
import { Switch } from '../../../../components/ui/Switch';
import { Card } from '../../../../components/ui/Card';
import { ConfiguracoesClinicaLayout } from '../ConfiguracoesClinicaLayout';
import { HeaderControls } from '../../../../components/ui/HeaderControls';
import { useTranslation } from '../../../../hooks/useTranslation';
import translations from './translation.json';

const ParametrosClinica: React.FC = () => {
  const { t } = useTranslation(translations);
  // Estados para Parâmetros de Agenda
  const [monitorarTempoCadeira, setMonitorarTempoCadeira] = useState(false);
  const [identificarConflitos, setIdentificarConflitos] = useState(true);
  const [identificarDesmarcoseFaltas, setIdentificarDesmarcoseFaltas] = useState(false);

  // Estados para Parâmetros Financeiros
  const [controleContabil, setControleContabil] = useState(false);
  const [simulacaoImpostos, setSimulacaoImpostos] = useState(false);
  const [aliquotaImposto, setAliquotaImposto] = useState('');

  return (
    <ConfiguracoesClinicaLayout>
      <div className="space-y-6">
        {/* Parâmetros de Agenda */}
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{t.scheduleParameters?.title || 'Parâmetros de Agenda'}</h2>
            <p className="text-sm text-gray-600">{t.scheduleParameters?.subtitle || 'Configure o comportamento do sistema de agendamentos'}</p>
          </div>

          <div className="space-y-6">
            {/* Monitorar tempo de cadeira */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1 pr-4">
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  {t.scheduleParameters?.monitorChairTime?.title || 'Monitorar tempo de cadeira'}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {t.scheduleParameters?.monitorChairTime?.description || 'Acompanha detalhadamente o tempo de sala de espera e duração real dos atendimentos'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t.scheduleParameters?.monitorChairTime?.tagControl || '+ Controle'}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {t.scheduleParameters?.monitorChairTime?.tagUsability || '- Usabilidade'}
                  </span>
                </div>
              </div>
              <Switch
                checked={monitorarTempoCadeira}
                onChange={setMonitorarTempoCadeira}
              />
            </div>

            {/* Identificar conflitos de horários */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1 pr-4">
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  {t.scheduleParameters?.identifyConflicts?.title || 'Identificar conflitos de horários'}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {t.scheduleParameters?.identifyConflicts?.description || 'O sistema exibe alertas automáticos ao detectar sobreposição de agendamentos'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {t.scheduleParameters?.identifyConflicts?.tagRecommended || 'Recomendado'}
                  </span>
                </div>
              </div>
              <Switch
                checked={identificarConflitos}
                onChange={setIdentificarConflitos}
              />
            </div>

            {/* Identificar quem desmarcou ou faltou */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1 pr-4">
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  {t.scheduleParameters?.identifyNoShowsAndCancellations?.title || 'Identificar quem desmarcou ou faltou'}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {t.scheduleParameters?.identifyNoShowsAndCancellations?.description || 'Mantém histórico detalhado de cancelamentos e faltas para melhor gestão de pacientes'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t.scheduleParameters?.identifyNoShowsAndCancellations?.tagControl || '+ Controle'}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {t.scheduleParameters?.identifyNoShowsAndCancellations?.tagUsability || '- Usabilidade'}
                  </span>
                </div>
              </div>
              <Switch
                checked={identificarDesmarcoseFaltas}
                onChange={setIdentificarDesmarcoseFaltas}
              />
            </div>
          </div>
        </Card>

        {/* Parâmetros Financeiros */}
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{t.financialParameters?.title || 'Parâmetros Financeiros'}</h2>
            <p className="text-sm text-gray-600">{t.financialParameters?.subtitle || 'Configure recursos avançados de controle financeiro e contábil'}</p>
          </div>

          <div className="space-y-6">
            {/* Controle Contábil com Subcategorias */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1 pr-4">
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  {t.financialParameters?.accountingControl?.title || 'Habilitar controle contábil detalhado'}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {t.financialParameters?.accountingControl?.description || 'Permite adicionar subcategorias ao lançar contas a pagar e receber, especificando a categoria contábil de cada pagamento para melhor controle financeiro'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {t.financialParameters?.accountingControl?.tagContability || 'Contabilidade'}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t.financialParameters?.accountingControl?.tagControl || '+ Controle'}
                  </span>
                </div>
              </div>
              <Switch
                checked={controleContabil}
                onChange={setControleContabil}
              />
            </div>

            {/* Simulação de Impostos */}
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-4">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {t.financialParameters?.taxSimulation?.title || 'Simulação de impostos no DRE'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {t.financialParameters?.taxSimulation?.description || 'Habilita simulações de impostos para planejamento tributário. Permite calcular quanto seria pago em impostos sem gerar lançamentos reais, apenas projeções no DRE'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {t.financialParameters?.taxSimulation?.tagPlanning || 'Planejamento'}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {t.financialParameters?.taxSimulation?.tagSimulation || 'Simulação'}
                    </span>
                  </div>
                </div>
                <Switch
                  checked={simulacaoImpostos}
                  onChange={setSimulacaoImpostos}
                />
              </div>

              {/* Campo de Alíquota - aparece quando habilitado */}
              {simulacaoImpostos && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="max-w-xs">
                    <label htmlFor="aliquota" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.financialParameters?.taxSimulation?.taxRateLabel || 'Alíquota de imposto para simulação'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="aliquota"
                        value={aliquotaImposto}
                        onChange={(e) => {
                          // Remove caracteres não numéricos exceto vírgula e ponto
                          let value = e.target.value.replace(/[^\d.,]/g, '');

                          // Substitui vírgula por ponto
                          value = value.replace(',', '.');

                          // Garante apenas um ponto decimal
                          const parts = value.split('.');
                          if (parts.length > 2) {
                            value = parts[0] + '.' + parts.slice(1).join('');
                          }

                          // Limita a 2 casas decimais
                          if (parts[1] && parts[1].length > 2) {
                            value = parts[0] + '.' + parts[1].slice(0, 2);
                          }

                          // Limita valor máximo a 100
                          if (parseFloat(value) > 100) {
                            value = '100';
                          }

                          setAliquotaImposto(value);
                        }}
                        placeholder={t.financialParameters?.taxSimulation?.taxRatePlaceholder || 'Ex: 15.50'}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-krooa-green/20 focus:border-krooa-green"
                        maxLength={6}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                        %
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {t.financialParameters?.taxSimulation?.description || 'Digite a porcentagem para calcular simulações de imposto'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </ConfiguracoesClinicaLayout>
  );
};

export default ParametrosClinica;
