# Nexus Hub — Design Canvas

Mockups de alta fidelidade das telas do app na linguagem **NexusUI** (ver [../NEXUS_HUB_DESIGN.md](../NEXUS_HUB_DESIGN.md)).
São o norte visual/UX que a implementação em Compose (`:core:ui` + features) deve perseguir.

## Conteúdo

- `*.dc.html` — artboards-fonte (cada tela é um arquivo). `*Light.dc.html` são as variantes de tema claro.
- `canvas.json` — layout do canvas: páginas + posição de cada artboard.
- `make-light.mjs` — gera as variantes de tema claro a partir das escuras (mapeamento por token).

## Páginas

| Página | Telas |
| :--- | :--- |
| Telas · escuro | Feed, Reader, Filtros, Perfil, Login, estados (StatePanel), sumário IA |
| Adaptativo + Fundação | List-Detail (tablet/foldable), Edge-to-edge & insets, Nexus Catalog |
| Tema claro (irmão) | as 8 telas + Login no tema claro |
| Motion & interações | press, swipe-to-archive, shared element, blur AGSL, reduce-motion |

## Regenerar o tema claro

```bash
node make-light.mjs
```
