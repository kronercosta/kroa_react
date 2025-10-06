import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../OnboardingLayout';
import { Step2PlanSelection } from '../Step2PlanSelection';

export default function Step2Page() {
  const navigate = useNavigate();

  const handleNext = (data: {
    selectedPlan: string;
    couponCode?: string;
    termsAccepted: boolean;
    lgpdAccepted: boolean;
  }) => {
    // Armazenar dados no sessionStorage
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    const updatedData = { ...onboardingData, ...data };
    sessionStorage.setItem('onboardingData', JSON.stringify(updatedData));

    // Navegar para próxima etapa (pagamento)
    navigate('/onboarding/step3');
  };

  const handleBack = () => {
    navigate('/onboarding/step1');
  };

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={5}
      showProgress={true}
    >
      <Step2PlanSelection
        onNext={handleNext}
        onBack={handleBack}
      />
    </OnboardingLayout>
  );
}