# Aprendizados

Decisões e descobertas não óbvias feitas durante a construção deste projeto.

---

## Vite processa e acopla assets importados como módulo

**Contexto:** Durante a migração de `art-background.png` de `src/assets/` para `public/media/`, surgiu a dúvida sobre qual forma de referenciar a imagem era melhor.

**O que acontece com `import img from "@/assets/image.png"`:**
O Vite intercepta esse import e processa o arquivo: adiciona um hash ao nome (`art-background.abc123.png`), otimiza, e inclui no bundle. O import não retorna o path original — retorna a URL processada (`/assets/art-background.abc123.png`).

Isso significa que o asset está **acoplado ao pipeline do Vite**. Se o projeto trocar de framework (Next.js, Nuxt, Astro), esse import quebra porque cada ferramenta tem seu próprio sistema de processamento de assets.

**O que acontece com `const img = "/media/image.png"`:**
O arquivo fica em `public/media/` e é servido diretamente como arquivo estático, sem processamento. A URL é previsível e não muda. Qualquer framework ou servidor estático consegue servir esse arquivo.

**Decisão tomada:**
Assets que precisam sobreviver uma troca de framework (arte decorativa, avatar do autor) ficam em `public/media/` e são referenciados como URLs estáticas. Isso é consistente com o princípio do RFC: tudo fora de `src/` é portável, tudo dentro de `src/` é descartável.

**Quando ainda faz sentido usar o import de módulo:**
Se o asset for descartável junto com o layout (ícones SVG inline, imagens de placeholder específicas do design atual), o import de módulo tem vantagens reais: otimização automática, lazy loading, e hashes para cache busting. O trade-off é consciente.

---

## Por que o Vite gera hash nos nomes dos arquivos

**Contexto:** Durante a decisão de usar `import img from "@/assets/..."` vs `const img = "/media/..."`, surgiu a dúvida: por que o Vite renomeia arquivos com aquele código estranho no nome?

**O problema: cache do browser**
Browsers guardam arquivos estáticos em cache — depois de baixar `logo.png` uma vez, o browser usa a cópia local por dias ou semanas sem verificar se mudou no servidor. Isso é bom pra performance (site carrega rápido), mas cria um problema: se você atualizar `logo.png` no servidor, o usuário continua vendo a versão antiga porque o browser nem foi buscar.

**A solução do Vite: hash no nome**
O Vite gera um código baseado no *conteúdo* do arquivo e coloca no nome:

```
logo.png  →  logo.Xk92mB3a.png   (versão 1)
logo.png  →  logo.pQ7nRt1w.png   (versão 2, após qualquer mudança)
```

Se o conteúdo mudar, o hash muda. Pro browser, é um arquivo novo — ele baixa do servidor. Cache busting automático, sem esforço manual.

**Por que isso não afeta o deploy (GitHub Pages, Vercel)**
Tanto GitHub Pages quanto Vercel entendem o output do Vite. O `index.html` gerado já referencia os paths com hash. O servidor só precisa servir os arquivos estáticos da pasta `dist/` — funciona em qualquer plataforma.

**E as imagens dos comics em `public/`?**
Imagens em `public/comics/slug/pages/01.jpg` não passam pelo Vite — são URLs estáticas, sem hash. Se uma imagem for atualizada, um usuário com cache pode ver a versão antiga por um tempo. Na prática, para um site com poucos comics e atualizações esporádicas, não é um problema real. Se o projeto crescer, o `sync-content.mjs` pode ser expandido para gerar hashes nos nomes ao copiar.

---

## CI: separar validação de qualidade do build de deploy

**Contexto:** Ao criar o primeiro CI do projeto, a dúvida era: rodar build a cada push? Isso é lento e desnecessário quando o objetivo é só garantir qualidade do código.

**Decisão tomada:**
Dois workflows separados com propósitos distintos:

1. **CI automático** (push para main) — só valida qualidade: lint, format check, type check. Rápido, roda a cada commit.
2. **Release manual** (workflow_dispatch) — builda, tageia, gera artifact. Só quando o dev decide que está pronto pra deployar.

**Por que não buildar a cada push:**
Build é a operação mais pesada do pipeline. Se o projeto compila mas tem um erro de lint, você gastou minutos de CI à toa. Validações de qualidade (lint, format, types) pegam 90% dos problemas em segundos. Build fica reservado pro momento de "quero colocar no ar".

**Proteção na release:**
O workflow de release roda os mesmos checks de qualidade como job prerequisito (`needs: quality`). Se lint/format/types falhar, o build nem começa. Isso garante que nenhuma release saia com código sujo, sem duplicar lógica — o job `quality` é o mesmo nos dois workflows.

---

## Versionamento: CalVer com era para projetos pessoais

**Contexto:** Qual padrão de versionamento faz sentido para um site pessoal que não é consumido como lib por terceiros?

**Opções avaliadas:**

| Padrão | Quando faz sentido |
|--------|-------------------|
| SemVer (`2.4.1`) | Libs/APIs públicas — consumidores precisam saber se podem atualizar sem quebrar |
| CalVer (`2026.05.02`) | Quando o tempo importa mais que compatibilidade |
| Release train (`v1.1433.7`) | SaaS com times grandes e release trains regulares |
| Contador simples (`v1, v2, v3`) | Quando só precisa de rastreabilidade mínima |

**Decisão tomada:** `v1.2026.05.02` — combina era + data.

- `v1` = "era" do projeto (stack atual: TanStack/React). Quando reescrever o front, vira `v2`.
- `2026.05.02` = CalVer, diz exatamente quando a release foi feita.
- Se houver 2 releases no mesmo dia: `v1.2026.05.02.2`.

**Por que não SemVer:**
SemVer carrega uma garantia de compatibilidade (MAJOR = breaking change). Num site pessoal acessado pelo browser, não existe consumidor externo que depende de uma versão. Todo deploy é "a última versão". SemVer seria teatro semântico.

**Quando o v1 vira v2:**
Quando o conteúdo (`content/`) sobrevive mas o front é reescrito em outra stack. O número marca uma mudança de era, não uma breaking change no sentido de API.

---