// overworld.js — first-person night-time overworld, vaguely Longmont, Colorado.
// Main Street runs north–south. The Opera House faces the Hotel Imperial
// across Main; the Sugar Mill sits in a fenced yard to the south-east.
// The Games Master stalks the streets: he appears at a distance, watches,
// and vanishes when approached or stared at. He cannot catch you out here.
//
// Chars: T=hedge/tree(20) O=opera facade(17) H=hotel facade(19) M=mill(18)
//        B=brick storefront(4) F=wood fence(5)
//        D=opera doors(21) I=hotel doors(23) N=mill door(22)

var _OWCH = { 'T': 20, 'O': 17, 'H': 19, 'M': 18, 'B': 4, 'F': 5,
              'D': 21, 'I': 23, 'N': 22 };

var _OW_MAP = parseMapStrings([
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'T....................................T',
  'T....................................T',
  'T..OOOOOOOOOOO.........HHHHHHHHHHHH..T',
  'T..OOOOOOOOOOO.........HHHHHHHHHHHH..T',
  'T..OOOOOOOOOOO.........HHHHHHHHHHHH..T',
  'T..OOOOOOOOOOD.........IHHHHHHHHHHH..T',
  'T..OOOOOOOOOOO.........HHHHHHHHHHHH..T',
  'T..OOOOOOOOOOO.........HHHHHHHHHHHH..T',
  'T..OOOOOOOOOOO.........HHHHHHHHHHHH..T',
  'T....................................T',
  'T....................................T',
  'T....................................T',
  'T......T.............................T',
  'T....................................T',
  'T.............................T......T',
  'T....................................T',
  'T..BBBBB..BBBBB......FFFFFFFFFFFFFF..T',
  'T..BBBBB..BBBBB......F............F..T',
  'T..BBBBB..BBBBB......F..MMMMMMMMM.F..T',
  'T..BBBBB..BBBBB.........MMMMMMMMM.F..T',
  'T.......................NMMMMMMMM.F..T',
  'T..BBBBB..BBBBB......F..MMMMMMMMM.F..T',
  'T..BBBBB..BBBBB......F..MMMMMMMMM.F..T',
  'T..BBBBB..BBBBB......F..MMMMMMMMM.F..T',
  'T....................FFFFFFFFFFFFFF..T',
  'T....................................T',
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
], _OWCH);

var OVERWORLD_FLOORS = [
  {
    id: 0, name: 'Longmont — Night',
    map: _OW_MAP,
    programs: [],
    gmStart:  { x: 18.5, y: 12.5 },
    gmPatrol: [ { x: 18.5, y: 12.5 } ],
    playerStart: { x: 18.5, y: 22.5, dirX: 0, dirY: -1, planeX: 0.66, planeY: 0 },
    exits: [],
  },
];

// Building doors — stand here and press Space.
var OW_DOORS = [
  { x: 14.5, y:  6.5, round: 0, name: 'THE OPERA HOUSE', locked: function() { return false; },
    lockMsg: '' },
  { x: 23.5, y: 21.5, round: 1, name: 'THE SUGAR MILL', locked: function() { return !r1Complete(); },
    lockMsg: 'CHAINED — SURVIVE THE OPERA HOUSE FIRST' },
  { x: 22.5, y:  6.5, round: 2, name: 'HOTEL IMPERIAL', locked: function() { return !r2Complete(); },
    lockMsg: 'BOARDED UP — SURVIVE THE SUGAR MILL FIRST' },
];

// Where the player reappears in town after leaving each building.
var OW_RETURN = [
  { x: 15.5, y:  6.5, dirX:  1, dirY: 0, planeX: 0, planeY:  0.66 },
  { x: 22.5, y: 21.5, dirX: -1, dirY: 0, planeX: 0, planeY: -0.66 },
  { x: 21.5, y:  6.5, dirX: -1, dirY: 0, planeX: 0, planeY: -0.66 },
];

// Stalker spawn spots — walkable street tiles, spread around town.
var _OW_SPOTS = [
  { x:  8.5, y: 11.5 }, { x:  2.5, y: 14.5 }, { x: 33.5, y: 13.5 },
  { x: 18.5, y:  2.5 }, { x:  8.5, y: 15.5 }, { x: 35.5, y: 11.5 },
  { x: 18.5, y: 10.5 }, { x:  2.5, y: 26.5 }, { x: 30.5, y: 26.5 },
  { x: 16.5, y: 16.5 }, { x: 18.5, y: 26.5 }, { x: 35.5, y:  1.5 },
];

// ── Mode switching ────────────────────────────────────────────────────────────
function switchToOverworld() {
  FLOORS             = OVERWORLD_FLOORS;
  PROGRAMS_PER_FLOOR = 0;
  EXIT               = { x: -99, y: -99 };
  FLOOR_COLLECTED    = [[]];
  switchToFloor(0);
}

function makeOverworldStalker() {
  return {
    x: 0, y: 0,
    floor:      -1,      // -1 = not present; 0 = visible (renders via drawSprites)
    state:      'patrol',
    vx: 0, vy: 0,
    patrolIdx:  0, path: null, pathIdx: 0,
    spawnMs:    5000 + Math.random() * 6000,
    visibleMs:  0,
    staredMs:   0,
  };
}

// ── Stalker update ────────────────────────────────────────────────────────────
function updateOverworldStalker(gm, player, gs, dt) {
  if (gm.floor !== 0) {
    gm.spawnMs -= dt;
    if (gm.spawnMs <= 0) {
      // Pick a spot far from the player
      var cands = [];
      for (var i = 0; i < _OW_SPOTS.length; i++) {
        if (dist2d(player.x, player.y, _OW_SPOTS[i].x, _OW_SPOTS[i].y) > 8.5) cands.push(_OW_SPOTS[i]);
      }
      if (cands.length === 0) { gm.spawnMs = 4000; return; }
      var s = cands[Math.floor(Math.random() * cands.length)];
      gm.x = s.x; gm.y = s.y;
      gm.floor     = 0;
      gm.visibleMs = 9000;
      gm.staredMs  = 0;
    }
    return;
  }

  // Visible: he stands and watches. Vanishes when approached, stared at, or bored.
  gm.visibleMs -= dt;
  var d = dist2d(player.x, player.y, gm.x, gm.y);
  var stared = _playerLooksAtGM(player, gm);
  if (stared) gm.staredMs += dt; else gm.staredMs = Math.max(0, gm.staredMs - dt * 2);

  if (d < 5.5 || gm.staredMs > 1300 || gm.visibleMs <= 0) {
    var wasClose = d < 12 && (stared || d < 5.5);
    gm.floor   = -1;
    gm.spawnMs = 9000 + Math.random() * 10000;
    if (wasClose) {
      gs.stress = Math.min(STRESS_MAX, gs.stress + STRESS_GLIMPSE_BUMP);
      gs.flickerAmt   = -34;
      gs.flickerTimer = 320;
      setWhisper(gs, _OW_WHISPERS[Math.floor(Math.random() * _OW_WHISPERS.length)]);
    }
  }
}

var _OW_WHISPERS = [
  '...he was never standing there...',
  '...the town is his board. you are his piece...',
  '...he walks these streets when the lights die...',
  '...do not let him see you looking...',
];

// ── Door interaction ──────────────────────────────────────────────────────────
function nearestOverworldDoor(player) {
  for (var i = 0; i < OW_DOORS.length; i++) {
    if (dist2d(player.x, player.y, OW_DOORS[i].x, OW_DOORS[i].y) < EXIT_DIST) return OW_DOORS[i];
  }
  return null;
}

// ── Door beacons — gold arrows over each entrance ─────────────────────────────
function drawDoorIndicators(ctx, player, gs) {
  var halfH = CANVAS_H >> 1;
  var bob = Math.sin(player.bobPhase) * 1.5;
  var horizon = halfH + Math.round(bob);
  var zBuf = getZBuffer();

  for (var i = 0; i < OW_DOORS.length; i++) {
    var dr = OW_DOORS[i];
    var relX = dr.x - player.x;
    var relY = dr.y - player.y;
    var invDet = 1.0 / (player.planeX * player.dirY - player.dirX * player.planeY);
    var transformX = invDet * ( player.dirY * relX - player.dirX * relY);
    var transformY = invDet * (-player.planeY * relX + player.planeX * relY);
    if (transformY <= 0.2) continue;

    var screenX = Math.round((CANVAS_W / 2) * (1 + transformX / transformY));
    if (screenX < -24 || screenX > CANVAS_W + 24) continue;
    var zCol = Math.max(0, Math.min(CANVAS_W - 1, screenX));
    if (transformY >= zBuf[zCol]) continue;

    var scale = CANVAS_H / transformY;
    var screenY = horizon - scale * 0.28;
    var size = Math.min(15, Math.max(4, scale * 0.13));
    var fog = Math.min(transformY / OW_FOG_DIST, 1.0); fog = fog * fog;
    var alpha = 1.0 - fog * 0.75;
    var pulse = 0.72 + 0.28 * Math.sin(Date.now() * 0.004 + i);
    var lk = dr.locked();

    var arrowSpr = SPRITE_TEXTURES[lk ? 'ui-arrow-locked' : 'ui-arrow-door'];
    if (arrowSpr) {
      var aw = Math.round(size * 2.1);
      ctx.globalAlpha = alpha * pulse;
      ctx.drawImage(arrowSpr.canvas,
        screenX - (aw >> 1), Math.round(screenY) - (aw >> 1), aw, aw);
    } else {
      ctx.globalAlpha = alpha * pulse * 0.35;
      ctx.fillStyle = lk ? '#552222' : '#aa7700';
      _fillArrow(ctx, screenX, screenY, size * 1.65, false);
      ctx.globalAlpha = alpha * pulse;
      ctx.fillStyle = lk ? '#aa4444' : '#ffd966';
      _fillArrow(ctx, screenX, screenY, size, false);
    }
    ctx.globalAlpha = 1.0;
  }
}

// ── Overworld HUD ─────────────────────────────────────────────────────────────
function drawOverworldHUD(ctx, gs) {
  // Top bar
  var topbar = SPRITE_TEXTURES['ui-topbar'];
  if (topbar) {
    ctx.drawImage(topbar.canvas, 0, 0, CANVAS_W, 23);
  } else {
    ctx.fillStyle = 'rgba(0,0,0,0.82)';
    ctx.fillRect(0, 0, CANVAS_W, 20);
  }
  ctx.fillStyle = '#806040';
  ctx.font = '10px "VT323", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('LONGMONT — NIGHT', 4, 14);

  // Stage completion pips — right
  var done = [r1Complete(), r2Complete(), _isComplete(ROUNDS[2].completionKey)];
  var stageNames = ['opera', 'mill', 'hotel'];
  ctx.textAlign = 'right';
  for (var i = 2; i >= 0; i--) {
    var px = CANVAS_W - 12 - (2 - i) * 11;
    var spr = SPRITE_TEXTURES['ui-stage-' + stageNames[i] + '-' + (done[i] ? 'lit' : 'dim')];
    if (spr) {
      ctx.drawImage(spr.canvas, px, 6, 8, 8);
    } else {
      ctx.fillStyle = done[i] ? '#c0a060' : '#2a2a2a';
      ctx.fillRect(px, 7, 8, 7);
    }
  }
  ctx.fillStyle = '#555548';
  ctx.fillText('STAGES', CANVAS_W - 46, 14);

  // Bottom bar
  var botbar = SPRITE_TEXTURES['ui-bottombar'];
  if (botbar) {
    ctx.drawImage(botbar.canvas, 0, CANVAS_H - 18, CANVAS_W, 18);
  } else {
    ctx.fillStyle = 'rgba(0,0,0,0.82)';
    ctx.fillRect(0, CANVAS_H - 18, CANVAS_W, 18);
  }
  ctx.font = '13px "VT323", monospace';
  ctx.textAlign = 'center';

  var door = nearestOverworldDoor(gs.player);
  if (door) {
    if (door.locked()) {
      ctx.fillStyle = '#aa4444';
      ctx.fillText(door.lockMsg, CANVAS_W / 2, CANVAS_H - 4);
    } else {
      var pulse = Math.floor(Date.now() / 500) % 2 === 0;
      ctx.fillStyle = pulse ? '#ffd966' : '#aa8830';
      ctx.fillText('[Space]  ENTER ' + door.name +
        (done[door.round] ? '  ✓' : ''), CANVAS_W / 2, CANVAS_H - 4);
    }
  } else {
    ctx.fillStyle = '#2a2a2a';
    var next = !done[0] ? 'the Opera House' : (!done[1] ? 'the Sugar Mill' : (!done[2] ? 'the Hotel Imperial' : 'nothing. it is over.'));
    ctx.fillText('find ' + next, CANVAS_W / 2, CANVAS_H - 4);
  }
}
