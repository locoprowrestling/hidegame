// Sprite rendering — programs (collectibles) and The Games Master

function drawSprites(ctx, player, gs) {
  var sprites = [];

  // Programs
  for (var i = 0; i < PROGRAMS.length; i++) {
    var p = PROGRAMS[i];
    if (p.collected) continue;
    var d = dist2d(player.x, player.y, p.x, p.y);
    sprites.push({ type: 'program', idx: i, x: p.x, y: p.y, dist: d });
  }

  // Games Master — only render when on the same floor as the player
  if (gs.gm.floor === gs.currentFloor) {
    var gmd = dist2d(player.x, player.y, gs.gm.x, gs.gm.y);
    sprites.push({ type: 'gm', x: gs.gm.x, y: gs.gm.y, dist: gmd,
                   frame: _gmAnimFrame(gs.gm, player) });
  }

  // Sort farthest first
  sprites.sort(function(a, b) { return b.dist - a.dist; });

  var zBuf = getZBuffer();
  var halfH = CANVAS_H >> 1;
  var bob = Math.sin(player.bobPhase) * 1.5;
  var horizon = halfH + Math.round(bob);

  for (var s = 0; s < sprites.length; s++) {
    var sp = sprites[s];
    _drawSprite(ctx, player, sp, zBuf, horizon, gs);
  }
}

function _drawSprite(ctx, player, sp, zBuf, horizon, gs) {
  // Sprite position relative to player
  var relX = sp.x - player.x;
  var relY = sp.y - player.y;

  // Transform to camera space using inverse of camera matrix
  var invDet = 1.0 / (player.planeX * player.dirY - player.dirX * player.planeY);
  var transformX = invDet * ( player.dirY * relX - player.dirX * relY);
  var transformY = invDet * (-player.planeY * relX + player.planeX * relY);

  if (transformY <= 0.1) return; // behind or too close

  var screenX = Math.round((CANVAS_W / 2) * (1 + transformX / transformY));

  var spriteH, spriteW;
  if (sp.type === 'gm') {
    spriteH = Math.abs(Math.round(CANVAS_H / transformY));
    spriteW = Math.round(spriteH * 0.45);
  } else {
    spriteH = Math.abs(Math.round((CANVAS_H / transformY) * 0.35));
    spriteW = spriteH;
  }

  var drawStartX = Math.max(0, screenX - (spriteW >> 1));
  var drawEndX   = Math.min(CANVAS_W - 1, screenX + (spriteW >> 1));

  var vOffset = sp.type === 'gm' ? 0 : Math.round(CANVAS_H / transformY * 0.3);
  var drawStartY = Math.max(0, horizon - (spriteH >> 1) + vOffset);
  var drawEndY   = Math.min(CANVAS_H - 1, horizon + (spriteH >> 1) + vOffset);

  // Fog factor
  var fog = Math.min(transformY / FOG_DIST, 1.0);
  fog = fog * fog;

  // GM aura — drawn before columns so it sits behind the sprite
  if (sp.type === 'gm') {
    var centerCol = Math.max(0, Math.min(CANVAS_W - 1, screenX));
    if (transformY < zBuf[centerCol]) {
      _drawGMAura(ctx, screenX, drawStartY, drawEndY, spriteW, spriteH, fog, transformY, horizon);
    }
  }

  for (var col = drawStartX; col <= drawEndX; col++) {
    if (transformY >= zBuf[col]) continue; // behind wall

    var texX = (col - (screenX - (spriteW >> 1))) / spriteW; // 0..1

    if (sp.type === 'gm') {
      _drawGMColumn(ctx, col, drawStartY, drawEndY, texX, fog, transformY, sp.frame);
    } else {
      _drawProgramColumn(ctx, col, drawStartY, drawEndY, texX, fog, transformY);
    }
  }
}

function _drawGMAura(ctx, screenX, y0, y1, spriteW, spriteH, fog, dist, horizon) {
  var t = Date.now();
  // Very slow undulation — out of phase between width and opacity for organic feel
  var breathe  = 0.5 + 0.5 * Math.sin(t * 0.00061);
  var flicker  = 0.5 + 0.5 * Math.sin(t * 0.00149);
  var nearness = Math.max(0, 1 - dist / 7);
  var baseFade = 1 - fog * 0.6;

  // Outer diffuse haze — tall and wide, very faint
  var outerW = Math.round(spriteW * (1.9 + 0.3 * breathe));
  var outerH = Math.round(spriteH * 1.15);
  ctx.globalAlpha = (0.045 + 0.025 * breathe) * baseFade;
  ctx.fillStyle = '#3d0000';
  ctx.fillRect(screenX - (outerW >> 1), y0 - Math.round(spriteH * 0.07), outerW, outerH);

  // Mid aura — tighter, slightly brighter crimson
  var midW = Math.round(spriteW * (1.3 + 0.15 * flicker));
  ctx.globalAlpha = (0.07 + 0.03 * flicker) * baseFade;
  ctx.fillStyle = '#7a0808';
  ctx.fillRect(screenX - (midW >> 1), y0, midW, y1 - y0);

  // Edge slivers — tight inner glow on the silhouette border, brightens when close
  ctx.globalAlpha = (0.06 + 0.08 * nearness * breathe) * baseFade;
  ctx.fillStyle = '#cc1a1a';
  ctx.fillRect(screenX - (spriteW >> 1) - 1, y0, 2, y1 - y0);
  ctx.fillRect(screenX + (spriteW >> 1) - 1, y0, 2, y1 - y0);

  // Dark pool at his feet — projects onto the floor plane
  var floorY = horizon + Math.round((CANVAS_H >> 1) / Math.max(dist, 0.5));
  if (floorY > 0 && floorY < CANVAS_H) {
    var poolW = Math.max(3, Math.round(spriteW * 0.9 * (1 + 0.2 * breathe)));
    var poolH = Math.max(1, Math.round(poolW * 0.18));
    ctx.globalAlpha = (0.28 + 0.12 * breathe) * baseFade;
    ctx.fillStyle = '#1a0000';
    _fillEllipse(ctx, screenX, floorY, poolW, poolH);
  }

  ctx.globalAlpha = 1.0;
}

function _drawProgramColumn(ctx, col, y0, y1, texX, fog, dist) {
  var tex = SPRITE_TEXTURES['program'];
  if (tex) {
    var srcX = Math.floor(texX * tex.w);
    ctx.drawImage(tex.canvas, srcX, 0, 1, tex.h, col, y0, 1, y1 - y0);
    if (fog > 0.02) {
      ctx.globalAlpha = fog * 0.85;
      ctx.fillStyle = '#000';
      ctx.fillRect(col, y0, 1, y1 - y0);
      ctx.globalAlpha = 1.0;
    }
    return;
  }

  // Fallback: procedural gold booklet
  var pulse = 0.75 + 0.25 * Math.sin(Date.now() * 0.003);
  var r = Math.min(255, (220 * pulse * (1 - fog)) | 0);
  var g = Math.min(255, (180 * pulse * (1 - fog)) | 0);
  var b = (60 * (1 - fog)) | 0;
  ctx.globalAlpha = 1.0 - fog * 0.85;
  ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
  ctx.fillRect(col, y0, 1, y1 - y0);
  ctx.globalAlpha = 1.0;
}

// ── Stair indicators ─────────────────────────────────────────────────────────

function drawStairIndicators(ctx, player, gs) {
  var exits = FLOORS[gs.currentFloor].exits;
  var halfH = CANVAS_H >> 1;
  var bob = Math.sin(player.bobPhase) * 1.5;
  var horizon = halfH + Math.round(bob);
  var zBuf = getZBuffer();

  for (var i = 0; i < exits.length; i++) {
    var ex = exits[i];

    var relX = ex.x - player.x;
    var relY = ex.y - player.y;

    var invDet = 1.0 / (player.planeX * player.dirY - player.dirX * player.planeY);
    var transformX = invDet * ( player.dirY * relX - player.dirX * relY);
    var transformY = invDet * (-player.planeY * relX + player.planeX * relY);

    if (transformY <= 0.2) continue;

    var screenX = Math.round((CANVAS_W / 2) * (1 + transformX / transformY));
    if (screenX < -24 || screenX > CANVAS_W + 24) continue;

    // Occluded by a wall?
    var zCol = Math.max(0, Math.min(CANVAS_W - 1, screenX));
    if (transformY >= zBuf[zCol]) continue;

    var scale = CANVAS_H / transformY;
    var screenY = horizon - scale * 0.28; // float above eye level
    var size = Math.min(15, Math.max(4, scale * 0.13));

    var fog = Math.min(transformY / FOG_DIST, 1.0);
    fog = fog * fog;
    var alpha = 1.0 - fog * 0.75;
    var pulse = 0.72 + 0.28 * Math.sin(Date.now() * 0.004 + i);
    var goingUp = ex.toFloor > gs.currentFloor;

    // Floor halo — ellipse projected onto the ground plane
    var floorY = horizon + Math.round((CANVAS_H >> 1) / transformY);
    if (floorY < CANVAS_H) {
      var haloW = Math.min(28, Math.max(5, scale * 0.38));
      var haloH = Math.max(2, haloW * 0.18);
      ctx.globalAlpha = alpha * pulse * 0.22;
      ctx.fillStyle = '#0088ff';
      _fillEllipse(ctx, screenX, floorY, haloW * 1.6, haloH * 1.6);
      ctx.globalAlpha = alpha * pulse * 0.5;
      ctx.fillStyle = '#55bbff';
      _fillEllipse(ctx, screenX, floorY, haloW, haloH);
    }

    // Outer glow
    ctx.globalAlpha = alpha * pulse * 0.35;
    ctx.fillStyle = '#0088ff';
    _fillArrow(ctx, screenX, screenY, size * 1.65, goingUp);

    // Bright core
    ctx.globalAlpha = alpha * pulse;
    ctx.fillStyle = '#99ddff';
    _fillArrow(ctx, screenX, screenY, size, goingUp);

    ctx.globalAlpha = 1.0;
  }
}

function _fillEllipse(ctx, cx, cy, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function _fillArrow(ctx, cx, cy, s, up) {
  var d = up ? -1 : 1;
  ctx.beginPath();
  ctx.moveTo(cx,            cy + d * -s * 0.9); // tip
  ctx.lineTo(cx - s * 0.65, cy + d *  s * 0.2); // arrowhead left
  ctx.lineTo(cx - s * 0.25, cy + d *  s * 0.2); // notch left
  ctx.lineTo(cx - s * 0.25, cy + d *  s * 0.9); // shaft bottom-left
  ctx.lineTo(cx + s * 0.25, cy + d *  s * 0.9); // shaft bottom-right
  ctx.lineTo(cx + s * 0.25, cy + d *  s * 0.2); // notch right
  ctx.lineTo(cx + s * 0.65, cy + d *  s * 0.2); // arrowhead right
  ctx.closePath();
  ctx.fill();
}

function _gmAnimFrame(gm, player) {
  var t = Date.now();
  var speed = Math.sqrt(gm.vx * gm.vx + gm.vy * gm.vy);

  if (gm.state === 'chase') return 'gm-lunge';

  if (gm.state === 'to_stairs') {
    return Math.floor(t / 200) % 2 === 0 ? 'gm-back-a' : 'gm-back-b';
  }

  // patrol — determine if GM is roughly facing the player
  var facingPlayer = true;
  if (speed > 0.001) {
    var dpx = player.x - gm.x, dpy = player.y - gm.y;
    facingPlayer = (gm.vx * dpx + gm.vy * dpy) >= 0;
  }

  if (speed < 0.002) {
    return facingPlayer ? 'gm-idle' : 'gm-back';
  }
  if (facingPlayer) {
    return Math.floor(t / 280) % 2 === 0 ? 'gm-walk-a' : 'gm-walk-b';
  } else {
    return Math.floor(t / 280) % 2 === 0 ? 'gm-back-a' : 'gm-back-b';
  }
}

function _drawGMColumn(ctx, col, y0, y1, texX, fog, dist, frame) {
  var tex = frame && SPRITE_TEXTURES[frame];
  if (tex) {
    var srcX = Math.floor(texX * tex.w);
    // Slow spectral flicker — each column slightly out of phase for a shimmer edge
    var phase = Date.now() * 0.00088 + col * 0.031;
    var spectral = 0.78 + 0.22 * Math.sin(phase);
    ctx.globalAlpha = spectral;
    ctx.drawImage(tex.canvas, srcX, 0, 1, tex.h, col, y0, 1, y1 - y0);
    if (fog > 0.02) {
      ctx.globalAlpha = fog * 0.6 * spectral; // GM stays visible in fog longer than walls
      ctx.fillStyle = '#000';
      ctx.fillRect(col, y0, 1, y1 - y0);
    }
    ctx.globalAlpha = 1.0;
    return;
  }

  // Fallback: procedural dark silhouette
  var minFog = fog * 0.6;
  var r = (10 * (1 - minFog)) | 0;
  var g = (18 * (1 - minFog * 0.5)) | 0;
  var b = (10 * (1 - minFog)) | 0;
  ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
  ctx.fillRect(col, y0, 1, y1 - y0);
  if (dist < 8) {
    var h = y1 - y0;
    var eyeAlpha = Math.max(0, (8 - dist) / 8) * 0.9;
    if (texX > 0.28 && texX < 0.42 || texX > 0.58 && texX < 0.72) {
      ctx.globalAlpha = eyeAlpha;
      ctx.fillStyle = '#ff2200';
      ctx.fillRect(col, y0 + (h * 0.08 | 0), 1, h * 0.06 | 0);
      ctx.globalAlpha = 1.0;
    }
  }
}
