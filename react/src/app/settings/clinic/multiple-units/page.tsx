import React, { useState } from 'react';
import { Button, IconButton } from '../../../../components/ui/Button';
import { Check, Edit, Trash2 } from 'lucide-react';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Switch } from '../../../../components/ui/Switch';
import { Card } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import { ConfiguracoesClinicaLayout } from '../ConfiguracoesClinicaLayout';
import { HeaderControls } from '../../../../components/ui/HeaderControls';
import { useClinic } from '../../../../contexts/ClinicContext';
import { useRegion } from '../../../../contexts/RegionContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import translations from './translation.json';

const MultiplasUnidades: React.FC = () => {
  const { multiplasUnidadesEnabled, setMultiplasUnidadesEnabled } = useClinic();
  const { config } = useRegion();
  const { t } = useTranslation(translations);

  const [editingUnit, setEditingUnit] = useState<number | null>(null);

  // Opções para os MultiSelects
  const centralOptions = [
    { value: 'central1', label: 'Central 1' },
    { value: 'central2', label: 'Central 2' },
    { value: 'central3', label: 'Central 3' },
    { value: 'central4', label: 'Central 4' }
  ];

  const centroCustoOptions = [
    { value: 'cc001', label: 'CC 001' },
    { value: 'cc002', label: 'CC 002' },
    { value: 'cc003', label: 'CC 003' },
    { value: 'cc004', label: 'CC 004' }
  ];

  const colaboradoresOptions = [
    { value: '1', label: 'Dr. João Silva' },
    { value: '2', label: 'Dra. Maria Santos' },
    { value: '3', label: 'Dr. Pedro Costa' },
    { value: '4', label: 'Dra. Ana Lima' }
  ];

  const timezoneOptions = [
    { value: 'America/Sao_Paulo', label: 'São Paulo (UTC-3)' },
    { value: 'America/Manaus', label: 'Manaus (UTC-4)' },
    { value: 'America/Rio_Branco', label: 'Rio Branco (UTC-5)' },
    { value: 'America/Noronha', label: 'Fernando de Noronha (UTC-2)' },
    { value: 'America/New_York', label: 'New York (UTC-5)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8)' },
    { value: 'Europe/London', label: 'London (UTC+0)' },
    { value: 'Europe/Madrid', label: 'Madrid (UTC+1)' }
  ];

  // Modal states
  const [deleteUnitModal, setDeleteUnitModal] = useState<{open: boolean, targetUnitId: number | null, sourceUnitId: number | null}>({open: false, targetUnitId: null, sourceUnitId: null});

  const [unidades, setUnidades] = useState<any[]>([
    {
      id: 1,
      titulo: 'Unidade Principal',
      centralComunicacao: [],
      centroCusto: [],
      colaboradores: [],
      timezone: 'America/Sao_Paulo',
      isMaster: true,
      registrosVinculados: 127 // Exemplo de registros vinculados
    }
  ]);

  return (
    <ConfiguracoesClinicaLayout>
      <div className="space-y-6">
        {/* Unidade Principal - Sempre Disponível */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t?.masterUnit?.title || 'Unidade Principal'}</h2>
          <p className="text-sm text-gray-600 mb-4">
            {t?.masterUnit?.description || 'Configure a unidade principal da sua clínica. Esta unidade sempre estará disponível e não pode ser excluída.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label={t?.masterUnit?.name || 'Nome da Unidade'}
              value={unidades[0]?.titulo || ''}
              onChange={(value) => {
                const newUnidades = [...unidades];
                newUnidades[0] = { ...newUnidades[0], titulo: value };
                setUnidades(newUnidades);
              }}
              fullWidth
            />

            <Select
              label={t?.masterUnit?.timezone || 'Fuso Horário'}
              value={unidades[0]?.timezone || 'America/Sao_Paulo'}
              onChange={(e) => {
                const value = Array.isArray(e.target.value) ? e.target.value[0] : e.target.value;
                const newUnidades = [...unidades];
                newUnidades[0] = { ...newUnidades[0], timezone: value };
                setUnidades(newUnidades);
              }}
              options={timezoneOptions}
            />
          </div>
        </Card>

        {/* Múltiplas Unidades Toggle */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t?.title || 'Múltiplas Unidades'}</h2>
              <p className="text-sm text-gray-500 mt-1">{t?.description || 'Habilite para gerenciar unidades adicionais da sua clínica'}</p>
            </div>
            <Switch
              checked={multiplasUnidadesEnabled}
              onChange={setMultiplasUnidadesEnabled}
            />
          </div>
        </Card>

        {/* Unidades Adicionais Section */}
        {multiplasUnidadesEnabled && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">{t?.additionalUnits?.title || 'Unidades Adicionais'}</h2>
              <Button
                onClick={() => setUnidades([...unidades, {
                  id: Date.now(),
                  titulo: t?.newUnit || 'Nova Unidade',
                  centralComunicacao: [],
                  centroCusto: [],
                  colaboradores: [],
                  timezone: 'America/Sao_Paulo'
                }])}
                variant="primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {t?.newUnit || 'Nova Unidade'}
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider first:rounded-tl-lg bg-gray-50">
                      {t?.tableHeaders?.title || 'Título'}
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                      {t?.tableHeaders?.communicationCenter || 'Central de Comunicação'}
                    </th>
                    {config.features.centroCusto && (
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                        {t?.tableHeaders?.costCenter || 'Centro de Custo'}
                      </th>
                    )}
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                      {t?.tableHeaders?.collaborators || 'Colaboradores'}
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                      {t?.tableHeaders?.timezone || 'Fuso Horário'}
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider last:rounded-tr-lg bg-gray-50">
                      {t?.tableHeaders?.actions || 'Ações'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {unidades.slice(1).map((unidade) => (
                    <tr key={unidade.id} className="hover:bg-gray-50">
                      <td className="py-2.5 px-4 text-sm text-gray-900">
                        {editingUnit === unidade.id ? (
                          <Input
                            value={unidade.titulo}
                            onChange={(value) => {
                              const newUnidades = unidades.map((u: any) =>
                                u.id === unidade.id ? {...u, titulo: value} : u
                              );
                              setUnidades(newUnidades);
                            }}
                            className="w-full py-1"
                            fullWidth
                          />
                        ) : (
                          unidade.titulo
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-sm text-gray-900">
                        {editingUnit === unidade.id ? (
                          <Select
                            options={centralOptions}
                            value={unidade.centralComunicacao}
                            onChange={(e) => {
                              const value = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
                              const newUnidades = unidades.map((u: any) =>
                                u.id === unidade.id ? {...u, centralComunicacao: value} : u
                              );
                              setUnidades(newUnidades);
                            }}
                            placeholder={t?.placeholders?.selectCommunicationCenters || 'Selecione as centrais'}
                            multiple={true}
                          />
                        ) : (
                          unidade.centralComunicacao.map((c: any) =>
                            centralOptions.find(opt => opt.value === c)?.label
                          ).join(', ')
                        )}
                      </td>
                      {config.features.centroCusto && (
                        <td className="py-2.5 px-4 text-sm text-gray-900">
                          {editingUnit === unidade.id ? (
                            <Select
                              options={centroCustoOptions}
                              value={unidade.centroCusto}
                              onChange={(e) => {
                                const value = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
                                const newUnidades = unidades.map((u: any) =>
                                  u.id === unidade.id ? {...u, centroCusto: value} : u
                                );
                                setUnidades(newUnidades);
                              }}
                              placeholder={t?.placeholders?.selectCostCenters || 'Selecione os centros'}
                              multiple={true}
                            />
                          ) : (
                            unidade.centroCusto.map((c: any) =>
                              centroCustoOptions.find(opt => opt.value === c)?.label
                            ).join(', ')
                          )}
                        </td>
                      )}
                      <td className="py-2.5 px-4 text-sm text-gray-900">
                        {editingUnit === unidade.id ? (
                          <Select
                            options={colaboradoresOptions}
                            value={unidade.colaboradores}
                            onChange={(e) => {
                              const value = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
                              const newUnidades = unidades.map((u: any) =>
                                u.id === unidade.id ? {...u, colaboradores: value} : u
                              );
                              setUnidades(newUnidades);
                            }}
                            placeholder={t?.placeholders?.selectCollaborators || 'Selecione colaboradores'}
                            multiple={true}
                          />
                        ) : (
                          unidade.colaboradores.length > 0
                            ? unidade.colaboradores.map((c: any) =>
                                colaboradoresOptions.find(opt => opt.value === c)?.label
                              ).join(', ')
                            : '-'
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-sm text-gray-900">
                        {editingUnit === unidade.id ? (
                          <Select
                            options={timezoneOptions}
                            value={unidade.timezone}
                            onChange={(e) => {
                              const value = Array.isArray(e.target.value) ? e.target.value[0] : e.target.value;
                              const newUnidades = unidades.map((u: any) =>
                                u.id === unidade.id ? {...u, timezone: value} : u
                              );
                              setUnidades(newUnidades);
                            }}
                          />
                        ) : (
                          timezoneOptions.find(opt => opt.value === unidade.timezone)?.label || unidade.timezone
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <IconButton
                            onClick={() => {
                              if (editingUnit === unidade.id) {
                                setEditingUnit(null);
                              } else {
                                setEditingUnit(unidade.id);
                              }
                            }}
                            variant={editingUnit === unidade.id ? "primary" : "ghost"}
                            size="sm"
                            title={editingUnit === unidade.id ? (t?.actions?.save || 'Salvar') : (t?.actions?.edit || 'Editar')}
                          >
                            {editingUnit === unidade.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Edit className="w-4 h-4" />
                            )}
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              if (unidades.length > 1 && !unidade.isMaster) {
                                setDeleteUnitModal({ open: true, sourceUnitId: unidade.id, targetUnitId: null });
                              }
                            }}
                            variant="ghost"
                            size="sm"
                            title={unidade.isMaster ? (t?.actions?.masterUnitCannotBeDeleted || 'Unidade principal não pode ser excluída') : (t?.actions?.delete || 'Excluir')}
                            disabled={unidade.isMaster}
                            className={unidade.isMaster ? "text-gray-300" : "text-red-600 hover:text-red-700"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Delete Unit Modal */}
      <Modal
        isOpen={deleteUnitModal.open}
        onClose={() => setDeleteUnitModal({ open: false, targetUnitId: null, sourceUnitId: null })}
        title={t?.deleteModal?.title || 'Excluir Unidade'}
      >
        <div className="space-y-4">
          {(() => {
            const unit = unidades.find(u => u.id === deleteUnitModal.sourceUnitId);
            const registros = unit?.registrosVinculados || 0;

            return (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-amber-800">
                        {registros} {t?.deleteModal?.recordsAffected || 'registros serão afetados'}
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        {t?.deleteModal?.confirmMessage || 'Tem certeza que deseja excluir a unidade'} <strong>{unit?.titulo}</strong>?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">
                    {t?.deleteModal?.transferRecords || 'Você pode transferir os registros afetados para outra unidade ou excluir permanentemente.'}
                  </p>

                  <Select
                    value={deleteUnitModal.targetUnitId?.toString() || ''}
                    onChange={(e) => setDeleteUnitModal({ ...deleteUnitModal, targetUnitId: parseInt(Array.isArray(e.target.value) ? e.target.value[0] : e.target.value) || null })}
                    options={[
                      { value: '', label: t?.deleteModal?.doNotTransfer || 'Não transferir (excluir permanentemente)' },
                      ...unidades.filter(u => u.id !== deleteUnitModal.sourceUnitId).map(u => ({
                        value: u.id.toString(),
                        label: u.titulo
                      }))
                    ]}
                  />
                </div>
              </>
            );
          })()}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setDeleteUnitModal({ open: false, targetUnitId: null, sourceUnitId: null })}
            >
              {t?.deleteModal?.cancel || 'Cancelar'}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteUnitModal.sourceUnitId) {
                  setUnidades(unidades.filter(u => u.id !== deleteUnitModal.sourceUnitId));
                  setDeleteUnitModal({ open: false, targetUnitId: null, sourceUnitId: null });
                }
              }}
            >
              {deleteUnitModal.targetUnitId ? (t?.deleteModal?.deleteAndTransfer || 'Excluir e Transferir') : (t?.deleteModal?.deletePermanently || 'Excluir Permanentemente')}
            </Button>
          </div>
        </div>
      </Modal>
    </ConfiguracoesClinicaLayout>
  );
};

export default MultiplasUnidades;