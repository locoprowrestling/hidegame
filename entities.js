// Player and Games Master state + movement/collision

function makePlayer() {
  var s = FLOORS[0].playerStart;
  return {
    x: s.x, y: s.y, dirX: s.dirX, dirY: s.dirY,
    planeX: s.planeX, planeY: s.planeY,
    bobPhase: 0, footstepTimer: 0,
  };
}

function makeGM() {
  var s = FLOORS[0].gmStart;
  return {
    x: s.x, y: s.y,
    floor:         0,
    patrolIdx:     0,
    state:         'patrol',  // patrol | chase | to_stairs | ambush | camp | hunt | search
    lostSightMs:   0,
    floorChangeMs: GM_FLOOR_CHANGE_MS,
    stairTarget:   null,
    nextFloor:     null,
    ambushX: 0, ambushY: 0, ambushMs: 0,
    campMs: 0, huntRepathMs: 0, searchMs: 0,
    // BFS path following
    path:          null,      // [{x,y}] tile-centre steps, or null = needs compute
    pathIdx:       0,
    // Last movement vector (used for facing direction in sprite animation)
    vx: 0, vy: 0,
  };
}

// ── Player movement ───────────────────────────────────────────────────────────

function movePlayer(player, fwd, strafe, dt) {
  var speed = PLAYER_SPEED;
  var dx = player.dirX * fwd * speed + (-player.dirY) * strafe * speed;
  var dy = player.dirY * fwd * speed +   player.dirX  * strafe * speed;
  var r  = PLAYER_RADIUS;

  // Check only the LEADING edge in each axis, sampled at ±r on the other axis
  // to catch corner-grazing without falsely blocking doorway traversal.
  var nx = player.x + dx;
  if (dx !== 0) {
    var xEdge = nx + (dx > 0 ? r : -r);
    if (!isWall(Math.floor(xEdge), Math.floor(player.y + r * 0.8)) &&
        !isWall(Math.floor(xEdge), Math.floor(player.y - r * 0.8))) {
      player.x = nx;
    }
  } else {
    player.x = nx;
  }

  var ny = player.y + dy;
  if (dy !== 0) {
    var yEdge = ny + (dy > 0 ? r : -r);
    if (!isWall(Math.floor(player.x + r * 0.8), Math.floor(yEdge)) &&
        !isWall(Math.floor(player.x - r * 0.8), Math.floor(yEdge))) {
      player.y = ny;
    }
  } else {
    player.y = ny;
  }

  if (fwd !== 0 || strafe !== 0) {
    player.bobPhase += 0.18;
    player.footstepTimer -= dt;
  }
}

function rotatePlayer(player, angle) {
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  var dx  = player.dirX  * cos - player.dirY  * sin;
  var dy  = player.dirX  * sin + player.dirY  * cos;
  var px  = player.planeX * cos - player.planeY * sin;
  var py  = player.planeX * sin + player.planeY * cos;
  player.dirX = dx; player.dirY = dy;
  player.planeX = px; player.planeY = py;
}

// ── Proximity ─────────────────────────────────────────────────────────────────

function dist2d(ax, ay, bx, by) {
  var dx = ax - bx, dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

function playerDistToExit(player) {
  return dist2d(player.x, player.y, EXIT.x, EXIT.y);
}
