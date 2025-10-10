import api from '../../services/api';

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

export const prospectsService = {
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
  }
};
