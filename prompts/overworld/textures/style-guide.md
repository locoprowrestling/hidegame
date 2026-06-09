# Overworld — Longmont Night Street
# Texture Style Guide

## CRITICAL OUTPUT REQUIREMENTS

Every texture must satisfy all of the following:

1. **64 × 64 pixels exactly. Square. 1:1 aspect ratio.** Not 128. Not 256.
2. **Pixel art.** Not painted. Not photorealistic. Every pixel is a flat, aliased,
   single-colour square. No anti-aliasing. No gradients. No blur. Hard edges everywhere.
3. **PNG, 8-bit RGB, no alpha channel.**
4. **No post-processing filters.** No vignette, no bloom, no lens flare, no noise filter.

**Style reference:** Early 1990s first-person shooter game wall textures (Wolfenstein 3D /
DOOM shareware era). Hand-pixeled retro game tile assets. Each pixel individually placed.

---

## What the overworld is

The first-person night-time exterior world connecting the three buildings.
The player spawns on Main Street, Longmont Colorado, at night. The street is empty.
Three buildings face them — the Opera House, the Sugar Mill, the Hotel Imperial.
The Games Master stalks the streets: a distant figure, watching, vanishing.

The overworld uses the same DDA raycaster as the buildings. The difference:
- Night sky: flat near-black above the horizon (#080810)
- Night ground: flat very dark grey-green below (#0e1008)
- Longer draw distance (fog at 17 tiles vs 10 in buildings)
- No floor/ceiling texture sampling in the current renderer (flat colour only)

**Wall textures ARE sampled** — the four exterior wall types render exactly as in buildings.
These prompts generate those four wall types.

---

## Setting: Longmont, Colorado — 1970s night

The overworld is vaguely based on Longmont, Colorado as it looked in the early 1970s.
Main Street runs north–south. The town is quiet — no cars, no people, no movement.
The street lights are off or broken. The only light source is faint moonlight.

The architecture is a mix of periods:
- Victorian commercial brick (1880s–1910s) — the storefronts and the Opera House
- Edwardian hotel brick (1902) — the Hotel Imperial
- Industrial corrugated iron (1903) — the Sugar Mill
- Natural boundary — hedge/tree border at town edge

**Atmosphere:** Abandoned Americana, very dark, cold. A Colorado night in an empty town.
No warmth. No safety. This is the calm between the horror.

---

## Colour temperature

- All outdoor surfaces: very dark, cool-neutral to slightly cold.
- No surface brighter than 50% value — moonlight is weak.
- Brick: dark warm red-brown, but deeply saturated by darkness.
- Metal: dark, cool grey-blue.
- Stone: dark cool grey.
- Vegetation: near-black blue-green.

---

## Wall type summary

| Type | Character      | Map char | Used for                    |
|------|----------------|----------|-----------------------------|
| 17   | Opera facade   | O        | Opera House exterior         |
| 18   | Mill facade    | M        | Great Western Sugar Mill    |
| 19   | Hotel facade   | H        | Hotel Imperial exterior     |
| 20   | Hedge/tree     | T        | Town boundary, border       |

Types 4 (brick storefront, reused from R1) and 5 (wood fence, reused from R1) are
already generated — no new prompts needed for those two.
