# Governança: Mantendo a Entropia Baixa

**Premissa:** Entropia = perda de previsibilidade. "Quantas coisas podem acontecer que eu não consigo antecipar?" Todo sistema tende ao caos se você não colocar limites — mesmo com um dev só.

Este documento define as práticas que mantêm o projeto previsível conforme ele cresce. Complementa os princípios arquiteturais definidos em `docs/rfc-arquitetura-modular.md`.

---

## 1. Regras Fundamentais

> "Se não existe regra, cada dev cria uma realidade diferente."

Mesmo trabalhando sozinho, o "dev do futuro" (você daqui a 3 meses) é efetivamente outra pessoa. Sem regras explícitas, cada sessão de código cria convenções ligeiramente diferentes.

### 1.1 Cada nova possibilidade precisa de uma regra pra existir

Se algo pode ser feito de dois jeitos e não há regra dizendo qual usar, entropia já começou. A regra não precisa ser complexa — pode ser uma linha num README ou um lint rule.

### 1.2 Arquitetura é o ato de reduzir entropia

Toda decisão arquitetural é uma restrição intencional. Separar `content/` de `src/` é uma restrição. Usar `t()` pra toda string é uma restrição. Cada restrição reduz o espaço de possibilidades e aumenta previsibilidade.

### 1.3 Reduza possibilidades ou torne elas visíveis

Se não pode eliminar uma fonte de variação, pelo menos torne ela observável. Logs, tipos, testes, contratos — tudo isso transforma o invisível em visível.

---

## 2. Os Quatro Freios de Entropia

### 2.1 Padrões (estrutura previsível)

Estrutura previsível significa que qualquer pessoa (ou AI) sabe onde encontrar e onde colocar cada coisa sem perguntar.

**Na prática neste projeto:**
- Comics sempre em `content/comics/{slug}/comic.json`
- Traduções sempre em `locales/{idioma}/{modulo}.json`
- Identidade do site sempre em `site.config.json`
- Layouts sempre em `src/` (e descartáveis)

**Teste mental:** "Se eu preciso adicionar um comic novo, sei exatamente onde e como sem olhar outro arquivo?" Se a resposta é sim, o padrão está funcionando.

### 2.2 Convenções (menos decisões por dev)

Convenções eliminam micro-decisões que, acumuladas, geram divergência.

**Na prática neste projeto:**
- Chaves de tradução: flat com dot notation (`home.hero.title`, nunca nested)
- Nomenclatura de arquivos: kebab-case
- Componentes: PascalCase
- Strings de UI: sempre via `t()`, nunca hardcoded
- Dados: JSON puro fora de `src/`, nunca imports de framework

**Teste mental:** "Se dois devs implementam a mesma feature separadamente, o resultado é estruturalmente idêntico?" Se sim, as convenções estão funcionando.

### 2.3 Testes (limites de comportamento)

Testes definem o comportamento aceitável do sistema. Sem testes, qualquer mudança pode quebrar algo silenciosamente.

**Na prática neste projeto:**
- `scripts/validate-locales.ts` — garante paridade entre idiomas (já planejado em `docs/plano-i18n-modular.md`)
- Type checking (`tsc --noEmit`) — contratos tipados impedem dados com forma errada
- Build check (`npm run build`) — se compila, os imports e referências existem
- Futuro: script que valida se layouts usam `t()` corretamente e não têm strings hardcoded

**Teste mental:** "Se eu quebrar algo, descubro antes de ir pra produção?" Se sim, os testes estão cobrindo.

### 2.4 Code Review (freio humano de entropia)

Mesmo trabalhando solo, review é o momento de perguntar: "isso segue os padrões? isso aumenta ou reduz entropia?"

**Na prática neste projeto:**
- Antes de commitar, verificar: dados estão fora de `src/`? Strings usam `t()`? Convenções de naming seguidas?
- AI como reviewer: colar o diff e pedir pra validar contra os contratos e convenções
- Usar este documento como checklist

---

## 3. Fronteiras Claras (DDD Leve)

> "Se eu não sei onde colocar, o sistema não tem fronteiras claras."

Não precisa virar purista de Domain-Driven Design. Só precisa responder: **"quem é dono dessa regra?"**

### 3.1 Regra de ouro

**A regra vive onde a mudança dói menos.**

| Se mudar essa regra afeta... | Ela vive em... |
|------------------------------|----------------|
| Como o site se identifica | `site.config.json` |
| Como uma string aparece num idioma | `locales/` |
| O que um comic contém | `content/` |
| Como algo é renderizado | `src/` (layout) |
| O contrato entre dado e layout | `contracts/` |

### 3.2 Proibir duplicação silenciosa

Se a mesma informação aparece em dois lugares, entropia já começou. Este é exatamente o problema que a RFC identifica com "Inkwell" aparecendo em 7+ arquivos hoje.

**Sinal de alerta:** quando você copia um valor de um arquivo pra outro em vez de importar de uma fonte única.

### 3.3 Quando "não sei onde colocar"

Se você chega num ponto de dizer "não sei onde essa regra deveria viver", isso é um dos maiores sinais de entropia arquitetural. A causa raiz pode ser:

- Fronteiras mal definidas entre módulos
- Domínios sobrepostos (dois módulos "donos" da mesma coisa)
- Falta de dono claro

**Ação:** antes de colocar em qualquer lugar, pare e defina a fronteira. Adicionar a regra no lugar errado é pior do que não ter a regra — porque cria precedente.

---

## 4. Observabilidade (quando o projeto crescer)

> "Se eu não consigo observar, eu não controlo."

Hoje o projeto é um site estático simples. Mas se crescer para ter APIs, formulários com backend, ou features dinâmicas, observabilidade deixa de ser opcional.

### 4.1 Estado explícito

Evitar estado implícito ou lógica baseada em "aconteceu antes". Preferir:

- Status claros (`PENDING`, `COMPLETED`, `FAILED`)
- Eventos registrados
- Dados deriváveis a partir do estado atual, não do histórico

### 4.2 Idempotência

Se repetir uma ação, o sistema não quebra. Scripts de build, geração de tipos, validação de locales — todos devem ser idempotentes. Rodar duas vezes produz o mesmo resultado que rodar uma vez.

### 4.3 Logs estruturados e tracing

Quando houver backend:

- Cada request com um correlation ID único (reconstruir a história inteira)
- Logs estruturados (JSON, não texto livre)
- Métricas de saúde do sistema

Ferramentas já documentadas no projeto: Datadog (ver `docs/rfc-arquitetura-modular.md`, seção de ferramentas).

---

## 5. Organização e Decisões

> "Sem dono, tudo vira responsabilidade de ninguém."

### 5.1 Dono claro por domínio

Mesmo com um dev só, documentar quem decide o quê evita decisões conflitantes ao longo do tempo. Os docs em `docs/` servem esse papel — cada plano define o escopo e as decisões de um domínio.

| Domínio | Documento dono |
|---------|----------------|
| Arquitetura geral | `docs/rfc-arquitetura-modular.md` |
| Separação conteúdo/layout | `docs/plano-separar-conteudo-layout.md` |
| i18n | `docs/plano-i18n-modular.md` |
| Governança e anti-entropia | Este documento |

### 5.2 Decisões explícitas

Decisões arquiteturais importantes devem ser documentadas com o **porquê**, não só o **quê**. A RFC já faz isso bem (ex: "por que i18n custom em vez de react-i18next"). Manter esse padrão.

Se no futuro o projeto crescer, considerar ADRs (Architecture Decision Records) formais — um arquivo por decisão, com contexto, alternativas consideradas, e decisão final.

### 5.3 Autonomia com limites

Se outros devs entrarem no projeto:

- Cada dev pode decidir dentro do domínio que é dono
- Contratos entre domínios são acordados (ex: a forma do `Comic` em `contracts/types.ts`)
- Mudanças que cruzam fronteiras exigem alinhamento

---

## 6. Checklist Rápido

Antes de qualquer mudança, perguntar:

- [ ] **Onde vive essa regra?** Se não sei, definir a fronteira primeiro
- [ ] **Estou duplicando algo?** Se sim, extrair pra fonte única
- [ ] **Segue as convenções?** Naming, estrutura, padrões existentes
- [ ] **Tem como validar?** Tipo, teste, script de validação
- [ ] **O próximo dev (ou eu em 3 meses) vai entender?** Se não, a convenção está fraca

---

## Modelo Mental — Resumo

| Regra | Aplicação |
|-------|-----------|
| Todo sistema tende ao caos se você não colocar limites | Padrões + convenções como limites explícitos |
| Cada nova possibilidade precisa de uma regra pra existir | Se pode ser feito de dois jeitos, escolher e documentar um |
| Arquitetura é o ato de reduzir entropia | Cada decisão é uma restrição intencional |
| A regra vive onde a mudança dói menos | Ownership claro por domínio |
| Se eu não consigo observar, eu não controlo | Testes, tipos, validação, logs |
| Sem dono, tudo vira responsabilidade de ninguém | Documentos donos por domínio |
