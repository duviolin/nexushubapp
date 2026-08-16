# 🚀 Roadmap Android Senior Specialist 2026: Da Fundação à Maestria

Este roadmap é um guia de engenharia. Para cada tópico, escalamos do conceito fundamental (**Simples**) ao domínio de plataforma (**Avançado**), integrando "Kotlin Internals" e a evolução arquitetural necessária para cada nível.

---

## ☕ FASE 0: Kotlin Moderno (A Base do Especialista)
*Um especialista entende o que o código se torna após a compilação.*

### 🟢 Simples (Fundação Sênior)
- **Null Safety:** Operadores `?.`, `?:`, `!!` e por que o Smart Cast falha em propriedades mutáveis (`var`).
- **Standard Functions:** Uso idiomático de `let`, `run`, `apply`, `also` e `with`.
- **Coleções:** Uso eficiente de `filter`, `map`, `flatMap` e a diferença de performance entre `List` e `Sequence`.

### 🔴 Avançado (Nível Specialist)
- **Inline, Noinline & Crossinline:** Otimização de bytecode, escape de escopo e o custo real de lambdas na memória.
- **Value Classes:** Otimização de heap evitando alocação de objetos para tipos primitivos embrulhados.
- **Context Receivers:** Como estruturar código que exige múltiplos contextos (Ex: `context(Context, Logger)`) sem passar parâmetros.
- **Delegated Properties:** Criar delegates customizados para gerenciar estado ou persistência local (Ex: `by preference()`).

---

## 🏗️ FASE 1: Arquitetura e Fluxo de Dados (MVVM ➔ MVI)
*Transição da observação de estado simples para o fluxo unidirecional (UDF) rígido.*

### 🏛️ Evolução Arquitetural
- **Simples (MVVM):** ViewModel expondo múltiplos `StateFlows` (Ex: `isLoading`, `data`). Lógica de negócio no Repository. Separação básica de camadas.
- **Avançado (MVI/Clean):** Um único **UiState** imutável, exaustivo e tipado. A UI dispara **Actions/Intents**. ViewModel usa um `Reducer` para gerar o novo estado e isola `SideEffects` (eventos one-shot como navegação/toast).
- **Domain Layer Specialist:** UseCases em Kotlin puro (sem dependência de Android) para testabilidade 100% isolada e reuso em KMP.

---

## 🎨 FASE 2: O Motor do Jetpack Compose (Layouts ➔ Internals)
*Sair do "desenhar telas" para "otimizar o motor de renderização".*

### 🟢 Simples (Fundação)
- **Recomposição:** O que a gatilha e como o Compose decide o que redesenhar (Smart Recomposition).
- **State Hoisting:** Tornar composables "stateless" para facilitar testes e reuso.
- **Remember & Saveable:** Gerenciar memória local vs sobrevivência à morte do processo.

### 🔴 Avançado (Especialista)
- **Compose Phases:** Otimização via "Deferred Reading" (leitura de estado apenas na fase de *Drawing* ou *Layout* usando lambdas para pular a composição).
- **Stability Analysis:** Uso do `compiler reports` para identificar parâmetros instáveis e forçar `@Stable` ou usar `Immutable Collections`.
- **Custom UI:** Implementação de `Layout { ... }` para medições manuais e `Canvas` para desenhos complexos de alta performance.

---

## 🌊 FASE 3: Coroutines & Flow (Assincronismo ➔ Engenharia)
*Dominar a concorrência sem introduzir race conditions.*

### 🟢 Simples (Assincronismo Base)
- **Scopes:** Diferença real entre `viewModelScope`, `lifecycleScope` e `GlobalScope`.
- **Dispatchers:** Uso correto de `Main`, `IO` e `Default`.
- **Flow Básico:** Coleta segura com `collectAsStateWithLifecycle()`.

### 🔴 Avançado (Engenharia de Concorrência)
- **Structured Concurrency:** Uso de `supervisorScope` para isolar falhas em tarefas paralelas.
- **Flow Operators Avançados:** `flatMapLatest` (cancelar buscas), `combine` (filtros), `distinctUntilChanged` e `buffer` (backpressure).
- **Under the Hood:** Entender a `Continuation` e a Máquina de Estados que o compilador gera para funções `suspend`.

---

## 🧪 FASE 4: Engenharia de Qualidade (Testes ➔ Regressão Visual)
*A confiança de que 1 pixel não mudará sem você saber.*

### 🟢 Simples (Base)
- **Unit Tests:** JUnit + MockK para testar lógica de ViewModels e UseCases.
- **UI Tests:** Testar cliques e visibilidade usando `ComposeTestRule`.

### 🔴 Avançado (Specialist Quality)
- **Screenshot Testing:** Implementação de **Paparazzi** ou **Roborazzi** para garantir regressão visual zero.
- **MockWebServer:** Testar a camada de Network simulando erros reais do servidor, latência e timeouts.
- **Integration Tests:** Banco de dados Room real (em memória) para validar queries e migrações.

---

## 💾 FASE 5: Persistência e Integração com o SO (Data & Background)
*Onde o app encontra o sistema e os dados offline.*

### 🟢 Simples (Fundação)
- **Room:** CRUD básico, Entities e DAOs.
- **Permissions:** Solicitação de permissões em runtime e tratamento de negados.
- **WorkManager:** Execução de tarefas simples em background (ex: sync de logs).

### 🔴 Avançado (Nível Specialist)
- **Room Pro:** Migrações manuais, Full Text Search (FTS4), suporte a Paging 3 e relacionamentos N:N.
- **WorkManager Advanced:** Encadeamento de tarefas (Chains), restrições de rede/bateria e monitoramento de workers.
- **Foreground Services & Intents:** Lidar com serviços de primeiro plano no Android 14+ e comunicação via PendingIntents.
- **Scoped Storage & Photo Picker:** Acesso a arquivos e mídia respeitando as políticas de privacidade modernas do Android.

---

## ⚡ FASE 6: Performance e Segurança (Vitals ➔ Blindagem)
*Onde o sênior se torna Specialist.*

### 🟢 Simples (Monitoramento)
- **StrictMode:** Detectar operações pesadas na Main Thread em tempo de desenvolvimento.
- **LeakCanary:** Identificar vazamentos de memória básicos.

### 🔴 Avançado (Deep Engineering)
- **Baseline Profiles:** Otimizar o tempo de inicialização (Cold Start) via regras de compilação AOT (Ahead-of-Time).
- **Macrobenchmark:** Medir cientificamente o impacto de cada mudança em Frames (Jank) e CPU.
- **R8 Full Mode:** Ofuscação agressiva e remoção de código morto (Tree Shaking).
- **Play Integrity API:** Blindar o app contra execução em dispositivos com Root ou binários alterados.

---

## 📦 FASE 7: Modularização e Plataforma (Módulos ➔ KMP)
*Escalando para times e outras plataformas.*

### 🟢 Simples (Organização)
- **Version Catalog:** Centralizar versões no `libs.versions.toml`.
- **Feature Modules:** Separar código por funcionalidade básica.

### 🔴 Avançado (Engenharia de Plataforma)
- **Convention Plugins:** Centralizar a lógica de build em Kotlin DSL em `build-logic`.
- **Visibility Control:** Uso do modificador `internal` para esconder implementações da Data Layer e expor apenas interfaces no módulo `:api`.
- **Kotlin Multiplatform (KMP):** Módulo `:shared` rodando lógica de negócio no Android e iOS simultaneamente.

---

## 🤖 FASE 8: Inteligência Artificial On-Device (O Futuro)
*O especialista integra modelos localmente para privacidade e performance.*

### 🔴 Avançado (Nível Specialist)
- **Gemini Nano & AICore:** Integração com modelos de linguagem locais para summarização e smart reply.
- **MediaPipe:** Implementação de visão computacional (detecção de objetos, face mesh) e processamento de áudio em tempo real.
- **TensorFlow Lite & NPU:** Otimização e quantização de modelos para execução eficiente na NPU do dispositivo.

---

## 📱 FASE 9: Interfaces Adaptativas e Continuidade (Multi-Device)
*Apps que se moldam a qualquer tela e contexto.*

### 🔴 Avançado (Nível Specialist)
- **WindowSizeClasses:** Arquitetura de UI que reage dinamicamente a `Compact`, `Medium` e `Expanded`.
- **Foldables & Dual-Screen:** Gestão de estados de dobradura (Postures) e uso da biblioteca `WindowManager`.
- **App Continuity:** Sincronização de estado para transição suave entre dispositivos.

---

## 🎭 FASE 10: Animações de Alto Nível e UX (Polimento)
*A diferença entre "funciona" e "encanta".*

### 🔴 Avançado (Nível Specialist)
- **Shared Element Transitions:** Transições fluidas entre telas no Compose Navigation.
- **AGSL Shaders:** Criação de efeitos visuais personalizados (blur dinâmico, distorção, gradientes animados) via shaders.
- **MotionLayout no Compose:** Orquestração de animações complexas baseadas em estados.

---

## ☁️ FASE 11: Firebase & Cloud Infrastructure (O Ecossistema)
*Escalando a infraestrutura e observabilidade com serviços gerenciados.*

### 🟢 Simples (Fundação)
- **Firebase Auth:** Login social e persistência de sessão.
- **Crashlytics:** Monitoramento de erros em tempo real e análise de stack traces.
- **Cloud Messaging (FCM):** Envio e recebimento de notificações push básicas.

### 🔴 Avançado (Nível Specialist)
- **Remote Config & A/B Testing:** Experimentos controlados para validar features e otimizar UX (ex: testar diferentes prompts de IA).
- **Firebase App Check:** Proteção contra abusos usando Play Integrity para validar que as requisições vêm do seu app original.
- **Firestore & Realtime Sync:** Arquitetura offline-first com concorrência e regras de segurança granulares.
- **Firebase Test Lab:** Automação de testes em dispositivos reais na nuvem (Robo tests e Instrumentation).
- **Performance Monitoring:** Traces customizados para medir tempo de carregamento de modelos de IA e latência de rede.

---

## ✅ Definição de Pronto (DoD) para ser Especialista
1. [ ] Explica como o `suspend` funciona (máquina de estados) internamente.
2. [ ] Reduziu o tempo de inicialização do app usando Baseline Profiles.
3. [ ] Criou um componente de UI customizado que não usa Column/Row/Box.
4. [ ] O APK gerado é ilegível para ferramentas de engenharia reversa (R8 verificado).
5. [ ] Implementou um fluxo MVI completo com testes de Flow (Turbine) e Visual (Screenshot).
6. [ ] Implementou um modelo de IA local (Gemini/MediaPipe) sem chamadas de rede.
7. [ ] O app suporta layout adaptativo real para Foldables e Tablets.
8. [ ] Criou uma transição de elementos compartilhados fluida entre duas telas.
9. [ ] Configurou Firebase Auth, FCM, App Check e A/B Testing integrados ao fluxo de CI/CD.
10. [ ] Criou uma sincronização de dados robusta com Room + WorkManager e tratamento de permissões 13+.
11. [ ] Rodou testes de instrumentação no Firebase Test Lab garantindo estabilidade em múltiplos devices.
