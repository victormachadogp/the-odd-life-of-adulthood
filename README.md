# A Estranha Vida Adulta

Projeto dedicado aos quadrinhos **A Estranha Vida Adulta**.

## Documentacao de Arquitetura

Os planos e decisoes de arquitetura do projeto estao em `docs/`:

- **[rfc-arquitetura-modular.md](docs/rfc-arquitetura-modular.md)** — RFC principal. Explica os principios (separation of concerns, dependency inversion, boundaries, contracts), o mapa de modulos, a estrategia de geracao de layouts com AI, analise de troca de framework, e blind spots. Documento guarda-chuva que conecta os outros dois.

- **[plano-separar-conteudo-layout.md](docs/plano-separar-conteudo-layout.md)** — Plano para extrair o conteudo dos comics (hoje hardcoded em `src/data/comics.ts`) para uma pasta `content/` portavel com JSON + imagens. Corresponde a Fase 1 da RFC.

- **[plano-i18n-modular.md](docs/plano-i18n-modular.md)** — Plano para extrair strings de UI (hoje hardcoded nos componentes) para `locales/` com i18n modular e type-safe. Corresponde a Fase 3 da RFC.