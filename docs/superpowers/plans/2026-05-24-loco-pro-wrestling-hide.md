# LoCo Pro Wrestling: Hide — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a playable browser prototype of LoCo Pro Wrestling: Hide — a top-down 8-bit stealth/hide-and-seek game where the player survives 90 seconds while avoiding enemy wrestlers.

**Architecture:** Multi-file vanilla JS loaded via `<script>` tags in dependency order, no build step, deployable to GitHub Pages or served from `file://`. All game data (wrestlers, rooms) is embedded as JSON in `index.html` and parsed once at startup. Canvas renders at 256×256 px, one 16×16-tile screen at a time, with a 64×64 mini-map overlay showing the full 4×4 world grid.

**Tech Stack:** Vanilla JavaScript (ES5-compatible globals, no modules), HTML5 Canvas 2D API, Press Start 2P (Google Fonts), no dependencies, no build tooling.

---

## File Map

| File | Responsibility |
|---|---|
| `index.html` | Canvas element, Google Fonts link, JSON data blocks, script tags in load order |
| `style.css` | Full-screen black canvas, font import, screen layout |
| `constants.js` | Every magic number and tuning value — single source of truth |
| `world.js` | `Room` class, `ScreenGrid` (4×4), tile lookup helpers, hiding spot placement |
| `entities.js` | `Player`, `Enemy`, `Ally`, `HidingSpot` constructors and property definitions |
| `ai.js` | Enemy state machine update, ally state machine update, collision helpers, vision cone test |
| `renderer.js` | All `ctx` draw calls — tiles, entities, vision cones, mini-map, HUD, screen overlays |
| `game.js` | `GameState` object, `requestAnimationFrame` loop, keyboard input, screen transitions, scoring |
| `README.md` | Project description, controls, deployment instructions, known limitations, next steps |

**Script load order in `index.html`:**
`constants.js` → `world.js` → `entities.js` → `ai.js` → `renderer.js` → `game.js`

---

## Testing Approach

This is a browser game with no test runner configured. All verification is done by opening `index.html` in a browser (Chrome/Firefox/Edge) and manually confirming behavior. Each task specifies exactly what to look for in the browser. Where logic is pure (tile lookups, state machine transitions, collision math), a simple `console.assert` smoke test is embedded in the verification step and run from the browser DevTools console.

---

## Task 1: Project Scaffold — `index.html`, `style.css`

**Files:**
- Create: `g:/LoCo Pro Wrestling (PC)/hidegame/index.html`
- Create: `g:/LoCo Pro Wrestling (PC)/hidegame/style.css`

- [ ] **Step 1: Write `style.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  font-family: 'Press Start 2P', monospace;
}

canvas {
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

- [ ] **Step 2: Write `index.html` with embedded JSON data blocks and script tags**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LoCo Pro Wrestling: Hide</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <canvas id="gameCanvas" width="256" height="256"></canvas>

  <!-- ═══════════════════════════════════════════════
       GAME DATA — parsed once at startup in game.js
       ═══════════════════════════════════════════════ -->

  <script type="application/json" id="wrestlers-data">
  {
    "factions": [
      {
        "name": "The Rising",
        "color": "#E63946",
        "wrestlers": [
          { "name": "Zeak",   "speedMult": 1.2, "hideMult": 0.9 },
          { "name": "Erza",   "speedMult": 0.9, "hideMult": 0.7 },
          { "name": "Johnny", "speedMult": 1.0, "hideMult": 1.0 },
          { "name": "Carter", "speedMult": 0.8, "hideMult": 1.3 }
        ]
      },
      {
        "name": "The Pillars",
        "color": "#457B9D",
        "wrestlers": [
          { "name": "JT",     "speedMult": 1.2, "hideMult": 0.9 },
          { "name": "Cody",   "speedMult": 0.9, "hideMult": 0.7 },
          { "name": "Nicky",  "speedMult": 1.0, "hideMult": 1.0 },
          { "name": "Franky", "speedMult": 0.8, "hideMult": 1.3 }
        ]
      }
    ]
  }
  </script>

  <script type="application/json" id="rooms-data">
  [
    {
      "id": "locker_room_tl",
      "label": "Locker Room",
      "gridCol": 0, "gridRow": 0,
      "tiles": "WWWWWWWWWWWWWWWW WFFFFFFFFFFFFFFFWWFFOFFFOFFFFFFFWWFFFFFFFFFFFHFWWFFFFFFFFFFFFFFWWFFHFFFFFFFFFHFWWFFFFFFFFFFFFFFWWFFFFFFFFFFFHFWWFFFFFFFFFFFFFFWWFFHFFFFFFFFFHFWWFFFFFFFFFFFFFFWWFFFFFFFFFFFHFWWFFFFFFFFFFFFFFWWFFHFFFFFFFFFHFWWFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[2,2],[13,2],[13,13],[2,13]],
      "allySpawnPoints": [[5,5],[10,10]]
    },
    {
      "id": "hallway_top_1",
      "label": "Hallway",
      "gridCol": 1, "gridRow": 0,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFWWWWWWFFFFFFFFFWWWWWWFFWWWWWWFFFFFFFFFWWWWWWFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[2,3],[13,3],[13,12],[2,12]],
      "allySpawnPoints": [[4,7]]
    },
    {
      "id": "hallway_top_2",
      "label": "Hallway",
      "gridCol": 2, "gridRow": 0,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFWWWWWWFFFFFFFFFWWWWWWFFWWWWWWFFFFFFFFFWWWWWWFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[2,3],[13,3],[13,12],[2,12]],
      "allySpawnPoints": [[11,7]]
    },
    {
      "id": "locker_room_tr",
      "label": "Locker Room",
      "gridCol": 3, "gridRow": 0,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFFWWFFOFFFOFFFFFFFWWFFFFFFFFFFFHFWWFFFFFFFFFFFFFFWWFFHFFFFFFFFFHFWWFFFFFFFFFFFFFFWWFFFFFFFFFFFHFWWFFFFFFFFFFFFFFWWFFHFFFFFFFFFHFWWFFFFFFFFFFFFFFWWFFFFFFFFFFFHFWWFFFFFFFFFFFFFFWWFFHFFFFFFFFFHFWWFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[2,2],[13,2],[13,13],[2,13]],
      "allySpawnPoints": [[5,5],[10,10]]
    },
    {
      "id": "backstage_left",
      "label": "Backstage",
      "gridCol": 0, "gridRow": 1,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFWWFOOOFFFFFFFFWWWWWWFFFFFHFFFFWWWWWWFFFFFFFFWWWWWWFFFFFHFFFFWWWWWWFFFFFFFFWWWWWWFFFFFHFFFFWWFOOOFFFFFFFWWWWWWFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[3,3],[12,3],[12,12],[3,12]],
      "allySpawnPoints": [[7,7]]
    },
    {
      "id": "ringside_center_1",
      "label": "Ringside",
      "gridCol": 1, "gridRow": 1,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFWWOOOOOOOOOOOOOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOOOOOOOOOOOOOWWWFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[2,2],[13,2],[13,13],[2,13]],
      "allySpawnPoints": []
    },
    {
      "id": "ringside_center_2",
      "label": "Ringside",
      "gridCol": 2, "gridRow": 1,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFWWOOOOOOOOOOOOOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOFFFFFFFFFFOWWWOOOOOOOOOOOOOWWWFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[2,2],[13,2],[13,13],[2,13]],
      "allySpawnPoints": []
    },
    {
      "id": "backstage_right",
      "label": "Backstage",
      "gridCol": 3, "gridRow": 1,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFWWFFFFFFFFOOOFWWWWWWFFFFFHFFFFWWWWWWFFFFFFFFWWWWWWFFFFFHFFFFWWWWWWFFFFFFFFWWWWWWFFFFFHFFFFWWFFFFFFFOOOFWWWWWWFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[3,3],[12,3],[12,12],[3,12]],
      "allySpawnPoints": [[7,7]]
    },
    {
      "id": "entrance_left",
      "label": "Entrance",
      "gridCol": 0, "gridRow": 2,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFFWWFFFFFHFFFFFFFFWWFFFFFHFFFFFFFFWWFFFFFHFFFFFFFFWWFFFFFHFFFFFFFFWWFFFFFHFFFFFFFFWWFFFFFHFFFFFFFFWWFFFFFHFFFFFFFFWWFFFFFHFFFFFFFFWWFFFFFHFFFFFFFFWWFFFFFHFFFFFFFFWWFFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[3,3],[12,3],[12,12],[3,12]],
      "allySpawnPoints": [[6,6]]
    },
    {
      "id": "entrance_center_1",
      "label": "Entrance",
      "gridCol": 1, "gridRow": 2,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[2,2],[7,2],[13,2],[13,13],[7,13],[2,13]],
      "allySpawnPoints": []
    },
    {
      "id": "entrance_center_2",
      "label": "Entrance",
      "gridCol": 2, "gridRow": 2,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWFFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[2,2],[7,2],[13,2],[13,13],[7,13],[2,13]],
      "allySpawnPoints": []
    },
    {
      "id": "entrance_right",
      "label": "Entrance",
      "gridCol": 3, "gridRow": 2,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFFWWFFFFFFFFHFFFFFWWFFFFFFFFHFFFFFWWFFFFFFFFHFFFFFWWFFFFFFFFHFFFFFWWFFFFFFFFHFFFFFWWFFFFFFFFHFFFFFWWFFFFFFFFHFFFFFWWFFFFFFFFHFFFFFWWFFFFFFFFHFFFFFWWFFFFFFFFHFFFFFWWFFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[3,3],[12,3],[12,12],[3,12]],
      "allySpawnPoints": [[9,6]]
    },
    {
      "id": "storage_bl",
      "label": "Storage",
      "gridCol": 0, "gridRow": 3,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[2,2],[13,2],[13,13],[2,13]],
      "allySpawnPoints": [[5,5],[8,8],[11,11]]
    },
    {
      "id": "storage_bm_1",
      "label": "Storage",
      "gridCol": 1, "gridRow": 3,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[2,2],[13,2],[13,13],[2,13]],
      "allySpawnPoints": [[5,5],[8,8]]
    },
    {
      "id": "storage_bm_2",
      "label": "Storage",
      "gridCol": 2, "gridRow": 3,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[2,2],[13,2],[13,13],[2,13]],
      "allySpawnPoints": [[5,5],[8,8]]
    },
    {
      "id": "storage_br",
      "label": "Storage",
      "gridCol": 3, "gridRow": 3,
      "tiles": "WWWWWWWWWWWWWWWWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWFOOFHFOOFHFOOFWWFFFFFFFFFFFFFFFWWWWWWWWWWWWWWWW",
      "enemyPatrolPoints": [[2,2],[13,2],[13,13],[2,13]],
      "allySpawnPoints": [[5,5],[8,8],[11,11]]
    }
  ]
  </script>

  <!-- ═══════════════════════════════
       SCRIPTS — load order matters
       ═══════════════════════════════ -->
  <script src="constants.js"></script>
  <script src="world.js"></script>
  <script src="entities.js"></script>
  <script src="ai.js"></script>
  <script src="renderer.js"></script>
  <script src="game.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verify scaffold in browser**

Open `index.html` in a browser (Chrome recommended). Expected: black 256×256 canvas centered on black page. No console errors. Press Start 2P font may not display yet (no text drawn), but should load without network errors.

- [ ] **Step 4: Commit**

```
git add index.html style.css
git commit -m "feat: project scaffold — canvas, CSS, JSON data, script tags"
```

---

## Task 2: Constants (`constants.js`)

**Files:**
- Create: `g:/LoCo Pro Wrestling (PC)/hidegame/constants.js`

- [ ] **Step 1: Write `constants.js`**

```js
// ─── Rendering ────────────────────────────────────────────────
var TILE_SIZE        = 16;   // pixels per tile
var SCREEN_TILES     = 16;   // tiles per screen dimension → 256×256 px canvas
var GRID_SIZE        = 4;    // 4×4 screen grid
var CANVAS_SIZE      = TILE_SIZE * SCREEN_TILES; // 256

// ─── Minimap ──────────────────────────────────────────────────
var MINIMAP_SIZE     = 64;   // px — full minimap square
var MINIMAP_CELL     = MINIMAP_SIZE / GRID_SIZE; // 16px per grid cell

// ─── Movement ─────────────────────────────────────────────────
var PLAYER_BASE_SPEED   = 2;    // px per frame
var ENEMY_PATROL_SPEED  = 1.2;  // px per frame
var ENEMY_CHASE_SPEED   = 2.8;  // px per frame
var ALLY_WANDER_SPEED   = 0.8;  // px per frame
var ALLY_FLEE_SPEED     = 1.8;  // px per frame

// ─── Vision ───────────────────────────────────────────────────
var VISION_CONE_ANGLE   = 90;   // degrees, half = 45° each side of facing
var VISION_CONE_DEPTH   = 5;    // tiles

// ─── Detection ────────────────────────────────────────────────
var HIDE_DETECT_RADIUS  = 1.5;  // tiles — base, multiplied by wrestler.hideMult
var ALLY_FLEE_RADIUS    = 6;    // tiles — enemy within this triggers ally flee

// ─── Timing ───────────────────────────────────────────────────
var SEARCH_TIMEOUT      = 3000; // ms before enemy gives up searching
var ROUND_TIMER         = 90;   // seconds
var ALERTED_FRAMES      = 2;    // frames enemy stays ALERTED before CHASING

// ─── Entity counts ────────────────────────────────────────────
var ENEMY_COUNT         = 4;
var ALLY_COUNT          = 3;

// ─── Scoring ──────────────────────────────────────────────────
var SCORE_PER_SECOND    = 10;
var SCORE_PER_ALLY      = 500;
var SCORE_FULL_SURVIVAL = 1000;

// ─── Colors ───────────────────────────────────────────────────
var COLOR_RISING        = '#E63946';
var COLOR_PILLARS       = '#457B9D';
var COLOR_FLOOR         = '#2a2a2a';
var COLOR_WALL          = '#111111';
var COLOR_OBSTACLE      = '#444444';
var COLOR_HIDING_SPOT   = '#1a3a1a';
var COLOR_HIDING_OCC    = '#2d6a2d';
var COLOR_VISION_PATROL = 'rgba(255,220,0,0.25)';
var COLOR_VISION_ALERT  = 'rgba(255,140,0,0.35)';
var COLOR_VISION_CHASE  = 'rgba(255,40,40,0.40)';
var COLOR_HUD_BG        = 'rgba(0,0,0,0.7)';
var COLOR_TIMER_WARN    = '#ff4444';
var COLOR_WHITE         = '#ffffff';
var COLOR_BLACK         = '#000000';

// ─── Tile chars ───────────────────────────────────────────────
var TILE_FLOOR       = 'F';
var TILE_WALL        = 'W';
var TILE_OBSTACLE    = 'O';
var TILE_HIDING      = 'H';

// ─── Enemy states ─────────────────────────────────────────────
var STATE_PATROL     = 'PATROL';
var STATE_ALERTED    = 'ALERTED';
var STATE_CHASING    = 'CHASING';
var STATE_SEARCHING  = 'SEARCHING';
var STATE_RETURNING  = 'RETURNING';

// ─── Ally states ──────────────────────────────────────────────
var STATE_WANDERING  = 'WANDERING';
var STATE_FLEEING    = 'FLEEING';
var STATE_HIDING     = 'HIDING';
var STATE_CAUGHT     = 'CAUGHT';

// ─── Screen flow states ───────────────────────────────────────
var SCREEN_TITLE     = 'TITLE';
var SCREEN_SELECT    = 'CHARACTER_SELECT';
var SCREEN_GAMEPLAY  = 'GAMEPLAY';
var SCREEN_WIN       = 'WIN';
var SCREEN_GAMEOVER  = 'GAME_OVER';
```

- [ ] **Step 2: Verify constants load**

Open `index.html` in browser, open DevTools console, run:
```js
console.assert(TILE_SIZE === 16, 'TILE_SIZE');
console.assert(CANVAS_SIZE === 256, 'CANVAS_SIZE');
console.assert(MINIMAP_CELL === 16, 'MINIMAP_CELL');
console.assert(STATE_PATROL === 'PATROL', 'STATE_PATROL');
```
Expected: No assertion errors printed.

- [ ] **Step 3: Commit**

```
git add constants.js
git commit -m "feat: constants — all magic numbers and config values"
```

---

## Task 3: World (`world.js`)

**Files:**
- Create: `g:/LoCo Pro Wrestling (PC)/hidegame/world.js`

- [ ] **Step 1: Write `world.js`**

```js
// ─────────────────────────────────────────────────────────────────
// world.js — Room class, 4×4 ScreenGrid, tile helpers
// Depends on: constants.js
// ─────────────────────────────────────────────────────────────────

// ─── Room ─────────────────────────────────────────────────────────
// Parses a flat 256-character tile string into a 16×16 2D array.
// Also holds patrol waypoints and ally spawn points from JSON.
//
// roomData shape: { id, label, gridCol, gridRow, tiles: string(256),
//                   enemyPatrolPoints: [[col,row],...],
//                   allySpawnPoints: [[col,row],...] }
function Room(roomData) {
  this.id          = roomData.id;
  this.label       = roomData.label;
  this.gridCol     = roomData.gridCol;
  this.gridRow     = roomData.gridRow;
  this.patrolPoints = roomData.enemyPatrolPoints;  // [[col,row],...]
  this.spawnPoints  = roomData.allySpawnPoints;    // [[col,row],...]

  // Build 16×16 tile grid from flat string, skipping spaces/newlines
  var clean = roomData.tiles.replace(/[\s\n]/g, '');
  this.tiles = [];
  for (var row = 0; row < SCREEN_TILES; row++) {
    this.tiles[row] = [];
    for (var col = 0; col < SCREEN_TILES; col++) {
      var ch = clean[row * SCREEN_TILES + col];
      // Default to FLOOR if tile string is malformed
      this.tiles[row][col] = ch || TILE_FLOOR;
    }
  }
}

// getTile(col, row) — returns tile char, or TILE_WALL for out-of-bounds
Room.prototype.getTile = function(col, row) {
  if (col < 0 || col >= SCREEN_TILES || row < 0 || row >= SCREEN_TILES) {
    return TILE_WALL;
  }
  return this.tiles[row][col];
};

// isPassable(col, row) — true if movement is allowed on this tile
Room.prototype.isPassable = function(col, row) {
  var t = this.getTile(col, row);
  return t === TILE_FLOOR || t === TILE_HIDING;
};

// pixelToTile(px) — convert a pixel coordinate to a tile index
function pixelToTile(px) {
  return Math.floor(px / TILE_SIZE);
}

// tileToPixelCenter(tileIndex) — pixel at center of tile
function tileToPixelCenter(tileIndex) {
  return tileIndex * TILE_SIZE + TILE_SIZE / 2;
}

// ─── ScreenGrid ────────────────────────────────────────────────────
// Holds all 16 Room objects indexed by [row][col].
// Built once at game start from parsed JSON.
function ScreenGrid(roomsArray) {
  this.rooms = [];
  for (var row = 0; row < GRID_SIZE; row++) {
    this.rooms[row] = [];
    for (var col = 0; col < GRID_SIZE; col++) {
      this.rooms[row][col] = null;
    }
  }

  for (var i = 0; i < roomsArray.length; i++) {
    var room = new Room(roomsArray[i]);
    this.rooms[room.gridRow][room.gridCol] = room;
  }
}

// getRoom(col, row) — returns Room or null if out of bounds
ScreenGrid.prototype.getRoom = function(col, row) {
  if (col < 0 || col >= GRID_SIZE || row < 0 || row >= GRID_SIZE) {
    return null;
  }
  return this.rooms[row][col];
};

// getRoomById(id) — linear scan, used during init only
ScreenGrid.prototype.getRoomById = function(id) {
  for (var row = 0; row < GRID_SIZE; row++) {
    for (var col = 0; col < GRID_SIZE; col++) {
      if (this.rooms[row][col] && this.rooms[row][col].id === id) {
        return this.rooms[row][col];
      }
    }
  }
  return null;
};
```

- [ ] **Step 2: Verify Room parsing and ScreenGrid in browser console**

After opening `index.html` in browser (all scripts now load in order), run in DevTools console:

```js
// Parse the embedded JSON the same way game.js will
var roomsRaw = JSON.parse(document.getElementById('rooms-data').textContent);
var grid = new ScreenGrid(roomsRaw);

// Room at grid position (0,0) should be locker_room_tl
var r = grid.getRoom(0, 0);
console.assert(r !== null, 'room 0,0 exists');
console.assert(r.id === 'locker_room_tl', 'room id');
console.assert(r.tiles.length === 16, '16 rows');
console.assert(r.tiles[0].length === 16, '16 cols');
console.assert(r.getTile(0, 0) === 'W', 'corner is wall');

// isPassable
console.assert(r.isPassable(0, 0) === false, 'wall not passable');

// pixel helpers
console.assert(pixelToTile(16) === 1, 'pixelToTile');
console.assert(tileToPixelCenter(2) === 40, 'tileToPixelCenter');

console.log('world.js: all assertions passed');
```

Expected: "world.js: all assertions passed" with no assertion errors.

- [ ] **Step 3: Commit**

```
git add world.js
git commit -m "feat: world — Room class, ScreenGrid, tile helpers"
```

---

## Task 4: Entities (`entities.js`)

**Files:**
- Create: `g:/LoCo Pro Wrestling (PC)/hidegame/entities.js`

- [ ] **Step 1: Write `entities.js`**

```js
// ─────────────────────────────────────────────────────────────────
// entities.js — Player, Enemy, Ally, HidingSpot constructors
// Depends on: constants.js, world.js
// ─────────────────────────────────────────────────────────────────

// ─── HidingSpot ───────────────────────────────────────────────────
// tileCol, tileRow: tile-aligned grid position on the room
// Pixel position is the top-left corner of the tile.
function HidingSpot(tileCol, tileRow, room) {
  this.tileCol    = tileCol;
  this.tileRow    = tileRow;
  this.room       = room;          // reference to owning Room
  this.x          = tileCol * TILE_SIZE;
  this.y          = tileRow * TILE_SIZE;
  this.cx         = this.x + TILE_SIZE / 2; // pixel center X
  this.cy         = this.y + TILE_SIZE / 2; // pixel center Y
  this.isOccupied = false;
  this.occupant   = null;          // entity currently hiding here
}

// ─── Player ───────────────────────────────────────────────────────
// wrestler: { name, speedMult, hideMult }
// faction:  { name, color }
// startRoom: Room
function Player(wrestler, faction, startRoom) {
  this.wrestler   = wrestler;
  this.faction    = faction;
  this.room       = startRoom;
  this.screenCol  = startRoom.gridCol;
  this.screenRow  = startRoom.gridRow;

  // Spawn at center of screen
  this.x          = CANVAS_SIZE / 2 - TILE_SIZE / 2;
  this.y          = CANVAS_SIZE / 2 - TILE_SIZE / 2;

  this.width      = TILE_SIZE - 2;
  this.height     = TILE_SIZE - 2;

  this.speed      = PLAYER_BASE_SPEED * wrestler.speedMult;
  this.hideDetectRadius = HIDE_DETECT_RADIUS * wrestler.hideMult; // tiles

  this.isHidden   = false;
  this.hidingSpot = null;   // HidingSpot | null

  this.facingAngle = 0;     // radians, 0 = right
  this.alive       = true;
}

// ─── Enemy ────────────────────────────────────────────────────────
// homeRoom: Room — enemy returns here after SEARCHING
// patrolPoints: [[col,row],...] — tile coords for patrol loop
function Enemy(homeRoom, patrolPoints) {
  this.homeRoom       = homeRoom;
  this.room           = homeRoom;
  this.screenCol      = homeRoom.gridCol;
  this.screenRow      = homeRoom.gridRow;

  // Start at first patrol point
  var startPt         = patrolPoints[0];
  this.x              = startPt[0] * TILE_SIZE;
  this.y              = startPt[1] * TILE_SIZE;

  this.width          = TILE_SIZE - 2;
  this.height         = TILE_SIZE - 2;

  this.patrolPoints   = patrolPoints;
  this.patrolIndex    = 0;           // current waypoint index

  this.facingAngle    = 0;           // radians

  this.state          = STATE_PATROL;
  this.alertedFrames  = 0;           // counts down from ALERTED_FRAMES

  // Last known player position (pixel, on enemy's current screen)
  this.lastKnownX     = null;
  this.lastKnownY     = null;

  this.searchTimer    = 0;           // ms remaining in SEARCHING/RETURNING timeout
  this.isChasing      = false;       // true while following player across screens
}

// ─── Ally ─────────────────────────────────────────────────────────
// spawnRoom: Room — allies never cross screens
// spawnPoint: [col, row] tile coords
function Ally(spawnRoom, spawnPoint) {
  this.room       = spawnRoom;
  this.screenCol  = spawnRoom.gridCol;
  this.screenRow  = spawnRoom.gridRow;

  this.x          = spawnPoint[0] * TILE_SIZE;
  this.y          = spawnPoint[1] * TILE_SIZE;

  this.width      = TILE_SIZE - 2;
  this.height     = TILE_SIZE - 2;

  this.state      = STATE_WANDERING;
  this.hidingSpot = null;          // target HidingSpot when FLEEING, current when HIDING

  // Wander: random direction timer
  this.wanderAngle    = Math.random() * Math.PI * 2;
  this.wanderTimer    = 0;         // ms until next direction change

  this.facingAngle    = 0;
  this.alive          = true;
}

// ─── Entity distance helper (pixel space) ────────────────────────
// Returns distance in pixels between two entities' centers
function entityDist(a, b) {
  var ax = a.x + a.width  / 2;
  var ay = a.y + a.height / 2;
  var bx = b.x + b.width  / 2;
  var by = b.y + b.height / 2;
  var dx = ax - bx;
  var dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

// Distance in tiles between entity centers
function entityDistTiles(a, b) {
  return entityDist(a, b) / TILE_SIZE;
}

// ─── Build HidingSpots from a Room ────────────────────────────────
// Scans room tiles for TILE_HIDING and returns an array of HidingSpot objects.
function buildHidingSpotsForRoom(room) {
  var spots = [];
  for (var row = 0; row < SCREEN_TILES; row++) {
    for (var col = 0; col < SCREEN_TILES; col++) {
      if (room.getTile(col, row) === TILE_HIDING) {
        spots.push(new HidingSpot(col, row, room));
      }
    }
  }
  return spots;
}
```

- [ ] **Step 2: Verify entities in browser console**

Open `index.html`, open DevTools console, run:

```js
var roomsRaw = JSON.parse(document.getElementById('rooms-data').textContent);
var grid = new ScreenGrid(roomsRaw);
var room = grid.getRoom(0, 0);

// HidingSpot
var hs = new HidingSpot(5, 5, room);
console.assert(hs.cx === 5 * 16 + 8, 'HidingSpot cx');
console.assert(hs.isOccupied === false, 'HidingSpot not occupied');

// Player
var wr = { name: 'Johnny', speedMult: 1.0, hideMult: 1.0 };
var faction = { name: 'The Rising', color: '#E63946' };
var player = new Player(wr, faction, room);
console.assert(player.speed === 2, 'player speed');
console.assert(player.hideDetectRadius === 1.5, 'player hideDetectRadius');
console.assert(player.isHidden === false, 'player not hidden');

// Enemy
var enemy = new Enemy(room, room.patrolPoints);
console.assert(enemy.state === STATE_PATROL, 'enemy patrol state');
console.assert(enemy.homeRoom === room, 'enemy homeRoom');

// Ally
var ally = new Ally(room, [7, 7]);
console.assert(ally.state === STATE_WANDERING, 'ally wandering');
console.assert(ally.x === 7 * 16, 'ally x');

// entityDistTiles
player.x = 0; player.y = 0;
ally.x   = 48; ally.y  = 0;
var dist = entityDistTiles(player, ally);
console.assert(Math.abs(dist - 4) < 0.1, 'entityDistTiles: ' + dist);

// buildHidingSpotsForRoom
var spots = buildHidingSpotsForRoom(room);
console.assert(spots.length > 0, 'spots found in locker room');
console.log('entities.js: all assertions passed');
```

Expected: "entities.js: all assertions passed" with no assertion errors.

- [ ] **Step 3: Commit**

```
git add entities.js
git commit -m "feat: entities — Player, Enemy, Ally, HidingSpot constructors"
```

---

## Task 5: AI (`ai.js`)

**Files:**
- Create: `g:/LoCo Pro Wrestling (PC)/hidegame/ai.js`

- [ ] **Step 1: Write `ai.js`**

```js
// ─────────────────────────────────────────────────────────────────
// ai.js — Enemy state machine, Ally state machine, collision, vision
// Depends on: constants.js, world.js, entities.js
// ─────────────────────────────────────────────────────────────────

// ─── Tile-based AABB collision ────────────────────────────────────
// Attempts to move entity by (dx, dy), sliding on walls.
// entity must have: x, y, width, height, room (Room)
// Returns nothing — mutates entity.x / entity.y
function moveWithCollision(entity, dx, dy) {
  var room = entity.room;

  // Try X movement
  var nx = entity.x + dx;
  if (canOccupy(room, nx, entity.y, entity.width, entity.height)) {
    entity.x = nx;
  }

  // Try Y movement independently (sliding)
  var ny = entity.y + dy;
  if (canOccupy(room, entity.x, ny, entity.width, entity.height)) {
    entity.y = ny;
  }

  // Clamp to screen bounds (0 to CANVAS_SIZE - size)
  entity.x = Math.max(0, Math.min(CANVAS_SIZE - entity.width,  entity.x));
  entity.y = Math.max(0, Math.min(CANVAS_SIZE - entity.height, entity.y));
}

// canOccupy — checks all 4 corners of the entity bounding box
function canOccupy(room, x, y, w, h) {
  var corners = [
    [x,         y        ],
    [x + w - 1, y        ],
    [x,         y + h - 1],
    [x + w - 1, y + h - 1]
  ];
  for (var i = 0; i < corners.length; i++) {
    var tc = pixelToTile(corners[i][0]);
    var tr = pixelToTile(corners[i][1]);
    if (!room.isPassable(tc, tr)) {
      return false;
    }
  }
  return true;
}

// ─── Vision cone test ─────────────────────────────────────────────
// Returns true if targetEntity is inside enemy's vision cone
// AND no wall tile interrupts the straight line between them.
//
// enemy: Enemy (has facingAngle, x, y, room)
// target: Player (has x, y, width, height)
// ignoreHidden: if true, always returns false when target.isHidden
function isInVisionCone(enemy, target, ignoreHidden) {
  if (ignoreHidden && target.isHidden) return false;

  // Only test if on same screen
  if (enemy.screenCol !== target.screenCol) return false;
  if (enemy.screenRow !== target.screenRow) return false;

  var ex = enemy.x + enemy.width  / 2;
  var ey = enemy.y + enemy.height / 2;
  var tx = target.x + target.width  / 2;
  var ty = target.y + target.height / 2;

  var dx = tx - ex;
  var dy = ty - ey;
  var distPx = Math.sqrt(dx * dx + dy * dy);

  if (distPx > VISION_CONE_DEPTH * TILE_SIZE) return false;

  var angleToTarget = Math.atan2(dy, dx);
  var halfCone = (VISION_CONE_ANGLE / 2) * (Math.PI / 180);
  var diff = Math.abs(angleDiff(enemy.facingAngle, angleToTarget));

  if (diff > halfCone) return false;

  // Ray march — check tiles along the line at half-tile steps
  var steps = Math.ceil(distPx / (TILE_SIZE / 2));
  for (var i = 1; i <= steps; i++) {
    var t  = i / steps;
    var rx = ex + dx * t;
    var ry = ey + dy * t;
    var tc = pixelToTile(rx);
    var tr = pixelToTile(ry);
    var tile = enemy.room.getTile(tc, tr);
    if (tile === TILE_WALL || tile === TILE_OBSTACLE) return false;
  }

  return true;
}

// angleDiff — smallest signed difference between two angles in radians
function angleDiff(a, b) {
  var d = b - a;
  while (d >  Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

// ─── Move toward a pixel target ───────────────────────────────────
// Moves entity toward (tx, ty) at given speed using moveWithCollision.
// Returns true if entity is within 2px of target (arrived).
function moveToward(entity, tx, ty, speed) {
  var dx = tx - (entity.x + entity.width  / 2);
  var dy = ty - (entity.y + entity.height / 2);
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 2) return true; // arrived

  entity.facingAngle = Math.atan2(dy, dx);
  var nx = (dx / dist) * speed;
  var ny = (dy / dist) * speed;
  moveWithCollision(entity, nx, ny);
  return false;
}

// ─── Enemy state machine update ───────────────────────────────────
// Call once per frame per enemy.
// gs: GameState reference (provides player, grid, hidingSpots, etc.)
// dt: delta time in ms
function updateEnemy(enemy, player, grid, dt) {
  switch (enemy.state) {
    case STATE_PATROL:
      updateEnemyPatrol(enemy, player);
      break;
    case STATE_ALERTED:
      updateEnemyAlerted(enemy, player);
      break;
    case STATE_CHASING:
      updateEnemyChasing(enemy, player, dt);
      break;
    case STATE_SEARCHING:
      updateEnemySearching(enemy, dt);
      break;
    case STATE_RETURNING:
      updateEnemyReturning(enemy, grid, dt);
      break;
  }
}

function updateEnemyPatrol(enemy, player) {
  // Walk toward current waypoint
  var wp   = enemy.patrolPoints[enemy.patrolIndex];
  var wpPx = wp[0] * TILE_SIZE;
  var wpPy = wp[1] * TILE_SIZE;
  var arrived = moveToward(enemy, wpPx, wpPy, ENEMY_PATROL_SPEED);
  if (arrived) {
    enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.patrolPoints.length;
  }

  // Check vision cone for player (hidden player ignored)
  if (isInVisionCone(enemy, player, true)) {
    enemy.state         = STATE_ALERTED;
    enemy.alertedFrames = ALERTED_FRAMES;
  }
}

function updateEnemyAlerted(enemy, player) {
  enemy.alertedFrames--;
  if (enemy.alertedFrames <= 0) {
    enemy.state = STATE_CHASING;
  }
  // Capture last known position immediately
  enemy.lastKnownX = player.x + player.width  / 2;
  enemy.lastKnownY = player.y + player.height / 2;
}

function updateEnemyChasing(enemy, player, dt) {
  var sameScreen = (enemy.screenCol === player.screenCol &&
                    enemy.screenRow === player.screenRow);

  if (sameScreen) {
    // Check close-detect radius (ignores hiding)
    var distTiles = entityDistTiles(enemy, player);
    if (player.isHidden && distTiles > player.hideDetectRadius) {
      // Lost sight — start searching at last known position
      enemy.state       = STATE_SEARCHING;
      enemy.searchTimer = SEARCH_TIMEOUT;
      return;
    }

    // Update last known
    if (!player.isHidden) {
      enemy.lastKnownX = player.x + player.width  / 2;
      enemy.lastKnownY = player.y + player.height / 2;
    }

    // Move toward player
    moveToward(enemy, player.x + player.width / 2,
                      player.y + player.height / 2, ENEMY_CHASE_SPEED);
    enemy.isChasing = true;
  } else {
    // Player left the screen — give up after SEARCH_TIMEOUT
    enemy.searchTimer = (enemy.searchTimer || SEARCH_TIMEOUT) - dt;
    if (enemy.searchTimer <= 0) {
      enemy.isChasing = false;
      enemy.state     = STATE_RETURNING;
    }
  }
}

function updateEnemySearching(enemy, dt) {
  // Move to last known position
  var arrived = moveToward(
    enemy,
    enemy.lastKnownX,
    enemy.lastKnownY,
    ENEMY_PATROL_SPEED
  );

  enemy.searchTimer -= dt;
  if (enemy.searchTimer <= 0 || arrived) {
    enemy.state = STATE_RETURNING;
    enemy.searchTimer = 0;
  }
}

function updateEnemyReturning(enemy, grid, dt) {
  // Move back to home room's first patrol point
  var homeCol = enemy.homeRoom.gridCol;
  var homeRow = enemy.homeRoom.gridRow;

  if (enemy.screenCol !== homeCol || enemy.screenRow !== homeRow) {
    // Step toward home screen — move to center of current screen edge
    // facing home, then transition when reaching edge
    var targetX, targetY;
    if (homeCol > enemy.screenCol) {
      targetX = CANVAS_SIZE - enemy.width;
      targetY = CANVAS_SIZE / 2;
    } else if (homeCol < enemy.screenCol) {
      targetX = 0;
      targetY = CANVAS_SIZE / 2;
    } else if (homeRow > enemy.screenRow) {
      targetX = CANVAS_SIZE / 2;
      targetY = CANVAS_SIZE - enemy.height;
    } else {
      targetX = CANVAS_SIZE / 2;
      targetY = 0;
    }
    moveToward(enemy, targetX, targetY, ENEMY_PATROL_SPEED);
    // Screen transition check done in game.js updateEntities
    return;
  }

  // On home screen — move to patrol start point
  var startPt = enemy.patrolPoints[0];
  var arrived = moveToward(
    enemy,
    startPt[0] * TILE_SIZE,
    startPt[1] * TILE_SIZE,
    ENEMY_PATROL_SPEED
  );
  if (arrived) {
    enemy.patrolIndex = 0;
    enemy.state       = STATE_PATROL;
    enemy.isChasing   = false;
  }
}

// ─── Player-enemy collision (catch) ───────────────────────────────
// Returns true if enemy touches player (AABB overlap)
function enemyTouchesPlayer(enemy, player) {
  if (enemy.screenCol !== player.screenCol) return false;
  if (enemy.screenRow !== player.screenRow) return false;
  return (
    enemy.x < player.x + player.width  &&
    enemy.x + enemy.width  > player.x  &&
    enemy.y < player.y + player.height &&
    enemy.y + enemy.height > player.y
  );
}

// ─── Ally state machine update ────────────────────────────────────
// Call once per frame per ally.
// hidingSpots: array of HidingSpot for the ally's room
// enemies: all Enemy objects (filtered by screen inside)
// dt: delta time ms
function updateAlly(ally, enemies, hidingSpots, dt) {
  if (ally.state === STATE_CAUGHT) return;

  // Check if any enemy is on same screen and within ALLY_FLEE_RADIUS
  var threatNearby = false;
  for (var i = 0; i < enemies.length; i++) {
    var en = enemies[i];
    if (en.screenCol !== ally.screenCol) continue;
    if (en.screenRow !== ally.screenRow) continue;
    if (entityDistTiles(ally, en) <= ALLY_FLEE_RADIUS) {
      threatNearby = true;
      break;
    }
  }

  switch (ally.state) {
    case STATE_WANDERING:
      updateAllyWandering(ally, dt);
      if (threatNearby) {
        var spot = nearestFreeHidingSpot(ally, hidingSpots);
        if (spot) {
          ally.state      = STATE_FLEEING;
          ally.hidingSpot = spot;
        }
      }
      break;

    case STATE_FLEEING:
      var arrived = moveToward(
        ally,
        ally.hidingSpot.cx - ally.width / 2,
        ally.hidingSpot.cy - ally.height / 2,
        ALLY_FLEE_SPEED
      );
      if (arrived) {
        if (!ally.hidingSpot.isOccupied) {
          ally.hidingSpot.isOccupied = true;
          ally.hidingSpot.occupant   = ally;
          ally.x     = ally.hidingSpot.cx - ally.width  / 2;
          ally.y     = ally.hidingSpot.cy - ally.height / 2;
          ally.state = STATE_HIDING;
        } else {
          // Spot taken — pick another
          var alt = nearestFreeHidingSpot(ally, hidingSpots);
          if (alt) {
            ally.hidingSpot = alt;
          } else {
            // No free spot — stay put in WANDERING
            ally.state = STATE_WANDERING;
          }
        }
      }
      break;

    case STATE_HIDING:
      if (!threatNearby) {
        // Release spot and go back to wandering
        ally.hidingSpot.isOccupied = false;
        ally.hidingSpot.occupant   = null;
        ally.hidingSpot = null;
        ally.state = STATE_WANDERING;
      }
      break;
  }

  // Catch check — any enemy touching ally
  for (var j = 0; j < enemies.length; j++) {
    var e = enemies[j];
    if (e.screenCol !== ally.screenCol) continue;
    if (e.screenRow !== ally.screenRow) continue;
    if (aabbOverlap(e, ally)) {
      allyCaught(ally);
      return;
    }
  }
}

function updateAllyWandering(ally, dt) {
  ally.wanderTimer -= dt;
  if (ally.wanderTimer <= 0) {
    ally.wanderAngle = Math.random() * Math.PI * 2;
    ally.wanderTimer = 800 + Math.random() * 1200; // 0.8–2s
  }
  var dx = Math.cos(ally.wanderAngle) * ALLY_WANDER_SPEED;
  var dy = Math.sin(ally.wanderAngle) * ALLY_WANDER_SPEED;
  ally.facingAngle = ally.wanderAngle;
  moveWithCollision(ally, dx, dy);
}

function allyCaught(ally) {
  // Free any hiding spot
  if (ally.hidingSpot) {
    ally.hidingSpot.isOccupied = false;
    ally.hidingSpot.occupant   = null;
    ally.hidingSpot = null;
  }
  ally.state = STATE_CAUGHT;
  ally.alive  = false;
}

// nearestFreeHidingSpot — returns closest unoccupied HidingSpot in same room, or null
function nearestFreeHidingSpot(entity, hidingSpots) {
  var best = null;
  var bestDist = Infinity;
  for (var i = 0; i < hidingSpots.length; i++) {
    var hs = hidingSpots[i];
    if (hs.isOccupied) continue;
    if (hs.room !== entity.room) continue;
    // Fake entity-like object to reuse entityDist
    var hsEnt = { x: hs.x, y: hs.y, width: TILE_SIZE, height: TILE_SIZE };
    var d = entityDist(entity, hsEnt);
    if (d < bestDist) {
      bestDist = d;
      best = hs;
    }
  }
  return best;
}

// aabbOverlap — generic AABB check for any two rect-like objects with x,y,width,height
function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.width  &&
    a.x + a.width  > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
```

- [ ] **Step 2: Verify AI helpers in browser console**

Open `index.html`, open DevTools console, run:

```js
var roomsRaw = JSON.parse(document.getElementById('rooms-data').textContent);
var grid = new ScreenGrid(roomsRaw);
var room = grid.getRoom(0, 0);

// canOccupy — walls at edges
console.assert(canOccupy(room, 0, 0, 14, 14) === false, 'corner is wall');
console.assert(canOccupy(room, 16, 16, 14, 14) === true,  'interior floor');

// aabbOverlap
var a = { x: 10, y: 10, width: 16, height: 16 };
var b = { x: 18, y: 10, width: 16, height: 16 };
var c = { x: 50, y: 50, width: 16, height: 16 };
console.assert(aabbOverlap(a, b) === true,  'overlap');
console.assert(aabbOverlap(a, c) === false, 'no overlap');

// angleDiff
var diff = angleDiff(0, Math.PI);
console.assert(Math.abs(diff - Math.PI) < 0.001, 'angleDiff PI');
var diff2 = angleDiff(Math.PI * 1.9, 0);
console.assert(diff2 > 0, 'angleDiff wraps correctly: ' + diff2);

console.log('ai.js: basic assertions passed');
```

Expected: "ai.js: basic assertions passed" with no assertion errors.

- [ ] **Step 3: Commit**

```
git add ai.js
git commit -m "feat: ai — enemy/ally state machines, vision cone, collision"
```

---

## Task 6: Renderer (`renderer.js`)

**Files:**
- Create: `g:/LoCo Pro Wrestling (PC)/hidegame/renderer.js`

- [ ] **Step 1: Write `renderer.js`**

```js
// ─────────────────────────────────────────────────────────────────
// renderer.js — all canvas draw calls
// Depends on: constants.js, world.js, entities.js, ai.js
// ─────────────────────────────────────────────────────────────────

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

// ─── Hiding spot occupied indicator ──────────────────────────────
function drawHidingSpots(ctx, hidingSpots, currentRoom) {
  for (var i = 0; i < hidingSpots.length; i++) {
    var hs = hidingSpots[i];
    if (hs.room !== currentRoom) continue;
    if (hs.isOccupied && hs.occupant !== null) {
      // Bright border when player is hiding here
      ctx.strokeStyle = COLOR_WHITE;
      ctx.lineWidth   = 2;
      ctx.strokeRect(hs.x + 1, hs.y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
    }
  }
}

// ─── Vision cone ──────────────────────────────────────────────────
function drawVisionCone(ctx, enemy) {
  var cx = enemy.x + enemy.width  / 2;
  var cy = enemy.y + enemy.height / 2;
  var depth = VISION_CONE_DEPTH * TILE_SIZE;
  var halfAngle = (VISION_CONE_ANGLE / 2) * (Math.PI / 180);

  switch (enemy.state) {
    case STATE_PATROL:    ctx.fillStyle = COLOR_VISION_PATROL; break;
    case STATE_ALERTED:   ctx.fillStyle = COLOR_VISION_ALERT;  break;
    case STATE_CHASING:
    case STATE_SEARCHING: ctx.fillStyle = COLOR_VISION_CHASE;  break;
    default:              ctx.fillStyle = COLOR_VISION_PATROL; break;
  }

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, depth, enemy.facingAngle - halfAngle, enemy.facingAngle + halfAngle);
  ctx.closePath();
  ctx.fill();
}

// ─── Entity rectangles ────────────────────────────────────────────
function drawPlayer(ctx, player) {
  if (player.isHidden) {
    // Draw semi-transparent to indicate hiding
    ctx.globalAlpha = 0.4;
  }

  ctx.fillStyle = player.faction.color;
  ctx.fillRect(player.x + 1, player.y + 1, player.width, player.height);

  // Direction indicator — small triangle at facing edge
  drawDirectionNub(ctx, player, COLOR_WHITE);

  ctx.globalAlpha = 1.0;
}

function drawEnemy(ctx, enemy) {
  // Only draw if on current screen (caller filters)
  ctx.fillStyle = '#cc0000';
  ctx.fillRect(enemy.x + 1, enemy.y + 1, enemy.width, enemy.height);
  drawDirectionNub(ctx, enemy, '#ffcccc');
}

function drawAlly(ctx, ally) {
  if (ally.state === STATE_CAUGHT) return;
  ctx.fillStyle = '#88aacc';
  ctx.fillRect(ally.x + 1, ally.y + 1, ally.width, ally.height);
  drawDirectionNub(ctx, ally, COLOR_WHITE);
}

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

// ─── Mini-map ────────────────────────────────────────────────────
// Drawn at top-left, 64×64 px.
// gs: GameState — provides player, enemies, allies, currentScreen
function drawMinimap(ctx, gs) {
  var ox = 2; // offset from canvas edge
  var oy = 14; // below HUD timer row

  // Background
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(ox, oy, MINIMAP_SIZE, MINIMAP_SIZE);

  // Grid cells
  for (var row = 0; row < GRID_SIZE; row++) {
    for (var col = 0; col < GRID_SIZE; col++) {
      var cx = ox + col * MINIMAP_CELL;
      var cy = oy + row * MINIMAP_CELL;

      // Active screen — bright border
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

  // Enemy dots — always red
  for (var i = 0; i < gs.enemies.length; i++) {
    var en = gs.enemies[i];
    var ex = ox + en.screenCol * MINIMAP_CELL + MINIMAP_CELL / 2;
    var ey = oy + en.screenRow * MINIMAP_CELL + MINIMAP_CELL / 2;
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(ex - 1, ey - 1, 3, 3);
  }

  // Ally dots — lighter faction color
  for (var j = 0; j < gs.allies.length; j++) {
    var al = gs.allies[j];
    if (al.state === STATE_CAUGHT) continue;
    var ax = ox + al.screenCol * MINIMAP_CELL + MINIMAP_CELL / 2 - 1;
    var ay = oy + al.screenRow * MINIMAP_CELL + MINIMAP_CELL / 2 - 1;
    ctx.fillStyle = '#aaccee';
    ctx.fillRect(ax, ay, 3, 3);
  }

  // Player dot — faction color, 4×4
  var px = ox + gs.player.screenCol * MINIMAP_CELL + MINIMAP_CELL / 2 - 2;
  var py = oy + gs.player.screenRow * MINIMAP_CELL + MINIMAP_CELL / 2 - 2;
  ctx.fillStyle = gs.player.faction.color;
  ctx.fillRect(px, py, 4, 4);
}

// ─── HUD ──────────────────────────────────────────────────────────
function drawHUD(ctx, gs) {
  // Top strip background
  ctx.fillStyle = COLOR_HUD_BG;
  ctx.fillRect(0, 0, CANVAS_SIZE, 12);

  // Timer — turns red under 20s
  var secLeft = Math.ceil(gs.roundTimer / 1000);
  ctx.fillStyle = secLeft <= 20 ? COLOR_TIMER_WARN : COLOR_WHITE;
  ctx.font      = '6px "Press Start 2P"';
  ctx.fillText(pad2(secLeft) + 's', 70, 9);

  // Ally count (top-right area of HUD)
  ctx.fillStyle = COLOR_WHITE;
  ctx.fillText('ALLIES:' + gs.alliesAlive, 130, 9);

  // Bottom strip — room name
  ctx.fillStyle = COLOR_HUD_BG;
  ctx.fillRect(0, CANVAS_SIZE - 12, CANVAS_SIZE, 12);
  ctx.fillStyle = COLOR_WHITE;
  ctx.font      = '5px "Press Start 2P"';
  var label = gs.player.room ? gs.player.room.label : '';
  ctx.fillText(label, 4, CANVAS_SIZE - 3);
}

function pad2(n) {
  return n < 10 ? '0' + n : '' + n;
}

// ─── Screen overlays ─────────────────────────────────────────────
function drawTitleScreen(ctx, factionData) {
  ctx.fillStyle = COLOR_BLACK;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Rising accent bar
  ctx.fillStyle = COLOR_RISING;
  ctx.fillRect(0, 60, CANVAS_SIZE, 3);

  // Pillars accent bar
  ctx.fillStyle = COLOR_PILLARS;
  ctx.fillRect(0, 64, CANVAS_SIZE, 3);

  ctx.fillStyle = COLOR_WHITE;
  ctx.font      = '8px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('LoCo Pro', CANVAS_SIZE / 2, 40);
  ctx.fillText('Wrestling', CANVAS_SIZE / 2, 52);

  ctx.font      = '12px "Press Start 2P"';
  ctx.fillStyle = '#ffdd00';
  ctx.fillText('HIDE', CANVAS_SIZE / 2, 80);

  ctx.font      = '5px "Press Start 2P"';
  ctx.fillStyle = COLOR_WHITE;
  ctx.fillText('PRESS ENTER TO START', CANVAS_SIZE / 2, 110);

  ctx.textAlign = 'left';
}

function drawCharSelectScreen(ctx, factions, selFactionIdx, selWrestlerIdx) {
  ctx.fillStyle = COLOR_BLACK;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  var faction  = factions[selFactionIdx];
  ctx.fillStyle = faction.color;
  ctx.fillRect(0, 0, CANVAS_SIZE, 2);
  ctx.fillRect(0, CANVAS_SIZE - 2, CANVAS_SIZE, 2);

  ctx.font      = '6px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillStyle = COLOR_WHITE;
  ctx.fillText('< ' + faction.name + ' >', CANVAS_SIZE / 2, 20);

  ctx.font      = '5px "Press Start 2P"';
  for (var i = 0; i < faction.wrestlers.length; i++) {
    var wr = faction.wrestlers[i];
    var y  = 40 + i * 20;
    ctx.fillStyle = i === selWrestlerIdx ? faction.color : '#888888';
    ctx.fillText((i === selWrestlerIdx ? '> ' : '  ') + wr.name, CANVAS_SIZE / 2, y);

    if (i === selWrestlerIdx) {
      // Stat bars
      drawStatBar(ctx, 'SPD', wr.speedMult, 60, y + 8);
      drawStatBar(ctx, 'HID', wr.hideMult,  140, y + 8);
    }
  }

  ctx.fillStyle = '#888888';
  ctx.font      = '4px "Press Start 2P"';
  ctx.fillText('L/R:FACTION  U/D:PICK  ENTER:GO', CANVAS_SIZE / 2, CANVAS_SIZE - 10);
  ctx.textAlign = 'left';
}

// drawStatBar — small pixel bar for stats on character select
// label: 3-char string, value: 0–2 multiplier, x/y: canvas position
function drawStatBar(ctx, label, value, x, y) {
  ctx.fillStyle = COLOR_WHITE;
  ctx.font      = '4px "Press Start 2P"';
  ctx.textAlign = 'left';
  ctx.fillText(label, x, y + 4);
  var barW = Math.round(value * 20); // max ~40px at mult=2
  ctx.fillStyle = '#44cc44';
  ctx.fillRect(x + 14, y, barW, 4);
}

function drawWinScreen(ctx, gs) {
  ctx.fillStyle = COLOR_BLACK;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.font      = '10px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffdd00';
  ctx.fillText('YOU WIN!', CANVAS_SIZE / 2, 60);

  ctx.font      = '5px "Press Start 2P"';
  ctx.fillStyle = COLOR_WHITE;
  var secSurvived = Math.floor((ROUND_TIMER * 1000 - gs.roundTimer) / 1000);
  ctx.fillText('SURVIVED: ' + secSurvived + 's', CANVAS_SIZE / 2, 90);
  ctx.fillText('ALLIES SAVED: ' + gs.alliesAlive, CANVAS_SIZE / 2, 105);
  ctx.fillText('SCORE: ' + gs.score, CANVAS_SIZE / 2, 120);

  ctx.font      = '4px "Press Start 2P"';
  ctx.fillStyle = '#888888';
  ctx.fillText('PRESS ENTER', CANVAS_SIZE / 2, 145);
  ctx.textAlign = 'left';
}

function drawGameOverScreen(ctx, gs) {
  ctx.fillStyle = '#1a0000';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.font      = '10px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillStyle = COLOR_TIMER_WARN;
  ctx.fillText('CAUGHT!', CANVAS_SIZE / 2, 60);

  ctx.font      = '5px "Press Start 2P"';
  ctx.fillStyle = COLOR_WHITE;
  var secSurvived = Math.floor((ROUND_TIMER * 1000 - gs.roundTimer) / 1000);
  ctx.fillText('SURVIVED: ' + secSurvived + 's', CANVAS_SIZE / 2, 90);
  ctx.fillText('SCORE: ' + gs.score, CANVAS_SIZE / 2, 105);

  ctx.font      = '4px "Press Start 2P"';
  ctx.fillStyle = '#888888';
  ctx.fillText('PRESS ENTER', CANVAS_SIZE / 2, 130);
  ctx.textAlign = 'left';
}

// ─── Master render function ────────────────────────────────────────
// Called once per frame from game.js
// gs: GameState
function render(ctx, gs) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  switch (gs.screen) {
    case SCREEN_TITLE:
      drawTitleScreen(ctx, gs.factionData);
      break;

    case SCREEN_SELECT:
      drawCharSelectScreen(ctx, gs.factionData, gs.selFactionIdx, gs.selWrestlerIdx);
      break;

    case SCREEN_GAMEPLAY:
      renderGameplay(ctx, gs);
      break;

    case SCREEN_WIN:
      drawWinScreen(ctx, gs);
      break;

    case SCREEN_GAMEOVER:
      drawGameOverScreen(ctx, gs);
      break;
  }
}

function renderGameplay(ctx, gs) {
  var currentRoom = gs.player.room;

  // 1. Tile layer
  drawRoom(ctx, currentRoom);

  // 2. Hiding spot occupied indicators
  drawHidingSpots(ctx, gs.hidingSpots, currentRoom);

  // 3. Vision cones (behind entities)
  for (var i = 0; i < gs.enemies.length; i++) {
    var en = gs.enemies[i];
    if (en.screenCol === gs.player.screenCol &&
        en.screenRow === gs.player.screenRow) {
      drawVisionCone(ctx, en);
    }
  }

  // 4. Allies on current screen
  for (var j = 0; j < gs.allies.length; j++) {
    var al = gs.allies[j];
    if (al.screenCol === gs.player.screenCol &&
        al.screenRow === gs.player.screenRow) {
      drawAlly(ctx, al);
    }
  }

  // 5. Enemies on current screen
  for (var k = 0; k < gs.enemies.length; k++) {
    var e2 = gs.enemies[k];
    if (e2.screenCol === gs.player.screenCol &&
        e2.screenRow === gs.player.screenRow) {
      drawEnemy(ctx, e2);
    }
  }

  // 6. Player (on top)
  drawPlayer(ctx, gs.player);

  // 7. Mini-map
  drawMinimap(ctx, gs);

  // 8. HUD
  drawHUD(ctx, gs);
}
```

- [ ] **Step 2: Verify renderer loads without errors**

Open `index.html` in browser. Open DevTools console. Run:

```js
console.assert(typeof render === 'function', 'render defined');
console.assert(typeof drawRoom === 'function', 'drawRoom defined');
console.assert(typeof drawMinimap === 'function', 'drawMinimap defined');
console.assert(typeof drawHUD === 'function', 'drawHUD defined');
console.log('renderer.js: function definitions OK');
```

Expected: "renderer.js: function definitions OK" with no assertion errors and no script errors in the console.

- [ ] **Step 3: Commit**

```
git add renderer.js
git commit -m "feat: renderer — tiles, entities, vision cones, mini-map, HUD, screen overlays"
```

---

## Task 7: Game Loop (`game.js`)

**Files:**
- Create: `g:/LoCo Pro Wrestling (PC)/hidegame/game.js`

- [ ] **Step 1: Write `game.js`**

```js
// ─────────────────────────────────────────────────────────────────
// game.js — GameState, main loop, input, screen transitions, scoring
// Depends on: constants.js, world.js, entities.js, ai.js, renderer.js
// ─────────────────────────────────────────────────────────────────

// ─── Parse embedded JSON once ─────────────────────────────────────
var RAW_WRESTLERS = JSON.parse(document.getElementById('wrestlers-data').textContent);
var RAW_ROOMS     = JSON.parse(document.getElementById('rooms-data').textContent);

// ─── GameState ────────────────────────────────────────────────────
var gs = {
  screen:         SCREEN_TITLE,

  // Character select state
  factionData:    RAW_WRESTLERS.factions,
  selFactionIdx:  0,
  selWrestlerIdx: 0,

  // World
  grid:        null,  // ScreenGrid
  hidingSpots: [],    // all HidingSpot objects across all rooms

  // Entities
  player:  null,
  enemies: [],
  allies:  [],

  // Runtime
  roundTimer:  ROUND_TIMER * 1000,  // ms remaining
  alliesAlive: 0,
  score:       0,

  // Input state
  keys: {}
};

// ─── Input ────────────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  gs.keys[e.code] = true;

  // Title screen
  if (gs.screen === SCREEN_TITLE) {
    if (e.code === 'Enter') {
      gs.screen = SCREEN_SELECT;
    }
    return;
  }

  // Character select screen
  if (gs.screen === SCREEN_SELECT) {
    var fLen = gs.factionData.length;
    var wLen = gs.factionData[gs.selFactionIdx].wrestlers.length;

    if (e.code === 'ArrowLeft'  || e.code === 'KeyA') {
      gs.selFactionIdx  = (gs.selFactionIdx  - 1 + fLen) % fLen;
      gs.selWrestlerIdx = 0;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      gs.selFactionIdx  = (gs.selFactionIdx  + 1) % fLen;
      gs.selWrestlerIdx = 0;
    }
    if (e.code === 'ArrowUp'    || e.code === 'KeyW') {
      gs.selWrestlerIdx = (gs.selWrestlerIdx - 1 + wLen) % wLen;
    }
    if (e.code === 'ArrowDown'  || e.code === 'KeyS') {
      gs.selWrestlerIdx = (gs.selWrestlerIdx + 1) % wLen;
    }
    if (e.code === 'Enter') {
      startGame();
    }
    return;
  }

  // Win/Game Over screens
  if (gs.screen === SCREEN_WIN || gs.screen === SCREEN_GAMEOVER) {
    if (e.code === 'Enter') {
      gs.screen         = SCREEN_TITLE;
      gs.selFactionIdx  = 0;
      gs.selWrestlerIdx = 0;
    }
    return;
  }

  // Gameplay — hide/unhide on Space
  if (gs.screen === SCREEN_GAMEPLAY) {
    if (e.code === 'Space') {
      handleHideToggle();
    }
  }
});

document.addEventListener('keyup', function(e) {
  gs.keys[e.code] = false;
});

// ─── Hide toggle ──────────────────────────────────────────────────
function handleHideToggle() {
  var player = gs.player;

  if (player.isHidden) {
    // Unhide
    player.hidingSpot.isOccupied = false;
    player.hidingSpot.occupant   = null;
    player.hidingSpot            = null;
    player.isHidden              = false;
    return;
  }

  // Find nearest unoccupied hiding spot within 1 tile
  var best     = null;
  var bestDist = (TILE_SIZE + 1); // 1 tile threshold in pixels
  for (var i = 0; i < gs.hidingSpots.length; i++) {
    var hs = gs.hidingSpots[i];
    if (hs.room !== player.room) continue;
    if (hs.isOccupied) continue;
    var dx = (player.x + player.width  / 2) - hs.cx;
    var dy = (player.y + player.height / 2) - hs.cy;
    var d  = Math.sqrt(dx * dx + dy * dy);
    if (d < bestDist) {
      bestDist = d;
      best = hs;
    }
  }

  if (best) {
    player.isHidden              = true;
    player.hidingSpot            = best;
    best.isOccupied              = true;
    best.occupant                = player;
    // Snap to spot center
    player.x = best.cx - player.width  / 2;
    player.y = best.cy - player.height / 2;
  }
}

// ─── Game Init ────────────────────────────────────────────────────
function startGame() {
  // Build world
  gs.grid = new ScreenGrid(RAW_ROOMS);

  // Collect all hiding spots from all rooms
  gs.hidingSpots = [];
  for (var row = 0; row < GRID_SIZE; row++) {
    for (var col = 0; col < GRID_SIZE; col++) {
      var room = gs.grid.getRoom(col, row);
      if (room) {
        var spots = buildHidingSpotsForRoom(room);
        for (var s = 0; s < spots.length; s++) {
          gs.hidingSpots.push(spots[s]);
        }
      }
    }
  }

  // Create player — always starts in locker_room_tl
  var faction  = gs.factionData[gs.selFactionIdx];
  var wrestler = faction.wrestlers[gs.selWrestlerIdx];
  var startRoom = gs.grid.getRoom(0, 0);
  gs.player    = new Player(wrestler, faction, startRoom);

  // Create enemies — distribute across center screens
  gs.enemies = [];
  var enemyRooms = [
    gs.grid.getRoom(1, 1),
    gs.grid.getRoom(2, 1),
    gs.grid.getRoom(1, 2),
    gs.grid.getRoom(2, 2)
  ];
  for (var e = 0; e < ENEMY_COUNT; e++) {
    var eRoom = enemyRooms[e % enemyRooms.length];
    if (eRoom) {
      gs.enemies.push(new Enemy(eRoom, eRoom.patrolPoints));
    }
  }

  // Create allies — distribute across rooms with spawn points
  gs.allies = [];
  var allyRooms = [];
  for (var ar = 0; ar < GRID_SIZE; ar++) {
    for (var ac = 0; ac < GRID_SIZE; ac++) {
      var r = gs.grid.getRoom(ac, ar);
      if (r && r.spawnPoints && r.spawnPoints.length > 0) {
        allyRooms.push(r);
      }
    }
  }
  var allyCount = 0;
  for (var ai = 0; ai < allyRooms.length && allyCount < ALLY_COUNT; ai++) {
    var aRoom = allyRooms[ai];
    for (var sp = 0; sp < aRoom.spawnPoints.length && allyCount < ALLY_COUNT; sp++) {
      gs.allies.push(new Ally(aRoom, aRoom.spawnPoints[sp]));
      allyCount++;
    }
  }

  // Reset runtime
  gs.roundTimer  = ROUND_TIMER * 1000;
  gs.alliesAlive = gs.allies.length;
  gs.score       = 0;

  gs.screen = SCREEN_GAMEPLAY;
}

// ─── Player movement ──────────────────────────────────────────────
function updatePlayer(dt) {
  var player = gs.player;
  if (player.isHidden) return; // movement locked while hiding

  var dx = 0;
  var dy = 0;

  if (gs.keys['ArrowLeft']  || gs.keys['KeyA']) { dx -= player.speed; }
  if (gs.keys['ArrowRight'] || gs.keys['KeyD']) { dx += player.speed; }
  if (gs.keys['ArrowUp']    || gs.keys['KeyW']) { dy -= player.speed; }
  if (gs.keys['ArrowDown']  || gs.keys['KeyS']) { dy += player.speed; }

  if (dx !== 0 || dy !== 0) {
    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }
    player.facingAngle = Math.atan2(dy, dx);
    moveWithCollision(player, dx, dy);
  }

  // ─── Screen transition ────────────────────────────────────────
  checkScreenTransition(player);
}

// checkScreenTransition — teleports player (and chasing enemies) to new screen
function checkScreenTransition(player) {
  var newCol = player.screenCol;
  var newRow = player.screenRow;
  var newX   = player.x;
  var newY   = player.y;
  var crossed = false;

  if (player.x + player.width < 0) {
    newCol--;
    newX   = CANVAS_SIZE - player.width - 1;
    crossed = true;
  } else if (player.x > CANVAS_SIZE) {
    newCol++;
    newX   = 1;
    crossed = true;
  } else if (player.y + player.height < 0) {
    newRow--;
    newY   = CANVAS_SIZE - player.height - 1;
    crossed = true;
  } else if (player.y > CANVAS_SIZE) {
    newRow++;
    newY   = 1;
    crossed = true;
  }

  if (!crossed) return;

  // Validate destination
  var destRoom = gs.grid.getRoom(newCol, newRow);
  if (!destRoom) return; // hit world edge — stay put

  // Move player
  player.screenCol = newCol;
  player.screenRow = newRow;
  player.room      = destRoom;
  player.x         = newX;
  player.y         = newY;

  // Carry chasing enemies to new screen
  for (var i = 0; i < gs.enemies.length; i++) {
    var en = gs.enemies[i];
    if (en.isChasing) {
      en.screenCol = newCol;
      en.screenRow = newRow;
      en.room      = destRoom;
      en.x         = CANVAS_SIZE / 2;
      en.y         = CANVAS_SIZE / 2;
    }
  }
}

// ─── Entity updates ───────────────────────────────────────────────
function updateEntities(dt) {
  // Enemies — all screens every frame
  for (var i = 0; i < gs.enemies.length; i++) {
    updateEnemy(gs.enemies[i], gs.player, gs.grid, dt);

    // Catch check
    if (enemyTouchesPlayer(gs.enemies[i], gs.player)) {
      gs.screen = SCREEN_GAMEOVER;
      return;
    }
  }

  // Allies — all screens every frame
  for (var j = 0; j < gs.allies.length; j++) {
    var ally = gs.allies[j];
    if (ally.state === STATE_CAUGHT) continue;

    // Collect hiding spots on ally's screen
    var allySpots = [];
    for (var k = 0; k < gs.hidingSpots.length; k++) {
      var hs = gs.hidingSpots[k];
      if (hs.room === ally.room) allySpots.push(hs);
    }

    updateAlly(ally, gs.enemies, allySpots, dt);
  }

  // Recount alive allies
  var alive = 0;
  for (var m = 0; m < gs.allies.length; m++) {
    if (gs.allies[m].alive) alive++;
  }
  gs.alliesAlive = alive;
}

// ─── Scoring ──────────────────────────────────────────────────────
function updateScore(dt) {
  // Survival score — per second
  gs.score += (dt / 1000) * SCORE_PER_SECOND;
}

// ─── Main loop ────────────────────────────────────────────────────
var lastTime = 0;

function gameLoop(timestamp) {
  var dt = Math.min(timestamp - lastTime, 50); // cap at 50ms to avoid spiral
  lastTime = timestamp;

  if (gs.screen === SCREEN_GAMEPLAY) {
    // Tick timer
    gs.roundTimer -= dt;

    if (gs.roundTimer <= 0) {
      // Win!
      gs.roundTimer = 0;
      gs.score = Math.floor(gs.score);
      gs.score += gs.alliesAlive * SCORE_PER_ALLY;
      if (gs.alliesAlive === ALLY_COUNT) {
        gs.score += SCORE_FULL_SURVIVAL;
      }
      gs.screen = SCREEN_WIN;
    } else {
      updateScore(dt);
      updatePlayer(dt);
      updateEntities(dt);
    }
  }

  var canvas = document.getElementById('gameCanvas');
  var ctx    = canvas.getContext('2d');
  render(ctx, gs);

  requestAnimationFrame(gameLoop);
}

// ─── Boot ─────────────────────────────────────────────────────────
requestAnimationFrame(function(ts) {
  lastTime = ts;
  gameLoop(ts);
});
```

- [ ] **Step 2: Verify game boots to Title screen**

Open `index.html` in browser. Expected results:
- 256×256 canvas with black background
- Text "LoCo Pro Wrestling" (two lines) in white Press Start 2P font
- Yellow "HIDE" text below
- "PRESS ENTER TO START" text
- No console errors

- [ ] **Step 3: Verify Character Select screen**

Press Enter from Title. Expected:
- Character select screen appears
- Faction name shows "< The Rising >"
- Four wrestler names listed
- First wrestler highlighted in faction color
- Speed and hide stat bars visible
- Arrow Left/Right changes faction; the faction name and color accent change
- Arrow Up/Down changes selected wrestler; stat bars update

- [ ] **Step 4: Verify gameplay starts and basic movement works**

Press Enter on Character Select. Expected:
- 256×256 canvas shows room tiles (dark floor, black walls, dark green hiding spots)
- Player colored rectangle visible (red for The Rising, blue for Pillars)
- Direction nub visible on player
- Mini-map visible top-left, 64×64, with grid cells and player dot
- HUD strip at top (timer counting down) and bottom (room name "Locker Room")
- WASD / arrow keys move player
- Player cannot walk through wall tiles
- Player slides along walls (axis-split collision)

- [ ] **Step 5: Verify screen transitions**

Walk player to the right edge of the canvas. Expected:
- Player instantly appears on the left edge of the adjacent screen
- Room label in HUD changes to match new room
- Mini-map dot updates to new screen position

- [ ] **Step 6: Verify hiding**

Walk player next to a dark green hiding spot tile. Press Space. Expected:
- Player snaps to spot center, becomes semi-transparent
- Space again: player returns to full opacity, can move again

- [ ] **Step 7: Verify enemy patrol and vision cone**

Walk player to a center screen (grid 1,1 — Ringside). Expected:
- Enemy rectangle visible, moving between waypoints
- Semi-transparent yellow triangle (vision cone) visible in front of enemy
- When player walks into vision cone, cone turns orange briefly then red
- Enemy chases player when cone is red

- [ ] **Step 8: Verify game over**

Let an enemy touch the player. Expected:
- Screen cuts to dark red background
- "CAUGHT!" text in red
- Seconds survived displayed
- Score displayed
- "PRESS ENTER" prompt
- Enter returns to Title screen

- [ ] **Step 9: Verify win condition**

In DevTools console, run `gs.roundTimer = 1000;` to fast-forward to win. Wait ~1 second. Expected:
- "YOU WIN!" screen appears with time, ally count, and score
- Enter returns to Title

- [ ] **Step 10: Commit**

```
git add game.js
git commit -m "feat: game — main loop, input, screen transitions, scoring, win/lose conditions"
```

---

## Task 8: README (`README.md`)

**Files:**
- Create: `g:/LoCo Pro Wrestling (PC)/hidegame/README.md`

- [ ] **Step 1: Write `README.md`**

```markdown
# LoCo Pro Wrestling: Hide

A single-player, top-down, 8-bit browser game. Pick a wrestler from The Rising or The Pillars, then hide from the opposing faction's hunters on a 16-screen map while CPU allies do the same. Survive 90 seconds to win.

## Play

Open `index.html` in any modern browser (Chrome, Firefox, Edge). No server required — works from `file://`.

To serve locally (avoids any file:// quirks):
```
npx serve .
```
Then open `http://localhost:3000`.

## Controls

| Key | Action |
|---|---|
| WASD / Arrow keys | Move |
| Space | Hide / Unhide (must be adjacent to a hiding spot) |
| Left / Right Arrow | Change faction (Character Select) |
| Up / Down Arrow | Pick wrestler (Character Select) |
| Enter | Confirm / advance screen |

## Wrestlers

Each wrestler has a speed multiplier and a hide multiplier:
- **Speed** — movement speed relative to base
- **Hide** — detection radius while hiding (lower = harder for enemies to detect you)

| Wrestler | Faction | Speed | Hide |
|---|---|---|---|
| Zeak | The Rising | 1.2× | 0.9× |
| Erza | The Rising | 0.9× | 0.7× |
| Johnny | The Rising | 1.0× | 1.0× |
| Carter | The Rising | 0.8× | 1.3× |
| JT | The Pillars | 1.2× | 0.9× |
| Cody | The Pillars | 0.9× | 0.7× |
| Nicky | The Pillars | 1.0× | 1.0× |
| Franky | The Pillars | 0.8× | 1.3× |

## Scoring

| Event | Points |
|---|---|
| Each second survived | 10 |
| Each ally still alive at end | 500 |
| Full 90-second survival | +1000 bonus |

## Deployment (GitHub Pages)

1. Push repository to GitHub.
2. In the repository Settings → Pages, set source to the `main` branch, root folder.
3. The game is live at `https://<username>.github.io/<repo>/`.

No build step required.

## Known Limitations (Prototype)

- No audio
- No save / high score persistence
- Ally AI uses straight-line movement only (no pathfinding)
- All 16 room layouts are hand-authored; no map editor
- Entities are colored rectangles with direction nubs — no animated sprites
- Single fixed difficulty (tunable by editing `constants.js`)

## Suggested Next Steps

1. **Audio** — chiptune SFX (footsteps, hide, caught, win jingle)
2. **Wrestler abilities** — unique skills beyond speed/hide multipliers
3. **Animated sprites** — replace colored rectangles
4. **Difficulty selector** — affects enemy count, speed, vision cone size
5. **High score persistence** — `localStorage`
6. **Ally pathfinding** — A* or flow fields
7. **More room types and a map editor**
8. **Mobile touch controls**

## File Structure

```
index.html     Canvas, JSON data, script tags
style.css      Full-screen layout, Press Start 2P font
constants.js   All tuning values — single source of truth
world.js       Room class, 4×4 ScreenGrid, tile helpers
entities.js    Player, Enemy, Ally, HidingSpot constructors
ai.js          State machines, vision cone, collision
renderer.js    All canvas draw calls
game.js        Main loop, input, screen transitions, scoring
```
```

- [ ] **Step 2: Commit**

```
git add README.md
git commit -m "docs: README — controls, deployment, limitations, next steps"
```

---

## Self-Review

### 1. Spec Coverage Check

| Spec Requirement | Task |
|---|---|
| Multi-file vanilla JS, no build, `<script>` tags | Task 1 |
| JSON in `<script type="application/json">` blocks | Task 1 |
| Canvas 256×256, 16×16 tiles at 16px/tile | Tasks 1, 2 |
| 4×4 grid, one screen at a time | Tasks 2, 3 |
| Press Start 2P font | Task 1 |
| All 6 room types (locker, hallway, backstage, ringside, entrance, storage) | Task 1 (JSON) |
| Faction colors #E63946 / #457B9D | Tasks 2, 4 |
| `Room` class, tile lookup helpers | Task 3 |
| Player: pixel position, isHidden, hideDetectRadius, speed | Task 4 |
| Enemy: homeScreen, facingAngle, all 5 states | Tasks 4, 5 |
| Ally: stays on spawn screen, all 4 states | Tasks 4, 5 |
| HidingSpot: isOccupied, occupant | Tasks 4, 5 |
| Enemy state machine PATROL→ALERTED→CHASING→SEARCHING→RETURNING | Task 5 |
| Ally state machine WANDERING→FLEEING→HIDING→CAUGHT | Task 5 |
| Vision cone 90°, 5 tiles deep, wall occlusion | Task 5 |
| Vision cone colors (yellow/orange/red) | Task 6 |
| Tile AABB collision, axis-split sliding | Task 5 |
| Space to hide/unhide, 1-tile proximity, snap to center | Task 7 |
| Off-screen enemy simulation (all enemies updated every frame) | Task 7 |
| Screen transitions — instant cut, opposite edge | Task 7 |
| Chasing enemies follow player across screens | Task 7 |
| Mini-map 64×64, player dot, enemy dots, ally dots, active screen border | Task 6 |
| HUD: timer, ally count, room name | Task 6 |
| Timer turns red under 20s | Task 6 |
| Screen flow: TITLE→SELECT→GAMEPLAY→WIN|GAMEOVER | Tasks 6, 7 |
| Character select: faction toggle, wrestler picker, stat bars | Tasks 6, 7 |
| Win: timer hits 0, score breakdown | Tasks 6, 7 |
| Game over: red flash, time survived | Tasks 6, 7 |
| Scoring: 10/s + 500/ally + 1000 full-clear | Tasks 2, 7 |
| ENEMY_COUNT=4, ALLY_COUNT=3, all constants | Task 2 |
| README | Task 8 |

All spec requirements are covered.

### 2. Placeholder Scan

Checked all tasks — no "TBD", "TODO", "similar to Task N", or "add appropriate error handling" phrases found. Every step that changes code includes the full code block.

### 3. Type Consistency Check

- `gs.hidingSpots` built in `startGame()` (Task 7), passed to `updateAlly()` (Task 5) as `hidingSpots` — consistent.
- `buildHidingSpotsForRoom(room)` defined in Task 4 (`entities.js`), called in Task 7 (`game.js`) — consistent.
- `moveWithCollision(entity, dx, dy)` defined in Task 5 (`ai.js`), called in Task 7 (`game.js`) for player movement — consistent.
- `enemyTouchesPlayer(enemy, player)` defined in Task 5, called in Task 7 — consistent.
- `render(ctx, gs)` defined in Task 6, called in Task 7 — consistent.
- `ScreenGrid`, `Room`, `pixelToTile`, `tileToPixelCenter` defined in Task 3, used in Tasks 4, 5, 6, 7 — consistent.
- `entityDist`, `entityDistTiles`, `nearestFreeHidingSpot` all use `.width`/`.height` which every entity has — consistent.
- `gs.screen` compared against `SCREEN_TITLE`, `SCREEN_SELECT`, `SCREEN_GAMEPLAY`, `SCREEN_WIN`, `SCREEN_GAMEOVER` — all defined in Task 2 and used identically in Tasks 6 and 7.
- `allyCaught(ally)` defined in Task 5, sets `ally.alive = false` — `gs.alliesAlive` recount in Task 7 reads `ally.alive` — consistent.
- `drawHidingSpots` in Task 6 had a tautology check `hs.occupant === hs.occupant` — corrected to `hs.occupant !== null` in the Task 6 code block above.

All other type and method-name references are consistent across tasks.
