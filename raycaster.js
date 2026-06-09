// DDA raycasting engine — produces zBuffer for sprite occlusion
// putImageData ignores ctx transforms (including DPR scale), so we render
// into a fixed 320×200 offscreen canvas then drawImage it onto the main ctx.

var _offscreen = document.createElement('canvas');
_offscreen.width  = CANVAS_W;
_offscreen.height = CANVAS_H;
var _offCtx = _offscreen.getContext('2d');

var _zBuffer = new Float32Array(CANVAS_W);

function castAndDraw(ctx, player, gs) {
  var imgData = _offCtx.createImageData(CANVAS_W, CANVAS_H);
  var buf = imgData.data;

  var halfH = CANVAS_H >> 1;

  // Head bob offset
  var bobOffset = Math.sin(player.bobPhase) * 1.5;
  var horizon = halfH + Math.round(bobOffset);

  var floorIdx = gs.currentFloor;
  var outdoor  = !!gs.isOverworld;
  var fogDist  = outdoor ? OW_FOG_DIST : FOG_DIST;
  var maxDepth = outdoor ? OW_MAX_RAY_DEPTH : MAX_RAY_DEPTH;
  var ceilBase  = outdoor ? OW_SKY_COLOR    : CEILING_COLOR;
  var floorBase = outdoor ? OW_GROUND_COLOR : FLOOR_COLOR;
  var floorTex = null, ceilTex = null;
  if (!outdoor) {
    var texOffset = ROUNDS[gs.currentRound].texOffset;
    floorTex = FLOOR_TEXTURES[texOffset + floorIdx];
    ceilTex  = CEIL_TEXTURES[texOffset + floorIdx];
  }

  // Leftmost and rightmost ray directions for floor/ceiling casting
  var rayDirX0 = player.dirX - player.planeX;
  var rayDirY0 = player.dirY - player.planeY;
  var rayDirX1 = player.dirX + player.planeX;
  var rayDirY1 = player.dirY + player.planeY;

  // ── Ceiling & floor ──────────────────────────────────────────────
  for (var y = 0; y < CANVAS_H; y++) {
    var isCeiling = y < horizon;
    var dy = isCeiling ? (horizon - y) : (y - horizon);
    var tex = isCeiling ? ceilTex : floorTex;

    if (dy === 0) {
      // Exact horizon pixel — fill dark
      for (var xh = 0; xh < CANVAS_W; xh++) {
        var ih = (y * CANVAS_W + xh) * 4;
        buf[ih] = 4; buf[ih+1] = 3; buf[ih+2] = 6; buf[ih+3] = 255;
      }
      continue;
    }

    if (tex) {
      var rowDist = halfH / dy;
      var fog = Math.min(rowDist / fogDist, 1.0);
      fog = fog * fog;
      var ff = (1 - fog) * (isCeiling ? 0.62 : 1.0);

      var floorStepX = rowDist * (rayDirX1 - rayDirX0) / CANVAS_W;
      var floorStepY = rowDist * (rayDirY1 - rayDirY0) / CANVAS_W;
      var flX = player.x + rowDist * rayDirX0;
      var flY = player.y + rowDist * rayDirY0;

      for (var x = 0; x < CANVAS_W; x++) {
        var ftx = Math.floor(tex.w * (flX - Math.floor(flX))) % tex.w;
        var fty = Math.floor(tex.h * (flY - Math.floor(flY))) % tex.h;
        var ftIdx = (fty * tex.w + ftx) * 4;
        flX += floorStepX;
        flY += floorStepY;
        var fi = (y * CANVAS_W + x) * 4;
        buf[fi]   = (tex.data[ftIdx]   * ff) | 0;
        buf[fi+1] = (tex.data[ftIdx+1] * ff) | 0;
        buf[fi+2] = (tex.data[ftIdx+2] * ff) | 0;
        buf[fi+3] = 255;
      }
    } else {
      // Flat color fallback
      var base = isCeiling ? ceilBase : floorBase;
      var t = Math.min((dy / (isCeiling ? horizon : (CANVAS_H - horizon))) * 1.4, 1.0);
      var fr = Math.round(base[0] * (1 - t) + base[0] * 0.3 * t);
      var fg = Math.round(base[1] * (1 - t) + base[1] * 0.3 * t);
      var fb = Math.round(base[2] * (1 - t) + base[2] * 0.3 * t);
      for (var xf = 0; xf < CANVAS_W; xf++) {
        var ifx = (y * CANVAS_W + xf) * 4;
        buf[ifx] = fr; buf[ifx+1] = fg; buf[ifx+2] = fb; buf[ifx+3] = 255;
      }
    }
  }

  // ── Walls ────────────────────────────────────────────────────────
  for (var col = 0; col < CANVAS_W; col++) {
    var camX = 2 * col / CANVAS_W - 1;
    var rayDX = player.dirX + player.planeX * camX;
    var rayDY = player.dirY + player.planeY * camX;

    var mapCol = Math.floor(player.x);
    var mapRow = Math.floor(player.y);

    var deltaDistX = rayDX === 0 ? 1e30 : Math.abs(1 / rayDX);
    var deltaDistY = rayDY === 0 ? 1e30 : Math.abs(1 / rayDY);

    var stepCol, stepRow, sideDistX, sideDistY;

    if (rayDX < 0) {
      stepCol = -1;
      sideDistX = (player.x - mapCol) * deltaDistX;
    } else {
      stepCol = 1;
      sideDistX = (mapCol + 1.0 - player.x) * deltaDistX;
    }
    if (rayDY < 0) {
      stepRow = -1;
      sideDistY = (player.y - mapRow) * deltaDistY;
    } else {
      stepRow = 1;
      sideDistY = (mapRow + 1.0 - player.y) * deltaDistY;
    }

    var hit = 0, side = 0, wallType = 0;
    var depth = 0;

    while (!hit && depth < maxDepth) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapCol += stepCol;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapRow += stepRow;
        side = 1;
      }
      wallType = mapAt(mapCol, mapRow);
      if (wallType > 0) hit = 1;
      depth++;
    }

    var perpDist = side === 0
      ? (mapCol - player.x + (1 - stepCol) / 2) / rayDX
      : (mapRow - player.y + (1 - stepRow) / 2) / rayDY;

    if (perpDist < 0.01) perpDist = 0.01;

    _zBuffer[col] = perpDist;

    var lineH = Math.round(CANVAS_H / perpDist);
    var drawStart = Math.max(0, horizon - (lineH >> 1));
    var drawEnd   = Math.min(CANVAS_H - 1, horizon + (lineH >> 1));

    var wfog = Math.min(perpDist / fogDist, 1.0);
    wfog = wfog * wfog;
    var fogFactor = 1 - wfog;
    var sideFactor = side === 1 ? 0.65 : 1.0;

    var wallTex = WALL_TEXTURES[wallType];

    if (wallTex) {
      // Exact position along wall face (0..1)
      var wallX = side === 0
        ? (player.y + perpDist * rayDY)
        : (player.x + perpDist * rayDX);
      wallX -= Math.floor(wallX);

      var texX = Math.floor(wallX * wallTex.w);
      if (side === 0 && rayDX > 0) texX = wallTex.w - texX - 1;
      if (side === 1 && rayDY < 0) texX = wallTex.w - texX - 1;
      texX = Math.max(0, Math.min(wallTex.w - 1, texX));

      var texStep = wallTex.h / lineH;
      var texPos  = (drawStart - horizon + (lineH >> 1)) * texStep;
      var combined = sideFactor * fogFactor;

      for (var row = drawStart; row <= drawEnd; row++) {
        var texY = Math.floor(texPos);
        texY = Math.max(0, Math.min(wallTex.h - 1, texY));
        texPos += texStep;

        var wtIdx = (texY * wallTex.w + texX) * 4;
        var wr = (wallTex.data[wtIdx]   * combined) | 0;
        var wg = (wallTex.data[wtIdx+1] * combined) | 0;
        var wb = (wallTex.data[wtIdx+2] * combined) | 0;

        if (gs && gs.flickerAmt) {
          wr = Math.max(0, Math.min(255, wr + gs.flickerAmt | 0));
          wg = Math.max(0, Math.min(255, wg + gs.flickerAmt * 0.8 | 0));
          wb = Math.max(0, Math.min(255, wb + gs.flickerAmt * 0.6 | 0));
        }

        var widx = (row * CANVAS_W + col) * 4;
        buf[widx]   = wr;
        buf[widx+1] = wg;
        buf[widx+2] = wb;
        buf[widx+3] = 255;
      }
    } else {
      // Flat color fallback
      var wc = WALL_COLORS[wallType] || [40, 40, 40];
      var wr = (wc[0] * sideFactor * fogFactor) | 0;
      var wg = (wc[1] * sideFactor * fogFactor) | 0;
      var wb = (wc[2] * sideFactor * fogFactor) | 0;

      if (gs && gs.flickerAmt) {
        wr = Math.max(0, Math.min(255, wr + gs.flickerAmt | 0));
        wg = Math.max(0, Math.min(255, wg + gs.flickerAmt * 0.8 | 0));
        wb = Math.max(0, Math.min(255, wb + gs.flickerAmt * 0.6 | 0));
      }

      for (var wrow = drawStart; wrow <= drawEnd; wrow++) {
        var widx = (wrow * CANVAS_W + col) * 4;
        buf[widx]   = wr;
        buf[widx+1] = wg;
        buf[widx+2] = wb;
        buf[widx+3] = 255;
      }
    }
  }

  _offCtx.putImageData(imgData, 0, 0);
  ctx.drawImage(_offscreen, 0, 0, CANVAS_W, CANVAS_H);
}

function getZBuffer() {
  return _zBuffer;
}
