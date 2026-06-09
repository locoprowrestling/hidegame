# Stage III — Ceiling Textures

> **SIZE: 64 × 64 pixels. Square. 1:1 aspect ratio. Not rectangular.**
>
> **STYLE: Pixel art. Hard-edged aliased pixels only. Banded shading. 12–20 colours max.**
>
> **FORMAT: PNG, 8-bit RGB, no alpha channel.**
>
> Ceiling tiles must tile seamlessly in both axes (left↔right and top↔bottom).
> In the raycaster the tile repeats across the overhead plane seen in perspective recession.
> Large-scale features (8 px+) read better than fine grain at ceiling angles.
> See style-guide.md for setting and palette rules.

---

## Texture index mapping

Stage III uses `texOffset: 12`. Floor index n maps to `CEIL_TEXTURES[12 + n]`.
Asset filenames: `assets/r3/textures/ceiling_<name>.png`.

| Floor | Name              | Tex index | Asset filename               |
|-------|-------------------|-----------|------------------------------|
| 0     | The Lobby         | 12        | ceiling_lobby.png            |
| 1     | Grand Ballroom    | 13        | ceiling_ballroom.png         |
| 2     | Kitchen & Dining  | 14        | ceiling_kitchen.png          |
| 3     | Guest Floor II    | 15        | ceiling_guestII.png          |
| 4     | Guest Floor III   | 16        | ceiling_guestIII.png         |
| 5     | Guest Floor IV    | 17        | ceiling_guestIV.png          |
| 6     | Honeymoon Suites  | 18        | ceiling_honeymoon.png        |
| 7     | Maids' Quarters   | 19        | ceiling_maids.png            |
| 8     | Service Attic     | 20        | ceiling_attic.png            |
| 9     | The Penthouse     | 21        | ceiling_penthouse.png        |

---

## ceiling_lobby — Lobby Coffered Plaster (Index 12)

> **64 × 64 px square. PNG. No alpha.**

**Used:** The Lobby (floor 0). The formal entrance hall ceiling.

Deep coffered plaster ceiling — the full-height Lobby ceiling is divided into square
coffers with wide raised ribs. Each coffer holds an applied plaster rosette. Heavily
deteriorated; some sections of coffer relief have collapsed.

**Coffer grid:** The 64 × 64 tile contains a 2×2 grid of coffers (each coffer 28×28 px)
separated by raised ribs (4 px wide on each axis).
Rib colour: flat dark warm grey (#2e2c26). Each rib face has a 1-px highlight along
its upper edge (#3a3832) and a 1-px shadow along its lower edge (#1a1818).
Coffer field (recessed): flat dark grey-cream (#2a2820).

**Rosette in each coffer:** Centred, 10 px diameter. A circular banded form rendered
as flat concentric pixel rings: outer ring 1 px (#302e28), inner rings progressively
slightly lighter (#343028, #383228). The rosette has remnant gilding: 4–6 flat dark gold
pixels (#5a4c10) scattered on one petal segment. The other petals are grey.

**Damage:**
- Upper-right coffer: a 16×12 px section of the coffer field has fallen away — flat dark
  brown lath substrate (#1e1810), with pale plaster fragments at the edge.
- One rib shows a crack: 1 px near-black line running 20 px along the rib length.
- Cobwebs in lower-left coffer corners: 1 px pale grey lines (#4a4840) strung between
  rib and coffer edges, with a 2×2 px dust mass at the corner junction.

**Dominant tone:** Dark warm grey coffered plaster
**Accent:** Fallen-plaster void upper-right, ghost gilding on rosette, cobwebs

---

## ceiling_ballroom — Grand Ballroom Vaulted Ceiling (Index 13)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Grand Ballroom (floor 1). The grandest ceiling in the building.

A shallow barrel-vault ceiling with elaborate painted and gilded decoration —
cartouches, swag garlands, winged figures (now almost invisible). Most of the surface
paint has fallen; what remains is extraordinary in its decay.

**Background:** Flat very dark blue-grey (#1c1e24) — the base coat beneath the painted
plaster, now exposed across most of the ceiling.

**Surviving painted forms:** Flat pixel shapes in slightly lighter values:
- A broad horizontal band at y=20–28: flat dark warm grey (#252322) — the remnant of a
  painted border. Within it: the ghost of a swag garland, reduced to 3–4 flat dark gold
  pixels (#4a4010) at irregular positions.
- Two ghost cartouche rectangles: flat pixel outlines (#222028), each roughly 16×10 px,
  positioned upper-left and lower-right of the tile.

**Structural cracks:** Three cracks radiating from a central point (approximately x=36,
y=16). Each crack is 1–2 px wide, near-black (#0a0a0e), radiating at different angles,
running to the tile edge. Hard pixel lines.

**Fallen plaster:** Two flat pale patches (#3a3830) with jagged hard pixel edges — the
raw plaster coat exposed where the painted surface layer has fallen. Each patch 10–16 px
wide. At the patch edges: small dark fragments (#1e1c1e) suggesting fallen pieces below.

**Gold fragment:** One 4×4 px cluster of flat gold pixels (#7a6010) near tile centre —
the one remaining area of gold leaf still adhering to the vault surface.

**Dominant tone:** Very dark blue-grey exposed base coat
**Accent:** Radiating cracks, single gold-leaf cluster, ghost painted forms

---

## ceiling_kitchen — Kitchen White Tile Ceiling (Index 14)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Kitchen & Dining (floor 2). The service ceiling.

White ceramic subway tile ceiling — same tile type as the kitchen walls, continued
overhead. Practical and clinical in intent, now grimy and cracked.

**Tile grid:** Same specification as the wall tile (wall_tile, Type 13) but used
overhead. Each tile 16 × 10 px, brick-bond offset. Grout lines 2 px, dark (#1e2018).
Tile face base: flat grey-white (#484844).

**Overhead grease:** The ceiling directly over the stove line is heavily coated in dark
amber-brown grease vapour deposit (#3a2808). This covers a 30-px wide central vertical
band across the full tile, reducing the tile colours by 2 shades within that band.
Outside the band: clean(er) tiles, still dirty but not grease-blackened.

**Cracked tiles:** Three individual tiles show 1-px cracks. One tile near the upper-left
is completely shattered — flat dark void (#141412).

**Sagging area:** A 16×10 px section of tiles in the lower-right is slightly displaced —
the grout lines around this group are wider (3 px) suggesting settlement. The tiles
themselves are flat but clearly offset.

**Dominant tone:** Dull grey-white tile, heavily grease-stained in centre band
**Accent:** Grease-stained central band, shattered tile void, sagging tile group

---

## ceiling_guestII — Guest Floor II Flat Plaster (Index 15)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Guest Floor II corridor ceiling (floor 3).

Flat lime plaster ceiling — painted white originally, now heavily stained and cracked.
The simplest ceiling in the guest area. Repeated across all three guest floor corridors
but with increasing damage.

**Surface:** Flat very dark warm grey (#28261e) — the original white plaster coat
now yellowed, smoked, and dark. Uniform base with the following damage:

**Cracks:** A primary crack runs horizontally across the tile at y=24, 1–2 px wide,
slightly lighter dark line (#302e26 — the crack edge reveals slightly fresher plaster).
Two secondary hairline cracks branch off it at irregular angles, each 1 px, 12–20 px long.

**Water stain:** A large irregular blotch in the upper-left quadrant (#1e1c14),
approximately 20×16 px, with a 1-px drying ring (#302e20) around its border.
Rust-brown ring mark inside the stain: 1 px flat dark orange-brown (#3a2010) at the
stain centre — from a pipe fitting above.

**Paint bubbling:** One 10×8 px area lower-right where the plaster has lifted and the
paint has bubbled: flat slightly lighter pixels (#343028) in a slightly raised rectangle,
with a 1-px shadow line below it.

**Dominant tone:** Very dark stained plaster
**Accent:** Large water stain with rust ring, primary crack, paint bubble zone

---

## ceiling_guestIII — Guest Floor III Cracked Plaster (Index 16)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Guest Floor III ceiling (floor 4). Same ceiling type as floor 3, more damaged.

Same flat plaster as Guest Floor II but with more extensive cracking and two areas of
plaster fall.

**Surface:** Same base tone (#262418) — slightly darker than floor 3.

**Crack network:** Multiple cracks: a primary horizontal crack at y=20, plus two vertical
cracks at x=20 and x=44 — forming a rough grid. Additional hairline cracks fill the
upper-right quadrant, making that area a dense crack map (15–20 total 1-px crack pixels
in a 16×16 area).

**Fallen plaster:** Two areas of plaster fall — each revealing flat dark brown lath
(#1e1810) beneath:
- Upper-right: 10×8 px void with jagged hard pixel edge.
- Lower-centre: 14×10 px void.

**Mould:** Dark green-grey mould bloom (#161e10) in lower-left quadrant, 12×12 px.

**Dominant tone:** Very dark cracked plaster
**Accent:** Crack grid, two plaster-fall voids, mould bloom

---

## ceiling_guestIV — Guest Floor IV Stripped Plaster (Index 17)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Guest Floor IV ceiling (floor 5). The most damaged of the three guest corridors.

Much of the plaster has fallen. The surface is half bare lath, half crumbling plaster.

**Surface:** Split between two zones across the tile:
- Left 32 px: plaster largely intact but severely cracked and stained. Base
  (#222018). Dense crack map: nearly every 8×8 px area has at least one 1-px crack.
- Right 32 px: plaster almost entirely gone. Flat exposed lath substrate: dark brown
  (#1a1208) with horizontal lath strips visible — 4-px bands of slightly lighter value
  (#201810) at 8-px vertical intervals (the lath planks) with 4-px darker gaps between.

**Transition zone:** At x=32, a jagged hard-pixel boundary where the remaining plaster
meets the bare lath.

**Remaining plaster fragments on right half:** Three small irregular patches of plaster
still adhering to the right half — each 4–8 px wide, flat pale (#302e28), hard jagged edges.

**Dominant tone:** Very dark crumbling plaster left, bare lath right
**Accent:** Sharp plaster/lath transition at tile centre, plaster fragment remnants

---

## ceiling_honeymoon — Honeymoon Suites Vaulted Ceiling (Index 18)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Honeymoon Suites (floor 6). A private, intimate ceiling — lower vault, faded murals.

A shallow vault with hand-painted mural panels between the ribs — roses and cherubs,
now reduced to stained ghost forms. More intimate than the Ballroom vault.

**Background:** Flat very dark warm grey (#241e1c). The vault painted ground, now exposed.

**Ghost mural forms:** Flat pixel shapes barely lighter than background (#2a2420):
- Upper quarter: the ghost of a floral garland — a horizontal sinuous line of 2-px wide
  flat pixels, 3–4 flower motifs reduced to 4×4 px blobs along the line.
- Lower-right quadrant: a circular form, 12 px diameter, flat pixel circle — the ghost
  of a medallion or figure.

**Rib moulding:** A raised decorative rib runs diagonally from upper-left to lower-right
of the tile (8 px wide). Rib surface: flat dark warm grey (#2e2820), highlight row
along upper face 1 px (#363028), shadow 1 px (#181410).

**Damage:** One 12×8 px area of vault plaster fallen in the upper-right — dark lath
exposed (#1e1610). Gold leaf once applied to the rib moulding has largely gone — only
3–4 flat gold pixels (#5a4a10) remain on the rib face.

**Dominant tone:** Very dark warm grey faded mural vault
**Accent:** Ghost mural forms, diagonal decorative rib, fallen plaster zone

---

## ceiling_maids — Maids' Quarters Bare Joists (Index 19)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Maids' Quarters (floor 7). Purely functional. Never plastered.

Bare structural timber joists — the structural roof/floor assembly seen from below.
Same construction as the Upper Gallery in Round 1 but simpler, darker, more cramped.

**Joist structure:** Joists run horizontally across the tile. Each joist is 10 px tall.
Gap between joists: 8 px (the underside of the boards above).
Base joist colour: flat very dark brown (#18100a). Grain: horizontal 1-px lighter lines
(#201408). Bottom face (the visible underside): slightly lighter than the sides (#201810).

**Gap fill (underside of boards above):** Flat dark brown (#221a12). Nail holes visible:
isolated 1-px near-black dots (#080604) at 14-px intervals in the gap fill.

**Cobwebs:** A dense web in the upper-left gap bay — 1-px pale grey lines (#303028)
forming a triangle between joist sides and the board above. A 2×2 px dark dust mass
at one corner junction. A smaller, more tattered web in the lower-right bay.

**Rope:** An old service rope hangs vertically from a hook in the centre joist. The rope
is 2 px wide, dark hemp colour (#2c2018), running through the gap at x=34. The end is
frayed — 3–4 stray 1-px pixels splaying below the gap.

**Dominant tone:** Very dark brown-black joists and boards
**Accent:** Cobwebs in gap bays, frayed hanging rope, nail-hole dots

---

## ceiling_attic — Service Attic Exposed Rafters (Index 20)

> **64 × 64 px square. PNG. No alpha.**

**Used:** Service Attic (floor 8). The topmost level — directly under the roof. Raw.

The roof structure seen from the inside. Rafters and ridge board, untreated, in near-
total darkness. This ceiling should feel oppressively low and hostile.

**Rafter structure:** Rafters run diagonally — two rafters visible in the tile, both
angled from upper-left toward lower-right at approximately 30°. Each rafter is 8 px wide.
The rafter is rendered as a flat pixel diagonal — each step 1 px right, 1-2 px down —
creating a hard stair-step approximation of the diagonal.
Rafter top face: flat very dark brown (#16100a). Side/shadow face: near-black (#0c0806).
Highlight along the top edge: 1-px slightly lighter (#201810).

**Background void:** The area between rafters is near-total black (#060402) — roof decking
above, but no light.

**Ridge board:** A horizontal element at y=8 (the roof peak running across the tile):
8 px tall, flat very dark brown (#181208), same grain treatment as the rafters.

**Damage:** Several rafter sections show dark staining where roof leaks have tracked
down the rafter surface — irregular flat dark patches (#0e0a06) on the rafter face.
One short section of rafter shows rot: slightly lighter, crumbly-textured area (#221a12)
with 1-px isolated darker specks suggesting fungal breakdown.

**Dominant tone:** Near-black void with dark diagonal rafter forms
**Accent:** Rafter diagonal forms, ridge board horizontal, leak-stain patches

---

## ceiling_penthouse — Penthouse Gilt Vault (Index 21)

> **64 × 64 px square. PNG. No alpha.**

**Used:** The Penthouse (floor 9). The finest ceiling in the building — deeply ornate,
oppressive in its extravagance.

A full coffered and gilded plaster ceiling — the same Louis XVI style as the Lobby but
deeper in relief, more heavily gilded, and strangely well-preserved in the sealed penthouse.
The gilding is still partially intact. This ceiling is the richest surface in the game —
but it should read as threatening, not beautiful.

**Coffer grid:** 2×2 coffers (each 28×28 px), separated by 4-px ribs.
Ribs: flat dark warm grey (#302c22), with a 2-px highlight (#404030) on the rib crown
and a deep shadow groove (2 px, #141006) where the rib meets the coffer face.

**Coffer field:** Flat very dark warm grey (#28241a). Each coffer contains a large
raised rosette: 14 px diameter, rendered as concentric flat pixel rings of slightly
different values (#302c1e, #382e20, #3e321e, #443618). Gold leaf on the outermost ring:
flat gold pixels (#8a7020), approximately 60% coverage — some missing, some intact.

**Full-gilt moulding frame:** Inside each coffer, a 2-px moulding border runs around
the perimeter. This border retains more gold than anything else in the building: flat
bright dark gold (#a08030) for the 40% still adhering, flat dark brown (#2a1c08) where
it has fallen.

**Pendant:** At the centre of the tile (the rib intersection): a flat pendant boss —
a circle of 8 px diameter with a small dark void at centre (3 px, for the original
chandelier chain hook). The boss face: flat dark gold (#7a6020) with a bright catch-light
1-px row (#c0a040) — the one surface in the game that still reflects light measurably.

**Dominant tone:** Very dark warm grey with partial tarnished gold coverage
**Accent:** Gilt pendant boss with bright catch-light, partially-gilt coffer rosettes
