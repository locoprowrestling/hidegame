# Stage III — Wall Textures

> **SIZE: 64 × 64 pixels. Square. 1:1 aspect ratio. Not rectangular.**
>
> **STYLE: Pixel art. Hard-edged aliased pixels only. Banded shading. 12–20 colours max.**
>
> **FORMAT: PNG, 8-bit RGB, no alpha channel.**
>
> All wall tiles tile seamlessly on the horizontal axis (left edge matches right edge exactly).
> See style-guide.md for full setting description, palette rules, and renderer context.

---

## wall_wallpaper — Victorian Hotel Wallpaper (Type 11)

> **64 × 64 px. PNG. No alpha.**

**Used:** Guest Floors II–IV (floors 3–5). The guest room corridors and bedrooms of the Hotel Imperial.

Victorian striped wallpaper — a repeating stripe-and-floral pattern typical of 1890s–1910s hotel
decoration. The paper is severely deteriorated: heavily stained, partially peeled, some sections
entirely missing revealing the brown paste and plaster beneath.

**Base wallpaper:** The ground colour is a very dark warm grey-green (#2a2820) — this was once
ivory-cream but has aged and darkened under decades of damp. The stripe pattern runs vertically
the full tile height. Each stripe is 8 px wide: alternating between a slightly lighter warm grey
(#383028) and the base (#2a2820), creating a barely-visible two-tone stripe.

**Floral motif:** On every other stripe (at 16-px horizontal intervals), a stylised floral
repeat runs vertically — a small oval or lozenge shape (4×6 px) at y=8, y=32, y=56, each one
rendered in flat dark olive-gold pixels (#4a4010), with a 2-px stem pixel connecting them.
The motif is ghost-faint — barely distinguishable from the background.

**Dado rail:** A horizontal raised moulding runs across the tile at y=44 (the lower third).
The rail is 4 px tall: top highlight row #404040, main body #303030, bottom shadow row #1a1a1a.
Below the dado: a flat dark wainscot panel (#1e1c18) — darker than the wallpaper above it.

**Damage:**
- Peeling section: one corner of the tile (upper-left, roughly 12×16 px) shows the wallpaper
  peeled away. The torn edge is a jagged diagonal of 1-px hard pixel steps. Beneath: flat
  dark brown paste residue (#2c2018) with a few pale dried adhesive flecks (#4a3828).
- Water stain: a vertical dark bleed (#1a1808) running from y=0 to y=30 near the right
  edge of the tile, 4-6 px wide, bleed edge a 1-px darker border (#0f0e08).
- Mould: small flat patches of dark green-grey (#1a2010) in the lower-right quadrant.

**Horizontal seam:** At y=0 and y=64 the floral motifs align across repeats. Left edge
and right edge stripe colours match seamlessly.

**Dominant tone:** Very dark stained grey-green with ghost stripe pattern
**Accent:** Peeling corner exposing brown paste, dado rail line, water bleed

---

## wall_mahogany — Hotel Mahogany Panelling (Type 12)

> **64 × 64 px. PNG. No alpha.**

**Used:** The Lobby (floor 0), The Penthouse (floor 9). The prestige public rooms.

Dark mahogany wainscot panelling — the Hotel Imperial's signature interior finish.
Floor-to-ceiling raised and fielded panels in dark hardwood, installed 1902. Never
refinished; now deeply dark, some panels split.

**Panel structure:** The tile contains two full raised-and-fielded panels side by side,
each 30 px wide with a 4-px dividing stile between them. Each panel:
- Outer frame rail (stile and rail): 5 px wide, very dark mahogany (#1e1008)
- Inner panel field: recessed 2 px behind the frame, flat dark brown-red (#2a1408)
- Bevel moulding shadow: 1 px hard dark line (#0e0806) at the inner frame edge
- Bevel moulding highlight: 1 px slightly lighter line (#3a2010) at the outer frame edge

**Wood grain:** Visible in both the rails and the panel field. Horizontal 1-px lines of
slightly lighter values (#241208) at irregular intervals — the medullary ray pattern of
quartersawn mahogany. Flat and hard-edged. The grain runs horizontally.

**Column capital accent:** At the top 10 px of the tile: the base of a decorative column
capital in gilt plaster — flat dark gold pixels (#6a5010) forming a simple egg-and-dart
border band. 3-4 px tall visible, representing the bottom of an overhead architectural
accent. Below it, the panelling meets the capital with a 1-px shadow line.

**Damage:**
- One panel in the lower-left has a vertical split — a 1-px near-black crack (#0a0806)
  running from y=40 to y=64, through the panel field, following a grain line.
- General surface darkening in the lower-right panel: an irregular dark stain patch
  (#160a04) suggesting water or boot contact, flat pixels, hard boundary.
- A small screw head visible in the centre stile: 3-px dark circle (#181010), centred.

**Dominant tone:** Very dark brown-red mahogany
**Accent:** Gilt capital band at top, vertical split crack, grain lines throughout

---

## wall_tile — Kitchen Ceramic Tile (Type 13)

> **64 × 64 px. PNG. No alpha.**

**Used:** Kitchen & Dining (floor 2), Maids' Quarters accent walls (floor 7).

White ceramic subway tiles — the utilitarian wall surface of the Hotel's service areas.
Installed 1902, unrestored since. The tiles were once bright white; they are now cracked,
stained with decades of grease and damp, several shattered.

**Tile grid:** Each tile is 16 px wide × 10 px tall (brick-bond pattern — alternating rows
offset by 8 px). Grout lines are 2 px wide, dark grey-green (#1e2018 — mould-stained grout).
Tile faces are flat mid-grey-white (#4a4a44) — not bright white, heavily dulled by grime.

**Tile variation:** No two tiles are exactly the same value. Most tiles: (#4a4a44). Some
slightly lighter (#525250), some darker (#3a3a38). This is flat banded variation — a different
value assigned per tile, hard-edged at the grout line.

**Grease staining:** A broad blotch running diagonally from upper-centre to lower-right:
flat dark amber-brown pixels (#3a2808) covering sections of 4–5 individual tiles. The
stain respects tile boundaries — slightly darker inside the affected tiles but does not
bleed into grout.

**Cracked tiles:** Two tiles show visible cracks. Each crack is a 1-px near-black line
(#0e0e0c) running across the tile face — one diagonal crack on the upper-left tile, one
straight horizontal crack on a lower-right tile.

**Shattered tile:** One tile (upper-right area) is completely shattered — replaced by
a flat dark void (#141412) of the same 16×10 px footprint, with a few remaining white
shard edges: 2–3 px jagged flat-white fragments (#4a4a44) along one edge.

**Dominant tone:** Dull grey-white ceramic, heavily stained
**Accent:** Mould-stained grout lines, shattered-tile void, grease blotch

---

## wall_gilt — Gilt Plaster Panelling (Type 14)

> **64 × 64 px. PNG. No alpha.**

**Used:** Grand Ballroom (floor 1), Honeymoon Suites (floor 6), Lobby accent (floor 0),
Penthouse (floor 9). The Hotel's prestige ornamental surfaces.

Ornate gilded plaster wall panels — Louis XVI style applied decoration typical of
Edwardian luxury hotels. Deep-relief mouldings with applied gold leaf, now heavily
tarnished and partially fallen. The surface is the most visually complex in the game.

**Panel structure:** The tile shows one large raised panel with a compound moulding frame.
- Background: flat very dark warm grey (#222018)
- Outer frame (6 px wide): tarnished dark gold (#3a3010), the base coat visible
  where leaf has fallen
- Inner bevel moulding: 3 px wide, highlight row (#686020), shadow row (#1a1808)
- Panel field (interior): flat dark warm grey (#2a2620) — slightly lighter than background
- Egg-and-dart rail running horizontally at y=20: repeated pattern of oval (4 px wide)
  and dart (2 px) in flat tarnished gold (#4a4010). Each motif hard-edged, pixel-art style.

**Gold leaf detail:**
- Applied gold sections: flat warm gold pixels (#7a6020) on the moulding face, in sections
  6–10 px long. Adjacent sections where the leaf has fallen: base coat dark brown (#2a1808).
- One catch-light on the moulding crown: a single row of brighter gold pixels (#a08030),
  3–4 px long, representing the angle that still catches ambient light.
- Fallen leaf residue: isolated 1-2 px gold flecks (#6a5010) scattered at the moulding base.

**Damage:**
- Plaster loss: upper-right corner shows a 10×12 px area where the decorative plaster
  has fallen away entirely. Flat dark brown-grey lath substrate exposed (#1e1810), with
  a few near-white lime plaster fragments (#5a5448) at the jagged hard edge.
- Hairline cracks: three 1-px dark lines (#0e0e0c) radiating from the plaster loss zone.

**Dominant tone:** Very dark warm grey with tarnished gold moulding accents
**Accent:** Catch-light gold row on moulding crown, plaster-loss zone, fallen-leaf flecks

---

## wall_cellarstone — Service Attic Raw Stone (Type 15)

> **64 × 64 px. PNG. No alpha.**

**Used:** Service Attic (floor 8). The uppermost and most utilitarian space in the hotel —
the raw structural envelope before the decorative skin was applied to the floors below.

Rough-coursed limestone rubble masonry — the same stone used for the hotel's structural
walls, here never plastered or finished. Coarse, irregular, ancient-feeling. Very dark.

**Stone courses:** Irregular coursed rubble — stones of varying size. Three irregular
horizontal courses visible in the 64-px height:
- Upper course (y=0–20): two stones side by side, roughly 28 px and 32 px wide.
  Heights 18–22 px each, irregular top and bottom edges (jagged 1-px steps).
- Middle course (y=20–42): three stones — roughly 18 px, 22 px, 22 px wide.
- Lower course (y=42–64): two stones, roughly 30 px and 32 px wide.

**Stone colour:** Very dark cool grey (#282a28) base. Each stone face has a slightly
different base value (range #222226 to #2e3028) — flat banded difference per stone,
hard pixel edge at the joint. Crystalline fleck texture across all stones: scattered 1-px
pixels of slightly lighter pale grey (#3a3c38) distributed irregularly across each face —
8–12 flecks per stone.

**Mortar joints:** 2–3 px wide, filled with flat very dark grey (#141414). At several
joint intersections: white lime staining (1–2 px flat pale grey #8a8a80) where
carbonation has bled out.

**Damp and mould:** General very dark wash across the lower 24 px — the base colour
drops to (#1e201e) here, suggesting moisture ingress. Small dark green-black mould
patches (#141810) at three joint intersections in the lower course.

**Damage:** One stone in the middle course has a diagonal fracture: a 1-px near-black
crack (#0c0c0a) running across the full stone face. One adjacent stone shows a corner
chip: a 4×3 px area of missing face (#141414 void) with fresh pale stone exposed at the
fracture (#3c3e3a).

**Dominant tone:** Very dark cool grey limestone rubble
**Accent:** Crystalline fleck texture, lime staining at joints, mould at base
