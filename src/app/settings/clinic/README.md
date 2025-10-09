# Configurações da Clínica - Estrutura Modular

As configurações da clínica foram divididas em 4 seções independentes, cada uma com sua própria rota.

## 📁 Estrutura de Rotas

```
/configuracoes/clinica/
├── conta/page.tsx              → /configuracoes/clinica/conta
├── cadeiras/page.tsx           → /configuracoes/clinica/cadeiras
├── centro-custo/page.tsx       → /configuracoes/clinica/centro-custo
├── parametros/page.tsx         → /configuracoes/clinica/parametros
├── page.tsx                    → Redireciona para /conta
└── _old_page.tsx              → Arquivo original (backup)
```

## 🎯 Rotas Disponíveis

### 1. **Conta** - `/configuracoes/clinica/conta`
Gerenciamento dos dados da empresa:
- Razão Social
- Nome Fantasia
- CNPJ
- Endereço completo
- Contatos

### 2. **Cadeiras** - `/configuracoes/clinica/cadeiras`
Gestão das cadeiras odontológicas:
- Lista de cadeiras
- Status (Ativa, Em Manutenção, Inativa)
- Adicionar/Editar/Remover cadeiras
- Associação com salas

### 3. **Centro de Custo** - `/configuracoes/clinica/centro-custo`
Gerenciamento de centros de custo:
- Lista de centros
- Códigos e descrições
- Adicionar/Editar/Remover centros

### 4. **Parâmetros** - `/configuracoes/clinica/parametros`
Configurações gerais da clínica:
- Fuso horário
- Idioma e moeda
- Funcionalidades (Múltiplas Unidades, Centro de Custo)
- Agendamento online
- Confirmação automática

## 🧭 Navegação

Todas as páginas incluem o componente `<ClinicaTabs />` que fornece:
- Navegação entre as seções
- Indicador visual da aba ativa
- Ícones para cada seção
- Responsivo

## 🔧 Como Adicionar Nova Seção

1. Criar pasta: `src/app/configuracoes/clinica/nova-secao/`
2. Criar arquivo: `page.tsx`
3. Adicionar ao `ClinicaTabs.tsx`:

```tsx
{
  id: 'nova-secao',
  label: 'Nova Seção',
  icon: 'mdi:icon-name',
  path: '/configuracoes/clinica/nova-secao',
}
```

## ✨ Benefícios

- ✅ **Modular**: Cada seção é independente
- ✅ **Manutenível**: Código organizado e fácil de encontrar
- ✅ **URLs limpas**: Cada seção tem sua própria URL
- ✅ **Navegável**: Uso de URLs permite navegação direta
- ✅ **Escalável**: Fácil adicionar novas seções

## 📝 Notas

- O arquivo `_old_page.tsx` é o backup da versão anterior (2467 linhas)
- As páginas atuais são versões simplificadas e funcionais
- O conteúdo detalhado pode ser migrado gradualmente do arquivo antigo
