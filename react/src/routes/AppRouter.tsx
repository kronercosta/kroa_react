import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { PrivateRoutes } from './PrivateRoutes';
import { AuthLayout } from '../layouts/AuthLayout';
import { generateRoutes } from '../utils/routeGenerator';

// Páginas de autenticação
const Login = lazy(() => import('../pages/Login'));
const EsqueceuSenha = lazy(() => import('../pages/EsqueceuSenha'));

// Loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-krooa-green"></div>
  </div>
);

export function AppRouter() {
  // Gera as rotas automaticamente baseadas na estrutura de pastas
  const fileBasedRoutes = generateRoutes();

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

        {/* Rotas Privadas (com MainLayout) */}
        <Route element={<PrivateRoutes />}>
          {fileBasedRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
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
