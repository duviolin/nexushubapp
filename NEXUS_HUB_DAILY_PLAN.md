# 📅 Cronograma de Execução Ultra-Detalhado: Nexus Hub (30 Dias)

Este cronograma transforma o **Master Blueprint** em uma trilha de aprendizado prático diário. Cada dia foca em um incremento técnico real, sincronizado com as fases do seu Roadmap 2026 **e ancorado num artboard concreto do [`design-canvas/`](design-canvas/)** (o objetivo final do produto).

> **Como ler este plano** — 🎨 **Design:** aponta o(s) artboard(s) que aquela entrega precisa reproduzir. Você constrói o código à mão; a IA orienta e revisa. Abra `design-canvas/nexus-hub-telas.html` ao lado do editor e persiga o pixel.
>
> **Escopo honesto:** o design é maior do que 30 dias de *técnicas isoladas*. Onde uma técnica e uma tela concreta coincidem, a tela é o entregável do dia (a técnica é o "como"). Dias marcados com **➕** agregam telas/estados do design que não existiam no plano original — se faltar tempo, eles viram a "Semana 5" de acabamento, não são cortados.

---

## 🏗️ SEMANA 1: Engenharia de Fundação (Roadmap Fases 0, 1, 6, 7)
*Objetivo: Criar um ecossistema de build que suporte escala e rigor arquitetural.*

*   **Dia 1: O Coração do Build (Version Catalog)**
    *   **Tarefa:** Migrar todas as dependências para `libs.versions.toml`.
    *   **Detalhe Specialist:** Configurar Bundles (ex: `compose-bundle`) para simplificar o consumo nos módulos. Limpar o `build.gradle` da raiz para usar apenas plugins.
*   **Dia 2: Arquitetura Multi-Módulo (Estrutura de Pastas)**
    *   **Tarefa:** Criar módulos `:core:common`, `:core:ui`, `:core:network` e `:core:database`.
    *   **Detalhe Specialist:** Definir as regras de visibilidade: módulos `:feature` não podem se enxergar entre si, apenas via `:api`.
    *   ➕ **Token bootstrap (pré-requisito de UI):** semear em `:core:ui` um `NexusTheme` mínimo com as cores e a tipografia extraídas dos artboards — antes de qualquer tela existir. Só os tokens, ainda sem componentes.
    *   🎨 **Design:** `Palette.dc.html` (grafite `#12110F`, marfim `#EDE6D9`, âmbar `#E8B86D`) · `Typography.dc.html` (Newsreader serif / IBM Plex Sans / IBM Plex Mono).
*   **Dia 3: Convention Plugins (Build Logic)**
    *   **Tarefa:** Implementar plugins em Kotlin DSL no diretório `build-logic`.
    *   **Detalhe Specialist:** Criar o `AndroidApplicationConventionPlugin` e o `AndroidLibraryComposeConventionPlugin` para centralizar as regras de minSdk, compileSdk e Compose options.
*   **Dia 4: O Contrato MVI & Resiliência (Base Architecture)**
    *   **Tarefa:** Criar as interfaces `UiState`, `UiIntent`, `UiEffect` e a `BaseViewModel`.
    *   **Detalhe Specialist:** Integrar o `SavedStateHandle` no `BaseViewModel` para persistência automática contra **Process Death**. Implementar o `StateFlow` com `SharingStarted.WhileSubscribed(5000)`.
*   **Dia 5: Injeção de Dependência de Elite (Hilt)**
    *   **Tarefa:** Configurar `@HiltAndroidApp` e provisão de Singletons no módulo `:core:common`.
    *   **Detalhe Specialist:** Implementar módulos Hilt específicos para `:network` e `:database` com escopos controlados.
*   **Dia 6: Kotlin Specialist (Internals na Prática)**
    *   **Tarefa:** Criar `Value Classes` para IDs e configurar o primeiro `Context Receiver` para o sistema de logs.
    *   **Detalhe Specialist:** Refatorar utilitários usando `extension functions` e `inline classes` para evitar alocações desnecessárias no Heap.
*   **Dia 7: Milestone 1 - Build & Test Checkpoint**
    *   **Tarefa:** Validar se o app compila com a nova estrutura e rodar um teste unitário no `Reducer` do MVI.
    *   ➕ **Smoke visual:** subir uma tela de **Login** estática só com os tokens (sem lógica) para provar que `NexusTheme` reproduz o clima do design nos dois temas. 🎨 **Design:** `LoginDark.dc.html` / `LoginLight.dc.html`.

---

## 🌊 SEMANA 2: Data Engineering & Resiliência (Roadmap Fases 3, 5, 11)
*Objetivo: Garantir que o app funcione perfeitamente sem rede e sincronize dados de forma inteligente.*

*   **Dia 8: Camada de Rede & Resiliência (OkHttp & Retrofit)**
    *   **Tarefa:** Implementar as chamadas para as **quatro fontes do design** — **Hacker News**, **NewsAPI**, **RSS** e os **salvos** — usando `Kotlinx Serialization`. Cada fonte vira um `chip` no feed.
    *   **Detalhe Specialist:** Configurar `OkHttp Interceptors` avançados: **Retry Dinâmico** (Exponential Backoff), **Offline Cache Control** e injeção segura de Header de API Key. RSS exige um parser/conversor próprio (XML), não JSON.
    *   🎨 **Design:** os chips de fonte e o selo por card aparecem em `Main.dc.html` (Feed) e `Filters.dc.html`.
*   **Dia 9: Database Specialist (Room & FTS4)**
    *   **Tarefa:** Criar entidades de `Article` e o DAO com suporte a busca `FTS4`.
    *   **Detalhe Specialist:** Implementar conversores de tipos customizados e validar migrações de banco de dados.
*   **Dia 10: Single Source of Truth (SSoT)**
    *   **Tarefa:** Implementar o `Repository` que expõe um `Flow<List<Article>>` vindo do Room.
    *   **Detalhe Specialist:** A rede nunca fala direto com a UI; ela apenas alimenta o banco de dados.
*   **Dia 11: Paging 3 & RemoteMediator**
    *   **Tarefa:** Configurar o scroll infinito orquestrado pelo banco de dados.
    *   **Detalhe Specialist:** Lidar com estados de erro e "Append/Prepend" na lista de notícias de forma reativa.
*   **Dia 12: WorkManager & Sync de Background**
    *   **Tarefa:** Criar o `SyncWorker` para buscar notícias enquanto o device carrega.
    *   **Detalhe Specialist:** Implementar `Expedited Jobs` para sincronizações urgentes iniciadas pelo usuário.
*   **Dia 13: Firebase Auth & Firestore**
    *   **Tarefa:** Integrar login social e sincronizar a lista de "Ler depois". Ligar o fluxo de auth à tela de **Login** e expor os dados na tela de **Perfil**.
    *   **Detalhe Specialist:** Implementar regras de segurança no Firestore para proteger os dados do usuário.
    *   🎨 **Design:** `LoginDark/Light.dc.html` (auth) · `Account.dc.html` (perfil/conta) · `Profile.dc.html` (lista Ler depois).
*   **Dia 14: Structured Concurrency & Race Conditions**
    *   **Tarefa:** Refatorar repositories usando `flatMapLatest` para evitar resultados de buscas obsoletas.
    *   **Detalhe Specialist:** Testar cenários de timeout e perda de conexão usando `MockWebServer`.

---

## 🎨 SEMANA 3: UX Sensorial & Acessibilidade (Roadmap Fases 2, 9, 10)
*Objetivo: transformar os artboards do canvas em Compose real — as telas núcleo, os estados e o Catalog que prova o DS.*

*   **Dia 15: Design System & Componentes base (NexusUI)**
    *   **Tarefa:** Elevar o `NexusTheme` (semeado no Dia 2) a DS completo e construir os componentes do `:core:ui` **1:1 com as specs**: `NexusButton`, `ArticleCard`, entradas, navegação (`NexusTopBar`/`BottomNav`), `StatePanel`.
    *   **Detalhe Specialist:** Cada componente com `Semantics`/**TalkBack**, contraste WCAG e `fontScale` escalável. KDoc = contrato de uso (do/don't).
    *   ➕ **Nexus Catalog:** montar o Storybook interno que renderiza cada componente em todos os estados — é o critério de "pronto" do DS. 🎨 **Design:** `SpecButton`, `SpecCard`, `SpecInputs`, `SpecNav`, `SpecFeedback`, `Catalog.dc.html`.
*   **Dia 16: Tela Feed + Performance & Estabilidade** ➕
    *   **Tarefa:** Montar a **tela Feed** real (chips de fonte, cards com/sem capa, estado lido/não-lido) consumindo o `Flow` do Dia 10/11.
    *   **Detalhe Specialist:** Rodar o `compiler report`, garantir modelos `@Immutable` e usar `rememberUpdatedState` em callbacks para eliminar recomposições no scroll.
    *   🎨 **Design:** `Main.dc.html` / `MainLight.dc.html`.
*   **Dia 17: Tela Reader + Otimização de Fases do Compose** ➕
    *   **Tarefa:** Montar a **tela Reader** (manchete serifada, corpo legível) e refatorar o cabeçalho para ler estado só na fase de *Drawing* (lambdas em modificadores).
    *   **Detalhe Specialist:** Pular Composição/Layout para atingir 120 FPS estáveis no scroll do artigo.
    *   🎨 **Design:** `Reader.dc.html` / `ReaderLight.dc.html`.
*   **Dia 18: Shared Element Transitions (Feed → Reader)**
    *   **Tarefa:** Implementar a transição da capa da notícia entre o Feed e o Reader.
    *   **Detalhe Specialist:** Sincronizar o tempo da animação com a navegação do Compose.
    *   🎨 **Design:** faixa "shared element" em `Motion.dc.html`.
*   **Dia 19: AGSL Shaders & Estados de tela cheia** ➕
    *   **Tarefa:** Criar o shader de **Blur progressivo** que reage ao scroll **e** cablear os quatro `StatePanel` (loading com skeleton, empty, offline, error) nas telas de dados.
    *   **Detalhe Specialist:** Todo estado tem no máximo **um** `NexusButton`; nada de spinner central solto. Respeitar **"Reduzir Movimento"** (sem blur/animações quando ativo).
    *   🎨 **Design:** `Motion.dc.html` (blur/reduce-motion) · `FeedStates.dc.html` / `FeedStatesLight.dc.html`.
*   **Dia 20: MotionLayout, Gestos & Filtros** ➕
    *   **Tarefa:** Animação de **Swipe-to-Archive** no feed (física de `Spring`) e a **tela/bottom-sheet de Filtros**.
    *   **Detalhe Specialist:** Toque natural e responsivo; o filtro alimenta o `flatMapLatest` do Dia 14.
    *   🎨 **Design:** `Motion.dc.html` (swipe-to-archive) · `Filters.dc.html` / `FiltersLight.dc.html`.
*   **Dia 21: Interfaces Adaptativas & Insets**
    *   **Tarefa:** Implementar o layout `List-Detail` com `WindowSizeClass` e o edge-to-edge via `NexusScaffold`.
    *   **Detalhe Specialist:** Continuidade de estado ao dobrar/desdobrar (Foldables); lista ~360–420dp + artigo persistente.
    *   🎨 **Design:** `ListDetail.dc.html` / `ListDetailLight.dc.html` · `Insets.dc.html`.

---

## 🤖 SEMANA 4: Inteligência & Especialização (Roadmap Fases 4, 5, 6, 8)
*Objetivo: Blindar o app, automatizar a qualidade e adicionar a camada de IA local.*

*   **Dia 22: Gemini Nano (AICore) Integration**
    *   **Tarefa:** Implementar a sumarização local do artigo dentro do Reader, com o cartão de **Sumário IA** e seus três estados: *available*, *loading* e *unavailable* (fallback).
    *   **Detalhe Specialist:** Lidar com o ciclo de vida do modelo AICore e gerenciar estados de indisponibilidade sem quebrar a leitura.
    *   🎨 **Design:** `ReaderAI.dc.html` / `ReaderAILight.dc.html`.
*   **Dia 23: MediaPipe & Inteligência de Visão**
    *   **Tarefa:** Classificar imagens de notícias para gerar tags automáticas.
    *   **Detalhe Specialist:** Executar a inferência em uma thread de background dedicada (NPU-ready).
*   **Dia 24: IA Fallback & Estratégia de Bateria**
    *   **Tarefa:** Criar a lógica que desliga a IA se a bateria estiver em modo de economia.
    *   **Detalhe Specialist:** Medir o impacto da IA no consumo de recursos do sistema em tempo real.
*   **Dia 25: Segurança de Elite (App Check)**
    *   **Tarefa:** Integrar o App Check com Play Integrity para proteger os serviços do Firebase.
    *   **Detalhe Specialist:** Implementar o "Handshake" inicial e bloqueio de dispositivos comprometidos.
*   **Dia 26: Testes Visuais & Pipeline Specialist**
    *   **Tarefa:** Criar screenshots de referência com **Roborazzi** — usando o **Nexus Catalog** (Dia 15) como superfície de captura — e configurar a automação no CI/CD.
    *   **Detalhe Specialist:** Setup de Pipeline no GitHub Actions incluindo **Detekt** (Linter), **Checkstyle** e relatórios de cobertura com **Kover**. O delta visual compara contra o canvas.
*   **Dia 27: Baseline Profiles & AOT Compilation**
    *   **Tarefa:** Gerar e empacotar o perfil de compilação para otimizar o startup do app.
    *   **Detalhe Specialist:** Validar a redução de frames perdidos na primeira abertura pós-instalação.
*   **Dia 28: Macrobenchmark & Monitoramento Científico**
    *   **Tarefa:** Escrever testes de performance que medem Startup e Scroll cientificamente.
    *   **Detalhe Specialist:** Analisar o impacto do R8 Full Mode no tamanho e performance do binário.
*   **Dia 29: Firebase Remote Config & Growth**
    *   **Tarefa:** Criar testes A/B para validar hipóteses de UX e IA.
    *   **Detalhe Specialist:** Implementar "Feature Flags" seguras para Kill Switch de funcionalidades em tempo real.
*   **Dia 30: Publicação & Final Specialist Review**
    *   **Tarefa:** Rodar o **DoD do produto** (checklist do `NEXUS_HUB_PLAN.md`), auditoria de segurança e limpeza de código.
    *   ➕ **Kit da Play Store:** aplicar o **ícone adaptativo** e exportar da página *Loja* do canvas o **feature graphic**, os **5 screenshots** e a **ficha PT+EN** — todos já desenhados.
    *   **Detalhe Specialist:** Gerar documentação de decisões arquiteturais (ADRs) para o portfólio.
    *   🎨 **Design:** `AppIcon.dc.html` · `FeatureGraphic.dc.html` · `StoreScreens.dc.html` · `StoreListing.dc.html` (ver também `studies/PLAY_STORE_RELEASE.md`).
