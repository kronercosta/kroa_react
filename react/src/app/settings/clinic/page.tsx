import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfigClinicaIndex = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona automaticamente para a aba de conta
    navigate('/settings/clinic/account', { replace: true });
  }, [navigate]);

  return null;
};

export default ConfigClinicaIndex;
