# 📅 Cronograma de Execução Ultra-Detalhado: Nexus Hub (30 Dias)

Este cronograma transforma o **Master Blueprint** em uma trilha de aprendizado prático diário. Cada dia foca em um incremento técnico real, sincronizado com as fases do seu Roadmap 2026.

---

## 🏗️ SEMANA 1: Engenharia de Fundação (Roadmap Fases 0, 1, 6, 7)
*Objetivo: Criar um ecossistema de build que suporte escala e rigor arquitetural.*

*   **Dia 1: O Coração do Build (Version Catalog)**
    *   **Tarefa:** Migrar todas as dependências para `libs.versions.toml`.
    *   **Detalhe Specialist:** Configurar Bundles (ex: `compose-bundle`) para simplificar o consumo nos módulos. Limpar o `build.gradle` da raiz para usar apenas plugins.
*   **Dia 2: Arquitetura Multi-Módulo (Estrutura de Pastas)**
    *   **Tarefa:** Criar módulos `:core:common`, `:core:ui`, `:core:network` e `:core:database`.
    *   **Detalhe Specialist:** Definir as regras de visibilidade: módulos `:feature` não podem se enxergar entre si, apenas via `:api`.
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

---

## 🌊 SEMANA 2: Data Engineering & Resiliência (Roadmap Fases 3, 5, 11)
*Objetivo: Garantir que o app funcione perfeitamente sem rede e sincronize dados de forma inteligente.*

*   **Dia 8: Camada de Rede & Resiliência (OkHttp & Retrofit)**
    *   **Tarefa:** Implementar as chamadas para NewsAPI e HackerNews usando `Kotlinx Serialization`.
    *   **Detalhe Specialist:** Configurar `OkHttp Interceptors` avançados: **Retry Dinâmico** (Exponential Backoff), **Offline Cache Control** e injeção segura de Header de API Key.
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
    *   **Tarefa:** Integrar login social e sincronizar a lista de "Lidos depois".
    *   **Detalhe Specialist:** Implementar regras de segurança no Firestore para proteger os dados do usuário.
*   **Dia 14: Structured Concurrency & Race Conditions**
    *   **Tarefa:** Refatorar repositories usando `flatMapLatest` para evitar resultados de buscas obsoletas.
    *   **Detalhe Specialist:** Testar cenários de timeout e perda de conexão usando `MockWebServer`.

---

## 🎨 SEMANA 3: UX Sensorial & Acessibilidade (Roadmap Fases 2, 9, 10)
*Objetivo: Criar uma interface premium, inclusiva e que performe em qualquer tela.*

*   **Dia 15: Design System & Acessibilidade (NexusUI)**
    *   **Tarefa:** Definir Tokens de Design e componentes base (Cards, Buttons) com foco em inclusão.
    *   **Detalhe Specialist:** Implementar suporte rigoroso a **TalkBack (Semantics)**, contraste dinâmico e suporte a fontes escaláveis.
*   **Dia 16: Compose Performance & Estabilidade**
    *   **Tarefa:** Rodar o `compiler report` e garantir que todos os modelos de dados sejam `@Immutable`.
    *   **Detalhe Specialist:** Usar `rememberUpdatedState` em callbacks para evitar recomposições desnecessárias.
*   **Dia 17: Otimização de Fases do Compose**
    *   **Tarefa:** Refatorar o cabeçalho do feed para usar lambdas em modificadores de desenho.
    *   **Detalhe Specialist:** Pular as fases de Composição/Layout para atingir 120 FPS estáveis no scroll.
*   **Dia 18: Shared Element Transitions**
    *   **Tarefa:** Implementar a transição da imagem da notícia entre o Feed e a tela de leitura.
    *   **Detalhe Specialist:** Sincronizar o tempo da animação com a navegação do Compose.
*   **Dia 19: AGSL Shaders & Efeitos Visuais**
    *   **Tarefa:** Criar um shader de Blur progressivo que reage à posição do scroll.
    *   **Detalhe Specialist:** Garantir que as animações respeitem a configuração de "Reduzir Movimento" do sistema.
*   **Dia 20: MotionLayout & Gestos Complexos**
    *   **Tarefa:** Criar a animação de "Swipe to Archive" no feed de notícias.
    *   **Detalhe Specialist:** Integrar animações de física (Spring) para um toque natural e responsivo.
*   **Dia 21: Interfaces Adaptativas & Continuidade**
    *   **Tarefa:** Implementar o layout `List-Detail` usando `WindowSizeClass`.
    *   **Detalhe Specialist:** Garantir a continuidade de estado ao dobrar/desdobrar o dispositivo (Foldables).

---

## 🤖 SEMANA 4: Inteligência & Especialização (Roadmap Fases 4, 5, 6, 8)
*Objetivo: Blindar o app, automatizar a qualidade e adicionar a camada de IA local.*

*   **Dia 22: Gemini Nano (AICore) Integration**
    *   **Tarefa:** Implementar a sumarização de notícias local.
    *   **Detalhe Specialist:** Lidar com o ciclo de vida do modelo AICore e gerenciar estados de indisponibilidade.
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
    *   **Tarefa:** Criar screenshots de referência com **Roborazzi** e configurar a automação no CI/CD.
    *   **Detalhe Specialist:** Setup de Pipeline no GitHub Actions incluindo **Detekt** (Linter), **Checkstyle** e relatórios de cobertura com **Kover**.
*   **Dia 27: Baseline Profiles & AOT Compilation**
    *   **Tarefa:** Gerar e empacotar o perfil de compilação para otimizar o startup do app.
    *   **Detalhe Specialist:** Validar a redução de frames perdidos na primeira abertura pós-instalação.
*   **Dia 28: Macrobenchmark & Monitoramento Científico**
    *   **Tarefa:** Escrever testes de performance que medem Startup e Scroll cientificamente.
    *   **Detalhe Specialist:** Analisar o impacto do R8 Full Mode no tamanho e performance do binário.
*   **Dia 29: Firebase Remote Config & Growth**
    *   **Tarefa:** Criar testes A/B para validar hipóteses de UX e IA.
    *   **Detalhe Specialist:** Implementar "Feature Flags" seguras para Kill Switch de funcionalidades em tempo real.
*   **Dia 30: The Final Specialist Review**
    *   **Tarefa:** Checklist final do DoD, auditoria de segurança e limpeza de código.
    *   **Detalhe Specialist:** Gerar documentação técnica de decisões arquiteturais (ADRs) para o portfólio.
