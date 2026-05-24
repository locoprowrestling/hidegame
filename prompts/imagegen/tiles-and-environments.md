# Tiles and Environments — Prompt Cards

Each card covers one room type. The 4×4 grid layout is noted per card (center cells = open/dangerous, edge cells = hiding-rich). All prompts use the anchor sentence from `style-guide.md`. Tile size is 16×16 px.

---

### Wrestling Ring Room — Tile Set

**Purpose:** Floor and wall tiles for the wrestling ring room. Grid position: center (open/dangerous zone).
**Size:** Tile sheet — 10 tiles arranged in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No (solid floor tiles)
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down pro wrestling ring room. 10 tiles in a single row, each 16x16 pixels, solid backgrounds (not transparent). Tiles: canvas floor (red/white), ring rope section (red rope pixel line), corner turnbuckle (red pad), dark arena floor, wall tile (gray concrete), ring apron edge, ring post base, crowd barrier, dark boundary tile, highlight/damage canvas tile. Flat colors, hard pixel edges, chunky pixel-art style, consistent scale. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/wrestling-ring-tileset.png`. Red/white canvas dominates. Dark floor around ring perimeter. Hiding spots are under ring apron (tile 6) and behind barrier (tile 8).

---

### Backstage Hallway — Tile Set

**Purpose:** Floor and wall tiles for the backstage hallway. Grid position: edges (moderate hiding opportunity).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down backstage hallway. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: gray concrete floor, concrete wall, cable bundle on floor, equipment cart wheel, dark shadow corner, door frame tile, electrical box on wall, painted stripe on floor, scuff mark floor tile, recessed ceiling tile. Flat colors, hard pixel edges, chunky pixel-art style. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/backstage-hallway-tileset.png`. Gray concrete dominates. Dim implied lighting from upper-left. Hiding spots: behind curtains (tile 6), behind road cases.

---

### Locker Room — Tile Set

**Purpose:** Floor and wall tiles for the locker room. Grid position: edges (hiding-rich).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down locker room. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: teal metal locker door (closed), teal locker door (open), gray bench top, gray bench leg/side, tile floor (light gray), locker room wall tile, wet floor corner tile, drain tile, coat hook on wall, overhead light tile. Flat colors, hard pixel edges, chunky pixel-art style. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/locker-room-tileset.png`. Teal and gray dominate. Primary hiding spot: inside open lockers (tile 2).

---

### Storage Room — Tile Set

**Purpose:** Floor and wall tiles for the storage room. Grid position: corners (very hiding-rich).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down storage room. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: worn wood floor plank, dusty concrete floor, wooden crate side, stacked crate top, storage trunk lid, shadowed corner tile, cobweb corner tile, storage rack shelf, wall-mounted shelf, dark back wall. Flat colors, hard pixel edges, chunky pixel-art style, brown wood and gray stone palette. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/storage-room-tileset.png`. Warm brown and dusty gray palette. Hiding spots: inside crates (tile 3), behind stacks.

---

### Merch Area — Tile Set

**Purpose:** Floor and wall tiles for the merchandise area. Grid position: edges (moderate hiding).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down merchandise area. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: bright retail floor tile, merchandise table surface, table skirt edge, poster stand base, t-shirt rack base, price tag tile (no readable text), carpet floor, wall display tile, product shelf, entrance mat. Flat colors, hard pixel edges, chunky pixel-art style, bright retail colors. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No readable text on tiles
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/merch-area-tileset.png`. Bright retail colors — avoid drab/dark. Hiding spots: under tables, behind racks.

---

### Entrance Curtain — Tile Set

**Purpose:** Floor and wall tiles for the entrance curtain area. Grid position: edges (hiding-rich due to curtains).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down entrance curtain area. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: black curtain panel, gold curtain trim, black carpet floor, curtain rod section (top-down), spotlight pool on floor (flat circle, no gradient), black wall tile, dramatic arch column base, velvet rope floor tile, curtain fold left, curtain fold right. Flat colors, hard pixel edges, chunky pixel-art style, black and gold palette. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting or spotlight glow
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/entrance-curtain-tileset.png`. Black and gold palette. Hiding spot: behind curtains (tile 1/10).

---

### Seating Aisle — Tile Set

**Purpose:** Floor and wall tiles for the seating aisle. Grid position: edges (moderate hiding).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down stadium seating aisle. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: stadium gray concrete floor, red fold-up seat top, seat row edge, crowd barrier side, pillar cross-section (top-down), stair step tile, aisle stripe tile, under-seat shadow, steel railing segment, emergency light floor marker (flat, no glow). Flat colors, hard pixel edges, chunky pixel-art style. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/seating-aisle-tileset.png`. Stadium gray and red seat colors. Hiding spots: under seats (tile 8), behind pillars (tile 5).

---

### Production Booth — Tile Set

**Purpose:** Floor and wall tiles for the production/tech booth. Grid position: corner (very hiding-rich).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down production booth. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: dark tech gray floor, equipment rack front, monitor screen top-down (dark with flat pixel highlights), cable conduit floor strip, mixing board surface, dark wall panel, server rack vent, raised floor tile, dim indicator light tile (single flat pixel dot), black ceiling tile. Flat colors, hard pixel edges, chunky pixel-art style, dark tech gray palette. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting or screen glow
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/production-booth-tileset.png`. Dark gray dominates. Hiding spots: behind equipment racks (tile 2), behind monitors.

---

### Office — Tile Set

**Purpose:** Floor and wall tiles for the promoter's office. Grid position: corner (hiding-rich).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down office. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: warm carpet floor, wood desk surface, filing cabinet top-down, office chair top-down, bookshelf edge, window (top-down sill), door mat, potted plant base, wall baseboard, framed art on wall (no readable content). Flat colors, hard pixel edges, chunky pixel-art style, warm wood and carpet palette. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No readable text on tiles
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/office-tileset.png`. Warm wood brown and carpet tan palette. Hiding spots: under desks (tile 2), behind filing cabinets (tile 3).

---

### Opera House Interior — Tile Set

**Purpose:** Floor and wall tiles for an ornate opera house interior. Grid position: edges (hiding-rich in alcoves).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down ornate opera house interior. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: cream marble floor, gold trim edge tile, ornate column cross-section (top-down), velvet carpet strip, balcony railing segment, alcove shadow tile, chandelier base (top-down flat circle), decorative arch keystone, cream wall panel with gold detail, polished wood balcony floor. Flat colors, hard pixel edges, chunky pixel-art style, ornate cream and gold palette. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting or chandelier glow
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/opera-house-tileset.png`. Cream, gold, and velvet red palette. Hiding spots: behind columns (tile 3), in alcoves (tile 6).
