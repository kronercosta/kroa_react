import { useNavigate } from 'react-router-dom';
import { LandingEntry } from '../LandingEntry';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartOnboarding = () => {
    // Limpar dados anteriores do sessionStorage
    sessionStorage.removeItem('onboardingData');

    // Navegar para primeira etapa
    navigate('/onboarding/step1');
  };

  return <LandingEntry onStartOnboarding={handleStartOnboarding} />;
}