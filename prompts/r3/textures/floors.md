# Stage III — Floor Textures

> **SIZE: 64 × 64 pixels. Square. 1:1 aspect ratio. Not rectangular.**
>
> **STYLE: Pixel art. Hard-edged aliased pixels only. Banded shading. 12–20 colours max.**
>
> **FORMAT: PNG, 8-bit RGB, no alpha channel.**
>
> Floor tiles must tile seamlessly in both axes (left↔right and top↔bottom).
> In the raycaster the tile repeats across the full floor plane seen in perspective.
> See style-guide.md for setting and palette rules.

---

## Texture index mapping

Stage III uses `texOffset: 12`. Floor index n maps to `FLOOR_TEXTURES[12 + n]`.
Asset filenames: `assets/r3/textures/floor_<name>.png`.

| Floor | Name              | Tex index | Asset filename             |
|-------|-------------------|-----------|----------------------------|
| 0     | The Lobby         | 12        | floor_lobby.png            |
| 1     | Grand Ballroom    | 13        | floor_ballroom.png         |
| 2     | Kitchen & Dining  | 14        | floor_kitchen.png          |
| 3     | Guest Floor II    | 15        | floor_guestII.png          |
| 4     | Guest Floor III   | 16        | floor_guestIII.png         |
| 5     | Guest Floor IV    | 17        | floor_guestIV.png          |
| 6     | Honeymoon Suites  | 18        | floor_honeymoon.png        |
| 7     | Maids' Quarters   | 19        | floor_maids.png            |
| 8     | Service Attic     | 20        | floor_attic.png            |
| 9     | The Penthouse     | 21        | floor_penthouse.png        |

---

## floor_lobby — Lobby Black-and-White Tile (Index 12)

> **64 × 64 px square. PNG. No alpha.**

**Used:** The Lobby entrance hall (floor 0). The first surface the player walks on.

Classic Victorian chequerboard floor in black and white marble, once immaculate, now
cracked and ground in with decades of grime.

**Chequerboard pattern:** Each marble square is 16 × 16 px. The 64 × 64 tile contains
a 4 × 4 chequerboard. Black squares: very dark grey (#1c1c1c) — not pure black, since
the marble has a slight sheen and the tile is read in dim light. White squares: dark grey
with a slight warm tint (#3a3832) — originally white marble, now deeply soiled.

**Grout lines:** 1 px wide, near-black (#0e0e0e), running between all squares.

**Marble detail:** On the white squares, a faint banded specular highlight — 2–3 flat
lighter value pixels in a 4×4 px cluster near the upper-left of each white square
(#464240), hard-edged. One white square has a diagonal crack (1 px, #1a1818) running
corner to corner. One black square has a small chip exposing lighter stone beneath
(2×2 px flat pale grey patch, #3a3a38).

**Grime:** In the grout channel intersections (where four tiles meet): a 2×2 px dark
accumulation (#080808). On several white tiles: flat dark smudge pixels (#28261e)
in an irregular 6×4 px patch — embedded foot traffic dirt.

**Dominant tone:** Dark grey chequerboard (neither black nor white reads bright)
**Accent:** Specular catch-light on white squares, cracked tile, grime intersections

---

## floor_ballroom — Ballroom Herringbone Parquet (Index 13)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Grand Ballroom (floor 1). The dancing floor.

Herringbone oak parquet, once polished to a mirror shine for dances. Now dull, warped,
some blocks missing entirely. The pattern is visually rich but must read at any
perspective scale.

**Herringbone pattern:** Each parquet block is 8 × 4 px. The herringbone creates a
zigzag of alternating horizontal and vertical blocks. The two directions:
- Horizontal blocks: base colour very dark brown (#281808)
- Vertical blocks (set at 90°, but in 2D grid: rotated orientation): slightly lighter
  dark brown (#302010)

The value contrast between the two directions is small — 1–2 shades — so the pattern is
subtle, not harsh.

**Grain and sheen:** On each parquet block, 1 px horizontal grain lines (#301c0c) running
the long axis of the block. Every 4th block has a 1 px highlight line along its long edge
(#3a2418) — the remnant polish catch-light.

**Damage:**
- Block gaps: two individual parquet blocks missing (flat void, #0e0a06), each 8×4 px.
  The surrounding blocks show slight lifting at their exposed edges (1 px brighter value
  on the exposed edge face).
- Warp ridge: a sequence of 3 adjacent blocks in the lower-centre shows warping — the
  blocks rise slightly from the substrate, indicated by a 1 px shadow line (#0c0806)
  below each block in the sequence.
- Water damage patch: an 8×8 px cluster of blocks in the upper-right corner are darker
  (#1e1206) — water-blackened wood.

**Dominant tone:** Very dark brown herringbone
**Accent:** Missing block voids, warp ridge shadow lines, water-darkened corner

---

## floor_kitchen — Kitchen Quarry Tile (Index 14)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Kitchen & Dining (floor 2). The service floor.

Unglazed red quarry tile — the standard utilitarian kitchen floor surface of the era.
Rough-textured, hard-wearing. Now cracked and heavily stained with grease, scorch marks,
and biological growth.

**Tile grid:** Each tile is 16 × 16 px. The 64 × 64 tile contains a 4 × 4 grid of square
quarry tiles, laid flush (no offset). Grout lines: 2 px wide, dark grey-brown (#1a1612).

**Tile surface:** Base colour very dark terracotta-brown (#2e1810) — a fired clay that has
darkened with grease and age. Each tile face has a slightly rough texture: scattered 1 px
pixels of slightly lighter value (#3a2018) and slightly darker (#221208), irregularly
distributed across the tile face (6–10 variations per tile). This is flat banded noise,
hard-edged.

**Staining:**
- Grease blackening: one full tile (lower-left) is heavily blackened (#181006) with a
  faint greasy sheen highlight (2-px flat lighter cluster #261c0e).
- Scorch mark: an irregular flat dark patch (#100e08) across part of two adjacent tiles
  in the upper-right — straight-edged fire damage.
- Efflorescence: white salt crystals at two grout junctions (#9a9690, 2×3 px patches).

**Cracked tile:** One tile (upper-centre) has a major crack — a 1 px near-black line
running from edge to edge, and a secondary hairline branching off it.

**Dominant tone:** Very dark stained terracotta
**Accent:** Grease-blackened tile, scorch mark, efflorescence crystals

---

## floor_guestII — Guest Corridor Carpet, Second Floor (Index 15)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Guest Floor II (floor 3). The second-floor guest corridors.

Hotel corridor carpet — a repeating formal pattern in deep burgundy and gold, now
faded to near-grey, stained, and heavily worn. The same carpet was used on all three
guest floors; each floor's version is more deteriorated than the last.

**Base colour:** Very dark muted wine-red (#2a1018). Once deep burgundy, now faded.

**Pattern:** A repeating geometric border-and-medallion motif — a simple interlocked
key pattern. Each repeat is 16 × 16 px. The motif is rendered 1–2 px lighter than the
base (#3a1820) — barely visible, a ghost of the original. In the centre of each repeat:
a 4×4 px diamond shape in flat very dark gold (#3a3010). The motif must be legible at
small scale as a rectangular repeat unit.

**Wear:**
- Worn path: a roughly 12-px wide diagonal strip running upper-left to lower-right
  showing pile wear — colour drops to bare jute tan (#4a3820), flat hard-edged stripe.
- Moth holes: two 1-px near-black voids (#080808) in the pile.

**Stain:** A dark blotch in the lower-left quadrant (#180808), approximately 10×8 px,
irregular boundary, 1-px slightly lighter drying ring.

**Dominant tone:** Very dark faded wine-red
**Accent:** Worn-pile diagonal stripe, ghost geometric pattern, dark stain

---

## floor_guestIII — Guest Corridor Carpet, Third Floor (Index 16)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Guest Floor III (floor 4). Identical carpet type to floor 3, more deteriorated.

Same carpet as Guest Floor II but further degraded — more bare patches, darker stains,
pattern nearly invisible.

**Base colour:** Very dark muted grey-red (#261018) — slightly greyer/colder than floor 3,
the dye having further faded.

**Pattern:** The same geometric motif as floor 3, but now reduced to a ghost — only 1 px
lighter than base (#2e1820), and only partially visible. Two of the four repeat units in
the tile have their motifs entirely gone (flat base colour only).

**Wear:**
- Two worn bare-patch zones: each roughly 8×8 px, flat jute-tan (#4a3820), hard edges.
  One in the upper-right, one in the lower-centre.
- General matting: base colour in the centre 24×24 px region is slightly darker
  (#201008) — the highest-traffic area.

**Damage:** One 4×4 px section is torn away — flat near-black void (#080808) with frayed
thread pixels (1 px lighter #2a1818) along one edge.

**Multiple stains:** Two stains visible — one large dark blotch upper-left (#160808),
one smaller dried yellowish stain lower-right (#2a2010).

**Dominant tone:** Very dark near-grey faded carpet
**Accent:** Multiple bare-patch zones, near-invisible pattern ghost, two stains

---

## floor_guestIV — Guest Corridor, Fourth Floor (Index 17)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Guest Floor IV (floor 5). The carpet on this floor has been almost entirely
removed or has disintegrated — mostly bare wide-plank floorboards beneath.

Wide-plank pine floorboards — same species as the Upper Gallery in Round 1, but in a
hotel context: once sanded and varnished, now deeply dark and water-damaged.

**Board structure:** Each board is 10 px tall (running horizontally across the tile).
Six boards fill the 64 px height, with 1 px near-black gaps between them (#0a0806).
Board base colour: very dark grey-brown (#22181a).

**Grain:** Horizontal 1-px lighter grain lines (#2a1e1c) within each board, flat and hard.
Two knot holes: 3-px oval darker patches (#161010).

**Carpet remnant:** A strip along the left 16 px of the tile still has carpet — very dark
faded wine-red (#1e0c10), the same type as floors 3–4. Right edge of the carpet strip is
a hard ragged pixel boundary.

**Water damage:** Several boards in the lower-right quadrant are severely darkened
(#160e10, near-black). One board shows raised grain — warped — indicated by a 1-px
highlight row along its upper edge (#2e2220) and a 1-px shadow row below (#0e0a08).

**Dominant tone:** Very dark near-black wide-plank boards
**Accent:** Carpet remnant strip left side, water-warped boards lower right

---

## floor_honeymoon — Honeymoon Suites Fine Carpet (Index 18)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Honeymoon Suites (floor 6). The premium private suites — the most opulent
floor below the penthouse.

Deep-pile crimson carpet with a formal repeating motif — the finest carpet in the
building. Less worn than the corridor carpets (fewer people), but heavily damp-damaged
along the edges.

**Base colour:** Very dark crimson (#2c0e12). A deep, saturated red-black.

**Pattern:** A large medallion-and-border motif — each repeat is 32 × 32 px. The tile
contains a 2×2 grid of repeats. Each medallion: a flat slightly lighter dark red
diamond shape (12×12 px, #3a1420) with a 2-px border of flat very dark gold (#2a2008).
Four corner squares in each repeat: flat dark gold (#2a2008), 4×4 px. The pattern is
visible but muted — not bright, not cheerful.

**Wear and damage:**
- The pattern is intact in the upper-right quadrant of the tile.
- Lower-left quadrant: damp has darkened the pile to near-black (#160608). The pattern
  here is invisible.
- Right edge (12 px): significant water damage, with crystalline white salt deposits
  (1–2 px flat white-grey pixels, #6a6860) along the edge.

**Dominant tone:** Very dark crimson with muted gold pattern
**Accent:** Water-blackened lower quadrant, salt crystal edge deposits

---

## floor_maids — Maids' Quarters Plain Boards (Index 19)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Maids' Quarters (floor 7). The staff accommodation — functional, never decorated.

Narrow-plank pine floorboards, untreated, never varnished. Laid directly on joists.
Original function was purely practical; no aesthetic consideration.

**Board structure:** Each board is 6 px tall (running horizontally), with 1 px near-black
gaps (#0a0806). Ten boards visible across the 64 px height. Board base colour:
very dark brown (#1e1610) — bare pine darkened by years of oil-lamp smoke and foot traffic.

**Grain:** Horizontal 1-px grain lines (#261c12) within each board, sparse.
Three knot holes across different boards: 2–3 px oval very dark patches (#100a06).

**Nail heads:** Pairs of 1-px flat mid-grey pixels (#3a3830) on each board at each joist
position (every 16 px horizontally) — the cut nails holding the boards down.

**Damage:**
- Split boards: two boards have split along the grain — 1-px near-black crack lines
  running horizontally within the board for 12–20 px each.
- One board completely missing: flat void (#0a0806) for a full 6×64 px row.
- Scuff marks: small clusters of flat dark pixels (#160e0a) near the centre of the tile.

**Dominant tone:** Very dark plain pine boards
**Accent:** Missing board void, nail head pairs, split-board cracks

---

## floor_attic — Service Attic Rough Boards (Index 20)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Service Attic (floor 8). The uppermost service level — rough construction,
never finished. This space was used for storage and never seen by guests.

Very rough wide-plank boarding — irregular widths, gaps between boards, debris between
planks. Near-total darkness.

**Board structure:** Boards of varying width: 12 px, 8 px, 14 px, 10 px, 8 px, 12 px
from top to bottom (total 64 px). Boards run horizontally. Gaps between boards: 1–3 px
wide (1 px most, but the third and fifth gaps are 3 px), showing near-absolute black
(#040404) beneath — the drop to the floor below.

**Board surfaces:** Very rough wood, very dark. Base colour #1a1208. Each board a
different flat dark value within range #161008 to #201a10. No finish or varnish. Grain
barely visible: only 1–2 grain lines per wide board, flat #221610.

**Debris in gaps:** In the 3-px wide gaps, a few 1-px flat pixels of pale grey dust
(#3a3830) at the gap edges — accumulated grit at the board sides.

**Damage:** Two boards cracked across their full width — 1-px dark crack running
horizontally the full tile width. One area near the right edge shows a board completely
rotted: flat very dark mottled patch (#100c08 and #0c0806 in 1-px alternation) replacing
a 10×10 px area of what was a board.

**Dominant tone:** Very dark almost-black rough boards
**Accent:** Variable-width gaps showing void below, rotted-board zone

---

## floor_penthouse — Penthouse Marble Tile (Index 21)

> **64 × 64 px square. PNG. No alpha.**

**Used:** The Penthouse (floor 9). The top floor — the most luxurious space in the hotel.

Polished Italian marble tile — a large-format dark green-black marble with bold white
veining. The finest floor in the building, installed at great expense in 1902. Still
largely intact; the sealed room protected it from the worst deterioration.

**Tile grid:** Each tile is 32 × 32 px. The 64 × 64 floor tile contains a 2 × 2 grid of
large-format marble squares. Grout lines: 2 px wide, flat very dark grey (#181818).

**Marble surface:** Base colour very dark green-grey (#1e2018) — a dark verdite/marble
colour. This is dark by game standards but on the warm side of the building's darkest
surfaces.

**Marble veining:** Each marble square has 2–3 veins of white-grey (#4a4a44) running
diagonally across the face. Each vein is 1–2 px wide, flat hard-edged pixel lines,
irregular path (not ruler-straight — a jagged 1-px-step diagonal). At vein intersections:
a 2×2 px slightly brighter node (#525250).

**Polish highlight:** Each marble square has a specular catch-light: a flat cluster of
3–4 slightly lighter pixels (#28302a) in a roughly circular arrangement (4 px diameter),
representing the polish. One square's highlight is still bright enough to read as a
genuine reflection — the only square that has not been covered in dust.

**Dust:** Three of the four squares have a flat dark dust film (#1a1c18) draped over part
of their face — an irregular 10×10 to 14×14 px area of slightly darker value, hard pixel
boundary.

**Dominant tone:** Very dark green-black marble
**Accent:** White-grey vein lines, specular catch-light on one square, dust film
