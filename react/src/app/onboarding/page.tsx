import React, { useState } from 'react';
import { OnboardingLayout } from './OnboardingLayout';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2Subscription } from './Step2Subscription';
import { Step3AdvancedSettings } from './Step3AdvancedSettings';
import { Step4AccountCreation } from './Step4AccountCreation';

interface OnboardingData {
  // Step 1
  name: string;
  email: string;
  phone: string;
  isGoogleAuth?: boolean;

  // Step 2
  selectedPlan: string;
  cardData: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
  };

  // Step 3
  clinicName: string;
  customDomain: string;
  password: string;
  isEmailVerified: boolean;
}

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});

  const totalSteps = 4;

  const handleStep1Complete = (data: {
    name: string;
    email: string;
    phone: string;
    isGoogleAuth?: boolean;
  }) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: {
    selectedPlan: string;
    cardData: {
      number: string;
      name: string;
      expiry: string;
      cvv: string;
    };
  }) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep3Complete = (data: {
    clinicName: string;
    customDomain: string;
    password: string;
    isEmailVerified: boolean;
  }) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    setCurrentStep(4);
  };

  const handleOnboardingComplete = () => {
    // Aqui você pode implementar a lógica para:
    // 1. Salvar todos os dados no backend
    // 2. Criar a conta efetivamente
    // 3. Redirecionar para o dashboard

    console.log('Onboarding completo:', onboardingData);

    // Simular redirecionamento
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 5000);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            onNext={handleStep1Complete}
            initialData={{
              name: onboardingData.name,
              email: onboardingData.email,
              phone: onboardingData.phone
            }}
          />
        );

      case 2:
        return (
          <Step2Subscription
            onNext={handleStep2Complete}
            onBack={goBack}
          />
        );

      case 3:
        return (
          <Step3AdvancedSettings
            onNext={handleStep3Complete}
            onBack={goBack}
            userData={{
              email: onboardingData.email || '',
              isGoogleAuth: onboardingData.isGoogleAuth
            }}
          />
        );

      case 4:
        return (
          <Step4AccountCreation
            onComplete={handleOnboardingComplete}
            accountData={{
              clinicName: onboardingData.clinicName || '',
              customDomain: onboardingData.customDomain || '',
              email: onboardingData.email || ''
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      showProgress={currentStep < 4}
    >
      {renderCurrentStep()}
    </OnboardingLayout>
  );
};

export default OnboardingFlow;