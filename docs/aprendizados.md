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