import api from '../../services/api';
import axios from 'axios';

interface LocationData {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  ip: string;
  timezone: string;
}

interface Step1Request {
  email: string;
}

interface Step1Response {
  success: boolean;
  message: string;
  data: {
    prospect_id: number;
    session_code: string;
    email: string;
    current_step: number;
    expires_in_minutes: number;
  };
}

interface VerifyStep1Request {
  session_code: string;
  code: string;
}

interface VerifyStep1Response {
  success: boolean;
  message: string;
  data?: any;
}

interface ResendStep1Request {
  email: string;
  session_code: string;
}

interface ResendStep1Response {
  success: boolean;
  message: string;
  data: {
    session_code: string;
    expires_in_minutes: number;
  };
}

interface Step2Request {
  session_code: string;
  name: string;
  phone: string;
  phone_ddi: string;
}

interface Step2Response {
  success: boolean;
  message: string;
  data: {
    prospect_id: number;
    session_code: string;
    name: string;
    phone: string;
    phone_ddi: string;
    email: string;
    current_step: number;
    next_step: string;
  };
}

interface Step3Request {
  session_code: string;
  region: string;
  accept_kroa_terms: boolean;
  accept_lgpd_terms: boolean;
  accept_hipaa_terms: boolean;
}

interface Step3Response {
  success: boolean;
  message: string;
  data: {
    prospect_id: number;
    session_code: string;
    region: string;
    terms_accepted: string[];
    current_step: number;
    next_step: string;
  };
}

export const prospectsService = {
  /**
   * Obtém localização do usuário por IP
   */
  getLocationByIP: async (): Promise<LocationData> => {
    try {
      const response = await axios.get('https://ipapi.co/json/');
      const data = response.data;

      return {
        country: data.country_name,
        countryCode: data.country_code, // BR, US, etc
        city: data.city,
        region: data.region,
        ip: data.ip,
        timezone: data.timezone
      };
    } catch (error) {
      console.error('Erro ao obter localização por IP:', error);
      throw error;
    }
  },

  /**
   * Envia email para o step 1 do onboarding
   */
  step1: async (data: Step1Request): Promise<Step1Response> => {
    const response = await api.post<Step1Response>('/prospects/step1', data);
    return response.data;
  },

  /**
   * Verifica o código enviado por email
   */
  verifyStep1: async (data: VerifyStep1Request): Promise<VerifyStep1Response> => {
    const response = await api.post<VerifyStep1Response>('/prospects/verify-step1', data);
    return response.data;
  },

  /**
   * Reenvia o código de verificação
   */
  resendStep1: async (data: ResendStep1Request): Promise<ResendStep1Response> => {
    const response = await api.post<ResendStep1Response>('/prospects/resend-step1', data);
    return response.data;
  },

  /**
   * Envia dados pessoais (nome e telefone) para o step 2
   */
  step2: async (data: Step2Request): Promise<Step2Response> => {
    const response = await api.post<Step2Response>('/prospects/step2', data);
    return response.data;
  },

  /**
   * Envia aceitação de termos para o step 3
   */
  step3: async (data: Step3Request): Promise<Step3Response> => {
    const response = await api.post<Step3Response>('/prospects/step3', data);
    return response.data;
  }
};
