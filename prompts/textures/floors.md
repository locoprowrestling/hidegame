# Floor Tiles

> **SIZE: 64 × 64 pixels. Square. 1:1 aspect ratio. Not rectangular.**
>
> **STYLE: Pixel art. Hand-pixeled retro game floor texture. No painting. No realism.**
> Hard-edged aliased pixels only. No anti-aliasing. No gradients. No brush strokes.
> Banded shading with flat colour steps. 12–20 colours per texture maximum.
>
> **FORMAT: PNG, 8-bit RGB, no alpha channel.**

Floor tiles must tile seamlessly in both axes (left↔right and top↔bottom).
In the raycaster the tile repeats across the full floor plane seen in perspective.
See style-guide.md for full palette rules and renderer context.

---

## floor_foyer — Grand Foyer Marble (Floor 0)

> **64 × 64 px square. Pixel art. No painting.**

**Used:** Grand Foyer entrance hall.

Victorian encaustic marble floor in a chequerboard grid pattern. Each marble square in the
pattern is approximately 16 × 16 px — the 64 × 64 tile contains a 4 × 4 grid of alternating
squares. Dark squares: very dark grey-green (#1a1e1a), polished but dulled by grime.
Light squares: pale grey with a warm cream tint (#4a4640), heavily soiled.
Grout lines between squares: 1 px wide, near-black.
Shading on the polished surface is banded — two or three flat value steps suggesting a
specular highlight on the light squares, hard-edged, not blended.
Cracks: one or two diagonal hairline cracks (1 px wide, dark brown) across one light square.
One cracked square in the lower-left has a chip missing — exposed rough stone beneath,
a small ragged pale patch with hard pixel edges.
Dark dust settled into grout lines, rendered as flat dark pixels in the joint areas.

**Dominant tone:** dark grey-green and dark cream

**Accent:** banded specular highlight on marble, chipped tile corner

---

## floor_auditorium — Auditorium Carpet (Floor 1)

> **64 × 64 px square. Pixel art. No painting.**

**Used:** The Auditorium seating area and aisles.

Heavy wool carpet, once deep arterial red, now badly faded, stained, and threadbare.
Base colour: very dark muted red (#2a1010). Geometric border pattern — a repeating Greek
key or interlocking diamond motif — rendered in a slightly lighter rust (#3a1a10) using
flat 1–2 px pixel lines. The pattern is barely discernible; most pixels show only the base
colour with the pattern ghost visible underneath.
Worn patches: areas of roughly 8 × 8 px where the pile has worn through to bare jute
backing — flat pale tan pixels (#6a5830), hard-edged, especially along the tile centre.
A broad stain in the lower-left quadrant: flat dark pixels (#180a0a) in an irregular patch
with a 1 px lighter drying ring around the edge.
Moth holes: two 1–2 px near-black voids in the pile.

**Dominant tone:** very dark faded red

**Accent:** jute backing patches, dried stain with ring

---

## floor_gallery — Upper Gallery Floorboards (Floor 2)

> **64 × 64 px square. Pixel art. No painting.**

**Used:** Upper Gallery balcony level.

Wide-plank pine floorboards, dark stained, running horizontally across the tile.
Each board is roughly 8 px tall in the tile. Board colour: very dark brown-grey (#28201a).
Wood grain: horizontal 1 px lines in a slightly lighter value (#30241e) — flat, hard-edged,
no blending. Board joins: 1 px near-black gaps between boards. Knot holes: two small
oval knots (3–4 px wide, slightly darker than board) visible on different boards.
A split has opened between two boards near the tile centre: 2–3 px wide, near-black,
suggesting the drop beneath.
One board near the right edge has warped upward: a 1 px lighter highlight pixel row along
its upper edge and a 1 px darker shadow row along its lower edge — banded, not blended.
Grit and dust settled in the gaps: a few isolated dark pixels at the gap edges.

**Dominant tone:** very dark brown

**Accent:** board split gap, warped-board highlight and shadow rows

---

## floor_flies — Fly Tower Metal Grating (Floor 3)

> **64 × 64 px square. Pixel art. No painting.**

**Used:** The Flies — the rigging loft above the stage.

Industrial steel open-mesh walkway grating. The grid pattern repeats: each grid cell is
approximately 6 × 6 px. Horizontal and vertical steel bars are 2 px wide; the void between
bars is 4 × 4 px.
Bar colour: very dark near-black (#141414) with a 1 px highlight row along the top face
of each horizontal bar (flat blue-grey, #2a2e34) — hard-edged, single pixel row, no blend.
Void colour: near-complete black (#080808) — the enormous drop below the grating.
Rust: flat rust-orange pixels (#3a1a08) at several bar intersections in the lower-left
cluster, hard-edged patches of 2–4 px.
Scrape marks on two bars: 1–2 px streaks of lighter grey (#3a3e44) where equipment
has been dragged, flat and sharp-edged.

**Dominant tone:** near-black industrial steel

**Accent:** rust-orange at intersections, blue-grey bar highlight row, void-black cells
