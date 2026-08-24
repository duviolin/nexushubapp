# Curadoria & Revisão da Trilha — Estudos Android (NexusHub)

> Revisão completa dos 17 artigos: precisão técnica, ordem/cronologia, ajustes visuais e textuais.
> Data: 2026-08-24 · Revisor: Eduardo (curadoria) + IA (leitura assistida).

## Veredito geral

A trilha está **sólida e coerente**. O encadeamento "fio condutor" entre artigos é o
maior acerto: cada tema puxa o anterior (Gradle → SDK → Studio → UI → publicação →
esteira → qualidade → arquitetura → IA). Nível técnico condizente com "especialista".
Os problemas encontrados eram **de acabamento** (links quebrados por renumeração,
inconsistência de voz entre artigos antigos e novos), não de conteúdo — e os de maior
impacto já foram corrigidos nesta passagem.

---

## ✅ Corrigido nesta revisão

| # | Problema | Onde | Correção |
|---|----------|------|----------|
| 1 | **4 links quebrados** para `03-edge-to-edge.html` (o Android Studio entrou no slot 03 e o edge-to-edge virou 04) | `05-densidade.html` (linhas 2, 136, 384, 462) | Reapontados para `04-edge-to-edge.html` |
| 2 | **Deep-links `#secao` não resolviam** — o renderer não gerava `id` nos headings; 3 links entre artigos caíam no topo da página | `build.js` (global) | `slugify()` + `addHeadingIds()` injetam `id` estilo GitHub em todo `<h2>/<h3>` no build |
| 3 | **3 `<h1>` na mesma página** (as "PARTE 1/2" eram `<h1>`) — quebra hierarquia/semântica/SEO | `04-edge-to-edge.html` | "PARTE 1/2" → `<h2>` |
| 4 | **Texto de link stale**: `GRADLE_UNDER_THE_HOOD.md` (nome de arquivo antigo) como rótulo visível | `02-sdk.html` (rodapé) | Trocado por "artigo do Gradle" |
| 5 | **Caminho de máquina pessoal exposto** (`/Users/eduardolimanascimento/...`) — agora repo público | `02-sdk.html` (linha 15) | Genericizado para `~/Library/Android/sdk` |

Bugs de referência cruzada já corrigidos antes desta passagem (renumerações): ofuscação→09,
compose→04, qualidade→10, padrões→13.

---

## 🔶 Achados transversais (recomendações — não bloqueiam)

### A. Inconsistência de voz/estrutura entre "geração antiga" e "nova"
Dois estilos convivem na trilha:
- **Antigos** (01, 02, 04, 05, 09): seções numeradas `1. / 2.`, enquadramento "trilogia",
  sem "Glossário-relâmpago" (exceto 05).
- **Novos** (03, 06, 07, 08, 10, 13, 14, 15, 16, 17): "Parte N", callouts padronizados
  (🧠 Termo / ⚠️ Pegadinha / 🔒 Visão Specialist), "Checklist para o NexusHub" e
  "Glossário-relâmpago" no fim.

**Recomendação:** passar os 5 antigos para o padrão novo (Parte N + callouts + glossário).
Ganho de consistência alto, risco baixo. Prioridade média.

### B. "Fontes oficiais" só existe em 1 de 17 artigos
Apenas `04-edge-to-edge.html` fecha com uma lista de **Fontes oficiais** (links
developer.android.com). Para um portfólio voltado a recrutador, essa seção **aumenta
credibilidade** e mostra rigor.

**Recomendação:** adicionar um bloco curto "📚 Fontes oficiais" (3–6 links) ao fim de
cada artigo. Prioridade média-alta (barato e alto retorno de imagem).

### C. Tom do 09 (Play Store) destoa por baixo
O `09-play-store.html` é deliberadamente **para leigos absolutos** (ótimo didaticamente),
mas fica visivelmente mais "básico" que os vizinhos — sem os callouts 🔒 Visão Specialist
que dão profundidade ao resto.

**Recomendação:** manter a base acessível, mas somar 1–2 callouts de especialista
(ex.: estratégia de rollout gradual, gestão de `versionCode` em CI, Play App Signing key
rotation). Prioridade baixa.

### D. Sobreposição 10 (Git/CI · Parte 4) × 11 (Qualidade sob Medida)
Ambos cobrem Lint/Detekt/ktlint/Sonar. Hoje o 10 **introduz** e o 11 **configura a fundo**
— camadas aceitáveis, mas há risco de o leitor sentir repetição.

**Recomendação:** abrir o 11 reconhecendo explicitamente "o 10 mostrou *que* existe; aqui
é *como configurar sem travar o time*". Uma frase resolve. Prioridade baixa.

---

## 📄 Nota por artigo

| # | Artigo | Técnico | Notas |
|---|--------|:---:|-------|
| 01 | Gradle por Dentro | ✅ | Base forte. Estilo antigo (`1./2.`). Link de saída para SDK agora resolve. Sem glossário. |
| 02 | Android SDK & Setup | ✅ | Corrigido (caminho + rodapé). Estilo antigo. Bom "aterramento no ambiente real". |
| 03 | Android Studio a Fundo | ✅ | Excelente e único no mercado PT (debug/profiling nível sênior). Padrão novo. |
| 04 | Edge-to-Edge & Telas Grandes | ✅ | Corrigido (h1→h2). **Único com "Fontes oficiais"** — usar de modelo. |
| 05 | Densidade & Tamanhos | ✅ | Corrigido (4 links). Muito completo, tem glossário. Rodapé "trilogia" ok. |
| 06 | Jetpack Compose | ✅ | Aprofundado (layout complexo, ConstraintLayout, efeitos, recomposição/estabilidade). Longo — ok pela densidade. |
| 07 | Material 3 & Design | ✅ | Cobre cor por papel, dynamic color, type scale, adaptativo. Padrão novo. |
| 08 | Acessibilidade | ✅ | Semântica/TalkBack, contraste, foco, teste. Bem separado do 07 (decisão acertada). |
| 09 | Publicar na Google Play | ✅ | Correto e didático; tom mais básico (ver achado C). Regras 2026 (API 36) presentes. |
| 10 | Git & Esteira de Entrega | ✅ | Excelente. Git → Git Flow → CI/CD → Quality Gate → CD. Padrão novo. Ver achado D. |
| 11 | Qualidade sob Medida | ✅ | Config real de Lint/Detekt/Sonar + baseline p/ legado. Ver achado D. |
| 12 | Encolher & Ofuscar (R8) | ✅ | keep rules, @Keep, ler crash com mapping.txt. Bom gancho com 09/10. |
| 13 | Arquitetura & Código Limpo | ✅ | Aprofundado com base do "tio Bob" (círculos, SOLID, princípios de componente, Screaming Arch, Boy Scout). Long. |
| 14 | Padrões de Projeto | ✅ | MVVM×MVI + GoF **com exemplo de código por padrão**. Bom "quando o Kotlin dissolve o padrão". |
| 15 | Testes no Android | ✅ | Pirâmide, test doubles (fake/stub/mock/dummy/spy) + onde cada um encaixa, Robot Pattern. |
| 16 | Desenvolver com IA | ✅ | Excelente e original (loop/custo, contexto, memória, squad de 1 dev). |
| 17 | SDD · TDD · BDD | ✅ | Fecha a trilha ligando spec→teste→comportamento com a IA. Encadeia com 16/15/13. |

---

## 🗺️ Ordem & cronologia da trilha

A sequência está **bem pensada**. Todas as referências "para frente" que sobraram são
seguras (o artigo citado sempre vem *antes*, exceto menções conceituais). Fluxo:

```
Fundamentos de build   01 Gradle → 02 SDK → 03 Android Studio
UI & design            04 Edge-to-edge → 05 Densidade → 06 Compose → 07 Material 3 → 08 Acessibilidade
Entrega                09 Play Store → 10 Git/CI → 11 Qualidade → 12 R8
Engenharia             13 Arquitetura → 14 Padrões → 15 Testes
IA aplicada            16 Desenvolver com IA → 17 SDD/TDD/BDD
```

Único ponto de atenção de ordem: **10 (CI) usa Sonar/Quality Gate antes de 11 (Qualidade)
configurá-los a fundo**. Funciona como "panorama → detalhe", mas vale a frase-ponte do
achado D. Nenhuma reordenação necessária.

---

## 🎯 Backlog priorizado (o que fazer depois)

1. **[Média-alta]** Adicionar "📚 Fontes oficiais" ao fim de todos os artigos (modelo: 04).
2. **[Média]** Harmonizar voz dos 5 antigos (01,02,04,05,09) para o padrão "Parte N" +
   callouts + Glossário-relâmpago.
3. **[Baixa]** 1–2 callouts de especialista no 09 (Play).
4. **[Baixa]** Frase-ponte no início do 11 reconhecendo o 10.
5. **[Nice-to-have]** Botão "voltar ao topo" e/ou TOC lateral nos artigos longos (06, 13).
