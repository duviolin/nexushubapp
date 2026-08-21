# 🛡️ Projeto Nexus Hub: Master Blueprint (Android Specialist 2026)

Este documento é a especificação técnica definitiva para a construção do **Nexus Hub**. Ele mapeia cada uma das 11 fases do roadmap **Senior Specialist 2026** para aplicações práticas no projeto, detalhando os conceitos de engenharia de elite que serão aplicados.

---

## 🎯 Visão do Produto
O **Nexus Hub** é um **leitor editorial de notícias técnicas com inteligência on-device**. Ele agrega fontes técnicas (**Hacker News, NewsAPI, RSS** e os artigos **salvos** pelo usuário) num único feed calmo e legível, e usa IA local (**Gemini Nano**) para **resumir artigos sem enviar dados para a nuvem**. A experiência é premium, adaptativa (celular → tablet/foldable) e acessível.

> **A linguagem visual é o produto.** A identidade NexusUI — grafite quente `#12110F`, um único acento âmbar `#E8B86D`, manchetes serifadas (Newsreader) sobre IBM Plex Sans/Mono, zero gradiente — não é enfeite: é a tese do app (um leitor sóbrio, não um "feed massivo"). A visão de engenharia abaixo existe para **entregar essas telas**, não o contrário.

### 🧭 O design é a fonte da verdade
As telas de alta fidelidade em [`design-canvas/`](design-canvas/) (abra `nexus-hub-telas.html`) são o **objetivo final do produto**. A implementação em Compose (`:core:ui` + features) deve persegui-las pixel a pixel. Cada fase de engenharia aponta para um artboard concreto:

| Área do produto | Artboards de referência |
| :--- | :--- |
| **Fundação NexusUI** (tokens, tipografia, espaço/forma) | `Palette`, `Typography`, `SpacingShape` |
| **Componentes** (contrato do `:core:ui`) | `SpecButton`, `SpecCard`, `SpecInputs`, `SpecNav`, `SpecFeedback` |
| **Telas núcleo** (dark ↕ light) | `Main` (Feed), `Reader`, `Filters`, `Profile` (Ler depois), `Account`, `Login` |
| **Estados de tela cheia** (StatePanel) | `FeedStates` (loading/empty/offline/error), `ReaderAI` (sumário IA) |
| **Adaptativo** | `ListDetail`, `Insets`, `Catalog` (Storybook do DS) |
| **Motion** | `Motion` (press, swipe-to-archive, shared element, blur AGSL, reduce-motion) |
| **Marca & publicação** | `LogoSystem`, `AppIcon`, `FeatureGraphic`, `StoreScreens`, `StoreListing` |

**Regra de ouro:** feature nunca escreve hex nem `sp`/`dp` cru — tudo vem dos tokens do DS. Se um componente não tem spec no canvas, ele não entra no `:core:ui`.

---

## 🗺️ Mapa de Execução Técnica (Fase a Fase)

### ☕ FASE 0: Engenharia de Linguagem (Kotlin Moderno)
*   **Aplicação no Projeto:** Criação do módulo `:core:common` com utilitários de alta performance.
*   **Detalhes de Especialista:** 
    *   Uso de `Value Classes` para representar `ArticleId` e `UserId`, eliminando alocação de objetos no Heap e reduzindo o impacto no Garbage Collector.
    *   Implementação de `Context Receivers` (ex: `context(Logger, Analytics) fun trackClick()`) para gerenciar dependências transversais de forma limpa, sem poluir a assinatura das funções.
    *   Uso de `Delegated Properties` customizadas para gerenciar o estado do `DataStore` de preferências.
*   **Desafio Specialist:** Criar uma DSL interna para logging e analytics que utilize `Inline Classes` e `Reified Types` para máxima performance.

### 🏗️ FASE 1: Arquitetura de Estado (MVI & Resiliência)
*   **Aplicação no Projeto:** Estruturação de todas as Features (Feed, Reader, Profile).
*   **Detalhes de Especialista:** 
    *   Implementação do padrão **UDF (Unidirectional Data Flow)** com `UiState`, `UiIntent` e `UiEffect`.
    *   **Process Death Resilience:** Uso de `SavedStateHandle` no `ViewModel` para persistir estados críticos da UI, garantindo continuidade após a morte do processo pelo sistema.
    *   Criação de um `BaseViewModel` que utiliza o compilador do Kotlin para garantir que nenhum estado seja mutado fora do `Reducer`.
*   **Desafio Specialist:** Isolar 100% da lógica de negócio no módulo `:core:domain` usando apenas Kotlin puro, preparando o app para uma futura expansão KMP (Multiplatform).

### 🎨 FASE 2: Compose Internals & Performance
*   **Aplicação no Projeto:** Desenvolvimento do Design System `NexusUI` (tokens de `Palette`/`Typography`/`SpacingShape`) e das telas concretas do canvas (`Main`, `Reader`, `Filters`, `Profile`, `Account`, `Login`), validadas no **Nexus Catalog** (o Storybook que prova o DS — artboard `Catalog`).
*   **Nota de sequenciamento:** os **tokens** do NexusUI (cor, tipografia, espaço/forma) são pré-requisito de qualquer UI. Um `NexusTheme` mínimo semeado de `Palette.dc.html` + `Typography.dc.html` deve existir já na Semana 1, mesmo que o refino de performance do DS aconteça na Semana 3.
*   **Detalhes de Especialista:** 
    *   Uso de `Stability Analysis` via relatórios do compilador para identificar e corrigir parâmetros instáveis que causam recomposições.
    *   Otimização via **Deferred Reading**: usar lambdas em modificadores (ex: `Modifier.offset { ... }`) para pular as fases de Composição e Layout, executando apenas a fase de *Drawing*.
    *   **Acessibilidade (A11y):** Implementação rigorosa de `Semantics`, suporte a Screen Readers e adaptação para configurações de "Reduzir Movimento".
*   **Desafio Specialist:** Garantir que o feed de notícias mantenha 120 FPS constantes mesmo com imagens pesadas e animações de shader ativas.

### 🌊 FASE 3: Concorrência e Networking de Elite
*   **Aplicação no Projeto:** Camada de Network e Database.
*   **Detalhes de Especialista:** 
    *   **OkHttp Interceptors:** Implementação de `Retry` dinâmico (Exponential Backoff), `AuthInterceptor` para tokens e `OfflineCacheInterceptor` para servir cache quando a rede falhar.
    *   Uso de `flatMapLatest` no fluxo de busca para cancelar automaticamente requisições pendentes.
    *   Uso de `supervisorScope` no `Repository` para isolar falhas entre diferentes fontes de dados.
*   **Desafio Specialist:** Dominar a máquina de estados gerada pelo `suspend` para depurar race conditions complexas no cache local.

### 🧪 FASE 4: Engenharia de Qualidade & CI/CD
*   **Aplicação no Projeto:** Pipeline de Testes e Automação.
*   **Detalhes de Especialista:** 
    *   **Pipeline Specialist:** Configuração de GitHub Actions com `Detekt` (Linter), `Checkstyle` e `Kover` (Coverage).
    *   Implementação de **Screenshot Testing** com **Roborazzi** para validar o design visual.
    *   Uso de **MockWebServer** para simular falhas de rede e validar a resiliência do MVI.
*   **Desafio Specialist:** Configurar uma pipeline de CI que compare o "Delta" visual de cada PR e bloqueie alterações não aprovadas pelo time de Design.

### 💾 FASE 5: Persistência & Integração com o SO
*   **Aplicação no Projeto:** Cache offline e tarefas de background.
*   **Detalhes de Especialista:** 
    *   **Room FTS4:** Busca textual indexada para resultados instantâneos.
    *   **WorkManager Chaining:** Encadeamento de tarefas: `FetchData` -> `ProcessAI` -> `UpdateLocalDB`.
    *   **Scoped Storage & Photo Picker:** Acesso seguro a mídia respeitando as políticas de privacidade modernas do Android 14+.
*   **Desafio Specialist:** Implementar o Photo Picker e o Scoped Storage sem pedir permissões desnecessárias da galeria inteira.

---

## 🏗️ Stack Técnica Consolidada

| Camada | Tecnologia Specialist |
| :--- | :--- |
| **Arquitetura** | MVI + SavedStateHandle + Feature-API |
| **Networking** | OkHttp Interceptors + Retrofit 3 |
| **UI** | Compose (A11y, Internals, Shaders) |
| **IA** | Gemini Nano (AICore), MediaPipe |
| **Qualidade** | CI/CD (GitHub Actions), Roborazzi, Macrobenchmark |
| **Cloud** | Firebase App Check, Firestore, Remote Config |

---

## 🏁 O Resultado Final
O **Nexus Hub** será a prova viva de que você domina a plataforma Android além da superfície: um leitor de notícias técnicas que **parece exatamente com os artboards do `design-canvas/`**, roda IA on-device, adapta-se a foldables e está **pronto para a Play Store** (ícone, feature graphic, 5 screenshots e ficha PT+EN já desenhados na página *Loja*).

### ✅ Definition of Done do produto (bate com o design)
- [ ] `NexusTheme` com todos os tokens de `Palette`/`Typography`/`SpacingShape` — dark **e** light.
- [ ] Componentes do `:core:ui` cobertos pelo **Nexus Catalog** (1:1 com `Spec*`).
- [ ] Telas núcleo entregues nos dois temas: Feed, Reader, Filtros, Ler depois, Perfil, Login.
- [ ] Todo estado de tela cheia é um **StatePanel** (loading/empty/offline/error), nunca um spinner solto.
- [ ] **Sumário IA** (Gemini Nano) com estados available/loading/unavailable.
- [ ] Layout **List-Detail** em medium/expanded; edge-to-edge com insets pelo `NexusScaffold`.
- [ ] Motion: press, swipe-to-archive, shared element, blur AGSL — respeitando *reduce-motion*.
- [ ] Kit da Play Store exportado a partir da página *Loja* do canvas.

> **Este é um projeto de estudo hands-on: você escreve o código.** A IA orienta, revisa e desbloqueia — não implementa as telas por você. O canvas é o gabarito; cada dia abaixo é um incremento que você constrói com as próprias mãos.
