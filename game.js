var gs = {
  screen:       SCREEN_TITLE,
  player:       null,
  gm:           null,
  currentFloor: 0,
  keys:         {},
  mouseRotate:  0,
  pickupFlash:  0,
  flickerAmt:   0,
  flickerTimer: 0,
  showMap:          false,
  mapUsedThisFloor: false,
  mapTimeLeft:      0,
  audioReady:       false,
};

// ── Input ─────────────────────────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  gs.keys[e.code] = true;

  if (e.code === 'KeyM') toggleMute();

  if (gs.screen === SCREEN_TITLE) {
    if (!gs.audioReady) { initAudio(); gs.audioReady = true; }
    playTrack('menu');
    if (e.code === 'Enter' || e.code === 'Space') {
      // Defer game track by one frame so the menu play() promise resolves first
      setTimeout(startGame, 0);
    }
    return;
  }

  if (gs.screen === SCREEN_GAMEOVER || gs.screen === SCREEN_WIN) {
    if (e.code === 'KeyR' || e.code === 'Enter') {
      gs.screen = SCREEN_TITLE;
      _fullReset();
      if (!gs.audioReady) { initAudio(); gs.audioReady = true; }
      playTrack('menu');
    }
    return;
  }

  if (gs.screen === SCREEN_PLAY) {
    if (e.code === 'Tab')  { e.preventDefault(); }
    if (e.code === 'KeyF' || e.code === 'Space') { tryCollect(); tryUseExit(); e.preventDefault(); }
    if (e.code === 'Escape') document.exitPointerLock && document.exitPointerLock();
  }
});

document.addEventListener('keyup', function(e) { gs.keys[e.code] = false; });

var canvas = document.getElementById('gameCanvas');
canvas.addEventListener('click', function() {
  if (gs.screen === SCREEN_PLAY) canvas.requestPointerLock();
});
document.addEventListener('mousemove', function(e) {
  if (document.pointerLockElement === canvas && gs.screen === SCREEN_PLAY)
    gs.mouseRotate += e.movementX * MOUSE_SENSITIVITY;
});

// ── Start / reset ─────────────────────────────────────────────────────────────
function startGame() {
  _fullReset();
  gs.screen = SCREEN_PLAY;
  if (!gs.audioReady) { initAudio(); gs.audioReady = true; }
  playTrack('play');
}

function _fullReset() {
  for (var f = 0; f < FLOOR_COLLECTED.length; f++)
    for (var p = 0; p < FLOOR_COLLECTED[f].length; p++)
      FLOOR_COLLECTED[f][p] = false;

  gs.currentFloor = 0;
  switchToFloor(0);
  gs.player       = makePlayer();
  gs.gm           = makeGM();
  gs.pickupFlash      = 0;
  gs.luckyFlash       = 0;
  gs.flickerAmt       = 0;
  gs.showMap          = false;
  gs.mapUsedThisFloor = false;
  gs.mapTimeLeft      = 0;
}

// ── Lucky warp ────────────────────────────────────────────────────────────────
function _gmLuckyWarp(gm, playerFloor) {
  // Pick a floor that isn't the player's current floor
  var candidates = [];
  for (var f = 0; f < FLOORS.length; f++) {
    if (f !== playerFloor) candidates.push(f);
  }
  var dest = candidates[Math.floor(Math.random() * candidates.length)];
  var spawn = FLOORS[dest].gmPatrol[0];
  gm.floor       = dest;
  gm.x           = spawn.x;
  gm.y           = spawn.y;
  gm.state       = 'patrol';
  gm.path        = null;
  gm.pathIdx     = 0;
  gm.lostSightMs = 0;
  gm.searchMs    = 0;
  gm.floorChangeMs = GM_FLOOR_CHANGE_MS;
}

// ── Collect ───────────────────────────────────────────────────────────────────
function tryCollect() {
  var idx = _nearestProgram(gs.player);
  if (idx === null) return;
  collectProgram(idx);
  gs.pickupFlash = 300;
}

// ── Floor exits ───────────────────────────────────────────────────────────────
function tryUseExit() {
  var exits = FLOORS[gs.currentFloor].exits;
  for (var i = 0; i < exits.length; i++) {
    var ex = exits[i];
    if (dist2d(gs.player.x, gs.player.y, ex.x + 0.5, ex.y + 0.5) < EXIT_DIST) {
      _changeFloor(ex.toFloor);
      return;
    }
  }
  // Front-door escape (floor 0 only)
  if (gs.currentFloor === 0 && totalCollected() === totalPrograms()) {
    if (dist2d(gs.player.x, gs.player.y, EXIT.x, EXIT.y) < EXIT_DIST) {
      playTrack('win');
      gs.screen = SCREEN_WIN;
    }
  }
}

function _changeFloor(toFloor) {
  gs.currentFloor = toFloor;
  switchToFloor(toFloor);
  var s = FLOORS[toFloor].playerStart;
  gs.player.x     = s.x;   gs.player.y     = s.y;
  gs.player.dirX  = s.dirX; gs.player.dirY  = s.dirY;
  gs.player.planeX = s.planeX; gs.player.planeY = s.planeY;
  gs.showMap          = false;
  gs.mapUsedThisFloor = false;
  gs.mapTimeLeft      = 0;
}

// ── Main loop ─────────────────────────────────────────────────────────────────
var ctx = canvas.getContext('2d');
var DPR = window.devicePixelRatio || 1;
canvas.width  = Math.round(CANVAS_W * DPR);
canvas.height = Math.round(CANVAS_H * DPR);
canvas.style.width  = (CANVAS_W * CSS_SCALE) + 'px';
canvas.style.height = (CANVAS_H * CSS_SCALE) + 'px';
ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
ctx.imageSmoothingEnabled = false;

var _lastTime = 0;

function loop(ts) {
  var dt = Math.min(ts - _lastTime, 50);
  _lastTime = ts;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  if (gs.screen === SCREEN_TITLE)    { drawTitle(ctx);    requestAnimationFrame(loop); return; }
  if (gs.screen === SCREEN_GAMEOVER) { drawGameOver(ctx); requestAnimationFrame(loop); return; }
  if (gs.screen === SCREEN_WIN)      { drawWin(ctx);      requestAnimationFrame(loop); return; }

  var p = gs.player;

  // Input
  var fwd = 0, strafe = 0, rot = 0;
  var shift = gs.keys['ShiftLeft'] || gs.keys['ShiftRight'];
  if (gs.keys['ArrowUp']    || gs.keys['KeyW']) fwd = 1;
  if (gs.keys['ArrowDown']  || gs.keys['KeyS']) fwd = -1;
  if (shift) {
    if (gs.keys['ArrowLeft'])  rot    = -1;
    if (gs.keys['ArrowRight']) rot    =  1;
  } else {
    if (gs.keys['ArrowLeft'])  strafe = -1;
    if (gs.keys['ArrowRight']) strafe =  1;
  }
  if (gs.keys['KeyQ'])       rot    = -1;
  if (gs.keys['KeyE'])       rot    =  1;
  if (shift) {
    if (gs.keys['KeyA']) rot    = -1;
    if (gs.keys['KeyD']) rot    =  1;
  } else {
    if (gs.keys['KeyA']) strafe = -1;
    if (gs.keys['KeyD']) strafe =  1;
  }

  movePlayer(p, fwd, strafe, dt);
  var totalRot = rot * PLAYER_ROT_SPEED + gs.mouseRotate;
  if (totalRot !== 0) rotatePlayer(p, totalRot);
  gs.mouseRotate = 0;

  updateGM(gs.gm, p, gs.currentFloor, dt);

  if (gs.pickupFlash > 0) gs.pickupFlash -= dt;
  if (gs.luckyFlash  > 0) gs.luckyFlash  -= dt;

  gs.flickerTimer -= dt;
  if (gs.flickerTimer <= 0) {
    var onSameFloor = gs.gm.floor === gs.currentFloor;
    var gmD = onSameFloor ? dist2d(p.x, p.y, gs.gm.x, gs.gm.y) : 99;
    var chance = gmD < 4 ? 0.6 : 0.15;
    gs.flickerAmt   = Math.random() < chance ? (Math.random() * 6 - 3) : 0;
    gs.flickerTimer = 80 + Math.random() * 120;
  }

  // Lose — or lucky escape (10%)
  if (gmCaughtPlayer(gs.gm, p, gs.currentFloor)) {
    if (Math.random() < 0.10) {
      _gmLuckyWarp(gs.gm, gs.currentFloor);
      gs.luckyFlash = 1800; // ms to display the indicator
    } else {
      playTrack('gameover');
      gs.screen = SCREEN_GAMEOVER;
      requestAnimationFrame(loop);
      return;
    }
  }

  // Win
  if (totalCollected() === totalPrograms() &&
      gs.currentFloor === 0 &&
      dist2d(p.x, p.y, EXIT.x, EXIT.y) < EXIT_DIST) {
    playTrack('win');
    gs.screen = SCREEN_WIN;
    requestAnimationFrame(loop);
    return;
  }

  if (gs.keys['Tab'] && !gs.mapUsedThisFloor) {
    gs.mapUsedThisFloor = true;
    gs.mapTimeLeft = 3000;
    gs.showMap = true;
  }
  if (gs.showMap) {
    gs.mapTimeLeft -= dt;
    if (gs.mapTimeLeft <= 0 || !gs.keys['Tab']) {
      gs.showMap = false;
      gs.mapTimeLeft = 0;
    }
  }

  castAndDraw(ctx, p, gs);
  drawSprites(ctx, p, gs);
  drawStairIndicators(ctx, p, gs);
  drawVignette(ctx, gs);
  drawPickupFlash(ctx, gs);
  drawLuckyFlash(ctx, gs);
  drawHUD(ctx, gs);
  drawMinimap(ctx, gs);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
