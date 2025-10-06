import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Switch } from '../../../../components/ui/Switch';
import { Card } from '../../../../components/ui/Card';
import { Table } from '../../../../components/ui/Table';
import { ConfiguracoesClinicaLayout } from '../ConfiguracoesClinicaLayout';
import { HeaderControls } from '../../../../components/ui/HeaderControls';
import { useClinic } from '../../../../contexts/ClinicContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import translations from './translation.json';

const CentroCustoClinica: React.FC = () => {
  const { centroCustoEnabled, setCentroCustoEnabled } = useClinic();
  const { t } = useTranslation(translations);

  // Centro de Custo states
  const [editingCostCenter, setEditingCostCenter] = useState<number | null>(null);
  const [costCenters, setCostCenters] = useState<any[]>([
    {
      id: 1,
      name: 'Centro de Custo Principal',
      description: 'Centro de custo padrão do sistema',
      isMaster: true,
      registrosVinculados: 89
    }
  ]);

  return (
    <ConfiguracoesClinicaLayout>
      <div className="space-y-6">
        {/* Toggle Section */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-900">{t.toggleTitle || 'Centro de Custo'}</h3>
              <p className="text-sm text-gray-500">{t.toggleDescription || 'Habilite para organizar receitas e despesas por centro'}</p>
            </div>
            <Switch
              checked={centroCustoEnabled}
              onChange={setCentroCustoEnabled}
            />
          </div>
        </Card>

        {/* Cost Centers List */}
        {centroCustoEnabled && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">{t.pageTitle || 'Centros de Custo'}</h2>
              <Button
                onClick={() => setCostCenters([...costCenters, {
                  id: Date.now(),
                  name: t.defaultCenterName || 'Novo Centro',
                  description: t.defaultCenterDescription || 'Descrição do centro'
                }])}
                variant="primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {t.newCenter || 'Novo Centro'}
              </Button>
            </div>

            <Table
              columns={[
                {
                  key: 'name',
                  title: t.table?.name || 'Nome',
                  render: (_, row) => (
                    editingCostCenter === row.id ? (
                      <Input
                        value={row.name}
                        onChange={(value) => {
                          const newCenters = costCenters.map((c: any) =>
                            c.id === row.id ? {...c, name: value} : c
                          );
                          setCostCenters(newCenters);
                        }}
                        className="w-full py-1"
                        fullWidth
                      />
                    ) : (
                      row.name
                    )
                  )
                },
                {
                  key: 'description',
                  title: t.table?.description || 'Descrição',
                  render: (_, row) => (
                    editingCostCenter === row.id ? (
                      <Input
                        value={row.description}
                        onChange={(value) => {
                          const newCenters = costCenters.map((c: any) =>
                            c.id === row.id ? {...c, description: value} : c
                          );
                          setCostCenters(newCenters);
                        }}
                        fullWidth
                        className="w-full py-1"
                      />
                    ) : (
                      row.description
                    )
                  )
                },
                {
                  key: 'actions',
                  title: 'Ações',
                  align: 'right',
                  render: (_, row) => (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          if (editingCostCenter === row.id) {
                            setEditingCostCenter(null);
                          } else {
                            setEditingCostCenter(row.id);
                          }
                        }}
                        className={`p-1.5 rounded-lg transition-all ${
                          editingCostCenter === row.id
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={editingCostCenter === row.id ? "Salvar" : "Editar"}
                      >
                        {editingCostCenter === row.id ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (costCenters.length > 1) {
                            console.log('Delete cost center', row.id);
                          }
                        }}
                        className={`p-1.5 rounded-lg transition-all ${
                          costCenters.length === 1
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                        title={costCenters.length === 1 ? 'Não é possível excluir o único centro de custo' : 'Excluir'}
                        disabled={costCenters.length === 1}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )
                }
              ]}
              data={costCenters}
              hoverable
              sticky
            />
          </Card>
        )}
      </div>
    </ConfiguracoesClinicaLayout>
  );
};

export default CentroCustoClinica;
