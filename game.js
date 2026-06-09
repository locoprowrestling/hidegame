var gs = {
  screen:       SCREEN_TITLE,
  player:       null,
  gm:           null,
  currentFloor: 0,
  currentRound: 0,
  keys:         {},
  mouseRotate:  0,
  pickupFlash:  0,
  flickerAmt:   0,
  flickerTimer: 0,
  showMap:          false,
  mapUsedThisFloor: false,
  mapTimeLeft:      0,
  audioReady:       false,
  isOverworld:      false,
  // Stress system
  stress:       0,
  scareTimer:   0,
  whisperText:  null,
  whisperMs:    0,
  fakeGM:       null,   // { x, y, ttl }
  lastExitedRound: 0,
};

function setWhisper(g, text) {
  g.whisperText = text;
  g.whisperMs   = 3000;
}

// ── localStorage helpers ──────────────────────────────────────────────────────
function _saveCompletion(key) {
  try { localStorage.setItem(key, '1'); } catch(e) {}
}
function _isComplete(key) {
  try { return localStorage.getItem(key) === '1'; } catch(e) { return false; }
}
function r1Complete() { return _isComplete(ROUNDS[0].completionKey); }
function r2Complete() { return _isComplete(ROUNDS[1].completionKey); }

// ── Input ─────────────────────────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  gs.keys[e.code] = true;

  if (e.code === 'KeyM') toggleMute();

  if (gs.screen === SCREEN_TITLE) {
    if (!gs.audioReady) { initAudio(); gs.audioReady = true; }
    playTrack('menu');
    if (e.code === 'Enter' || e.code === 'Space') {
      setTimeout(function() { enterOverworld(false); }, 0);
    }
    return;
  }

  if (gs.screen === SCREEN_GAMEOVER || gs.screen === SCREEN_WIN) {
    if (e.code === 'KeyR' || e.code === 'Enter') {
      if (!gs.audioReady) { initAudio(); gs.audioReady = true; }
      setTimeout(function() { enterOverworld(true); }, 0);
    }
    return;
  }

  if (gs.screen === SCREEN_OVERWORLD) {
    if (e.code === 'Tab')  { e.preventDefault(); }
    if (e.code === 'KeyF' || e.code === 'Space') {
      var door = nearestOverworldDoor(gs.player);
      if (door && !door.locked()) {
        setTimeout(function() { _startRound(door.round); }, 0);
      }
      e.preventDefault();
    }
    if (e.code === 'Escape') document.exitPointerLock && document.exitPointerLock();
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
  if (gs.screen === SCREEN_PLAY || gs.screen === SCREEN_OVERWORLD) canvas.requestPointerLock();
});
document.addEventListener('mousemove', function(e) {
  if (document.pointerLockElement === canvas &&
      (gs.screen === SCREEN_PLAY || gs.screen === SCREEN_OVERWORLD))
    gs.mouseRotate += e.movementX * MOUSE_SENSITIVITY;
});

// ── Start / reset ─────────────────────────────────────────────────────────────
function startGame() {
  enterOverworld();
}

// ── Overworld ────────────────────────────────────────────────────────────────
function enterOverworld(fromBuilding) {
  switchToOverworld();
  gs.isOverworld  = true;
  gs.screen       = SCREEN_OVERWORLD;
  gs.currentFloor = 0;
  gs.player       = makePlayer();
  gs.gm           = makeOverworldStalker();
  gs.stress       = Math.min(gs.stress, 30);
  gs.whisperText  = null; gs.whisperMs = 0;
  gs.fakeGM       = null;
  gs.pickupFlash  = 0; gs.luckyFlash = 0; gs.flickerAmt = 0;
  gs.showMap = false; gs.mapUsedThisFloor = false; gs.mapTimeLeft = 0;
  // Reappear outside the building you last left
  var ret = OW_RETURN[gs.lastExitedRound];
  if (fromBuilding && ret) {
    gs.player.x = ret.x; gs.player.y = ret.y;
    gs.player.dirX = ret.dirX; gs.player.dirY = ret.dirY;
    gs.player.planeX = ret.planeX; gs.player.planeY = ret.planeY;
  }
  if (!gs.audioReady) { initAudio(); gs.audioReady = true; }
  playTrack('menu');
}

function _startRound(roundIdx) {
  gs.currentRound    = roundIdx;
  gs.lastExitedRound = roundIdx;
  gs.isOverworld     = false;
  switchToRound(roundIdx);
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
  gs.stress           = 18;
  gs.scareTimer       = SCARE_MIN_GAP_MS + Math.random() * (SCARE_MAX_GAP_MS - SCARE_MIN_GAP_MS);
  gs.whisperText      = null;
  gs.whisperMs        = 0;
  gs.fakeGM           = null;
}

// ── Stress + scare events ─────────────────────────────────────────────────────
var _WHISPERS = [
  '...he knows where you are...',
  '...keep your eyes down...',
  '...the show never ends...',
  '...he is counting your steps...',
  "...don't look. don't look. don't look...",
  '...you smell of fear...',
  '...every door you open, he hears...',
];

function _updateStress(dt) {
  var sec = dt / 1000;
  var rising = false;

  if (gs.gm.floor === gs.currentFloor) {
    var d = dist2d(gs.player.x, gs.player.y, gs.gm.x, gs.gm.y);
    if (gs.gm.state === 'chase') {
      gs.stress += STRESS_CHASE_RATE * sec;
      rising = true;
    } else if (d < STRESS_NEAR_GM_RANGE) {
      gs.stress += STRESS_NEAR_GM_RATE * (1 - d / STRESS_NEAR_GM_RANGE) * sec;
      rising = true;
    }
  }
  if (!rising) gs.stress -= STRESS_DECAY * sec;
  gs.stress = Math.max(0, Math.min(STRESS_MAX, gs.stress));

  if (gs.whisperMs > 0) gs.whisperMs -= dt;
  if (gs.fakeGM) {
    gs.fakeGM.ttl -= dt;
    if (gs.fakeGM.ttl <= 0) gs.fakeGM = null;
  }

  updateHeartbeat(gs.stress, dt);
}

function _updateScares(dt) {
  gs.scareTimer -= dt;
  if (gs.scareTimer > 0) return;
  gs.scareTimer = SCARE_MIN_GAP_MS + Math.random() * (SCARE_MAX_GAP_MS - SCARE_MIN_GAP_MS);

  var gmClose = gs.gm.floor === gs.currentFloor &&
    dist2d(gs.player.x, gs.player.y, gs.gm.x, gs.gm.y) < 7;

  var roll = Math.random();
  if (roll < 0.35) {
    // Lights die for a moment
    gs.flickerAmt   = -38;
    gs.flickerTimer = 1100 + Math.random() * 700;
    gs.stress = Math.min(STRESS_MAX, gs.stress + STRESS_SCARE_BUMP * 0.6);
  } else if (roll < 0.7 || gmClose) {
    // A whisper
    setWhisper(gs, _WHISPERS[Math.floor(Math.random() * _WHISPERS.length)]);
    gs.stress = Math.min(STRESS_MAX, gs.stress + STRESS_SCARE_BUMP * 0.7);
  } else {
    // A figure that was never there — far ahead, gone in half a second
    var spot = _fakeGMSpot();
    if (spot) {
      gs.fakeGM = { x: spot.x, y: spot.y, ttl: 480 };
      gs.stress = Math.min(STRESS_MAX, gs.stress + STRESS_SCARE_BUMP);
    } else {
      setWhisper(gs, _WHISPERS[Math.floor(Math.random() * _WHISPERS.length)]);
      gs.stress = Math.min(STRESS_MAX, gs.stress + STRESS_SCARE_BUMP * 0.7);
    }
  }
}

// Pick a walkable tile 6–11 tiles ahead of the player, roughly in view.
function _fakeGMSpot() {
  var p = gs.player;
  for (var attempt = 0; attempt < 12; attempt++) {
    var d = 6 + Math.random() * 5;
    var spread = (Math.random() - 0.5) * 0.8;
    var dx = p.dirX + p.planeX * spread;
    var dy = p.dirY + p.planeY * spread;
    var len = Math.sqrt(dx * dx + dy * dy);
    var tx = p.x + (dx / len) * d;
    var ty = p.y + (dy / len) * d;
    if (!isWall(Math.floor(tx), Math.floor(ty))) return { x: tx, y: ty };
  }
  return null;
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
  // Final escape — round-specific exit floor
  var rd = ROUNDS[gs.currentRound];
  if (gs.currentFloor === rd.exitFloor && totalCollected() === totalPrograms()) {
    if (dist2d(gs.player.x, gs.player.y, EXIT.x, EXIT.y) < EXIT_DIST) {
      _saveCompletion(rd.completionKey);
      stopHeartbeat();
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

  if (gs.screen === SCREEN_TITLE)        { drawTitle(ctx);       requestAnimationFrame(loop); return; }
  if (gs.screen === SCREEN_GAMEOVER)     { drawGameOver(ctx);    requestAnimationFrame(loop); return; }
  if (gs.screen === SCREEN_WIN)          { drawWin(ctx, gs);     requestAnimationFrame(loop); return; }

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

  // ── Overworld frame ─────────────────────────────────────────────────────────
  if (gs.screen === SCREEN_OVERWORLD) {
    updateOverworldStalker(gs.gm, p, gs, dt);

    gs.stress = Math.max(0, gs.stress - STRESS_DECAY * 0.6 * (dt / 1000));
    if (gs.whisperMs > 0) gs.whisperMs -= dt;

    gs.flickerTimer -= dt;
    if (gs.flickerTimer <= 0) {
      gs.flickerAmt   = Math.random() < 0.1 ? (Math.random() * 5 - 2.5) : 0;
      gs.flickerTimer = 90 + Math.random() * 140;
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
    // Town map is reusable — rearms once Tab is released
    if (!gs.keys['Tab'] && !gs.showMap) gs.mapUsedThisFloor = false;

    castAndDraw(ctx, p, gs);
    drawSprites(ctx, p, gs);
    drawDoorIndicators(ctx, p, gs);
    drawVignette(ctx, gs);
    drawStressFX(ctx, gs);
    drawWhisper(ctx, gs);
    drawOverworldHUD(ctx, gs);
    drawMinimap(ctx, gs);
    requestAnimationFrame(loop);
    return;
  }

  // ── In-building frame ───────────────────────────────────────────────────────
  updateGM(gs.gm, p, gs.currentFloor, dt, gs.stress);
  _updateStress(dt);
  _updateScares(dt);

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

  // Lose — or lucky escape
  if (gmCaughtPlayer(gs.gm, p, gs.currentFloor)) {
    if (Math.random() < 0.04) {
      _gmLuckyWarp(gs.gm, gs.currentFloor);
      gs.luckyFlash = 1800; // ms to display the indicator
    } else {
      stopHeartbeat();
      playTrack('gameover');
      gs.screen = SCREEN_GAMEOVER;
      requestAnimationFrame(loop);
      return;
    }
  }

  // Win
  var _rd = ROUNDS[gs.currentRound];
  if (totalCollected() === totalPrograms() &&
      gs.currentFloor === _rd.exitFloor &&
      dist2d(p.x, p.y, EXIT.x, EXIT.y) < EXIT_DIST) {
    _saveCompletion(_rd.completionKey);
    stopHeartbeat();
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

  // Stress screen-shake
  var shakeMag = gs.stress > STRESS_SHAKE_START
    ? ((gs.stress - STRESS_SHAKE_START) / (STRESS_MAX - STRESS_SHAKE_START)) * 2.2
    : 0;
  var shX = shakeMag ? (Math.random() - 0.5) * 2 * shakeMag : 0;
  var shY = shakeMag ? (Math.random() - 0.5) * 2 * shakeMag : 0;

  ctx.save();
  if (shakeMag) ctx.translate(shX, shY);
  castAndDraw(ctx, p, gs);
  drawSprites(ctx, p, gs);
  drawFakeGM(ctx, p, gs);
  drawStairIndicators(ctx, p, gs);
  ctx.restore();

  drawVignette(ctx, gs);
  drawStressFX(ctx, gs);
  drawPickupFlash(ctx, gs);
  drawLuckyFlash(ctx, gs);
  drawWhisper(ctx, gs);
  drawHUD(ctx, gs);
  drawMinimap(ctx, gs);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
