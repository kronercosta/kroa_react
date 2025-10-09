# Padrão de Região e Idioma

Este documento define os padrões para uso de região e idioma no sistema de onboarding da Krooa.

## Conceitos Fundamentais

### Região vs Idioma
- **Região**: Define aspectos funcionais como moeda, conformidade legal e métodos de pagamento
- **Idioma**: Define apenas o idioma da interface do usuário

**⚠️ IMPORTANTE**: Região e idioma são completamente independentes. Um usuário pode estar na região BR (Brasil) e usar o idioma EN (inglês), ou estar na região US (Estados Unidos) e usar o idioma PT (português).

## Configuração

### Variáveis de Ambiente
```bash
# .env
VITE_CLINIC_REGION=BR  # ou US
```

### Chaves do localStorage
```javascript
// Armazenamento local
krooa_region    // 'BR' ou 'US'
krooa_language  // 'PT' ou 'EN'
```

## Implementação

### 1. Contexto de Região
```typescript
// src/contexts/RegionContext.tsx
const { currentRegion } = useRegion();
// currentRegion: 'BR' | 'US'
```

**Uso**: Para definir moeda, conformidade legal, métodos de pagamento

### 2. Sistema de Tradução
```typescript
// src/hooks/useTranslation.ts
const { t, currentLanguage } = useTranslation(translations);
// currentLanguage: 'PT' | 'EN'
```

**Uso**: Para textos da interface do usuário

## Padrões por Funcionalidade

### Moeda e Preços
```typescript
// ✅ CORRETO - Baseado na região
const currency = currentRegion === 'BR' ? 'R$' : '$';
const prices = currentRegion === 'BR' ? [149.90, 299.90, 599.90] : [49.00, 99.00, 199.00];

// ❌ INCORRETO - Baseado no idioma
const currency = currentLanguage === 'PT' ? 'R$' : '$';
```

### Conformidade Legal
```typescript
// ✅ CORRETO - Baseado na região
const complianceText = currentRegion === 'BR'
  ? t.step1.security.lgpdCompliant
  : t.step1.security.hipaaCompliant;

// ❌ INCORRETO - Hardcoded por idioma
const complianceText = currentLanguage === 'PT' ? 'LGPD' : 'HIPAA';
```

### Métodos de Pagamento
```typescript
// ✅ CORRETO - Baseado na região
{currentRegion === 'BR' && (
  <BoletoPaymentOption />
)}

// ❌ INCORRETO - Baseado no idioma
{currentLanguage === 'PT' && (
  <BoletoPaymentOption />
)}
```

### Máscaras e Validações
```typescript
// ✅ CORRETO - Baseado na região para padrão do país
<EnhancedInput
  mask="internationalPhone"
  defaultCountry={currentRegion}  // Define +55 para BR, +1 para US
  // ...
/>

// ❌ INCORRETO - Baseado no idioma
defaultCountry={currentLanguage === 'PT' ? 'BR' : 'US'}
```

## Estrutura de Traduções

### Arquivo translation.json
```json
{
  "PT": {
    "step1": {
      "title": "Vamos começar!",
      "security": {
        "lgpdCompliant": "LGPD Compliant",
        "hipaaCompliant": "HIPAA Compliant"
      }
    }
  },
  "EN": {
    "step1": {
      "title": "Let's get started!",
      "security": {
        "lgpdCompliant": "LGPD Compliant",
        "hipaaCompliant": "HIPAA Compliant"
      }
    }
  }
}
```

### Conteúdo por Região
Termos de conformidade devem estar disponíveis em ambos os idiomas:
- **Região BR**: Sempre mostrar conformidade LGPD (em PT ou EN)
- **Região US**: Sempre mostrar conformidade HIPAA (em PT ou EN)

## Casos de Uso Comuns

### Cenário 1: Região BR + Idioma PT
- ✅ Preços em R$
- ✅ Boleto disponível
- ✅ Conformidade LGPD
- ✅ Interface em português

### Cenário 2: Região BR + Idioma EN
- ✅ Preços em R$
- ✅ Boleto disponível
- ✅ Conformidade LGPD
- ✅ Interface em inglês

### Cenário 3: Região US + Idioma PT
- ✅ Preços em $
- ✅ Sem boleto
- ✅ Conformidade HIPAA
- ✅ Interface em português

### Cenário 4: Região US + Idioma EN
- ✅ Preços em $
- ✅ Sem boleto
- ✅ Conformidade HIPAA
- ✅ Interface em inglês

## Boas Práticas

### ✅ Faça
1. **Separe concerns**: Use região para funcionalidade, idioma para UI
2. **Teste todas combinações**: BR+PT, BR+EN, US+PT, US+EN
3. **Valide independência**: Mudança de idioma não deve afetar região
4. **Use contextos específicos**: `useRegion()` vs `useTranslation()`

### ❌ Não Faça
1. **Misturar região com idioma**: `currentLanguage === 'PT' ? 'BR' : 'US'`
2. **Assumir correlação**: PT = BR ou EN = US
3. **Hardcode baseado em idioma**: Preços ou conformidade por idioma
4. **Ignorar casos mistos**: Sempre considere BR+EN e US+PT

## Debugging

### Verificar Estado Atual
```javascript
console.log('Region:', useRegion().currentRegion);
console.log('Language:', useTranslation().currentLanguage);
console.log('LocalStorage Region:', localStorage.getItem('krooa_region'));
console.log('LocalStorage Language:', localStorage.getItem('krooa_language'));
```

### Problemas Comuns
1. **Preços em dólar para região BR**: Verificar se está usando `currentRegion` em vez de `currentLanguage`
2. **Conformidade errada**: Verificar se LGPD/HIPAA está baseado na região
3. **Boleto aparecendo para US**: Verificar condição `currentRegion === 'BR'`
4. **Idioma mudando região**: Verificar se contextos estão separados

## Manutenção

### Ao Adicionar Nova Funcionalidade
1. **Pergunte**: Isso depende da região (moeda, legal) ou idioma (UI)?
2. **Use o contexto correto**: `useRegion()` ou `useTranslation()`
3. **Teste todas combinações**: 4 cenários obrigatórios
4. **Documente exceções**: Se houver dependência entre região e idioma

### Ao Corrigir Bugs
1. **Identifique o concern**: Região ou idioma?
2. **Verifique o contexto usado**: Está correto?
3. **Teste cenários mistos**: BR+EN e US+PT
4. **Valide independência**: Mudança isolada não quebra nada?