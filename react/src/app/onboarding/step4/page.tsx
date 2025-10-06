import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../OnboardingLayout';
import { Step4AdvancedSettings } from '../Step4AdvancedSettings';

export default function Step4Page() {
  const navigate = useNavigate();

  const handleNext = (data: {
    clinicName: string;
    customDomain: string;
    password: string;
    isEmailVerified: boolean;
  }) => {
    // Armazenar dados no sessionStorage
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    const updatedData = { ...onboardingData, ...data };
    sessionStorage.setItem('onboardingData', JSON.stringify(updatedData));

    // Navegar para próxima etapa (criação da conta)
    navigate('/onboarding/step5');
  };

  const handleBack = () => {
    navigate('/onboarding/step3');
  };

  const getUserData = () => {
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    return {
      email: onboardingData.email || '',
      isGoogleAuth: onboardingData.isGoogleAuth || false
    };
  };

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={5}
      showProgress={true}
    >
      <Step4AdvancedSettings
        onNext={handleNext}
        onBack={handleBack}
        userData={getUserData()}
      />
    </OnboardingLayout>
  );
}