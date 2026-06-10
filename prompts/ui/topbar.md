# UI — Top HUD Bar

> **SIZE: 320 × 23 pixels exactly. Wide strip. No alpha — fully opaque.**
>
> **STYLE: Pixel art. Hard-aliased pixels. Banded shading. No anti-aliasing.**
>
> **FORMAT: PNG, 8-bit RGB.**

Replaces the flat `rgba(0,0,0,0.82)` rectangle at the top of the in-building
HUD (`drawHUD` in `renderer.js`). The renderer draws on top of it at runtime:

- Floor name, left-aligned at x 4, y 14 — `#806040` text
- Seven 8×8 collectible pips, centred horizontally, y 6–14
- Global count, right-aligned at x 316, y 14 — `#806040` text
- The **stress bar fill** is drawn into the bottom 3 px (y 20–22) by code —
  the art must provide an empty recessed groove there, nothing bright.

---

## Prompt

Pixel art UI status bar for a retro first-person horror game, in the style of
DOOM / Hexen status bar chrome. Hard aliased pixels, flat colour bands, no
anti-aliasing, no gradients, no blur, no text.

**Layout (design on a 320 × 23 logical pixel grid):**

A horizontal strip of aged Victorian theatre panelling, viewed straight-on.

- **Rows 0–19 (main plank):** dark stained oak board, base colour `#2a1f0e`,
  with subtle horizontal wood-grain streaks in `#1a1208` (1 px lines, broken,
  never more than 30 px long) and rare worm-holes (single `#0a0806` pixels).
  The centre 200 px must stay clean and dark — maximum brightness 25% — this
  is where text and pips render.
- **Row 0 (top edge):** 1 px highlight line of `#4a3a20` — light catching the
  top of the board.
- **Corners:** a tarnished brass corner plate at each end, 14 px wide ×
  19 px tall: base `#806040`, bevel highlight `#c0a060` on top/left edges,
  shadow `#7a5c2e` on bottom/right, one 2×2 px rivet dot (`#e8d8a8` centre,
  `#7a5c2e` rim) near each plate corner. Faint engraved scratches in
  `#5a4628`.
- **Rows 19–20:** 1 px brass rule line `#806040` running the full width,
  separating plank from groove, with 1 px shadow `#0a0806` beneath it.
- **Rows 20–22 (stress groove):** an empty recessed channel, fill `#0a0806`,
  with a 1 px inner shadow of pure `#000000` along its top. No colour here —
  the game fills this groove with the red stress bar at runtime.

**Mood:** the proscenium edge of a stage — the player is looking at the world
through the Games Master's theatre. Worn, dark, slightly ornate, never shiny.

**Colour budget:** 10 colours maximum, drawn from the shared palette.

---

## Post-processing

Generate at **1536 × 1024** with the strip as a full-width band centred
vertically (band height ≈ 110 px = 23 logical rows × ~4.8), solid black
above and below. Then:

```sh
magick raw.png -gravity center -crop 1536x110+0+0 +repage \
  -filter point -resize 320x23\! assets/ui/topbar.png
```
