# Plano: Arquitetura Modular de i18n (Locales por Módulo)

## Contexto

O site "The Odd Life of Adulthood" tem todas as strings de UI hardcoded nos componentes React. O Victor quer preparar uma arquitetura de i18n modular (locales separados por feature/módulo, como usa na empresa dele) para:

1. **Suportar layouts gerados por AI** — se o layout usa `t('home.hero.title')` em vez de texto hardcoded, ele pode ser regenerado por AI sem perder as traduções
2. **Escalar para múltiplos idiomas no futuro** — adicionar um idioma é criar uma pasta nova com JSONs
3. **Organização limpa** — cada módulo tem seu arquivo de locale, fácil de manter

**Decisões já tomadas:**

- Idioma default: **pt-BR** (site será traduzido para português)
- Troca de idioma: **backlog** — só monta a arquitetura, sem toggle ou language switching por agora
- Complementa o plano existente de separação de conteúdo (`docs/plano-separar-conteudo-layout.md`) — dados dos comics ficam em `content/`, strings de UI ficam em `locales/`

---

## Abordagem: i18n Leve e Custom (Sem Biblioteca)

Solução custom com ~80 linhas de código em vez de react-i18next (~40KB). Para um site com ~100-150 strings e 1-2 idiomas, é mais que suficiente. Se precisar de pluralização complexa ou 5+ idiomas no futuro, migrar para react-i18next é direto porque a estrutura de JSONs e o padrão `t('key')` são os mesmos.

---

## Estrutura de Arquivos

```
locales/                          # Fora de src/ (dado, não código)
  pt-BR/
    common.json                   # nav, footer, botões genéricos, erros
    home.json                     # hero, marquee, seções da home
    comics.json                   # archive + detail page
    about.json                    # página sobre
    contact.json                  # formulário, labels, validação
  en/                             # Vazio por agora, preenchido quando implementar i18n switching
    common.json                   # (placeholder com mesma estrutura, valores em inglês)

src/
  i18n/
    index.ts                      # API pública: exporta useTranslation, I18nProvider
    context.tsx                   # React context + provider (segue padrão do ThemeProvider)
    load-locale.ts                # import.meta.glob para carregar JSONs do locale
    keys.d.ts                     # Tipo auto-gerado com todas as chaves de tradução

scripts/
  generate-i18n-types.ts          # Lê pt-BR/*.json e gera keys.d.ts
  validate-locales.ts             # Valida paridade de chaves entre locales
```

### Formato dos JSONs — Chaves Flat com Dot Notation

```json
// locales/pt-BR/common.json
{
  "nav.home": "Início",
  "nav.comics": "Quadrinhos",
  "nav.about": "Sobre",
  "nav.contact": "Contato",
  "footer.tagline": "Um catálogo independente de webcomics.",
  "footer.copyright": "© {year} Inkwell — Todos os direitos reservados."
}
```

```json
// locales/pt-BR/home.json
{
  "hero.title": "Bem-vindo ao Inkwell",
  "hero.subtitle": "Pixels impressos, semanalmente.",
  "marquee.newStrip": "Nova tirinha toda sexta-feira",
  "feed.title": "Últimas tirinhas",
  "feed.noResults": "Nenhum resultado encontrado.",
  "feed.entries": "{count} registros"
}
```

Chaves flat (não nested) porque: mais fácil de grep, type generation simples, e AI pode referenciar `t('home.hero.title')` como string literal.

Interpolação simples com `{var}` — o `t()` faz replace de `{year}`, `{count}`, etc.

---

## Implementação Core

### `src/i18n/load-locale.ts`

- Usa `import.meta.glob('../../locales/**/*.json', { eager: true })` para carregar os JSONs em build time
- Filtra pelo locale atual (hardcoded `pt-BR` por agora)
- Merge todos os módulos em um único `Record<string, string>` flat
- Exporta `loadMessages(locale: string)`

### `src/i18n/context.tsx`

- `I18nProvider` com React context (mesmo padrão do `ThemeProvider.tsx` existente)
- Expõe `t(key, vars?)` — lookup no record + replace de `{var}`
- Expõe `locale` (readonly por agora)
- Hook `useTranslation()` retorna `{ t, locale }`

### `src/i18n/index.ts`

```typescript
export { I18nProvider, useTranslation } from './context';
export type { TranslationKey } from './keys';
```

### `scripts/generate-i18n-types.ts`

- Lê todos os JSONs em `locales/pt-BR/`
- Extrai todas as chaves
- Gera `src/i18n/keys.d.ts` com union type `TranslationKey`
- Resultado: `t('chave.invalida')` dá erro de TypeScript

---

## Steps de Implementação

### Step 1: Criar estrutura de locales e popular pt-BR

- Criar `locales/pt-BR/common.json` — extrair strings de `SiteHeader.tsx`, `SiteFooter.tsx`, `__root.tsx`
- Criar `locales/pt-BR/home.json` — extrair de `index.tsx`
- Criar `locales/pt-BR/comics.json` — extrair de `comics.tsx` e `comics.$slug.tsx`
- Criar `locales/pt-BR/about.json` — extrair de `about.tsx`
- Criar `locales/pt-BR/contact.json` — extrair de `contact.tsx`
- Criar `locales/en/` com placeholders (mesmas chaves, valores em inglês atual)

### Step 2: Script de geração de tipos

- Criar `scripts/generate-i18n-types.ts`
- Adicionar script `"i18n:types"` no `package.json`
- Encadear nos scripts `dev` e `build`

### Step 3: Core i18n (`src/i18n/`)

- Criar `load-locale.ts` com `import.meta.glob`
- Criar `context.tsx` com `I18nProvider` e `useTranslation`
- Criar `index.ts` com exports públicos

### Step 4: Integrar no app shell

- Modificar `src/routes/__root.tsx` — wrappear com `I18nProvider`
- Setar `<html lang="pt-BR">`

### Step 5: Migrar componentes (incremental)

- `SiteHeader.tsx` — navItems usam `t('nav.home')` etc.
- `SiteFooter.tsx` — tagline, copyright, seção headers
- `index.tsx` — hero, marquee, feed section
- `comics.tsx` — archive headers, filtros
- `comics.$slug.tsx` — labels, navegação, comments
- `Sidebar.tsx` — placeholder de busca, labels
- `ComicCard.tsx` — labels
- `about.tsx` — conteúdo da página
- `contact.tsx` — form labels, validação

### Step 6: Script de validação de paridade de locales

- Criar `scripts/validate-locales.ts` — lê todos os JSONs de `locales/pt-BR/` (locale de referência) e compara com cada outro locale (`en/`, e futuros)
- Para cada locale secundário, verifica:
  - **Chaves faltando** — existem em pt-BR mas não no locale alvo
  - **Chaves sobrando** — existem no locale alvo mas não em pt-BR (possível lixo)
  - **Módulos faltando** — arquivo JSON existe em pt-BR mas não no locale alvo
- O script retorna exit code 1 se houver diferença (falha na CI)
- Adicionar script `"i18n:validate"` no `package.json`
- Integrar na pipeline de CI para rodar em todo PR — garante que nenhuma tradução fique pra trás quando alguém adicionar uma chave nova em pt-BR

### Step 7: Limpeza

- Confirmar que nenhuma string de UI está hardcoded nos componentes
- Rodar build para verificar types

---

## Interação com Plano de Separação de Conteúdo

Os dois planos são **complementares e independentes** — podem ser implementados em qualquer ordem:

| Camada            | Onde vive                         | O que contém                                    |
| ----------------- | --------------------------------- | ----------------------------------------------- |
| Conteúdo (comics) | `content/comics/`                 | Títulos, excerpts, tags, imagens dos quadrinhos |
| Strings de UI     | `locales/`                        | Labels, botões, textos de navegação, mensagens  |
| Layout            | `src/routes/` + `src/components/` | Componentes React (regeneráveis por AI)         |

O `t()` é **só para UI**. Dados dos comics passam direto do content loader.

---

## Arquivos Críticos a Modificar

| Arquivo                         | Ação                                                                    |
| ------------------------------- | ----------------------------------------------------------------------- |
| `src/routes/__root.tsx`         | Adicionar `I18nProvider`, setar `lang="pt-BR"`                          |
| `src/components/SiteHeader.tsx` | Migrar navItems para `t()`                                              |
| `src/components/SiteFooter.tsx` | Migrar strings para `t()`                                               |
| `src/routes/index.tsx`          | Migrar hero, marquee, feed strings                                      |
| `src/routes/comics.tsx`         | Migrar headers e filtros                                                |
| `src/routes/comics.$slug.tsx`   | Migrar labels e navegação                                               |
| `src/routes/about.tsx`          | Migrar conteúdo                                                         |
| `src/routes/contact.tsx`        | Migrar form labels                                                      |
| `src/components/Sidebar.tsx`    | Migrar labels                                                           |
| `src/components/ComicCard.tsx`  | Migrar labels                                                           |
| `package.json`                  | Adicionar scripts `i18n:types` e `i18n:validate`, encadear em dev/build |

### Arquivos Novos

| Arquivo                             | Propósito                                  |
| ----------------------------------- | ------------------------------------------ |
| `locales/pt-BR/*.json` (5 arquivos) | Strings de UI em português                 |
| `locales/en/*.json` (5 arquivos)    | Placeholders em inglês                     |
| `src/i18n/context.tsx`              | Provider + hook (baseado no ThemeProvider) |
| `src/i18n/load-locale.ts`           | Loader com import.meta.glob                |
| `src/i18n/index.ts`                 | Exports públicos                           |
| `src/i18n/keys.d.ts`                | Tipo auto-gerado                           |
| `scripts/generate-i18n-types.ts`    | Script de geração de tipos                 |
| `scripts/validate-locales.ts`       | Validação de paridade entre locales (CI)   |

---

## Verificação

1. `npm run dev` — site renderiza normalmente com todas as strings vindas dos locales
2. Strings aparecem em português (pt-BR)
3. TypeScript compila sem erros — `t('chave.invalida')` dá erro
4. `npm run build` — build de produção funciona
5. Nenhuma string de UI hardcoded restante nos componentes (grep por strings em português/inglês nos .tsx)
6. Adicionar um novo módulo de locale é só criar um JSON novo em `locales/pt-BR/`
7. `npm run i18n:validate` — passa sem erros (paridade entre pt-BR e en)
8. Remover uma chave de `en/` e rodar validate — deve falhar (prova que a validação funciona)
