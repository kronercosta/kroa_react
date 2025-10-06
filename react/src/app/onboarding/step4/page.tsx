import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../OnboardingLayout';
import { Step4AccountCreation } from '../Step4AccountCreation';

export default function Step4Page() {
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
      currentStep={4}
      totalSteps={4}
      showProgress={false} // Não mostrar progresso na última etapa
    >
      <Step4AccountCreation
        onComplete={handleComplete}
        accountData={getAccountData()}
      />
    </OnboardingLayout>
  );
}