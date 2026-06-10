# UI — Overworld Stage Pips (6 icons)

> **SIZE: 8 × 8 pixels exactly, each. Square. PNG with alpha transparency.**
>
> **STYLE: Pixel art. Hard-aliased pixels. No anti-aliasing. No gradients.**
>
> **FORMAT: PNG-32 with alpha (generate on pure #ffffff background — the
> loader keys white out automatically).**

The overworld top bar shows three "STAGES" completion markers at the right
edge (`drawOverworldHUD` in `overworld.js`). Each round is represented by its
Roman numeral — **I**, **II**, or **III** — with a **lit** (round survived,
gold) and **dim** (not yet, dark) state, drawn at y 6 on the `#2a1f0e`
top-bar wood:

| File | Round | Numeral |
|------|-------|---------|
| `stage_opera_{lit,dim}.png` | I — The Opera House | `I` |
| `stage_mill_{lit,dim}.png` | II — The Sugar Works | `II` |
| `stage_hotel_{lit,dim}.png` | III — Hotel Imperial | `III` |

These are compact numeral glyphs, not illustrations. They must share the same
baseline, cap height, stroke weight, and spacing language so the three pips
read as one set. Maximum 5 colours, with a 1 px `#0a0806` outline against
transparency.

---

## Prompts — lit states

Common preamble: *Tiny pixel art Roman-numeral game HUD icon on a strict 8×8
pixel grid, every pixel a flat single colour, pure white background, no
anti-aliasing. Heavy carved Roman tally strokes matching a DOOM / Hexen
status bar. Prioritize clearly separated vertical bars over decorative
serifs.*

All numerals occupy rows 1–6. Row 0 and row 7 remain transparent. Vertical
strokes are 2 px wide with transparent gaps between them. Do not connect the
strokes at the top or bottom.

**`stage_opera_lit` — Roman numeral I:**
One centred vertical gold stroke, x 3–4, y 1–6. Main fill `#c0a060`,
lower/right edge `#7a5c2e`, one `#e8d8a8` catch-light pixel at the top.

**`stage_mill_lit` — Roman numeral II:**
Two narrow parallel gold `I` strokes at x 1–2 and x 5–6, y 1–6. Preserve
2 px of transparent separation between the glyphs. Use `#c0a060` fill,
`#7a5c2e` lower/right edge, and one shared `#e8d8a8` catch-light pixel on
the upper-left.

**`stage_hotel_lit` — Roman numeral III:**
Three parallel gold `I` strokes at x 0–1, x 3–4, and x 6–7, y 1–6. The
outside numerals may touch the canvas edge but must not merge with the centre
numeral. Use `#c0a060` fill, `#7a5c2e` lower/right pixels, and one
`#e8d8a8` catch-light pixel at the upper-left.

## Prompts — dim states

Identical numeral shapes, alignment, and spacing, rendered as unlit carved
slots: main strokes `#2a2a2a`, lower/right pixels `#1a1a1a`, outline
`#000000`. No gold and no red. They must remain legible as I, II, and III
while clearly reading "not yet conquered".

---

## Post-processing

Generate the six icons as one **3 columns × 2 rows sprite sheet** at
**1536 × 1024**. Top row: `I lit`, `II lit`, `III lit`. Bottom row:
`I dim`, `II dim`, `III dim`. Each cell has a pure `#ffffff` background,
wide gutters, and one centred enlarged 8×8 logical icon.

Save the untouched generated sheet as:

```sh
source-assets/ui/stage-pips.png
```

Crop each cell, key the white background to alpha, then resize with a point /
nearest-neighbour filter to the six runtime files. For example:

```sh
magick cell.png -transparent white -filter point -resize 8x8\! \
  assets/ui/stage_opera_lit.png
```

Verify all six at 8×8 and at 3× nearest-neighbour zoom. The three numeral
counts must be immediately distinguishable.
