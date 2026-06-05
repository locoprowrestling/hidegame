# Items — Sprite Style Guide

## CRITICAL OUTPUT REQUIREMENTS

Every item sprite must satisfy all of the following:

1. **64 × 64 pixels exactly. Square. 1:1 aspect ratio.**
   The raycaster renders item sprites as `spriteW = spriteH` — a square billboard.
   The on-screen size scales with distance; at close range the sprite fills the screen height.
2. **Pixel art.** Not painted. Not photorealistic. Every pixel is a flat, aliased,
   single-colour square. No anti-aliasing. No smooth gradients. Hard edges everywhere.
3. **PNG with alpha transparency.** Background must be fully transparent (alpha = 0).
4. **No post-processing filters.** No vignette, no bloom, no lens flare.

**Style reference:** DOOM / Wolfenstein 3D pickup sprites. Hand-pixeled retro game items.
Hard aliased outlines, banded shading, 12–16 colours maximum. Must read clearly as a
recognisable object even when rendered at 8×8 pixels (far-distance view).

---

## Renderer context

Item sprites are rendered as floor-level billboard quads. The vertical offset is
`+0.3 × spriteH` — the sprite is shifted slightly below the horizon, so it appears to
sit on the floor. At close range a collected item takes up roughly 35% of the screen
height. At far range it is a handful of coloured pixels.

The viewport is 320 × 180 px (upscaled with `imageSmoothingEnabled = false`).
Pixel art reads correctly at all scale levels.

---

## Setting

Abandoned Victorian Opera House, 1870s-built, sealed 1940s. Grand, decayed, dark.
Items found scattered across the floors feel like forgotten relics — left behind when the
building was sealed, untouched for decades. They should read as old, physical, slightly
luminous — the only warm light in an otherwise cold, hostile space.

---

## Items

| File | Item | Description |
|------|------|-------------|
| `program.md` | Opera Program | Collectible — old Victorian theatre program booklet. 28 scattered across 4 floors. |
