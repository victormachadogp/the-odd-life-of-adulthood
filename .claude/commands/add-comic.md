# add-comic

Guia interativo para adicionar um novo quadrinho ou arte avulsa ao projeto The Odd Life of Adulthood.

## O que você precisa ter antes de começar

- A(s) imagem(ns) da obra (jpg, jpeg ou png)
- Título
- Descrição curta (excerpt) — uma ou duas frases
- Tags (ex: slice-of-life, cats, fantasy)
- Data de publicação
- Tipo: `comic` (quadrinho com painéis) ou `art` (ilustração avulsa)
- Tempo de leitura (opcional, ex: "2 min") — só faz sentido pra `comic`

Se o usuário trouxer só as imagens, pergunte cada campo antes de continuar.

---

## Passo a passo

### 1. Definir o slug

O slug é o nome da pasta e a URL do quadrinho. Regras:
- Tudo minúsculo
- Palavras separadas por hífen
- Sem acentos ou caracteres especiais
- Derivado do título (ex: "Dragon Bakes Cookies" → `dragon-bakes-cookies`)

Confirme o slug com o usuário antes de continuar.

### 2. Criar a estrutura de pastas

```
content/comics/<slug>/
  pages/
```

Crie com:
```bash
mkdir -p content/comics/<slug>/pages
```

### 3. Colocar as imagens

Imagens vão em `content/comics/<slug>/pages/` nomeadas em sequência:
- `01.jpg`, `02.jpg`, `03.jpg`... para quadrinhos com múltiplos painéis
- `01.jpg` (ou `.jpeg`, `.png`) para arte avulsa ou quadrinho de página única

**A primeira imagem é sempre a capa/thumbnail** nas listagens.

Peça ao usuário para mover ou copiar as imagens para esse caminho.

### 4. Criar o `comic.json`

Crie `content/comics/<slug>/comic.json`:

```json
{
  "$schema": "../../../comic.schema.json",
  "title": "<título>",
  "type": "<comic|art>",
  "date": "<YYYY-MM-DD>",
  "excerpt": "<descrição curta>",
  "pages": ["pages/01.jpg"],
  "tags": ["<tag1>", "<tag2>"],
  "readingTime": "<N min>"
}
```

Notas:
- `type` pode ser omitido se for `comic` (é o padrão)
- `readingTime` pode ser omitido para `art`
- `pages` deve listar todas as imagens em ordem
- Data em ISO 8601 (`YYYY-MM-DD`) — o layout formata a exibição

### 5. Verificar

Confirme que a estrutura ficou assim:

```
content/comics/<slug>/
  comic.json
  pages/
    01.jpg
    02.jpg   ← se houver mais páginas
```

### 6. Rodar o projeto

```bash
npm run dev
```

O script `sync-content.mjs` roda automaticamente antes do Vite e copia as imagens de `content/` para `public/comics/`. Sem isso, as imagens não aparecem no browser.

### 7. Verificar no browser

- A nova obra deve aparecer na home (`/`) e na página de comics (`/comics`)
- A página individual (`/comics/<slug>`) deve carregar corretamente
- Arte avulsa (`type: "art"`) aparece com a imagem em largura total e altura natural
- Quadrinhos (`type: "comic"`) aparecem com altura limitada e `object-contain`

---

## Referências

- Schema completo: `content/comic.schema.json`
- Interface TypeScript: `src/data/comic.types.ts`
- Como o conteúdo é carregado: `src/data/content-loader.ts`
- Decisões arquiteturais: `docs/plano-separar-conteudo-layout.md`