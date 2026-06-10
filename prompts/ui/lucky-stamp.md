# UI — "LUCKY" Escape Stamp

> **SIZE: 128 × 48 pixels exactly. Wide. PNG with alpha transparency.**
>
> **STYLE: Pixel art lettering. Hard-aliased pixels. No anti-aliasing.
> No gradients. No glow blur.**
>
> **FORMAT: PNG-32 with alpha (generate on pure #ffffff background — the
> loader keys white out automatically).**

When the Games Master catches the player there is a 4% chance of a lucky
escape — a white flash, and "LUCKY" slams onto the screen for 1.8 s
(`drawLuckyFlash` in `renderer.js`). This sprite replaces the font-rendered
text. It is drawn centred at x 160, y 56 over live gameplay at fading alpha,
so it needs a strong dark outline to read over any scene.

---

## Prompt

Pixel art word-stamp for a retro horror game, the word "LUCKY" styled as a
carnival prize-ticket stamp, on a strict 128×48 pixel grid, every pixel a
flat single colour, pure white background, no anti-aliasing, no gradient,
no blur.

**Lettering:**
- "LUCKY" in five fat, slightly drunken capitals, 30–36 px tall, each letter
  rotated or offset 1–2 px from its neighbour — slapped on in a hurry.
- Letter fill: bright ticket gold `#ffe033`, with a 2 px darker band
  `#d4a830` along each letter's bottom, and single `#fff8c0` catch-light
  pixels on upper-left corners of strokes.
- Outline: 2 px of `#3a2a08` around every letter — heavy, so it reads over
  bright and dark scenes alike.

**Stamp dressing:**
- A broken rectangular stamp border around the word: 2 px `#d4a830` rules
  with deliberate 4–8 px gaps, corners overshooting 2 px (a rubber stamp
  that didn't take evenly). Rounded ticket-corner notches (3 px quarter
  bites) on all four corners.
- Four sparkle glints — 3×3 px plus-shaped sparkles of `#fff8c0` with a
  `#ffe033` centre — floating just outside the border, one near each corner.
- One tiny detail: a 6×6 px four-leaf clover in `#4a7a2a` / `#2a4a16`,
  hanging off the bottom-right of the border.

**Forbidden:** background fill, gradients, soft glow, red (this moment is
relief, not threat), more than 8 colours.

---

## Post-processing

Generate at **1536 × 1024** with the stamp as a centred band
(artwork region ≈ 1280×480, white elsewhere). Then:

```sh
magick raw.png -gravity center -crop 1280x480+0+0 +repage \
  -filter point -resize 128x48\! assets/ui/lucky.png
```
