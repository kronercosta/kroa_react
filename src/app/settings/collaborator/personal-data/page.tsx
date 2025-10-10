import { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import { Switch } from '../../../../components/ui/Switch';
import { ColaboradorLayout } from '../ColaboradorLayout';
import { Camera, CheckCircle, Palette } from 'lucide-react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useRegion } from '../../../../contexts/RegionContext';
import translations from './translation.json';

export default function DadosPessoaisColaborador() {
  const { t } = useTranslation(translations);
  const { currentRegion } = useRegion();

  // Carregar dados salvos do localStorage (simulação)
  const carregarDadosSalvos = () => {
    const dadosSalvos = localStorage.getItem('colaborador_dados');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      return {
        formData: dados.formData || {
          nome: '',
          cpf: '',
          dataNascimento: '',
          email: '',
          telefone: '',
          whatsapp: '',
          cargo: [],
          especialidade: [],
          conselho: '',
          estadoConselho: '',
          numeroConselho: '',
          foto: dados.fotoPreview || '',
          corAvatar: dados.formData?.corAvatar || '#10B981'
        },
        fotoData: {
          preview: dados.fotoPreview,
          fileName: dados.formData?.foto,
          position: dados.fotoPosition,
          scale: dados.fotoScale
        }
      };
    }
    return null;
  };

  const dadosIniciais = carregarDadosSalvos();
  const [formData, setFormData] = useState(dadosIniciais?.formData || {
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    whatsapp: '',
    cargo: [],
    especialidade: [],
    conselho: '',
    estadoConselho: '',
    numeroConselho: '',
    foto: '',
    corAvatar: '#10B981' // Cor padrão krooa-green
  });

  // Estado separado para dados da foto
  const [fotoData, setFotoData] = useState<{
    file?: File;
    preview?: string;
    fileName?: string;
    position?: { x: number; y: number };
    scale?: number;
  }>(dadosIniciais?.fotoData || {});

  // Opções para cargo/função
  const [cargoOptions, setCargoOptions] = useState([
    { value: 'dentista', label: 'Dentista' },
    { value: 'auxiliar', label: 'Auxiliar de Saúde Bucal' },
    { value: 'tecnico', label: 'Técnico em Saúde Bucal' },
    { value: 'recepcionista', label: 'Recepcionista' },
    { value: 'secretaria', label: 'Secretária' },
    { value: 'gerente', label: 'Gerente' },
    { value: 'coordenador', label: 'Coordenador' }
  ]);

  // Opções para especialidade
  const [especialidadeOptions, setEspecialidadeOptions] = useState([
    { value: 'ortodontia', label: 'Ortodontia' },
    { value: 'endodontia', label: 'Endodontia' },
    { value: 'periodontia', label: 'Periodontia' },
    { value: 'cirurgia', label: 'Cirurgia Oral' },
    { value: 'protese', label: 'Prótese Dentária' },
    { value: 'implantodontia', label: 'Implantodontia' },
    { value: 'odontopediatria', label: 'Odontopediatria' },
    { value: 'estetica', label: 'Odontologia Estética' },
    { value: 'geral', label: 'Clínica Geral' }
  ]);

  // Opções para conselho de classe
  const [conselhoOptions, setConselhoOptions] = useState([
    { value: 'CRO', label: 'CRO - Conselho Regional de Odontologia' },
    { value: 'CRM', label: 'CRM - Conselho Regional de Medicina' },
    { value: 'COREN', label: 'COREN - Conselho Regional de Enfermagem' },
    { value: 'CRF', label: 'CRF - Conselho Regional de Farmácia' },
    { value: 'CREFITO', label: 'CREFITO - Conselho Regional de Fisioterapia' },
    { value: 'CRN', label: 'CRN - Conselho Regional de Nutrição' },
    { value: 'CRP', label: 'CRP - Conselho Regional de Psicologia' },
    { value: 'CRESS', label: 'CRESS - Conselho Regional de Serviço Social' }
  ]);

  const handleInputChange = (field: string, value: string, isValid?: boolean, extraData?: any) => {
    if (field === 'foto' && extraData) {
      // Armazenar dados completos da foto
      setFotoData({
        file: extraData.file,
        preview: extraData.preview,
        fileName: value,
        position: extraData.position,
        scale: extraData.scale
      });
      // Manter o preview no formData para exibir no avatar
      setFormData((prev: typeof formData) => ({ ...prev, [field]: extraData.preview || value }));
    } else {
      setFormData((prev: typeof formData) => ({ ...prev, [field]: value }));
    }
  };


  const handleSave = () => {
    const dadosParaSalvar = {
      formData,
      fotoPreview: fotoData.preview,
      fotoPosition: fotoData.position,
      fotoScale: fotoData.scale
    };

    // Salvar no localStorage (simulação de persistência)
    localStorage.setItem('colaborador_dados', JSON.stringify(dadosParaSalvar));

    console.log('Salvando dados:', dadosParaSalvar);
    // Aqui você pode adicionar a lógica de salvamento real
    // Exemplo: await api.salvarColaborador(dadosParaSalvar);

    // Simular salvamento bem-sucedido
    alert('Dados salvos com sucesso!');
  };

  return (
    <ColaboradorLayout
      colaboradorData={{
        nome: formData.nome,
        cargo: Array.isArray(formData.cargo) ? formData.cargo.join(', ') : formData.cargo,
        foto: formData.foto,
        corAvatar: formData.corAvatar
      }}
      headerControls={null}
    >
      <div className="space-y-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">{t?.personalInfo?.title || 'Informações Pessoais'}</h2>
            <Button variant="primary" size="sm" onClick={handleSave}>{t?.buttons?.save || 'Salvar'}</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label={t?.personalInfo?.fullName || 'Nome Completo'}
              value={formData.nome}
              onChange={(value) => handleInputChange('nome', value)}
              placeholder=" "
              floating
              fullWidth
            />

            <Input
              label={t?.personalInfo?.cpf || 'CPF'}
              value={formData.cpf}
              onChange={(value) => handleInputChange('cpf', value)}
              mask="cpf"
              fullWidth
            />

            <Input
              label={t?.personalInfo?.birthDate || 'Data de Nascimento'}
              value={formData.dataNascimento}
              onChange={(value) => handleInputChange('dataNascimento', value)}
              mask="date"
              fullWidth
            />

            <Input
              label={t?.personalInfo?.email || 'E-mail'}
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              validation="email"
              fullWidth
            />

            <Input
              label={t?.personalInfo?.phone || 'Telefone'}
              value={formData.telefone}
              onChange={(value) => handleInputChange('telefone', value)}
              mask="internationalPhone"
              fullWidth
            />

            <Input
              label={t?.personalInfo?.whatsapp || 'WhatsApp'}
              value={formData.whatsapp}
              onChange={(value) => handleInputChange('whatsapp', value)}
              mask="internationalPhone"
              fullWidth
            />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-base font-medium text-gray-900 mb-4">{t?.professionalInfo?.title || 'Dados Profissionais'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label={t?.professionalInfo?.position || 'Cargo/Função'}
              required={false}
              disabled={false}
              fullWidth={true}
              multiple={true}
              searchable={true}
              editable={true}
              value={formData.cargo}
              onChange={(e) => setFormData((prev: typeof formData) => ({ ...prev, cargo: e.target.value }))}
              options={cargoOptions}
              onOptionsChange={setCargoOptions}
            />

            <Select
              label={t?.professionalInfo?.specialty || 'Especialidade'}
              required={false}
              disabled={false}
              fullWidth={true}
              multiple={true}
              searchable={true}
              editable={true}
              value={formData.especialidade}
              onChange={(e) => setFormData((prev: typeof formData) => ({ ...prev, especialidade: e.target.value }))}
              options={especialidadeOptions}
              onOptionsChange={setEspecialidadeOptions}
            />

            <Select
              label={t?.professionalInfo?.council || 'Conselho de Classe'}
              required={false}
              disabled={false}
              fullWidth={true}
              multiple={false}
              searchable={true}
              editable={true}
              value={formData.conselho}
              onChange={(e) => setFormData((prev: typeof formData) => ({ ...prev, conselho: Array.isArray(e.target.value) ? e.target.value[0] : e.target.value }))}
              options={conselhoOptions}
              onOptionsChange={setConselhoOptions}
            />

            {formData.conselho && (
              <>
                <Select
                  label={t?.professionalInfo?.councilState || 'Estado do Conselho'}
                  value={formData.estadoConselho}
                  onChange={(e) => handleInputChange('estadoConselho', Array.isArray(e.target.value) ? e.target.value[0] : e.target.value)}
                  options={[
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
                  label={t?.professionalInfo?.councilNumber ? `${t.professionalInfo.councilNumber} ${formData.conselho}-${formData.estadoConselho || 'UF'}` : `Número ${formData.conselho}-${formData.estadoConselho || 'UF'}`}
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Personalização do Avatar
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Configure a foto de perfil e a cor de fundo para o avatar com suas iniciais
          </p>

          <div className="space-y-6">
            {/* Foto do Perfil */}
            <div>
              <Input
                label={t?.photo?.identificationTitle || 'Foto de Identificação'}
                value={formData.foto}
                onChange={(value, isValid, extraData) => handleInputChange('foto', value, isValid, extraData)}
                mask="photo"
                fullWidth
                icon={<Camera className="w-4 h-4" />}
              />
            </div>

            {/* Cor do Avatar */}
            <div>
              <Input
                label="Cor do Avatar (para iniciais)"
                value={formData.corAvatar}
                onChange={(value) => handleInputChange('corAvatar', value)}
                mask="color"
                fullWidth
              />
              <p className="text-xs text-gray-500 mt-1">
                Cor usada quando não houver foto de perfil
              </p>
            </div>
          </div>
        </Card>

      </div>
    </ColaboradorLayout>
  );
}