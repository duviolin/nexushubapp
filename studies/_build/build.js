#!/usr/bin/env node
/**
 * Montador da apostila "Estudos Android".
 * Fonte = fragmentos HTML em studies/content/ (o corpo de cada artigo).
 * Saída = studies/index.html + studies/pages/NN.html (com sidebar + navegação).
 *
 * Sem dependências. Para regenerar tudo:
 *     node studies/_build/build.js
 *
 * Para adicionar um artigo: crie content/NN-slug.html (copie content/_TEMPLATE.html),
 * some uma entrada no array `articles` abaixo, e rode este script.
 * A ordem do array É a sequência de estudo (sidebar, numeração e prev/próximo).
 */
const fs = require('fs');
const path = require('path');

const STUDIES = path.resolve(__dirname, '..');
const CONTENT = path.join(STUDIES, 'content');
const PAGES = path.join(STUDIES, 'pages');
fs.mkdirSync(PAGES, { recursive: true });

// ─── manifesto: a ordem aqui é a trilha de estudos ──────────────────────────
const articles = [
  { frag: '01-gradle.html',       emoji: '🐘', nav: 'Gradle por Dentro',            desc: 'O motor de build: tasks, dependências, configuration cache e o que realmente roda quando você aperta ▶.' },
  { frag: '02-sdk.html',          emoji: '🧰', nav: 'Android SDK & Setup',          desc: 'O “almoxarifado da fábrica”: SDK, platform-tools, emuladores (AVD) e o ambiente que compila o app.' },
  { frag: '03-android-studio.html', emoji: '🛠️', nav: 'Android Studio a Fundo',      desc: 'A bancada do dev, de iniciante a especialista: estrutura do projeto, navegação, debug (breakpoints condicionais, logpoints, Evaluate), profiling (CPU/memória/leaks), emulador, testes e Git pela IDE.' },
  { frag: '04-edge-to-edge.html', emoji: '📐', nav: 'Edge-to-Edge & Telas Grandes', desc: 'Os mandatos da Google: desenhar sob as barras do sistema e não travar orientação em telas grandes.' },
  { frag: '05-densidade.html',    emoji: '📏', nav: 'Densidade & Tamanhos de Tela', desc: 'O guia adaptável: dp, densidade, grade de 8dp, alvo de toque de 48dp e as Window Size Classes.' },
  { frag: '06-compose.html',      emoji: '🎨', nav: 'Jetpack Compose',              desc: 'A UI como função do estado, do básico ao fundo: composables e Modifier, o modelo de layout (incl. ConstraintLayout e Layout custom), estado, recomposição/estabilidade, side-effects, performance, animação e efeitos visuais.' },
  { frag: '07-material.html',     emoji: '🧩', nav: 'Material 3 & Design',          desc: 'O sistema de design do Android: cor por papel, dynamic color, type scale, forma, componentes prontos e layout adaptativo para telas grandes.' },
  { frag: '08-acessibilidade.html', emoji: '♿', nav: 'Acessibilidade',             desc: 'O app que todo mundo usa: árvore de semântica e TalkBack, contraste, alvo de toque, escala de fonte, foco e como testar a acessibilidade.' },
  { frag: '09-play-store.html',   emoji: '🚀', nav: 'Publicar na Google Play',       desc: 'Da conta de desenvolvedor à faixa de produção: keystore, assinatura, versionamento e envio.' },
  { frag: '10-git-ci.html',       emoji: '🔁', nav: 'Git & Esteira de Entrega',       desc: 'Do commit à loja sem tocar em nada: Git no dia a dia, Git Flow, e a esteira de CI/CD com lint, Detekt, Sonar e deploy na Play.' },
  { frag: '11-qualidade.html',    emoji: '🔬', nav: 'Qualidade sob Medida',           desc: 'Configurar Lint, Detekt, ktlint e Sonar para pegar o que importa — e o baseline que adota tudo isso num projeto legado sem parar o mundo.' },
  { frag: '12-ofuscacao.html',    emoji: '🕶️', nav: 'Encolher & Ofuscar (R8)',        desc: 'O que o R8 faz no release, por que o app quebra só em produção, keep rules, @Keep e como ler um crash ofuscado com o mapping.txt.' },
  { frag: '13-arquitetura.html',   emoji: '🏛️', nav: 'Arquitetura & Código Limpo',    desc: 'Camadas, MVI/UDF, Repository, UseCase, Hilt e a Regra da Dependência — a arquitetura Android que aguenta crescer, do básico à modularização.' },
  { frag: '14-padroes.html',       emoji: '🧱', nav: 'Padrões de Projeto',             desc: 'Do GoF ao MVI: MVVM × MVI lado a lado, e os padrões (Builder, Factory, Singleton, Observer, Strategy…) que o Android SDK já usa por você — quando aplicar e quando o Kotlin dissolve o padrão.' },
  { frag: '15-testes.html',        emoji: '🧪', nav: 'Testes no Android',              desc: 'Da pirâmide ao Robot Pattern: test doubles (fake/stub/mock), como testar cada camada e cada componente Compose com JUnit5, Turbine, Robolectric e screenshot testing.' },
  { frag: '16-ia-claude-code.html', emoji: '🤖', nav: 'Desenvolver com IA',            desc: 'A oficina do agente de código: o loop e o custo do modelo, contexto, memória, skills e o squad de um dev só (PO→Tech→Dev→QA) aplicado ao repositório Android.' },
  { frag: '17-sdd-tdd-bdd.html',   emoji: '📐', nav: 'SDD · TDD · BDD',                desc: 'Dirigir a IA por especificação: o que é “pronto” antes de gerar código — spec, ciclo red-green-refactor, Given-When-Then e como se encaixam com DDD e Clean.' },
];

const pageFile = (a) => a.frag; // páginas usam o mesmo nome do fragmento

// Rodapé de transparência — honesto sobre o processo (IA + curadoria humana).
const DISCLAIMER = 'Material de estudo escrito com <strong>auxílio de IA</strong>, sob <strong>curadoria e revisão</strong> de Eduardo; diagramas autorais. Pode conter imprecisões — confirme sempre na <a href="https://developer.android.com" target="_blank" rel="noopener">documentação oficial</a>. Código-fonte no <a href="https://github.com/duviolin/nexushubapp" target="_blank" rel="noopener">GitHub</a>.';

function sidebar(currentIdx) {
  const items = articles.map((a, i) => {
    const active = i === currentIdx ? ' class="active"' : '';
    return `    <a href="${pageFile(a)}"${active}><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="e">${a.emoji}</span><span class="t">${a.nav}</span></a>`;
  }).join('\n');
  return `  <nav class="side">
    <a class="brand" href="../index.html">🎓 Estudos Android<small>NexusHub</small></a>
${items}
    <a class="guide" href="_guia.html">✍️ Guia de autoria</a>
  </nav>`;
}

function pager(i) {
  const prev = i > 0 ? articles[i - 1] : null;
  const next = i < articles.length - 1 ? articles[i + 1] : null;
  const prevHtml = prev
    ? `<a class="pg prev" href="${pageFile(prev)}"><span>← Anterior</span><strong>${prev.emoji} ${prev.nav}</strong></a>`
    : `<a class="pg prev" href="../index.html"><span>Início</span><strong>↩ Índice da trilha</strong></a>`;
  const next2 = next
    ? `<a class="pg next" href="${pageFile(next)}"><span>Próximo →</span><strong>${next.emoji} ${next.nav}</strong></a>`
    : `<a class="pg next" href="../index.html"><span>Fim da trilha 🎉</span><strong>↩ Voltar ao índice</strong></a>`;
  return `    <nav class="pager">\n      ${prevHtml}\n      ${next2}\n    </nav>`;
}

function page(i) {
  const a = articles[i];
  const body = fs.readFileSync(path.join(CONTENT, a.frag), 'utf8').trim();
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${a.nav} · Estudos Android</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<button class="menu-btn" onclick="document.body.classList.toggle('nav-open')" aria-label="Abrir menu">☰</button>
<div class="scrim" onclick="document.body.classList.remove('nav-open')"></div>
${sidebar(i)}
<main>
  <p class="crumb">Artigo <strong>${i + 1}</strong> de ${articles.length} · trilha de estudos</p>
  <article class="content">
${body}
  </article>
${pager(i)}
  <footer class="site-disclaimer">${DISCLAIMER}</footer>
</main>
</body>
</html>`;
}

for (let i = 0; i < articles.length; i++) {
  fs.writeFileSync(path.join(PAGES, pageFile(articles[i])), page(i));
  console.log('pages/' + pageFile(articles[i]));
}

// ─── index.html (hub) ───────────────────────────────────────────────────────
const cards = articles.map((a, i) => `      <a class="card" href="pages/${pageFile(a)}">
        <div class="card-top"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="emoji">${a.emoji}</span></div>
        <h3>${a.nav}</h3>
        <p>${a.desc}</p>
        <span class="go">Abrir artigo →</span>
      </a>`).join('\n');

const index = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Estudos Android · NexusHub</title>
<link rel="stylesheet" href="pages/style.css">
</head>
<body class="home">
<main class="home-main">
  <header class="hero">
    <span class="hero-badge">🎓 Trilha de estudos · projeto NexusHub</span>
    <h1>Android <span>nativo</span>, do build à Play Store</h1>
    <p>Os <strong>${articles.length} artigos</strong> que sustentam a construção do <strong>NexusHub</strong> — um app real de portfólio. Cada tema no nível que um <em>especialista</em> precisa saber, do motor de build à publicação. Leitura em sequência: comece pelo topo e siga a numeração.</p>
  </header>

  <section class="intro">
    <div class="intro-head">
      <h2>O projeto: <span>NexusHub</span></h2>
      <p>Um <strong>leitor editorial de notícias técnicas com IA on-device</strong>: agrega Hacker News, NewsAPI, RSS e artigos salvos num feed calmo e legível, e usa <strong>Gemini Nano</strong> para resumir artigos <em>localmente</em>, sem enviar dados à nuvem. Premium, adaptativo (celular → tablet/foldable) e acessível. Esta trilha é o <strong>companheiro de estudo</strong> por trás dele.</p>
    </div>
    <div class="intro-grid">
      <div class="intro-card"><h3>🎯 Objetivo</h3><p>Consolidar a maestria <strong>Senior Android Specialist</strong> na prática — escrever o código fase a fase, do zero à <strong>publicação na Play Store</strong>.</p></div>
      <div class="intro-card"><h3>📱 O produto</h3><p>Telas núcleo (Feed, Reader, Filtros, Perfil, Login), estados de tela cheia, sumário por IA e layout <strong>adaptativo</strong> — em dark &amp; light.</p></div>
      <div class="intro-card"><h3>🎨 Design é a fonte da verdade</h3><p>A identidade <strong>NexusUI</strong> (grafite quente, acento âmbar, manchetes serifadas, zero gradiente) vive em ~40 artboards de alta fidelidade que o Compose persegue pixel a pixel.</p></div>
      <div class="intro-card"><h3>📚 Estes 17 artigos</h3><p>A teoria-base de cada fase — Gradle, IDE, Compose, arquitetura, testes, IA — do <strong>iniciante ao especialista</strong>, com diagramas autorais.</p></div>
    </div>
    <p class="intro-note"><strong>Stack:</strong> Kotlin 2 · Jetpack Compose · MVI + Clean Architecture · multi-módulo + Version Catalog · Gemini Nano · Room/WorkManager/Paging · Firebase · Baseline Profiles · &nbsp;·&nbsp; <a href="https://github.com/duviolin/nexushubapp" target="_blank" rel="noopener">Código no GitHub</a> · <a href="https://github.com/duviolin/nexushubapp/blob/main/NEXUS_HUB_ROADMAP.md" target="_blank" rel="noopener">Roadmap (11 fases)</a></p>
  </section>

  <h2 class="grid-title">A trilha · <span>${articles.length} artigos</span></h2>
  <section class="grid">
${cards}
  </section>
  <footer class="site-disclaimer">${DISCLAIMER}</footer>
</main>
</body>
</html>`;
fs.writeFileSync(path.join(STUDIES, 'index.html'), index);
console.log('index.html');
