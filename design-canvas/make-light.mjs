// Gera as variantes de tema claro a partir dos artboards escuros.
// Substituição por token (papel), não por tinta — espelha a "tabela irmã" do NEXUS_HUB_DESIGN.md.
import { readFileSync, writeFileSync } from 'node:fs';

const SCREENS = ['Main', 'Reader', 'Filters', 'Profile', 'FeedStates', 'ReaderAI', 'ListDetail', 'Catalog', 'Account'];

// ordem importa: tints primeiro, depois âmbar-como-texto (qualificado), depois canais e sólidos.
const MAP = [
  // realce âmbar em chips/unread — sobe o tint para ler bem sobre marfim
  ['rgba(232,184,109,0.16)', 'rgba(232,184,109,0.30)'],
  ['rgba(232,184,109,0.10)', 'rgba(232,184,109,0.20)'],
  ['rgba(232,184,109,0.08)', 'rgba(232,184,109,0.16)'],
  // âmbar como TEXTO/ícone/traço -> âmbar profundo (contraste WCAG sobre claro). Fills #E8B86D ficam.
  ['color: #E8B86D', 'color: #8A5510'],
  ['color:#E8B86D', 'color:#8A5510'],
  ['stroke="#E8B86D"', 'stroke="#8A5510"'],
  ['fill="#E8B86D"', 'fill="#8A5510"'],
  ['border-top-color: #E8B86D', 'border-top-color: #8A5510'],
  ['border-top-color:#E8B86D', 'border-top-color:#8A5510'],
  // acento via CSS var como TEXTO/ícone (telas com :root) -> âmbar profundo. Fills usam var(--accent) e ficam.
  ['color: var(--accent)', 'color: #8A5510'],
  ['stroke="var(--accent)"', 'stroke="#8A5510"'],
  ['fill="var(--accent)"', 'fill="#8A5510"'],
  ['#f0c98a', '#6E4109'],            // hover de link
  // navbar translúcida
  ['rgba(18,17,15,', 'rgba(244,239,229,'],
  // skeletons de loading
  ['#26241f', '#EFE9DC'],
  ['#211f1b', '#E7E0D2'],
  ['#1f1e1a', '#EAE3D5'],
  // superfícies
  ['#0b0a09', '#E5DDCD'],            // fundo dos boards
  ['#1C1B18', '#FBF7EF'],            // surfaceContainer (cards/sheet/phone)
  ['#1c1b18', '#FBF7EF'],
  ['#12110F', '#F4EFE5'],            // surface + fades
  // danger terroso mais profundo
  ['#C4593E', '#A6412A'],
  ['#c4593e', '#A6412A'],
  // texto sólido marfim -> grafite
  ['#EDE6D9', '#241F18'],
  // texto marfim com alfa -> grafite com alfa (mesmo alfa)
  ['rgba(237,230,217,', 'rgba(31,27,21,'],
  // outline branco -> outline grafite
  ['rgba(255,255,255,', 'rgba(26,20,12,'],
];

for (const name of SCREENS) {
  let src = readFileSync(`${name}.dc.html`, 'utf8');
  for (const [a, b] of MAP) src = src.split(a).join(b);
  // capas (imagens) permanecem escuras — são fotos; não invertem. Nada a fazer.
  writeFileSync(`${name}Light.dc.html`, src);
  console.log(`wrote ${name}Light.dc.html`);
}
