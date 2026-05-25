# LoCo Pro Wrestling: Hide — Full Asset Integration Design Spec
**Date:** 2026-05-25
**Status:** Approved

---

## Overview

Wire every generated image asset into the renderer to transform the game from colored-rectangle prototype to a polished pixel-art game. Covers: asset preloading, sprite animation (walk cycles, idle, hiding, caught), per-room tileset rendering, screen overlay PNGs, and UI/HUD sprite replacement. No new gameplay logic — this is a pure visual pass.

---

## Asset Inventory

All assets are pre-generated and untracked. This plan commits them alongside the code changes.

### Screens (`Assets/screens/`) — 471×238px each
- `screen-title-text.png`
- `screen-faction-select-text.png`
- `screen-gameover-text.png` (player caught, zero allies saved)
- `screen-found-text.png` (player caught with allies)
- `screen-victory-text.png` (full survival)
- `screen-survived-text.png` (timer out, some allies lost)
- `screen-loading-text.png`

### Wrestler Sprites (`Assets/sprites/wrestlers/`)
- `generic-walk-sheet.png` — 323×323px, 3 cols × 4 rows (down/left/right/up, 3 frames each). frameW=107, frameH=80
- `generic-idle.png` — 323×323px, single frame facing down
- `generic-idle-sheet.png` — 390×96px, 4 cols × 1 row (down/left/right/up). frameW=97, frameH=96
- `generic-hiding.png` — 323×323px, single crouched frame
- `generic-caught.png` — 323×323px, single stunned frame
- Named idles (323×323px each): `zeak-idle.png`, `erza-idle.png`, `johnny-crash-idle.png`, `carter-cash-idle.png`, `jt-staten-idle.png`, `cody-devine-idle.png`, `nicky-hyde-idle.png`, `franky-idle.png`

### Enemy Sprites (`Assets/sprites/wrestlers/`)
- `referee-patrol-sheet.png` — 244×326px, 3 cols × 4 rows. frameW=81, frameH=81
- `security-patrol-sheet.png` — 244×326px, 3 cols × 4 rows. frameW=81, frameH=81

### Tilesets (`Assets/bg_tiles/hide/`) — 1536×102px each, 16 tiles at 96px per cell
- `locker-room-tileset.png`
- `backstage-hallway-tileset.png`
- `wrestling-ring-tileset.png`
- `entrance-curtain-tileset.png`
- `storage-room-tileset.png`

### UI (`Assets/ui/`)
- `ui-minimap-frame.png` — 237×237px
- `ui-icons-sheet.png` — 262×262px, 4×4 grid of 64px cells
- `ui-dot-player-rising.png` — 237×237px
- `ui-dot-player-pillars.png` — 237×237px
- `ui-dot-ally-rising.png` — 237×237px
- `ui-dot-ally-pillars.png` — 237×237px
- `ui-dot-enemy.png` — 237×237px
- `ui-icon-hidden.png` — (individual icon)
- `faction-rising-emblem.png`, `faction-pillars-emblem.png`

---

## Section 1 — Asset Loading (`assets.js`)

New file, loaded as the **first** script in `index.html` (before `constants.js`).

Defines a global `ASSETS` object keyed by short name. Tracks `ASSETS_TOTAL` and `ASSETS_LOADED` counters. Each image sets `onload` to increment `ASSETS_LOADED` and `onerror` to still increment (so loading never stalls on a missing file — the renderer checks `img.complete && img.naturalWidth > 0` before drawing).

```
ASSETS = {
  // screens
  screenTitle, screenSelect, screenGameover, screenFound,
  screenVictory, screenSurvived, screenLoading,

  // wrestler sprites
  walkSheet, idleSheet, idleSingle, hidingSprite, caughtSprite,
  zeakIdle, erzaIdle, johnnyCrashIdle, carterCashIdle,
  jtStatenIdle, codyDevineIdle, nickyHydeIdle, frankyIdle,

  // enemy sprites
  refereeSheet, securitySheet,

  // tilesets (keyed by room type)
  tileLockerRoom, tileBackstage, tileWrestlingRing,
  tileEntrance, tileStorage,

  // UI
  minimapFrame,
  dotPlayerRising, dotPlayerPillars,
  dotAllyRising, dotAllyPillars,
  dotEnemy,
  iconsSheet,
  iconHidden,
  emblemRising, emblemPillars,
}
```

Helper: `assetsReady()` returns `ASSETS_LOADED === ASSETS_TOTAL`.

---

## Section 2 — Animation System

### New constants (added to `constants.js`)
```
ANIM_WALK_FRAME_MS  = 150   // ms per walk frame
ANIM_ENEMY_FRAME_MS = 200   // ms per enemy patrol frame
WALK_FRAMES         = 3     // frames per direction in walk sheet
WALK_FRAME_W        = 107   // px — walk sheet cell width (floor(323/3))
WALK_FRAME_H        = 80    // px — walk sheet cell height (floor(323/4))
ENEMY_FRAME_W       = 81    // px — enemy patrol sheet cell width (floor(244/3))
ENEMY_FRAME_H       = 81    // px — enemy patrol sheet cell height (floor(326/4))
IDLE_FRAME_W        = 97    // px — idle sheet cell width (floor(390/4))
IDLE_FRAME_H        = 96    // px — idle sheet cell height
```

### New fields on Player, Enemy, Ally (added in `entities.js`)
```
animFrame  : 0        // current frame index (0, 1, 2)
animTimer  : 0        // ms until next frame advance
animDir    : 0        // 0=down 1=left 2=right 3=up
isMoving   : false    // true if entity moved this frame
```

### Direction snapping (`angleToDir`)
Maps `facingAngle` (radians) to 0–3:
- Right (0 ± π/4) → 2
- Left (±π, within π/4) → 1
- Down (π/2 ± π/4) → 0
- Up (-π/2 ± π/4) → 3

### `isMoving` flag management
`updatePlayer` sets `gs.player.isMoving = (dx !== 0 || dy !== 0)` each frame. Allies set `isMoving = true` in their wander/flee movement calls. Enemies are always `isMoving = true`. All `isMoving` flags are cleared to `false` at the start of each frame's entity update pass.

### Animation tick (called in `game.js` update loop)
```
function tickAnim(entity, dt, frameMs) {
  entity.animTimer -= dt;
  if (entity.animTimer <= 0) {
    if (entity.isMoving) {
      entity.animFrame = (entity.animFrame + 1) % WALK_FRAMES;
    } else {
      entity.animFrame = 0; // snap to rest frame
    }
    entity.animTimer = frameMs;
  }
  entity.animDir = angleToDir(entity.facingAngle);
}
```

`isMoving` is set to `true` by `updatePlayer` / `moveWithCollision` when actual movement occurs, cleared each frame before update.

---

## Section 3 — Sprite Rendering

All entity draw functions in `renderer.js` are replaced with sprite draws. Fallback: if the image is not ready (`!img.complete || !img.naturalWidth`), fall back to the existing colored-rectangle code.

### `drawPlayer(ctx, player)`
- **Moving:** walk sheet layout is 3 cols (frames) × 4 rows (directions):
  - `sx = animFrame * WALK_FRAME_W`
  - `sy = animDir * WALK_FRAME_H`
  - `ctx.drawImage(ASSETS.walkSheet, sx, sy, WALK_FRAME_W, WALK_FRAME_H, x, y, TILE_SIZE, TILE_SIZE)`

- **Still:** named idle sprite (e.g. `ASSETS.zeakIdle`) drawn full image scaled to TILE_SIZE×TILE_SIZE. Direction-aware idle from `ASSETS.idleSheet`: `sx = animDir * IDLE_FRAME_W, sy = 0`.

- **Hiding:** `ASSETS.hidingSprite` scaled to TILE_SIZE×TILE_SIZE, alpha 0.7

- Named idle lookup: a `WRESTLER_IDLE_MAP` object keyed by wrestler name → ASSETS key.

### `drawEnemy(ctx, enemy)`
- Even-indexed enemies use `ASSETS.refereeSheet`, odd use `ASSETS.securitySheet`
- Same frame/direction logic as player walk, using ENEMY_FRAME_W/H
- Always uses patrol sheet regardless of state

### `drawAlly(ctx, ally)`
- State CAUGHT: `ASSETS.caughtSprite` scaled to TILE_SIZE×TILE_SIZE
- State HIDING: `ASSETS.hidingSprite` scaled to TILE_SIZE×TILE_SIZE, alpha 0.6
- Moving/wandering/fleeing: `ASSETS.walkSheet` with ally's animFrame/Dir
- Still: `ASSETS.idleSheet` direction frame

### Direction nub
Remove `drawDirectionNub` — sprites communicate direction visually.

---

## Section 4 — Tileset Rendering

### Room-type to tileset mapping
Added to `renderer.js` as a lookup:

```js
var ROOM_TILESETS = {
  locker_room_tl:     { img: 'tileLockerRoom',    F:4, W:5, O:2, H:0 },
  locker_room_tr:     { img: 'tileLockerRoom',    F:4, W:5, O:2, H:0 },
  hallway_top_1:      { img: 'tileBackstage',     F:0, W:1, O:2, H:5 },
  hallway_top_2:      { img: 'tileBackstage',     F:0, W:1, O:2, H:5 },
  backstage_left:     { img: 'tileBackstage',     F:0, W:1, O:2, H:5 },
  backstage_right:    { img: 'tileBackstage',     F:0, W:1, O:2, H:5 },
  ringside_center_1:  { img: 'tileWrestlingRing', F:0, W:4, O:7, H:5 },
  ringside_center_2:  { img: 'tileWrestlingRing', F:0, W:4, O:7, H:5 },
  entrance_left:      { img: 'tileEntrance',      F:2, W:5, O:6, H:0 },
  entrance_right:     { img: 'tileEntrance',      F:2, W:5, O:6, H:0 },
  entrance_center_1:  { img: 'tileBackstage',     F:0, W:1, O:2, H:5 },
  entrance_center_2:  { img: 'tileBackstage',     F:0, W:1, O:2, H:5 },
  storage_bl:         { img: 'tileStorage',       F:0, W:9, O:2, H:4 },
  storage_bm_1:       { img: 'tileStorage',       F:0, W:9, O:2, H:4 },
  storage_bm_2:       { img: 'tileStorage',       F:0, W:9, O:2, H:4 },
  storage_br:         { img: 'tileStorage',       F:0, W:9, O:2, H:4 },
};
```

**Note:** Tile indices are based on prompt spec ordering and will need visual tuning after first run.

### `drawRoom(ctx, room)`
Replaces the flat `fillRect` version:

```
tileConfig = ROOM_TILESETS[room.id]
tileset = ASSETS[tileConfig.img]
TILE_CELL_W = 96  // 1536 / 16 tiles
TILE_CELL_H = 102 // full sheet height (single row)

for each tile (col, row):
  tileChar = room.getTile(col, row)
  tileIndex = tileConfig[tileChar]  // F/W/O/H → index
  sx = tileIndex * TILE_CELL_W
  ctx.drawImage(tileset, sx, 0, TILE_CELL_W, TILE_CELL_H,
                col*TILE_SIZE, row*TILE_SIZE, TILE_SIZE, TILE_SIZE)
```

Fallback: if tileset not ready, use existing `fillRect` per tile char.

---

## Section 5 — Screen Overlays

Screen PNGs are 471×238px. Canvas is 256×256. Display strategy: scale to 256px wide, center vertically.

```
drawW = 256
drawH = Math.round(238 / 471 * 256)  // ≈ 129px
drawY = Math.floor((256 - drawH) / 2)  // ≈ 63px
```

Black fill covers full canvas first, then image draws centered.

### Screen-to-asset routing
- `SCREEN_TITLE` → `ASSETS.screenTitle`
- `SCREEN_SELECT` → `ASSETS.screenSelect` + wrestler preview (see below)
- `SCREEN_WIN` → `gs.alliesAlive === ALLY_COUNT ? ASSETS.screenVictory : ASSETS.screenSurvived`
- `SCREEN_GAMEOVER` → `gs.alliesAlive > 0 ? ASSETS.screenFound : ASSETS.screenGameover`

### Character select wrestler preview
After drawing the screen overlay, draw the selected wrestler's idle sprite large (48×48px) at a fixed position (right side of screen, centered vertically). Faction emblem drawn small (24×24px) above the wrestler preview.

Wrestler name → idle asset: resolved via `WRESTLER_IDLE_MAP`:
```js
var WRESTLER_IDLE_MAP = {
  'Zeak':   'zeakIdle',
  'Erza':   'erzaIdle',
  'Johnny': 'johnnyCrashIdle',
  'Carter': 'carterCashIdle',
  'JT':     'jtStatenIdle',
  'Cody':   'codyDevineIdle',
  'Nicky':  'nickyHydeIdle',
  'Franky': 'frankyIdle',
};
```

Score and stat text still rendered in canvas text on top of overlay (using existing HUD text drawing).

---

## Section 6 — UI / HUD

### Minimap
- Draw `ASSETS.minimapFrame` at 64×64px over the minimap area (replaces background rect)
- Player dot: `ASSETS.dotPlayerRising` or `ASSETS.dotPlayerPillars` (by faction name), 4×4px
- Ally dots: `ASSETS.dotAllyRising` or `ASSETS.dotAllyPillars`, 3×3px
- Enemy dots: `ASSETS.dotEnemy`, 3×3px
- Grid lines and active cell highlight: keep existing strokeRect logic underneath

### HUD icons
`ASSETS.iconsSheet` is 262×262px, 4×4 grid, 64px cells (with 2px padding → cell stride = 66px).

Icon positions:
- Timer icon: row 0, col 1 → draw 12×12px before timer text
- Ally icon: row 0, col 3 → draw 12×12px before ally count
- Hidden indicator: row 0, col 0 → draw 10×10px when `player.isHidden`, flashing (visible every other 30-frame tick)


---

## File Change Summary

| File | Change |
|------|--------|
| `index.html` | Add `<script src="assets.js"></script>` as first script |
| `assets.js` | **New** — image preloader, ASSETS global |
| `constants.js` | Add animation constants |
| `entities.js` | Add animFrame/animTimer/animDir/isMoving to all entity constructors |
| `renderer.js` | Full overhaul — tilesets, sprites, screen overlays, UI assets |
| `game.js` | Add loading screen state, tickAnim calls in update loop |

---

## Tuning Notes

- Tile indices in `ROOM_TILESETS` are based on prompt spec ordering. After first run, visually verify each room and adjust indices if the AI generated tiles in a different order.
- Walk frame size constants (WALK_FRAME_W/H etc.) are calculated from measured sheet dimensions. If any sheet was generated at a slightly different size, update the constants.
- Screen overlay vertical centering may need ±2px adjustment depending on how the overlay art uses its canvas.
