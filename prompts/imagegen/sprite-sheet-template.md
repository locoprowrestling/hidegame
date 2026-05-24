# Sprite Sheet Templates — Prompt Cards

Reusable layout templates for sprite sheets. Apply any named character, object set, or tile set by substituting the subject into the prompt. All prompts use the anchor sentence from `style-guide.md`.

### Template Requirements (All Sheets)
- Grid dimensions and cell size specified per template
- Transparent background
- Consistent sprite scale across all cells
- No shadows unless a single dark pixel offset for readability
- No rotated or perspective-mismatched sprites
- Uniform 2px padding between cells
- No decorative borders or backgrounds on individual cells

---

### Template: Character Idle Sheet (1 Row, 4 Directions)

**Purpose:** One idle frame per direction (down, left, right, up) for any character.
**Size:** 4 columns × 1 row, each cell [CHARACTER SIZE] px. Sheet: 4×[SIZE] + 3×2px padding = [WIDTH]×[SIZE] px.
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Sprite sheet of a [CHARACTER DESCRIPTION] idle pose in 4 directions, arranged in a clean grid on transparent background, 4 columns 1 row, uniform cell size [SIZE]x[SIZE] pixels, consistent scale, 2px padding between cells. Column 1: facing down (toward viewer), Column 2: facing left, Column 3: facing right, Column 4: facing up (away from viewer). Chunky pixel-art style, hard pixel edges, flat colors. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle
- No decorative cell backgrounds

**NOTES:** Replace `[CHARACTER DESCRIPTION]` with the wrestler's name and faction (e.g., "Zeak, The Rising faction, bright blue and yellow costume"). Replace `[SIZE]` with 32 or 48 depending on the character. Attach logo or spritesheet reference as image input. Example output path: `Assets/sprites/wrestlers/zeak-idle-sheet.png`.

---

### Template: Character Walk Cycle Sheet (4 Rows × 3 Frames)

**Purpose:** Full walk animation — 4 directions, 3 frames each — for any character.
**Size:** 3 columns × 4 rows, each cell [CHARACTER SIZE] px.
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Sprite sheet of a [CHARACTER DESCRIPTION] walk cycle, arranged in a clean grid on transparent background, 3 columns 4 rows, uniform cell size [SIZE]x[SIZE] pixels, consistent scale, 2px padding between cells. Row 1: walking down frames 1-3, Row 2: walking left frames 1-3, Row 3: walking right frames 1-3, Row 4: walking up frames 1-3. Chunky pixel-art style, hard pixel edges, flat colors, legs and arms clearly animated between frames. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle
- No decorative cell backgrounds

**NOTES:** Replace `[CHARACTER DESCRIPTION]` and `[SIZE]` as above. Example output: `Assets/sprites/wrestlers/zeak-walk-sheet.png`.

---

### Template: Enemy Patrol Sheet (4 Rows × 3 Frames)

**Purpose:** Patrol walk animation for enemy/NPC characters (referee, security guard).
**Size:** 3 columns × 4 rows, each cell 32×32 px.
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Sprite sheet of a [ENEMY TYPE, e.g. referee in black and white stripes] patrol walk cycle, arranged in a clean grid on transparent background, 3 columns 4 rows, uniform cell size 32x32 pixels, consistent scale, 2px padding between cells. Row 1: walking down frames 1-3, Row 2: walking left frames 1-3, Row 3: walking right frames 1-3, Row 4: walking up frames 1-3. Chunky pixel-art style, hard pixel edges, flat colors, alert patrol body language. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle
- No decorative cell backgrounds

**NOTES:** Replace `[ENEMY TYPE]` with "referee in black and white stripes" or "security guard in dark navy uniform". Output examples: `Assets/sprites/wrestlers/referee-patrol-sheet.png`, `Assets/sprites/wrestlers/security-patrol-sheet.png`.

---

### Template: Hiding Object Sheet (Grid of All Hiding Spots)

**Purpose:** All hiding spot objects in one sheet for batch import. Reuse when adding new hiding spot objects.
**Size:** 5 columns × 3 rows, each cell 48×48 px. Sheet: ~250×154 px with padding.
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Sprite sheet of [LIST OF HIDING OBJECTS] arranged in a clean grid on transparent background, [N] columns by [M] rows, uniform cell size 48x48 pixels, consistent scale, 2px padding between cells. Each object shown as isolated top-down pixel-art asset, hard pixel edges, flat colors. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no decorative cell borders.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text labels on sheet
- No isometric angle
- No decorative cell borders

**NOTES:** Replace `[LIST OF HIDING OBJECTS]` with the comma-separated list of objects to include. Replace `[N]` and `[M]` with column and row counts. See `objects-and-hiding-spots.md` for the canonical full-set card. Output: `Assets/sprites/objects/hiding-spots-sheet.png`.

---

### Template: Environmental Tile Sheet (One Room Type)

**Purpose:** All tiles for one room type in a single row sheet. Reuse per room.
**Size:** 10 columns × 1 row, each cell 16×16 px. Sheet: 164×16 px (with 2px padding).
**Transparency:** No (solid tiles)
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down [ROOM TYPE] in a pro wrestling game. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: [TILE 1 DESCRIPTION], [TILE 2 DESCRIPTION], [TILE 3 DESCRIPTION], [TILE 4 DESCRIPTION], [TILE 5 DESCRIPTION], [TILE 6 DESCRIPTION], [TILE 7 DESCRIPTION], [TILE 8 DESCRIPTION], [TILE 9 DESCRIPTION], [TILE 10 DESCRIPTION]. [ROOM PALETTE DESCRIPTION]. Hard pixel edges, flat colors. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle

**NOTES:** Replace `[ROOM TYPE]` with the room name. Replace each `[TILE N DESCRIPTION]` with a one-phrase tile description (e.g., "gray concrete floor", "metal locker door closed"). Replace `[ROOM PALETTE DESCRIPTION]` with the dominant color scheme. See `tiles-and-environments.md` for complete room-by-room tile lists. Output: `Assets/bg_tiles/hide/[room-type]-tileset.png`.

---

### Template: UI Icon Sheet (All UI Icons in a Grid)

**Purpose:** All UI icons in one sheet for easy import into the game engine.
**Size:** 4 columns × 4 rows, each cell 32×32 px. Sheet: ~134×134 px with padding.
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. UI icon sprite sheet arranged in a clean grid on transparent background, 4 columns by 4 rows, uniform cell size 32x32 pixels, consistent scale, 2px padding between cells. Icons (left to right, top to bottom): hidden state padlock, timer clock, timer hourglass, ally count silhouettes, player dot blue, ally dot light blue, player dot purple, ally dot light purple, enemy dot red, caught X marker, hidden lock marker, start button frame idle, start button frame hover, faction select frame, character select frame, blank placeholder cell. All in chunky pixel-art style, hard pixel edges, flat colors. No gradients, no realistic lighting, no blur, no anime style, no text, no decorative cell borders.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text labels on sheet
- No isometric angle
- No decorative cell borders

**NOTES:** Output: `Assets/ui/ui-icons-sheet.png`. Cell order matches the list above. Last cell is intentionally blank (for future additions). Individual icon files from `ui-and-icons.md` cards can be extracted from this sheet or generated independently.
