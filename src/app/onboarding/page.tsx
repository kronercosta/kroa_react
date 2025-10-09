import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar automaticamente para a primeira etapa
    navigate('/onboarding/step1', { replace: true });
  }, [navigate]);

  // Retornar null ou um loading spinner enquanto redireciona
  return (
    <div className="min-h-screen bg-gradient-to-br from-krooa-green/10 via-blue-50 to-krooa-blue/10 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-krooa-green border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}