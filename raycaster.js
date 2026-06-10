// DDA raycasting engine — produces zBuffer for sprite occlusion
// putImageData ignores ctx transforms (including DPR scale), so we render
// into a fixed 320×200 offscreen canvas then drawImage it onto the main ctx.

var _offscreen = document.createElement('canvas');
_offscreen.width  = CANVAS_W;
_offscreen.height = CANVAS_H;
var _offCtx = _offscreen.getContext('2d');

var _zBuffer = new Float32Array(CANVAS_W);

// ── Frame lighting ────────────────────────────────────────────────────────────
// Per-channel light multipliers: `n*` right at the player (lantern), `f*` deep
// in the fog. An organic candle flicker rides on the whole frame, and the
// Games Master drains light (and bleeds the warmth out of it) as he closes in.
function _frameLight(gs, outdoor) {
  var cfg = outdoor ? OW_LIGHT : (ROUND_LIGHT[gs.currentRound] || ROUND_LIGHT[0]);
  var t = Date.now();
  var fl = 0.962 + 0.026 * Math.sin(t * 0.0021)
                 + 0.018 * Math.sin(t * 0.0127 + 2.1)
                 + 0.012 * Math.sin(t * 0.047  + 0.7);
  var drain = 0;
  if (gs.gm && gs.player && gs.gm.floor === gs.currentFloor) {
    var d = dist2d(gs.player.x, gs.player.y, gs.gm.x, gs.gm.y);
    drain = Math.max(0, 1 - d / LIGHT_GM_RANGE);
  }
  var k = Math.min(1, fl) * (1 - LIGHT_GM_DRAIN * drain);
  var cool = 1 - 0.14 * drain;   // green/blue die first — the light goes red-dark
  return {
    nr: cfg.near[0] * k, ng: cfg.near[1] * k * cool, nb: cfg.near[2] * k * cool * cool,
    fr: cfg.far[0]  * k, fg: cfg.far[1]  * k * cool, fb: cfg.far[2]  * k * cool * cool,
  };
}

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
  } else {
    floorTex = FLOOR_TEXTURES['ow_ground'] || null;
  }

  var lt = _frameLight(gs, outdoor);
  var decLk = (typeof getDecalLookup === 'function') ? getDecalLookup(gs) : null;

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
      var ffk = (1 - fog) * (isCeiling ? 0.62 : 1.0);
      var fLR = ffk * (lt.nr + (lt.fr - lt.nr) * fog);
      var fLG = ffk * (lt.ng + (lt.fg - lt.ng) * fog);
      var fLB = ffk * (lt.nb + (lt.fb - lt.nb) * fog);

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
        buf[fi]   = (tex.data[ftIdx]   * fLR) | 0;
        buf[fi+1] = (tex.data[ftIdx+1] * fLG) | 0;
        buf[fi+2] = (tex.data[ftIdx+2] * fLB) | 0;
        buf[fi+3] = 255;
      }
    } else {
      // Flat color fallback
      var base = isCeiling ? ceilBase : floorBase;
      var t = Math.min((dy / (isCeiling ? horizon : (CANVAS_H - horizon))) * 1.4, 1.0);
      var fr = Math.round(base[0] * (1 - t) + base[0] * 0.3 * t);
      var fg = Math.round(base[1] * (1 - t) + base[1] * 0.3 * t);
      var fb = Math.round(base[2] * (1 - t) + base[2] * 0.3 * t);
      var starry = outdoor && isCeiling;
      for (var xf = 0; xf < CANVAS_W; xf++) {
        var ifx = (y * CANVAS_W + xf) * 4;
        buf[ifx] = fr; buf[ifx+1] = fg; buf[ifx+2] = fb; buf[ifx+3] = 255;
        if (starry && (((xf * 2654435761) ^ (y * 40503)) >>> 0) % 1021 < 1) {
          // Sparse, dim stars — brighter higher in the sky
          var sb = 60 + ((xf ^ y) % 50) + (t * 50) | 0;
          buf[ifx] = sb - 14; buf[ifx+1] = sb - 8; buf[ifx+2] = sb;
        }
      }
    }
  }

  // ── Walls ────────────────────────────────────────────────────────
  var skyR = OW_SKY_COLOR[0], skyG = OW_SKY_COLOR[1], skyB = OW_SKY_COLOR[2];

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

      var flipped = (side === 0 && rayDX > 0) || (side === 1 && rayDY < 0);
      var texX = Math.floor(wallX * wallTex.w);
      if (flipped) texX = wallTex.w - texX - 1;
      texX = Math.max(0, Math.min(wallTex.w - 1, texX));

      // Decal hanging on this wall face?
      var dec = null, decColX = 0;
      if (decLk) {
        var face = side === 0 ? (stepCol === 1 ? 'W' : 'E')
                              : (stepRow === 1 ? 'N' : 'S');
        var dd = decLk[mapCol + ',' + mapRow + ',' + face];
        if (dd) {
          var dt = DECAL_TEXTURES[dd.tex];
          var fx = 1 - wallX;
          if (dt && fx >= DECAL_X0 && fx <= DECAL_X1) {
            dec = dt;
            decColX = Math.min(dt.w - 1,
              ((fx - DECAL_X0) / (DECAL_X1 - DECAL_X0) * dt.w) | 0);
          }
        }
      }

      var texStep = wallTex.h / lineH;
      var texPos  = (drawStart - horizon + (lineH >> 1)) * texStep;
      var base = sideFactor * fogFactor;
      var cR = base * (lt.nr + (lt.fr - lt.nr) * wfog);
      var cG = base * (lt.ng + (lt.fg - lt.ng) * wfog);
      var cB = base * (lt.nb + (lt.fb - lt.nb) * wfog);

      for (var row = drawStart; row <= drawEnd; row++) {
        var texY = Math.floor(texPos);
        texY = Math.max(0, Math.min(wallTex.h - 1, texY));
        texPos += texStep;

        var srcData = wallTex.data;
        var srcIdx = (texY * wallTex.w + texX) * 4;

        if (dec) {
          var v = texY / wallTex.h;
          if (v >= DECAL_Y0 && v <= DECAL_Y1) {
            var dyTex = Math.min(dec.h - 1,
              ((v - DECAL_Y0) / (DECAL_Y1 - DECAL_Y0) * dec.h) | 0);
            var di = (dyTex * dec.w + decColX) * 4;
            if (dec.data[di + 3] > 127) { srcData = dec.data; srcIdx = di; }
          }
        }

        var wr = (srcData[srcIdx]   * cR) | 0;
        var wg = (srcData[srcIdx+1] * cG) | 0;
        var wb = (srcData[srcIdx+2] * cB) | 0;

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
      var fbase = sideFactor * fogFactor;
      var wr = (wc[0] * fbase * (lt.nr + (lt.fr - lt.nr) * wfog)) | 0;
      var wg = (wc[1] * fbase * (lt.ng + (lt.fg - lt.ng) * wfog)) | 0;
      var wb = (wc[2] * fbase * (lt.nb + (lt.fb - lt.nb) * wfog)) | 0;

      if (gs && gs.flickerAmt) {
        wr = Math.max(0, Math.min(255, wr + gs.flickerAmt | 0));
        wg = Math.max(0, Math.min(255, wg + gs.flickerAmt * 0.8 | 0));
        wb = Math.max(0, Math.min(255, wb + gs.flickerAmt * 0.6 | 0));
      }

      for (var wrow = drawStart; wrow <= drawEnd; wrow++) {
        var widx2 = (wrow * CANVAS_W + col) * 4;
        buf[widx2]   = wr;
        buf[widx2+1] = wg;
        buf[widx2+2] = wb;
        buf[widx2+3] = 255;
      }
    }

    // ── Fake upper storeys (overworld) ─────────────────────────────
    // Continue the same ray past the first hit, collecting tall facades; draw
    // their upper floors near→far, clipped above the silhouette of everything
    // nearer (topLimit).
    if (outdoor) {
      var hits = [{ dist: perpDist, type: wallType, side: side }];
      var depth2 = depth, extra = 0;
      while (depth2 < maxDepth && extra < 4) {
        var hSide;
        if (sideDistX < sideDistY) {
          sideDistX += deltaDistX; mapCol += stepCol; hSide = 0;
        } else {
          sideDistY += deltaDistY; mapRow += stepRow; hSide = 1;
        }
        depth2++;
        var t2 = mapAt(mapCol, mapRow);
        if (t2 > 0 && BUILDING_STORIES[t2] > 1) {
          var d2 = hSide === 0
            ? (mapCol - player.x + (1 - stepCol) / 2) / rayDX
            : (mapRow - player.y + (1 - stepRow) / 2) / rayDY;
          if (d2 > perpDist + 0.05) {
            hits.push({ dist: d2, type: t2, side: hSide });
            extra++;
          }
        }
      }

      var topLimit = drawStart;
      for (var hi = 0; hi < hits.length; hi++) {
        var hh = hits[hi];
        var S = BUILDING_STORIES[hh.type] || 1;
        if (S <= 1 || topLimit <= 0) continue;

        var hDist = Math.max(hh.dist, 0.01);
        var hLineH = Math.round(CANVAS_H / hDist);
        var hTop = horizon - (hLineH >> 1);
        var hFog = Math.min(hDist / fogDist, 1.0);
        hFog = hFog * hFog;
        var hSideF = hh.side === 1 ? 0.65 : 1.0;

        var utex = UPPER_TEXTURES[hh.type] || WALL_TEXTURES[hh.type];
        if (!utex) continue;

        var wx = hh.side === 0
          ? (player.y + hh.dist * rayDY)
          : (player.x + hh.dist * rayDX);
        wx -= Math.floor(wx);
        var uTexX = Math.floor(wx * utex.w);
        if ((hh.side === 0 && rayDX > 0) || (hh.side === 1 && rayDY < 0))
          uTexX = utex.w - uTexX - 1;
        uTexX = Math.max(0, Math.min(utex.w - 1, uTexX));

        var uBase = hSideF * (1 - hFog);
        var uR = uBase * (lt.nr + (lt.fr - lt.nr) * hFog);
        var uG = uBase * (lt.ng + (lt.fg - lt.ng) * hFog);
        var uB = uBase * (lt.nb + (lt.fb - lt.nb) * hFog);

        for (var s = 1; s < S; s++) {
          var segBot = hTop - (s - 1) * hLineH - 1;
          var segTop = hTop - s * hLineH;
          if (segBot < 0) break;
          var y0 = Math.max(0, segTop);
          var y1 = Math.min(segBot, topLimit - 1);
          if (y1 < y0) continue;

          var dim = Math.max(0.12, 1 - s * STORY_DIM);
          var skyMix = s >= STORY_FADE_START
            ? Math.min(0.92, (s - STORY_FADE_START + 1) * STORY_FADE_RATE)
            : 0;
          var keep = 1 - skyMix;
          var sR = uR * dim * keep, sG = uG * dim * keep, sB2 = uB * dim * keep;
          var addR = skyR * skyMix, addG = skyG * skyMix, addB = skyB * skyMix;

          for (var urow = y0; urow <= y1; urow++) {
            var uty = (((urow - segTop) / hLineH) * utex.h) | 0;
            if (uty >= utex.h) uty = utex.h - 1;
            var uIdx = (uty * utex.w + uTexX) * 4;
            var bIdx = (urow * CANVAS_W + col) * 4;
            buf[bIdx]   = (utex.data[uIdx]   * sR + addR) | 0;
            buf[bIdx+1] = (utex.data[uIdx+1] * sG + addG) | 0;
            buf[bIdx+2] = (utex.data[uIdx+2] * sB2 + addB) | 0;
            buf[bIdx+3] = 255;
          }
        }

        var fullTop = hTop - (S - 1) * hLineH;
        if (fullTop < topLimit) topLimit = fullTop;
      }
    }
  }

  _offCtx.putImageData(imgData, 0, 0);
  ctx.drawImage(_offscreen, 0, 0, CANVAS_W, CANVAS_H);
}

function getZBuffer() {
  return _zBuffer;
}
