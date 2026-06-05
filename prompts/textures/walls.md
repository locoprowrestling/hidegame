# Wall Tiles

> **SIZE: 64 × 64 pixels. Square. 1:1 aspect ratio. Not rectangular.**
>
> **STYLE: Pixel art. Hand-pixeled retro game wall texture. No painting. No realism.**
> Hard-edged aliased pixels only. No anti-aliasing. No gradients. No brush strokes.
> Banded shading with flat colour steps. 12–20 colours per texture maximum.
>
> **FORMAT: PNG, 8-bit RGB, no alpha channel.**

All wall tiles tile seamlessly on the horizontal axis (left edge matches right edge).
See style-guide.md for full palette, pixel art rules, and renderer context.

---

## wall_stone — Outer Structural Granite (Type 1)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Exterior perimeter walls of the Grand Foyer and all outer boundaries.

Rough-hewn granite ashlar — the basement and structural character of the building. Each block
is roughly 28 × 14 px in the tile (two rows of blocks per tile height), dressed flat on the
face but with irregular rough edges at the joints. Granite colour is very dark blue-grey
(#32343a) with the characteristic salt-and-pepper crystalline speckle of the rock: individual
mineral grains of quartz (pale grey flecks, 1 px), feldspar (slightly warm grey, 1–2 px
clusters), and biotite (near-black specks, 1 px). This speckle texture must remain visible even
at the dark overall value. Mortar joints are 2 px wide, very dark (#18181c), slightly recessed.
Damp: the lower quarter of the tile is noticeably darker — moisture wicking up from below, with
a faint greenish mould bloom in the lower mortar joints (#1e2818). One block face carries a
broad water-mineral stain streaking vertically (pale grey-white salt deposit, #6a6a70). Corner
chips on two block edges expose fresher, slightly lighter stone beneath.

**Dominant tone:** very dark blue-grey with crystalline speckle

**Accent:** salt-mineral streak, damp darkening at base, mould in mortar

---

## wall_plaster — Interior Plaster (Type 2)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Auditorium interior walls, once finished to a high standard.

Smooth lime plaster surface that has decayed unevenly. Base colour is a pale warm grey (#5a5248)
with a faint ivory tint where the original white paint survives. Across the tile: a network of
fine hairline cracks in a map-crack pattern, each crack dark brown-grey. A broad water stain
bleeds down from the upper quarter — dark amber at the stain edge fading inward to a rusty
orange ring-mark. Sections of plaster have bubbled and lifted: one 12 × 8 px area near the
centre-left shows the plaster separating from the substrate, with a shadow underneath.
Remnants of gilded moulding: a narrow egg-and-dart border runs horizontally at the tile's
upper 10 px, once gold, now mostly dark brown with only flecks of pale gold remaining (#a08030).

**Dominant tone:** dusty warm grey

**Accent:** remnant gold moulding strip at top, rust-amber water stain

---

## wall_curtain — Stage Curtain (Type 3)

> **64 × 64 px square. PNG. No alpha.**

**Used:** The proscenium arch walls, stage surround.

Heavy velvet stage curtain hanging in vertical folds. The base fabric is deep crimson (#4a0a0a)
— not bright red, but the dark saturated red of aged velvet that has absorbed decades of dust
and stage smoke. Each fold is roughly 8–10 px wide. Highlight on the fold ridge: a narrow strip
of slightly lighter desaturated red (#6a2020). Shadow in the fold crease: near-black (#1a0404).
The pile surface of the velvet shows as a subtle directional nap texture — slightly lighter
strokes running diagonally downward across each fold, capturing the way velvet pile catches
light differently depending on direction. Along the upper 6 px of the tile: the curtain's top
hem, a line of dark brass grommets (small dark circles, 3 px each) and a glimpse of the heavy
iron rail above.

**Dominant tone:** deep crimson

**Accent:** near-black crease shadows, tiny brass grommet dots at top hem

---

## wall_brick — Exposed Backstage Brick (Type 4)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Backstage corridors, The Flies (rigging loft).

Rough utilitarian brick — the working fabric of the building, never meant to be seen by the
audience. Bricks are smaller than the foyer granite: each brick roughly 16 × 8 px, with thinner
mortar joints (2 px, near-black). Brick colour varies across the tile: some bricks are dark
terracotta (#3d1a10), some darker rust (#2d1208), a few almost charcoal-grey from soot. The
surface is rough and uneven — each brick face has a slightly different value and texture.
Several bricks show efflorescence (white salt crystal deposits, small irregular patches of very
pale grey-white, #ccc8c0), soot blackening above where gas lamps or cable trays once ran (a
dark horizontal smear near the top quarter), and one cracked brick near the centre with a dark
fracture line. Mortar is crumbling in places — small gaps and pits along some joints.

**Dominant tone:** very dark rust-red

**Accent:** soot smear, salt-white efflorescence patches

---

## wall_wood — Wood Panelling (Type 5)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Upper Gallery balcony walls, dressing room interiors.

Tongue-and-groove oak panelling installed when the upper gallery was fitted out. Each panel is
roughly 10–12 px wide, running vertically the full tile height. The wood is very dark —
originally stained a deep walnut (#2a1810), now further darkened by age, tannin release, and
years of accumulated grime. Wood grain runs vertically: thin, slightly lighter lines (1 px wide, colour #3a2418)
suggest the grain within each board. Panel joins show as thin recessed grooves (1 px,
near-black). A raised bead moulding at the top of the tile (upper 8 px): a small rounded
profile in the same dark wood, with a faint highlight along its crown. Several panels show
damage: a diagonal gouge scar on the left-centre panel (light wood exposed beneath the dark
stain, pale grain colour #7a5030), and a patch of dark mould bloom on the lower-right panel.

**Dominant tone:** very dark brown

**Accent:** pale exposed wood scar, mould bloom in lower corner
