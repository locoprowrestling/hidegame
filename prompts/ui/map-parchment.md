# UI — Map Overlay Parchment

> **SIZE: 320 × 200 pixels exactly. Landscape. No alpha — fully opaque.**
>
> **STYLE: Pixel art. Hard-aliased pixels. Banded shading. No anti-aliasing.**
>
> **FORMAT: PNG, 8-bit RGB.**

Background sheet for the held-Tab map overlay (`_drawFullMap` in
`renderer.js`), replacing the flat `rgba(0,0,0,0.86)` dim. The renderer
draws **on top of** this image:

- The floor plan (coloured wall tiles), centred — up to 190 × 140 px
- Gold item dots `#c0a060`, blue stair squares `#4499ff`, white player dot,
  red GM dot `#ff2200`
- `MAP 2.4s [2 left]` countdown text above the plan, legend row below

So the sheet must be **dark**: the central 240 × 150 px must stay at or
below **18% brightness** or the markers stop reading. All visual interest
lives at the edges and corners.

---

## Prompt

Pixel art background for a retro horror game's map screen — an old hand-drawn
building survey sheet, seen flat-on, filling the whole frame. Very dark, as
if read by candlelight. Hard aliased pixels, flat colour bands, no
anti-aliasing, no gradients, no blur, no readable text.

**Base sheet:** aged paper gone almost black with soot. Base fill `#14100c`,
with large irregular patches of `#181410` and `#100c08` (flat, hard-edged
blobs 20–60 px across — staining, not gradient). A faint surveyor's grid of
1 px lines in `#1c1610` every 16 px across the whole sheet — barely visible.

**Edges (outermost 12 px on all sides):** the paper is scorched. Irregular
1–3 px steps of `#0a0604` then pure `#000000` at the very border, like a
burnt edge eaten inward. A few isolated ember-hole spots (3–5 px blobs of
`#000000` ringed by 1 px `#241a0c`) intruding up to 20 px from the edge.

**Frame:** a thin draughtsman's border — a 1 px rule of `#3a2f1e` inset 6 px
from the burnt edge, with a second 1 px rule of `#241c10` 2 px inside it.
Small corner ornaments where the rules meet: 7×7 px compass-rose / fleur
motifs in `#3a2f1e` with single `#6a5630` highlight pixels.

**Corner motifs (low contrast, ≤ 20% brightness):**
- Bottom-right: a watermark of the Games Master's skull mask, 28×34 px,
  drawn only in `#1e1812` linework on the `#14100c` paper — visible when
  you look for it, invisible when you don't.
- Top-left: a tiny cartouche, 30×12 px, an empty title box of `#241c10`
  rules — as if the surveyor never named the building.
- Bottom-left: three 2×2 px wax-seal-red dots `#3a0e0e` in a diagonal line,
  like old blood or sealing wax flecks.

**Strictly forbidden in the central 240 × 150 px:** anything brighter than
`#2a241c`, any shape that could be mistaken for a wall, dot, or marker.

**Mood:** the building's plan as the Games Master keeps it — a stage diagram
for a play whose only audience member is also the prey.

**Colour budget:** 12 colours maximum.

---

## Post-processing

Generate at **1536 × 1024**, full-bleed. Then:

```sh
magick raw.png -filter point -resize 320x200\! assets/ui/map_parchment.png
```

Test in-game with Tab held: every gold/blue/white/red marker must remain
instantly readable over the sheet.
