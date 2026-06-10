# Stage III — Room Key, Full-Size Pickup Art

> **SIZE: 160 × 160 pixels. Square. 1:1 aspect ratio.**
>
> **STYLE: Pixel art. Hard-aliased pixels only. No anti-aliasing. No gradients. Banded shading.**
>
> **FORMAT: PNG with alpha transparency. Transparent background (alpha = 0).**

The hero version of the room-key collectible, shown centred on screen for
0.3 s when a key is picked up (`drawPickupFlash` in `renderer.js`, drawn at
110×110 px over a gold screen tint). R1 has `program-full.png` and R2 has
`punch-card-full.png`; R3 currently falls back to re-scaling the tiny 64×64
world sprite — this asset fills that gap.

It must be the **same object** as `room-key.md` — vintage hotel key with a
diamond brass fob — but with the detail budget of a close-up: engraving,
tassel, patina. Match the world sprite's palette family so the pickup flash
feels like the small sprite leaping to your hand.

---

## Prompt

Pixel art game item close-up, 160×160 pixels, transparent background, PNG
with alpha. Retro first-person shooter "item acquired" splash art — DOOM /
Heretic inventory style. Hard aliased pixels, flat colour banding, no
anti-aliasing, no gradients, no brush strokes. 16 colours maximum.

A **vintage hotel room key with a large diamond-shaped brass fob**, upright,
facing the viewer, fob at top, key bit at bottom, centred. Generate on a
pure #ffffff background (the loader keys white out).

**Fob (diamond tag), roughly 60×60 px, upper half:**
- Flat lozenge with crisp corner points. Main face `#8a7020` tarnished brass.
- A flat inner-highlight diamond `#a08030`, 30×30 px, centred on the face.
- 3 px outer-edge shadow border `#4a3808`, 1 px outline `#2a1a04`.
- Engraved into the face, legible at this size: the room number **"217"** in
  4-px-stroke stamped numerals of `#2a1a04` with a 1 px `#c0a040` glint along
  each numeral's top edge — debossed metal.
- Above the number, a tiny engraved crown motif (12×6 px, `#4a3808` lines) —
  the Hotel Imperial's mark, matching the crown stage-pip.
- Patina: 3–4 irregular flat blotches of `#6a5818` (verdigris-tinged
  tarnish), each 4–8 px, near the fob's lower-left edge.
- Catch-light: a 2-px-wide diagonal run of `#c0a040` pixels along the
  upper-right facet only — the brightest pixels in the image.

**Key ring:** an 8 px diameter circle, 2 px stroke, `#585040` with `#383020`
shading on its lower half, linking fob point to shaft.

**Key shaft:** 12 px wide × 55 px tall, `#8a7020`, with 1–2 px horizontal
wear scratches `#6a5010` and one long edge highlight line `#a08030` down the
left side. A turned collar (16 px wide, 4 px tall band of `#a08030` /
`#4a3808`) where shaft meets ring.

**Key bit:** the cut profile at the bottom, 20 px tall — four hard
rectangular notches (`#0a0806` voids): three cut from the left (each
~4×6 px, stepped), one from the right (4×4 px). 1 px `#2a1a04` outline
around the whole bit.

**Tassel (new detail for the close-up):** a worn red silk tassel hanging
2 px right of the ring — 3 px cord, then a 10×14 px tassel body in
`#7a1a1a` with `#4a0e0e` strand lines and a `#9a3030` highlight strand.
The only non-brass colour; keep it muted.

**Glow:** banded, not gradient — the inner fob diamond is the warm core;
values step down toward every edge. No halo pixels outside the silhouette.

---

## Palette (16 colours max)

| Hex | Role |
|-----|------|
| `#c0a040` | Catch-lights, numeral glints |
| `#a08030` | Fob inner diamond, shaft highlight |
| `#8a7020` | Main brass faces |
| `#6a5818` | Patina blotches |
| `#6a5010` | Shaft scratches |
| `#4a3808` | Edge shadows, crown engraving |
| `#2a1a04` | Numerals, outlines |
| `#585040` | Ring metal |
| `#383020` | Ring shadow |
| `#0a0806` | Bit notch voids |
| `#9a3030` | Tassel highlight |
| `#7a1a1a` | Tassel body |
| `#4a0e0e` | Tassel shadow strands |
| transparent | Background |

---

## Post-processing

Generate at **1024 × 1024** ("each logical pixel a flat 6×6 block,
160×160 grid"), then:

```sh
magick raw.png -filter point -resize 160x160\! assets/r3/items/room-key-full.png
```
