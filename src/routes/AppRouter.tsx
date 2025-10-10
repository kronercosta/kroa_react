import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { PrivateRoutes } from './PrivateRoutes';
import { AuthLayout } from '../layouts/AuthLayout';
import { generateRoutes } from '../utils/routeGenerator';

// Páginas de autenticação
const Login = lazy(() => import('../pages/Login'));
const EsqueceuSenha = lazy(() => import('../pages/EsqueceuSenha'));
const PrimeiroAcesso = lazy(() => import('../pages/PrimeiroAcesso'));

// Páginas de Pacientes
const PatientsPage = lazy(() => import('../app/patients/page'));
const PatientsSummary = lazy(() => import('../app/patients/summary/page'));
const PatientsPersonalData = lazy(() => import('../app/patients/personal-data/page'));

// Loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-krooa-green"></div>
  </div>
);

export function AppRouter() {
  // Gera as rotas automaticamente baseadas na estrutura de pastas
  const fileBasedRoutes = generateRoutes();

  // Separa rotas públicas (onboarding) das privadas
  const publicRoutes = fileBasedRoutes.filter(route => route.path.startsWith('/onboarding'));
  const privateRoutes = fileBasedRoutes.filter(route => !route.path.startsWith('/onboarding'));

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Rotas de Autenticação (sem layout privado) */}
        <Route path="/login" element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        } />
        <Route path="/esqueceu-senha" element={
          <AuthLayout>
            <EsqueceuSenha />
          </AuthLayout>
        } />
        <Route path="/primeiro-acesso" element={
          <AuthLayout>
            <PrimeiroAcesso />
          </AuthLayout>
        } />

        {/* Rotas Públicas do Onboarding (sem autenticação) */}
        {publicRoutes.map((route, index) => (
          <Route key={`public-${index}`} path={route.path} element={route.element} />
        ))}

        {/* Rotas Privadas (com MainLayout) */}
        <Route element={<PrivateRoutes />}>
          {/* Outras rotas privadas */}
          {privateRoutes.map((route, index) => (
            <Route key={`private-${index}`} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Redirect inicial */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Rota 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
