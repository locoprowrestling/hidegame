# Overworld — Night Street Ground Texture

> **SIZE: 64 × 64 pixels. Square. 1:1 aspect ratio. Not rectangular.**
>
> **STYLE: Pixel art. Hard-edged aliased pixels only. Banded shading. 12–20 colours max.**
>
> **FORMAT: PNG, 8-bit RGB, no alpha channel.**
>
> **Both axes must tile seamlessly** — the tile repeats across the full ground plane
> seen in perspective from street level. Features must not form obvious repeat lines.
> See style-guide.md for the full overworld setting and renderer context.

**Asset path:** `assets/overworld/textures/ground.png`
**Engine slot:** `FLOOR_TEXTURES['ow_ground']` (loaded separately from the indexed R1–R3 slots)

---

## Context

The overworld ground is viewed from first-person street level, in perspective recession.
The raycaster samples this tile using planar projection — the near-ground pixels are large
and the far-ground pixels are compressed toward the horizon. This means:

- Large features (8–16 px) read well up close and survive compression at distance
- Fine detail (1–2 px) only reads near the player; it disappears at mid-range — use it
  sparingly and only to add grain, not to carry meaning
- Horizontal lines that run exactly across the tile at y=0 or y=63 are particularly
  dangerous — they create visible seams at tile boundaries in perspective. Avoid them.

The flat-colour fallback is `OW_GROUND_COLOR = [13, 11, 9]` — a near-black warm dark
grey. The texture should read as a richer, more detailed version of that same tone.
Maximum brightness of any pixel: ~35% value. This is a dark night exterior.

---

## Prompt

Pixel art game texture, 64×64 pixels, PNG, no alpha channel, RGB only.
Early 1990s first-person shooter floor texture style — DOOM / Wolfenstein era.
Hard aliased pixels, flat colour banding, no anti-aliasing, no gradients, no brush strokes.
12–20 colours maximum. Must tile seamlessly in both axes without visible seams.

**Surface:** Old asphalt road — Main Street, Longmont Colorado, at night.
1960s–70s American small-city main street pavement. Laid decades ago, cracked and
repaired many times. The road surface is very dark, almost black under moonlight.

---

## Surface description

**Base asphalt:** The dominant colour is near-black dark grey (#1a1816) — old oxidised
asphalt aggregate. The surface is not uniform: across the tile, individual aggregate
stones are suggested by slightly lighter and darker 1–2 px pixels clustered irregularly,
creating a coarse-grained texture. Lighter aggregate values: #252220, #201e1c. Darker
voids between aggregate: #100e0c. The variation is subtle — no single patch stands out.

**Wear and age:**
- A faded asphalt repair patch: an irregular flat rectangle roughly 18×12 px in the
  upper-right area of the tile, slightly different in colour from the surrounding road
  (#22201e — a slightly cooler grey, as if a newer patch was laid years ago and has
  since darkened but not quite matched the original). Its edges are straight pixel lines,
  not soft. One edge runs diagonally (3–4 stair-step pixels).
- A long shallow crack: 1 px wide, near-black (#0a0806), running from approximately
  (x=10, y=20) to (x=38, y=50). Not ruler-straight — it wanders in 1–2 px increments
  left and right. At one point it splits into a Y-fork with a short branch running 6 px.
- Road grit and small stones: 6–8 individual 1–2 px flat pixel shapes in mid-grey
  (#404040) scattered irregularly — pebbles and road debris ground into the surface.

**Faded road marking:**
A ghost of a white centre-line runs across the tile. The original paint has almost
entirely worn away; only trace remains. Rendered as: at x=30–34 (a 4-px wide band),
three small flat patches of very pale grey (#383430 — not white, just slightly lighter
than the road) at irregular y positions (y=5–8, y=28–32, y=52–56). Each patch is
4–6 px long. Between the patches: nothing — the paint has worn through completely.
The marking must not form a continuous line; it reads as three isolated pale remnants.

**Oil stain:** Near tile centre (approximately x=20–30, y=28–38): a flat irregular patch
of very slightly darker, slightly cooler near-black (#13110f) — an old oil stain ground
into the asphalt. Its boundary is a hard jagged pixel edge. Size approximately 10×8 px.

---

## Tiling guidance

- The crack must not align to tile edges — it starts and ends well within the tile interior
- The repair patch must not touch any tile edge
- The road marking patches must be positioned so they don't form a stripe when tiled
- The aggregate grain texture must be visually consistent across the whole tile with no
  visible lighter or darker banding along any axis

---

## Palette (14 colours max)

| Hex     | Role                                         |
|---------|----------------------------------------------|
| #1a1816 | Base asphalt — dominant colour               |
| #252220 | Lighter aggregate fleck                      |
| #201e1c | Mid aggregate variation                      |
| #181614 | Darker aggregate void                        |
| #100e0c | Deepest void between aggregate               |
| #22201e | Repair patch (cooler grey)                   |
| #0a0806 | Crack line (near-black)                      |
| #404040 | Road grit / small pebble stones              |
| #383430 | Faded line marking remnants                  |
| #13110f | Oil stain (darker, slightly cool)            |

Maximum 14 colours. Keep close — this is a dark monochromatic surface. The variety
comes from texture, not colour saturation.

---

## What to avoid

- No bright pixels anywhere — maximum value ~35%
- No smooth gradients or anti-aliased edges — every boundary is a hard pixel step
- No obvious horizontal or vertical stripes that would create seam lines when tiled
- No features centred exactly on tile edges (x=0, x=63, y=0, y=63)
- Do not make the road marking look like a complete continuous stripe
