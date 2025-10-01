# Sistema de Rotas Baseado em Arquivos (Automático)

Este sistema funciona **EXATAMENTE** como o Next.js, onde cada pasta representa uma rota automaticamente.

## 📁 Estrutura

```
src/app/
  dashboard/
    page.tsx        # Rota: /dashboard (automática)
  pacientes/
    page.tsx        # Rota: /pacientes (automática)
  configuracoes/
    usuario/
      page.tsx      # Rota: /configuracoes/usuario (automática)
```

## 🚀 Como Adicionar uma Nova Rota (SUPER SIMPLES!)

### 1. Criar a pasta e o arquivo

Para criar uma rota `/exemplo`:

```bash
mkdir src/app/exemplo
```

### 2. Criar o arquivo `page.tsx`

Crie o arquivo `src/app/exemplo/page.tsx`:

```tsx
import React from 'react';

const Exemplo: React.FC = () => {
  return (
    <div>
      <h1>Minha Página de Exemplo</h1>
      <p>Conteúdo da página</p>
    </div>
  );
};

export default Exemplo;
```

### 3. PRONTO! ✨

**NÃO PRECISA FAZER MAIS NADA!** A rota `/exemplo` já está disponível automaticamente!

Acesse `http://localhost:5175/exemplo`

**Notas:**
- ✅ Layout é adicionado automaticamente
- ✅ Lazy loading automático
- ✅ Não precisa registrar em lugar nenhum

## 🎨 Layout

Todas as páginas em `src/app/` recebem o Layout automaticamente (com navegação e sidebar).

Se precisar de uma página SEM layout (como login), coloque em `src/pages/` e registre manualmente no `App.tsx`.

## 📝 Rotas Aninhadas

Para criar uma rota como `/configuracoes/usuario`:

```bash
mkdir -p src/app/configuracoes/usuario
```

Crie o arquivo `src/app/configuracoes/usuario/page.tsx` e pronto! A rota `/configuracoes/usuario` estará disponível automaticamente.

## ✅ Vantagens

- ✨ Organização clara por pasta
- 📦 Code splitting automático (lazy loading)
- 🔄 Fácil manutenção
- 🚀 Similar ao Next.js

## 🔄 Migração Gradual

As rotas antigas em `src/pages/` continuam funcionando. Estamos migrando gradualmente para o novo sistema.

Rotas já migradas:
- ✅ `/dashboard` → `src/app/dashboard/page.tsx`
