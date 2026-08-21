# Nexus Hub — Design Canvas

Mockups de alta fidelidade das telas do app na linguagem **NexusUI**.
A fonte da verdade do sistema visual (cor, tipografia, espaço/forma) são os artboards da página
**Identidade & fundação** — comece por `Palette.dc.html`. São o norte visual/UX que a implementação
em Compose (`:core:ui` + features) deve perseguir.

## Como visualizar

Abra **apenas** o canvas unificado — ele junta todos os artboards numa só página navegável:

```bash
open nexus-hub-telas.html
```

Os arquivos `*.dc.html` soltos são as peças-fonte (uma por artboard); não os abra individualmente.
`nexus-hub-telas.html` é um snapshot: se editar um `.dc.html`, regenere com `seed-canvas.mjs`.

## Conteúdo

- `*.dc.html` — artboards-fonte (cada tela é um arquivo). `*Light.dc.html` são as variantes de tema claro.
- `canvas.json` — layout do canvas: páginas + posição de cada artboard.
- `make-light.mjs` — gera as variantes de tema claro a partir das escuras (mapeamento por token).
- `nexus-hub-telas.html` — canvas unificado (gerado; abra este para visualizar tudo).

## Páginas

| Página | Telas |
| :--- | :--- |
| Identidade & fundação | Paleta/cor, tipografia, espaço·forma·elevação |
| Componentes · specs | NexusButton, ArticleCard, entradas, navegação, feedback |
| Telas · escuro ↕ claro | Feed, Reader, Filtros, Ler depois, Perfil, Login (nos dois temas) |
| Estados · escuro ↕ claro | StatePanel (loading/empty/offline/error), sumário IA |
| Adaptativo | List-Detail (tablet/foldable), edge-to-edge & insets, Nexus Catalog |
| Motion & interações | press, swipe-to-archive, shared element, blur AGSL, reduce-motion |
| Marca & lojas | direções de logo, sistema de marca, ícone, feature graphic, screenshots, ficha |

## Regenerar o tema claro

```bash
node make-light.mjs
```
