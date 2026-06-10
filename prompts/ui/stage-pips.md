# UI — Overworld Stage Pips (6 icons)

> **SIZE: 8 × 8 pixels exactly, each. Square. PNG with alpha transparency.**
>
> **STYLE: Pixel art. Hard-aliased pixels. No anti-aliasing. No gradients.**
>
> **FORMAT: PNG-32 with alpha (generate on pure #ffffff background — the
> loader keys white out automatically).**

The overworld top bar shows three "STAGES" completion markers at the right
edge (`drawOverworldHUD` in `overworld.js`) — currently flat squares. Each
building gets a glyph with a **lit** (round survived, gold) and **dim**
(not yet, dark) state, drawn at y 6 on the `#2a1f0e` top-bar wood:

| File | Building |
|------|----------|
| `stage_opera_{lit,dim}.png` | The Opera House |
| `stage_mill_{lit,dim}.png` | The Sugar Works |
| `stage_hotel_{lit,dim}.png` | Hotel Imperial |

Glyphs, not illustrations: max 5 colours, 1 px `#0a0806` outline against
transparency.

---

## Prompts — lit states

Common preamble: *Tiny pixel art game HUD icon on a strict 8×8 pixel grid,
every pixel a flat single colour, pure white background, no anti-aliasing,
1-pixel dark outline #0a0806.*

**`stage_opera_lit` — theatre mask:**
A 6×7 px tragedy half-mask, face-on. Fill `#c0a060`, two single-pixel eye
holes `#0a0806` at y 2, a 2 px downturned mouth line `#7a5c2e` at y 5,
one `#e8d8a8` catch-light pixel on the brow. Outline `#0a0806`.

**`stage_mill_lit` — factory with smokestack:**
A 7×4 px factory block sitting on the baseline (y 4–7), fill `#c0a060`,
roof line `#e8d8a8`. A 2 px wide smokestack rises from its left side to y 0
in `#7a5c2e`, with one single smoke pixel `#806040` floating 1 px right of
the stack top. Outline `#0a0806`.

**`stage_hotel_lit` — imperial crown:**
A 7×5 px crown sitting on the baseline: band of `#c0a060` (rows 5–6), three
1 px points rising to y 1 (left, centre taller, right), a single `#cc1a1a`
jewel pixel in the centre of the band, `#e8d8a8` catch-light on the centre
point tip. Outline `#0a0806`.

## Prompts — dim states

Identical silhouettes, rendered as unlit slots: shape fill `#1a1a1a`,
interior lines `#2a2a2a`, outline `#000000`, no gold, no red. They sit
beside the gold lit versions and must clearly read "not yet conquered".

---

## Post-processing

Generate each at **1024 × 1024** ("each logical pixel a flat 128×128
block"), then:

```sh
magick raw.png -filter point -resize 8x8\! assets/ui/stage_opera_lit.png
```
