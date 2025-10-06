import { useNavigate } from 'react-router-dom';
import { WelcomeFirstExperience } from '../WelcomeFirstExperience';

export default function FirstExperiencePage() {
  const navigate = useNavigate();

  const handleNext = (data: {
    wantsGuidedTour: boolean;
    dataMigration: 'yes' | 'no' | 'later';
    currentStage: number;
  }) => {
    // Armazenar dados da primeira experiência no sessionStorage
    const firstExperienceData = {
      ...data,
      completedFirstExperience: true,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('firstExperienceData', JSON.stringify(firstExperienceData));

    // Se escolheu migração de dados, redireciona para página específica
    if (data.dataMigration === 'yes') {
      // TODO: Criar página de solicitação de migração
      alert('Funcionalidade de migração será implementada em breve. Prosseguindo com o onboarding normal.');
    }

    // Redirecionar para o onboarding normal
    navigate('/onboarding/step1');
  };

  const handleSkip = () => {
    // Marcar que pulou a primeira experiência
    const skipData = {
      wantsGuidedTour: false,
      dataMigration: 'later' as const,
      currentStage: 1,
      completedFirstExperience: false,
      skipped: true,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('firstExperienceData', JSON.stringify(skipData));

    // Ir direto para o onboarding
    navigate('/onboarding/step1');
  };

  return (
    <WelcomeFirstExperience
      onNext={handleNext}
      onSkip={handleSkip}
    />
  );
}