import { useState, useEffect } from 'react';
import { useRegion } from '../contexts/RegionContext';

// Definir os tipos de tradução
type LanguageCode = 'PT' | 'EN' | 'ES';
type RegionCode = 'BR' | 'US';

// Estrutura de traduções
interface Translations {
  // Conta
  account: string;
  save: string;
  companyName: string;
  email: string;
  responsibleName: string;
  responsibleDocument: string;
  phone: string;
  masterUser: string;
  masterUserDescription: string;

  // Pessoa Jurídica vs Corporation
  legalEntity: string;
  legalEntityDescription: string;
  legalName: string;
  taxId: string;

  // Traduções dinâmicas por região
  fieldLabels: {
    responsibleDocumentLabel: string; // CPF/SSN dependendo da região
    taxIdLabel: string; // CNPJ/EIN dependendo da região
  };

  // Múltiplas Unidades
  multipleUnits: string;
  multipleUnitsDescription: string;
  units: string;
  newUnit: string;

  // Tabela
  title: string;
  communicationCenter: string;
  costCenter: string;
  collaborators: string;
  actions: string;
  edit: string;
  delete: string;

  // Configurações da Clínica
  clinicSettings: string;
  clinicSettingsSubtitle: string;

  // Abas do menu
  chairs: string;
  parameters: string;

  // Modal de exclusão
  deleteUnit: string;
  recordsAffected: string;
  deleteUnitConfirm: string;
  transferRecords: string;
  doNotTransfer: string;
  cancel: string;
  deleteAndTransfer: string;
  deletePermanently: string;
  masterUnitCannotBeDeleted: string;

  // Estados/Validações por região
  placeholders: {
    companyName: string;
    responsibleName: string;
    responsibleDocument: string;
    legalName: string;
    taxId: string;
    selectMasterUser: string;
    selectCommunicationCenters: string;
    selectCostCenters: string;
    selectCollaborators: string;
  };
}

// Traduções por idioma
const translations: Record<LanguageCode, Translations> = {
  PT: {
    account: 'Conta',
    save: 'Salvar',
    companyName: 'Nome Empresa',
    email: 'E-mail',
    responsibleName: 'Nome do Responsável',
    responsibleDocument: 'CPF do Responsável',
    phone: 'Telefone',
    masterUser: 'Usuário Master',
    masterUserDescription: 'O usuário master tem acesso total ao sistema',

    legalEntity: 'Pessoa Jurídica',
    legalEntityDescription: 'Habilite para adicionar dados da empresa',
    legalName: 'Razão Social',
    taxId: 'CNPJ',

    fieldLabels: {
      responsibleDocumentLabel: 'CPF do Responsável',
      taxIdLabel: 'CNPJ',
    },

    multipleUnits: 'Múltiplas Unidades',
    multipleUnitsDescription: 'Gerencie múltiplas unidades da sua clínica',
    units: 'Unidades',
    newUnit: 'Nova Unidade',

    title: 'Título',
    communicationCenter: 'Central de Comunicação',
    costCenter: 'Centro de Custo',
    collaborators: 'Colaboradores',
    actions: 'Ações',
    edit: 'Editar',
    delete: 'Excluir',

    // Configurações da Clínica
    clinicSettings: 'Configurações da Clínica',
    clinicSettingsSubtitle: 'Gerencie as informações e configurações da sua clínica',

    // Abas do menu
    chairs: 'Cadeiras',
    parameters: 'Parâmetros',

    // Modal de exclusão
    deleteUnit: 'Excluir Unidade',
    recordsAffected: 'registros serão afetados',
    deleteUnitConfirm: 'Tem certeza que deseja excluir a unidade',
    transferRecords: 'Você pode transferir os registros afetados para outra unidade ou excluir permanentemente.',
    doNotTransfer: 'Não transferir (excluir permanentemente)',
    cancel: 'Cancelar',
    deleteAndTransfer: 'Excluir e Transferir',
    deletePermanently: 'Excluir Permanentemente',
    masterUnitCannotBeDeleted: 'Unidade principal não pode ser excluída',

    placeholders: {
      companyName: 'Digite o nome da empresa',
      responsibleName: 'Nome completo',
      responsibleDocument: 'XXX.XXX.XXX-XX',
      legalName: 'Nome da empresa',
      taxId: '00.000.000/0000-00',
      selectMasterUser: 'Selecione o usuário master',
      selectCommunicationCenters: 'Selecione as centrais',
      selectCostCenters: 'Selecione os centros',
      selectCollaborators: 'Selecione colaboradores'
    }
  },

  EN: {
    account: 'Account',
    save: 'Save',
    companyName: 'Company Name',
    email: 'Email',
    responsibleName: 'Responsible Person',
    responsibleDocument: 'Social Security Number',
    phone: 'Phone',
    masterUser: 'Administrator',
    masterUserDescription: 'The administrator has full access to the system',

    legalEntity: 'Corporation',
    legalEntityDescription: 'Enable to add company data',
    legalName: 'Legal Name',
    taxId: 'EIN',

    fieldLabels: {
      responsibleDocumentLabel: 'Social Security Number',
      taxIdLabel: 'EIN (Employer Identification Number)',
    },

    multipleUnits: 'Multiple Units',
    multipleUnitsDescription: 'Manage multiple units of your clinic',
    units: 'Units',
    newUnit: 'New Unit',

    title: 'Title',
    communicationCenter: 'Communication Center',
    costCenter: 'Cost Center',
    collaborators: 'Collaborators',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',

    // Configurações da Clínica
    clinicSettings: 'Clinic Settings',
    clinicSettingsSubtitle: 'Manage your clinic information and settings',

    // Abas do menu
    chairs: 'Appointments',
    parameters: 'Parameters',

    // Modal de exclusão
    deleteUnit: 'Delete Unit',
    recordsAffected: 'records will be affected',
    deleteUnitConfirm: 'Are you sure you want to delete the unit',
    transferRecords: 'You can transfer the affected records to another unit or delete permanently.',
    doNotTransfer: 'Do not transfer (delete permanently)',
    cancel: 'Cancel',
    deleteAndTransfer: 'Delete and Transfer',
    deletePermanently: 'Delete Permanently',
    masterUnitCannotBeDeleted: 'Master unit cannot be deleted',

    placeholders: {
      companyName: 'Enter company name',
      responsibleName: 'Full name',
      responsibleDocument: 'XXX-XX-XXXX',
      legalName: 'Company legal name',
      taxId: 'XX-XXXXXXX',
      selectMasterUser: 'Select administrator',
      selectCommunicationCenters: 'Select centers',
      selectCostCenters: 'Select cost centers',
      selectCollaborators: 'Select collaborators'
    }
  },

  ES: {
    account: 'Cuenta',
    save: 'Guardar',
    companyName: 'Nombre Empresa',
    email: 'Correo',
    responsibleName: 'Nombre del Responsable',
    responsibleDocument: 'Documento del Responsable',
    phone: 'Teléfono',
    masterUser: 'Usuario Master',
    masterUserDescription: 'El usuario master tiene acceso total al sistema',

    legalEntity: 'Persona Jurídica',
    legalEntityDescription: 'Habilite para agregar datos de la empresa',
    legalName: 'Razón Social',
    taxId: 'Número Fiscal',

    fieldLabels: {
      responsibleDocumentLabel: 'Número de Seguridad Social',
      taxIdLabel: 'EIN (Número de Identificación del Empleador)',
    },

    multipleUnits: 'Múltiples Unidades',
    multipleUnitsDescription: 'Gestione múltiples unidades de su clínica',
    units: 'Unidades',
    newUnit: 'Nueva Unidad',

    title: 'Título',
    communicationCenter: 'Centro de Comunicación',
    costCenter: 'Centro de Costo',
    collaborators: 'Colaboradores',
    actions: 'Acciones',
    edit: 'Editar',
    delete: 'Eliminar',

    // Configurações da Clínica
    clinicSettings: 'Configuraciones de la Clínica',
    clinicSettingsSubtitle: 'Gestione la información y configuraciones de su clínica',

    // Abas do menu
    chairs: 'Sillas',
    parameters: 'Parámetros',

    // Modal de exclusão
    deleteUnit: 'Eliminar Unidad',
    recordsAffected: 'registros serán afectados',
    deleteUnitConfirm: '¿Está seguro de que desea eliminar la unidad',
    transferRecords: 'Puede transferir los registros afectados a otra unidad o eliminar permanentemente.',
    doNotTransfer: 'No transferir (eliminar permanentemente)',
    cancel: 'Cancelar',
    deleteAndTransfer: 'Eliminar y Transferir',
    deletePermanently: 'Eliminar Permanentemente',
    masterUnitCannotBeDeleted: 'La unidad principal no puede ser eliminada',

    placeholders: {
      companyName: 'Ingrese el nombre de la empresa',
      responsibleName: 'Nombre completo',
      responsibleDocument: 'XXXX.XXXX.XXXX',
      legalName: 'Nombre de la empresa',
      taxId: 'XX-XXXXXXXX',
      selectMasterUser: 'Seleccione usuario master',
      selectCommunicationCenters: 'Seleccione centrales',
      selectCostCenters: 'Seleccione centros',
      selectCollaborators: 'Seleccione colaboradores'
    }
  }
};

// Configurações específicas por região
interface RegionConfig {
  responsibleDocument: {
    mask: string;
    validation: string;
    placeholder: string;
    required: boolean;
    secret: boolean;
  };
  taxId: {
    mask: string;
    validation: string;
    placeholder: string;
  };
  phone: {
    defaultCountry: string;
  };
}

const regionConfigs: Record<RegionCode, RegionConfig> = {
  BR: {
    responsibleDocument: {
      mask: 'cpf',
      validation: 'cpf',
      placeholder: 'XXX.XXX.XXX-XX',
      required: true,
      secret: false
    },
    taxId: {
      mask: 'cnpj',
      validation: 'cnpj',
      placeholder: '00.000.000/0000-00'
    },
    phone: {
      defaultCountry: 'BR'
    }
  },
  US: {
    responsibleDocument: {
      mask: 'ssn',
      validation: 'none',
      placeholder: 'XXX-XX-XXXX',
      required: false,
      secret: true
    },
    taxId: {
      mask: 'ein',
      validation: 'ein',
      placeholder: 'XX-XXXXXXX'
    },
    phone: {
      defaultCountry: 'US'
    }
  }
};

export function useTranslation() {
  const { currentRegion } = useRegion();

  // Idioma independente da região - carregado do localStorage
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    const savedLanguage = localStorage.getItem('krooa_language') as LanguageCode;
    return savedLanguage && ['PT', 'EN', 'ES'].includes(savedLanguage) ? savedLanguage : 'PT';
  });

  // Função para mudar idioma e salvar no localStorage
  const changeLanguage = (language: LanguageCode) => {
    setCurrentLanguage(language);
    localStorage.setItem('krooa_language', language);
  };

  const t = translations[currentLanguage];
  const regionConfig = regionConfigs[currentRegion as RegionCode] || regionConfigs.BR;

  // Função para obter labels adaptadas à região atual
  const getFieldLabels = () => {
    if (currentRegion === 'BR') {
      // Brasil sempre usa CPF e CNPJ independente do idioma
      return {
        responsibleDocumentLabel: currentLanguage === 'PT' ? 'CPF do Responsável' :
                                 currentLanguage === 'EN' ? 'Responsible Person\'s CPF' :
                                 'CPF del Responsable',
        taxIdLabel: currentLanguage === 'PT' ? 'CNPJ' :
                   currentLanguage === 'EN' ? 'CNPJ (Tax ID)' :
                   'CNPJ (Número Fiscal)',
      };
    } else {
      // Estados Unidos usa SSN e EIN com traduções por idioma
      return t.fieldLabels;
    }
  };

  return {
    t,
    regionConfig,
    currentLanguage,
    changeLanguage,
    getFieldLabels
  };
}