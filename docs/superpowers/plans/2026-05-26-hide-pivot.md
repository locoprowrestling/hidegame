# Hide — Object Disguise Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pivot hidegame from a stealth-maze to a single-room top-down object-disguise game where the player transforms into venue props and survives hunter inspection.

**Architecture:** Single-room rounds; player transforms into 8 disguisable objects with per-room believability zones; suspicion meter (0–100) ticks based on placement quality and hunter proximity; one hunter runs a 6-state inspection AI; 2 CPU allies hide alongside player.

**Tech Stack:** Vanilla HTML/CSS/JS, Canvas 2D API, 256px logical / 768px rendered at 3× CSS scale, no bundler, static hosting.

---

### Task 1: Delete old files, rewrite constants.js, update index.html

**Files:**
- Delete: `world.js`, `assets.js`
- Rewrite: `constants.js`
- Modify: `index.html` (team data + script loading order)

- [ ] **Step 1: Delete old files**

```bash
cd /Users/gecko1/locopro/hidegame
rm world.js assets.js
```

- [ ] **Step 2: Write new constants.js**

Replace the entire file with:

```js
// constants.js
var CANVAS_SIZE   = 256;
var TILE_SIZE     = 16;

// Screen states
var SCREEN_TITLE      = 'title';
var SCREEN_TEAM       = 'team';
var SCREEN_CHAR       = 'char';
var SCREEN_ROOM_INTRO = 'room_intro';
var SCREEN_GAMEPLAY   = 'gameplay';
var SCREEN_WIN        = 'win';
var SCREEN_GAMEOVER   = 'gameover';

// Game phases (during SCREEN_GAMEPLAY)
var PHASE_SETUP = 'setup';
var PHASE_HUNT  = 'hunt';

// Timers (seconds)
var SETUP_TIMER          = 10;
var HUNT_TIMER           = 45;
var ROOM_INTRO_MS        = 1500;

// Speeds (px/frame)
var PLAYER_SPEED_BASE    = 2.0;
var HUNTER_PATROL_SPEED  = 1.2;
var HUNTER_INSPECT_SPEED = 1.6;
var ALLY_MOVE_SPEED      = 1.8;

// Suspicion
var SUSPICION_MAX            = 100;
var SUSPICION_MOVE_RATE      = 5;    // /s: moving while transformed in sight cone
var SUSPICION_INSPECT_RATE   = 3;    // /s: hunter actively inspecting player object
var SUSPICION_DRAIN_RATE     = 1;    // /s: passive drain when still
var SUSPICION_DRAIN_FAR      = 2;    // /s: bonus drain when hunter > FAR threshold
var SUSPICION_RETRANSFORM    = 10;   // flat penalty per retransform during hunt
var SUSPICION_ZONE_GOOD_MULT = 0.3;
var SUSPICION_ZONE_BAD_MULT  = 2.0;

// Hunter
var HUNTER_SIGHT_RANGE     = 80;              // px (5 tiles)
var HUNTER_SIGHT_HALF_ARC  = Math.PI / 4;    // 45° each side = 90° cone
var HUNTER_INSPECT_RANGE   = 20;             // px: begin eval pause when within this
var HUNTER_INSPECT_MS      = 1500;           // ms: pause duration at object
var HUNTER_NOTICE_MS       = 600;            // ms: "?" pause before walking
var HUNTER_FAR_DIST        = 80;             // px: threshold for drain bonus
var HUNTER_INSPECT_CHANCE  = 0.006;          // per-frame chance to pick an object

// Hunter AI states
var HUNTER_ENTERING   = 'entering';
var HUNTER_PATROLLING = 'patrolling';
var HUNTER_NOTICING   = 'noticing';
var HUNTER_INSPECTING = 'inspecting';
var HUNTER_ACCUSING   = 'accusing';
var HUNTER_RETURNING  = 'returning';

// Scoring
var SCORE_BASE              = 100;
var SCORE_PER_SECOND        = 2;
var SCORE_ALLY_BONUS        = 10;
var SCORE_STILL_BONUS       = 25;   // never moved while transformed during hunt
var SCORE_NO_RETRANSFORM    = 15;   // never retransformed during hunt
var SCORE_GOOD_ZONE_BONUS   = 20;   // was in a good zone when hunt ended

// UI
var UI_BAR_H     = 20;   // px: top HUD bar height
var MINIMAP_W    = 48;
var MINIMAP_H    = 48;
```

- [ ] **Step 3: Update index.html — replace embedded JSON and script list**

Replace the entire `<script type="application/json" id="wrestlers-data">` block with:

```html
  <script type="application/json" id="teams-data">
  {
    "teams": [
      {
        "name": "Team A",
        "color": "#E63946",
        "characters": [
          {"id":"A1","label":"A1","speedMult":1.0,"hideMult":1.0},
          {"id":"A2","label":"A2","speedMult":1.2,"hideMult":0.8},
          {"id":"A3","label":"A3","speedMult":0.8,"hideMult":1.2},
          {"id":"A4","label":"A4","speedMult":1.0,"hideMult":1.0}
        ]
      },
      {
        "name": "Team B",
        "color": "#457B9D",
        "characters": [
          {"id":"B1","label":"B1","speedMult":1.0,"hideMult":1.0},
          {"id":"B2","label":"B2","speedMult":1.2,"hideMult":0.8},
          {"id":"B3","label":"B3","speedMult":0.8,"hideMult":1.2},
          {"id":"B4","label":"B4","speedMult":1.0,"hideMult":1.0}
        ]
      }
    ]
  }
  </script>
```

Remove the entire `<script type="application/json" id="rooms-data">` block.

Replace the script loading block at the bottom with:

```html
  <script src="constants.js"></script>
  <script src="objects.js"></script>
  <script src="rooms.js"></script>
  <script src="entities.js"></script>
  <script src="suspicion.js"></script>
  <script src="ai.js"></script>
  <script src="renderer.js"></script>
  <script src="audio.js"></script>
  <script src="game.js"></script>
```

Also update the canvas to be 256×256 and add CSS scale via inline style (the 3× scale is set in game.js via setupCanvas):

```html
  <canvas id="gameCanvas" width="256" height="256"></canvas>
```

- [ ] **Step 4: Verify page loads without JS errors**

```bash
python3 -m http.server 8181
```

Open http://localhost:8181 — browser console should show no errors (game.js doesn't exist yet so a 404 is expected, but no syntax errors in existing scripts).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: delete maze files, scaffold new constants and index for disguise pivot"
```

---

### Task 2: Create objects.js

**Files:**
- Create: `objects.js`

- [ ] **Step 1: Create objects.js**

```js
// objects.js — 8 disguisable object definitions
// Each object: id, label, w/h (px logical), color (fallback), sprite (path or null),
//   believableRooms, believableZoneNames, suspicionMult

var OBJECTS = [
  {
    id: 'chair',
    label: 'Folding Chair',
    w: 12, h: 12,
    color: '#C8A46E',
    sprite: 'Assets/sprites/objects/obj-chair-stack.png',
    believableRooms: ['ring_area','locker_room','storage_room'],
    believableZoneNames: ['ringside','locker_wall','storage_wall','bench_area'],
    suspicionMult: 1.0
  },
  {
    id: 'road_case',
    label: 'Road Case',
    w: 16, h: 12,
    color: '#4A4A4A',
    sprite: 'Assets/sprites/objects/obj-road-case.png',
    believableRooms: ['backstage_hallway','entrance_curtain','storage_room'],
    believableZoneNames: ['wall_side','entrance_side','storage_wall'],
    suspicionMult: 1.0
  },
  {
    id: 'crate',
    label: 'Crate',
    w: 14, h: 14,
    color: '#8B6914',
    sprite: 'Assets/sprites/objects/obj-crate.png',
    believableRooms: ['storage_room','backstage_hallway','locker_room'],
    believableZoneNames: ['storage_wall','wall_side','locker_corner','bench_area'],
    suspicionMult: 1.0
  },
  {
    id: 'trash_can',
    label: 'Trash Can',
    w: 10, h: 12,
    color: '#606060',
    sprite: 'Assets/sprites/objects/obj-trash-can.png',
    believableRooms: ['locker_room','backstage_hallway'],
    believableZoneNames: ['locker_corner','locker_wall','wall_side'],
    suspicionMult: 1.1
  },
  {
    id: 'merch_box',
    label: 'Merch Box',
    w: 14, h: 10,
    color: '#E84444',
    sprite: null,
    believableRooms: ['merch_area','storage_room'],
    believableZoneNames: ['table_back','storage_wall'],
    suspicionMult: 1.2
  },
  {
    id: 'mic_stand',
    label: 'Mic Stand',
    w: 6, h: 18,
    color: '#B0B0B0',
    sprite: null,
    believableRooms: ['ring_area','entrance_curtain'],
    believableZoneNames: ['entrance_side','ringside'],
    suspicionMult: 1.0
  },
  {
    id: 'ladder',
    label: 'Ladder',
    w: 10, h: 20,
    color: '#909090',
    sprite: null,
    believableRooms: ['ring_area','storage_room'],
    believableZoneNames: ['ringside','storage_wall'],
    suspicionMult: 1.3
  },
  {
    id: 'curtain',
    label: 'Curtain Bundle',
    w: 16, h: 14,
    color: '#800020',
    sprite: 'Assets/sprites/objects/obj-curtain.png',
    believableRooms: ['entrance_curtain','backstage_hallway'],
    believableZoneNames: ['entrance_side','wall_side'],
    suspicionMult: 0.9
  }
];
```

- [ ] **Step 2: Verify in browser console**

Open console on http://localhost:8181 and run:
```js
console.log(OBJECTS.length);            // → 8
console.log(OBJECTS[0].id);             // → "chair"
console.log(OBJECTS[7].label);          // → "Curtain Bundle"
```

- [ ] **Step 3: Commit**

```bash
git add objects.js
git commit -m "feat: add 8 disguisable object definitions"
```

---

### Task 3: Create rooms.js

**Files:**
- Create: `rooms.js`

Zone matching rule: zones are checked in order; the FIRST zone whose rect contains the player's center wins. `believableObjects` lists object ids that get `SUSPICION_ZONE_GOOD_MULT` (0.3×). Everything else in that zone gets `defaultMult`.

- [ ] **Step 1: Create rooms.js**

```js
// rooms.js — 6 room definitions
// Each room: id, label, bgColor, bgTileset, staticProps, zones, patrolPath,
//            hunterEntry, playerSpawn, allySpawns

// Zone structure:
//   {name, x, y, w, h, believableObjects:[id,...], defaultMult}
// First matching zone wins. Smaller/specific zones go first in the array.

var ROOMS = {

  ring_area: {
    id: 'ring_area',
    label: 'Ring Area',
    bgColor: '#1a1a2e',
    bgTileset: 'Assets/bg_tiles/hide/wrestling-ring-tileset.png',
    staticProps: [
      {x:68, y:68, w:120, h:120, color:'#333333'},   // ring apron
      {x:84, y:84, w:88,  h:88,  color:'#e8e8e8'},   // ring canvas
    ],
    zones: [
      {name:'ring_interior', x:84,  y:84,  w:88,  h:88,  believableObjects:[], defaultMult:2.0},
      {name:'ringside',      x:48,  y:48,  w:160, h:160, believableObjects:['chair','ladder','mic_stand'], defaultMult:1.0},
      {name:'open_floor',    x:0,   y:20,  w:256, h:236, believableObjects:[], defaultMult:1.0},
    ],
    patrolPath: [{x:128,y:30},{x:220,y:128},{x:128,y:220},{x:30,y:128}],
    hunterEntry: {x:232, y:128},
    playerSpawn: {x:32,  y:128},
    allySpawns:  [{x:32, y:40}, {x:32, y:210}],
  },

  backstage_hallway: {
    id: 'backstage_hallway',
    label: 'Backstage Hallway',
    bgColor: '#2d2d2d',
    bgTileset: 'Assets/bg_tiles/hide/backstage-hallway-tileset.png',
    staticProps: [
      {x:0,   y:20,  w:256, h:36, color:'#3a3a3a'},   // top wall strip
      {x:0,   y:200, w:256, h:56, color:'#3a3a3a'},   // bottom wall strip
      {x:20,  y:28,  w:20,  h:12, color:'#4A4A4A'},   // road cases on wall
      {x:60,  y:28,  w:20,  h:12, color:'#4A4A4A'},
      {x:20,  y:202, w:20,  h:12, color:'#4A4A4A'},
      {x:80,  y:202, w:20,  h:12, color:'#4A4A4A'},
    ],
    zones: [
      {name:'wall_side_top',    x:0,  y:20,  w:256, h:44,  believableObjects:['road_case','crate','curtain'], defaultMult:1.0},
      {name:'wall_side_bottom', x:0,  y:200, w:256, h:56,  believableObjects:['road_case','crate','curtain'], defaultMult:1.0},
      {name:'hallway_center',   x:0,  y:116, w:256, h:44,  believableObjects:[], defaultMult:2.0},
      {name:'open_floor',       x:0,  y:20,  w:256, h:236, believableObjects:[], defaultMult:1.0},
    ],
    patrolPath: [{x:30,y:128},{x:220,y:128},{x:220,y:128},{x:30,y:128}],
    hunterEntry: {x:240, y:128},
    playerSpawn: {x:30, y:128},
    allySpawns:  [{x:30, y:36}, {x:30, y:204}],
  },

  locker_room: {
    id: 'locker_room',
    label: 'Locker Room',
    bgColor: '#1e3048',
    bgTileset: 'Assets/bg_tiles/hide/locker-room-tileset.png',
    staticProps: [
      {x:20, y:24,  w:216, h:24, color:'#2a4a6a'},   // top lockers
      {x:20, y:208, w:216, h:24, color:'#2a4a6a'},   // bottom lockers
      {x:20, y:100, w:16,  h:56, color:'#5a3a1a'},   // bench left
      {x:220,y:100, w:16,  h:56, color:'#5a3a1a'},   // bench right
    ],
    zones: [
      {name:'locker_corner',     x:0,  y:20,  w:50,  h:50,  believableObjects:['trash_can','crate'], defaultMult:0.8},
      {name:'locker_wall_top',   x:0,  y:20,  w:256, h:44,  believableObjects:['trash_can','crate','chair'], defaultMult:1.0},
      {name:'locker_wall_bottom',x:0,  y:200, w:256, h:56,  believableObjects:['trash_can','crate','chair'], defaultMult:1.0},
      {name:'bench_area',        x:0,  y:90,  w:50,  h:76,  believableObjects:['chair','crate'], defaultMult:1.0},
      {name:'open_center',       x:60, y:80,  w:136, h:96,  believableObjects:[], defaultMult:2.0},
      {name:'open_floor',        x:0,  y:20,  w:256, h:236, believableObjects:[], defaultMult:1.0},
    ],
    patrolPath: [{x:128,y:50},{x:220,y:128},{x:128,y:200},{x:36,y:128}],
    hunterEntry: {x:128, y:240},
    playerSpawn: {x:128, y:120},
    allySpawns:  [{x:36, y:50}, {x:220, y:50}],
  },

  merch_area: {
    id: 'merch_area',
    label: 'Merch Table Area',
    bgColor: '#1a1a1a',
    bgTileset: 'Assets/bg_tiles/hide/merch-area-tileset.png',
    staticProps: [
      {x:48,  y:80, w:60, h:24, color:'#5a3010'},   // table left
      {x:148, y:80, w:60, h:24, color:'#5a3010'},   // table right
      {x:50,  y:72, w:16, h:10, color:'#E84444'},   // merch on tables
      {x:72,  y:72, w:16, h:10, color:'#4444E8'},
      {x:150, y:72, w:16, h:10, color:'#44E844'},
      {x:172, y:72, w:16, h:10, color:'#E8E844'},
    ],
    zones: [
      {name:'table_back',  x:40,  y:104, w:176, h:60, believableObjects:['merch_box','crate','chair'], defaultMult:1.0},
      {name:'front_queue', x:40,  y:164, w:176, h:50, believableObjects:[], defaultMult:2.0},
      {name:'open_floor',  x:0,   y:20,  w:256, h:236, believableObjects:[], defaultMult:1.0},
    ],
    patrolPath: [{x:128,y:40},{x:40,y:160},{x:216,y:160},{x:128,y:40}],
    hunterEntry: {x:20, y:128},
    playerSpawn: {x:220, y:160},
    allySpawns:  [{x:60, y:120}, {x:180, y:120}],
  },

  storage_room: {
    id: 'storage_room',
    label: 'Storage Room',
    bgColor: '#1a1208',
    bgTileset: 'Assets/bg_tiles/hide/storage-room-tileset.png',
    staticProps: [
      {x:20,  y:30,  w:16, h:16, color:'#8B6914'},
      {x:40,  y:30,  w:14, h:14, color:'#6a5010'},
      {x:20,  y:54,  w:16, h:16, color:'#8B6914'},
      {x:210, y:30,  w:16, h:16, color:'#8B6914'},
      {x:230, y:40,  w:12, h:14, color:'#6a5010'},
      {x:210, y:54,  w:16, h:16, color:'#8B6914'},
      {x:20,  y:190, w:20, h:14, color:'#8B6914'},
      {x:220, y:190, w:20, h:14, color:'#8B6914'},
    ],
    zones: [
      {name:'storage_wall_left',  x:0,   y:20,  w:60,  h:216, believableObjects:['crate','road_case','chair','trash_can','merch_box','ladder','curtain'], defaultMult:1.0},
      {name:'storage_wall_right', x:196, y:20,  w:60,  h:216, believableObjects:['crate','road_case','chair','trash_can','merch_box','ladder','curtain'], defaultMult:1.0},
      {name:'storage_wall_top',   x:0,   y:20,  w:256, h:50,  believableObjects:['crate','road_case','chair','trash_can','merch_box','ladder','curtain'], defaultMult:1.0},
      {name:'center_isolated',    x:80,  y:100, w:96,  h:80,  believableObjects:[], defaultMult:2.0},
      {name:'open_floor',         x:0,   y:20,  w:256, h:236, believableObjects:['crate','road_case'], defaultMult:1.0},
    ],
    patrolPath: [{x:128,y:40},{x:40,y:128},{x:128,y:215},{x:216,y:128}],
    hunterEntry: {x:128, y:25},
    playerSpawn: {x:128, y:200},
    allySpawns:  [{x:30, y:40}, {x:220, y:40}],
  },

  entrance_curtain: {
    id: 'entrance_curtain',
    label: 'Entrance Curtain',
    bgColor: '#0d0d1a',
    bgTileset: 'Assets/bg_tiles/hide/entrance-curtain-tileset.png',
    staticProps: [
      {x:0,   y:20, w:256, h:60, color:'#1a0020'},   // backdrop
      {x:20,  y:20, w:30,  h:60, color:'#400040'},   // curtain panels
      {x:60,  y:20, w:30,  h:60, color:'#300030'},
      {x:100, y:20, w:30,  h:60, color:'#400040'},
      {x:140, y:20, w:30,  h:60, color:'#300030'},
      {x:180, y:20, w:30,  h:60, color:'#400040'},
      {x:220, y:20, w:30,  h:60, color:'#300030'},
      {x:10,  y:88, w:20,  h:14, color:'#4A4A4A'},   // road cases stage sides
      {x:226, y:88, w:20,  h:14, color:'#4A4A4A'},
    ],
    zones: [
      {name:'entrance_side',      x:0,  y:20,  w:256, h:80,  believableObjects:['curtain','road_case','mic_stand'], defaultMult:1.0},
      {name:'stage_wings_left',   x:0,  y:80,  w:40,  h:120, believableObjects:['road_case','curtain'], defaultMult:1.0},
      {name:'stage_wings_right',  x:216,y:80,  w:40,  h:120, believableObjects:['road_case','curtain'], defaultMult:1.0},
      {name:'center_path',        x:80, y:130, w:96,  h:90,  believableObjects:[], defaultMult:2.0},
      {name:'open_floor',         x:0,  y:20,  w:256, h:236, believableObjects:[], defaultMult:1.0},
    ],
    patrolPath: [{x:40,y:128},{x:128,y:50},{x:216,y:128},{x:128,y:200}],
    hunterEntry: {x:128, y:240},
    playerSpawn: {x:128, y:200},
    allySpawns:  [{x:20, y:100}, {x:230, y:100}],
  },
};

var ROOM_IDS = Object.keys(ROOMS);
```

- [ ] **Step 2: Verify in browser console**

```js
console.log(ROOM_IDS.length);                        // → 6
console.log(ROOMS.ring_area.label);                  // → "Ring Area"
console.log(ROOMS.storage_room.zones.length);        // → 5
console.log(ROOMS.locker_room.allySpawns.length);    // → 2
```

- [ ] **Step 3: Commit**

```bash
git add rooms.js
git commit -m "feat: add 6 room definitions with zones, patrol paths, spawn points"
```

---

### Task 4: Rewrite entities.js

**Files:**
- Rewrite: `entities.js`

- [ ] **Step 1: Write new entities.js**

```js
// entities.js — Player, Hunter, Ally constructors

// ─── Player ───────────────────────────────────────────────────────
function Player(teamData, charData) {
  this.team      = teamData;   // {name, color, characters}
  this.char      = charData;   // {id, label, speedMult, hideMult}

  this.x = 0; this.y = 0;     // set by startRound
  this.width  = 12;
  this.height = 12;
  this.speed  = PLAYER_SPEED_BASE * charData.speedMult;

  // Transform state
  this.isTransformed = false;
  this.objIdx        = 0;      // index into OBJECTS array

  // Scoring flags (reset each round)
  this.movedWhileTransformed = false;
  this.retransformed         = false;
  this.wasInGoodZone         = false;

  this.facingAngle = 0;
  this.isMoving    = false;
  this.alive       = true;
}

// ─── Hunter ───────────────────────────────────────────────────────
function Hunter(teamData, room) {
  this.team   = teamData;
  this.room   = room;

  // Start off-screen at entry point
  this.x = room.hunterEntry.x;
  this.y = room.hunterEntry.y;
  this.width  = 14;
  this.height = 14;
  this.speed  = HUNTER_PATROL_SPEED;

  this.state        = HUNTER_ENTERING;
  this.patrolIdx    = 0;          // current waypoint in room.patrolPath
  this.stateTimer   = 0;          // ms counter for timed states
  this.inspectTarget = null;      // entity being inspected (Player | Ally | null)
  this.inspectDest  = null;       // {x, y} target pixel for inspection walk
  this.returnDest   = null;       // {x, y} to return to after inspecting

  this.facingAngle  = 0;
  this.isMoving     = true;
}

// ─── Ally ─────────────────────────────────────────────────────────
function Ally(teamData, spawnPt) {
  this.team  = teamData;

  this.x = spawnPt.x;
  this.y = spawnPt.y;
  this.width  = 12;
  this.height = 12;
  this.speed  = ALLY_MOVE_SPEED;

  // Ally picks an object and a destination zone during setup
  this.objIdx      = 0;
  this.destX       = spawnPt.x;
  this.destY       = spawnPt.y;
  this.isTransformed = false;
  this.alive       = true;
  this.badHide     = Math.random() < 0.25;  // 25% chance of poor placement

  this.facingAngle = 0;
  this.isMoving    = false;
}

// ─── Pixel distance between two entities (centers) ────────────────
function entityDist(a, b) {
  var ax = a.x + a.width  / 2;
  var ay = a.y + a.height / 2;
  var bx = b.x + b.width  / 2;
  var by = b.y + b.height / 2;
  return Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
}

// ─── Pixel distance from entity center to a point ─────────────────
function distToPoint(entity, px, py) {
  var ex = entity.x + entity.width  / 2;
  var ey = entity.y + entity.height / 2;
  return Math.sqrt((ex - px) * (ex - px) + (ey - py) * (ey - py));
}

// ─── Move entity toward (tx, ty) at speed; returns true if arrived ─
function moveToward(entity, tx, ty, speed) {
  var dx = tx - (entity.x + entity.width  / 2);
  var dy = ty - (entity.y + entity.height / 2);
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist <= speed) {
    entity.x = tx - entity.width  / 2;
    entity.y = ty - entity.height / 2;
    entity.isMoving = false;
    return true;
  }
  entity.x += (dx / dist) * speed;
  entity.y += (dy / dist) * speed;
  entity.facingAngle = Math.atan2(dy, dx);
  entity.isMoving = true;
  return false;
}

// ─── Clamp entity to canvas playfield (below UI bar) ──────────────
function clampToField(entity) {
  var minX = 2;
  var minY = UI_BAR_H + 2;
  var maxX = CANVAS_SIZE - entity.width  - 2;
  var maxY = CANVAS_SIZE - entity.height - 2;
  entity.x = Math.max(minX, Math.min(maxX, entity.x));
  entity.y = Math.max(minY, Math.min(maxY, entity.y));
}
```

- [ ] **Step 2: Verify in browser console**

```js
var p = new Player({name:'Team A', color:'#E63946'}, {id:'A1',label:'A1',speedMult:1.0,hideMult:1.0});
console.log(p.speed);           // → 2
console.log(p.isTransformed);   // → false
console.log(p.objIdx);          // → 0
```

- [ ] **Step 3: Commit**

```bash
git add entities.js
git commit -m "feat: rewrite entities with transform state, hunter AI slots, ally hide behavior"
```

---

### Task 5: Create suspicion.js

**Files:**
- Create: `suspicion.js`
- Create: `tests/suspicion.test.js`

- [ ] **Step 1: Create suspicion.js**

```js
// suspicion.js — zone matching and per-tick suspicion logic

// Returns which zone the point (px, py) falls in, checking in order.
// First match wins. Returns null if no zone contains the point.
function getZone(room, px, py) {
  var zones = room.zones;
  for (var i = 0; i < zones.length; i++) {
    var z = zones[i];
    if (px >= z.x && px < z.x + z.w && py >= z.y && py < z.y + z.h) {
      return z;
    }
  }
  return null;
}

// Returns the suspicion multiplier for placing objId at (px, py) in room.
function getZoneMultiplier(room, objId, px, py) {
  var zone = getZone(room, px, py);
  if (!zone) return 1.0;
  if (zone.believableObjects.indexOf(objId) !== -1) return SUSPICION_ZONE_GOOD_MULT;
  return zone.defaultMult;
}

// Returns true if point (tx, ty) is inside hunter's sight cone.
function inSightCone(hunter, tx, ty) {
  var hx = hunter.x + hunter.width  / 2;
  var hy = hunter.y + hunter.height / 2;
  var dx = tx - hx;
  var dy = ty - hy;
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > HUNTER_SIGHT_RANGE) return false;
  var angle = Math.atan2(dy, dx);
  var diff  = Math.abs(angle - hunter.facingAngle);
  if (diff > Math.PI) diff = 2 * Math.PI - diff;
  return diff <= HUNTER_SIGHT_HALF_ARC;
}

// Tick suspicion for one frame. Mutates gs.suspicion and player scoring flags.
// Call once per frame only during PHASE_HUNT.
function tickSuspicion(dt, gs) {
  var player  = gs.player;
  var hunter  = gs.hunter;
  var seconds = dt / 1000;

  if (gs.phase !== PHASE_HUNT || !player.isTransformed) {
    // Passive drain still applies if transformed but phase not hunt — skip entirely
    gs.suspicion = Math.max(0, gs.suspicion - SUSPICION_DRAIN_RATE * seconds);
    return;
  }

  var obj   = OBJECTS[player.objIdx];
  var room  = gs.room;
  var px    = player.x + player.width  / 2;
  var py    = player.y + player.height / 2;
  var mult  = getZoneMultiplier(room, obj.id, px, py);

  // Track good-zone status for scoring
  if (mult === SUSPICION_ZONE_GOOD_MULT) player.wasInGoodZone = true;

  // Passive drain
  gs.suspicion -= SUSPICION_DRAIN_RATE * seconds;

  if (hunter) {
    var hx   = hunter.x + hunter.width  / 2;
    var hy   = hunter.y + hunter.height / 2;
    var dist = Math.sqrt((px - hx) * (px - hx) + (py - hy) * (py - hy));

    // Bonus drain when hunter is far away
    if (dist > HUNTER_FAR_DIST) {
      gs.suspicion -= SUSPICION_DRAIN_FAR * seconds;
    }

    // Player moving while transformed and inside sight cone
    if (player.isMoving && inSightCone(hunter, px, py)) {
      gs.suspicion += SUSPICION_MOVE_RATE * seconds * mult * obj.suspicionMult;
      player.movedWhileTransformed = true;
    }

    // Hunter actively inspecting the player's object
    if (hunter.state === HUNTER_INSPECTING && hunter.inspectTarget === player) {
      gs.suspicion += SUSPICION_INSPECT_RATE * seconds * mult * obj.suspicionMult * player.char.hideMult;
    }
  }

  gs.suspicion = Math.max(0, Math.min(SUSPICION_MAX, gs.suspicion));
}
```

- [ ] **Step 2: Create tests/suspicion.test.js**

```js
// tests/suspicion.test.js
// Run: node tests/suspicion.test.js

// ─── Inline constants needed by the tested function ───────────────
var SUSPICION_ZONE_GOOD_MULT = 0.3;
var SUSPICION_ZONE_BAD_MULT  = 2.0;

// ─── Copy of getZoneMultiplier (browser globals not available in Node) ─
function getZoneMultiplier(room, objId, px, py) {
  var zones = room.zones;
  for (var i = 0; i < zones.length; i++) {
    var z = zones[i];
    if (px >= z.x && px < z.x + z.w && py >= z.y && py < z.y + z.h) {
      if (z.believableObjects.indexOf(objId) !== -1) return SUSPICION_ZONE_GOOD_MULT;
      return z.defaultMult;
    }
  }
  return 1.0;
}

var pass = 0, fail = 0;
function assert(cond, msg) {
  if (cond) { pass++; } else { fail++; process.stderr.write('FAIL: ' + msg + '\n'); }
}

var mockRing = {
  zones: [
    {name:'ring_interior', x:84, y:84, w:88, h:88, believableObjects:[], defaultMult:2.0},
    {name:'ringside',      x:48, y:48, w:160,h:160,believableObjects:['chair','ladder'], defaultMult:1.0},
    {name:'open_floor',    x:0,  y:20, w:256,h:236,believableObjects:[], defaultMult:1.0},
  ]
};

// chair inside ring → bad (2.0)
assert(getZoneMultiplier(mockRing,'chair',128,128) === 2.0,
  'ring interior: chair should be 2.0, got ' + getZoneMultiplier(mockRing,'chair',128,128));

// chair at ringside (not in ring_interior) → good (0.3)
assert(getZoneMultiplier(mockRing,'chair',50,60) === SUSPICION_ZONE_GOOD_MULT,
  'ringside: chair should be 0.3, got ' + getZoneMultiplier(mockRing,'chair',50,60));

// road_case at ringside → neutral (1.0, not in believableObjects)
assert(getZoneMultiplier(mockRing,'road_case',50,60) === 1.0,
  'ringside: road_case should be 1.0 neutral, got ' + getZoneMultiplier(mockRing,'road_case',50,60));

// outside all zones → fallthrough neutral (1.0)
assert(getZoneMultiplier(mockRing,'chair',5,5) === 1.0,
  'outside zones: should fall through to 1.0');

process.stdout.write('Suspicion zone tests: ' + pass + ' passed, ' + fail + ' failed\n');
if (fail > 0) process.exit(1);
```

- [ ] **Step 3: Run the test**

```bash
node tests/suspicion.test.js
```

Expected output:
```
Suspicion zone tests: 4 passed, 0 failed
```

- [ ] **Step 4: Commit**

```bash
git add suspicion.js tests/suspicion.test.js
git commit -m "feat: add suspicion system with zone multipliers and sight-cone logic"
```

---

### Task 6: Rewrite ai.js

**Files:**
- Rewrite: `ai.js`

- [ ] **Step 1: Write new ai.js**

```js
// ai.js — Hunter state machine and ally setup movement

// ─── Hunter update (call once per frame during PHASE_HUNT) ────────
function updateHunter(hunter, dt, gs) {
  switch (hunter.state) {
    case HUNTER_ENTERING:   _hunterEntering(hunter, dt, gs);   break;
    case HUNTER_PATROLLING: _hunterPatrolling(hunter, dt, gs); break;
    case HUNTER_NOTICING:   _hunterNoticing(hunter, dt, gs);   break;
    case HUNTER_INSPECTING: _hunterInspecting(hunter, dt, gs); break;
    case HUNTER_ACCUSING:   _hunterAccusing(hunter, dt, gs);   break;
    case HUNTER_RETURNING:  _hunterReturning(hunter, dt, gs);  break;
  }
}

function _hunterEntering(hunter, dt, gs) {
  var wp = gs.room.patrolPath[0];
  if (moveToward(hunter, wp.x, wp.y, hunter.speed)) {
    hunter.state = HUNTER_PATROLLING;
    hunter.patrolIdx = 0;
  }
}

function _hunterPatrolling(hunter, dt, gs) {
  var path = gs.room.patrolPath;
  var wp   = path[hunter.patrolIdx % path.length];
  if (moveToward(hunter, wp.x, wp.y, hunter.speed)) {
    hunter.patrolIdx = (hunter.patrolIdx + 1) % path.length;
  }

  // Randomly decide to inspect something
  if (Math.random() < HUNTER_INSPECT_CHANCE) {
    var target = _pickInspectTarget(hunter, gs);
    if (target !== undefined) {
      hunter.inspectTarget = target;
      hunter.state         = HUNTER_NOTICING;
      hunter.stateTimer    = HUNTER_NOTICE_MS;
    }
  }
}

function _hunterNoticing(hunter, dt, gs) {
  hunter.stateTimer -= dt;
  // Face the target (or destination)
  var tx, ty;
  if (hunter.inspectTarget) {
    tx = hunter.inspectTarget.x + hunter.inspectTarget.width  / 2;
    ty = hunter.inspectTarget.y + hunter.inspectTarget.height / 2;
  } else {
    tx = hunter.inspectDest ? hunter.inspectDest.x : hunter.x;
    ty = hunter.inspectDest ? hunter.inspectDest.y : hunter.y;
  }
  hunter.facingAngle = Math.atan2(ty - (hunter.y + hunter.height/2), tx - (hunter.x + hunter.width/2));

  if (hunter.stateTimer <= 0) {
    // Set destination for inspection walk
    if (hunter.inspectTarget) {
      hunter.inspectDest = {
        x: hunter.inspectTarget.x + hunter.inspectTarget.width  / 2,
        y: hunter.inspectTarget.y + hunter.inspectTarget.height / 2
      };
    } else {
      // Random floor point
      hunter.inspectDest = {
        x: 40 + Math.random() * 176,
        y: UI_BAR_H + 10 + Math.random() * (CANVAS_SIZE - UI_BAR_H - 20)
      };
    }
    hunter.returnDest  = {x: hunter.x + hunter.width/2, y: hunter.y + hunter.height/2};
    hunter.state       = HUNTER_INSPECTING;
    hunter.stateTimer  = HUNTER_INSPECT_MS;
    hunter.speed       = HUNTER_INSPECT_SPEED;
  }
}

function _hunterInspecting(hunter, dt, gs) {
  var dest = hunter.inspectDest;
  var arrived = moveToward(hunter, dest.x, dest.y, hunter.speed);

  if (arrived) {
    // Pause at destination while stateTimer counts down
    hunter.stateTimer -= dt;
    if (hunter.stateTimer <= 0) {
      _evaluateInspection(hunter, gs);
    }
  }
}

function _evaluateInspection(hunter, gs) {
  var target = hunter.inspectTarget;

  if (target === gs.player && gs.player.isTransformed) {
    // Suspicion is handled by tickSuspicion; check if it's over threshold
    if (gs.suspicion >= SUSPICION_MAX) {
      hunter.state = HUNTER_ACCUSING;
      return;
    }
  }

  if (target && target !== gs.player && target.alive) {
    // Ally inspection
    if (target.badHide) {
      target.alive = false;
      gs.alliesAlive = Math.max(0, gs.alliesAlive - 1);
    }
  }

  // Return to patrol
  hunter.inspectTarget = null;
  hunter.inspectDest   = null;
  hunter.state         = HUNTER_RETURNING;
  hunter.speed         = HUNTER_PATROL_SPEED;
}

function _hunterAccusing(hunter, dt, gs) {
  // Move toward player rapidly
  var player = gs.player;
  moveToward(hunter, player.x + player.width/2, player.y + player.height/2, HUNTER_INSPECT_SPEED * 1.5);
  // Fill suspicion to max; game.js watches for suspicion >= SUSPICION_MAX
  gs.suspicion = SUSPICION_MAX;
}

function _hunterReturning(hunter, dt, gs) {
  var dest = hunter.returnDest;
  if (!dest || moveToward(hunter, dest.x, dest.y, hunter.speed)) {
    hunter.state      = HUNTER_PATROLLING;
    hunter.returnDest = null;
  }
}

// Pick a target for inspection.
// Returns: a Player, an Ally, or null (fake inspection point).
// undefined means no valid target and no inspection should start.
function _pickInspectTarget(hunter, gs) {
  var candidates = [];

  // Player if transformed
  if (gs.player.isTransformed) {
    var d = entityDist(hunter, gs.player);
    candidates.push({target: gs.player, weight: d < 80 ? 3 : 1});
  }

  // Alive allies
  for (var i = 0; i < gs.allies.length; i++) {
    if (gs.allies[i].alive) {
      candidates.push({target: gs.allies[i], weight: 1});
    }
  }

  // Null = fake inspection walk
  candidates.push({target: null, weight: 2});

  if (candidates.length === 0) return undefined;

  var total = 0;
  for (var j = 0; j < candidates.length; j++) total += candidates[j].weight;
  var r = Math.random() * total;
  var acc = 0;
  for (var k = 0; k < candidates.length; k++) {
    acc += candidates[k].weight;
    if (r <= acc) return candidates[k].target;
  }
  return null;
}

// ─── Ally setup movement (call during PHASE_SETUP) ─────────────────
// Moves ally toward its destX/destY; transforms when arrived.
function updateAllySetup(ally) {
  if (ally.isTransformed) return;
  if (moveToward(ally, ally.destX, ally.destY, ally.speed)) {
    ally.isTransformed = true;
    ally.isMoving      = false;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add ai.js
git commit -m "feat: rewrite hunter AI with 6-state inspection machine and ally setup movement"
```

---

### Task 7: Rewrite renderer.js — room, entities, screens

**Files:**
- Rewrite: `renderer.js`

- [ ] **Step 1: Write new renderer.js**

```js
// renderer.js — all canvas drawing

var _imgCache = {};

function _loadImg(src) {
  if (!_imgCache[src]) {
    var img = new Image();
    img.src = src;
    _imgCache[src] = img;
  }
  return _imgCache[src];
}

// Draws img at (x,y,w,h) if loaded; falls back to filled rect with color.
function _drawImgOrRect(ctx, src, x, y, w, h, color) {
  if (src) {
    var img = _loadImg(src);
    if (img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, x, y, w, h);
      return;
    }
  }
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// ─── Room ────────────────────────────────────────────────────────
function drawRoom(ctx, room) {
  // Background
  _drawImgOrRect(ctx, room.bgTileset, 0, 0, CANVAS_SIZE, CANVAS_SIZE, room.bgColor);

  // Static props (decorative; drawn over tileset)
  // Only draw if tileset NOT loaded (avoid double-drawing on clean tilesets)
  var img = room.bgTileset ? _loadImg(room.bgTileset) : null;
  var tilesetLoaded = img && img.complete && img.naturalWidth > 0;
  if (!tilesetLoaded) {
    var props = room.staticProps;
    for (var i = 0; i < props.length; i++) {
      var p = props[i];
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.w, p.h);
    }
  }
}

// ─── Entities ────────────────────────────────────────────────────
function drawPlayer(ctx, player) {
  if (!player.alive) return;
  var x = Math.round(player.x);
  var y = Math.round(player.y);

  if (player.isTransformed) {
    var obj = OBJECTS[player.objIdx];
    _drawImgOrRect(ctx, obj.sprite, x, y, obj.w, obj.h, obj.color);
    // Faint team-color border to indicate it's the player
    ctx.strokeStyle = player.team.color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, obj.w, obj.h);
  } else {
    ctx.fillStyle = player.team.color;
    ctx.fillRect(x, y, player.width, player.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '5px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText(player.char.label, x + player.width/2, y + player.height/2 + 2);
  }
}

function drawHunter(ctx, hunter) {
  var x = Math.round(hunter.x);
  var y = Math.round(hunter.y);
  ctx.fillStyle = hunter.team.color;
  ctx.fillRect(x, y, hunter.width, hunter.height);
  ctx.fillStyle = '#ffffff';
  ctx.font = '5px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('H', x + hunter.width/2, y + hunter.height/2 + 2);

  // "?" indicator during NOTICING
  if (hunter.state === HUNTER_NOTICING) {
    ctx.fillStyle = '#ffff00';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('?', x + hunter.width/2, y - 3);
  }
}

function drawAlly(ctx, ally) {
  if (!ally.alive) return;
  var x = Math.round(ally.x);
  var y = Math.round(ally.y);

  if (ally.isTransformed) {
    var obj = OBJECTS[ally.objIdx];
    ctx.globalAlpha = 0.6;
    _drawImgOrRect(ctx, obj.sprite, x, y, obj.w, obj.h, obj.color);
    ctx.globalAlpha = 1.0;
  } else {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = ally.team.color;
    ctx.fillRect(x, y, ally.width, ally.height);
    ctx.globalAlpha = 1.0;
  }
}

// ─── UI overlay (drawn on top every frame) ───────────────────────
function drawUI(ctx, gs) {
  // Top bar background
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(0, 0, CANVAS_SIZE, UI_BAR_H);

  // Phase label
  ctx.fillStyle = gs.phase === PHASE_SETUP ? '#44ff44' : '#ff4444';
  ctx.font = '5px "Press Start 2P"';
  ctx.textAlign = 'left';
  ctx.fillText(gs.phase === PHASE_SETUP ? 'SETUP' : 'HUNT', 3, 13);

  // Timer
  var timerMs  = gs.phase === PHASE_SETUP ? gs.setupTimer : gs.huntTimer;
  var timerSec = Math.ceil(timerMs / 1000);
  ctx.fillStyle = timerSec <= 10 ? '#ff4444' : '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(timerSec + 's', CANVAS_SIZE / 2, 13);

  // Suspicion bar (right side)
  var barW  = 60;
  var barH  = 7;
  var barX  = CANVAS_SIZE - barW - 3;
  var barY  = 6;
  var pct   = gs.suspicion / SUSPICION_MAX;
  ctx.fillStyle = '#333333';
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = pct > 0.7 ? '#ff2222' : pct > 0.4 ? '#ffaa00' : '#22cc22';
  ctx.fillRect(barX, barY, Math.round(barW * pct), barH);
  ctx.strokeStyle = '#888888';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(barX, barY, barW, barH);

  // Current object name (bottom strip during gameplay)
  if (gs.screen === SCREEN_GAMEPLAY) {
    var obj = OBJECTS[gs.player.objIdx];
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, CANVAS_SIZE - 12, CANVAS_SIZE, 12);
    ctx.fillStyle = '#cccccc';
    ctx.font = '4px "Press Start 2P"';
    ctx.textAlign = 'center';
    var prefix = gs.player.isTransformed ? '[DISGUISED]' : '[SPACE to disguise]';
    ctx.fillText(prefix + ' ' + (gs.player.objIdx + 1) + ':' + obj.label, CANVAS_SIZE/2, CANVAS_SIZE - 3);
  }
}

// ─── Mini-map ────────────────────────────────────────────────────
function drawMiniMap(ctx, gs) {
  var mx = CANVAS_SIZE - MINIMAP_W - 3;
  var my = CANVAS_SIZE - MINIMAP_H - 14;  // above bottom strip

  // Background
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(mx, my, MINIMAP_W, MINIMAP_H);
  ctx.strokeStyle = '#555555';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(mx, my, MINIMAP_W, MINIMAP_H);

  var scaleX = MINIMAP_W / CANVAS_SIZE;
  var scaleY = MINIMAP_H / CANVAS_SIZE;

  function dot(entity, color, alpha) {
    var dx = mx + (entity.x + entity.width/2)  * scaleX;
    var dy = my + (entity.y + entity.height/2) * scaleY;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(dx - 1, dy - 1, 2, 2);
    ctx.globalAlpha = 1;
  }

  // Hunter
  if (gs.hunter) dot(gs.hunter, gs.hunter.team.color, 1.0);

  // Allies
  for (var i = 0; i < gs.allies.length; i++) {
    if (gs.allies[i].alive) dot(gs.allies[i], gs.player.team.color, 0.6);
  }

  // Player dot — visible during setup only
  if (gs.phase === PHASE_SETUP) {
    dot(gs.player, gs.player.team.color, 1.0);
  }
}

// ─── Screen renderers ────────────────────────────────────────────
function drawTitle(ctx, gs) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('HIDE', CANVAS_SIZE/2, 80);
  ctx.font = '5px "Press Start 2P"';
  ctx.fillStyle = '#888888';
  ctx.fillText('A top-down disguise game', CANVAS_SIZE/2, 100);
  var blink = Math.floor(Date.now() / 500) % 2 === 0;
  if (blink) {
    ctx.fillStyle = '#ffffff';
    ctx.fillText('PRESS ENTER', CANVAS_SIZE/2, 160);
  }
}

function drawTeamSelect(ctx, gs) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = '#ffffff';
  ctx.font = '6px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('SELECT TEAM', CANVAS_SIZE/2, 30);

  var teams = gs.teamData;
  for (var i = 0; i < teams.length; i++) {
    var tx = i === 0 ? 64 : 192;
    var selected = gs.selTeamIdx === i;
    ctx.fillStyle = selected ? teams[i].color : '#444444';
    ctx.fillRect(tx - 40, 60, 80, 80);
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px "Press Start 2P"';
    ctx.fillText(teams[i].name, tx, 108);
    if (selected) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(tx - 42, 58, 84, 84);
    }
  }

  ctx.fillStyle = '#888888';
  ctx.font = '4px "Press Start 2P"';
  ctx.fillText('A/D to choose  ENTER to confirm', CANVAS_SIZE/2, 200);
}

function drawCharSelect(ctx, gs) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  var team = gs.teamData[gs.selTeamIdx];
  ctx.fillStyle = team.color;
  ctx.font = '6px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText(team.name, CANVAS_SIZE/2, 24);

  var chars = team.characters;
  for (var i = 0; i < chars.length; i++) {
    var col = i % 2;
    var row = Math.floor(i / 2);
    var cx  = 64 + col * 128;
    var cy  = 50 + row * 80;
    var sel = gs.selCharIdx === i;
    ctx.fillStyle = sel ? team.color : '#333333';
    ctx.fillRect(cx - 30, cy, 60, 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText(chars[i].label, cx, cy + 30);
    ctx.font = '4px "Press Start 2P"';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText('SPD:' + (chars[i].speedMult * 10 | 0), cx - 14, cy + 44);
    ctx.fillText('HID:' + (chars[i].hideMult  * 10 | 0), cx + 14, cy + 44);
    if (sel) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - 31, cy - 1, 62, 52);
    }
  }

  ctx.fillStyle = '#888888';
  ctx.font = '4px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('W/S choose  ENTER confirm', CANVAS_SIZE/2, 226);
}

function drawRoomIntro(ctx, gs) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = '#ffffff';
  ctx.font = '8px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText(gs.room.label.toUpperCase(), CANVAS_SIZE/2, CANVAS_SIZE/2 - 8);
  ctx.font = '5px "Press Start 2P"';
  ctx.fillStyle = '#888888';
  ctx.fillText('Get ready...', CANVAS_SIZE/2, CANVAS_SIZE/2 + 10);
}

function drawGameplay(ctx, gs) {
  drawRoom(ctx, gs.room);
  for (var i = 0; i < gs.allies.length; i++) drawAlly(ctx, gs.allies[i]);
  // Hunter is hidden during setup — it waits off-screen at hunterEntry
  if (gs.hunter && gs.phase === PHASE_HUNT) drawHunter(ctx, gs.hunter);
  drawPlayer(ctx, gs.player);
  drawUI(ctx, gs);
  drawMiniMap(ctx, gs);
}

function drawWin(ctx, gs) {
  drawRoom(ctx, gs.room);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = '#44ff44';
  ctx.font = '8px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('SURVIVED!', CANVAS_SIZE/2, 80);
  ctx.fillStyle = '#ffffff';
  ctx.font = '6px "Press Start 2P"';
  ctx.fillText('SCORE: ' + gs.score, CANVAS_SIZE/2, 110);
  ctx.font = '4px "Press Start 2P"';
  ctx.fillStyle = '#aaaaaa';
  ctx.fillText('PRESS R TO PLAY AGAIN', CANVAS_SIZE/2, 180);
}

function drawGameOver(ctx, gs) {
  drawRoom(ctx, gs.room);
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = '#ff2222';
  ctx.font = '8px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('YOU WERE FOUND', CANVAS_SIZE/2, 80);
  ctx.fillStyle = '#888888';
  ctx.font = '4px "Press Start 2P"';
  ctx.fillText('PRESS R TO TRY AGAIN', CANVAS_SIZE/2, 180);
}

// ─── Main render dispatch ─────────────────────────────────────────
function drawFrame(ctx, gs) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  switch (gs.screen) {
    case SCREEN_TITLE:      drawTitle(ctx, gs);      break;
    case SCREEN_TEAM:       drawTeamSelect(ctx, gs); break;
    case SCREEN_CHAR:       drawCharSelect(ctx, gs); break;
    case SCREEN_ROOM_INTRO: drawRoomIntro(ctx, gs);  break;
    case SCREEN_GAMEPLAY:   drawGameplay(ctx, gs);   break;
    case SCREEN_WIN:        drawWin(ctx, gs);        break;
    case SCREEN_GAMEOVER:   drawGameOver(ctx, gs);   break;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add renderer.js
git commit -m "feat: rewrite renderer for disguise game — rooms, entities, UI, mini-map, all screens"
```

---

### Task 8: Rewrite game.js — full game loop

**Files:**
- Rewrite: `game.js`

- [ ] **Step 1: Write new game.js**

```js
// game.js — GameState, main loop, input, round management

// ─── Parse team data ──────────────────────────────────────────────
var RAW_TEAMS = JSON.parse(document.getElementById('teams-data').textContent);

// ─── GameState ────────────────────────────────────────────────────
var gs = {
  screen:     SCREEN_TITLE,
  phase:      null,

  // Select screen
  teamData:    RAW_TEAMS.teams,
  selTeamIdx:  0,
  selCharIdx:  0,

  // Round
  room:        null,
  player:      null,
  hunter:      null,
  allies:      [],
  alliesAlive: 0,

  // Timers (ms)
  setupTimer: 0,
  huntTimer:  0,
  introTimer: 0,

  // Suspicion
  suspicion: 0,

  // Scoring
  score: 0,

  // Input
  keys: {},
  audioStarted: false
};

// ─── Input ────────────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  gs.keys[e.code] = true;
  if (e.code === 'KeyM') toggleMute();

  if (gs.screen === SCREEN_TITLE) {
    if (!gs.audioStarted) { initAudio(); playMusic('menu'); gs.audioStarted = true; }
    if (e.code === 'Enter') gs.screen = SCREEN_TEAM;
    return;
  }

  if (gs.screen === SCREEN_TEAM) {
    var tLen = gs.teamData.length;
    if (e.code === 'ArrowLeft'  || e.code === 'KeyA') gs.selTeamIdx = (gs.selTeamIdx - 1 + tLen) % tLen;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') gs.selTeamIdx = (gs.selTeamIdx + 1) % tLen;
    if (e.code === 'Enter') { gs.selCharIdx = 0; gs.screen = SCREEN_CHAR; }
    return;
  }

  if (gs.screen === SCREEN_CHAR) {
    var cLen = gs.teamData[gs.selTeamIdx].characters.length;
    if (e.code === 'ArrowUp'   || e.code === 'KeyW') gs.selCharIdx = (gs.selCharIdx - 1 + cLen) % cLen;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') gs.selCharIdx = (gs.selCharIdx + 1) % cLen;
    if (e.code === 'Enter') startRound();
    return;
  }

  if (gs.screen === SCREEN_WIN || gs.screen === SCREEN_GAMEOVER) {
    if (e.code === 'KeyR' || e.code === 'Enter') {
      gs.screen = SCREEN_TITLE;
      gs.selTeamIdx = 0;
      gs.selCharIdx = 0;
    }
    return;
  }

  if (gs.screen === SCREEN_GAMEPLAY) {
    // Transform / untransform
    if (e.code === 'Space') {
      handleTransformToggle();
      e.preventDefault();
    }
    // Cycle object
    if (e.code === 'KeyQ') cycleObject(-1);
    if (e.code === 'KeyE') cycleObject(1);
    // Number keys 1–8
    if (e.code.startsWith('Digit')) {
      var n = parseInt(e.code.replace('Digit', ''), 10);
      if (n >= 1 && n <= OBJECTS.length) setObject(n - 1);
    }
  }
});

document.addEventListener('keyup', function(e) { gs.keys[e.code] = false; });

// ─── Transform helpers ────────────────────────────────────────────
function handleTransformToggle() {
  var player = gs.player;
  if (!player.alive) return;

  if (player.isTransformed) {
    player.isTransformed = false;
    // Penalty for retransforming during hunt
    if (gs.phase === PHASE_HUNT) {
      gs.suspicion = Math.min(SUSPICION_MAX, gs.suspicion + SUSPICION_RETRANSFORM);
      player.retransformed = true;
    }
  } else {
    player.isTransformed = true;
  }
}

function cycleObject(dir) {
  if (gs.player.isTransformed) return; // locked while transformed
  setObject((gs.player.objIdx + dir + OBJECTS.length) % OBJECTS.length);
}

function setObject(idx) {
  if (gs.player.isTransformed) return;
  gs.player.objIdx = idx;
}

// ─── Round init ───────────────────────────────────────────────────
function startRound() {
  // Pick random room
  var roomId = ROOM_IDS[Math.floor(Math.random() * ROOM_IDS.length)];
  gs.room = ROOMS[roomId];

  // Teams
  var playerTeam  = gs.teamData[gs.selTeamIdx];
  var playerChar  = playerTeam.characters[gs.selCharIdx];
  var hunterTeam  = gs.teamData[1 - gs.selTeamIdx]; // opposing team

  // Player
  gs.player = new Player(playerTeam, playerChar);
  gs.player.x = gs.room.playerSpawn.x - gs.player.width  / 2;
  gs.player.y = gs.room.playerSpawn.y - gs.player.height / 2;
  clampToField(gs.player);

  // Hunter (created but placed off-screen; enters during hunt phase)
  gs.hunter = new Hunter(hunterTeam, gs.room);

  // Allies
  gs.allies = [];
  var spawns = gs.room.allySpawns;
  for (var i = 0; i < spawns.length && i < 2; i++) {
    var ally = new Ally(playerTeam, spawns[i]);
    // Pick a random object and believable zone destination
    ally.objIdx = Math.floor(Math.random() * OBJECTS.length);
    var dest = pickAllyDest(ally, gs.room);
    ally.destX = dest.x;
    ally.destY = dest.y;
    gs.allies.push(ally);
  }
  gs.alliesAlive = gs.allies.length;

  // Reset state
  gs.suspicion  = 0;
  gs.score      = 0;
  gs.setupTimer = SETUP_TIMER * 1000;
  gs.huntTimer  = HUNT_TIMER  * 1000;
  gs.introTimer = ROOM_INTRO_MS;
  gs.phase      = null;

  playMusic('gameplay');
  gs.screen = SCREEN_ROOM_INTRO;
}

// Pick a destination pixel inside a believable zone for ally's object.
// Falls back to allySpawn if no zone matches.
function pickAllyDest(ally, room) {
  var obj     = OBJECTS[ally.objIdx];
  var zones   = room.zones;
  var matches = [];
  for (var i = 0; i < zones.length; i++) {
    if (zones[i].believableObjects.indexOf(obj.id) !== -1) {
      matches.push(zones[i]);
    }
  }
  if (matches.length === 0) return {x: ally.x + ally.width/2, y: ally.y + ally.height/2};
  var z = matches[Math.floor(Math.random() * matches.length)];
  var px = z.x + 4 + Math.random() * Math.max(0, z.w - 8);
  var py = z.y + 4 + Math.random() * Math.max(0, z.h - 8);
  return {x: Math.round(px), y: Math.round(py)};
}

// ─── Player movement ──────────────────────────────────────────────
function updatePlayer(dt) {
  var p = gs.player;
  p.isMoving = false;
  var dx = 0, dy = 0;
  if (gs.keys['ArrowLeft']  || gs.keys['KeyA']) dx -= p.speed;
  if (gs.keys['ArrowRight'] || gs.keys['KeyD']) dx += p.speed;
  if (gs.keys['ArrowUp']    || gs.keys['KeyW']) dy -= p.speed;
  if (gs.keys['ArrowDown']  || gs.keys['KeyS']) dy += p.speed;

  if (dx !== 0 || dy !== 0) {
    if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
    p.facingAngle = Math.atan2(dy, dx);
    p.x += dx; p.y += dy;
    p.isMoving = true;
    clampToField(p);
  }
}

// ─── Phase updates ────────────────────────────────────────────────
function updateSetup(dt) {
  gs.setupTimer -= dt;
  updatePlayer(dt);

  // Ally movement during setup
  for (var i = 0; i < gs.allies.length; i++) {
    updateAllySetup(gs.allies[i]);
  }

  if (gs.setupTimer <= 0) {
    gs.phase = PHASE_HUNT;
    gs.huntTimer = HUNT_TIMER * 1000;
  }
}

function updateHunt(dt) {
  gs.huntTimer -= dt;
  updatePlayer(dt);
  if (gs.hunter) updateHunter(gs.hunter, dt, gs);
  tickSuspicion(dt, gs);

  // Win
  if (gs.huntTimer <= 0) {
    endRound(true);
    return;
  }
  // Lose
  if (gs.suspicion >= SUSPICION_MAX) {
    endRound(false);
  }
}

function endRound(survived) {
  if (survived) {
    // Calculate score
    var s = SCORE_BASE;
    var secondsSurvived = Math.round((HUNT_TIMER * 1000 - gs.huntTimer) / 1000);
    s += secondsSurvived * SCORE_PER_SECOND;
    s += gs.alliesAlive * SCORE_ALLY_BONUS;
    if (!gs.player.movedWhileTransformed)  s += SCORE_STILL_BONUS;
    if (!gs.player.retransformed)          s += SCORE_NO_RETRANSFORM;
    if (gs.player.wasInGoodZone)           s += SCORE_GOOD_ZONE_BONUS;
    gs.score = s;
    playMusic('win');
    gs.screen = SCREEN_WIN;
  } else {
    gs.score  = 0;
    playMusic('gameover');
    gs.screen = SCREEN_GAMEOVER;
  }
}

// ─── Main loop ────────────────────────────────────────────────────
var canvas = document.getElementById('gameCanvas');
var ctx    = canvas.getContext('2d');

// 3× CSS scale
canvas.style.width  = (CANVAS_SIZE * 3) + 'px';
canvas.style.height = (CANVAS_SIZE * 3) + 'px';

var _lastTime = 0;

function loop(ts) {
  var dt = Math.min(ts - _lastTime, 50); // cap at 50ms / ~20fps minimum
  _lastTime = ts;

  // Screen transitions that need timer ticks
  if (gs.screen === SCREEN_ROOM_INTRO) {
    gs.introTimer -= dt;
    if (gs.introTimer <= 0) {
      gs.phase = PHASE_SETUP;
      gs.screen = SCREEN_GAMEPLAY;
    }
  }

  if (gs.screen === SCREEN_GAMEPLAY) {
    if      (gs.phase === PHASE_SETUP) updateSetup(dt);
    else if (gs.phase === PHASE_HUNT)  updateHunt(dt);
  }

  drawFrame(ctx, gs);
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
```

- [ ] **Step 2: Start server and smoke-test the full flow**

```bash
python3 -m http.server 8181
```

Open http://localhost:8181 and verify:
1. Title screen renders with "HIDE" and blinking "PRESS ENTER"
2. Enter → Team select shows Team A (red) and Team B (blue)
3. A/D cycles between teams; Enter → Character select
4. W/S cycles characters; Enter → Room intro (room name shown for ~1.5s)
5. Gameplay screen: player appears as team-colored square at spawn point
6. WASD moves player; player is clamped to playfield
7. Setup timer counts down from 10 in top-center
8. Space transforms player into selected object (colored rect)
9. Q/E cycles object; 1–8 selects object; Space untransforms
10. After 10s, HUNT label appears and hunt timer starts
11. Hunter appears from entry point and patrols room
12. Suspicion bar visible; moves if player walks while transformed
13. After 45s: "SURVIVED!" screen with score
14. Standing in ring center while transformed fills suspicion faster; if it hits 100: "YOU WERE FOUND"
15. R returns to title

- [ ] **Step 3: Commit**

```bash
git add game.js
git commit -m "feat: rewrite game loop — full round flow, phases, input, scoring, win/loss"
```

---

### Task 9: Rewrite README.md

**Files:**
- Rewrite: `README.md`

- [ ] **Step 1: Write new README.md**

```markdown
# Hide

A top-down object-disguise game. You are a member of a rival team trying to avoid detection by hiding as backstage props.

## How to Play

A round begins in a random venue room. You have **10 seconds** to pick a disguise and position yourself somewhere believable. Then hunters enter and search. Survive **45 seconds** without being found.

### Controls

| Key | Action |
|-----|--------|
| WASD / Arrow keys | Move |
| Space | Transform / Untransform |
| Q / E | Cycle disguise |
| 1–8 | Select disguise directly |
| R | Restart after win/loss |
| M | Mute/unmute |

### Round Flow

1. Pick your team (A or B)
2. Pick your character
3. Room loads — you have 10 seconds to get into position
4. Hunter enters and searches for 45 seconds
5. Survive → score. Get caught → try again.

## Disguise Objects

| # | Object | Best Rooms |
|---|--------|------------|
| 1 | Folding Chair | Ring area, Locker room |
| 2 | Road Case | Backstage, Entrance, Storage |
| 3 | Crate | Storage, Backstage |
| 4 | Trash Can | Locker room, Backstage |
| 5 | Merch Box | Merch area, Storage |
| 6 | Mic Stand | Ring area, Entrance |
| 7 | Ladder | Ring area, Storage |
| 8 | Curtain Bundle | Entrance, Backstage |

## Suspicion Rules

The suspicion meter (top-right bar) fills if:
- You move while disguised and the hunter can see you
- You are disguised in the wrong place for that object
- The hunter stops to inspect your object

It drains if:
- You stay still
- The hunter is far away

If it hits 100 → **YOU WERE FOUND**. Reach 0 on the hunt timer → **SURVIVED**.

## Scoring

| Bonus | Points |
|-------|--------|
| Survival | 100 |
| Per second survived | +2 |
| Per surviving ally | +10 |
| Never moved while disguised | +25 |
| Never changed disguise during hunt | +15 |
| Good hiding spot | +20 |

## Run Locally

```bash
python3 -m http.server 8181
# open http://localhost:8181
```

No build step. No npm. Static files.

## Deploy

Push to `master`. GitHub Pages serves from the repo root.

## Future Expansions

- 4×4 venue grid (multi-room navigation)
- More characters with unique abilities
- Sprite artwork for objects and characters
- Sound effects
- Multiple hunters
- Room-specific hazards (lighting rigs, cameras)
- Unlockable disguise objects
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for object-disguise game pivot"
```

---

### Acceptance Test

After all tasks, run the full acceptance test:

```bash
python3 -m http.server 8181
```

Open http://localhost:8181 and verify each item:

- [ ] Can pick Team A and character A1
- [ ] Room spawns correctly with the room's name shown briefly
- [ ] Player moves with WASD during setup
- [ ] Q/E cycles through all 8 disguise names in bottom bar
- [ ] Space transforms player into the object shape/sprite
- [ ] Space again untransforms (suspicion penalty during hunt)
- [ ] Setup timer counts down; HUNT phase starts automatically at 0
- [ ] Hunter appears from entry point and patrols
- [ ] Suspicion bar stays low when player is still in a good zone
- [ ] Suspicion rises when player moves while transformed inside hunter sight cone
- [ ] Suspicion rises faster in ring center (ring_area) vs ringside
- [ ] Hunter occasionally walks toward transformed entities and pauses
- [ ] Suspicion reaching 100 → GAMEOVER screen
- [ ] Surviving 45s → WIN screen with score
- [ ] R restarts back to title
- [ ] M mutes/unmutes music

```bash
node tests/suspicion.test.js
```

Expected: `Suspicion zone tests: 4 passed, 0 failed`
