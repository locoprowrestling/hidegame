# Stage III — Room Key (Collectible Item)

> **SIZE: 64 × 64 pixels. Square. 1:1 aspect ratio.**
>
> **STYLE: Pixel art. Hard-aliased pixels only. No anti-aliasing. No gradients. Banded shading.**
>
> **FORMAT: PNG with alpha transparency. Transparent background (alpha = 0 for background).**

See `../../items/style-guide.md` for renderer context and pixel art rules.

There are 40 room keys scattered across 10 floors of the Hotel Imperial. The player must
collect all 40 to win. Like the Opera Programme in Round 1, this is the only warm,
slightly luminous object in an otherwise cold hostile environment. It should read as
"pick me up" from across a dark corridor.

The object is a **vintage hotel room key with a large diamond-shaped brass fob** — the
style used in American hotels 1900–1970. The room number is stamped on the fob.

---

## Prompt

Pixel art game sprite, 64×64 pixels, transparent background, PNG with alpha.
Retro first-person shooter pickup sprite style — DOOM / Wolfenstein era.
Hard aliased pixels, flat colour banding, no anti-aliasing, no gradients, no brush strokes.
12 colours maximum. Must read clearly at 8×8 pixels.

A **vintage hotel room key with a large diamond-shaped brass fob**, standing upright as
a billboard, facing the viewer. The key is propped upright as if leaning, the fob at
the top and the key shaft hanging below.

---

## Object design

**Fob (key tag):**
A flat brass diamond shape — a lozenge (rotated square) roughly 22×22 px, centred in the
upper half of the canvas. The diamond shape has flat corner points (not rounded). The fob
is stamped with a room number — represented as a simple dark pixel block (#2a1a04)
suggesting a 3-digit number (three groups of 2×4 px vertical pixel strokes). The number
does not need to be legible — it reads as "a number" at game scale.

Fob colours (banded, no gradients):
- Main face: dark tarnished brass (#8a7020) — not bright gold, tarnished and old
- Inner highlight plane: slightly lighter (#a08030) — a flat 10×10 px diamond centred
  on the fob face, hard-edged
- Outer edge shadow: dark brown-gold (#4a3808) — 2 px border on all four sides
- Catch-light: two 1-px pixels (#c0a040) on the upper-right face only — the brightest
  point in the image

**Key ring:** A small circular metal ring connects the fob to the shaft. The ring is
4 px diameter, 1 px wide, rendered as a flat pixel circle (#585040). The ring sits
between the fob bottom point and the shaft top.

**Key shaft:** A flat rectangular shaft descending from the ring, approximately 6 px wide
× 24 px tall. Material: same tarnished brass (#8a7020). Shaft has 1-px grain/scratch marks
(#6a5010) along its length — flat horizontal marks suggesting wear.

**Key bit (the cut end):**
At the bottom of the shaft: the cut key profile. Rendered as flat pixel steps:
- Two rectangular notches cut from the left side of the shaft: each notch 2×3 px, near-black
  (#0a0806)
- One rectangular notch cut from the right side: 2×2 px
This creates the characteristic serrated profile of a hotel key, simplified to 3 cuts total
for pixel art legibility at small scale.

---

## Glow / luminance

The entire object is slightly luminous — it should be brighter than the surrounding
environment. The fob's main face is the primary glow source: the inner highlight diamond
(#a08030) is the warmest brightest element. The outer edges are darker (#4a3808) to
ground the object visually.

This is banded shading, not a gradient. Discrete flat value steps stepping brighter
toward the fob centre.

---

## Proportions within 64×64 canvas

- Key fob (diamond): x 21–43, y 6–28 (22×22 px diamond shape)
- Key ring: x 30–34, y 28–32 (4 px circle)
- Key shaft: x 28–34, y 32–52 (6×20 px rectangle)
- Key bit cuts: x 28–34, y 50–58 (notched profile)
- Remaining canvas pixels: transparent

The key should appear upright, fob at top, bit at bottom, as if hanging or propped.
Centred horizontally in the canvas.

---

## Palette (12 colours max)

| Hex     | Role                              |
|---------|-----------------------------------|
| #c0a040 | Catch-light (1–2 px only)         |
| #a08030 | Fob inner highlight plane         |
| #8a7020 | Fob main face, shaft              |
| #6a5010 | Shaft scratch marks               |
| #4a3808 | Fob outer edge shadow             |
| #2a1a04 | Number stamp marks, deep shadow   |
| #585040 | Key ring metal                    |
| #383020 | Ring shadow                       |
| #0a0806 | Key bit notch voids               |
| transparent | Background                    |

Maximum 12 colours. Keep the palette tight.

---

## Silhouette test

At 8×8 pixels the sprite must read as a small warm yellow-gold object with a dark bottom
notch — a glowing brass key against dark carpet or stone. The warm brass colour is the
primary identifier; the diamond-fob silhouette is secondary.

---

## Animation note

In the renderer the sprite pulses with `0.75 + 0.25 * sin(Date.now() * 0.003)` applied
to the RGB channels. The sprite image itself should be in its mid-brightness state —
neither the darkest nor brightest pulse frame. The runtime will handle the pulse on top.
