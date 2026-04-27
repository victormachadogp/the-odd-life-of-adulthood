# RFC: Arquitetura Modular para um Site AI-First

**Status:** Draft
**Autor:** Victor + Claude
**Projeto:** The Odd Life of Adulthood (Inkwell)

---

## 1. Problema

O site hoje funciona, mas é um bloco monolítico: conteúdo, identidade, strings de UI e layout estão todos misturados dentro de componentes React. Isso cria três problemas concretos:

**Problema A — Não dá pra trocar o layout sem reescrever tudo.** Se amanhã quisermos gerar um layout novo com AI (em React, Vue, Svelte, ou qualquer coisa), teríamos que extrair manualmente cada dado espalhado por 10+ arquivos. Não existe uma fronteira clara entre "o que é dado" e "o que é apresentação".

**Problema B — AI não tem contrato pra seguir.** Quando pedimos pra uma AI gerar um layout, ela precisa saber: quais dados existem? qual a forma deles? quais strings usar? quais classes CSS existem? Hoje nada disso está documentado — a AI teria que adivinhar ou copiar do código existente.

**Problema C — Qualquer mudança de identidade exige caçar strings.** Se "Inkwell" virar "Outro Nome", ou o autor mudar de "Mira Okafor" pra outro, você teria que buscar e substituir em 7+ arquivos. Dados de identidade do site estão duplicados em SiteHeader, SiteFooter, about, contact, Sidebar, __root, e comics.$slug.

---

## 2. Princípios de Arquitetura Aplicados

Antes das decisões, os conceitos que guiam tudo:

### 2.1 Separation of Concerns (Separação de Responsabilidades)

O princípio mais fundamental. Cada "coisa" no sistema deveria ter **uma única razão pra mudar**. Hoje, `SiteHeader.tsx` muda se:
- A navegação mudar (dado)
- O nome do site mudar (identidade)
- O label "Home" precisar virar "Início" (i18n)
- O design visual mudar (layout)

São 4 razões de mudança num único arquivo. Isso é o oposto de separation of concerns. O objetivo é que cada preocupação viva em seu próprio lugar:

| Preocupação | Onde deveria viver | Razão de mudança |
|---|---|---|
| Quais comics existem | `content/` | Publicar/editar comic |
| Como o site se chama, quem é o autor | `site.config.json` | Rebranding, novo autor |
| Como strings aparecem em cada idioma | `locales/` | Tradução, ajuste de copy |
| Como as coisas são renderizadas | `src/` (layout) | Redesign, troca de framework |

### 2.2 Dependency Inversion (Inversão de Dependência)

Módulos de alto nível (dados, conteúdo) não devem depender de módulos de baixo nível (framework, componentes). Ambos devem depender de **abstrações** (interfaces/contratos).

Hoje, `comics.ts` importa imagens usando `import catCoffee from "@/assets/comic-cat-coffee.jpg"` — isso é um import de módulo Vite. O dado (comic) depende da ferramenta de build (Vite). Se trocarmos pra Nuxt, esse import quebra.

O correto: comics moram em JSON puro com paths relativos. Um **adapter** (camada fina, framework-específica) traduz esses paths pra algo que o framework entende. O dado não sabe que Vite existe.

```
ERRADO:  Comic (dado) → import Vite → Componente React
CORRETO: Comic (JSON puro) → Adapter (Vite-específico) → Componente React
                             → Adapter (Nuxt-específico) → Componente Vue
```

### 2.3 Boundary (Fronteira Arquitetural)

A fronteira mais importante deste projeto é: **tudo fora de `src/` é portável, tudo dentro de `src/` é descartável**.

Isso não é só uma convenção de pastas — é uma decisão arquitetural. Significa que `src/` inteiro pode ser deletado e recriado (por AI ou manualmente) sem perder nenhum dado, nenhuma tradução, nenhuma configuração. A fronteira garante que "regenerar o layout" seja uma operação segura.

**Por que `src/` inteiro e não só os componentes?** Porque o router, os hooks, o provider de tema, os loaders — tudo isso é framework-específico. TanStack Router é React. `import.meta.glob` é Vite. `useContext` é React. Nada disso sobrevive uma troca de framework. O que sobrevive são os dados que esses mecanismos consomem.

### 2.4 Contracts (Contratos / Interfaces)

Um contrato é um acordo entre duas partes sobre a forma dos dados que trafegam entre elas. Em TypeScript, isso são `interfaces`. Em arquitetura, é mais amplo — inclui: que dados existem, que formato têm, como são acessados, e o que o consumidor deve fazer com eles.

Contratos são especialmente importantes num workflow AI-first porque **AI precisa de especificação**. Sem contrato, cada layout gerado por AI vai inventar sua própria estrutura de dados, seus próprios nomes de variáveis, suas próprias convenções. Com contrato, toda AI (e todo humano) que tocar no projeto sabe exatamente: "o dado de comics tem essa forma, as traduções têm essas chaves, o config tem esses campos".

---

## 3. Mapa de Módulos

### 3.1 Módulos Portáveis (fora de `src/`)

Esses módulos são **dados puros** — JSON, imagens, documentação. Não têm dependência de nenhum framework, build tool, ou runtime. Sobrevivem qualquer troca de tecnologia.

#### `content/` — Conteúdo dos Comics

**O que é:** cada comic numa pasta própria com um `comic.json` (metadados) e uma pasta `pages/` (imagens). Já detalhado no plano existente `docs/plano-separar-conteudo-layout.md`.

**Por que existe como módulo separado:** o conteúdo é a razão de existir do site. É o ativo mais valioso. Ele precisa ser independente de como é apresentado. Se amanhã o layout mudar de um blog pra uma galeria, ou de web pra um app mobile, os comics continuam os mesmos.

**O que muda nele:** só quando um comic novo é publicado ou um existente é editado. Nunca por causa de redesign.

#### `locales/` — Strings de UI por Idioma

**O que é:** arquivos JSON organizados por idioma e por módulo (common, home, comics, about, contact). Já detalhado em `docs/plano-i18n-modular.md`.

**Por que existe como módulo separado:** strings de UI mudam por razões diferentes do layout. "Início" pode virar "Home" (i18n) sem nenhuma mudança visual. E um redesign completo pode acontecer sem nenhuma mudança de texto. Separar garante que as duas coisas evoluam independentemente.

**Por que fora de `src/`:** se trocarmos de React pra Vue, as traduções são as mesmas. O mecanismo de carregar muda (React context → Vue provide/inject), mas os JSONs não.

#### `site.config.json` — Identidade e Estrutura do Site

**O que é:** um único JSON na raiz com tudo que define "o que este site é" sem dizer "como ele parece":

```json
{
  "site": {
    "name": "Inkwell",
    "tagline": "Webcomics for the curious",
    "description": "An independent webcomic catalogue. Printed pixels, weekly.",
    "url": "https://inkwell.studio",
    "language": "pt-BR",
    "issueNumber": "042",
    "volume": "I",
    "issn": "2026-0042"
  },
  "author": {
    "name": "Mira Okafor",
    "role": "Cartoonist",
    "location": "Lisbon",
    "bio": "Small, quiet stories. Cats, dragons, the occasional astronaut.",
    "avatar": "/media/author-avatar.jpg",
    "startYear": 2022
  },
  "navigation": [
    { "key": "home", "path": "/" },
    { "key": "comics", "path": "/comics" },
    { "key": "about", "path": "/about" },
    { "key": "contact", "path": "/contact" }
  ],
  "social": [
    { "platform": "email", "handle": "hi@inkwell.studio", "url": "mailto:hi@inkwell.studio" },
    { "platform": "instagram", "handle": "@inkwell.strips", "url": "https://instagram.com/inkwell.strips" },
    { "platform": "twitter", "handle": "@inkwellstrips", "url": "https://twitter.com/inkwellstrips" }
  ],
  "seo": {
    "titleTemplate": "{pageTitle} — {siteName}",
    "defaultTitle": "Inkwell — Webcomics for the curious",
    "defaultDescription": "A modern webcomic blog. Fresh strips every week."
  }
}
```

**Por que este módulo é novo e necessário:**

Hoje, a string "Inkwell" aparece em: `SiteHeader.tsx` (linha 23, 26), `SiteFooter.tsx` (linha 10), `__root.tsx` (linha 37, 39, 43), `about.tsx` (linha 7, 10, 42). "Mira Okafor" aparece em: `about.tsx` (linha 34), `Sidebar.tsx`, `comics.$slug.tsx`. Links sociais em `contact.tsx` (linhas 31-43). Itens de navegação em `SiteHeader.tsx` (linhas 7-12) e duplicados no `SiteFooter.tsx` (linhas 19-23).

Isso viola o princípio DRY (Don't Repeat Yourself), mas mais importante, viola separation of concerns: a identidade do site não é uma preocupação do layout. "Como o site se chama" e "como o header é renderizado" são coisas diferentes.

**Distinção importante — config vs locales:** O config define **o que existe** (há 4 itens de navegação, o primeiro tem key "home" e path "/"). Os locales definem **como se chama** (o item com key "home" se chama "Início" em pt-BR). Isso significa que `navigation` no config não tem campo `label` — o label vem de `t('nav.home')` onde `home` é o `key` do config.

#### `contracts/` — Especificações para AI e Humanos

**O que é:** documentos que descrevem o "contrato" entre os dados portáveis e qualquer layout que os consuma. Inclui:

- `types.ts` — interfaces TypeScript com a forma de cada tipo de dado (Comic, SiteConfig, TranslationFn)
- `pages/*.md` — especificação por página: quais dados recebe, quais seções deve ter, quais chaves de tradução usa
- `components.md` — especificação de componentes compartilhados (header, footer, card, sidebar)

**Por que isso existe:**

Sem contratos, cada vez que você pede pra uma AI gerar um layout, precisa explicar tudo do zero: "o comic tem slug, title, date em ISO 8601, excerpt, pages como array de URLs...". E a AI pode inventar campos que não existem ou esquecer campos obrigatórios.

Com contratos, você cola o documento relevante no prompt e diz "siga este contrato". A AI sabe exatamente o que consumir e o que produzir.

Contratos também servem como **checklist de completude**. Quando trocar de framework, cada `pages/*.md` é um item a verificar: "a home page consome comics, config, e t()? renderiza marquee, hero, feed, sidebar? usa as chaves de tradução listadas?".

**Exemplo de contrato de página (`contracts/pages/home.md`):**

```markdown
# Home Page

## Dados Disponíveis
- `comics: Comic[]` — todos os comics, mais recente primeiro
- `allTags: string[]` — todas as tags únicas, ordenadas
- `config: SiteConfig` — identidade do site, autor, navegação, social
- `t(key, vars?)` — função de tradução

## Seções Obrigatórias
1. Marquee — ticker com t('home.marquee.*')
2. Hero — masthead com config.site.name, t('home.hero.*'), CTAs
3. Feed — lista filtrável de comics (busca + tag), usa ComicCard
4. Sidebar — busca, filtro de tags, card do autor

## Chaves de Tradução Usadas
home.hero.title, home.hero.subtitle, home.hero.featured,
home.hero.cta.archive, home.hero.cta.author,
home.marquee.newStrip, home.marquee.issue, home.marquee.inkOnly,
home.feed.title, home.feed.noResults, home.feed.entries

## Classes CSS Disponíveis
brutal-border, brutal-border-b, brutal-border-t,
shadow-soft, shadow-panel, shadow-glow,
transition-smooth, animate-fade-up
```

### 3.2 Módulo Layout (dentro de `src/` — descartável)

Tudo em `src/` é específico do framework atual e pode ser regenerado. Mas dentro de `src/`, existe uma peça arquitetural importante:

#### Adapters — A Camada de Tradução

**O que são:** arquivos finos que traduzem dados portáveis (JSON puro) para algo que o framework atual consegue consumir. São o único ponto de acoplamento entre os mundos "portável" e "framework-específico".

| Adapter | O que faz | Equivalente em Vue/Nuxt |
|---|---|---|
| `src/data/content-loader.ts` | Usa `import.meta.glob` do Vite pra ler `content/comics/*/comic.json`, resolve paths de imagens, exporta `comics[]`, `getComic()`, `allTags` | Nuxt Content module, ou `fs.readFileSync` em server routes |
| `src/data/config-loader.ts` | Importa `site.config.json`, exporta tipado | Praticamente idêntico (`import config from '~/site.config.json'`) |
| `src/i18n/context.tsx` | React context + `useTranslation()` hook, carrega JSONs de `locales/` | Vue `provide/inject` + composable `useI18n()` |

**Por que não usar libraries prontas pra isso?** Trade-off consciente:

- **Content loader custom vs CMS (Contentlayer, Nuxt Content, etc):** CMS tools são poderosos mas adicionam uma dependência pesada e opinionated. O nosso conteúdo é simples (JSON + imagens). Um loader de ~50 linhas é mais fácil de entender, debugar, e reescrever do que configurar uma tool nova a cada troca de framework.

- **i18n custom (~80 linhas) vs react-i18next (~40KB):** Com ~100-150 strings e 1-2 idiomas, uma library full-featured é overhead. A estrutura de chaves flat e `t('key')` é intencionalmente compatível com react-i18next — se um dia precisar de pluralização complexa ou 5+ idiomas, a migração é trocar o provider, não os JSONs.

---

## 4. AI Layout Generation — Como Funciona na Prática

### 4.1 O Documento `LAYOUT_BRIEF.md`

Este é o documento que você cola (ou referencia) em toda conversa com AI sobre layout. Ele contém:

1. **Overview** — 2 frases sobre o projeto
2. **Design Language** — as regras visuais da estética "brutal ink":
   - Border-radius zero em tudo (`--radius: 0rem`)
   - Bordas 3px solid, box-shadow com offset 8px
   - JetBrains Mono monospace em tudo, headings all-caps
   - Alto contraste preto/branco + accent vermelho (primary)
   - Padrões recorrentes: `// Section.name` antes de títulos, `FILE №XXX` como numeração, `[XX] entries` como contador
3. **Imports disponíveis** — de onde importar dados (paths exatos dos adapters)
4. **CSS utilities** — classes custom disponíveis (brutal-border, shadow-soft, etc)
5. **Design tokens** — variáveis CSS disponíveis (--ink, --paper, --shadow-soft, etc)
6. **Framework atual** — qual framework, qual router, quais padrões seguir

### 4.2 O Prompt Pattern

```
Gere a página [nome] para meu site de webcomics.

[colar LAYOUT_BRIEF.md]
[colar contracts/pages/[pagina].md]

Framework: React + TanStack Router (createFileRoute)
Arquivo: src/routes/[nome].tsx

Regras:
- Importe comics/config de @/data/content-loader e @/data/config-loader
- Use t() para TODA string de UI — nunca hardcode texto
- Use apenas as classes CSS listadas no brief
- Siga o design language (brutal borders, monospace, all-caps)
```

### 4.3 Por que isso produz resultados melhores

AI generativa funciona melhor com **constraints**. Quanto mais restrito o espaço de possibilidades, mais consistente o output. Sem brief, a AI tem liberdade total e vai inventar: nomes de variáveis, classes CSS, estrutura de dados, estilo visual. Com brief + contrato, ela opera dentro de um espaço definido.

Isso é análogo ao conceito de **Design System** em frontend — um design system não limita a criatividade, ele canaliza. O layout brief é o design system que a AI segue.

### 4.4 Dicas para Layouts Melhores com AI

- **Referência visual > descrição textual.** Se possível, cole screenshots ou links de layouts que você gosta. AI entende imagens.
- **Itere em seções, não na página inteira.** Gerar a hero section, aprovar, depois gerar o feed, aprovar. Páginas inteiras de uma vez tendem a ser genéricas.
- **Peça variações.** "Gere 3 variações da hero section seguindo o brief" e escolha a melhor.
- **O brief é vivo.** Cada vez que um layout gerado te surpreender positivamente (ou negativamente), atualize o brief com essa aprendizagem.
- **Pós-geração:** validar se t() foi usado corretamente, se imports estão certos, se não há strings hardcoded. Isso pode ser automatizado (ver seção 6).

---

## 5. Troca de Framework — O que Realmente Acontece

### 5.1 O que NÃO muda (zero esforço)

| Ativo | Por que sobrevive |
|---|---|
| `content/` (comics JSON + imagens) | JSON puro, sem imports de módulo |
| `locales/` (traduções) | JSON puro |
| `site.config.json` | JSON puro |
| `contracts/` | Documentação + tipos (TypeScript é universal) |
| `LAYOUT_BRIEF.md` | Atualizar só a seção "Framework atual" |
| `scripts/sync-content.mjs` | Node puro, sem dependência de framework |
| `public/` (media estática) | Arquivos estáticos |

### 5.2 O que muda

| Camada | Esforço | Detalhes |
|---|---|---|
| **Adapters** (content-loader, config-loader, i18n) | Pequeno | ~150 linhas total. Mesma API de saída, mecanismo de loading diferente. É o custo fixo de toda troca. |
| **Páginas e componentes** | Médio, mas AI gera | Você passa os mesmos contracts pro AI, muda "Framework: Vue/Nuxt" no brief, e AI gera. O contrato garante que nada seja esquecido. |
| **Theme provider** | Pequeno | Mesma lógica (localStorage + CSS vars), primitiva de reatividade diferente (context → provide/inject → store) |
| **CSS/Tailwind** | Mínimo | Tailwind funciona em qualquer framework. Copiar `styles.css` quase literalmente. |
| **Build config** | Substituir | `vite.config.ts` → `nuxt.config.ts` ou equivalente |
| **package.json** | Substituir dependências | Novo framework, novo router, novos deps |

### 5.3 Avaliação honesta de esforço

Com a arquitetura modular em lugar: **1-2 dias** para um dev solo usando AI pra gerar layout.

Sem a arquitetura (estado atual): **3-5 dias** porque você precisa extrair dados de dentro dos componentes antes de poder recriar em outro framework. E o risco de esquecer algo é alto.

A maior parte do esforço de uma troca **não é código** — é garantir completude. "Esqueci de migrar o ISSN do footer" ou "os meta tags de SEO sumiram". Os contracts servem como checklist pra isso.

---

## 6. Blind Spots e Riscos

### 6.1 Routing não é portável

Cada framework tem seu próprio sistema de rotas. TanStack Router usa `createFileRoute`, Next.js usa `app/` directory, Nuxt usa `pages/`. Os paths (`/comics`, `/about`) são os mesmos, mas a forma de declarar, os loaders, os head() functions — tudo muda.

**Mitigação:** O config define os paths (`navigation[].path`). O contrato de cada página documenta que rota corresponde. Mas o adapter de routing não existe como camada — não vale a pena abstrair isso. É mais simples reescrever.

### 6.2 Imagens em build-time vs runtime

Hoje, imagens são importadas como módulos Vite (`import img from "@/assets/..."`) e o Vite otimiza, gera hashes, faz lazy loading. Com `content/`, imagens viram URLs estáticas (`/comics/slug/pages/01.jpg`) sem otimização automática.

**Mitigação:** O script `sync-content.mjs` pode incluir otimização de imagens (sharp, squoosh). Mas isso é uma troca: simplicidade de portabilidade vs otimização automática do bundler. Pra um site com 4 comics e poucas imagens, a diferença é negligível. Se crescer pra centenas, revisitar.

### 6.3 O layout brief pode ficar desatualizado

Se o brief não acompanhar mudanças no CSS, nos tokens, ou nos dados, a AI vai gerar código inconsistente.

**Mitigação:** Disciplina. Toda vez que mudar uma classe CSS, um token, ou uma chave de tradução, atualizar o brief. Alternativamente, um script que gera partes do brief automaticamente (ex: listar todas classes CSS custom de `styles.css`).

### 6.4 Contratos são documentação — e documentação mente

Se alguém (humano ou AI) mudar a interface `Comic` sem atualizar `contracts/types.ts`, o contrato diverge da realidade.

**Mitigação:** `contracts/types.ts` pode ser importado pelos adapters. Assim, se o contrato mudar, o TypeScript força os adapters a se adaptarem. Mas os `pages/*.md` são markdown puro — não têm validação automática. Disciplina novamente, ou um script de validação (ver abaixo).

### 6.5 Over-engineering pra 4 comics

O projeto hoje tem 4 comics e ~10 componentes. A arquitetura modular completa é proporcionalmente pesada. O risco é gastar mais tempo organizando do que criando conteúdo.

**Mitigação:** Implementação incremental. As fases 1-3 (content, config, i18n) trazem valor imediato (código mais limpo, sem strings hardcoded). As fases 4-5 (contracts, brief) só valem quando você for de fato regenerar layouts com AI. Não precisa fazer tudo de uma vez.

### 6.6 Server-side rendering e data fetching

Hoje o site usa TanStack Start que suporta SSR. Se trocar pra um framework SSR-first (Nuxt, Astro), os adapters podem precisar funcionar tanto no servidor quanto no cliente. `import.meta.glob` é Vite-only e roda em build time. Em Nuxt, os dados viriam de server routes ou do Nuxt Content module.

**Mitigação:** Os adapters são intencionalmente finos (~50 linhas cada). Reescrevê-los pra um paradigma SSR diferente é trivial justamente porque são finos. Se fossem abstrações complexas, a troca seria dolorosa.

---

## 7. Módulos Futuros (Ainda Não Necessários)

Módulos que podem surgir conforme o projeto cresce, mas que **não valem implementar agora**:

| Módulo | Quando faria sentido | O que seria |
|---|---|---|
| **Design Tokens** (`tokens/`) | Quando de fato trocar de framework e precisar regenerar CSS | Cores, tipografia, shadows em JSON → script gera CSS custom properties |
| **Analytics config** | Quando adicionar tracking | Config de quais eventos trackear, separado do código de tracking |
| **Forms config** | Se o formulário de contato ficar complexo | Schema do form em JSON, layout renderiza dinamicamente |
| **Media pipeline** | Se passar de ~20 comics | Otimização de imagens automatizada, thumbnails, lazy loading |

---

## 8. Ordem de Implementação

### Fase 1: Content Separation
Executar o plano existente (`docs/plano-separar-conteudo-layout.md`). Isso é pré-requisito pra tudo — é onde o princípio de dependency inversion se materializa primeiro.

### Fase 2: Site Config
Criar `site.config.json` + adapter. Eliminar todas duplicatas de identidade nos componentes. Relativamente simples, alto impacto na organização.

### Fase 3: i18n
Executar o plano existente (`docs/plano-i18n-modular.md`). Depende da Fase 2 porque nav labels referenciam keys do config.

### Fase 4: Contracts + Layout Brief
Criar `contracts/` e `LAYOUT_BRIEF.md`. Testar pedindo pra AI regenerar uma página (about é a mais simples). Este é o ponto onde o workflow AI-first fica viável.

### Fase 5 (quando necessário): Validação automatizada
Script que verifica se layouts gerados seguem os contratos (t() keys existem, imports corretos, sem strings hardcoded).

### Fase 6 (quando necessário): Design Tokens
Extrair CSS custom properties pra JSON. Só vale quando for realmente trocar de framework.

---

## 9. Arquivos Críticos

**Existentes (a modificar):**
- `src/data/comics.ts` — dado hardcoded que Fase 1 substitui
- `src/routes/__root.tsx` — app shell com SEO/identidade hardcoded
- `src/components/SiteHeader.tsx` — nav + identidade hardcoded (linhas 7-12, 23-29)
- `src/components/SiteFooter.tsx` — footer com dados duplicados
- `src/styles.css` — design tokens atuais (fonte do brief)

**Novos (a criar):**
- `site.config.json` — identidade centralizada
- `contracts/types.ts` — interfaces compartilhadas
- `contracts/pages/*.md` — specs por página
- `LAYOUT_BRIEF.md` — documento pra AI
- `src/data/config-loader.ts` — adapter do config

**Planos existentes (a executar):**
- `docs/plano-separar-conteudo-layout.md` — Fase 1
- `docs/plano-i18n-modular.md` — Fase 3
