# UI — Bottom HUD Bar

> **SIZE: 320 × 18 pixels exactly. Wide strip. No alpha — fully opaque.**
>
> **STYLE: Pixel art. Hard-aliased pixels. Banded shading. No anti-aliasing.**
>
> **FORMAT: PNG, 8-bit RGB.**

Replaces the flat `rgba(0,0,0,0.82)` rectangle at the bottom of the HUD
(`drawHUD` / `drawOverworldHUD`). At runtime the renderer centres one line of
13 px interaction text on it (`[Space] TAKE THE PROGRAMME`, door prompts,
floor counts) in gold `#c0a060`, blue `#88ccff`, or red `#aa4444`.

Must visually pair with `topbar.md` — same wood, same brass.

---

## Prompt

Pixel art UI status bar for a retro first-person horror game — the bottom
companion to a DOOM-style top status bar. Hard aliased pixels, flat colour
bands, no anti-aliasing, no gradients, no text.

**Layout (design on a 320 × 18 logical pixel grid):**

A horizontal strip of aged Victorian theatre panelling, straight-on.

- **Row 0 (top edge):** 1 px brass rule line `#806040` across the full
  width — mirroring the brass rule of the top bar — with a 1 px `#0a0806`
  shadow row directly beneath.
- **Rows 2–17 (main plank):** dark stained oak, base `#2a1f0e`, sparse
  horizontal grain streaks `#1a1208`, occasional single-pixel wear marks
  `#0a0806`. Centre 240 px stays clean and ≤ 25% brightness for the prompt
  text.
- **Centre plaque:** a very subtle darker inset panel, 160 px wide × 12 px
  tall, centred — fill `#221a0c`, 1 px inner shadow `#120c06` on top/left,
  1 px lip `#3a2d16` on bottom/right. This frames the interaction prompt
  without competing with it.
- **Corners:** small brass end-caps 8 px wide × full height: base `#806040`,
  top/left bevel `#c0a060`, bottom/right shadow `#7a5c2e`, one 2×2 rivet
  (`#e8d8a8` / `#7a5c2e`) each.
- **Row 17 (bottom edge):** 1 px near-black `#0a0806` baseline.

**Mood:** stage-front footlight board with the lamps long dead.

**Colour budget:** 10 colours maximum, from the shared palette.

---

## Post-processing

Generate at **1536 × 1024**, strip as a centred full-width band
(band height ≈ 86 px), solid black elsewhere. Then:

```sh
magick raw.png -gravity center -crop 1536x86+0+0 +repage \
  -filter point -resize 320x18\! assets/ui/bottombar.png
```
