# 🧭 Nexus Hub — Roadmap Especialista Consolidado (Fundação → Play Store)

> **Documento mestre.** Consolida a visão de produto, o design, o roadmap de engenharia e as
> correções de senioridade num só plano por **fases com portão de conclusão (DoD)**. É por aqui
> que se estuda e amadurece o projeto — uma fase de cada vez, do zero até a loja.
>
> Substitui, na prática, o par `NEXUS_HUB_PLAN.md` (blueprint conceitual) + `NEXUS_HUB_DAILY_PLAN.md`
> (granularidade diária), que passam a ser **anexos de consulta**. O estado de execução vive em
> `NEXUS_HUB_PROGRESS.md`.

---

## 🎯 O produto (em uma frase)
Um **leitor editorial de notícias técnicas com IA on-device**: agrega **Hacker News, NewsAPI, RSS**
e os **salvos** num feed calmo (identidade NexusUI), e resume artigos com **Gemini Nano** sem enviar
dados à nuvem. Premium, adaptativo (celular → tablet/foldable), acessível e **publicável**.

**O design é a fonte da verdade** — [`design-canvas/`](design-canvas/) (`nexus-hub-telas.html`). A
implementação persegue os artboards pixel a pixel. Feature nunca escreve hex/dp cru: tudo vem de tokens.

---

## 🧑‍🏫 Princípios que pautam TODA decisão (o "filtro especialista")
1. **Projeto hands-on.** Você escreve o código. A IA orienta, revisa e desbloqueia — não implementa por você.
2. **Prova por medição, não por stack list.** Toda alegação de performance/IA/adaptativo termina em **número** (Macrobenchmark, jank%, cold start ms), não em adjetivo.
3. **Espelho de referência: [Now in Android](https://github.com/android/nowinandroid).** Este app é exatamente o domínio do app oficial do Google — decisões arquiteturais se ancoram nele.
4. **Padrão atual, não legado.** KSP (não KAPT), context parameters (não context receivers instáveis como flex), Kotlin/Compose atualizados.
5. **Portões (DoD) fecham a fase.** Não se avança para a próxima fase com o portão anterior aberto. Cada portão é objetivo e verificável.

### Legenda
🎯 objetivo · 🧠 conceitos especialistas · 🛠️ stack/decisões · 🎨 artboards · 🚪 **Portão (DoD)** · ⏱️ esforço aproximado

---

## 🗺️ Visão geral das fases

| # | Fase | Foco | Portão fecha quando… |
|:--|:--|:--|:--|
| **0** | Fundação de Build & Módulos | Gradle, KSP, grafo de módulos, convention plugins | `build` verde + grafo `model/domain/data/feature` correto |
| **1** | Arquitetura MVI & Domínio | UDF, BaseViewModel, process-death, UseCases puros | reducer testado + resiliência a morte de processo |
| **2** | Design System NexusUI | tokens, componentes `:core:ui`, Catalog, a11y | Catalog cobre todos os `Spec*`, dark ↕ light |
| **3** | Dados & Resiliência | 4 fontes (+RSS), Room FTS4, SSoT, Paging, sync | app funciona **offline** + sync em background |
| **4** | Telas & Fluxo | Feed, Reader, Filtros, Ler depois, Perfil, Login | telas batem com o canvas; todo estado é StatePanel |
| **5** | Movimento & Adaptativo | shared element, swipe, AGSL, List-Detail, insets | adaptativo em medium/expanded + reduce-motion |
| **6** | Inteligência On-Device | Gemini Nano, MediaPipe, fallback | resumo funciona **e** degrada com elegância |
| **7** | Segurança & Cloud | Firebase Auth/Firestore, App Check, Remote Config | dados protegidos + kill switch remoto |
| **8** | Qualidade & Performance científica | CI, testes, Baseline Profiles, Macrobenchmark | CI verde com gates + número antes/depois |
| **9** | Publicação Play Store | ícone, assets, ficha, signing, AAB | AAB assinado + kit do canvas exportado |

---

## 🏗️ FASE 0 — Fundação de Build & Módulos
🎯 Um build que escala e um grafo de módulos que honra Clean Architecture. ⏱️ ~4 dias

- 🧠 Version Catalog + bundles · convention plugins em `build-logic` (Kotlin DSL) · regras de visibilidade entre módulos · **KSP** no lugar de KAPT.
- 🛠️ **Decisões já tomadas (correções de senioridade):**
  - Trocar `kotlin-kapt` → **KSP** (Room + Hilt).
  - Criar os módulos que faltam, espelhando o NiA: **`:core:model`** (data classes puras), **`:core:domain`** (UseCases, Kotlin puro sem Android), **`:core:data`** (repositórios/SSoT), **`:core:datastore`**, **`:core:designsystem`** (= atual `:core:ui`), **`:feature:*`** (feed, reader, saved, filters, account, login), **`:core:testing`**, **`:benchmark`**.
  - `build-logic` com plugins: `nexus.android.application`, `nexus.android.library`, `nexus.android.compose`, `nexus.jvm.library`, `nexus.android.hilt`, `nexus.android.room`.
  - Regra dura: `:feature:*` **não** dependem entre si; comunicam via `:core:domain`/navegação.
- 🚪 **Portão 0:** `./gradlew build` verde · KAPT eliminado · grafo com `model/domain/data/feature` criado · um convention plugin aplicado em ≥2 módulos (prova de reuso) · zero repetição de config de Android nos `build.gradle.kts`.

---

## 🧱 FASE 1 — Arquitetura MVI & Domínio
🎯 Um contrato de estado rígido e um domínio 100% testável. ⏱️ ~3 dias

- 🧠 UDF (`UiState` imutável/exaustivo, `UiIntent`, `UiEffect`) · `Reducer` puro · `BaseViewModel` com `StateFlow` + `SharingStarted.WhileSubscribed(5000)` · **Process-death** via `SavedStateHandle` · UseCases em Kotlin puro (reuso KMP futuro) · Hilt (escopos por módulo).
- 🛠️ Domínio mora em `:core:domain`; nada de Android nele (testa em JVM pura, rápido).
- 🎨 — (fase estrutural; sem tela dedicada)
- 🚪 **Portão 1:** teste unitário do `Reducer` (intent → estado esperado) verde · estado crítico sobrevive a `process-death` simulado (`SavedStateHandle`) · UseCase testado sem dependência de Android.

---

## 🎨 FASE 2 — Design System NexusUI
🎯 Transformar a fundação visual do canvas em `:core:designsystem`, provado pelo Catalog. ⏱️ ~3 dias

- 🧠 Tokens (cor/tipografia/espaço/forma) como **papel, não tinta** · componentes stateless · `Semantics`/TalkBack · contraste WCAG · `fontScale` escalável · KDoc = contrato (do/don't).
- 🛠️ `NexusTheme` (dark **e** light) + `NexusButton`, `ArticleCard`, entradas, `NexusTopBar`/`BottomNav`, `StatePanel` · **Nexus Catalog** (Storybook interno) como critério de "pronto".
- 🎨 `Palette`, `Typography`, `SpacingShape`, `SpecButton`, `SpecCard`, `SpecInputs`, `SpecNav`, `SpecFeedback`, `Catalog`.
- 🚪 **Portão 2:** cada componente do canvas existe no `:core:designsystem` e aparece no **Catalog** em todos os estados · dark ↕ light corretos · nenhuma feature escreve hex/dp cru (validado por Detekt regra custom ou revisão) · A11y: navegável por TalkBack.

---

## 🌊 FASE 3 — Dados & Resiliência
🎯 App que funciona sem rede e sincroniza sozinho. ⏱️ ~5 dias

- 🧠 OkHttp Interceptors (Retry/Exponential Backoff, Offline-Cache, Auth header) · **Room FTS4** (busca instantânea) · **SSoT** (rede alimenta o DB; UI só lê do DB) · **Paging 3 + RemoteMediator** · `flatMapLatest` (cancelar buscas) · `supervisorScope` (isolar falha por fonte) · **WorkManager** (`SyncWorker`, Expedited Jobs).
- 🛠️ Quatro fontes como o design pede: **Hacker News, NewsAPI, RSS (parser XML próprio), salvos** — cada uma vira um chip. Corrigir catálogo: usar Retrofit atual (o PLAN dizia "Retrofit 3"; alinhar versão real).
- 🎨 `Main` (chips/selo por card), `Filters`.
- 🚪 **Portão 3:** avião ligado (offline) → feed carrega do Room · sync roda em background e reflete na UI · busca FTS4 retorna instantânea · falha de uma fonte não derruba as outras (`supervisorScope`) · testado com **MockWebServer** (timeout/erro).

---

## 📱 FASE 4 — Telas & Fluxo
🎯 Montar as telas núcleo do canvas e a navegação entre elas. ⏱️ ~5 dias

- 🧠 Compose stability (`@Immutable`, `rememberUpdatedState`) · navegação type-safe · **todo estado de tela cheia é `StatePanel`** (loading com skeleton, empty, offline, error — máx. 1 botão), nunca spinner solto.
- 🛠️ Features: `feed`, `reader`, `filters`, `saved` (Ler depois), `account`, `login`.
- 🎨 `Main`, `Reader`, `Filters`, `Profile` (Ler depois), `Account`, `Login`, `FeedStates` — todos dark ↕ light.
- 🚪 **Portão 4:** as 6 telas batem com os artboards nos dois temas · navegação Feed→Reader e Login→app funcionando · todos os estados vazio/offline/erro são `StatePanel` · `compiler report` sem parâmetros instáveis nas listas.

---

## 🌀 FASE 5 — Movimento & Adaptativo
🎯 A camada sensorial e a adaptação a telas grandes/dobráveis. ⏱️ ~4 dias

- 🧠 **Compose Phases** (deferred reading via lambdas em modificadores) · Shared Element (Feed→Reader) · **AGSL** blur progressivo (API 33+, com degradação) · física `Spring` (swipe-to-archive) · `WindowSizeClass` + `material3-adaptive` (List-Detail) · edge-to-edge/insets pelo `NexusScaffold` · continuidade em foldables · **respeitar "Reduzir Movimento"**.
- 🎨 `Motion`, `ListDetail`, `Insets`.
- 🚪 **Portão 5:** medium/expanded mostra List-Detail (lista ~360–420dp + artigo persistente) · shared element sincronizado com a navegação · `reduce-motion` ativo desliga blur/animações · sem `jank` visível no scroll (confirmado por olho; medido na Fase 8).

---

## 🤖 FASE 6 — Inteligência On-Device
🎯 Resumo local do artigo com fallback honesto. ⏱️ ~3 dias

- 🧠 Ciclo de vida do modelo **AICore/Gemini Nano** · inferência em thread de background (NPU-ready) · **MediaPipe** (tags de imagem) · estratégia de bateria (desliga IA em economia) · fallback quando o device não suporta (a maioria não suporta).
- 🛠️ Cartão de **Sumário IA** com estados *available / loading / unavailable*.
- 🎨 `ReaderAI`.
- 🚪 **Portão 6:** resumo funciona em device suportado · em device não suportado, a tela **degrada com elegância** (estado unavailable, sem crash) · IA respeita modo economia de bateria.

---

## 🔐 FASE 7 — Segurança & Cloud
🎯 Proteger dados e ganhar controle remoto do produto. ⏱️ ~3 dias

- 🧠 **Firebase Auth** (login social) · **Firestore** (sync "Ler depois") com **regras de segurança** · **App Check + Play Integrity** (handshake, bloquear devices comprometidos) · **Remote Config** (feature flags, **kill switch**, A/B).
- 🎨 `Login`, `Account`.
- 🚪 **Portão 7:** regras do Firestore impedem acesso a dados de outro usuário (testado) · App Check ativo · uma feature atrás de flag com kill switch remoto funcionando.

---

## 🧪 FASE 8 — Qualidade & Performance científica
🎯 Automatizar a qualidade e provar performance com número. ⏱️ ~5 dias

- 🧠 **CI (GitHub Actions):** Detekt (lint) · **Kover** (cobertura) · **Roborazzi** (screenshot testing, capturando o **Catalog**) com bloqueio por delta visual · testes de Flow com **Turbine** · **MockWebServer** · **Baseline Profiles** (AOT) · **Macrobenchmark** (cold start + scroll) · **R8 full mode**.
- 🛠️ Metas viram números (substituir "120 FPS"): ex. *cold start p50 < N ms*, *jank < X%*, medidos em device declarado.
- 🚪 **Portão 8:** CI verde com gates (lint + testes + screenshot) · Baseline Profile empacotado com **número antes/depois** de startup · Macrobenchmark de scroll registrado · cobertura de domínio reportada por Kover.

---

## 🚀 FASE 9 — Publicação Play Store
🎯 Colocar na loja com o kit já desenhado. ⏱️ ~3 dias

- 🧠 Ícone adaptativo (fg/bg, safe-zone 66dp) · signing (keystore, Play App Signing) · **App Bundle (AAB)** · ficha nos limites de caracteres · faixas de teste (internal → closed → production).
- 🛠️ Exportar da página *Loja* do canvas: feature graphic 1024×500, 5 screenshots, ficha PT+EN. Guia em `studies/PLAY_STORE_RELEASE.md`.
- 🎨 `AppIcon`, `FeatureGraphic`, `StoreScreens`, `StoreListing`.
- 🚪 **Portão 9 (final):** AAB assinado gerado · kit visual exportado do canvas · ficha PT+EN dentro dos limites · **DoD do produto** (checklist em `NEXUS_HUB_PLAN.md`) 100% marcado · ADRs escritos para o portfólio.

---

## ✅ Rastreamento (marque ao fechar cada portão)
- [ ] **Portão 0** — Build & Módulos
- [ ] **Portão 1** — MVI & Domínio
- [ ] **Portão 2** — Design System
- [ ] **Portão 3** — Dados & Resiliência
- [ ] **Portão 4** — Telas & Fluxo
- [ ] **Portão 5** — Movimento & Adaptativo
- [ ] **Portão 6** — IA On-Device
- [ ] **Portão 7** — Segurança & Cloud
- [ ] **Portão 8** — Qualidade & Performance
- [ ] **Portão 9** — Publicação

> **Regra de progresso:** só marque um portão quando **todos** os seus critérios forem verificáveis por
> alguém além de você (teste, medição, screenshot). "Funciona na minha máquina" não fecha portão.
