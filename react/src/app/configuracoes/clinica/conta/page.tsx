import React, { useState } from 'react';
import { Button, IconButton } from '../../../../components/ui/Button';
import { Check, Edit, Trash2 } from 'lucide-react';
import { UnifiedInput } from '../../../../components/ui/UnifiedInput';
import { Table, TableActions } from '../../../../components/ui/Table';
import { Select } from '../../../../components/ui/Select';
import { Switch } from '../../../../components/ui/Switch';
import { Card } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import { ConfiguracoesLayout } from '../../../../layouts/ConfiguracoesLayout';
import { useClinic } from '../../../../contexts/ClinicContext';
import { useRegion } from '../../../../contexts/RegionContext';

const ContaClinica: React.FC = () => {
  const { multiplasUnidadesEnabled, setMultiplasUnidadesEnabled } = useClinic();
  const { currentRegion, config } = useRegion();

  const [pessoaJuridica, setPessoaJuridica] = useState(true);
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

  // Modal states
  const [deleteUnitModal, setDeleteUnitModal] = useState<{open: boolean, targetUnitId: number | null, sourceUnitId: number | null}>({open: false, targetUnitId: null, sourceUnitId: null});

  // Form data
  const [formData, setFormData] = useState({
    companyName: 'Studio Dental',
    email: 'kronercosta@gmail.com',
    responsibleName: 'Kroner Machado Costa',
    responsibleDocument: '',
    phone: '',
    street: 'Rua 5',
    number: '691',
    complement: 'Loja 01 - Térreo',
    neighborhood: 'St. Oeste',
    city: 'Goiânia',
    state: 'GO',
    zipCode: '74115060',
    legalName: 'Arantes Comércio de Higiene Oral',
    taxId: '',
    masterUser: '',
  });

  const [unidades, setUnidades] = useState<any[]>([
    {
      id: 1,
      titulo: 'Unidade Principal',
      centralComunicacao: [],
      centroCusto: [],
      colaboradores: [],
      isMaster: true,
      registrosVinculados: 127 // Exemplo de registros vinculados
    }
  ]);

  // Mock professionals list - in production this would come from API
  const professionals = [
    { id: '1', name: 'Dr. João Silva', duration: 30, email: 'joao.silva@clinica.com' },
    { id: '2', name: 'Dra. Maria Santos', duration: 45, email: 'maria.santos@clinica.com' },
    { id: '3', name: 'Dr. Pedro Costa', duration: 60, email: 'pedro.costa@clinica.com' },
    { id: '4', name: 'Dr. Carlos Lima', duration: 30, email: 'carlos.lima@clinica.com' },
    { id: '5', name: 'Dra. Ana Oliveira', duration: 40, email: 'ana.oliveira@clinica.com' }
  ];

  return (
    <ConfiguracoesLayout>
      <div className="space-y-6">
        {/* Dados da Conta Section */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Conta</h2>
            <Button>Salvar</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UnifiedInput
              label="Nome Empresa"
              value={formData.companyName}
              onChange={(value) => setFormData({ ...formData, companyName: value })}
              placeholder="Digite o nome da empresa"
              fullWidth
              required
            />

            <UnifiedInput
              label="E-mail"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              validation="email"
              fullWidth
              required
            />

            <UnifiedInput
              label="Nome do Responsável"
              value={formData.responsibleName}
              onChange={(value) => setFormData({ ...formData, responsibleName: value })}
              placeholder="Nome completo"
              fullWidth
              required
            />

            {currentRegion === 'BR' ? (
              <UnifiedInput
                label="CPF do Responsável"
                value={formData.responsibleDocument}
                onChange={(value) => setFormData({ ...formData, responsibleDocument: value })}
                mask="cpf"
                validation="cpf"
                fullWidth
                required
              />
            ) : (
              <UnifiedInput
                label="SSN"
                value={formData.responsibleDocument}
                onChange={(value) => setFormData({ ...formData, responsibleDocument: value })}
                placeholder="XXX-XX-XXXX"
                fullWidth
              />
            )}

            <UnifiedInput
              label="Telefone"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              mask="internationalPhone"
              fullWidth
              required
            />

            <div>
              <Select
                label="Usuário Master"
                value={formData.masterUser || ''}
                onChange={(e) => setFormData({ ...formData, masterUser: Array.isArray(e.target.value) ? e.target.value[0] : e.target.value })}
                options={[
                  { value: '', label: 'Selecione o usuário master' },
                  ...professionals.map(prof => ({
                    value: prof.id,
                    label: `${prof.name} - ${prof.email}`
                  }))
                ]}
                required
              />
              <p className="text-xs text-gray-500 mt-1">O usuário master tem acesso total ao sistema</p>
            </div>
          </div>

          {/* Pessoa Jurídica Toggle */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-medium text-gray-900">Pessoa Jurídica</h3>
                <p className="text-sm text-gray-500">Habilite para adicionar dados da empresa</p>
              </div>
              <Switch
                checked={pessoaJuridica}
                onChange={setPessoaJuridica}
              />
            </div>

            {pessoaJuridica && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <UnifiedInput
                  label="Razão Social"
                  value={formData.legalName}
                  onChange={(value) => setFormData({ ...formData, legalName: value })}
                  placeholder="Nome da empresa"
                  fullWidth
                />

                <UnifiedInput
                  label="CNPJ"
                  value={formData.taxId}
                  onChange={(value) => setFormData({ ...formData, taxId: value })}
                  mask="cnpj"
                  validation="cnpj"
                  placeholder="00.000.000/0000-00"
                  fullWidth
                />
              </div>
            )}
          </div>

          {/* Múltiplas Unidades Toggle */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900">Múltiplas Unidades</h3>
                <p className="text-sm text-gray-500">Gerencie múltiplas unidades da sua clínica</p>
              </div>
              <Switch
                checked={multiplasUnidadesEnabled}
                onChange={setMultiplasUnidadesEnabled}
              />
            </div>
          </div>
        </Card>

        {/* Unidades Section */}
        {multiplasUnidadesEnabled && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Unidades</h2>
              <Button
                onClick={() => setUnidades([...unidades, {
                  id: Date.now(),
                  titulo: 'Nova Unidade',
                  centralComunicacao: [],
                  centroCusto: [],
                  colaboradores: []
                }])}
                variant="primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nova Unidade
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider first:rounded-tl-lg bg-gray-50">
                      Título
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                      Central de Comunicação
                    </th>
                    {config.features.centroCusto && (
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                        Centro de Custo
                      </th>
                    )}
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                      Colaboradores
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider last:rounded-tr-lg bg-gray-50">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {unidades.map((unidade) => (
                    <tr key={unidade.id} className="hover:bg-gray-50">
                      <td className="py-2.5 px-4 text-sm text-gray-900">
                        {editingUnit === unidade.id ? (
                          <UnifiedInput
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
                            placeholder="Selecione as centrais"
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
                              placeholder="Selecione os centros"
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
                            placeholder="Selecione colaboradores"
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
                            title={editingUnit === unidade.id ? "Salvar" : "Editar"}
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
                            title={unidade.isMaster ? 'Unidade principal não pode ser excluída' : 'Excluir'}
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
        title="Excluir Unidade"
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
                        {registros} registros serão afetados
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Tem certeza que deseja excluir a unidade <strong>{unit?.titulo}</strong>?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">
                    {registros > 0
                      ? `Você pode transferir os ${registros} registros afetados para outra unidade ou excluir permanentemente.`
                      : 'Você pode transferir os dados para outra unidade ou excluir permanentemente.'
                    }
                  </p>

                  <Select
                    value={deleteUnitModal.targetUnitId?.toString() || ''}
                    onChange={(e) => setDeleteUnitModal({ ...deleteUnitModal, targetUnitId: parseInt(Array.isArray(e.target.value) ? e.target.value[0] : e.target.value) || null })}
                    options={[
                      { value: '', label: 'Não transferir (excluir permanentemente)' },
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
              Cancelar
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
              {deleteUnitModal.targetUnitId ? 'Excluir e Transferir' : 'Excluir Permanentemente'}
            </Button>
          </div>
        </div>
      </Modal>
    </ConfiguracoesLayout>
  );
};

export default ContaClinica;
