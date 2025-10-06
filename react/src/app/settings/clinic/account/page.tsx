import React, { useState } from 'react';
import { Button, IconButton } from '../../../../components/ui/Button';
import { Check, Edit, Trash2 } from 'lucide-react';
import { Input } from '../../../../components/ui/Input';
import { Table } from '../../../../components/ui/Table';
import { Select } from '../../../../components/ui/Select';
import { Switch } from '../../../../components/ui/Switch';
import { Card } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import { ConfiguracoesClinicaLayout } from '../ConfiguracoesClinicaLayout';
import { HeaderControls } from '../../../../components/ui/HeaderControls';
import { useRegion } from '../../../../contexts/RegionContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import translations from './translation.json';
import { DocumentModal } from './DocumentModal';
import lgpdTerms from './lgpd-terms.json';
import adminTerms from './admin-responsibility-terms.json';

const ContaClinica: React.FC = () => {
  const { currentRegion } = useRegion();

  // Mapear região para idioma
  const getLanguageByRegion = (region: string) => {
    switch (region) {
      case 'BR': return 'PT';
      case 'US': return 'EN';
      default: return 'PT';
    }
  };

  const language = getLanguageByRegion(currentRegion);
  const { t } = useTranslation(translations);

  const [pessoaJuridica, setPessoaJuridica] = useState(true);

  // Document modal states
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean;
    type: 'lgpd' | 'admin' | null;
  }>({ isOpen: false, type: null });

  // Terms acceptance states
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [adminResponsibilityAccepted, setAdminResponsibilityAccepted] = useState(false);

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


  // Mock professionals list - in production this would come from API
  const professionals = [
    { id: '1', name: 'Dr. João Silva', duration: 30, email: 'joao.silva@clinica.com' },
    { id: '2', name: 'Dra. Maria Santos', duration: 45, email: 'maria.santos@clinica.com' },
    { id: '3', name: 'Dr. Pedro Costa', duration: 60, email: 'pedro.costa@clinica.com' },
    { id: '4', name: 'Dr. Carlos Lima', duration: 30, email: 'carlos.lima@clinica.com' },
    { id: '5', name: 'Dra. Ana Oliveira', duration: 40, email: 'ana.oliveira@clinica.com' }
  ];

  return (
    <ConfiguracoesClinicaLayout headerControls={<HeaderControls />}>
      <div className="space-y-6 w-full max-w-full">
        {/* Dados da Conta Section */}
        <Card className="w-full max-w-full overflow-hidden">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">{t?.account || 'Conta'}</h2>
            </div>
            <div className="flex-shrink-0">
              <Button size="sm" className="w-full sm:w-auto min-w-[120px]">
                {t?.save || 'Salvar'}
              </Button>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
            <div className="w-full">
              <Input
                label={t?.companyName || 'Nome Empresa'}
                value={formData.companyName}
                onChange={(value) => setFormData({ ...formData, companyName: value })}
                placeholder={t?.placeholders?.companyName || 'Digite o nome da empresa'}
                required
              />
            </div>

            <div className="w-full">
              <Input
                label={t?.email || 'E-mail'}
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                validation="email"
                required
              />
            </div>

            <div className="w-full">
              <Input
                label={t?.responsibleName || 'Nome do Responsável'}
                value={formData.responsibleName}
                onChange={(value) => setFormData({ ...formData, responsibleName: value })}
                placeholder={t?.placeholders?.responsibleName || 'Nome completo'}
                required
              />
            </div>

            {/* Campo de documento varia por região */}
            <div className="w-full">
              {currentRegion === 'BR' ? (
                <Input
                  label={t?.regionLabels?.BR?.responsibleDocument || 'CPF do Responsável'}
                  value={formData.responsibleDocument}
                  onChange={(value) => setFormData({ ...formData, responsibleDocument: value })}
                  mask="cpf"
                  validation="cpf"
                  placeholder="000.000.000-00"
                  required
                />
              ) : (
                <Input
                  label={t?.regionLabels?.US?.responsibleDocument || "Responsible's SSN"}
                  value={formData.responsibleDocument}
                  onChange={(value) => setFormData({ ...formData, responsibleDocument: value })}
                  mask="ssn"
                  validation="ssn"
                  placeholder="000-00-0000"
                  required
                />
              )}
            </div>

            <div className="w-full">
              <Input
                label={t?.phone || 'Telefone'}
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                mask="internationalPhone"
                defaultCountry={currentRegion === 'BR' ? 'BR' : 'US'}
                required
              />
            </div>

            <div className="w-full">
              <Select
                label={t?.masterUser || 'Usuário Master'}
                value={formData.masterUser || ''}
                onChange={(e) => setFormData({ ...formData, masterUser: Array.isArray(e.target.value) ? e.target.value[0] : e.target.value })}
                options={[
                  { value: '', label: t?.placeholders?.selectMasterUser || 'Selecione o usuário master' },
                  ...professionals.map(prof => ({
                    value: prof.id,
                    label: `${prof.name} - ${prof.email}`
                  }))
                ]}
                required
              />
              <p className="text-xs text-gray-500 mt-1">{t?.masterUserDescription || 'O usuário master tem acesso total ao sistema'}</p>
            </div>
          </div>

          {/* Pessoa Jurídica Toggle */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-medium text-gray-900">{t?.legalEntity || 'Pessoa Jurídica'}</h3>
                <p className="text-sm text-gray-500">{t?.legalEntityDescription || 'Habilite para adicionar dados da empresa'}</p>
              </div>
              <Switch
                checked={pessoaJuridica}
                onChange={setPessoaJuridica}
              />
            </div>

            {pessoaJuridica && (
              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                <div className="w-full">
                  <Input
                    label={t?.legalName || 'Razão Social'}
                    value={formData.legalName}
                    onChange={(value) => setFormData({ ...formData, legalName: value })}
                    placeholder={t?.placeholders?.legalName || 'Nome da empresa'}
                  />
                </div>

                {/* Campo de CNPJ/EIN varia por região */}
                <div className="w-full">
                  {currentRegion === 'BR' ? (
                    <Input
                      label={t?.regionLabels?.BR?.taxId || 'CNPJ'}
                      value={formData.taxId}
                      onChange={(value) => setFormData({ ...formData, taxId: value })}
                      mask="cnpj"
                      validation="cnpj"
                      placeholder="00.000.000/0000-00"
                    />
                  ) : (
                    <Input
                      label={t?.regionLabels?.US?.taxId || 'EIN'}
                      value={formData.taxId}
                      onChange={(value) => setFormData({ ...formData, taxId: value })}
                      mask="ein"
                      validation="ein"
                      placeholder="00-0000000"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Aceite de Termos LGPD */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-base font-medium text-gray-900 mb-4">{t?.termsSection || 'Aceite de Termos'}</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="lgpd-consent"
                    checked={lgpdAccepted}
                    onChange={(e) => setLgpdAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <label htmlFor="lgpd-consent" className="text-sm font-medium text-blue-900 cursor-pointer block">
                      {t?.lgpdConsent || 'Aceite dos Termos LGPD'}
                    </label>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                      {t?.lgpdDescription || 'Declaro estar ciente e concordo com os termos da Lei Geral de Proteção de Dados (LGPD) e autorizo o tratamento dos dados pessoais conforme descrito na política de privacidade.'}
                    </p>
                    <button
                      onClick={() => setDocumentModal({ isOpen: true, type: 'lgpd' })}
                      className="text-xs text-blue-600 underline mt-2 hover:text-blue-800 transition-colors"
                    >
                      {t?.viewLgpdDocument || 'Ver documento completo →'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="admin-responsibility"
                    checked={adminResponsibilityAccepted}
                    onChange={(e) => setAdminResponsibilityAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <label htmlFor="admin-responsibility" className="text-sm font-medium text-amber-900 cursor-pointer block">
                      {t?.adminResponsibility || 'Responsabilidade do Usuário Administrador'}
                    </label>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                      {t?.adminResponsibilityDescription || 'Assumo total responsabilidade pelas configurações e dados inseridos no sistema, comprometendo-me a manter a segurança e confidencialidade das informações dos pacientes.'}
                    </p>
                    <button
                      onClick={() => setDocumentModal({ isOpen: true, type: 'admin' })}
                      className="text-xs text-amber-600 underline mt-2 hover:text-amber-800 transition-colors"
                    >
                      {t?.viewResponsibilityDocument || 'Ver termo de responsabilidade →'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </Card>
      </div>


      {/* Document Modal */}
      <DocumentModal
        isOpen={documentModal.isOpen}
        onClose={() => setDocumentModal({ isOpen: false, type: null })}
        document={
          documentModal.type === 'lgpd'
            ? lgpdTerms[language as keyof typeof lgpdTerms] || lgpdTerms.PT
            : documentModal.type === 'admin'
            ? adminTerms[language as keyof typeof adminTerms] || adminTerms.PT
            : null
        }
        onAccept={() => {
          if (documentModal.type === 'lgpd') {
            setLgpdAccepted(true);
          } else if (documentModal.type === 'admin') {
            setAdminResponsibilityAccepted(true);
          }
        }}
        showAcceptButton={
          (documentModal.type === 'lgpd' && !lgpdAccepted) ||
          (documentModal.type === 'admin' && !adminResponsibilityAccepted)
        }
      />
    </ConfiguracoesClinicaLayout>
  );
};

export default ContaClinica;
