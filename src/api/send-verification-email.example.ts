/**
 * Exemplo de API endpoint para enviar email de verificação via Brevo (Sendinblue)
 *
 * Este arquivo demonstra como implementar o endpoint no backend.
 *
 * Requisitos:
 * - npm install @sendinblue/client
 * - Ter uma conta Brevo e API key
 * - Criar templates de email no Brevo
 */

import * as SibApiV3Sdk from '@sendinblue/client';

interface SendVerificationEmailRequest {
  email: string;
  code: string;
  template: string;
  language: 'pt' | 'en' | 'es';
}

export async function sendVerificationEmail(req: SendVerificationEmailRequest) {
  // Configurar cliente Brevo
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // Configurar API Key (usar variável de ambiente)
  apiInstance.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY || ''
  );

  // Mapear templates por idioma
  const templateIds = {
    'email-verification': {
      pt: 1, // ID do template em português no Brevo
      en: 2, // ID do template em inglês no Brevo
      es: 3, // ID do template em espanhol no Brevo
    }
  };

  const templateId = templateIds[req.template as keyof typeof templateIds]?.[req.language];

  if (!templateId) {
    throw new Error('Template not found');
  }

  // Criar objeto de email
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.to = [
    {
      email: req.email,
      name: req.email.split('@')[0], // Usar parte antes do @ como nome
    },
  ];

  sendSmtpEmail.templateId = templateId;

  // Parâmetros dinâmicos do template
  sendSmtpEmail.params = {
    VERIFICATION_CODE: req.code,
    // Adicionar outros parâmetros conforme necessário
  };

  // Sender (configurar no Brevo)
  sendSmtpEmail.sender = {
    name: 'KROA',
    email: 'noreply@kroa.com', // Usar email verificado no Brevo
  };

  try {
    // Enviar email
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', result);
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Exemplo de template HTML para email de verificação (criar no Brevo):
 *
 * <!DOCTYPE html>
 * <html>
 * <head>
 *   <meta charset="utf-8">
 *   <title>Verificação de E-mail - KROA</title>
 * </head>
 * <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
 *   <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
 *     <div style="text-align: center; margin-bottom: 30px;">
 *       <img src="https://kroa.com/logo.png" alt="KROA" style="max-width: 150px;">
 *     </div>
 *
 *     <h1 style="color: #10B981; text-align: center;">Verificação de E-mail</h1>
 *
 *     <p>Olá!</p>
 *
 *     <p>Recebemos uma solicitação para verificar seu endereço de e-mail. Use o código abaixo para continuar:</p>
 *
 *     <div style="background-color: #f3f4f6; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
 *       <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">
 *         {{ params.VERIFICATION_CODE }}
 *       </div>
 *     </div>
 *
 *     <p>Este código é válido por 10 minutos.</p>
 *
 *     <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
 *       Se você não solicitou este código, por favor ignore este e-mail.
 *     </p>
 *
 *     <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
 *
 *     <p style="color: #9ca3af; font-size: 12px; text-align: center;">
 *       © 2025 KROA. Todos os direitos reservados.
 *     </p>
 *   </div>
 * </body>
 * </html>
 */

/**
 * Exemplo de uso no Express.js:
 *
 * app.post('/api/send-verification-email', async (req, res) => {
 *   try {
 *     const { email, code, template, language } = req.body;
 *
 *     // Validar dados
 *     if (!email || !code || !template || !language) {
 *       return res.status(400).json({ error: 'Missing required fields' });
 *     }
 *
 *     // Enviar email
 *     const result = await sendVerificationEmail({ email, code, template, language });
 *
 *     return res.json(result);
 *   } catch (error) {
 *     console.error('Error:', error);
 *     return res.status(500).json({ error: 'Failed to send email' });
 *   }
 * });
 */
