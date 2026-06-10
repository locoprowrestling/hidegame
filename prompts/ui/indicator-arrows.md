# UI — Indicator Arrows (4 sprites)

> **SIZE: 32 × 32 pixels exactly, each. Square. PNG with alpha transparency.**
>
> **STYLE: Pixel art. Hard-aliased pixels. Banded glow rings — flat colour
> steps, never gradient blur. No anti-aliasing.**
>
> **FORMAT: PNG-32 with alpha (generate on pure #ffffff background — the
> loader keys white out automatically).**

These float in 3-D space over stairwells (`drawStairIndicators` in
`sprites.js`) and building doors (`drawDoorIndicators` in `overworld.js`),
replacing the current vector-polygon arrows. The renderer scales them from
~8 px up to ~32 px with distance, pulses `globalAlpha` between 0.44 and 1.0,
and fogs them out — so the sprite itself should be drawn at **full
brightness** with its glow baked in as flat banded rings.

| File | Direction | Usage |
|------|-----------|-------|
| `arrow_up.png` | points up | stairs to a higher floor |
| `arrow_down.png` | points down | stairs to a lower floor |
| `arrow_door.png` | points down | unlocked building entrance (overworld) |
| `arrow_locked.png` | points down | locked building entrance (overworld) |

All four share one construction; only palette and one detail differ.

---

## Prompt — shared construction

Pixel art glowing arrow sprite for a retro raycaster game, on a strict
32×32 pixel grid, every pixel a flat single colour, pure white background,
no anti-aliasing, no blur, no gradient.

**Shape:** a bold chevron-tipped arrow filling rows 3–29, total width 20 px,
centred horizontally. Arrowhead: a triangle 20 px wide × 11 px tall.
Shaft: 8 px wide × 15 px tall behind the head. Pointing **down** for
`arrow_door` / `arrow_locked` / `arrow_down`, **up** for `arrow_up`
(same sprite mirrored vertically — generate both, don't rely on runtime
flipping).

**Banded glow (from inside out, all hard-edged):**

1. Core fill — brightest colour, the inner 60% of the arrow shape.
2. Body band — mid colour, a 2 px band inside the outline.
3. Outline — 1 px darkest colour around the whole silhouette.
4. Halo — a 2 px detached aura ring in the glow colour, 1 px of transparency
   between it and the outline, following the arrow silhouette. The halo may
   break into dashes (2 px on, 2 px off) for a shimmer feel.
5. Two single sparkle pixels of the core colour floating 2–3 px off the
   arrowhead tip.

## Palettes

**`arrow_up` / `arrow_down` — stairwell blue:**
core `#99ddff`, body `#55bbff`, outline `#0a2a44`, halo `#0088ff`.

**`arrow_door` — beacon gold:**
core `#ffd966`, body `#d4a830`, outline `#3a2a08`, halo `#aa7700`.

**`arrow_locked` — barred red:**
core `#aa4444`, body `#7a2222`, outline `#2a0808`, halo `#552222`.
Extra detail: two 1 px chain links in `#9a9a9a` with `#585858` shading,
crossing the shaft diagonally — the way is barred.

---

## Post-processing

Generate each at **1024 × 1024** ("each logical pixel a flat 32×32 block"),
then:

```sh
magick raw.png -filter point -resize 32x32\! assets/ui/arrow_door.png
```

Verify the halo ring survives the downscale as a clean 1–2 px band.
