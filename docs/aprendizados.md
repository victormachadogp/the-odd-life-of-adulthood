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