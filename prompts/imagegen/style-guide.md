# Style Guide — LoCo Pro Wrestling: Hide

Master style reference. **Not a paste-ready prompt.** All other files in this library draw from this document. When in doubt, come here first.

---

## Anchor Sentence

Prepend this to any prompt for maximum style consistency:

```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background.
```

---

## Palette Rules

| Faction / Context | Primary | Secondary | Accent | Neutral |
|-------------------|---------|-----------|--------|---------|
| The Rising | Bright blue (#2563EB approx) | Electric yellow (#FACC15 approx) | White | Light gray |
| The Pillars | Deep purple (#6B21A8 approx) | Gold (#D97706 approx) | Black | Dark gray |
| Environment | Warm tan / wood brown | Cool gray stone | Dark navy shadow | Off-white highlight |

### Rules
- Use **8–16 colors maximum** per sprite.
- Colors must be **flat** — no gradients, no blends, no dithering unless intentional NES-style ordered dithering.
- Faction members always incorporate their faction's primary and secondary colors somewhere in the costume.
- Environment tiles use the environment palette; faction colors only appear on props and banners, not floors or walls.

---

## Pixel-Art Constraints

- **No anti-aliasing** — hard pixel edges only.
- **No sub-pixel detail** — every detail must be readable at native size.
- **Chunky pixels** — features should be visible at 32×32 without zooming in.
- **No blur** of any kind.
- **No glow or bloom effects.**
- **Limited color count** — 8–16 colors per sprite. Full tile sheets may use up to 32.

---

## Top-Down Perspective Rules

- **Slight overhead angle** — not isometric, not side-scrolling, not full top-down bird's eye.
- **Default idle direction:** character faces downward (toward the camera).
- **Implied light source:** upper-left.
- **No perspective distortion** on objects — flat projection.
- **No cast shadows** unless they are a single dark pixel offset for readability.

---

## Recommended Asset Sizes

| Asset Type | Size |
|------------|------|
| Character sprites | 32×32 or 48×48 |
| Object sprites | 16×16, 24×24, or 32×32 |
| Tiles | 16×16 |
| Title / full-screen art | 1280×720 |
| UI icons | 32×32 |
| Mini-map frame | 64×64 |
| Faction emblems (small badge) | 32×32 |
| Faction emblems (victory screen) | 128×128 |
| Mini-map faction markers | 8×8 or 16×16 |
| Sprite sheet cells | Consistent to asset size, 2px padding between cells |

---

## Full AVOID List

Use this as a reference when writing new prompts, or as a negative-prompt list for tools that support it.

- No gradients
- No realistic lighting or shadows
- No blur or glow effects
- No modern 3D rendering
- No photorealism
- No anime or manga style
- No side-scrolling perspective
- No isometric angle
- No text unless the card specifically requests it
- No copyrighted symbols or IP references
- No modern glossy UI effects
- No anti-aliasing
- No sub-pixel detail
- No perspective distortion on objects
