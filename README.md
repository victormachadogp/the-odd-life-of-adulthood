# A Estranha Vida Adulta

Projeto dedicado aos quadrinhos **A Estranha Vida Adulta**.

## Documentacao de Arquitetura

Os planos e decisoes de arquitetura do projeto estao em `docs/`:

- **[rfc-arquitetura-modular.md](docs/rfc-arquitetura-modular.md)** — RFC principal. Explica os principios (separation of concerns, dependency inversion, boundaries, contracts), o mapa de modulos, a estrategia de geracao de layouts com AI, analise de troca de framework, e blind spots. Documento guarda-chuva que conecta os outros dois.

- **[plano-separar-conteudo-layout.md](docs/plano-separar-conteudo-layout.md)** — Plano para extrair o conteudo dos comics (hoje hardcoded em `src/data/comics.ts`) para uma pasta `content/` portavel com JSON + imagens. Corresponde a Fase 1 da RFC.

- **[plano-i18n-modular.md](docs/plano-i18n-modular.md)** — Plano para extrair strings de UI (hoje hardcoded nos componentes) para `locales/` com i18n modular e type-safe. Corresponde a Fase 3 da RFC.

- **[governanca-anti-entropia.md](docs/governanca-anti-entropia.md)** — Praticas para manter a entropia baixa conforme o projeto cresce: padroes, convencoes, testes, code review, fronteiras claras (DDD leve), observabilidade e ownership de dominios.

## Backlog de Ferramentas de Analytics e Observabilidade

### VWO (Visual Website Optimizer)

**Propósito para o site:**

- **Testes A/B** — Testar variações de layout de comics (grid vs. feed vertical), posição de botões de navegação entre episódios, e diferentes formas de apresentar o catálogo para ver qual gera mais engajamento e leitura continuada.
- **Heatmaps** — Entender onde os leitores clicam e até onde rolam em cada página de comic. Identificar se o conteúdo abaixo da dobra está sendo visto e se elementos de navegação estão sendo usados.
- **Gravações de sessão** — Assistir sessões reais de leitura para detectar fricção: onde o usuário desiste, fica perdido ou não consegue avançar para o próximo episódio.
- **Análise de conversão** — Medir funis como: visita na home → abre um comic → lê até o fim → volta para ler outro. Identificar onde se perde o leitor e otimizar esse caminho.

### PostHog

**Propósito para o site:**

- **Analytics de produto** — Rastrear quais comics são mais lidos, tempo médio de leitura por episódio, origem do tráfego (orgânico, redes sociais, direto) e comportamento de usuários recorrentes vs. novos.
- **Funis de leitura** — Visualizar a jornada do leitor episódio a episódio. Entender qual comic é o ponto de entrada mais comum e qual causa maior retenção.
- **Cohorts e retenção** — Agrupar leitores por comportamento (ex: quem leu mais de 5 episódios) e analisar se voltam ao longo do tempo.

### Unleash

**Propósito para o site:**

- **Feature flags** — Controlar o rollout de novas funcionalidades (novo layout, nova página de catálogo, i18n) para uma porcentagem de usuários antes de liberar para todos, sem necessidade de novo deploy.
- **Experimentos progressivos** — Ativar features por segmento (ex: só usuários de determinada região ou idioma) para validar mudanças com impacto controlado.
- **Kill switch** — Desativar funcionalidades problemáticas em produção instantaneamente, sem rollback de código.
- **Integração com CI/CD** — Flags gerenciadas de forma centralizada e desacopladas do código, permitindo que produto e desenvolvimento avancem em ritmos independentes.

### Datadog

**Propósito para o site:**

- **Monitoramento de performance** — Rastrear Core Web Vitals (LCP, CLS, FID) em produção por página de comic. Identificar regressões de performance após deploys.
- **Rastreamento de erros** — Capturar erros de JavaScript em tempo real com contexto de usuário, página e versão do build. Alertar antes que leitores reportem problemas.
- **Logs centralizados** — Agregar logs do servidor (SSR, rotas de API) num único lugar com busca e filtragem para debugar incidentes rápido.
- **Uptime e alertas** — Monitorar disponibilidade do site e receber alertas imediatos se o site cair ou ficar lento, antes que afete a experiência de leitura.
