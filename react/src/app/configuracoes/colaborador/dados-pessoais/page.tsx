import React, { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import { ColaboradorLayout } from '../../../../layouts/ColaboradorLayout';
import { Camera } from 'lucide-react';

export default function DadosPessoaisColaborador() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    whatsapp: '',
    cargo: '',
    especialidade: '',
    conselho: '',
    estadoConselho: '',
    numeroConselho: '',
    foto: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ColaboradorLayout>
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Informações Pessoais</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Nome Completo"
              value={formData.nome}
              onChange={(value) => handleInputChange('nome', value)}
              placeholder=" "
              floating
              fullWidth
            />

            <Input
              label="CPF"
              value={formData.cpf}
              onChange={(value) => handleInputChange('cpf', value)}
              mask="cpf"
              fullWidth
            />

            <Input
              label="Data de Nascimento"
              value={formData.dataNascimento}
              onChange={(value) => handleInputChange('dataNascimento', value)}
              mask="date"
              fullWidth
            />

            <Input
              label="E-mail"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              validation="email"
              fullWidth
            />

            <Input
              label="Telefone"
              value={formData.telefone}
              onChange={(value) => handleInputChange('telefone', value)}
              mask="internationalPhone"
              fullWidth
            />

            <Input
              label="WhatsApp"
              value={formData.whatsapp}
              onChange={(value) => handleInputChange('whatsapp', value)}
              mask="internationalPhone"
              fullWidth
            />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-base font-medium text-gray-900 mb-4">Dados Profissionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Cargo/Função"
              value={formData.cargo}
              onChange={(value) => handleInputChange('cargo', value)}
              fullWidth
              placeholder="Digite ou selecione um cargo"
            />

            <Input
              label="Especialidade"
              value={formData.especialidade}
              onChange={(value) => handleInputChange('especialidade', value)}
              placeholder=" "
              floating
              fullWidth
            />

            <Select
              label="Conselho de Classe"
              value={formData.conselho}
              onChange={(e) => handleInputChange('conselho', e.target.value)}
              options={[
                { value: '', label: 'Selecione...' },
                { value: 'CRO', label: 'CRO - Conselho Regional de Odontologia' },
                { value: 'CRM', label: 'CRM - Conselho Regional de Medicina' },
                { value: 'COREN', label: 'COREN - Conselho Regional de Enfermagem' },
                { value: 'CRF', label: 'CRF - Conselho Regional de Farmácia' },
                { value: 'CREFITO', label: 'CREFITO - Conselho Regional de Fisioterapia' },
                { value: 'CRN', label: 'CRN - Conselho Regional de Nutrição' },
                { value: 'CRP', label: 'CRP - Conselho Regional de Psicologia' },
                { value: 'CRESS', label: 'CRESS - Conselho Regional de Serviço Social' }
              ]}
            />

            {formData.conselho && (
              <>
                <Select
                  label="Estado do Conselho"
                  value={formData.estadoConselho}
                  onChange={(e) => handleInputChange('estadoConselho', e.target.value)}
                  options={[
                    { value: '', label: 'Selecione o estado...' },
                    { value: 'AC', label: 'Acre' },
                    { value: 'AL', label: 'Alagoas' },
                    { value: 'AP', label: 'Amapá' },
                    { value: 'AM', label: 'Amazonas' },
                    { value: 'BA', label: 'Bahia' },
                    { value: 'CE', label: 'Ceará' },
                    { value: 'DF', label: 'Distrito Federal' },
                    { value: 'ES', label: 'Espírito Santo' },
                    { value: 'GO', label: 'Goiás' },
                    { value: 'MA', label: 'Maranhão' },
                    { value: 'MT', label: 'Mato Grosso' },
                    { value: 'MS', label: 'Mato Grosso do Sul' },
                    { value: 'MG', label: 'Minas Gerais' },
                    { value: 'PA', label: 'Pará' },
                    { value: 'PB', label: 'Paraíba' },
                    { value: 'PR', label: 'Paraná' },
                    { value: 'PE', label: 'Pernambuco' },
                    { value: 'PI', label: 'Piauí' },
                    { value: 'RJ', label: 'Rio de Janeiro' },
                    { value: 'RN', label: 'Rio Grande do Norte' },
                    { value: 'RS', label: 'Rio Grande do Sul' },
                    { value: 'RO', label: 'Rondônia' },
                    { value: 'RR', label: 'Roraima' },
                    { value: 'SC', label: 'Santa Catarina' },
                    { value: 'SP', label: 'São Paulo' },
                    { value: 'SE', label: 'Sergipe' },
                    { value: 'TO', label: 'Tocantins' }
                  ]}
                />

                <Input
                  label={`Número ${formData.conselho}-${formData.estadoConselho || 'UF'}`}
                  value={formData.numeroConselho}
                  onChange={(value) => handleInputChange('numeroConselho', value)}
                  placeholder=" "
                  floating
                  fullWidth
                />
              </>
            )}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-6">Foto do Perfil</h2>

          <div className="flex items-center gap-6">
            <div className="relative group">
              {formData.foto ? (
                <>
                  <img
                    src={formData.foto}
                    alt="Foto do perfil"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                  />
                  <div className="absolute inset-0 w-32 h-32 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-gray-100">
                  <Camera className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900 mb-2">Foto de Identificação</h3>
              <p className="text-sm text-gray-600 mb-4">
                Esta foto será usada no perfil do colaborador e documentos internos.
              </p>
              <div className="flex gap-3">
                <Button variant="primary" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Escolher Foto
                </Button>
                {formData.foto && (
                  <Button variant="outline" className="text-red-600 hover:bg-red-50">
                    Remover
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Formatos aceitos: JPG, PNG ou GIF. Tamanho máximo: 2MB.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </ColaboradorLayout>
  );
}