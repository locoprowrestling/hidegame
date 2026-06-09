# Round II — The Great Western Sugar Works
# Texture Style Guide

## CRITICAL OUTPUT REQUIREMENTS

Every texture must satisfy all of the following:

1. **64 × 64 pixels exactly. Square. 1:1 aspect ratio.** Not 128. Not 256.
2. **Pixel art.** Not painted. Not photorealistic. Every pixel is a flat, aliased,
   single-colour square. No anti-aliasing. No gradients. No blur. Hard edges everywhere.
3. **PNG, 8-bit RGB, no alpha channel.**
4. **No post-processing filters.** No vignette, no bloom, no noise filter.

**Style reference:** Early 1990s first-person shooter game wall textures (Wolfenstein 3D /
DOOM shareware era). Hand-pixeled retro game tile assets. Each pixel individually placed.

---

## Setting

**The Great Western Sugar Works, Longmont, Colorado — abandoned 1977.**

A multi-storey sugar beet processing factory on the east side of Longmont. Opened 1903,
served by the Great Western Railway. Eight production floors, each with a distinct
industrial character. The building has been sealed and untouched for decades.

**Progression from bottom to top:**

| R2 Floor | Name                | Dominant material    | Character                              |
|----------|---------------------|----------------------|----------------------------------------|
| 0        | Beet Yard           | Wet concrete (6)     | Outdoor/indoor yard, mud, iron rails   |
| 1        | Wash House          | Corrugated iron (7)  | Flooded troughs, rust, dripping water  |
| 2        | Slice Floor         | Corrugated iron (7)  | Rusted cutting machines, tight aisles  |
| 3        | Diffusion Hall      | Corrugated iron (7)  | Huge cylindrical vats, disorienting    |
| 4        | Lime House          | Lime plaster (8)     | White dust, kilns, furnace alcoves     |
| 5        | Evaporator Gallery  | Pipe metal (9)       | Steam, catwalk pipes, condensation     |
| 6        | Pan House           | Pipe metal (9)       | Centrifuge drums, turbines, noise      |
| 7        | Sugar Tower         | Sugar crystal (10)   | Pale crystalline walls, eerie silence  |

---

## Atmosphere

**Overall:** damp, industrial, derelict. Not theatrical like Round 1. Cold metal, mould,
mineral scale, machine grease, standing water. The horror here is mechanical and chemical,
not ornate.

**Colour temperature:**

- Floors 0–3 (lower mill): very dark, cool grey-brown. Rust and mould dominate.
- Floors 4–5 (kilns/evaporator): slightly lighter — white lime dust, steam residue.
- Floors 6–7 (pan house / sugar tower): anomalously pale. The sugar crystal walls glow
  faintly off-white, which is more unsettling than darkness.

**Maximum brightness:** No surface brighter than 55–60% value. The whole building is dark.

---

## Pixel art rules

- Banded shading. No gradients. Hard edges between value steps.
- 12–20 colours per texture maximum.
- Horizontal tiling seamless for all wall textures.
- Both axes seamless for all floor/ceiling textures.
- Visible surface detail even at small scale — coarse grain, visible rust, pits, scale.
