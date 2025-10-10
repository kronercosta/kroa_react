'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  Camera,
  Save,
  FileText
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Avatar } from '../../../components/ui/Avatar';
import PatientLayout from '../components/PatientLayout';

const PersonalDataPage: React.FC = () => {
  // Pegar query parameters da URL
  const searchParams = new URLSearchParams(window.location.search);
  const patientId = searchParams.get('id') || '1';

  // Estado para os dados do paciente
  const [patientData, setPatientData] = useState({
    name: 'Kroner Costa',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    birthDate: '1985-05-15',
    gender: 'Masculino',
    maritalStatus: 'Casado',
    profession: 'Engenheiro',
    phone: '(11) 98765-4321',
    alternativePhone: '(11) 3456-7890',
    email: 'kroner@email.com',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Jardim das Rosas',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    emergencyContact: {
      name: 'Ana Costa',
      relationship: 'Esposa',
      phone: '(11) 98765-4322'
    },
    insurance: {
      plan: 'Premium',
      number: '123456789',
      validity: '2025-12-31'
    },
    observations: 'Paciente com histórico de alergias. Preferência por consultas no período da manhã.'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar os dados
    console.log('Salvando dados:', patientData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Aqui você restauraria os dados originais
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPatientData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setPatientData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <PatientLayout
      patientId={patientId}
      patientName={patientData.name}
      activeTab="personal-data"
    >
      <div className="p-6 space-y-6">
        {/* Informações Pessoais */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Informações Pessoais</h2>
            {!isEditing ? (
              <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
                Editar Dados
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Nome Completo"
              value={patientData.name}
              onChange={(value) => handleInputChange('name', value)}
              disabled={!isEditing}
              placeholder=" "
              floating
              fullWidth
            />
            <Input
              label="CPF"
              value={patientData.cpf}
              onChange={(value) => handleInputChange('cpf', value)}
              disabled={!isEditing}
              mask="cpf"
              fullWidth
            />
            <Input
              label="RG"
              value={patientData.rg}
              onChange={(value) => handleInputChange('rg', value)}
              disabled={!isEditing}
              fullWidth
            />
            <Input
              label="Data de Nascimento"
              value={patientData.birthDate}
              onChange={(value) => handleInputChange('birthDate', value)}
              disabled={!isEditing}
              mask="date"
              fullWidth
            />
            <Select
              label="Gênero"
              value={patientData.gender}
              onChange={(e) => handleInputChange('gender', Array.isArray(e.target.value) ? e.target.value[0] : e.target.value)}
              disabled={!isEditing}
              fullWidth
              options={[
                { label: 'Masculino', value: 'Masculino' },
                { label: 'Feminino', value: 'Feminino' },
                { label: 'Outro', value: 'Outro' }
              ]}
            />
            <Select
              label="Estado Civil"
              value={patientData.maritalStatus}
              onChange={(e) => handleInputChange('maritalStatus', Array.isArray(e.target.value) ? e.target.value[0] : e.target.value)}
              disabled={!isEditing}
              fullWidth
              options={[
                { label: 'Solteiro(a)', value: 'Solteiro' },
                { label: 'Casado(a)', value: 'Casado' },
                { label: 'Divorciado(a)', value: 'Divorciado' },
                { label: 'Viúvo(a)', value: 'Viúvo' }
              ]}
            />
            <Input
              label="Profissão"
              value={patientData.profession}
              onChange={(value) => handleInputChange('profession', value)}
              disabled={!isEditing}
              fullWidth
            />
          </div>
        </Card>

        {/* Informações de Contato */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Informações de Contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Telefone Principal"
              value={patientData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              disabled={!isEditing}
              mask="internationalPhone"
              fullWidth
            />
            <Input
              label="Telefone Alternativo"
              value={patientData.alternativePhone}
              onChange={(value) => handleInputChange('alternativePhone', value)}
              disabled={!isEditing}
              mask="internationalPhone"
              fullWidth
            />
            <Input
              label="Email"
              value={patientData.email}
              onChange={(value) => handleInputChange('email', value)}
              disabled={!isEditing}
              validation="email"
              fullWidth
            />
          </div>
        </Card>

        {/* Endereço */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="CEP"
              value={patientData.address.zipCode}
              onChange={(value) => handleInputChange('address.zipCode', value)}
              disabled={!isEditing}
              mask="zipCode"
              fullWidth
            />
            <div className="lg:col-span-2">
              <Input
                label="Rua"
                value={patientData.address.street}
                onChange={(value) => handleInputChange('address.street', value)}
                disabled={!isEditing}
                fullWidth
              />
            </div>
            <Input
              label="Número"
              value={patientData.address.number}
              onChange={(value) => handleInputChange('address.number', value)}
              disabled={!isEditing}
              fullWidth
            />
            <Input
              label="Complemento"
              value={patientData.address.complement}
              onChange={(value) => handleInputChange('address.complement', value)}
              disabled={!isEditing}
              fullWidth
            />
            <Input
              label="Bairro"
              value={patientData.address.neighborhood}
              onChange={(value) => handleInputChange('address.neighborhood', value)}
              disabled={!isEditing}
              fullWidth
            />
            <Input
              label="Cidade"
              value={patientData.address.city}
              onChange={(value) => handleInputChange('address.city', value)}
              disabled={!isEditing}
              fullWidth
            />
            <Select
              label="Estado"
              value={patientData.address.state}
              onChange={(e) => handleInputChange('address.state', Array.isArray(e.target.value) ? e.target.value[0] : e.target.value)}
              disabled={!isEditing}
              fullWidth
              options={[
                { label: 'Acre', value: 'AC' },
                { label: 'Alagoas', value: 'AL' },
                { label: 'Amapá', value: 'AP' },
                { label: 'Amazonas', value: 'AM' },
                { label: 'Bahia', value: 'BA' },
                { label: 'Ceará', value: 'CE' },
                { label: 'Distrito Federal', value: 'DF' },
                { label: 'Espírito Santo', value: 'ES' },
                { label: 'Goiás', value: 'GO' },
                { label: 'Maranhão', value: 'MA' },
                { label: 'Mato Grosso', value: 'MT' },
                { label: 'Mato Grosso do Sul', value: 'MS' },
                { label: 'Minas Gerais', value: 'MG' },
                { label: 'Pará', value: 'PA' },
                { label: 'Paraíba', value: 'PB' },
                { label: 'Paraná', value: 'PR' },
                { label: 'Pernambuco', value: 'PE' },
                { label: 'Piauí', value: 'PI' },
                { label: 'Rio de Janeiro', value: 'RJ' },
                { label: 'Rio Grande do Norte', value: 'RN' },
                { label: 'Rio Grande do Sul', value: 'RS' },
                { label: 'Rondônia', value: 'RO' },
                { label: 'Roraima', value: 'RR' },
                { label: 'Santa Catarina', value: 'SC' },
                { label: 'São Paulo', value: 'SP' },
                { label: 'Sergipe', value: 'SE' },
                { label: 'Tocantins', value: 'TO' }
              ]}
            />
          </div>
        </Card>

        {/* Contato de Emergência */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Contato de Emergência</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Nome"
              value={patientData.emergencyContact.name}
              onChange={(value) => handleInputChange('emergencyContact.name', value)}
              disabled={!isEditing}
              fullWidth
            />
            <Input
              label="Parentesco"
              value={patientData.emergencyContact.relationship}
              onChange={(value) => handleInputChange('emergencyContact.relationship', value)}
              disabled={!isEditing}
              fullWidth
            />
            <Input
              label="Telefone"
              value={patientData.emergencyContact.phone}
              onChange={(value) => handleInputChange('emergencyContact.phone', value)}
              disabled={!isEditing}
              mask="internationalPhone"
              fullWidth
            />
          </div>
        </Card>

        {/* Plano de Saúde */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Plano de Saúde</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Plano"
              value={patientData.insurance.plan}
              onChange={(value) => handleInputChange('insurance.plan', value)}
              disabled={!isEditing}
              fullWidth
            />
            <Input
              label="Número da Carteira"
              value={patientData.insurance.number}
              onChange={(value) => handleInputChange('insurance.number', value)}
              disabled={!isEditing}
              fullWidth
            />
            <Input
              label="Validade"
              value={patientData.insurance.validity}
              onChange={(value) => handleInputChange('insurance.validity', value)}
              disabled={!isEditing}
              mask="date"
              fullWidth
            />
          </div>
        </Card>

        {/* Observações */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Observações</h2>
          <textarea
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-krooa-green disabled:bg-gray-50 disabled:text-gray-500"
            rows={4}
            value={patientData.observations}
            onChange={(e) => handleInputChange('observations', e.target.value)}
            disabled={!isEditing}
            placeholder="Adicione observações sobre o paciente..."
          />
        </Card>
      </div>
    </PatientLayout>
  );
};

export default PersonalDataPage;