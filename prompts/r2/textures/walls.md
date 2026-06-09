# Round II — Wall Textures

> **SIZE: 64 × 64 pixels. Square. PNG. No alpha.**
>
> **STYLE: Pixel art. Hard-edged aliased pixels only. Banded shading. 12–20 colours max.**
>
> All wall tiles tile seamlessly on the horizontal axis.
> See style-guide.md for full setting, palette rules, and renderer context.

---

## wall_concrete — Wet Structural Concrete (Type 6)

> **64 × 64 px. PNG. No alpha.**

**Used:** Beet Yard outer walls and perimeter structures. Ground-level industrial construction.

Rough poured-and-stripped concrete — the no-frills structural fabric of a 1903 factory.
The formwork has left horizontal board impressions across the face: faint parallel ridges
every 14–16 px, each ridge catching a slightly lighter value (#30302c) against the dark
base (#242220). The concrete is coarse-aggregate: irregular dark specks (1–2 px, #181614)
and pale aggregate flecks (1 px, #4a4844) distributed across the surface. Three distinct
zones of staining: a wide rust streak running vertically from an embedded iron tie (dark
orange-brown gradient via 3-4 banded steps, #4a2010 → #3a1808 → #1e1208); a mineral
efflorescence patch (irregular white crystal deposit, #c8c4bc, roughly 6×10 px in the
lower-left quadrant); and a dark green-black algae bloom in the lower-right corner
(#1a2010, spread 8×8 px). Horizontal construction joint: a recessed 2 px groove at row 32
(tile centre), darker (#141210), with a thin mineral stain line immediately below.
The surface is damp throughout — the darkest patches are wettest.

**Dominant tone:** very dark grey-brown
**Accent:** rust streak, efflorescence crystal patch, algae bloom at base

---

## wall_corrugated — Corrugated Iron Sheet (Type 7)

> **64 × 64 px. PNG. No alpha.**

**Used:** Wash House, Slice Floor, Diffusion Hall interior walls and partitions.

Heavy-gauge corrugated iron cladding — the same sheet metal used for the factory's internal
partitions and flume walls. The corrugation profile creates parallel vertical ridges running
the full tile height: each corrugation is 8 px wide with a rounded-ridge highlight (2 px,
lighter, #4a3828), a flat mid-face (#2e2218), and a recessed-valley shadow (2 px, darker,
#1a1008). Base metal colour is a dark rust-orange (the iron has oxidised completely):
#2e2218 for mid-face, graduating to near-black in deep shadows. Rust damage: one section
of roughly 20×24 px shows severe surface rust — the flat corrugation face is almost entirely
converted to dark orange-brown (#4a2010) with pitting (1 px near-black holes scattered
irregularly). A horizontal bolt row runs across the tile at y=12: evenly-spaced hex bolts
(5 px wide octagon shape in dark grey #2a2a28 with a lighter centre pixel), one per 16 px
of width. Along the left corrugation valley: a streak of water-mineral deposit running
vertically (pale grey-white, #9a9490, 1-2 px wide, interrupted by the corrugation ridges).

**Dominant tone:** very dark rust-orange corrugated iron
**Accent:** heavy rust patch, bolt row, mineral water streak

---

## wall_lime — Lime Kiln Walls (Type 8)

> **64 × 64 px. PNG. No alpha.**

**Used:** Lime House kilns, furnace alcoves, processing chambers.

Lime-coated brick wall — the Lime House kiln chambers were built from brick and coated
with thick lime render to reflect heat. The render is now cracked and peeling from decades
of thermal cycling. Base render colour is pale warm grey-white (#5a5650) — much lighter
than any Round 1 texture, but still desaturated and dirty. Fine web of cracks across the
whole surface: the map-crack pattern typical of dried lime plaster, each crack a thin dark
line (#2a2826, 1 px). Two large fracture zones where the render has lifted: one 10×14 px
area in the upper-left shows render separated from brick, the shadow beneath it dark brown
(#3a2c24); one 8×12 px area near lower-right shows render completely spalled off,
revealing the scorched brick behind (#3a2010 — fire-reddened). Calcium carbonate whitewash
residue: irregular patches of slightly brighter white-grey (#706e6a) where fresh lime has
leached out and dried on the surface. A faint sooty deposit (#1a1816) bleeds from upper
left — heat and combustion gases from the adjacent kiln.

**Dominant tone:** pale warm grey-white (lighter than all other textures)
**Accent:** spalled patches exposing scorched brick, soot creep from upper edge

---

## wall_pipemetal — Pipe-Lagged Metal (Type 9)

> **64 × 64 px. PNG. No alpha.**

**Used:** Evaporator Gallery, Pan House — steam pipe banks and machinery walls.

Industrial pipe lagging and riveted boiler plate — the walls of the upper processing
floors are lined with insulated steam pipes and riveted steel panels. The surface is a
patchwork: alternating 12-px wide vertical bands of two materials. Even bands: riveted
boiler plate in dark blue-grey steel (#1e2228), with a row of 4 px round rivets at
horizontal intervals (rivet head: medium grey #3a3e44, with a bright catch-light pixel
#5a5e64 and a dark shadow pixel #0e1014). Odd bands: pipe lagging — wrapped in grey
canvas (#2a2826) now deteriorating, with dark brown fibrous insulation (#2a1e14) visible
where the canvas has split. A thick horizontal pipe crosses the tile at y=24: 8 px
diameter, dark grey steel (#1e2024), with a corroded flange fitting at tile centre (8×8 px
octagonal fitting in near-black, #14161a, with white mineral scale deposits on the
upper surface, #8a8c8e). Steam condensation: irregular water staining dripping down from
the flange, pale mineral streaks on both the plate and canvas below.

**Dominant tone:** very dark blue-grey industrial metal
**Accent:** riveted plate bands, canvas lagging, pipe flange with mineral scale

---

## wall_sugar — Sugar Crystal Walls (Type 10)

> **64 × 64 px. PNG. No alpha.**

**Used:** Sugar Tower — crystalline storage chambers, top-floor offices, roof access.

The upper storage chambers are coated in a thick accretion of recrystallised sugar — decades
of moisture and residue have grown a crystalline crust over every surface. This is the
strangest, most unsettling texture in the game. Base substrate: pale plastered brick
(#4a4844). Over this: a lumpy crystalline accretion layer. Individual sugar crystals are
rendered as irregular faceted clusters — groups of 2–5 px in pale off-white (#c8c6c0),
slightly yellow-white (#d0caba), and pale grey (#a8a6a0). The crystals catch light
differently on different facets: bright face (#d8d6d0), mid face (#b0aea8), shadow face
(#787672). The accretion is not uniform: thicker in the lower half of the tile (crystals
cluster 4–8 px deep) and sparser near the top (1–2 px facets only). Between crystal
clusters: dark gaps show the substrate (#2a2824). One large crystal formation (roughly
14×18 px centred left-of-centre) forms a prominent angular mass — it looks almost gemlike,
which is disturbing in context. Faint amber tinge in the densest crystal zones (#c8bc90)
— residual molasses staining the sugar brown.

**Dominant tone:** pale off-white crystalline accretion (brightest texture in the game)
**Accent:** large angular crystal formation, amber-stained deep zones, dark substrate gaps
