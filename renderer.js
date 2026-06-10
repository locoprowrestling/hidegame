// All non-raycasting draw calls: HUD, screens, vignette

// ── Round select screen ───────────────────────────────────────────────────────
function drawRoundSelect(ctx) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.fillStyle = '#c0a060';
  ctx.font = 'bold 14px "Press Start 2P", serif';
  ctx.textAlign = 'center';
  ctx.fillText('SELECT ROUND', CANVAS_W / 2, 30);

  var r1done = r1Complete();
  var r2done = r2Complete();

  ctx.font = '14px "VT323", monospace';
  ctx.fillStyle = r1done ? '#888' : '#c0a060';
  ctx.fillText('[1]  Round I: The Opera House' + (r1done ? '  ✓' : ''), CANVAS_W / 2, 70);

  ctx.fillStyle = '#c0a060';
  ctx.fillText('[2]  Round II: The Sugar Works' + (r2done ? '  ✓' : ''), CANVAS_W / 2, 92);

  ctx.fillStyle = '#555';
  ctx.font = '12px "VT323", monospace';
  ctx.fillText('Press 1 or 2', CANVAS_W / 2, 120);
}

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

  // Title — pixel-art logotype if the asset exists, font text otherwise
  var logo = SPRITE_TEXTURES['ui-logo'];
  if (logo) {
    var lw = 288;
    var lh = Math.min(64, Math.round(lw * logo.h / logo.w));
    ctx.drawImage(logo.canvas, Math.round((CANVAS_W - lw) / 2), 10, lw, lh);
  } else {
    ctx.fillStyle = '#c0a060';
    ctx.font = 'bold 20px "Press Start 2P", serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAMES MASTER', CANVAS_W / 2, 36);
  }
  ctx.textAlign = 'center';

  ctx.fillStyle = '#8a7050';
  ctx.font = '14px "VT323", monospace';
  ctx.fillText('Three buildings. One town. He is in all of them.', CANVAS_W / 2, 152);
  ctx.fillText('The Opera House · The Sugar Mill · The Hotel Imperial', CANVAS_W / 2, 165);

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
function drawWin(ctx, gs) {
  var roundIdx = (gs && gs.currentRound) || 0;
  var rd = ROUNDS[roundIdx];

  var bgKey = roundIdx === 2 ? 'screen-win-r3' : roundIdx === 1 ? 'screen-win-r2' : 'screen-win';
  var bg = SPRITE_TEXTURES[bgKey] || SPRITE_TEXTURES['screen-win'];
  if (bg) {
    ctx.drawImage(bg.canvas, 0, 0, CANVAS_W, CANVAS_H);
  } else {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

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
  ctx.fillText(rd.winTitle, CANVAS_W / 2, 26);

  ctx.fillStyle = '#8a7040';
  ctx.font = '15px "VT323", monospace';
  ctx.fillText(rd.winBody, CANVAS_W / 2, 44);

  // Tease the next stage
  if (roundIdx === 0) {
    ctx.fillStyle = '#6a8060';
    ctx.font = '13px "VT323", monospace';
    ctx.fillText('The chains on the Sugar Mill have fallen.', CANVAS_W / 2, 60);
  } else if (roundIdx === 1) {
    ctx.fillStyle = '#6a8060';
    ctx.font = '13px "VT323", monospace';
    ctx.fillText('The Hotel Imperial is taking guests.', CANVAS_W / 2, 60);
  }

  var blink = Math.floor(Date.now() / 600) % 2 === 0;
  if (blink) {
    ctx.fillStyle = '#c0a060';
    ctx.font = '14px "VT323", monospace';
    ctx.fillText('PRESS R TO RETURN TO TOWN', CANVAS_W / 2, 193);
  }
}

// ── HUD ───────────────────────────────────────────────────────────────────────
function drawHUD(ctx, gs) {
  var floorIdx  = gs.currentFloor;
  var floorDone = floorCollectedCount(floorIdx);
  var allDone   = totalCollected();

  // Top bar — carved-wood chrome sprite if present, flat strip otherwise
  var topbar = SPRITE_TEXTURES['ui-topbar'];
  if (topbar) {
    ctx.drawImage(topbar.canvas, 0, 0, CANVAS_W, 23);
  } else {
    ctx.fillStyle = 'rgba(0,0,0,0.82)';
    ctx.fillRect(0, 0, CANVAS_W, 20);
  }

  // Floor name — left
  ctx.fillStyle = '#806040';
  ctx.font = '10px "VT323", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(FLOORS[floorIdx].name.toUpperCase(), 4, 14);

  // Per-floor program pips — center
  var pipTotal = ROUNDS[gs.currentRound].programsPerFloor;
  var pipItem  = ['program', 'card', 'key'][gs.currentRound];
  var pipLit   = SPRITE_TEXTURES['ui-pip-' + pipItem + '-lit'];
  var pipDim   = SPRITE_TEXTURES['ui-pip-' + pipItem + '-dim'];
  var pipW = pipTotal * 9 - 2;
  var pipStartX = Math.round((CANVAS_W - pipW) / 2);
  for (var j = 0; j < pipTotal; j++) {
    var pipSpr = PROGRAMS[j].collected ? pipLit : pipDim;
    if (pipSpr) {
      ctx.drawImage(pipSpr.canvas, pipStartX + j * 9, 6, 8, 8);
    } else {
      ctx.fillStyle = PROGRAMS[j].collected ? '#c0a060' : '#2a2a2a';
      ctx.fillRect(pipStartX + j * 9, 7, 7, 7);
    }
  }

  // Global count — right
  ctx.fillStyle = '#806040';
  ctx.font = '10px "VT323", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(allDone + '/' + totalPrograms(), CANVAS_W - 4, 14);

  // Stress bar — thin strip under the top bar (the topbar art bakes in the groove)
  var sFrac = gs.stress / STRESS_MAX;
  if (!topbar) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 20, CANVAS_W, 3);
  }
  if (sFrac > 0.01) {
    var sr = Math.round(90 + 165 * sFrac);
    var sg = Math.round(70 * (1 - sFrac));
    var flashHi = gs.stress >= STRESS_HUNT_THRESHOLD && Math.floor(Date.now() / 240) % 2 === 0;
    ctx.fillStyle = flashHi ? '#ff3300' : 'rgb(' + sr + ',' + sg + ',' + sg + ')';
    ctx.fillRect(0, 20, Math.round(CANVAS_W * sFrac), 3);
  }
  if (gs.stress >= STRESS_HUNT_THRESHOLD) {
    var fl2 = Math.floor(Date.now() / 400) % 2 === 0;
    if (fl2) {
      ctx.fillStyle = '#cc4444';
      ctx.font = '10px "VT323", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('HE FEELS YOUR FEAR', 4, 31);
    }
  }

  // GM warning — right, second line
  var onSameFloor = gs.gm.floor === floorIdx;
  var gmDist = onSameFloor ? dist2d(gs.player.x, gs.player.y, gs.gm.x, gs.gm.y) : 99;
  var flash = Math.floor(Date.now() / 300) % 2 === 0;
  ctx.font = 'bold 11px "VT323", monospace';
  ctx.textAlign = 'right';
  if (gs.gm.state === 'chase' && onSameFloor) {
    if (flash) {
      ctx.fillStyle = '#ff2200';
      ctx.fillText('RUN', CANVAS_W - 4, 13);
      var eyeO = SPRITE_TEXTURES['ui-eye-open'];
      if (eyeO) ctx.drawImage(eyeO.canvas,
        CANVAS_W - 4 - Math.ceil(ctx.measureText('RUN').width) - 14, 2, 11, 11);
    }
  } else if (onSameFloor && gmDist < 6) {
    var danger = Math.max(0, 1 - (gmDist - 1) / 5);
    if (flash && danger > 0.2) {
      ctx.fillStyle = 'rgba(200,80,0,' + danger.toFixed(2) + ')';
      ctx.fillText("DON'T LOOK", CANVAS_W - 4, 13);
      var eyeS = SPRITE_TEXTURES['ui-eye-shut'];
      if (eyeS) {
        ctx.globalAlpha = danger;
        ctx.drawImage(eyeS.canvas,
          CANVAS_W - 4 - Math.ceil(ctx.measureText("DON'T LOOK").width) - 14, 2, 11, 11);
        ctx.globalAlpha = 1.0;
      }
    }
  }

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
    } else if (allDone === totalPrograms() && floorIdx === ROUNDS[gs.currentRound].exitFloor) {
      var p2 = Math.floor(Date.now() / 500) % 2 === 0;
      ctx.fillStyle = p2 ? '#c0ff80' : '#80c040';
      ctx.fillText(ROUNDS[gs.currentRound].exitLabel, CANVAS_W / 2, CANVAS_H - 4);
    } else {
      var ppf = ROUNDS[gs.currentRound].programsPerFloor;
      ctx.fillStyle = '#2a2a2a';
      ctx.fillText(floorDone + ' / ' + ppf + ' on this floor', CANVAS_W / 2, CANVAS_H - 4);
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

// ── Stress FX — desaturating edge vignette + pulse at high stress ─────────────
function drawStressFX(ctx, gs) {
  var s = gs.stress / STRESS_MAX;
  if (s < 0.18) return;

  var pulse = 1;
  if (gs.stress >= STRESS_HEARTBEAT) {
    var rate = 0.004 + (gs.stress - STRESS_HEARTBEAT) * 0.00009;
    pulse = 0.85 + 0.15 * Math.abs(Math.sin(Date.now() * rate));
  }

  var grad = ctx.createRadialGradient(
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * (0.42 - 0.14 * s),
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.92
  );
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(8,0,4,' + (0.55 * s * pulse).toFixed(2) + ')');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

// ── Whisper text ──────────────────────────────────────────────────────────────
function drawWhisper(ctx, gs) {
  if (!gs.whisperText || gs.whisperMs <= 0) return;
  var t = gs.whisperMs / 3000; // 1 → 0
  var alpha = t > 0.8 ? (1 - t) / 0.2 : Math.min(1, t / 0.6);
  var drift = (1 - t) * 6;

  ctx.globalAlpha = alpha * 0.85;
  ctx.font = 'italic 14px "VT323", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9a8aa0';
  ctx.fillText(gs.whisperText, CANVAS_W / 2 + Math.sin(Date.now() * 0.002) * 2,
    CANVAS_H * 0.62 - drift);
  ctx.globalAlpha = 1.0;
  ctx.textAlign = 'left';
}

// ── Pickup flash ──────────────────────────────────────────────────────────────
function drawPickupFlash(ctx, gs) {
  if (!gs.pickupFlash || gs.pickupFlash <= 0) return;
  var alpha = gs.pickupFlash / 300;

  // Gold screen tint
  ctx.fillStyle = 'rgba(200,160,60,' + (alpha * 0.25).toFixed(2) + ')';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Collectible art centred on screen — pick full-size sprite for current round
  var tex = gs.currentRound === 2 ? (SPRITE_TEXTURES['room-key-full'] || SPRITE_TEXTURES['room-key'])
          : gs.currentRound === 1 ? SPRITE_TEXTURES['punch-card-full']
          : SPRITE_TEXTURES['program-full'];
  tex = tex || SPRITE_TEXTURES['program-full'];
  if (tex) {
    var size = Math.round(CANVAS_H * 0.55);
    ctx.globalAlpha = alpha;
    ctx.drawImage(tex.canvas,
      (CANVAS_W - size) / 2, (CANVAS_H - size) / 2,
      size, size);
    ctx.globalAlpha = 1.0;
  }
}

function drawLuckyFlash(ctx, gs) {
  if (!gs.luckyFlash || gs.luckyFlash <= 0) return;
  var total = 1800;
  var t     = gs.luckyFlash / total; // 1 → 0

  // Brief white flash at the moment of catch, fades quickly
  var flashAlpha = Math.max(0, (t - 0.7) / 0.3) * 0.6;
  if (flashAlpha > 0) {
    ctx.fillStyle = 'rgba(255,255,255,' + flashAlpha.toFixed(2) + ')';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  // "LUCKY" — drops in from top, holds, fades out
  var textAlpha = t < 0.2 ? t / 0.2 : Math.min(1, t);
  ctx.globalAlpha = textAlpha;
  var cx = CANVAS_W / 2, cy = CANVAS_H * 0.28;

  var stamp = SPRITE_TEXTURES['ui-lucky'];
  if (stamp) {
    var sw = 140;
    var sh = Math.round(sw * stamp.h / stamp.w);
    ctx.drawImage(stamp.canvas, Math.round(cx - sw / 2), Math.round(cy - sh / 2), sw, sh);
  } else {
    // Glow layer (slightly larger, low opacity)
    ctx.font      = 'bold 28px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,220,50,0.35)';
    ctx.fillText('LUCKY', cx + 1, cy + 1);
    ctx.fillText('LUCKY', cx - 1, cy - 1);

    // Core text
    ctx.fillStyle = '#ffe033';
    ctx.fillText('LUCKY', cx, cy);
  }

  ctx.globalAlpha  = 1.0;
  ctx.textAlign    = 'left';
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

  // Dim the scene behind the map — scorched survey sheet if the asset exists
  var parch = SPRITE_TEXTURES['ui-map'];
  if (parch) {
    ctx.drawImage(parch.canvas, 0, 0, CANVAS_W, CANVAS_H);
  } else {
    ctx.fillStyle = 'rgba(0,0,0,0.86)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  // Countdown + remaining uses
  var secs = Math.max(0, gs.mapTimeLeft / 1000).toFixed(1);
  ctx.font = '13px "VT323", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = gs.mapTimeLeft < 1000 ? '#ff4400' : '#806040';
  var usesLeft = (typeof gs.mapUsesLeft === 'number') ? gs.mapUsesLeft : 0;
  var usesStr  = usesLeft > 0 ? '  [' + usesLeft + ' left]' : '  [none left]';
  ctx.fillText('MAP  ' + secs + 's' + usesStr, CANVAS_W / 2, oy - 3);

  // Map background — translucent over the parchment so its grain shows through
  ctx.fillStyle = parch ? 'rgba(10,8,6,0.55)' : '#0a0806';
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
