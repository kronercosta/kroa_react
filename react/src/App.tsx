import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { Layout } from './components/Layout';
import { ClinicProvider } from './contexts/ClinicContext';
import { RegionProvider } from './contexts/RegionContext';

// Páginas - Lazy loading para melhor performance
const Login = lazy(() => import('./pages/Login'));
const EsqueceuSenha = lazy(() => import('./pages/EsqueceuSenha'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Components = lazy(() => import('./pages/Components'));
const ConfigClinica = lazy(() => import('./pages/ConfigClinica'));
const ConfigColaborador = lazy(() => import('./pages/ConfigColaborador'));
const NovaCadeira = lazy(() => import('./pages/NovaCadeira'));

// Páginas placeholder para as rotas da navegação
const Agenda = () => (
  <Layout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
        <p className="mt-1 text-sm text-gray-600">Sistema de agendamento em desenvolvimento...</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Em breve: Sistema completo de agendamento de consultas</p>
      </div>
    </div>
  </Layout>
);

const Pacientes = () => (
  <Layout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
        <p className="mt-1 text-sm text-gray-600">Gestão de pacientes em desenvolvimento...</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Em breve: Sistema completo de gestão de pacientes</p>
      </div>
    </div>
  </Layout>
);

const Financeiro = () => (
  <Layout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
        <p className="mt-1 text-sm text-gray-600">Sistema financeiro em desenvolvimento...</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Em breve: Sistema completo de gestão financeira</p>
      </div>
    </div>
  </Layout>
);

const CRM = () => (
  <Layout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
        <p className="mt-1 text-sm text-gray-600">Sistema de CRM em desenvolvimento...</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Em breve: Sistema completo de CRM</p>
      </div>
    </div>
  </Layout>
);


// Loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-krooa-green"></div>
  </div>
);

function App() {
  return (
    <RegionProvider>
      <ClinicProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
            {/* Rotas de Autenticação */}
            <Route path="/login" element={<Login />} />
            <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />

            {/* Rotas principais */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/components" element={<Components />} />
            <Route path="/configuracoes/clinica" element={
              <Layout>
                <ConfigClinica />
              </Layout>
            } />
            <Route path="/configuracoes/colaborador" element={
              <Layout>
                <ConfigColaborador />
              </Layout>
            } />
            <Route path="/nova-cadeira" element={
              <Layout>
                <NovaCadeira />
              </Layout>
            } />

            {/* Rota 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ClinicProvider>
    </RegionProvider>
  );
}

export default App;