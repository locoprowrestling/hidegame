# UI — Tab-Map Marker Glyphs (6 icons)

> **SIZE: 8 × 8 pixels exactly, each. Square. PNG with alpha transparency.**
>
> **STYLE: Pixel art. Hard-aliased pixels. No anti-aliasing. No gradients.**
>
> **FORMAT: PNG-32 with alpha (generate on pure #ffffff background — the
> loader keys white out automatically).**

Replace the flat coloured squares on the Tab map overlay (`_drawFullMap` in
`renderer.js`). Each marker is blitted at 8×8, centred on its map tile, over
the dark translucent map field (`rgba(10,8,6,0.55)`) on the scorched
parchment sheet. The same sprites are reused as the legend swatches below
the map, so each must read as a glyph at a glance next to 11 px text.

| File | Sprite key | Marks |
|------|-----------|-------|
| `map_you.png` | `ui-map-you` | the player |
| `map_gm.png` | `ui-map-gm` | The Games Master |
| `map_stairs.png` | `ui-map-stairs` | stairwell exits |
| `map_item_program.png` | `ui-map-item-program` | R1 uncollected programmes |
| `map_item_card.png` | `ui-map-item-card` | R2 uncollected punch cards |
| `map_item_key.png` | `ui-map-item-key` | R3 uncollected room keys |

At 8×8 these are **glyphs**, not illustrations. Maximum 5 colours per icon.
Every icon gets a 1 px outline in `#0a0806` where the shape meets
transparency. Several markers can sit one tile apart (5 px), so keep each
silhouette compact — leave the outer ring of pixels mostly empty except
where the outline needs it.

Colour identity is gameplay-critical and must match the procedural
fallbacks: player = white, GM = danger red, stairs = stair blue, items =
HUD gold. A colour-blind player should still tell them apart by shape.

---

## Prompts

Common preamble for all six: *Tiny pixel art game map marker on a strict
8×8 pixel grid, every pixel a flat single colour, pure white background,
no anti-aliasing, no shading gradients, 1-pixel dark outline #0a0806,
Victorian-occult retro horror game style.*

**`map_you` — the player, a lantern-bright diamond:**
A 5×5 px diamond (rotated square) centred in the grid. Core pixel `#ffffff`,
diamond body `#e8d8a8`, the bottom-right two edge pixels `#c0a060` as
shading. Outline `#0a0806`. Reads as a bright compass-point "you are here"
against everything else on the sheet.

**`map_gm` — the Games Master, a crimson theatre mask:**
A 6×6 px rounded mask shape, slightly wider at the brow. Fill `#cc1a1a`,
two single-pixel eye holes of `#0a0806` set one pixel apart, a 1 px chin
pixel of `#ff2200` at bottom centre, and one `#ff6644` catch-light pixel at
top-left of the brow. Outline `#0a0806`. Must read as a face — the eye
pixels are mandatory.

**`map_stairs` — stairwell, three ascending steps:**
Three 2 px-wide steps climbing left-to-right inside a 6×6 px footprint:
bottom step at y 5–6, middle at y 3–4, top at y 1–2. Step tops `#99ddff`,
step faces `#55bbff`, a single `#0088ff` pixel under each step as the glow
band. Outline `#0a0806`.

**`map_item_program` — opera programme, upright booklet:**
A 5×6 px upright booklet. Cover fill `#c0a060`, 1 px spine line on the left
in `#7a5c2e`, 1 px page-edge sliver on the right in `#e8d8a8`, one 1 px
title-band pixel pair in `#7a5c2e` near the top. Outline `#0a0806`.
(Same glyph family as `pip_program_lit` — keep them visually consistent.)

**`map_item_card` — punch card, notched corner:**
A 6×5 px horizontal card with the top-left corner cut by 1 px. Fill
`#c0a060`, cut edge `#e8d8a8`, three punched holes as single `#0a0806`
pixels staggered across the middle. Outline `#0a0806`. (Matches
`pip_card_lit`.)

**`map_item_key` — room key, bow at top:**
A vertical key: 3 px-wide bow ring of `#c0a060` at top with one transparent
centre pixel and one `#e8d8a8` catch-light pixel at top-left; 1 px shaft
dropping to y 6 ending in two 1 px teeth pointing right in `#7a5c2e`.
Outline `#0a0806`. (Matches `pip_key_lit`.)

---

## Post-processing

Generate each icon separately at **1024 × 1024** ("each logical pixel is a
flat 128×128 block"), then:

```sh
magick raw.png -filter point -resize 8x8\! assets/ui/map_you.png
# or, macOS:
sips -z 8 8 raw.png --out assets/ui/map_you.png
```

Verify on the map: serve with `python3 -m http.server 8080`, enter a
building, hold Tab. Check that (1) markers stay distinguishable when GM and
player are adjacent, (2) the GM pulse flash still reads through the sprite,
(3) legend swatches align with the 11 px legend text baseline. Delete the
PNG to fall back to the procedural squares.
