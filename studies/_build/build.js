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

// Slug estilo GitHub (mesmo esquema dos links #ancora escritos nos artigos):
// tira as tags inline, minúsculas, remove pontuação, espaços viram hífen — mantém acentos.
function slugify(html) {
  const text = html.replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  return text.toLowerCase().trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Injeta id="slug" em cada <h2>/<h3> para que os links #ancora entre artigos funcionem.
function addHeadingIds(body) {
  const seen = Object.create(null);
  return body.replace(/<(h[23])>([\s\S]*?)<\/\1>/g, (m, tag, inner) => {
    let slug = slugify(inner);
    if (!slug) return m;
    if (seen[slug] != null) { seen[slug] += 1; slug = `${slug}-${seen[slug]}`; }
    else { seen[slug] = 0; }
    return `<${tag} id="${slug}">${inner}</${tag}>`;
  });
}

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
  const body = addHeadingIds(fs.readFileSync(path.join(CONTENT, a.frag), 'utf8').trim());
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
<main class="home-main pf">

  <header class="pf-hero">
    <div>
      <span class="pf-hero-badge">👨‍💻 Portfólio · Android Specialist em formação</span>
      <h1>Eduardo <span>Lima</span></h1>
      <p class="pf-role">Senior Android Developer</p>
      <p>Engenheiro de computação com <strong>8+ anos</strong> de software, hoje construindo produtos financeiros de grande escala na <strong>Zup Innovation</strong> (projeto <strong>Banco Itaú</strong>). Aqui documento, em público, minha jornada rumo a <strong>especialista Android</strong> — estudando com IA e construindo um app de verdade do zero à Play Store.</p>
      <div class="pf-cta">
        <a class="pf-btn primary" href="#trilha">📚 Ver a trilha de estudos</a>
        <a class="pf-btn ghost" href="https://www.linkedin.com/in/eduardolima384" target="_blank" rel="noopener">in · LinkedIn</a>
        <a class="pf-btn ghost" href="https://github.com/duviolin" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>
    <figure class="pf-portrait">
      <img src="assets/fotos/terno.jpeg" alt="Retrato de Eduardo Lima Nascimento">
      <figcaption><strong>Eduardo Lima Nascimento</strong> · Tucuruí, PA 🇧🇷</figcaption>
    </figure>
  </header>

  <div class="pf-journey">
    <h3>A jornada: virar <span>especialista</span> estudando com IA 🤖</h3>
    <p>Em vez de guardar o aprendizado na gaveta, escrevo tudo em público: <strong>${articles.length} artigos</strong> do nível iniciante ao especialista, com diagramas autorais, e um app real (o <strong>NexusHub</strong>) sendo construído fase a fase. Se você também quer subir de nível em Android — ou ver como a IA acelera engenharia de verdade — <strong>acompanhe a jornada</strong>.</p>
    <div class="pf-cta" style="justify-content:center"><a class="pf-btn primary" href="#trilha">Começar pela trilha →</a></div>
  </div>

  <section class="pf-section" id="sobre">
    <span class="pf-eyebrow">Sobre mim</span>
    <h2 class="pf-h2">Quem está por <span>trás</span></h2>
    <div class="pf-about">
      <div>
        <h3>No trabalho</h3>
        <p>Senior Android Developer na <strong>Zup Innovation</strong>, desenvolvendo para o <strong>Banco Itaú</strong>. Construí do zero o módulo Android de <strong>Parcelamento Total de Faturas</strong> do app Itaú — da arquitetura à implementação, com autenticação, integrações, analytics, observabilidade e feature flags. Foco em <strong>Kotlin, Jetpack Compose, Clean Architecture/MVVM, acessibilidade</strong> e IA aplicada à engenharia. Também sou mentor do <strong>Campus Mobile</strong> (Claro + USP).</p>
        <h3>Fora do teclado</h3>
        <p>Amo <strong>tocar violino</strong>, e viver ao ar livre: <strong>natação, pedal, corrida</strong> e manobras radicais de <strong>BMX</strong>. Nas horas boas, uma <strong>cervejinha gelada</strong> e um <strong>bom churrasco</strong>. E o mais importante — tempo de qualidade com minha <strong>esposa e família</strong> (e o gato <strong>Will</strong> 🐱).</p>
        <div class="pf-tags">
          <span class="pf-tag">🎻 Violino</span><span class="pf-tag">🏊 Natação</span><span class="pf-tag">🚴 Pedal</span><span class="pf-tag">🏃 Corrida</span><span class="pf-tag">🚵 BMX</span><span class="pf-tag">🍺 Cerveja</span><span class="pf-tag">🔥 Churrasco</span><span class="pf-tag">🐱 Will</span>
        </div>
      </div>
      <div class="pf-gallery">
        <a class="pf-photo big" href="assets/fotos/violino.jpeg" target="_blank"><img src="assets/fotos/violino.jpeg" alt="Eduardo com o violino"><span>🎻 Violino</span></a>
        <a class="pf-photo" href="assets/fotos/pedal.jpeg" target="_blank"><img src="assets/fotos/pedal.jpeg" alt="Eduardo pedalando"><span>🚴 Pedal</span></a>
        <a class="pf-photo" href="assets/fotos/cerveja.jpeg" target="_blank"><img src="assets/fotos/cerveja.jpeg" alt="Eduardo com uma cerveja"><span>🍺 &amp; churrasco</span></a>
        <a class="pf-photo" href="assets/fotos/terno.jpeg" target="_blank"><img src="assets/fotos/terno.jpeg" alt="Eduardo de terno"><span>✨ Momentos</span></a>
        <a class="pf-photo" href="assets/fotos/street.jpeg" target="_blank"><img src="assets/fotos/street.jpeg" alt="Eduardo na rua"><span>🎨 Por aí</span></a>
      </div>
    </div>
  </section>

  <section class="pf-section" id="projetos">
    <span class="pf-eyebrow">Projetos</span>
    <h2 class="pf-h2">O que estou <span>construindo</span></h2>

    <div class="pf-project">
      <div class="pf-project-head"><h3>🛡️ NexusHub</h3><span class="pf-chip">Android nativo · em construção</span></div>
      <p>Um <strong>leitor editorial de notícias técnicas com IA on-device</strong>: agrega Hacker News, NewsAPI, RSS e artigos salvos num feed calmo e legível, e usa <strong>Gemini Nano</strong> para resumir artigos <em>localmente</em>, sem enviar dados à nuvem. Design-first (identidade <strong>NexusUI</strong>), adaptativo e acessível. As telas abaixo são o design de alta fidelidade que o Compose persegue pixel a pixel:</p>
      <div class="pf-phones">
        <div class="phone"><div class="phone-frame"><iframe src="design/Main.html" loading="lazy" title="Feed"></iframe></div><div class="phone-cap"><b>Feed</b>fontes + salvos</div></div>
        <div class="phone"><div class="phone-frame"><iframe src="design/ReaderAI.html" loading="lazy" title="Reader IA"></iframe></div><div class="phone-cap"><b>Reader · IA</b>sumário on-device</div></div>
        <div class="phone"><div class="phone-frame"><iframe src="design/Login.html" loading="lazy" title="Login"></iframe></div><div class="phone-cap"><b>Login</b>entrada</div></div>
        <div class="phone"><div class="phone-frame"><iframe src="design/Profile.html" loading="lazy" title="Perfil"></iframe></div><div class="phone-cap"><b>Perfil</b>conta &amp; ajustes</div></div>
      </div>
      <p style="font-size:.92rem"><strong>Stack:</strong> Kotlin 2 · Jetpack Compose · MVI + Clean Architecture · multi-módulo + Version Catalog · Gemini Nano · Room/WorkManager/Paging · Firebase · Baseline Profiles.</p>
      <div class="pf-project-links">
        <a class="pf-btn primary" href="#trilha">📚 A trilha por trás →</a>
        <a class="pf-btn ghost" href="https://github.com/duviolin/nexushubapp" target="_blank" rel="noopener">Código</a>
        <a class="pf-btn ghost" href="https://github.com/duviolin/nexushubapp/blob/main/NEXUS_HUB_ROADMAP.md" target="_blank" rel="noopener">Roadmap (11 fases)</a>
      </div>
    </div>

    <div class="pf-project">
      <div class="pf-project-head"><h3>🎼 Clave</h3><span class="pf-chip">Plataforma · em produção</span></div>
      <p><strong>Plataforma educacional</strong> completa — app <strong>Flutter</strong> + backend <strong>Node.js/Express</strong> com Prisma/PostgreSQL, dashboard e deploy contínuo. Um projeto de ponta a ponta (mobile + API + infra + CI/CD), mostrando que a régua de engenharia vale além do Android.</p>
      <p style="font-size:.92rem"><strong>Stack:</strong> Flutter · Riverpod · Retrofit · Node 22 · Express · Prisma · PostgreSQL · GitHub Actions · Coolify/Railway.</p>
      <div class="pf-project-links">
        <a class="pf-btn primary" href="https://clavedesales.com.br" target="_blank" rel="noopener">Visitar clavedesales.com.br →</a>
      </div>
    </div>
  </section>

  <section class="pf-section" id="trilha">
    <span class="pf-eyebrow">Trilha de estudos</span>
    <h2 class="pf-h2">Android nativo · <span>${articles.length} artigos</span></h2>
    <p class="pf-sub">Do motor de build à publicação na loja — cada tema no nível que um especialista precisa saber, com diagramas autorais. Leitura em sequência: comece pelo topo e siga a numeração.</p>
    <section class="grid">
${cards}
    </section>
  </section>

  <footer class="site-disclaimer">${DISCLAIMER}</footer>
</main>
</body>
</html>`;
fs.writeFileSync(path.join(STUDIES, 'index.html'), index);
console.log('index.html');
