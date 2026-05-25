# Full Asset Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire all generated image assets into the renderer — tilesets per room, wrestler/enemy sprites with 4-directional walk animation, screen overlay PNGs for every game state, and UI icon sprites for the HUD and minimap.

**Architecture:** New `assets.js` preloads ~40 images before the title screen appears, tracking load progress with counters. A `SCREEN_LOADING` state gates the title screen until `assetsReady()` is true. Entity constructors gain `animFrame / animTimer / animDir / isMoving` fields. `angleToDir` + `tickAnim` in `game.js` advance animation each frame. `renderer.js` is fully overhauled — `drawRoom` uses a per-room tileset lookup, all entity draw functions use sprite sheets with colored-rectangle fallbacks, and all screen transitions draw the matching overlay PNG with dynamic text layered on top.

**Tech Stack:** Vanilla JavaScript ES5, HTML5 Canvas 2D API, PNG assets, no build tooling. Verification is manual — open `index.html` in a browser and inspect visually + DevTools console.

**Spec:** `docs/superpowers/specs/2026-05-25-full-asset-integration-design.md`

---

## File Map

| File | Change |
|------|--------|
| `assets.js` | **New** — `loadImage`, `ASSETS` global, `assetsReady()` |
| `index.html` | Add `<script src="assets.js"></script>` as first script |
| `constants.js` | Add `SCREEN_LOADING` + 8 animation constants |
| `entities.js` | Add `animFrame / animTimer / animDir / isMoving` to Player, Enemy, Ally |
| `game.js` | Add loading gate in loop, `angleToDir`, `tickAnim`, `isMoving` management in `updatePlayer` + `updateEntities` |
| `renderer.js` | Full overhaul — tileset drawRoom, sprite draw functions, screen overlays, UI sprites |

No changes to `ai.js` or `world.js`.

---

## Testing Approach

No test runner. Each task verifies in the browser:
1. Open `index.html` in Chrome (or any modern browser)
2. Open DevTools → Console tab
3. Run any `console.assert` checks listed in the step
4. Visual confirmation as described

---

## Task 1: `assets.js` — Image Preloader + Loading Screen

**Files:**
- Create: `assets.js`
- Modify: `index.html` (add script tag)
- Modify: `constants.js` (add `SCREEN_LOADING`)
- Modify: `game.js` (initial screen, loading gate in loop)
- Modify: `renderer.js` (add `drawLoadingScreen`, `SCREEN_LOADING` case in `render`)

- [ ] **Step 1: Create `assets.js`**

Create `g:/LoCo Pro Wrestling (PC)/hidegame/assets.js` with this full content:

```js
// assets.js — Image preloader. Must be the first script loaded.
// Defines ASSETS global and assetsReady() used by renderer.js and game.js.

var ASSETS       = {};
var ASSETS_TOTAL = 0;
var ASSETS_LOADED = 0;

function loadImage(key, src) {
  ASSETS_TOTAL++;
  var img    = new Image();
  img.onload  = function() { ASSETS_LOADED++; };
  img.onerror = function() { ASSETS_LOADED++; console.warn('Asset missing: ' + src); };
  img.src    = src;
  ASSETS[key] = img;
}

function assetsReady() {
  return ASSETS_TOTAL > 0 && ASSETS_LOADED >= ASSETS_TOTAL;
}

// ─── Screens ──────────────────────────────────────────────────────────
loadImage('screenLoading',  'Assets/screens/screen-loading-text.png');
loadImage('screenTitle',    'Assets/screens/screen-title-text.png');
loadImage('screenSelect',   'Assets/screens/screen-faction-select-text.png');
loadImage('screenGameover', 'Assets/screens/screen-gameover-text.png');
loadImage('screenFound',    'Assets/screens/screen-found-text.png');
loadImage('screenVictory',  'Assets/screens/screen-victory-text.png');
loadImage('screenSurvived', 'Assets/screens/screen-survived-text.png');

// ─── Wrestler sprites ─────────────────────────────────────────────────
loadImage('walkSheet',       'Assets/sprites/wrestlers/generic-walk-sheet.png');
loadImage('idleSheet',       'Assets/sprites/wrestlers/generic-idle-sheet.png');
loadImage('idleSingle',      'Assets/sprites/wrestlers/generic-idle.png');
loadImage('hidingSprite',    'Assets/sprites/wrestlers/generic-hiding.png');
loadImage('caughtSprite',    'Assets/sprites/wrestlers/generic-caught.png');
loadImage('zeakIdle',        'Assets/sprites/wrestlers/zeak-idle.png');
loadImage('erzaIdle',        'Assets/sprites/wrestlers/erza-idle.png');
loadImage('johnnyCrashIdle', 'Assets/sprites/wrestlers/johnny-crash-idle.png');
loadImage('carterCashIdle',  'Assets/sprites/wrestlers/carter-cash-idle.png');
loadImage('jtStatenIdle',    'Assets/sprites/wrestlers/jt-staten-idle.png');
loadImage('codyDevineIdle',  'Assets/sprites/wrestlers/cody-devine-idle.png');
loadImage('nickyHydeIdle',   'Assets/sprites/wrestlers/nicky-hyde-idle.png');
loadImage('frankyIdle',      'Assets/sprites/wrestlers/franky-idle.png');

// ─── Enemy sprites ────────────────────────────────────────────────────
loadImage('refereeSheet',  'Assets/sprites/wrestlers/referee-patrol-sheet.png');
loadImage('securitySheet', 'Assets/sprites/wrestlers/security-patrol-sheet.png');

// ─── Tilesets ─────────────────────────────────────────────────────────
loadImage('tileLockerRoom',    'Assets/bg_tiles/hide/locker-room-tileset.png');
loadImage('tileBackstage',     'Assets/bg_tiles/hide/backstage-hallway-tileset.png');
loadImage('tileWrestlingRing', 'Assets/bg_tiles/hide/wrestling-ring-tileset.png');
loadImage('tileEntrance',      'Assets/bg_tiles/hide/entrance-curtain-tileset.png');
loadImage('tileStorage',       'Assets/bg_tiles/hide/storage-room-tileset.png');

// ─── UI ───────────────────────────────────────────────────────────────
loadImage('minimapFrame',     'Assets/ui/ui-minimap-frame.png');
loadImage('dotPlayerRising',  'Assets/ui/ui-dot-player-rising.png');
loadImage('dotPlayerPillars', 'Assets/ui/ui-dot-player-pillars.png');
loadImage('dotAllyRising',    'Assets/ui/ui-dot-ally-rising.png');
loadImage('dotAllyPillars',   'Assets/ui/ui-dot-ally-pillars.png');
loadImage('dotEnemy',         'Assets/ui/ui-dot-enemy.png');
loadImage('iconsSheet',       'Assets/ui/ui-icons-sheet.png');
loadImage('iconHidden',       'Assets/ui/ui-icon-hidden.png');
loadImage('emblemRising',     'Assets/ui/faction-rising-emblem.png');
loadImage('emblemPillars',    'Assets/ui/faction-pillars-emblem.png');
```

- [ ] **Step 2: Add `assets.js` to `index.html` as the first script**

In `index.html`, find the scripts section:
```html
  <script src="constants.js"></script>
```

Replace with:
```html
  <script src="assets.js"></script>
  <script src="constants.js"></script>
```

- [ ] **Step 3: Add `SCREEN_LOADING` to `constants.js`**

In `constants.js`, find:
```js
var SCREEN_TITLE     = 'TITLE';
```

Replace with:
```js
var SCREEN_LOADING   = 'LOADING';
var SCREEN_TITLE     = 'TITLE';
```

- [ ] **Step 4: Update `game.js` initial screen and add loading gate**

In `game.js`, find:
```js
  screen:         SCREEN_TITLE,
```

Replace with:
```js
  screen:         SCREEN_LOADING,
```

Then find the `gameLoop` function's opening block:
```js
  if (gs.screen === SCREEN_GAMEPLAY) {
```

Replace with:
```js
  if (gs.screen === SCREEN_LOADING) {
    if (assetsReady()) {
      gs.screen = SCREEN_TITLE;
    }
  } else if (gs.screen === SCREEN_GAMEPLAY) {
```

- [ ] **Step 5: Add `drawLoadingScreen` and `SCREEN_LOADING` case to `renderer.js`**

In `renderer.js`, find `drawTitleScreen` and add this function **before** it:
```js
// ─── Loading screen ───────────────────────────────────────────────────
function drawLoadingScreen(ctx) {
  drawScreenOverlay(ctx, ASSETS.screenLoading);
}
```

Note: `drawScreenOverlay` is defined in Task 6. For now just define `drawLoadingScreen` — it will work once Task 6 is complete. To avoid an error before Task 6, add a temporary stub of `drawScreenOverlay` in this step:

```js
function drawScreenOverlay(ctx, img) {
  ctx.fillStyle = COLOR_BLACK;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  if (!img || !img.complete || !img.naturalWidth) return;
  var drawW = CANVAS_SIZE;
  var drawH = Math.round(img.naturalHeight / img.naturalWidth * CANVAS_SIZE);
  var drawY = Math.floor((CANVAS_SIZE - drawH) / 2);
  ctx.drawImage(img, 0, drawY, drawW, drawH);
}

function drawLoadingScreen(ctx) {
  drawScreenOverlay(ctx, ASSETS.screenLoading);
}
```

Place both functions **before** `drawTitleScreen`.

Then in the `render` function's switch statement, find:
```js
  switch (gs.screen) {
    case SCREEN_TITLE:
```

Replace with:
```js
  switch (gs.screen) {
    case SCREEN_LOADING:
      drawLoadingScreen(ctx);
      break;

    case SCREEN_TITLE:
```

- [ ] **Step 6: Verify in browser**

Open `index.html` in Chrome. Expected:
- A loading screen image (or black if `screen-loading-text.png` is missing) appears briefly, then transitions to the title screen automatically.
- DevTools console shows no JS errors (missing asset warnings are OK — they come from `onerror` handlers).
- Run in console:
```js
console.assert(typeof assetsReady === 'function', 'assetsReady defined');
console.assert(ASSETS_TOTAL > 0, 'images queued: ' + ASSETS_TOTAL);
console.log('ASSETS_LOADED:', ASSETS_LOADED, '/', ASSETS_TOTAL);
```
Expected: no assertion errors. `ASSETS_LOADED` should equal `ASSETS_TOTAL` within 1–2 seconds.

- [ ] **Step 7: Commit**

```
git add assets.js index.html constants.js game.js renderer.js
git commit -m "feat: asset preloader, loading screen state, drawScreenOverlay stub"
```

---

## Task 2: Animation Constants + Entity Fields

**Files:**
- Modify: `constants.js` (8 new constants)
- Modify: `entities.js` (4 new fields on Player, Enemy, Ally)

- [ ] **Step 1: Add animation constants to `constants.js`**

In `constants.js`, find:
```js
// ─── Entity counts ────────────────────────────────────────────────
```

Add before it:
```js
// ─── Animation ────────────────────────────────────────────────────
var ANIM_WALK_FRAME_MS  = 150;  // ms per player/ally walk frame
var ANIM_ENEMY_FRAME_MS = 200;  // ms per enemy patrol frame
var WALK_FRAMES         = 3;    // frames per direction in walk sheet
var WALK_FRAME_W        = 107;  // px — floor(323/3)
var WALK_FRAME_H        = 80;   // px — floor(323/4)
var ENEMY_FRAME_W       = 81;   // px — floor(244/3)
var ENEMY_FRAME_H       = 81;   // px — floor(326/4)
var IDLE_FRAME_W        = 97;   // px — floor(390/4)
var IDLE_FRAME_H        = 96;   // px — full idle sheet height

```

- [ ] **Step 2: Add animation fields to `Player` constructor in `entities.js`**

In `entities.js`, find:
```js
  this.facingAngle = 0;     // radians, 0 = right
  this.alive       = true;
}
```
(end of the Player constructor)

Replace with:
```js
  this.facingAngle = 0;     // radians, 0 = right
  this.alive       = true;

  this.animFrame  = 0;      // current walk frame (0–2)
  this.animTimer  = 0;      // ms until next frame advance
  this.animDir    = 0;      // 0=down 1=left 2=right 3=up
  this.isMoving   = false;
}
```

- [ ] **Step 3: Add animation fields to `Enemy` constructor in `entities.js`**

In `entities.js`, find:
```js
  this.searchTimer    = 0;           // ms remaining in SEARCHING/RETURNING timeout
  this.isChasing      = false;       // true while following player across screens
}
```
(end of the Enemy constructor)

Replace with:
```js
  this.searchTimer    = 0;           // ms remaining in SEARCHING/RETURNING timeout
  this.isChasing      = false;       // true while following player across screens

  this.animFrame  = 0;
  this.animTimer  = 0;
  this.animDir    = 0;
  this.isMoving   = true;            // enemies are always moving
}
```

- [ ] **Step 4: Add animation fields to `Ally` constructor in `entities.js`**

In `entities.js`, find:
```js
  this.facingAngle    = 0;
  this.alive          = true;
}
```
(end of the Ally constructor)

Replace with:
```js
  this.facingAngle    = 0;
  this.alive          = true;

  this.animFrame  = 0;
  this.animTimer  = 0;
  this.animDir    = 0;
  this.isMoving   = false;
}
```

- [ ] **Step 5: Verify in browser console**

Open `index.html`, start a game (Enter → Enter). Then in DevTools console:
```js
console.assert(typeof gs.player.animFrame  === 'number', 'player.animFrame');
console.assert(typeof gs.player.animDir    === 'number', 'player.animDir');
console.assert(typeof gs.player.isMoving   === 'boolean','player.isMoving');
console.assert(typeof gs.enemies[0].animFrame === 'number', 'enemy.animFrame');
console.assert(typeof gs.allies[0].animFrame  === 'number', 'ally.animFrame');
console.assert(WALK_FRAME_W === 107, 'WALK_FRAME_W');
console.assert(ENEMY_FRAME_W === 81, 'ENEMY_FRAME_W');
console.log('Task 2: all assertions passed');
```

- [ ] **Step 6: Commit**

```
git add constants.js entities.js
git commit -m "feat: animation constants and animFrame/animDir/isMoving entity fields"
```

---

## Task 3: Animation Functions in `game.js`

**Files:**
- Modify: `game.js` (add `angleToDir`, `tickAnim`, update `updatePlayer`, update `updateEntities`)

- [ ] **Step 1: Add `angleToDir` and `tickAnim` to `game.js`**

In `game.js`, find:
```js
// ─── Player movement ──────────────────────────────────────────────
```

Add these two functions **before** that comment:

```js
// ─── Animation helpers ────────────────────────────────────────────
// Maps facingAngle (radians, atan2 convention) to sprite sheet row.
// Sheet row order: 0=down, 1=left, 2=right, 3=up
function angleToDir(angle) {
  var PI4 = Math.PI / 4;
  if (angle > -PI4    && angle <= PI4)     return 2; // right
  if (angle > PI4     && angle <= 3 * PI4) return 0; // down
  if (angle > -3*PI4  && angle <= -PI4)    return 3; // up
  return 1;                                           // left
}

// Advances animFrame for entity if isMoving; snaps to frame 0 when still.
function tickAnim(entity, dt, frameMs) {
  entity.animDir = angleToDir(entity.facingAngle);
  if (!entity.isMoving) {
    entity.animFrame = 0;
    entity.animTimer = frameMs;
    return;
  }
  entity.animTimer -= dt;
  if (entity.animTimer <= 0) {
    entity.animFrame  = (entity.animFrame + 1) % WALK_FRAMES;
    entity.animTimer += frameMs; // += prevents drift
  }
}

```

- [ ] **Step 2: Update `updatePlayer` to set `isMoving`**

In `game.js`, find the start of `updatePlayer`:
```js
function updatePlayer(dt) {
  var player = gs.player;
  if (player.isHidden) return; // movement locked while hiding
```

Replace with:
```js
function updatePlayer(dt) {
  var player = gs.player;
  player.isMoving = false;
  if (player.isHidden) return; // movement locked while hiding
```

Then find inside `updatePlayer`:
```js
  if (dx !== 0 || dy !== 0) {
    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }
    player.facingAngle = Math.atan2(dy, dx);
    moveWithCollision(player, dx, dy);
  }
```

Replace with:
```js
  if (dx !== 0 || dy !== 0) {
    player.isMoving = true;
    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }
    player.facingAngle = Math.atan2(dy, dx);
    moveWithCollision(player, dx, dy);
  }
```

- [ ] **Step 3: Add animation ticking to `updateEntities`**

In `game.js`, find the end of `updateEntities`:
```js
  // Recount alive allies
  var alive = 0;
  for (var m = 0; m < gs.allies.length; m++) {
    if (gs.allies[m].alive) alive++;
  }
  gs.alliesAlive = alive;
}
```

Replace with:
```js
  // Recount alive allies
  var alive = 0;
  for (var m = 0; m < gs.allies.length; m++) {
    if (gs.allies[m].alive) alive++;
  }
  gs.alliesAlive = alive;

  // Tick animations
  tickAnim(gs.player, dt, ANIM_WALK_FRAME_MS);

  for (var ei = 0; ei < gs.enemies.length; ei++) {
    gs.enemies[ei].isMoving = true; // enemies are always moving
    tickAnim(gs.enemies[ei], dt, ANIM_ENEMY_FRAME_MS);
  }

  for (var ai = 0; ai < gs.allies.length; ai++) {
    var al = gs.allies[ai];
    al.isMoving = (al.state === STATE_WANDERING || al.state === STATE_FLEEING);
    tickAnim(al, dt, ANIM_WALK_FRAME_MS);
  }
}
```

- [ ] **Step 4: Verify in browser console**

Open `index.html`, start a game. Move the player around for a few seconds, then in DevTools console:
```js
console.assert(typeof angleToDir === 'function', 'angleToDir defined');
console.assert(angleToDir(0)           === 2, 'right → 2');
console.assert(angleToDir(Math.PI/2)   === 0, 'down → 0');
console.assert(angleToDir(Math.PI)     === 1, 'left → 1');
console.assert(angleToDir(-Math.PI/2)  === 3, 'up → 3');
console.assert(gs.player.animFrame >= 0 && gs.player.animFrame < 3, 'player animFrame in range');
console.log('Task 3: all assertions passed');
```

Also confirm: no JS errors in console, game still playable.

- [ ] **Step 5: Commit**

```
git add game.js
git commit -m "feat: angleToDir, tickAnim, isMoving management in game loop"
```

---

## Task 4: Tileset Rendering in `renderer.js`

**Files:**
- Modify: `renderer.js` (add `ROOM_TILESETS` + `TILESET_CELL_W/H`, replace `drawRoom`)

- [ ] **Step 1: Add tileset constants and lookup table to `renderer.js`**

In `renderer.js`, add this block at the very top (before any function definitions):

```js
// ─── Tileset cell dimensions ──────────────────────────────────────
// Generated sheets: 1536px wide × 102px tall, 16 tiles per strip.
var TILESET_CELL_W = 96;   // 1536 / 16
var TILESET_CELL_H = 102;  // full sheet height (single row)

// ─── Room → tileset + tile-index mapping ─────────────────────────
// Tile indices reference the prompt spec ordering (0-based).
// If tiles look wrong after first run, adjust the F/W/O/H indices.
var ROOM_TILESETS = {
  locker_room_tl:    { img: 'tileLockerRoom',    F: 4, W: 5, O: 2, H: 0 },
  locker_room_tr:    { img: 'tileLockerRoom',    F: 4, W: 5, O: 2, H: 0 },
  hallway_top_1:     { img: 'tileBackstage',     F: 0, W: 1, O: 2, H: 5 },
  hallway_top_2:     { img: 'tileBackstage',     F: 0, W: 1, O: 2, H: 5 },
  backstage_left:    { img: 'tileBackstage',     F: 0, W: 1, O: 2, H: 5 },
  backstage_right:   { img: 'tileBackstage',     F: 0, W: 1, O: 2, H: 5 },
  ringside_center_1: { img: 'tileWrestlingRing', F: 0, W: 4, O: 7, H: 5 },
  ringside_center_2: { img: 'tileWrestlingRing', F: 0, W: 4, O: 7, H: 5 },
  entrance_left:     { img: 'tileEntrance',      F: 2, W: 5, O: 6, H: 0 },
  entrance_right:    { img: 'tileEntrance',      F: 2, W: 5, O: 6, H: 0 },
  entrance_center_1: { img: 'tileBackstage',     F: 0, W: 1, O: 2, H: 5 },
  entrance_center_2: { img: 'tileBackstage',     F: 0, W: 1, O: 2, H: 5 },
  storage_bl:        { img: 'tileStorage',       F: 0, W: 9, O: 2, H: 4 },
  storage_bm_1:      { img: 'tileStorage',       F: 0, W: 9, O: 2, H: 4 },
  storage_bm_2:      { img: 'tileStorage',       F: 0, W: 9, O: 2, H: 4 },
  storage_br:        { img: 'tileStorage',       F: 0, W: 9, O: 2, H: 4 },
};
```

- [ ] **Step 2: Add `imgReady` helper to `renderer.js`**

Immediately after the `ROOM_TILESETS` block, add:

```js
// imgReady — returns true if an Image element is fully loaded and usable
function imgReady(img) {
  return !!(img && img.complete && img.naturalWidth > 0);
}
```

- [ ] **Step 3: Replace `drawRoom` in `renderer.js`**

Find and replace the entire existing `drawRoom` function:

```js
// ─── Tile layer ───────────────────────────────────────────────────
function drawRoom(ctx, room) {
  for (var row = 0; row < SCREEN_TILES; row++) {
    for (var col = 0; col < SCREEN_TILES; col++) {
      var tile = room.getTile(col, row);
      switch (tile) {
        case TILE_WALL:     ctx.fillStyle = COLOR_WALL;     break;
        case TILE_OBSTACLE: ctx.fillStyle = COLOR_OBSTACLE; break;
        case TILE_HIDING:   ctx.fillStyle = COLOR_HIDING_SPOT; break;
        default:            ctx.fillStyle = COLOR_FLOOR;    break;
      }
      ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}
```

Replace with:

```js
// ─── Tile layer ───────────────────────────────────────────────────
function drawRoom(ctx, room) {
  var config  = ROOM_TILESETS[room.id];
  var tileset = config ? ASSETS[config.img] : null;
  var useImg  = imgReady(tileset);

  for (var row = 0; row < SCREEN_TILES; row++) {
    for (var col = 0; col < SCREEN_TILES; col++) {
      var tile = room.getTile(col, row);

      if (useImg) {
        var idx;
        switch (tile) {
          case TILE_WALL:     idx = config.W; break;
          case TILE_OBSTACLE: idx = config.O; break;
          case TILE_HIDING:   idx = config.H; break;
          default:            idx = config.F; break;
        }
        ctx.drawImage(
          tileset,
          idx * TILESET_CELL_W, 0, TILESET_CELL_W, TILESET_CELL_H,
          col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE
        );
      } else {
        switch (tile) {
          case TILE_WALL:     ctx.fillStyle = COLOR_WALL;        break;
          case TILE_OBSTACLE: ctx.fillStyle = COLOR_OBSTACLE;    break;
          case TILE_HIDING:   ctx.fillStyle = COLOR_HIDING_SPOT; break;
          default:            ctx.fillStyle = COLOR_FLOOR;       break;
        }
        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}
```

- [ ] **Step 4: Verify in browser**

Open `index.html`, start a game (Enter → Enter). Expected:
- Room tiles show pixel-art textures instead of flat dark colors.
- Moving to a different room shows the matching tileset (locker room looks different from storage, etc.).
- No JS errors in DevTools console.
- Fallback (flat colors) still works — if you want to test it, temporarily set `var useImg = false;` in drawRoom, verify flat colors appear, then revert.

- [ ] **Step 5: Commit**

```
git add renderer.js
git commit -m "feat: tileset rendering — per-room sprite tiles with flat-color fallback"
```

---

## Task 5: Sprite Rendering — Players, Enemies, Allies

**Files:**
- Modify: `renderer.js` (add `WRESTLER_IDLE_MAP`, replace `drawPlayer`/`drawEnemy`/`drawAlly`, update enemy loop in `renderGameplay`, remove `drawDirectionNub`)

- [ ] **Step 1: Add `WRESTLER_IDLE_MAP` to `renderer.js`**

Directly after the `imgReady` function, add:

```js
// Maps wrestler name to ASSETS key for named idle sprite
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

- [ ] **Step 2: Replace `drawPlayer` in `renderer.js`**

Find and replace the entire existing `drawPlayer` function:

```js
function drawPlayer(ctx, player) {
  var x = player.x;
  var y = player.y;
  var w = TILE_SIZE;
  var h = TILE_SIZE;

  if (player.isHidden) {
    if (imgReady(ASSETS.hidingSprite)) {
      ctx.globalAlpha = 0.7;
      ctx.drawImage(ASSETS.hidingSprite, x, y, w, h);
      ctx.globalAlpha = 1.0;
    } else {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = player.faction.color;
      ctx.fillRect(x + 1, y + 1, player.width, player.height);
      ctx.globalAlpha = 1.0;
    }
    return;
  }

  if (player.isMoving && imgReady(ASSETS.walkSheet)) {
    var sx = player.animFrame * WALK_FRAME_W;
    var sy = player.animDir   * WALK_FRAME_H;
    ctx.drawImage(ASSETS.walkSheet, sx, sy, WALK_FRAME_W, WALK_FRAME_H, x, y, w, h);
    return;
  }

  // Stationary — prefer named idle, fall back to directional idle sheet, then flat rect
  var idleKey = WRESTLER_IDLE_MAP[player.wrestler.name];
  var idleImg = idleKey ? ASSETS[idleKey] : null;
  if (imgReady(idleImg)) {
    ctx.drawImage(idleImg, x, y, w, h);
  } else if (imgReady(ASSETS.idleSheet)) {
    var isx = player.animDir * IDLE_FRAME_W;
    ctx.drawImage(ASSETS.idleSheet, isx, 0, IDLE_FRAME_W, IDLE_FRAME_H, x, y, w, h);
  } else {
    ctx.fillStyle = player.faction.color;
    ctx.fillRect(x + 1, y + 1, player.width, player.height);
  }
}
```

- [ ] **Step 3: Replace `drawEnemy` in `renderer.js`**

Find and replace the entire existing `drawEnemy` function.

Note: the new signature adds an `index` parameter — enemies at even indices use the referee sheet, odd use the security guard sheet.

```js
function drawEnemy(ctx, enemy, index) {
  var x     = enemy.x;
  var y     = enemy.y;
  var sheet = (index % 2 === 0) ? ASSETS.refereeSheet : ASSETS.securitySheet;

  if (imgReady(sheet)) {
    var sx = enemy.animFrame * ENEMY_FRAME_W;
    var sy = enemy.animDir   * ENEMY_FRAME_H;
    ctx.drawImage(sheet, sx, sy, ENEMY_FRAME_W, ENEMY_FRAME_H, x, y, TILE_SIZE, TILE_SIZE);
  } else {
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(x + 1, y + 1, enemy.width, enemy.height);
  }
}
```

- [ ] **Step 4: Replace `drawAlly` in `renderer.js`**

Find and replace the entire existing `drawAlly` function:

```js
function drawAlly(ctx, ally) {
  if (ally.state === STATE_CAUGHT) return;

  var x = ally.x;
  var y = ally.y;

  if (ally.state === STATE_HIDING) {
    if (imgReady(ASSETS.hidingSprite)) {
      ctx.globalAlpha = 0.6;
      ctx.drawImage(ASSETS.hidingSprite, x, y, TILE_SIZE, TILE_SIZE);
      ctx.globalAlpha = 1.0;
    } else {
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#88aacc';
      ctx.fillRect(x + 1, y + 1, ally.width, ally.height);
      ctx.globalAlpha = 1.0;
    }
    return;
  }

  if (ally.isMoving && imgReady(ASSETS.walkSheet)) {
    var sx = ally.animFrame * WALK_FRAME_W;
    var sy = ally.animDir   * WALK_FRAME_H;
    ctx.drawImage(ASSETS.walkSheet, sx, sy, WALK_FRAME_W, WALK_FRAME_H, x, y, TILE_SIZE, TILE_SIZE);
  } else if (imgReady(ASSETS.idleSheet)) {
    var isx = ally.animDir * IDLE_FRAME_W;
    ctx.drawImage(ASSETS.idleSheet, isx, 0, IDLE_FRAME_W, IDLE_FRAME_H, x, y, TILE_SIZE, TILE_SIZE);
  } else {
    ctx.fillStyle = '#88aacc';
    ctx.fillRect(x + 1, y + 1, ally.width, ally.height);
  }
}
```

- [ ] **Step 5: Pass enemy index in `renderGameplay`**

In `renderer.js`, find the enemy draw loop inside `renderGameplay`:

```js
  // 5. Enemies on current screen
  for (var k = 0; k < gs.enemies.length; k++) {
    var e2 = gs.enemies[k];
    if (e2.screenCol === gs.player.screenCol &&
        e2.screenRow === gs.player.screenRow) {
      drawEnemy(ctx, e2);
    }
  }
```

Replace with:

```js
  // 5. Enemies on current screen
  for (var k = 0; k < gs.enemies.length; k++) {
    var e2 = gs.enemies[k];
    if (e2.screenCol === gs.player.screenCol &&
        e2.screenRow === gs.player.screenRow) {
      drawEnemy(ctx, e2, k);
    }
  }
```

- [ ] **Step 6: Remove `drawDirectionNub` calls and function**

Find and delete the entire `drawDirectionNub` function:

```js
// drawDirectionNub — 4×4 square offset from center in facingAngle direction
function drawDirectionNub(ctx, entity, color) {
  var cx = entity.x + entity.width  / 2;
  var cy = entity.y + entity.height / 2;
  var offset = 5;
  var nx = cx + Math.cos(entity.facingAngle) * offset - 2;
  var ny = cy + Math.sin(entity.facingAngle) * offset - 2;
  ctx.fillStyle = color;
  ctx.fillRect(nx, ny, 4, 4);
}
```

- [ ] **Step 7: Verify in browser**

Start a game. Expected:
- Player renders as an animated wrestler sprite — walk animation plays when moving, idle sprite when still.
- Enemies render as referee or security guard sprites with patrol animation.
- Allies animate when wandering and show hiding sprite when hiding.
- All three fall back gracefully to colored rectangles if a sprite fails to load.
- No JS errors in console.

- [ ] **Step 8: Commit**

```
git add renderer.js
git commit -m "feat: sprite rendering — animated player, enemy, ally with walk cycles and idle"
```

---

## Task 6: Screen Overlays

**Files:**
- Modify: `renderer.js` (replace `drawTitleScreen`, `drawCharSelectScreen`, `drawWinScreen`, `drawGameOverScreen`; the `drawScreenOverlay` stub from Task 1 becomes the real implementation)

The `drawScreenOverlay` stub added in Task 1 is already the real implementation. No change needed to it.

- [ ] **Step 1: Replace `drawTitleScreen` in `renderer.js`**

Find and replace the entire existing `drawTitleScreen` function:

```js
function drawTitleScreen(ctx) {
  drawScreenOverlay(ctx, ASSETS.screenTitle);
  // "Press Enter" hint — drawn below overlay in case it's not baked into the art
  ctx.font      = '5px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('PRESS ENTER', CANVAS_SIZE / 2, CANVAS_SIZE - 16);
  ctx.textAlign = 'left';
}
```

Note: the render call passes `gs.factionData` as a second arg — update the call in `render` to just pass `ctx`:

Find in the `render` switch:
```js
    case SCREEN_TITLE:
      drawTitleScreen(ctx, gs.factionData);
      break;
```

Replace with:
```js
    case SCREEN_TITLE:
      drawTitleScreen(ctx);
      break;
```

- [ ] **Step 2: Replace `drawCharSelectScreen` in `renderer.js`**

Find and replace the entire existing `drawCharSelectScreen` function:

```js
function drawCharSelectScreen(ctx, factions, selFactionIdx, selWrestlerIdx) {
  drawScreenOverlay(ctx, ASSETS.screenSelect);

  var faction  = factions[selFactionIdx];
  var wrestler = faction.wrestlers[selWrestlerIdx];

  // Faction emblem (top-right corner)
  var emblemKey = (faction.name === 'The Rising') ? 'emblemRising' : 'emblemPillars';
  if (imgReady(ASSETS[emblemKey])) {
    ctx.drawImage(ASSETS[emblemKey], CANVAS_SIZE - 36, 16, 24, 24);
  }

  // Selected wrestler idle preview (right side)
  var idleKey = WRESTLER_IDLE_MAP[wrestler.name];
  var idleImg = idleKey ? ASSETS[idleKey] : ASSETS.idleSingle;
  if (imgReady(idleImg)) {
    ctx.drawImage(idleImg, CANVAS_SIZE - 58, 48, 48, 48);
  }

  // Faction name
  ctx.font      = '6px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillStyle = COLOR_WHITE;
  ctx.fillText('< ' + faction.name + ' >', CANVAS_SIZE / 2 - 20, 20);

  // Wrestler roster list
  ctx.font = '5px "Press Start 2P"';
  for (var i = 0; i < faction.wrestlers.length; i++) {
    var wr = faction.wrestlers[i];
    var y  = 44 + i * 20;
    ctx.fillStyle = (i === selWrestlerIdx) ? faction.color : '#888888';
    ctx.fillText((i === selWrestlerIdx ? '> ' : '  ') + wr.name, CANVAS_SIZE / 2 - 20, y);
    if (i === selWrestlerIdx) {
      drawStatBar(ctx, 'SPD', wr.speedMult, 20, y + 8);
      drawStatBar(ctx, 'HID', wr.hideMult, 100, y + 8);
    }
  }

  // Controls hint
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font      = '4px "Press Start 2P"';
  ctx.fillText('L/R:FACTION  U/D:PICK  ENTER:GO', CANVAS_SIZE / 2 - 20, CANVAS_SIZE - 10);
  ctx.textAlign = 'left';
}
```

- [ ] **Step 3: Replace `drawWinScreen` in `renderer.js`**

Find and replace the entire existing `drawWinScreen` function:

```js
function drawWinScreen(ctx, gs) {
  var img = (gs.alliesAlive === ALLY_COUNT) ? ASSETS.screenVictory : ASSETS.screenSurvived;
  drawScreenOverlay(ctx, img);

  ctx.font      = '5px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillStyle = COLOR_WHITE;
  ctx.fillText('ALLIES SAVED: ' + gs.alliesAlive + '/' + ALLY_COUNT, CANVAS_SIZE / 2, 196);
  ctx.fillText('SCORE: ' + gs.score, CANVAS_SIZE / 2, 210);
  ctx.font      = '4px "Press Start 2P"';
  ctx.fillStyle = '#888888';
  ctx.fillText('PRESS ENTER', CANVAS_SIZE / 2, 228);
  ctx.textAlign = 'left';
}
```

- [ ] **Step 4: Replace `drawGameOverScreen` in `renderer.js`**

Find and replace the entire existing `drawGameOverScreen` function:

```js
function drawGameOverScreen(ctx, gs) {
  var img = (gs.alliesAlive > 0) ? ASSETS.screenFound : ASSETS.screenGameover;
  drawScreenOverlay(ctx, img);

  var secSurvived = Math.floor((ROUND_TIMER * 1000 - gs.roundTimer) / 1000);
  ctx.font      = '5px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillStyle = COLOR_WHITE;
  ctx.fillText('SURVIVED: ' + secSurvived + 's', CANVAS_SIZE / 2, 196);
  ctx.fillText('SCORE: ' + gs.score, CANVAS_SIZE / 2, 210);
  ctx.font      = '4px "Press Start 2P"';
  ctx.fillStyle = '#888888';
  ctx.fillText('PRESS ENTER', CANVAS_SIZE / 2, 228);
  ctx.textAlign = 'left';
}
```

- [ ] **Step 5: Verify in browser**

Check each screen state:
- **Title:** Press Enter from title — should show `screen-title-text.png` art with "PRESS ENTER" hint.
- **Character select:** Faction art overlay visible; faction name, wrestler list, and stat bars render on top; wrestler idle preview on right side.
- **Win:** Survive 90 seconds — should show victory or survived screen art with score text below.
- **Game over:** Walk into an enemy — should show gameover or found screen art with score text below.
- All text positions may need pixel-level tuning after visual inspection — adjust y-values as needed.

- [ ] **Step 6: Commit**

```
git add renderer.js
git commit -m "feat: screen overlay PNGs for title, character select, win, and game over states"
```

---

## Task 7: UI / HUD Sprite Assets

**Files:**
- Modify: `renderer.js` (replace `drawMinimap`, update `drawHUD` with icon sprites)

- [ ] **Step 1: Replace `drawMinimap` in `renderer.js`**

Find and replace the entire existing `drawMinimap` function:

```js
function drawMinimap(ctx, gs) {
  var ox = 2;
  var oy = 14;

  // Background
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(ox, oy, MINIMAP_SIZE, MINIMAP_SIZE);

  // Grid cells
  for (var row = 0; row < GRID_SIZE; row++) {
    for (var col = 0; col < GRID_SIZE; col++) {
      var cx = ox + col * MINIMAP_CELL;
      var cy = oy + row * MINIMAP_CELL;
      if (col === gs.player.screenCol && row === gs.player.screenRow) {
        ctx.strokeStyle = COLOR_WHITE;
        ctx.lineWidth   = 1;
        ctx.strokeRect(cx + 0.5, cy + 0.5, MINIMAP_CELL - 1, MINIMAP_CELL - 1);
      } else {
        ctx.strokeStyle = '#555555';
        ctx.lineWidth   = 0.5;
        ctx.strokeRect(cx + 0.5, cy + 0.5, MINIMAP_CELL - 1, MINIMAP_CELL - 1);
      }
    }
  }

  // Enemy dots
  for (var i = 0; i < gs.enemies.length; i++) {
    var en = gs.enemies[i];
    var ex = ox + en.screenCol * MINIMAP_CELL + MINIMAP_CELL / 2;
    var ey = oy + en.screenRow * MINIMAP_CELL + MINIMAP_CELL / 2;
    if (imgReady(ASSETS.dotEnemy)) {
      ctx.drawImage(ASSETS.dotEnemy, ex - 2, ey - 2, 4, 4);
    } else {
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(ex - 1, ey - 1, 3, 3);
    }
  }

  // Ally dots
  var allyDotKey = (gs.player.faction.name === 'The Rising') ? 'dotAllyRising' : 'dotAllyPillars';
  for (var j = 0; j < gs.allies.length; j++) {
    var al = gs.allies[j];
    if (al.state === STATE_CAUGHT) continue;
    var ax = ox + al.screenCol * MINIMAP_CELL + MINIMAP_CELL / 2;
    var ay = oy + al.screenRow * MINIMAP_CELL + MINIMAP_CELL / 2;
    if (imgReady(ASSETS[allyDotKey])) {
      ctx.drawImage(ASSETS[allyDotKey], ax - 1, ay - 1, 3, 3);
    } else {
      ctx.fillStyle = '#aaccee';
      ctx.fillRect(ax - 1, ay - 1, 3, 3);
    }
  }

  // Player dot
  var playerDotKey = (gs.player.faction.name === 'The Rising') ? 'dotPlayerRising' : 'dotPlayerPillars';
  var px = ox + gs.player.screenCol * MINIMAP_CELL + MINIMAP_CELL / 2;
  var py = oy + gs.player.screenRow * MINIMAP_CELL + MINIMAP_CELL / 2;
  if (imgReady(ASSETS[playerDotKey])) {
    ctx.drawImage(ASSETS[playerDotKey], px - 2, py - 2, 4, 4);
  } else {
    ctx.fillStyle = gs.player.faction.color;
    ctx.fillRect(px - 2, py - 2, 4, 4);
  }

  // Minimap frame overlay (drawn last, on top of dots)
  if (imgReady(ASSETS.minimapFrame)) {
    ctx.drawImage(ASSETS.minimapFrame, ox, oy, MINIMAP_SIZE, MINIMAP_SIZE);
  }
}
```

- [ ] **Step 2: Replace `drawHUD` in `renderer.js`**

Find and replace the entire existing `drawHUD` function:

```js
function drawHUD(ctx, gs) {
  // Icon sheet: 262×262px, 4×4 grid, 64px cells with 2px padding → stride = 66px
  var ICON_CELL   = 64;
  var ICON_STRIDE = 66;

  // Top strip background
  ctx.fillStyle = COLOR_HUD_BG;
  ctx.fillRect(0, 0, CANVAS_SIZE, 12);

  // Timer icon (row 0, col 1)
  if (imgReady(ASSETS.iconsSheet)) {
    ctx.drawImage(ASSETS.iconsSheet, ICON_STRIDE, 0, ICON_CELL, ICON_CELL, 56, 1, 10, 10);
  }

  // Timer text
  var secLeft = Math.ceil(gs.roundTimer / 1000);
  ctx.fillStyle = (secLeft <= TIMER_WARN_SECONDS) ? COLOR_TIMER_WARN : COLOR_WHITE;
  ctx.font      = '6px "Press Start 2P"';
  ctx.fillText(pad2(secLeft) + 's', 68, 9);

  // Ally count icon (row 0, col 3)
  if (imgReady(ASSETS.iconsSheet)) {
    ctx.drawImage(ASSETS.iconsSheet, ICON_STRIDE * 3, 0, ICON_CELL, ICON_CELL, 130, 1, 10, 10);
  }

  // Ally count text
  ctx.fillStyle = COLOR_WHITE;
  ctx.fillText('x' + gs.alliesAlive, 142, 9);

  // Hidden indicator — flashes at 4Hz when player is hiding
  if (gs.player.isHidden) {
    var flashOn = Math.floor(Date.now() / 250) % 2 === 0;
    if (flashOn) {
      if (imgReady(ASSETS.iconHidden)) {
        ctx.drawImage(ASSETS.iconHidden, CANVAS_SIZE - 14, 1, 10, 10);
      } else {
        ctx.fillStyle = '#44cc44';
        ctx.fillRect(CANVAS_SIZE - 14, 1, 10, 10);
      }
    }
  }

  // Bottom strip — room label
  ctx.fillStyle = COLOR_HUD_BG;
  ctx.fillRect(0, CANVAS_SIZE - 12, CANVAS_SIZE, 12);
  ctx.fillStyle = COLOR_WHITE;
  ctx.font      = '5px "Press Start 2P"';
  var label = gs.player.room ? gs.player.room.label : '';
  ctx.fillText(label, 4, CANVAS_SIZE - 3);
}
```

- [ ] **Step 3: Verify in browser**

During gameplay:
- Minimap shows sprite dots for player (faction-colored), allies (lighter), and enemies (red). Minimap frame sprite overlays the dot area.
- HUD top strip shows a timer icon before the countdown number and an ally icon before the ally count.
- When hiding (press Space near an H tile), a small icon flashes in the top-right of the HUD.
- All fallback to the old colored-rect/text rendering if sprites are missing.

- [ ] **Step 4: Commit**

```
git add renderer.js
git commit -m "feat: UI sprite assets — minimap frame/dots, HUD icons, hidden indicator"
```

---

## Task 8: Commit All Assets + Push

**Files:**
- Stage: all untracked `Assets/` subdirectories

- [ ] **Step 1: Stage all asset files**

```
git add Assets/bg_tiles/hide/
git add Assets/collectibles/
git add Assets/screens/
git add Assets/sprites/
git add Assets/ui/
git add docs/superpowers/plans/
```

- [ ] **Step 2: Verify staging**

```
git status
```

Expected: all PNG files in `Assets/bg_tiles/hide/`, `Assets/screens/`, `Assets/sprites/`, `Assets/ui/` appear under "Changes to be committed". No unexpected files staged.

- [ ] **Step 3: Commit assets**

```
git commit -m "feat: add all generated image assets — tilesets, sprites, screens, UI"
```

- [ ] **Step 4: Push**

```
git push
```

Expected: push succeeds to `origin/master`. GitHub Pages will redeploy automatically within ~60 seconds. Verify at `https://locoprowrestling.github.io/hidegame/`.

---

## Post-Integration Tuning Notes

After the first browser run, adjust these values if tiles or text look wrong:

**Tile indices** — if a room type shows the wrong tile for floor/wall/hiding, update the `F`/`W`/`O`/`H` values in `ROOM_TILESETS` in `renderer.js`. The values are 0-based indices into the tileset strip.

**Walk frame size** — if walk animation clips or misaligns, adjust `WALK_FRAME_W` / `WALK_FRAME_H` in `constants.js`. Current values: 107 × 80 (calculated from 323×323 sheet, 3 cols × 4 rows).

**Enemy frame size** — `ENEMY_FRAME_W` / `ENEMY_FRAME_H` = 81 × 81. Adjust if patrol animation clips.

**Screen text positions** — y-coordinates in `drawWinScreen`, `drawGameOverScreen`, and `drawCharSelectScreen` are starting points. Tune them if text overlaps the overlay art.

**Minimap dot size** — dots are 3–4px. Increase to 5–6 if too hard to see at full screen scale.
