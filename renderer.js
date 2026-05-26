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
