import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../OnboardingLayout';
import { Step1BasicInfo } from '../Step1BasicInfo';

export default function Step1Page() {
  const navigate = useNavigate();

  const handleNext = (data: {
    name: string;
    email: string;
    phone: string;
    isGoogleAuth?: boolean;
  }) => {
    // Armazenar dados no sessionStorage para persistir entre rotas
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    const updatedData = { ...onboardingData, ...data };
    sessionStorage.setItem('onboardingData', JSON.stringify(updatedData));

    // Navegar para próxima etapa
    navigate('/onboarding/step2');
  };

  const getInitialData = () => {
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    return {
      name: onboardingData.name || '',
      email: onboardingData.email || '',
      phone: onboardingData.phone || ''
    };
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={5}
      showProgress={true}
    >
      <Step1BasicInfo
        onNext={handleNext}
        initialData={getInitialData()}
      />
    </OnboardingLayout>
  );
}