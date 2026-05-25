// ─────────────────────────────────────────────────────────────────
// renderer.js — all canvas draw calls
// Depends on: constants.js, world.js, entities.js, ai.js
// ─────────────────────────────────────────────────────────────────

// ─── Tileset cell dimensions ──────────────────────────────────────
// Generated sheets: 1536px wide × 102px tall, 16 tiles per strip.
var TILESET_CELL_W = 96;   // 1536 / 16
var TILESET_CELL_H = 102;  // full sheet height (single row)

// ─── Room → tileset + tile-index mapping ─────────────────────────
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
  ctx.fillStyle = secLeft <= TIMER_WARN_SECONDS ? COLOR_TIMER_WARN : COLOR_WHITE;
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
    case SCREEN_LOADING:
      drawLoadingScreen(ctx);
      break;

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
