import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../OnboardingLayout';
import { Step3AdvancedSettings } from '../Step3AdvancedSettings';

export default function Step3Page() {
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

    // Navegar para próxima etapa
    navigate('/onboarding/step4');
  };

  const handleBack = () => {
    navigate('/onboarding/step2');
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
      currentStep={3}
      totalSteps={4}
      showProgress={true}
    >
      <Step3AdvancedSettings
        onNext={handleNext}
        onBack={handleBack}
        userData={getUserData()}
      />
    </OnboardingLayout>
  );
}