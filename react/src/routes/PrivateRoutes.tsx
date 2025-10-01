import { Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

interface PrivateRoutesProps {
  isAuthenticated?: boolean;
}

export function PrivateRoutes({ isAuthenticated = true }: PrivateRoutesProps) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
