# Item Sprite — Opera Program (collectible)

> **SIZE: 64 × 64 pixels. Square. 1:1 aspect ratio.**
>
> **STYLE: Pixel art. Hard-aliased pixels only. No anti-aliasing. No gradients. Banded shading.**
>
> **FORMAT: PNG with alpha transparency. Transparent background. No floor shadow.**

See `style-guide.md` for renderer context and pixel art rules.

There are 28 of these scattered across 4 floors of the Opera House. The player must collect
all 28 to win. This is the only warm, inviting object in the game — it should glow faintly
and read as "pick me up" against the dark stone and plaster environment.

---

## Prompt

Pixel art game sprite, 64×64 pixels, transparent background, PNG with alpha.
Retro first-person shooter pickup sprite style — DOOM / Wolfenstein era.
Hard aliased pixels, flat colour banding, no anti-aliasing, no gradients, no brush strokes.
12–16 colours maximum. Must read clearly at 8×8 pixels.

A **Victorian opera programme booklet**, standing upright as a billboard, facing the viewer.

**Object:** A folded paper programme from an 1890s opera house — the kind handed to
audience members at the door. Roughly A5 size, folded once down the centre to make a
4-page booklet. Held upright, cover facing the viewer. The paper is aged — cream-ivory,
yellowed at the edges, slightly warped from decades of damp.

**Cover design (pixel art, legible at small size):**
- Main field: aged cream-ivory (#d4c484) with a warm yellow-gold tint
- A decorative border of thin pixel lines — dark gold (#8a6a20) ruled rectangle, inset
  2–3 px from the edges. Victorian ornamental style: corner flourishes are 2–3 px
  pixel clusters suggesting scrollwork.
- Centre text block (suggest, do not try to render legible letters): a 3–4 px tall
  dark block (#3a2a08) representing a title line, and a 2-px subtitle line beneath.
  Below that, a small oval or lozenge shape (3×4 px, dark gold) representing a vignette
  or crest.
- Spine: the folded spine runs down the right edge — a 3-px wide strip of slightly
  darker cream (#b8a660), with a faint shadow on its left edge (#6a5010). This is the
  feature the current renderer highlights: `texX > 0.35 && texX < 0.65` is brighter.

**Glow / luminance:** The whole booklet is slightly luminous — brighter than the
surrounding environment. The cream field has a warm amber-gold inner glow effect
rendered in pixel art: the centre 20×20 px region is 2–3 shades lighter than the edges.
This is banded shading, not a gradient — discrete rings of lighter value stepping inward.
Edge pixels of the booklet: dark gold shadow (#5a4010) to ground it visually.

**Proportions within 64×64 canvas:**
- Booklet occupies roughly the centre 40×52 px of the canvas.
- Left edge: x ~12, right edge: x ~52
- Top edge: y ~6, bottom edge: y ~58
- Remaining pixels: transparent
- The booklet should appear upright, slightly wider than it is tall — a closed folded
  booklet in portrait orientation is roughly 2:3 wide-to-tall in real life; at this
  size that's approximately 40 wide × 52 tall.

**Palette (12 colours max):**

| Hex | Role |
|-----|------|
| #d4c484 | Paper — main cream-gold field |
| #e0d090 | Paper — inner glow highlight |
| #ead8a0 | Paper — brightest centre catch-light |
| #b8a660 | Paper — mid shadow, spine |
| #8a7840 | Paper — edge shadow |
| #5a4010 | Paper — deepest edge / outline |
| #8a6a20 | Border lines, corner flourishes |
| #c0900a | Border — bright accent (corner dots) |
| #6a5010 | Spine shadow line |
| #3a2a08 | Title text block, dark detail |
| #2a1c04 | Deepest shadow, booklet base outline |
| transparent | Background |

**Silhouette test:** At 8×8 pixels the sprite must read as a small warm rectangular
object — a glowing booklet against dark stone. The warm cream-gold colour is the primary
identifier; shape is secondary. Avoid dark outlines that would make it read as a generic
dark rectangle at small size.

**Animation note:** In the current renderer the sprite pulses with
`0.75 + 0.25 * sin(Date.now() * 0.003)` applied to the RGB channels. The sprite image
itself should be in its mid-brightness state — neither the darkest nor brightest pulse
frame. The runtime will handle the pulse effect on top.
