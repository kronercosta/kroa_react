import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../OnboardingLayout';
import { Step3Payment } from '../Step3Payment';

export default function Step3Page() {
  const navigate = useNavigate();

  const handleNext = (data: {
    cardData: {
      number: string;
      name: string;
      expiry: string;
      cvv: string;
    };
    paymentMethod: 'card' | 'google_pay' | 'stripe_link' | 'boleto';
  }) => {
    // Armazenar dados no sessionStorage
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    const updatedData = { ...onboardingData, ...data };
    sessionStorage.setItem('onboardingData', JSON.stringify(updatedData));

    // Navegar para próxima etapa (configurações avançadas)
    navigate('/onboarding/step4');
  };

  const handleBack = () => {
    navigate('/onboarding/step2');
  };

  const getPlanData = () => {
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    return {
      selectedPlan: onboardingData.selectedPlan || '',
      couponCode: onboardingData.couponCode
    };
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={5}
      showProgress={true}
    >
      <Step3Payment
        onNext={handleNext}
        onBack={handleBack}
        planData={getPlanData()}
      />
    </OnboardingLayout>
  );
}