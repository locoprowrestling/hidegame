// ─────────────────────────────────────────────────────────────────
// renderer.js — all canvas draw calls
// Depends on: constants.js, world.js, entities.js, ai.js
// ─────────────────────────────────────────────────────────────────

// ─── Room → tileset + tile-index mapping ─────────────────────────
// Each sheet is ~1568×1003px with 10 tiles in a single horizontal row.
// Tile art is centered vertically; measurements are per-sheet (px):
//   sx0   = x of first tile's art
//   sy0   = y of top of tile art band
//   sw/sh = width/height of each tile's art region
//   stride = px from one tile's x start to the next
// Tile indices (0-9, left→right): F=floor, W=wall, O=obstacle, H=hiding spot
var ROOM_TILESETS = {
  //                                                            F  W  O  H   sx0  sy0  sw   sh   stride
  locker_room_tl:    { img: 'tileLockerRoom',    F: 4, W: 9, O: 2, H: 0, sx0: 42, sy0: 436, sw: 128, sh: 127, stride: 146 },
  locker_room_tr:    { img: 'tileLockerRoom',    F: 4, W: 9, O: 2, H: 0, sx0: 42, sy0: 436, sw: 128, sh: 127, stride: 146 },
  hallway_top_1:     { img: 'tileBackstage',     F: 0, W: 4, O: 3, H: 5, sx0: 44, sy0: 432, sw: 128, sh: 130, stride: 152 },
  hallway_top_2:     { img: 'tileBackstage',     F: 0, W: 4, O: 3, H: 5, sx0: 44, sy0: 432, sw: 128, sh: 130, stride: 152 },
  backstage_left:    { img: 'tileBackstage',     F: 0, W: 4, O: 3, H: 5, sx0: 44, sy0: 432, sw: 128, sh: 130, stride: 152 },
  backstage_right:   { img: 'tileBackstage',     F: 0, W: 4, O: 3, H: 5, sx0: 44, sy0: 432, sw: 128, sh: 130, stride: 152 },
  ringside_center_1: { img: 'tileWrestlingRing', F: 4, W: 8, O: 6, H: 7, sx0: 45, sy0: 435, sw: 128, sh: 128, stride: 154 },
  ringside_center_2: { img: 'tileWrestlingRing', F: 4, W: 8, O: 6, H: 7, sx0: 45, sy0: 435, sw: 128, sh: 128, stride: 154 },
  entrance_left:     { img: 'tileEntrance',      F: 5, W: 2, O: 7, H: 0, sx0: 34, sy0: 436, sw: 128, sh: 138, stride: 153 },
  entrance_right:    { img: 'tileEntrance',      F: 5, W: 2, O: 7, H: 0, sx0: 34, sy0: 436, sw: 128, sh: 138, stride: 153 },
  entrance_center_1: { img: 'tileBackstage',     F: 0, W: 4, O: 3, H: 5, sx0: 44, sy0: 432, sw: 128, sh: 130, stride: 152 },
  entrance_center_2: { img: 'tileBackstage',     F: 0, W: 4, O: 3, H: 5, sx0: 44, sy0: 432, sw: 128, sh: 130, stride: 152 },
  storage_bl:        { img: 'tileStorage',       F: 0, W: 9, O: 2, H: 4, sx0: 27, sy0: 435, sw: 128, sh: 132, stride: 151 },
  storage_bm_1:      { img: 'tileStorage',       F: 0, W: 9, O: 2, H: 4, sx0: 27, sy0: 435, sw: 128, sh: 132, stride: 151 },
  storage_bm_2:      { img: 'tileStorage',       F: 0, W: 9, O: 2, H: 4, sx0: 27, sy0: 435, sw: 128, sh: 132, stride: 151 },
  storage_br:        { img: 'tileStorage',       F: 0, W: 9, O: 2, H: 4, sx0: 27, sy0: 435, sw: 128, sh: 132, stride: 151 },
};

// ─── Screen overlay helper ────────────────────────────────────────
// Draws a full-screen overlay PNG letterboxed to canvas width.
function drawScreenOverlay(ctx, img) {
  ctx.fillStyle = COLOR_BLACK;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  if (!img || !img.complete || !img.naturalWidth) return;
  var drawW = CANVAS_SIZE;
  var drawH = Math.round(img.naturalHeight / img.naturalWidth * CANVAS_SIZE);
  var drawY = Math.floor((CANVAS_SIZE - drawH) / 2);
  ctx.drawImage(img, 0, drawY, drawW, drawH);
}

// imgReady — returns true if an Image element is fully loaded and usable
function imgReady(img) {
  return !!(img && img.complete && img.naturalWidth > 0);
}

// Per-character spritesheet metadata.
// Each sheet is a single horizontal strip: frame 0 idle, frames 1-8 walk.
// The regenerated sheets face right; drawSpriteFrame flips them for left-facing movement.
var PLAYER_SHEETS = {
  'Zeak':   { key: 'sheetZeak',   frameW: 64 },
  'Erza':   { key: 'sheetErza',   frameW: 64 },
  'Johnny': { key: 'sheetJohnny', frameW: 64 },
  'Carter': { key: 'sheetCarter', frameW: 64 },
  'JT':     { key: 'sheetJT',     frameW: 64 },
  'Cody':   { key: 'sheetCody',   frameW: 64 },
  'Nicky':  { key: 'sheetNicky',  frameW: 64 },
  'Franky': { key: 'sheetFranky', frameW: 64 },
};
var PLAYER_SHEET_DEFAULT = { key: 'genericWalk', frameW: 64 };
var PLAYER_SHEET_FRAME_H = 96;

function drawLoadingScreen(ctx) {
  drawScreenOverlay(ctx, ASSETS.screenLoading);
}

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
          config.sx0 + idx * config.stride, config.sy0, config.sw, config.sh,
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

// drawSpriteFrame — draws one frame from a horizontal strip, flipping H if needed
function drawSpriteFrame(ctx, img, frameIdx, frameW, frameH, dx, dy, dw, dh, flipH) {
  var sx = frameIdx * frameW;
  if (flipH) {
    ctx.save();
    ctx.translate(dx + dw, dy);
    ctx.scale(-1, 1);
    ctx.drawImage(img, sx, 0, frameW, frameH, 0, 0, dw, dh);
    ctx.restore();
  } else {
    ctx.drawImage(img, sx, 0, frameW, frameH, dx, dy, dw, dh);
  }
}

// ─── Entity sprites ───────────────────────────────────────────────
function drawPlayer(ctx, player) {
  var x = player.x;
  var y = player.y;
  var w = TILE_SIZE;
  var h = TILE_SIZE;

  var config = PLAYER_SHEETS[player.wrestler.name] || PLAYER_SHEET_DEFAULT;
  var img    = ASSETS[config.key];

  if (player.isHidden) {
    ctx.globalAlpha = 0.7;
    if (imgReady(ASSETS.hidingSprite)) {
      ctx.drawImage(ASSETS.hidingSprite, x, y, w, h);
    } else if (imgReady(img)) {
      drawSpriteFrame(ctx, img, 0, config.frameW, PLAYER_SHEET_FRAME_H, x, y, w, h, !player.facingRight);
    } else {
      ctx.fillStyle = player.faction.color;
      ctx.fillRect(x + 1, y + 1, player.width, player.height);
    }
    ctx.globalAlpha = 1.0;
    return;
  }

  if (!player.isMoving && config === PLAYER_SHEET_DEFAULT && imgReady(ASSETS.genericIdle)) {
    ctx.drawImage(ASSETS.genericIdle, x, y, w, h);
  } else if (imgReady(img)) {
    var frameIdx = player.isMoving ? player.animFrame + 1 : 0;
    drawSpriteFrame(ctx, img, frameIdx, config.frameW, PLAYER_SHEET_FRAME_H, x, y, w, h, !player.facingRight);
  } else {
    ctx.fillStyle = player.faction.color;
    ctx.fillRect(x + 1, y + 1, player.width, player.height);
  }
}

function drawEnemy(ctx, enemy, index) {
  var x   = enemy.x;
  var y   = enemy.y;
  var img = (index % 2 === 0) ? ASSETS.refereeIdle : ASSETS.securityIdle;

  if (imgReady(img)) {
    ctx.drawImage(img, x, y, TILE_SIZE, TILE_SIZE);
  } else {
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(x + 1, y + 1, enemy.width, enemy.height);
  }
}

function drawAlly(ctx, ally) {
  var x   = ally.x;
  var y   = ally.y;
  var img = ASSETS.genericWalk;
  var fw  = PLAYER_SHEET_DEFAULT.frameW;

  if (ally.state === STATE_CAUGHT) {
    if (imgReady(ASSETS.caughtSprite)) {
      ctx.drawImage(ASSETS.caughtSprite, x, y, TILE_SIZE, TILE_SIZE);
    }
    return;
  }

  if (ally.state === STATE_HIDING) {
    ctx.globalAlpha = 0.5;
    if (imgReady(ASSETS.hidingSprite)) {
      ctx.drawImage(ASSETS.hidingSprite, x, y, TILE_SIZE, TILE_SIZE);
    } else if (imgReady(img)) {
      drawSpriteFrame(ctx, img, 0, fw, PLAYER_SHEET_FRAME_H, x, y, TILE_SIZE, TILE_SIZE, !ally.facingRight);
    } else {
      ctx.fillStyle = '#88aacc';
      ctx.fillRect(x + 1, y + 1, ally.width, ally.height);
    }
    ctx.globalAlpha = 1.0;
    return;
  }

  if (!ally.isMoving && imgReady(ASSETS.genericIdle)) {
    ctx.drawImage(ASSETS.genericIdle, x, y, TILE_SIZE, TILE_SIZE);
  } else if (imgReady(img)) {
    var frameIdx = ally.isMoving ? ally.animFrame + 1 : 0;
    drawSpriteFrame(ctx, img, frameIdx, fw, PLAYER_SHEET_FRAME_H, x, y, TILE_SIZE, TILE_SIZE, !ally.facingRight);
  } else {
    ctx.fillStyle = '#88aacc';
    ctx.fillRect(x + 1, y + 1, ally.width, ally.height);
  }
}

// ─── Mini-map ────────────────────────────────────────────────────
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

// ─── HUD ──────────────────────────────────────────────────────────
function drawHUD(ctx, gs) {
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

function pad2(n) {
  return n < 10 ? '0' + n : '' + n;
}

// ─── Screen overlays ─────────────────────────────────────────────
function drawTitleScreen(ctx) {
  drawScreenOverlay(ctx, ASSETS.screenTitle);
  ctx.font      = '5px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('PRESS ENTER', CANVAS_SIZE / 2, CANVAS_SIZE - 16);
  ctx.textAlign = 'left';
}

function drawCharSelectScreen(ctx, factions, selFactionIdx, selWrestlerIdx) {
  drawScreenOverlay(ctx, ASSETS.screenSelect);

  var faction  = factions[selFactionIdx];
  var wrestler = faction.wrestlers[selWrestlerIdx];

  // screenSelect is 1672×941 (16:9) — letterboxes to y=56..200 in 256px canvas
  var IMG_TOP = 56;
  var IMG_BOT = 200;

  // ── Top band (y=0..56): faction switcher ─────────────────────────
  var emblemKey = (faction.name === 'The Rising') ? 'emblemRising' : 'emblemPillars';
  if (imgReady(ASSETS[emblemKey])) {
    ctx.drawImage(ASSETS[emblemKey], CANVAS_SIZE - 34, 4, 28, 28);
  }
  ctx.font      = '6px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillStyle = COLOR_WHITE;
  ctx.fillText('< ' + faction.name + ' >', CANVAS_SIZE / 2, IMG_TOP / 2 + 3);

  // ── Bottom band (y=200..256): 4×2 roster with TAS thumbnails ───────
  var rowH = 26;
  var colW = 63;
  ctx.font = '4px "Press Start 2P"';
  for (var i = 0; i < faction.wrestlers.length; i++) {
    var wr = faction.wrestlers[i];
    var col = i % 4;
    var row = Math.floor(i / 4);
    var x = 4 + col * colW;
    var y = IMG_BOT + 4 + row * rowH;
    var selected = i === selWrestlerIdx;

    if (selected) {
      ctx.strokeStyle = COLOR_WHITE;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y - 2, colW - 5, rowH - 2);
    }

    drawPortraitThumb(ctx, ASSETS[wr.portraitKey], x + 2, y, 13, 18);

    ctx.textAlign = 'left';
    ctx.fillStyle = selected ? COLOR_WHITE : '#777777';
    ctx.fillText((selected ? '>' : ' ') + (wr.label || wr.name), x + 18, y + 8);

    if (selected) {
      drawTinyStatBar(ctx, 'S', wr.speedMult, x + 18, y + 13);
      drawTinyStatBar(ctx, 'H', wr.hideMult, x + 38, y + 13);
    }
  }

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font      = '4px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('L/R:FACTION  U/D:PICK  ENTER:GO', CANVAS_SIZE / 2, CANVAS_SIZE - 3);
  ctx.textAlign = 'left';
}

function drawPortraitThumb(ctx, img, x, y, maxW, maxH) {
  if (!imgReady(img)) {
    ctx.fillStyle = '#333333';
    ctx.fillRect(x, y, maxW, maxH);
    return;
  }
  var scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
  var drawW = Math.max(1, Math.round(img.naturalWidth * scale));
  var drawH = Math.max(1, Math.round(img.naturalHeight * scale));
  var dx = x + Math.floor((maxW - drawW) / 2);
  var dy = y + Math.floor((maxH - drawH) / 2);
  ctx.drawImage(img, dx, dy, drawW, drawH);
}

function drawTinyStatBar(ctx, label, value, x, y) {
  ctx.fillStyle = COLOR_WHITE;
  ctx.font = '4px "Press Start 2P"';
  ctx.fillText(label, x, y + 5);
  ctx.fillStyle = '#44cc44';
  ctx.fillRect(x + 6, y + 1, Math.round(value * 7), 4);
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

// ─── Master render function ────────────────────────────────────────
// Called once per frame from game.js
// gs: GameState
function render(ctx, gs) {
  ctx.save();
  ctx.scale(RENDER_SCALE, RENDER_SCALE);
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  switch (gs.screen) {
    case SCREEN_LOADING:
      drawLoadingScreen(ctx);
      break;

    case SCREEN_TITLE:
      drawTitleScreen(ctx);
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

  ctx.restore();
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
      drawEnemy(ctx, e2, k);
    }
  }

  // 6. Player (on top)
  drawPlayer(ctx, gs.player);

  // 7. Mini-map
  drawMinimap(ctx, gs);

  // 8. HUD
  drawHUD(ctx, gs);
}
