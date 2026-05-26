// ─────────────────────────────────────────────────────────────────
// game.js — GameState, main loop, input, screen transitions, scoring
// Depends on: constants.js, world.js, entities.js, ai.js, renderer.js
// ─────────────────────────────────────────────────────────────────

// ─── Parse embedded JSON once ─────────────────────────────────────
var RAW_WRESTLERS = JSON.parse(document.getElementById('wrestlers-data').textContent);
var RAW_ROOMS     = JSON.parse(document.getElementById('rooms-data').textContent);

// ─── GameState ────────────────────────────────────────────────────
var gs = {
  screen:         SCREEN_LOADING,

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

// ─── Animation helpers ────────────────────────────────────────────
// Maps facingAngle (radians, atan2 convention) to sprite sheet row:
// 0=down, 1=left, 2=right, 3=up
function angleToDir(angle) {
  var PI4 = Math.PI / 4;
  if (angle > -PI4   && angle <= PI4)      return 2; // right
  if (angle > PI4    && angle <= 3 * PI4)  return 0; // down
  if (angle > -3*PI4 && angle <= -PI4)     return 3; // up
  return 1;                                           // left
}

// Advances animFrame when moving; snaps to frame 0 when still.
// Updates facingRight when direction is left or right (persists through up/down).
function tickAnim(entity, dt, frameMs) {
  entity.animDir = angleToDir(entity.facingAngle);
  if (entity.animDir === 2) entity.facingRight = true;
  if (entity.animDir === 1) entity.facingRight = false;
  if (!entity.isMoving) {
    entity.animFrame = 0;
    entity.animTimer = frameMs;
    return;
  }
  entity.animTimer -= dt;
  if (entity.animTimer <= 0) {
    entity.animFrame  = (entity.animFrame + 1) % WALK_FRAMES;
    entity.animTimer += frameMs;
  }
}

// ─── Player movement ──────────────────────────────────────────────
function updatePlayer(dt) {
  var player = gs.player;
  player.isMoving = false;
  if (player.isHidden) return; // movement locked while hiding

  var dx = 0;
  var dy = 0;

  if (gs.keys['ArrowLeft']  || gs.keys['KeyA']) { dx -= player.speed; }
  if (gs.keys['ArrowRight'] || gs.keys['KeyD']) { dx += player.speed; }
  if (gs.keys['ArrowUp']    || gs.keys['KeyW']) { dy -= player.speed; }
  if (gs.keys['ArrowDown']  || gs.keys['KeyS']) { dy += player.speed; }

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

  var midTileCol = Math.floor((player.x + player.width  / 2) / TILE_SIZE);
  var midTileRow = Math.floor((player.y + player.height / 2) / TILE_SIZE);

  if (player.x <= 0 &&
      player.room.isPassable(0, midTileRow)) {
    newCol--;
    newX    = CANVAS_SIZE - player.width - 1;
    crossed = true;
  } else if (player.x + player.width >= CANVAS_SIZE &&
             player.room.isPassable(SCREEN_TILES - 1, midTileRow)) {
    newCol++;
    newX    = 1;
    crossed = true;
  } else if (player.y <= 0 &&
             player.room.isPassable(midTileCol, 0)) {
    newRow--;
    newY    = CANVAS_SIZE - player.height - 1;
    crossed = true;
  } else if (player.y + player.height >= CANVAS_SIZE &&
             player.room.isPassable(midTileCol, SCREEN_TILES - 1)) {
    newRow++;
    newY    = 1;
    crossed = true;
  }

  if (!crossed) return;

  var destRoom = gs.grid.getRoom(newCol, newRow);
  if (!destRoom) return;

  player.screenCol = newCol;
  player.screenRow = newRow;
  player.room      = destRoom;
  player.x         = newX;
  player.y         = newY;

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

  // Tick animations
  tickAnim(gs.player, dt, ANIM_WALK_FRAME_MS);

  for (var ei = 0; ei < gs.enemies.length; ei++) {
    gs.enemies[ei].isMoving = true;
    tickAnim(gs.enemies[ei], dt, ANIM_ENEMY_FRAME_MS);
  }

  for (var ali = 0; ali < gs.allies.length; ali++) {
    var alEnt = gs.allies[ali];
    alEnt.isMoving = (alEnt.state === STATE_WANDERING || alEnt.state === STATE_FLEEING);
    tickAnim(alEnt, dt, ANIM_WALK_FRAME_MS);
  }
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

  if (gs.screen === SCREEN_LOADING) {
    if (assetsReady()) {
      gs.screen = SCREEN_TITLE;
    }
  } else if (gs.screen === SCREEN_GAMEPLAY) {
    // Tick timer
    gs.roundTimer -= dt;

    if (gs.roundTimer <= 0) {
      // Win!
      gs.roundTimer = 0;
      gs.score += gs.alliesAlive * SCORE_PER_ALLY;
      if (gs.alliesAlive === ALLY_COUNT) {
        gs.score += SCORE_FULL_SURVIVAL;
      }
      gs.score  = Math.floor(gs.score);
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

// ─── Canvas setup — integer scale, DPR-aware ──────────────────────
(function setupCanvas() {
  var canvas = document.getElementById('gameCanvas');
  var dpr    = window.devicePixelRatio || 1;
  var css    = Math.min(window.innerWidth, window.innerHeight);
  RENDER_SCALE = Math.max(1, Math.floor(css * dpr / CANVAS_SIZE));
  var phys   = CANVAS_SIZE * RENDER_SCALE;
  canvas.width  = phys;
  canvas.height = phys;
  canvas.style.width  = (phys / dpr) + 'px';
  canvas.style.height = (phys / dpr) + 'px';
})();

// ─── Boot ─────────────────────────────────────────────────────────
requestAnimationFrame(function(ts) {
  lastTime = ts;
  gameLoop(ts);
});
