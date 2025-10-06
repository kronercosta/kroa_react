import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../OnboardingLayout';
import { Step5AccountCreation } from '../Step5AccountCreation';

export default function Step5Page() {
  const navigate = useNavigate();

  const handleComplete = () => {
    // Limpar dados do sessionStorage após conclusão
    sessionStorage.removeItem('onboardingData');

    // Redirecionar para dashboard ou página principal
    navigate('/dashboard');
  };

  const getAccountData = () => {
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    return {
      clinicName: onboardingData.clinicName || '',
      customDomain: onboardingData.customDomain || '',
      email: onboardingData.email || ''
    };
  };

  return (
    <OnboardingLayout
      currentStep={5}
      totalSteps={5}
      showProgress={false} // Não mostrar progresso na última etapa
    >
      <Step5AccountCreation
        onComplete={handleComplete}
        accountData={getAccountData()}
      />
    </OnboardingLayout>
  );
}