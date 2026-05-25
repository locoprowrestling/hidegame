# Tileset Regeneration — Prompt Cards

All 5 room tilesets need to be regenerated. The previous generation had two problems:
1. **Solid green (#00ff00) background** instead of a dark background — renders as bright green in-game
2. **Wrong tile content/order** — tiles were random props, not ordered as floor/wall/obstacle/hiding

## Required format for ALL tilesets

- **Sheet size:** 960×96 px — exactly 10 tiles in a single horizontal row, each tile 96×96 px
- **Background:** Dark (`#111111`) — NOT green, NOT transparent. Dark fills everything outside tile art.
- **Tile order is fixed across all rooms:**
  - Index 0 — **Floor tile (F):** main walkable ground texture
  - Index 1 — **Wall tile (W):** solid impassable border/wall
  - Index 2 — **Obstacle tile (O):** impassable interior object (seen from directly above)
  - Index 3 — **Hiding spot tile (H):** interactable tile, slightly brighter/greenish tint to signal it
  - Indices 4–9 — **Variant tiles:** additional floor/wall/accent variations for the room theme
- **Style:** Top-down orthographic view (camera looking straight down). Flat pixel art. No perspective, no isometric angle, no gradients, no realistic lighting. 16-bit era SNES aesthetic, chunky pixels, hard edges.
- **Output size:** 960×96 px

---

### Locker Room Tileset

**Purpose:** Floor and wall tiles for locker room screens (grid positions 0,0 and 3,0).
**Size:** 960×96 px — 10 tiles, each 96×96 px, single horizontal row
**Transparency:** No — dark (`#111111`) background
**Output path:** `Assets/bg_tiles/hide/locker-room-tileset.png`

**Prompt:**
```
Pixel art top-down tile sheet for a pro wrestling locker room, viewed directly from above (orthographic top-down, not isometric). Single horizontal row of exactly 10 square tiles, each 96x96 pixels, total sheet 960x96 pixels. Dark (#111111) background behind all tiles. SNES-era chunky pixel art, flat colors, no gradients, no realistic lighting, no perspective distortion.

Tile order (left to right):
0: Floor tile — gray rubber mat flooring, top-down view, subtle grid texture, dark gray
1: Wall tile — dark metal wall panel, solid, no gaps, slightly lighter gray than background
2: Obstacle tile — top-down view of a metal bench (gray rectangle with slight edge highlight)
3: Hiding spot tile — top-down view of an open locker door, dark teal/green interior, slightly glowing teal outline to mark as interactable
4: Floor variant — tiled floor with thin grout lines, light gray tiles
5: Wall variant — teal metal locker exterior (closed), top-down sliver view of locker door
6: Wet floor tile — gray with small blue droplet marks
7: Drain tile — gray with a small cross-hatch drain symbol centered
8: Corner wall tile — dark corner junction
9: Shadow tile — dark edge tile, used near walls

No green (#00ff00) anywhere. No isometric angle. No gradients. No anime style. No text. No transparent background — use dark (#111111) fill.
```

**AVOID:**
- Green (#00ff00) background — use dark (#111111)
- Isometric or perspective angles — must be flat top-down
- Gradients or realistic lighting
- Any tile larger or smaller than 96×96 px
- More than one row of tiles

**NOTES:** Code reads this as: `F:0, W:1, O:2, H:3` after this regeneration. Update `ROOM_TILESETS` in renderer.js to match.

---

### Backstage / Hallway Tileset

**Purpose:** Floor and wall tiles for backstage and hallway screens.
**Size:** 960×96 px — 10 tiles, each 96×96 px, single horizontal row
**Transparency:** No — dark (`#111111`) background
**Output path:** `Assets/bg_tiles/hide/backstage-hallway-tileset.png`

**Prompt:**
```
Pixel art top-down tile sheet for a pro wrestling backstage hallway, viewed directly from above (orthographic top-down, not isometric). Single horizontal row of exactly 10 square tiles, each 96x96 pixels, total sheet 960x96 pixels. Dark (#111111) background behind all tiles. SNES-era chunky pixel art, flat colors, no gradients, no realistic lighting.

Tile order (left to right):
0: Floor tile — concrete floor, dark gray with subtle crack texture, top-down view
1: Wall tile — solid concrete block wall, slightly lighter gray, rough texture
2: Obstacle tile — top-down view of a black road case/equipment trunk (rectangle with corner clasps)
3: Hiding spot tile — top-down view of a large equipment trunk with open lid, dark interior, slight green glow outline to signal interactable
4: Floor variant — painted concrete with a yellow stripe running horizontally through the tile
5: Wall variant — wall with mounted electrical box (gray rectangle with small red indicator pixel)
6: Floor variant — scuffed/worn concrete, slightly darker patches
7: Cable tile — dark floor with orange/yellow cable bundle running through it
8: Corner wall tile — dark wall corner junction
9: Shadow tile — dark edge shadow tile near walls

No green (#00ff00) anywhere. No isometric angle. No gradients. No text. Use dark (#111111) background fill everywhere outside tile content.
```

**AVOID:**
- Green (#00ff00) background
- Isometric/perspective angles
- Gradients, realistic lighting, blur
- Text or labels

**NOTES:** Used for `hallway_top_1`, `hallway_top_2`, `backstage_left`, `backstage_right`, `entrance_center_1`, `entrance_center_2`. Code: `F:0, W:1, O:2, H:3`.

---

### Wrestling Ring Tileset

**Purpose:** Floor and wall tiles for ringside screens (grid center positions 1,1 and 2,1).
**Size:** 960×96 px — 10 tiles, each 96×96 px, single horizontal row
**Transparency:** No — dark (`#111111`) background
**Output path:** `Assets/bg_tiles/hide/wrestling-ring-tileset.png`

**Prompt:**
```
Pixel art top-down tile sheet for a pro wrestling ring interior, viewed directly from above (orthographic top-down, not isometric). Single horizontal row of exactly 10 square tiles, each 96x96 pixels, total sheet 960x96 pixels. Dark (#111111) background behind all tiles. SNES-era chunky pixel art, flat colors, no gradients, no realistic lighting.

Tile order (left to right):
0: Floor tile — white canvas mat, top-down view, slightly off-white with subtle scuff texture
1: Wall tile — solid black arena barrier/boundary wall, thick border
2: Obstacle tile — top-down view of a red corner turnbuckle pad (red square, rounded)
3: Hiding spot tile — top-down view of space under the ring apron (dark rectangle with dark green highlight edge to signal interactable)
4: Floor variant — red canvas mat stripe tile (white canvas with red stripe)
5: Floor variant — ring apron edge tile — white edge with red border stripe
6: Arena floor tile — dark gray concrete arena floor (outside ring)
7: Crowd barrier tile — top-down view of a silver metal barrier rail (silver horizontal bar on dark floor)
8: Corner tile — dark corner where barrier meets arena floor
9: Shadow tile — dark tile for edges/shadows near walls

No green (#00ff00) background. No isometric angle. No gradients. No text. Dark (#111111) fill behind all tiles.
```

**AVOID:**
- Green (#00ff00) anywhere
- Isometric angle — strict top-down orthographic only
- Gradients or realistic shadows

**NOTES:** Used for `ringside_center_1`, `ringside_center_2`. Code: `F:0, W:1, O:2, H:3`.

---

### Entrance / Curtain Tileset

**Purpose:** Floor and wall tiles for entrance corridor screens.
**Size:** 960×96 px — 10 tiles, each 96×96 px, single horizontal row
**Transparency:** No — dark (`#111111`) background
**Output path:** `Assets/bg_tiles/hide/entrance-curtain-tileset.png`

**Prompt:**
```
Pixel art top-down tile sheet for a pro wrestling entrance corridor, viewed directly from above (orthographic top-down, not isometric). Single horizontal row of exactly 10 square tiles, each 96x96 pixels, total sheet 960x96 pixels. Dark (#111111) background behind all tiles. SNES-era chunky pixel art, flat colors, no gradients.

Tile order (left to right):
0: Floor tile — dark red carpet, top-down view, solid dark crimson with subtle ribbed texture
1: Wall tile — solid dark wall, near-black, concrete
2: Obstacle tile — top-down view of a speaker cabinet (black rectangle with circular speaker grille pattern)
3: Hiding spot tile — top-down view of a large velvet curtain bundle piled against wall (dark red/purple folds, green glow outline to signal interactable)
4: Floor variant — carpet with gold border strip tile
5: Floor variant — stage grating/metal grate floor tile (dark gray grid pattern)
6: Wall variant — wall with mounted lighting truss attachment (dark with small orange circle)
7: Smoke/fog floor tile — dark floor with small white pixel wisps
8: Corner tile — dark corner junction
9: Shadow tile — very dark edge tile

No green (#00ff00) anywhere. No isometric angle. No gradients. Dark (#111111) fill behind all tiles.
```

**AVOID:**
- Green (#00ff00) background
- Isometric perspective
- Gradients, blur, realistic lighting

**NOTES:** Used for `entrance_left`, `entrance_right`. Code: `F:0, W:1, O:2, H:3`.

---

### Storage Room Tileset

**Purpose:** Floor and wall tiles for storage room screens (grid bottom row).
**Size:** 960×96 px — 10 tiles, each 96×96 px, single horizontal row
**Transparency:** No — dark (`#111111`) background
**Output path:** `Assets/bg_tiles/hide/storage-room-tileset.png`

**Prompt:**
```
Pixel art top-down tile sheet for a pro wrestling arena storage room, viewed directly from above (orthographic top-down, not isometric). Single horizontal row of exactly 10 square tiles, each 96x96 pixels, total sheet 960x96 pixels. Dark (#111111) background behind all tiles. SNES-era chunky pixel art, flat colors, no gradients.

Tile order (left to right):
0: Floor tile — bare concrete floor, dark gray, top-down view, subtle noise texture
1: Wall tile — solid dark concrete/cinder block wall, near-black with faint block lines
2: Obstacle tile — top-down view of a wooden crate (brown rectangle with cross-brace lines)
3: Hiding spot tile — top-down view of a tall pile of boxes/crates with a gap (dark brown stacked boxes, green glow outline to signal interactable hiding space)
4: Floor variant — concrete with oil stain marks (dark gray with darker irregular splotch)
5: Metal shelf tile — top-down view of a metal shelf unit (gray horizontal bars on dark)
6: Floor variant — concrete with painted yellow hazard stripe
7: Drain/grate tile — dark concrete floor with a small metal grate pattern centered
8: Corner wall tile — dark cinder block corner
9: Shadow tile — very dark edge tile

No green (#00ff00) anywhere. No isometric angle. No gradients. Dark (#111111) fill behind all tiles.
```

**AVOID:**
- Green (#00ff00) background — strictly forbidden
- Isometric or perspective angles
- Gradients, blur, realistic rendering

**NOTES:** Used for `storage_bl`, `storage_bm_1`, `storage_bm_2`, `storage_br`. Code: `F:0, W:1, O:2, H:3`.

---

## Code changes required after regeneration

After all 5 tilesets are regenerated, update `ROOM_TILESETS` in `renderer.js` — all rooms get the same simple index mapping since the tile order is now consistent:

```js
var ROOM_TILESETS = {
  locker_room_tl:    { img: 'tileLockerRoom',    F: 0, W: 1, O: 2, H: 3 },
  locker_room_tr:    { img: 'tileLockerRoom',    F: 0, W: 1, O: 2, H: 3 },
  hallway_top_1:     { img: 'tileBackstage',     F: 0, W: 1, O: 2, H: 3 },
  hallway_top_2:     { img: 'tileBackstage',     F: 0, W: 1, O: 2, H: 3 },
  backstage_left:    { img: 'tileBackstage',     F: 0, W: 1, O: 2, H: 3 },
  backstage_right:   { img: 'tileBackstage',     F: 0, W: 1, O: 2, H: 3 },
  ringside_center_1: { img: 'tileWrestlingRing', F: 0, W: 1, O: 2, H: 3 },
  ringside_center_2: { img: 'tileWrestlingRing', F: 0, W: 1, O: 2, H: 3 },
  entrance_left:     { img: 'tileEntrance',      F: 0, W: 1, O: 2, H: 3 },
  entrance_right:    { img: 'tileEntrance',      F: 0, W: 1, O: 2, H: 3 },
  entrance_center_1: { img: 'tileBackstage',     F: 0, W: 1, O: 2, H: 3 },
  entrance_center_2: { img: 'tileBackstage',     F: 0, W: 1, O: 2, H: 3 },
  storage_bl:        { img: 'tileStorage',       F: 0, W: 1, O: 2, H: 3 },
  storage_bm_1:      { img: 'tileStorage',       F: 0, W: 1, O: 2, H: 3 },
  storage_bm_2:      { img: 'tileStorage',       F: 0, W: 1, O: 2, H: 3 },
  storage_br:        { img: 'tileStorage',       F: 0, W: 1, O: 2, H: 3 },
};
```

Also update in `renderer.js`:
```js
var TILESET_CELL_W = 96;   // unchanged
var TILESET_CELL_H = 96;   // changed from 102 → 96 (new sheets are square)
```
