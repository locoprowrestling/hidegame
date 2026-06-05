# Games Master — Sprite Style Guide

## CRITICAL OUTPUT REQUIREMENTS

Every Games Master sprite must satisfy all of the following:

1. **64 × 128 pixels exactly. Portrait. 1:2 aspect ratio.** Width = 64. Height = 128.
   The raycaster renders GM sprites at `spriteW = spriteH * 0.45` — a tall narrow billboard.
2. **Pixel art.** Not painted. Not photorealistic. Not illustrated. Every pixel is a flat,
   aliased, single-colour square. No anti-aliasing. No smooth gradients. No brush strokes.
   Hard edges everywhere.
3. **PNG with alpha transparency.** Background must be fully transparent (alpha = 0).
   The figure occupies the full 128 px height. No floor shadow. No ground plane.
4. **No post-processing filters.** No vignette, no bloom, no lens flare, no noise filter.

**Style reference:** Wolfenstein 3D / DOOM enemy sprites. Hand-pixeled retro game character
sprites. Each pixel individually placed. Hard aliased outlines. Banded shading. 16–24 colours
maximum per sprite.

---

## Character Design — The Games Master

A tall, imposing villain who runs the wrestling federation from the shadows.
Every sprite must be consistent with this design:

**Body:** Tall, broad-shouldered man in a perfectly-fitted **black two-button suit** with
matching black trousers and polished **black leather dress shoes**. Black dress shirt
underneath. No tie — collar open one button.

**Head:** **Red lucha libre skull-demon wrestling mask.** The mask is a deep crimson-red
(#cc1a1a) with bold black markings — jagged crack lines radiating from the eye holes,
flame shapes on the crown, angular cheekbone accents. The mask fits the head like a second
skin. No neck visible — mask sits flush to the collar.

**Hands:** **Red skeletal gloves** — the finger bones are painted/printed as red lines on
black glove fabric, giving the appearance of exposed bone structure. Same crimson-red as the
mask (#cc1a1a).

**Weapon/prop:** A **black walking cane** with a **silver skull pommel** at the top.
Cane length reaches from hand-grip to floor. The skull pommel is small, detailed, metallic
grey (#9a9a9a).

**Palette (16 colours max per sprite):**

| Swatch | Hex | Used for |
|--------|-----|----------|
| Near-black | #0d0d0f | Suit shadow, deepest folds |
| Dark charcoal | #1e1e22 | Suit mid-tone |
| Suit mid | #2c2c34 | Suit highlight planes |
| Suit accent | #3a3a44 | Suit brightest catch-light |
| Shoe black | #141416 | Shoes |
| Shoe gloss | #2a2a30 | Shoe highlight |
| Mask red | #cc1a1a | Mask base colour |
| Mask dark red | #7a0e0e | Mask shadow, socket rims |
| Mask bright | #e83030 | Mask highlight catch-light |
| Mask marking | #0d0d0d | Mask black markings |
| Eye glow | #ff2200 | Glowing eyes inside mask |
| Glove red | #cc1a1a | Skeletal glove lines |
| Glove black | #141418 | Glove base fabric |
| Cane black | #181818 | Cane shaft |
| Skull silver | #9a9a9a | Skull pommel |
| Skull dark | #585858 | Skull pommel shadow |

---

## Renderer context

A first-person raycaster (Wolfenstein / DOOM style). Sprites are billboard quads — they
always face the player. The GM sprite is rendered as a single vertical column slice at a
time (`_drawGMColumn`). The sprite is scaled from full screen height (close) down to a
few pixels (far). Pixel art reads correctly at all scale levels; smooth art becomes a blur.

The viewport is 320 × 180 px (upscaled with `imageSmoothingEnabled = false`).
The GM sprite takes up roughly 45% of its height in width when near — a tall narrow figure.

---

## Animation states

| File | Pose | Usage |
|------|------|-------|
| `idle.md` | Standing, cane planted | Default state, not moving |
| `walk-a.md` | Mid-stride, left foot forward | Walk cycle frame 1 |
| `walk-b.md` | Mid-stride, right foot forward | Walk cycle frame 2 |
| `lunge.md` | Arms outstretched, leaning in | Catch / near-player alert |
| `back.md` | Seen from behind | Walking away (future use) |
