# Sistema de Navegação

A navegação é gerenciada por um **array simples** no arquivo `Navigation.tsx`.

## 🎯 Como Adicionar/Editar Itens do Menu

Edite o array `navItems` em `src/components/Navigation.tsx`:

```tsx
const navItems: NavItem[] = [
  {
    title: 'Nome do Item',
    url: '/rota',
    icon: 'mdi:icon-name',
    badge: 'Opcional', // Badge opcional
  },
];
```

### Exemplo prático:

```tsx
{
  title: 'Relatórios',
  url: '/relatorios',
  icon: 'mdi:chart-bar',
},
```

## 🎨 Ícones com Iconify

Usamos [Iconify](https://icon-sets.iconify.design/) para os ícones.

### Como encontrar ícones:

1. Acesse: https://icon-sets.iconify.design/
2. Busque o ícone desejado (ex: "calendar")
3. Copie o nome (ex: `mdi:calendar-outline`)
4. Cole no campo `icon`

### Coleções recomendadas:

- **Material Design Icons (mdi:)** - Mais usada, moderna
- **Heroicons (heroicons:)** - Simples e limpa
- **Tabler Icons (tabler:)** - Consistente e profissional

### Exemplos de ícones úteis:

```tsx
// Dashboard
'mdi:view-dashboard-outline'
'mdi:home-outline'

// Usuários/Pacientes
'mdi:account-group-outline'
'mdi:account-outline'

// Calendário/Agenda
'mdi:calendar-outline'
'mdi:calendar-clock-outline'

// Financeiro
'mdi:currency-usd'
'mdi:cash-multiple'
'mdi:chart-line'

// Comunicação
'mdi:message-text-outline'
'mdi:chat-outline'
'mdi:email-outline'

// Configurações
'mdi:cog-outline'
'mdi:settings-outline'

// Relatórios
'mdi:chart-bar'
'mdi:file-document-outline'
```

## ✨ Features Automáticas

O sistema já inclui:

- ✅ Detecção automática de rota ativa (highlight verde)
- ✅ Tooltip ao passar o mouse (sidebar fechada)
- ✅ Badge opcional com animação pulsante
- ✅ Transições suaves
- ✅ Responsivo

## 📝 Estrutura do Item

```tsx
interface NavItem {
  title: string;   // Texto exibido
  url: string;     // Rota (ex: '/dashboard')
  icon: string;    // Ícone do Iconify (ex: 'mdi:home')
  badge?: string;  // Badge opcional (ex: 'Novo', 'Ativo')
}
```

## 🚀 Exemplo Completo

```tsx
const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'mdi:view-dashboard-outline',
  },
  {
    title: 'Pacientes',
    url: '/pacientes',
    icon: 'mdi:account-group-outline',
  },
  {
    title: 'Relatórios',
    url: '/relatorios',
    icon: 'mdi:chart-bar',
    badge: 'Novo',
  },
];
```

É só isso! O menu atualiza automaticamente. 🎉
