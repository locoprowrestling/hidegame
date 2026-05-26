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
