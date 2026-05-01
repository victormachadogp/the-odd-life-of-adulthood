# Plano: Separar Conteúdo do Layout

## Contexto

O site "The Odd Life of Adulthood" foi criado com Lovable e todo conteúdo dos quadrinhos está hardcoded em TypeScript (`src/data/comics.ts`). O objetivo é tornar o conteúdo **portável e independente do framework** — se o layout mudar no futuro, basta pegar a pasta de conteúdo e plugar no novo projeto.

---

## Estrutura do Conteúdo

Criar uma pasta `content/` na raiz do projeto (fora de `src/`). Esta é a unidade portável:

```
content/
  comic.schema.json          # Schema JSON para validação + autocomplete
  comics/
    an-honest-break-coffee/
      comic.json
      pages/
        01.jpg
    a-flower-on-the-moon/
      comic.json
      pages/
        01.jpg
    dragon-bakes-cookies/
      comic.json
      pages/
        01.jpg
    shared-earbuds-at-sunset/
      comic.json
      pages/
        01.jpg
```

Cada quadrinho pode ter múltiplas páginas/painéis em `pages/` (01.jpg, 02.jpg, 03.jpg...). A **primeira página serve como capa/thumbnail** nas listagens.

**Por que uma pasta por quadrinho:** imagens e metadados ficam juntos, slug é o nome da pasta (sem duplicatas), escala bem, sem conflitos de merge.

**Por que JSON (não YAML):** zero dependências, portável pra qualquer linguagem, sem bugs de indentação.

---

## Formato do `comic.json`

```json
{
  "$schema": "../../comic.schema.json",
  "title": "An Honest Break for Coffee",
  "type": "comic",
  "date": "2026-04-22",
  "excerpt": "A sleepy cat discovers the bittersweet truth about caffeine.",
  "pages": ["pages/01.jpg", "pages/02.jpg", "pages/03.jpg"],
  "tags": ["slice-of-life", "cats", "mornings"],
  "readingTime": "2 min"
}
```

- `type` é opcional — `"comic"` (padrão, pode omitir) ou `"art"` (arte avulsa: imagem única, sem múltiplos painéis). O layout usa esse campo para renderização e filtros diferentes
- `pages` é um array ordenado de imagens — a **primeira é a capa/thumbnail**
- Datas em ISO 8601 (`YYYY-MM-DD`) — formatação é responsabilidade do layout
- Paths relativos dentro da mesma pasta do quadrinho
- Sem campo `slug` — o slug é o nome da pasta

---

## Imagens

- Imagens ficam em `content/comics/<slug>/pages/` (01.jpg, 02.jpg, etc.)
- Um script Node copia toda a estrutura para `public/comics/<slug>/pages/` antes do build/dev
- Componentes referenciam como `/comics/<slug>/pages/01.jpg` (URL simples)
- Na listagem (cards), usa-se a primeira página como thumbnail
- Na página de detalhe, mostra todas as páginas em sequência
- O campo `type` do `comic.json` define o comportamento visual do card:
  - `"comic"` (padrão) — imagem com altura limitada e `object-contain` (preserva proporção, fundo neutro nas laterais)
  - `"art"` — imagem com `w-full h-auto` (largura total, altura natural, sem corte)
  - Esse é um contrato entre o conteúdo e o layout: qualquer componente de card deve respeitar essa distinção
- `author-avatar.jpg` e assets de arte decorativa (ex: `art-background.png`) ficam em `public/media/` — fora de `src/` para sobreviver uma troca de framework, referenciados como URLs estáticas (`/media/art-background.png`)
- Adicionar `public/comics/` ao `.gitignore` (são arquivos gerados)

---

## Camada Adaptadora

### `src/data/comic.types.ts` — Interface do Comic (contrato)
```typescript
export interface Comic {
  slug: string;
  title: string;
  type: "comic" | "art"; // "comic" é o padrão; "art" = arte avulsa (imagem única)
  date: string;          // ISO 8601
  excerpt: string;
  pages: string[];       // URLs das páginas resolvidas (/comics/<slug>/pages/01.jpg, ...)
  coverImage: string;    // URL da primeira página (atalho para pages[0])
  tags: string[];
  readingTime: string;
}
```

### `src/data/content-loader.ts` — Único arquivo que conhece a estrutura do conteúdo
- Usa `import.meta.glob` do Vite para ler os JSONs em build time
- Extrai o slug do path da pasta
- Resolve os caminhos das páginas para `/comics/<slug>/pages/01.jpg` etc.
- Define `coverImage` como `pages[0]` (primeira página = capa)
- Exporta `comics`, `allTags`, `getComic()` — mesma API que o `comics.ts` atual

**Este é o único arquivo a reescrever quando trocar de framework.**

---

## Steps de Implementação

### Step 1: Criar estrutura de conteúdo
- Criar `content/comic.schema.json`
- Criar pastas em `content/comics/` para cada quadrinho
- Criar os 4 `comic.json` com dados migrados de `src/data/comics.ts`
- Copiar imagens de `src/assets/comic-*.jpg` para `content/comics/<slug>/pages/01.jpg`

### Step 2: Script de sync de imagens
- Criar `scripts/sync-content.mjs` (copia imagens de `content/` para `public/comics/`)
- Atualizar scripts do `package.json`: `dev` e `build` rodam sync antes
- Adicionar `public/comics/` ao `.gitignore`

**Por que esse script existe:**
O Vite só serve arquivos estáticos de `public/` — ele não enxerga `content/`. Sem o sync, as URLs `/comics/<slug>/pages/01.jpg` retornam 404. O script é a ponte entre a fonte da verdade (`content/`, portável) e o que o servidor consegue servir (`public/`, gerado).

`public/comics/` fica no `.gitignore` porque é pasta gerada — não faz sentido commitá-la. Qualquer dev ou pipeline de CI roda `npm run dev` ou `npm run build` e o sync acontece automaticamente.

### Step 3: Camada adaptadora
- Criar `src/data/comic.types.ts`
- Criar `src/data/content-loader.ts` com `import.meta.glob`

### Step 4: Atualizar consumers
- `src/routes/index.tsx` — trocar import de `comics` para `content-loader`
- `src/routes/comics.tsx` — idem
- `src/routes/comics.$slug.tsx` — idem
- `src/components/ComicCard.tsx` — import type de `comic.types`
- `src/components/Sidebar.tsx` — import de `allTags` de `content-loader`
- Adicionar formatação de data com `date-fns` onde datas são exibidas

### Step 5: Limpeza
- Remover `src/data/comics.ts`
- Remover `src/assets/comic-*.jpg` (manter `art-background.png` e `author-avatar.jpg`)

---

## Verificação

1. `npm run dev` — confirmar que os 4 quadrinhos renderizam com imagens
2. Filtro por tag funciona na home e na página de comics
3. Página individual (`/comics/<slug>`) carrega corretamente
4. Navegação prev/next funciona
5. Build de produção (`npm run build`) funciona sem erros

---

## Arquivos Críticos

| Arquivo | Ação |
|---|---|
| `src/data/comics.ts` | Será substituído e removido |
| `src/routes/index.tsx` | Atualizar imports |
| `src/routes/comics.tsx` | Atualizar imports |
| `src/routes/comics.$slug.tsx` | Atualizar imports + formatação de data |
| `src/components/ComicCard.tsx` | Atualizar import do tipo |
| `src/components/Sidebar.tsx` | Atualizar import de tags |
| `package.json` | Adicionar script de sync |
| `vite.config.ts` | Possivelmente ajustar se glob não resolver |
| `.gitignore` | Adicionar `public/comics/` |
