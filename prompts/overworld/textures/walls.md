# Overworld — Exterior Wall Textures

> **SIZE: 64 × 64 pixels. Square. 1:1 aspect ratio. Not rectangular.**
>
> **STYLE: Pixel art. Hard-edged aliased pixels only. Banded shading. 12–20 colours max.**
>
> **FORMAT: PNG, 8-bit RGB, no alpha channel.**
>
> All wall tiles tile seamlessly on the horizontal axis (left edge matches right edge exactly).
> Vertical seamlessness is not required.
> See style-guide.md for the full overworld setting, colour temperature, and renderer context.

---

## wall_opera_facade — The Opera House Exterior (Type 17)

> **64 × 64 px. PNG. No alpha.**

**Used:** The exterior face of the Opera House — the wall the player sees when
approaching the building from Main Street.

Rusticated sandstone ashlar — the formal 1870s Opera House facade. Smooth-dressed
rectangular blocks with narrow recessed joints. The stone is a dark warm buff-grey,
much darker than it would appear in daylight — the colour of old sandstone at night under
faint moonlight.

**Block courses:** Two courses of blocks per tile height. Each block roughly 28–30 px wide,
14 px tall. Blocks are smooth-faced — no rough texture — this is dressed ashlar, not rubble.
The joint lines are 2 px wide, recessed, flat very dark grey (#141210).

**Stone colour:** Very dark warm buff-grey (#28241c) for the main block faces. Each block
face has a slightly different flat value: some #28241c, some #222018, some #2e2820 — flat
banded variation per block, hard-edged at joints. No in-block gradient.

**Architectural detail:**
The tile represents a section of the main facade wall between windows and door surrounds.
At the tile's upper-left corner: the beginning of a flat pilaster — a slightly raised
vertical column strip (8 px wide) projecting 2 px from the wall face. The pilaster face
is 1 shade lighter (#363228) with a 1-px shadow line at its left edge (#141210).

**Weathering:**
- Salt and mineral staining runs vertically down one block face — pale grey-white streaks
  (#5a5848), 1–2 px wide, running the full tile height at x=34.
- Soot accumulation: the upper 12 px of the tile are slightly darker (#1e1c14) — decades
  of coal smoke settling on the upper courses.
- Bird deposits: 2–3 flat 2-px white-grey flecks (#8a8878) scattered on the block faces.

**Dominant tone:** Very dark warm buff-grey ashlar with smooth faces
**Accent:** Pilaster projection strip, salt streak, soot at top

---

## wall_mill_facade — Great Western Sugar Mill Exterior (Type 18)

> **64 × 64 px. PNG. No alpha.**

**Used:** The exterior face of the Great Western Sugar Mill — the industrial building in
the fenced yard to the south-east.

Corrugated galvanised iron cladding — the exterior skin of the 1903 sugar factory. Same
corrugated iron as the interior R2 wall type (wall_corrugated, Type 7) but seen from the
outside: slightly different weathering profile, more visible rust streaking, a painted
company name area.

**Corrugation profile:** Vertical corrugations running the full tile height. Each
corrugation is 8 px wide: ridge highlight (2 px, #363028), flat mid-face (#262018),
valley shadow (2 px, #161008). The outside face has slightly more UV bleaching than
the interior — mid-face value is 1 shade lighter.

**Rust:** Heavy rust damage — the exterior metal has had 70 years of Colorado weather.
A broad rust blotch (20×30 px) in the left-centre of the tile: solid areas of flat dark
orange-brown (#4a2010) replacing the galvanise finish, with scattered 1-px near-black
pitting (#0a0806). At the blotch edges: a 1-px lighter orange halo (#5a3018).

**Painted text remnant:** At y=12 to y=28, across the tile width: the ghost of painted
lettering — "GW SUGAR" in pale block letters once. Now almost entirely gone. Represented
as flat pale grey-white pixel shapes (#3a3830), 1–2 px thick horizontal and vertical
strokes, only 30–40% of the original letterforms still visible. The background behind
the text area is a flat dark grey paint layer (#1c1c1a) applied when the sign was painted.

**Bolt row:** At y=8: evenly-spaced hex bolts (5-px octagon, dark grey #2a2828, 1 px
brighter centre) at 16-px intervals — the panel attachment bolts.

**Dominant tone:** Very dark rust-orange corrugated iron
**Accent:** Heavy rust blotch, ghost sign letterforms, bolt row

---

## wall_hotel_facade — Hotel Imperial Exterior (Type 19)

> **64 × 64 px. PNG. No alpha.**

**Used:** The exterior face of the Hotel Imperial — the Edwardian brick hotel facing
the Opera House across Main Street.

Dark red pressed brick in Flemish bond — the exterior skin of the 1902 hotel. Five-storey
building; this texture represents the upper floors. Flemish bond means alternating headers
and stretchers in each course — the brick pattern is more visually varied than running bond.

**Brick courses:** Each brick is 14 px wide (stretcher) or 6 px wide (header), 7 px tall,
with 1 px mortar joints. Two courses of bricks fit in the 64 px tile height, staggered in
Flemish bond. Brick colour: dark pressed red-brown (#2e1810) — a dense, smooth-surfaced
Victorian pressed brick, darker than the R2 kiln brick. Each brick face has a slightly
different flat value: range #2a1408 to #321c0e, hard-edged at mortar joints.

**Mortar joints:** 1 px wide, very dark grey (#141010). Mortar is recessed (typical of
Flemish bond construction). A few mortar joints in the lower-right quadrant have crumbling
mortar — the 1-px joint widens to 2 px in a 12-px section, revealing loose dark mortar.

**Architectural details:**
- String course: at y=32 (mid-tile), a slightly projecting band of brick — all the
  bricks in this 2-px band are set 1-px forward and 1 shade lighter (#3a2014).
  This is the visual separator between hotel floors.
- Window surround: upper-right corner shows the edge of a window surround — a
  flat stone (slightly lighter, buff-grey #302a20) reveals 6 px of its face at
  the right tile edge, with a 1-px shadow line at the left edge.

**Weathering:**
- General soot darkening: top 18 px of tile are darkened (#221008).
- Mineral deposit: an irregular pale stain (#4a4038) running vertically at x=18, width
  2 px, full tile height — rain trace from a window above.

**Dominant tone:** Very dark red-brown pressed brick, Flemish bond pattern
**Accent:** String course projection at mid-tile, rain trace mineral stain, window surround edge

---

## wall_hedge — Night Hedge / Tree Border (Type 20)

> **64 × 64 px. PNG. No alpha.**

**Used:** The boundary of the overworld map — the hedge and tree border surrounding
the town. The player cannot pass through this. It should feel like a wall of darkness.

A dense hedge of mature conifers and overgrown shrubs — the kind of naturalized tree
border common to Colorado towns, primarily blue spruce and boxwood, now completely
untrimmed for decades.

**Overall form:** The tile is almost entirely foliage. Dense, dark, irregular leaf/needle
clusters filling the entire tile area. This should not look like a wall — it looks like
a dense mass of dark vegetation. The silhouette edge at the top is irregular.

**Foliage:** Dark blue-green, very dark. The foliage is rendered as flat irregular clusters
of pixels in 3–4 close values:
- Darkest (void): #060a06 — the shadows deep in the hedge interior
- Dark: #0a1008 — the main foliage mass
- Mid: #121808 — the slightly exposed outer leaf surfaces
- Highlight: #1a2410 — the tops of spruce branches catching the faintest moonlight
  (8–12 individual 1-px highlight pixels at the tile's upper 12 px)

**Branch structure:** Within the foliage mass, 2-3 straight dark lines (#080c06) running
roughly diagonally — the branch stems underneath the foliage. 1–2 px wide each.

**Tree silhouette top:** The tile's upper 14 px shows the irregular top edge of the
hedge. The edge is a hard jagged pixel silhouette: sharp individual needle clusters
(upward-pointing 2–3 px spikes of slightly lighter foliage #1a2410) alternating with
darker gaps (#0a1008), against the near-black sky that bleeds in from above.

**Base:** The bottom 8 px of the tile is soil and roots — flat very dark brown (#100c06)
with a few 1-px flat pebble-grey pixels (#1e1c16) suggesting ground debris.

**Dominant tone:** Near-black blue-green dense foliage
**Accent:** Moonlight catch-light highlights at top edge, branch stem lines, dark void interior
