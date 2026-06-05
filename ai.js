// Games Master AI
//
// States:
//   patrol    — follows BFS-computed paths between waypoints on current floor
//   chase     — direct pursuit (LOS already clear, no pathfinding needed)
//   to_stairs — BFS path to exit tile, then floor transition

function updateGM(gm, player, playerFloor, dt) {

  // ── to_stairs: walk to exit then transition ──────────────────────────────
  if (gm.state === 'to_stairs') {
    var arrived = _gmFollowPath(gm, gm.stairTarget.x, gm.stairTarget.y, GM_PATROL_SPEED, 0.4);
    if (arrived) {
      gm.floor       = gm.nextFloor;
      gm.x           = gm.stairTarget.x;
      gm.y           = gm.stairTarget.y;
      gm.state       = 'patrol';
      gm.patrolIdx   = 0;
      gm.path        = null;
      gm.pathIdx     = 0;
      gm.stairTarget = null;
      gm.nextFloor   = null;
      gm.floorChangeMs = GM_FLOOR_CHANGE_MS + (Math.random() - 0.5) * 15000;
    }
    return;
  }

  // ── floor-change timer (only outside chase) ──────────────────────────────
  if (gm.state !== 'chase' && gm.state !== 'search') {
    gm.floorChangeMs -= dt;
    if (gm.floorChangeMs <= 0) {
      _gmPlanFloorChange(gm, playerFloor);
      if (gm.state === 'to_stairs') return;
      gm.floorChangeMs = GM_FLOOR_CHANGE_MS;
    }
  }

  // ── act on current floor only ─────────────────────────────────────────────
  if (gm.floor !== playerFloor) {
    _gmPatrol(gm);
    return;
  }

  if (gm.state === 'patrol') {
    _gmPatrol(gm);
    var hasSight = _gmHasSight(gm, player);
    var tooClose = dist2d(gm.x, gm.y, player.x, player.y) < GM_PROX_DIST;
    if (hasSight && (tooClose || _playerLooksAtGM(player, gm))) {
      gm.state        = 'chase';
      gm.lostSightMs  = 0;
      gm.lastKnownX   = player.x;
      gm.lastKnownY   = player.y;
      gm.path         = null;
    }
  } else if (gm.state === 'search') {
    // Walk to last known position, then return to patrol
    var arrived = _gmFollowPath(gm, gm.lastKnownX, gm.lastKnownY, GM_PATROL_SPEED, 0.5);
    gm.searchMs = (gm.searchMs || 0) + dt;
    if (arrived || gm.searchMs >= GM_SEARCH_MS) {
      gm.state    = 'patrol';
      gm.searchMs = 0;
      gm.path     = null;
    }
  } else if (gm.state === 'chase') {
    _gmMoveToward(gm, player.x, player.y, GM_CHASE_SPEED);
    if (_gmHasSight(gm, player)) {
      gm.lostSightMs = 0;
      gm.lastKnownX  = player.x;
      gm.lastKnownY  = player.y;
    } else {
      gm.lostSightMs += dt;
      if (gm.lostSightMs >= GM_LOSE_CHASE_MS) {
        gm.state       = 'search';
        gm.lostSightMs = 0;
        gm.searchMs    = 0;
        gm.path        = null;
      }
    }
  }
}

// ── BFS pathfinding ───────────────────────────────────────────────────────────
// Returns [{x, y}] tile centres from start to end (exclusive of start tile),
// or [] if already at destination, or null if no path exists.
function _bfsPath(fx, fy, tx, ty, floorIdx) {
  var sc = Math.floor(fx), sr = Math.floor(fy);
  var ec = Math.floor(tx), er = Math.floor(ty);
  if (sc === ec && sr === er) return [];

  var queue    = [[sc, sr]];
  var visited  = {};
  var cameFrom = {};
  var startKey = sc + ',' + sr;
  visited[startKey] = true;

  var found = false;
  outer: while (queue.length > 0) {
    var cur = queue.shift();
    var cc = cur[0], cr = cur[1];
    var dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    for (var i = 0; i < dirs.length; i++) {
      var nc = cc + dirs[i][0], nr = cr + dirs[i][1];
      var nk = nc + ',' + nr;
      if (visited[nk] || isWallOnFloor(nc, nr, floorIdx)) continue;
      visited[nk]  = true;
      cameFrom[nk] = cc + ',' + cr;
      if (nc === ec && nr === er) { found = true; break outer; }
      queue.push([nc, nr]);
    }
  }

  if (!found) return null;

  var path = [];
  var key  = ec + ',' + er;
  while (key !== startKey) {
    var parts = key.split(',');
    path.unshift({ x: +parts[0] + 0.5, y: +parts[1] + 0.5 });
    key = cameFrom[key];
  }
  return path;
}

// Follows the stored BFS path toward (destX, destY).
// Returns true once within `arrivalDist` of destination.
// Automatically recomputes the path if gm.path is null.
function _gmFollowPath(gm, destX, destY, speed, arrivalDist) {
  // Recompute path if needed
  if (!gm.path) {
    gm.path    = _bfsPath(gm.x, gm.y, destX, destY, gm.floor) || [];
    gm.pathIdx = 0;
  }

  // Walk path steps
  while (gm.pathIdx < gm.path.length) {
    var step = gm.path[gm.pathIdx];
    if (dist2d(gm.x, gm.y, step.x, step.y) < 0.28) {
      gm.pathIdx++;
    } else {
      _gmMoveToward(gm, step.x, step.y, speed);
      return false;
    }
  }

  // Path exhausted — close enough to destination?
  if (dist2d(gm.x, gm.y, destX, destY) < arrivalDist) return true;

  // Overshot or path was empty — nudge directly
  _gmMoveToward(gm, destX, destY, speed);
  return dist2d(gm.x, gm.y, destX, destY) < arrivalDist;
}

// ── Patrol ────────────────────────────────────────────────────────────────────
function _gmPatrol(gm) {
  var patrol = FLOORS[gm.floor].gmPatrol;
  var wp     = patrol[gm.patrolIdx % patrol.length];

  var arrived = _gmFollowPath(gm, wp.x, wp.y, GM_PATROL_SPEED, 0.35);
  if (arrived) {
    gm.patrolIdx = (gm.patrolIdx + 1) % patrol.length;
    gm.path      = null; // force recompute for next waypoint
    gm.pathIdx   = 0;
  }
}

// ── Floor change ──────────────────────────────────────────────────────────────
function _gmPlanFloorChange(gm, playerFloor) {
  var delta  = playerFloor > gm.floor ? 1 : playerFloor < gm.floor ? -1 : 0;
  var target = Math.random() < GM_FOLLOW_PROB
    ? gm.floor + (delta !== 0 ? delta : (Math.random() < 0.5 ? 1 : -1))
    : gm.floor + (Math.random() < 0.5 ? 1 : -1);
  target = Math.max(0, Math.min(FLOORS.length - 1, target));
  if (target === gm.floor) {
    // Got clamped back (e.g. tried floor -1 from floor 0) — pick the only valid direction
    if (gm.floor === 0) target = 1;
    else if (gm.floor === FLOORS.length - 1) target = FLOORS.length - 2;
    else target = gm.floor + (Math.random() < 0.5 ? 1 : -1);
  }
  if (target === gm.floor) return;

  var exits  = FLOORS[gm.floor].exits;
  var chosen = null;
  for (var i = 0; i < exits.length; i++) {
    if (exits[i].toFloor === target) { chosen = exits[i]; break; }
  }
  if (!chosen) {
    for (var i = 0; i < exits.length; i++) {
      var going = exits[i].toFloor > gm.floor ? 1 : -1;
      if (going === Math.sign(target - gm.floor)) { chosen = exits[i]; break; }
    }
  }
  if (!chosen) return;

  gm.state       = 'to_stairs';
  gm.stairTarget = { x: chosen.x, y: chosen.y };
  gm.nextFloor   = chosen.toFloor;
  gm.path        = null; // recompute toward staircase
  gm.pathIdx     = 0;
}

// ── Detection ─────────────────────────────────────────────────────────────────
function _playerLooksAtGM(player, gm) {
  var dist = dist2d(player.x, player.y, gm.x, gm.y);
  if (dist > GM_SIGHT_DIST) return false;
  var nx = (gm.x - player.x) / dist;
  var ny = (gm.y - player.y) / dist;
  return (nx * player.dirX + ny * player.dirY) > 0.78;
}

function _gmHasSight(gm, player) {
  var d = dist2d(gm.x, gm.y, player.x, player.y);
  if (d > GM_SIGHT_DIST) return false;
  var steps = Math.ceil(d * 4);
  var dx = (player.x - gm.x) / steps;
  var dy = (player.y - gm.y) / steps;
  for (var i = 1; i < steps; i++) {
    if (isWallOnFloor(Math.floor(gm.x + dx * i), Math.floor(gm.y + dy * i), gm.floor)) return false;
  }
  return true;
}

// ── Low-level movement (GM's own floor for collision) ─────────────────────────
function _gmMoveToward(gm, tx, ty, speed) {
  var dx = tx - gm.x, dy = ty - gm.y;
  var d  = Math.sqrt(dx * dx + dy * dy);
  if (d < 0.01) { gm.vx = 0; gm.vy = 0; return; }
  gm.vx = (dx / d) * speed;
  gm.vy = (dy / d) * speed;
  var nx = gm.x + gm.vx;
  var ny = gm.y + gm.vy;
  if (!isWallOnFloor(Math.floor(nx), Math.floor(gm.y), gm.floor)) gm.x = nx;
  if (!isWallOnFloor(Math.floor(gm.x), Math.floor(ny), gm.floor)) gm.y = ny;
}

function gmCaughtPlayer(gm, player, playerFloor) {
  return gm.floor === playerFloor &&
    dist2d(gm.x, gm.y, player.x, player.y) < GM_CATCH_DIST;
}
