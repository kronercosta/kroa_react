# EmailVerification Component

Componente reutilizável para verificação de e-mail com código de 6 dígitos.

## Características

- ✅ 6 inputs individuais para cada dígito
- ✅ Auto-focus entre campos
- ✅ Suporte a paste (colar código completo)
- ✅ Navegação com teclado (setas, backspace, enter)
- ✅ Auto-verificação ao preencher todos os campos
- ✅ Contador de tentativas
- ✅ Cooldown para reenvio de código
- ✅ Estados de loading e erro
- ✅ Suporte a múltiplos idiomas (PT, EN, ES)
- ✅ Integração com Brevo para envio de emails

## Uso Básico

```tsx
import { EmailVerification } from '../../../components/ui/EmailVerification';

function MyComponent() {
  const [step, setStep] = useState('input-email');

  const handleEmailVerified = () => {
    console.log('Email verificado!');
    setStep('next-step');
  };

  return (
    <div>
      {step === 'verify-email' && (
        <EmailVerification
          email="usuario@example.com"
          onVerified={handleEmailVerified}
          language="pt"
        />
      )}
    </div>
  );
}
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `email` | `string` | **Obrigatório** | E-mail para enviar o código de verificação |
| `onVerified` | `() => void` | **Obrigatório** | Callback chamado quando o código é verificado com sucesso |
| `onCancel` | `() => void` | `undefined` | Callback chamado quando o usuário cancela ou atinge máximo de tentativas |
| `language` | `'pt' \| 'en' \| 'es'` | `'pt'` | Idioma da interface |
| `templateType` | `string` | `'email-verification'` | Tipo de template do Brevo a ser usado |
| `maxAttempts` | `number` | `3` | Número máximo de tentativas de verificação |
| `cooldownSeconds` | `number` | `60` | Tempo de espera (em segundos) para reenviar código |
| `autoVerify` | `boolean` | `true` | Auto-verificar ao preencher todos os campos |

## Exemplos de Uso

### Verificação de E-mail no Onboarding

```tsx
import { EmailVerification } from '../../../components/ui/EmailVerification';

function OnboardingStep1() {
  const [authStep, setAuthStep] = useState<'auth' | 'verify-email' | 'complete-data'>('auth');

  return (
    <>
      {authStep === 'verify-email' && (
        <EmailVerification
          email={formData.email}
          onVerified={() => setAuthStep('complete-data')}
          onCancel={() => setAuthStep('auth')}
          language="pt"
          templateType="email-verification"
        />
      )}
    </>
  );
}
```

### Recuperação de Senha

```tsx
import { EmailVerification } from '../../../components/ui/EmailVerification';

function ForgotPassword() {
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');

  return (
    <>
      {step === 'verify' && (
        <EmailVerification
          email={email}
          onVerified={() => setStep('reset')}
          onCancel={() => setStep('email')}
          language="pt"
          templateType="password-reset"
          maxAttempts={5}
          cooldownSeconds={30}
        />
      )}
    </>
  );
}
```

### Login com Verificação em Dois Fatores

```tsx
import { EmailVerification } from '../../../components/ui/EmailVerification';

function TwoFactorLogin() {
  const navigate = useNavigate();

  return (
    <EmailVerification
      email={user.email}
      onVerified={() => navigate('/dashboard')}
      language="en"
      templateType="login-verification"
      maxAttempts={3}
      autoVerify={true}
    />
  );
}
```

## Integração com Backend

O componente faz uma chamada para `/api/send-verification-email`. Exemplo de implementação no backend:

### Express.js + Brevo

```typescript
import * as SibApiV3Sdk from '@sendinblue/client';

app.post('/api/send-verification-email', async (req, res) => {
  try {
    const { email, code, template, language } = req.body;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.templateId = getTemplateId(template, language);
    sendSmtpEmail.params = { VERIFICATION_CODE: code };
    sendSmtpEmail.sender = {
      name: 'KROA',
      email: 'noreply@kroa.com'
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});
```

## Templates de Email (Brevo)

Crie templates no Brevo para cada idioma e tipo de verificação:

### Template IDs Sugeridos

```typescript
const templateIds = {
  'email-verification': { pt: 1, en: 2, es: 3 },
  'password-reset': { pt: 4, en: 5, es: 6 },
  'login-verification': { pt: 7, en: 8, es: 9 }
};
```

### Parâmetros do Template

Use `{{ params.VERIFICATION_CODE }}` no HTML do template do Brevo:

```html
<div style="font-size: 36px; font-weight: bold; letter-spacing: 8px;">
  {{ params.VERIFICATION_CODE }}
</div>
```

## Modo de Teste

Se a API falhar, o componente automaticamente usa um código de teste (`123456`) para permitir testes locais.

## Armazenamento Temporário

O componente usa `sessionStorage` para armazenar temporariamente:
- `verificationCode_{email}`: O código gerado
- `verificationEmail`: O email para verificação
- `verificationCodeExpiry`: Timestamp de expiração (10 minutos)

⚠️ **Atenção**: Em produção, o código deve ser armazenado e validado no backend.

## Segurança

- Código expira em 10 minutos
- Máximo de tentativas configurável
- Cooldown para reenvio
- Validação de email no cliente e servidor

## Personalização

### Estilos

O componente usa classes Tailwind CSS. Personalize as cores editando:
- `border-krooa-blue`: Cor da borda em foco
- `focus:ring-krooa-blue/20`: Cor do ring de foco
- `bg-blue-50`: Cor de fundo do container

### Traduções

Adicione novos idiomas editando o objeto `translations` no componente.

## Exemplo Completo

Veja o arquivo `src/api/send-verification-email.example.ts` para um exemplo completo de integração com backend.
