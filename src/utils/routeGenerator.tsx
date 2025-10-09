import { lazy, type ReactElement } from 'react';

/**
 * Gera as rotas automaticamente baseadas na estrutura de pastas
 * Similar ao sistema de rotas do Next.js
 *
 * Estrutura esperada:
 * src/app/
 *   dashboard/
 *     page.tsx    -> /dashboard
 *   settings/
 *     user/
 *       page.tsx  -> /settings/user
 *
 * Nota: O layout é gerenciado pelos componentes PrivateRoutes e AppRouter
 */
export function generateRoutes() {
  const routes: Array<{ path: string; element: ReactElement }> = [];

  // Busca todos os arquivos page.tsx dentro de src/app/
  const pages = import.meta.glob('../app/**/page.tsx');

  for (const path in pages) {
    // Extrai o caminho da rota do caminho do arquivo
    // '../app/dashboard/page.tsx' -> '/dashboard'
    // '../app/settings/user/page.tsx' -> '/settings/user'
    const routePath = path
      .replace('../app', '')
      .replace('/page.tsx', '')
      || '/';

    console.log('📝 Criando rota:', routePath, 'do arquivo:', path);

    // Cria o componente lazy
    const Component = lazy(pages[path] as any);

    // Adiciona a rota sem Layout (gerenciado por PrivateRoutes)
    routes.push({
      path: routePath,
      element: <Component />,
    });
  }
  return routes;
}

/**
 * Helper para obter todas as rotas registradas
 */
export function getRegisteredRoutes() {
  const pages = import.meta.glob('../app/**/page.tsx');
  return Object.keys(pages).map(path =>
    path.replace('../app', '').replace('/page.tsx', '') || '/'
  );
}
