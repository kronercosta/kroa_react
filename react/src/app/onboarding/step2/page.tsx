import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../OnboardingLayout';
import { Step2Subscription } from '../Step2Subscription';

export default function Step2Page() {
  const navigate = useNavigate();

  const handleNext = (data: {
    selectedPlan: string;
    cardData: {
      number: string;
      name: string;
      expiry: string;
      cvv: string;
    };
  }) => {
    // Armazenar dados no sessionStorage
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    const updatedData = { ...onboardingData, ...data };
    sessionStorage.setItem('onboardingData', JSON.stringify(updatedData));

    // Navegar para próxima etapa
    navigate('/onboarding/step3');
  };

  const handleBack = () => {
    navigate('/onboarding/step1');
  };

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={4}
      showProgress={true}
    >
      <Step2Subscription
        onNext={handleNext}
        onBack={handleBack}
      />
    </OnboardingLayout>
  );
}