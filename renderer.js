// All non-raycasting draw calls: HUD, screens, vignette

// ── Title screen ─────────────────────────────────────────────────────────────
function drawTitle(ctx) {
  var bg = SPRITE_TEXTURES['screen-title'];
  if (bg) {
    ctx.drawImage(bg.canvas, 0, 0, CANVAS_W, CANVAS_H);
  } else {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  // Dark gradient band so text is legible over the image
  var grad = ctx.createLinearGradient(0, 20, 0, CANVAS_H);
  grad.addColorStop(0,   'rgba(0,0,0,0.72)');
  grad.addColorStop(0.4, 'rgba(0,0,0,0.0)');
  grad.addColorStop(0.7, 'rgba(0,0,0,0.0)');
  grad.addColorStop(1,   'rgba(0,0,0,0.8)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Title
  ctx.fillStyle = '#c0a060';
  ctx.font = 'bold 20px "Press Start 2P", serif';
  ctx.textAlign = 'center';
  ctx.fillText('GAMES MASTER', CANVAS_W / 2, 36);

  ctx.fillStyle = '#8a7050';
  ctx.font = '14px "VT323", monospace';
  ctx.fillText('Collect 7 programs on each of the 4 floors.', CANVAS_W / 2, 152);
  ctx.fillText('Avoid The Games Master. Escape through the front doors.', CANVAS_W / 2, 165);

  ctx.fillStyle = '#555548';
  ctx.font = '13px "VT323", monospace';
  ctx.fillText('W/S = move  ·  A/D = strafe  ·  Q/E or mouse = turn', CANVAS_W / 2, 178);

  var blink = Math.floor(Date.now() / 600) % 2 === 0;
  if (blink) {
    ctx.fillStyle = '#c0a060';
    ctx.font = 'bold 10px "Press Start 2P", monospace';
    ctx.fillText('PRESS ENTER TO BEGIN', CANVAS_W / 2, 193);
  }
}

// ── Game Over ─────────────────────────────────────────────────────────────────
function drawGameOver(ctx) {
  var bg = SPRITE_TEXTURES['screen-gameover'];
  if (bg) {
    ctx.drawImage(bg.canvas, 0, 0, CANVAS_W, CANVAS_H);
  } else {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  // Dark band at top and bottom for text
  var grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0,   'rgba(0,0,0,0.82)');
  grad.addColorStop(0.3, 'rgba(0,0,0,0.0)');
  grad.addColorStop(0.7, 'rgba(0,0,0,0.0)');
  grad.addColorStop(1,   'rgba(0,0,0,0.82)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.fillStyle = '#cc0000';
  ctx.font = 'bold 16px "Press Start 2P", serif';
  ctx.textAlign = 'center';
  ctx.fillText('THE PERFORMANCE', CANVAS_W / 2, 26);
  ctx.fillText('IS OVER.', CANVAS_W / 2, 46);

  var blink = Math.floor(Date.now() / 600) % 2 === 0;
  if (blink) {
    ctx.fillStyle = '#884444';
    ctx.font = '14px "VT323", monospace';
    ctx.fillText('PRESS R TO TRY AGAIN', CANVAS_W / 2, 193);
  }
}

// ── Win screen ────────────────────────────────────────────────────────────────
function drawWin(ctx) {
  var bg = SPRITE_TEXTURES['screen-win'];
  if (bg) {
    ctx.drawImage(bg.canvas, 0, 0, CANVAS_W, CANVAS_H);
  } else {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  // Dark bands for text legibility
  var grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0,   'rgba(0,0,0,0.78)');
  grad.addColorStop(0.3, 'rgba(0,0,0,0.0)');
  grad.addColorStop(0.7, 'rgba(0,0,0,0.0)');
  grad.addColorStop(1,   'rgba(0,0,0,0.78)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.fillStyle = '#c0a060';
  ctx.font = 'bold 14px "Press Start 2P", serif';
  ctx.textAlign = 'center';
  ctx.fillText('CURTAIN CALL', CANVAS_W / 2, 26);

  ctx.fillStyle = '#8a7040';
  ctx.font = '15px "VT323", monospace';
  ctx.fillText('All 28 programs. All 4 floors. You escaped.', CANVAS_W / 2, 44);

  var blink = Math.floor(Date.now() / 600) % 2 === 0;
  if (blink) {
    ctx.fillStyle = '#c0a060';
    ctx.font = '14px "VT323", monospace';
    ctx.fillText('PRESS R TO PLAY AGAIN', CANVAS_W / 2, 193);
  }
}

// ── HUD ───────────────────────────────────────────────────────────────────────
function drawHUD(ctx, gs) {
  var floorIdx  = gs.currentFloor;
  var floorDone = floorCollectedCount(floorIdx);
  var allDone   = totalCollected();

  // Top bar
  ctx.fillStyle = 'rgba(0,0,0,0.82)';
  ctx.fillRect(0, 0, CANVAS_W, 20);

  // Floor name — left
  ctx.fillStyle = '#806040';
  ctx.font = '10px "VT323", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(FLOORS[floorIdx].name.toUpperCase(), 4, 14);

  // Per-floor program pips — center
  var pipTotal = PROGRAMS_PER_FLOOR;
  var pipW = pipTotal * 9 - 2;
  var pipStartX = Math.round((CANVAS_W - pipW) / 2);
  for (var j = 0; j < pipTotal; j++) {
    ctx.fillStyle = PROGRAMS[j].collected ? '#c0a060' : '#2a2a2a';
    ctx.fillRect(pipStartX + j * 9, 7, 7, 7);
  }

  // Global count — right
  ctx.fillStyle = '#806040';
  ctx.font = '10px "VT323", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(allDone + '/' + totalPrograms(), CANVAS_W - 4, 14);

  // GM warning — right, second line
  var onSameFloor = gs.gm.floor === floorIdx;
  var gmDist = onSameFloor ? dist2d(gs.player.x, gs.player.y, gs.gm.x, gs.gm.y) : 99;
  var flash = Math.floor(Date.now() / 300) % 2 === 0;
  ctx.font = 'bold 11px "VT323", monospace';
  ctx.textAlign = 'right';
  if (gs.gm.state === 'chase' && onSameFloor) {
    if (flash) { ctx.fillStyle = '#ff2200'; ctx.fillText('RUN', CANVAS_W - 4, 13); }
  } else if (onSameFloor && gmDist < 6) {
    var danger = Math.max(0, 1 - (gmDist - 1) / 5);
    if (flash && danger > 0.2) {
      ctx.fillStyle = 'rgba(200,80,0,' + danger.toFixed(2) + ')';
      ctx.fillText("DON'T LOOK", CANVAS_W - 4, 13);
    }
  }

  // Bottom bar
  ctx.fillStyle = 'rgba(0,0,0,0.82)';
  ctx.fillRect(0, CANVAS_H - 18, CANVAS_W, 18);
  ctx.font = '13px "VT323", monospace';
  ctx.textAlign = 'center';

  // Priority: collect > stair prompt > all-collected escape
  var nearProg = _nearestProgram(gs.player);
  if (nearProg !== null) {
    ctx.fillStyle = '#c0a060';
    ctx.fillText('[Space]  ' + PROGRAMS[nearProg].label, CANVAS_W / 2, CANVAS_H - 4);
  } else {
    var nearExit = _nearestExit(gs.player, floorIdx);
    if (nearExit !== null) {
      var pulse = Math.floor(Date.now() / 500) % 2 === 0;
      ctx.fillStyle = pulse ? '#88ccff' : '#4488aa';
      ctx.fillText('[Space]  ' + nearExit.label, CANVAS_W / 2, CANVAS_H - 4);
    } else if (allDone === totalPrograms() && floorIdx === 0) {
      var p2 = Math.floor(Date.now() / 500) % 2 === 0;
      ctx.fillStyle = p2 ? '#c0ff80' : '#80c040';
      ctx.fillText('ALL FOUND  —  REACH THE FRONT DOORS', CANVAS_W / 2, CANVAS_H - 4);
    } else {
      // quiet hint
      ctx.fillStyle = '#2a2a2a';
      ctx.fillText(floorDone + ' / 7 programs on this floor', CANVAS_W / 2, CANVAS_H - 4);
    }
  }
}

// ── Vignette / fear effect ────────────────────────────────────────────────────
function drawVignette(ctx, gs) {
  var onSameFloor = gs.gm.floor === gs.currentFloor;
  if (!onSameFloor) return;
  var gmDist = dist2d(gs.player.x, gs.player.y, gs.gm.x, gs.gm.y);
  var intensity = Math.max(0, 1 - (gmDist - 0.5) / 5);
  intensity = intensity * intensity;

  if (intensity < 0.02) return;

  var grad = ctx.createRadialGradient(
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.25,
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.85
  );
  var r = Math.round(120 * intensity);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(' + r + ',0,0,' + (0.7 * intensity).toFixed(2) + ')');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

// ── Pickup flash ──────────────────────────────────────────────────────────────
function drawPickupFlash(ctx, gs) {
  if (!gs.pickupFlash || gs.pickupFlash <= 0) return;
  var alpha = gs.pickupFlash / 300;

  // Gold screen tint
  ctx.fillStyle = 'rgba(200,160,60,' + (alpha * 0.25).toFixed(2) + ')';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Program booklet art centred on screen
  var tex = SPRITE_TEXTURES['program-full'];
  if (tex) {
    var size = Math.round(CANVAS_H * 0.55);
    ctx.globalAlpha = alpha;
    ctx.drawImage(tex.canvas,
      (CANVAS_W - size) / 2, (CANVAS_H - size) / 2,
      size, size);
    ctx.globalAlpha = 1.0;
  }
}

// ── Map overlay (Tab hold) ────────────────────────────────────────────────────
function drawMinimap(ctx, gs) {
  if (!gs.showMap) return;
  _drawFullMap(ctx, gs);
}

function _drawFullMap(ctx, gs) {
  var T  = 5;
  var mw = MAP_W * T;
  var mh = MAP_H * T;
  var ox = Math.round((CANVAS_W - mw) / 2);
  var oy = Math.round((CANVAS_H - mh) / 2);
  var fl = gs.currentFloor;

  // Dim the scene behind the map
  ctx.fillStyle = 'rgba(0,0,0,0.86)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Countdown
  var secs = Math.max(0, gs.mapTimeLeft / 1000).toFixed(1);
  ctx.font = '13px "VT323", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = gs.mapTimeLeft < 1000 ? '#ff4400' : '#806040';
  ctx.fillText('MAP  ' + secs + 's', CANVAS_W / 2, oy - 3);

  // Map background
  ctx.fillStyle = '#0a0806';
  ctx.fillRect(ox - 1, oy - 1, mw + 2, mh + 2);

  // Walls
  var flM = FLOORS[fl].map;
  for (var row = 0; row < MAP_H; row++) {
    for (var col = 0; col < MAP_W; col++) {
      var cell = flM[row][col];
      if (cell === 0) continue;
      var wc = WALL_COLORS[cell] || [60, 60, 60];
      ctx.fillStyle = 'rgb(' + (wc[0] + 40) + ',' + (wc[1] + 40) + ',' + (wc[2] + 40) + ')';
      ctx.fillRect(ox + col * T, oy + row * T, T, T);
    }
  }

  // Stairs — blue squares
  var exits = FLOORS[fl].exits;
  for (var e = 0; e < exits.length; e++) {
    var ex = exits[e];
    ctx.fillStyle = '#4499ff';
    ctx.fillRect(ox + Math.round(ex.x * T) - 2, oy + Math.round(ex.y * T) - 2, 5, 5);
  }

  // Uncollected programs — gold squares
  for (var i = 0; i < PROGRAMS.length; i++) {
    if (PROGRAMS[i].collected) continue;
    ctx.fillStyle = '#c0a060';
    ctx.fillRect(ox + Math.round(PROGRAMS[i].x * T) - 2, oy + Math.round(PROGRAMS[i].y * T) - 2, 4, 4);
  }

  // Games Master — red, pulses when chasing
  if (gs.gm.floor === fl) {
    var gmFlash = gs.gm.state !== 'chase' || Math.floor(Date.now() / 180) % 2 === 0;
    if (gmFlash) {
      ctx.fillStyle = 'rgba(255,0,0,0.35)';
      ctx.fillRect(ox + Math.round(gs.gm.x * T) - 3, oy + Math.round(gs.gm.y * T) - 3, 7, 7);
      ctx.fillStyle = '#ff2200';
      ctx.fillRect(ox + Math.round(gs.gm.x * T) - 2, oy + Math.round(gs.gm.y * T) - 2, 4, 4);
    }
  }

  // Player — white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(ox + Math.round(gs.player.x * T) - 2, oy + Math.round(gs.player.y * T) - 2, 4, 4);
  // Facing direction tick
  ctx.fillStyle = '#88ff88';
  ctx.fillRect(
    ox + Math.round(gs.player.x * T) + Math.round(gs.player.dirX * 3),
    oy + Math.round(gs.player.y * T) + Math.round(gs.player.dirY * 3),
    2, 2
  );

  // Map border
  ctx.strokeStyle = '#2a1f0e';
  ctx.lineWidth = 1;
  ctx.strokeRect(ox - 1, oy - 1, mw + 2, mh + 2);

  // Legend — centred below map
  var ly = oy + mh + 13;
  ctx.font = '11px "VT323", monospace';
  ctx.textAlign = 'center';

  var gmOnFloor = gs.gm.floor === fl;
  var legendItems = [
    { color: '#ffffff', label: 'YOU' },
    { color: gmOnFloor ? '#ff2200' : '#442200', label: gmOnFloor ? 'GAMES MASTER' : 'GM (other floor)' },
    { color: '#c0a060', label: 'PROGRAM' },
    { color: '#4499ff', label: 'STAIRS' },
  ];

  var totalW = legendItems.length * 70;
  var lx = Math.round(CANVAS_W / 2 - totalW / 2) + 8;
  ctx.textAlign = 'left';
  for (var li = 0; li < legendItems.length; li++) {
    ctx.fillStyle = legendItems[li].color;
    ctx.fillRect(lx, ly - 7, 6, 6);
    ctx.fillStyle = gmOnFloor || li !== 1 ? '#888' : '#555';
    ctx.fillText(' ' + legendItems[li].label, lx + 6, ly);
    lx += 70;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function _nearestProgram(player) {
  for (var i = 0; i < PROGRAMS.length; i++) {
    if (PROGRAMS[i].collected) continue;
    if (dist2d(player.x, player.y, PROGRAMS[i].x, PROGRAMS[i].y) < COLLECT_DIST) return i;
  }
  return null;
}

function _nearestExit(player, floorIdx) {
  var exits = FLOORS[floorIdx].exits;
  for (var i = 0; i < exits.length; i++) {
    var ex = exits[i];
    if (dist2d(player.x, player.y, ex.x + 0.5, ex.y + 0.5) < EXIT_DIST) return ex;
  }
  return null;
}
