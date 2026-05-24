// ─────────────────────────────────────────────────────────────────
// ai.js — Enemy state machine, Ally state machine, collision, vision
// Depends on: constants.js, world.js, entities.js
// ─────────────────────────────────────────────────────────────────

// ─── Tile-based AABB collision ────────────────────────────────────
// Attempts to move entity by (dx, dy), sliding on walls.
// entity must have: x, y, width, height, room (Room)
// Returns nothing — mutates entity.x / entity.y
function moveWithCollision(entity, dx, dy) {
  var room = entity.room;

  // Try X movement
  var nx = entity.x + dx;
  if (canOccupy(room, nx, entity.y, entity.width, entity.height)) {
    entity.x = nx;
  }

  // Try Y movement independently (sliding)
  var ny = entity.y + dy;
  if (canOccupy(room, entity.x, ny, entity.width, entity.height)) {
    entity.y = ny;
  }

  // Clamp to screen bounds (0 to CANVAS_SIZE - size)
  entity.x = Math.max(0, Math.min(CANVAS_SIZE - entity.width,  entity.x));
  entity.y = Math.max(0, Math.min(CANVAS_SIZE - entity.height, entity.y));
}

// canOccupy — checks all 4 corners of the entity bounding box
function canOccupy(room, x, y, w, h) {
  var corners = [
    [x,         y        ],
    [x + w - 1, y        ],
    [x,         y + h - 1],
    [x + w - 1, y + h - 1]
  ];
  for (var i = 0; i < corners.length; i++) {
    var tc = pixelToTile(corners[i][0]);
    var tr = pixelToTile(corners[i][1]);
    if (!room.isPassable(tc, tr)) {
      return false;
    }
  }
  return true;
}

// ─── Vision cone test ─────────────────────────────────────────────
// Returns true if targetEntity is inside enemy's vision cone
// AND no wall tile interrupts the straight line between them.
//
// enemy: Enemy (has facingAngle, x, y, room)
// target: Player (has x, y, width, height)
// ignoreHidden: if true, always returns false when target.isHidden
function isInVisionCone(enemy, target, ignoreHidden) {
  if (ignoreHidden && target.isHidden) return false;

  // Only test if on same screen
  if (enemy.screenCol !== target.screenCol) return false;
  if (enemy.screenRow !== target.screenRow) return false;

  var ex = enemy.x + enemy.width  / 2;
  var ey = enemy.y + enemy.height / 2;
  var tx = target.x + target.width  / 2;
  var ty = target.y + target.height / 2;

  var dx = tx - ex;
  var dy = ty - ey;
  var distPx = Math.sqrt(dx * dx + dy * dy);

  if (distPx > VISION_CONE_DEPTH * TILE_SIZE) return false;

  var angleToTarget = Math.atan2(dy, dx);
  var halfCone = (VISION_CONE_ANGLE / 2) * (Math.PI / 180);
  var diff = Math.abs(angleDiff(enemy.facingAngle, angleToTarget));

  if (diff > halfCone) return false;

  // Ray march — check tiles along the line at half-tile steps
  var steps = Math.ceil(distPx / (TILE_SIZE / 2));
  for (var i = 1; i <= steps; i++) {
    var t  = i / steps;
    var rx = ex + dx * t;
    var ry = ey + dy * t;
    var tc = pixelToTile(rx);
    var tr = pixelToTile(ry);
    var tile = enemy.room.getTile(tc, tr);
    if (tile === TILE_WALL || tile === TILE_OBSTACLE) return false;
  }

  return true;
}

// angleDiff — smallest signed difference between two angles in radians
function angleDiff(a, b) {
  var d = b - a;
  while (d >  Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

// ─── Move toward a pixel target ───────────────────────────────────
// Moves entity toward (tx, ty) at given speed using moveWithCollision.
// Returns true if entity is within 2px of target (arrived).
function moveToward(entity, tx, ty, speed) {
  var dx = tx - (entity.x + entity.width  / 2);
  var dy = ty - (entity.y + entity.height / 2);
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 2) return true; // arrived

  entity.facingAngle = Math.atan2(dy, dx);
  var nx = (dx / dist) * speed;
  var ny = (dy / dist) * speed;
  moveWithCollision(entity, nx, ny);
  return false;
}

// ─── Enemy state machine update ───────────────────────────────────
// Call once per frame per enemy.
// gs: GameState reference (provides player, grid, hidingSpots, etc.)
// dt: delta time in ms
function updateEnemy(enemy, player, grid, dt) {
  switch (enemy.state) {
    case STATE_PATROL:
      updateEnemyPatrol(enemy, player);
      break;
    case STATE_ALERTED:
      updateEnemyAlerted(enemy, player);
      break;
    case STATE_CHASING:
      updateEnemyChasing(enemy, player, dt);
      break;
    case STATE_SEARCHING:
      updateEnemySearching(enemy, dt);
      break;
    case STATE_RETURNING:
      updateEnemyReturning(enemy, grid, dt);
      break;
  }
}

function updateEnemyPatrol(enemy, player) {
  // Walk toward current waypoint
  var wp   = enemy.patrolPoints[enemy.patrolIndex];
  var wpPx = wp[0] * TILE_SIZE;
  var wpPy = wp[1] * TILE_SIZE;
  var arrived = moveToward(enemy, wpPx, wpPy, ENEMY_PATROL_SPEED);
  if (arrived) {
    enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.patrolPoints.length;
  }

  // Check vision cone for player (hidden player ignored)
  if (isInVisionCone(enemy, player, true)) {
    enemy.state         = STATE_ALERTED;
    enemy.alertedFrames = ALERTED_FRAMES;
  }
}

function updateEnemyAlerted(enemy, player) {
  enemy.alertedFrames--;
  if (enemy.alertedFrames <= 0) {
    enemy.state = STATE_CHASING;
  }
  // Capture last known position immediately
  enemy.lastKnownX = player.x + player.width  / 2;
  enemy.lastKnownY = player.y + player.height / 2;
}

function updateEnemyChasing(enemy, player, dt) {
  var sameScreen = (enemy.screenCol === player.screenCol &&
                    enemy.screenRow === player.screenRow);

  if (sameScreen) {
    // Check close-detect radius (ignores hiding)
    var distTiles = entityDistTiles(enemy, player);
    if (player.isHidden && distTiles > player.hideDetectRadius) {
      // Lost sight — start searching at last known position
      enemy.state       = STATE_SEARCHING;
      enemy.searchTimer = SEARCH_TIMEOUT;
      return;
    }

    // Update last known (only when visible — intentional: hidden player is sensed
    // within hideDetectRadius but enemy still moves toward last seen position, not
    // exact hiding spot. This gives the player a chance to escape if well-hidden.)
    if (!player.isHidden) {
      enemy.lastKnownX = player.x + player.width  / 2;
      enemy.lastKnownY = player.y + player.height / 2;
    }

    // Move toward last known position (or current if visible)
    var chaseX = player.isHidden ? enemy.lastKnownX : player.x + player.width  / 2;
    var chaseY = player.isHidden ? enemy.lastKnownY : player.y + player.height / 2;
    moveToward(enemy, chaseX, chaseY, ENEMY_CHASE_SPEED);
    enemy.isChasing = true;
  } else {
    // Player left the screen — give up after SEARCH_TIMEOUT
    // Reset to full timeout on first frame off-screen to avoid stale timer values
    if (enemy.searchTimer <= 0) enemy.searchTimer = SEARCH_TIMEOUT;
    enemy.searchTimer -= dt;
    if (enemy.searchTimer <= 0) {
      enemy.isChasing = false;
      enemy.state     = STATE_RETURNING;
    }
  }
}

function updateEnemySearching(enemy, dt) {
  // Move to last known position
  var arrived = moveToward(
    enemy,
    enemy.lastKnownX,
    enemy.lastKnownY,
    ENEMY_PATROL_SPEED
  );

  enemy.searchTimer -= dt;
  if (enemy.searchTimer <= 0 || arrived) {
    enemy.state = STATE_RETURNING;
    enemy.searchTimer = 0;
  }
}

function updateEnemyReturning(enemy, grid, dt) {
  // Move back to home room's first patrol point
  var homeCol = enemy.homeRoom.gridCol;
  var homeRow = enemy.homeRoom.gridRow;

  if (enemy.screenCol !== homeCol || enemy.screenRow !== homeRow) {
    // Step toward home screen — move to center of current screen edge
    // facing home, then transition when reaching edge
    var targetX, targetY;
    if (homeCol > enemy.screenCol) {
      targetX = CANVAS_SIZE - enemy.width;
      targetY = CANVAS_SIZE / 2;
    } else if (homeCol < enemy.screenCol) {
      targetX = 0;
      targetY = CANVAS_SIZE / 2;
    } else if (homeRow > enemy.screenRow) {
      targetX = CANVAS_SIZE / 2;
      targetY = CANVAS_SIZE - enemy.height;
    } else {
      targetX = CANVAS_SIZE / 2;
      targetY = 0;
    }
    moveToward(enemy, targetX, targetY, ENEMY_PATROL_SPEED);
    // Screen transition check done in game.js updateEntities
    return;
  }

  // On home screen — move to patrol start point
  var startPt = enemy.patrolPoints[0];
  var arrived = moveToward(
    enemy,
    startPt[0] * TILE_SIZE,
    startPt[1] * TILE_SIZE,
    ENEMY_PATROL_SPEED
  );
  if (arrived) {
    enemy.patrolIndex = 0;
    enemy.state       = STATE_PATROL;
    enemy.isChasing   = false;
  }
}

// ─── Player-enemy collision (catch) ───────────────────────────────
// Returns true if enemy touches player (AABB overlap)
function enemyTouchesPlayer(enemy, player) {
  if (enemy.screenCol !== player.screenCol) return false;
  if (enemy.screenRow !== player.screenRow) return false;
  return (
    enemy.x < player.x + player.width  &&
    enemy.x + enemy.width  > player.x  &&
    enemy.y < player.y + player.height &&
    enemy.y + enemy.height > player.y
  );
}

// ─── Ally state machine update ────────────────────────────────────
// Call once per frame per ally.
// hidingSpots: array of HidingSpot for the ally's room
// enemies: all Enemy objects (filtered by screen inside)
// dt: delta time ms
function updateAlly(ally, enemies, hidingSpots, dt) {
  if (ally.state === STATE_CAUGHT) return;

  // Check if any enemy is on same screen and within ALLY_FLEE_RADIUS
  var threatNearby = false;
  for (var i = 0; i < enemies.length; i++) {
    var en = enemies[i];
    if (en.screenCol !== ally.screenCol) continue;
    if (en.screenRow !== ally.screenRow) continue;
    if (entityDistTiles(ally, en) <= ALLY_FLEE_RADIUS) {
      threatNearby = true;
      break;
    }
  }

  switch (ally.state) {
    case STATE_WANDERING:
      updateAllyWandering(ally, dt);
      if (threatNearby) {
        var spot = nearestFreeHidingSpot(ally, hidingSpots);
        if (spot) {
          ally.state      = STATE_FLEEING;
          ally.hidingSpot = spot;
        }
      }
      break;

    case STATE_FLEEING:
      var arrived = moveToward(
        ally,
        ally.hidingSpot.cx - ally.width / 2,
        ally.hidingSpot.cy - ally.height / 2,
        ALLY_FLEE_SPEED
      );
      if (arrived) {
        if (!ally.hidingSpot.isOccupied) {
          ally.hidingSpot.isOccupied = true;
          ally.hidingSpot.occupant   = ally;
          ally.x     = ally.hidingSpot.cx - ally.width  / 2;
          ally.y     = ally.hidingSpot.cy - ally.height / 2;
          ally.state = STATE_HIDING;
        } else {
          // Spot taken — pick another
          var alt = nearestFreeHidingSpot(ally, hidingSpots);
          if (alt) {
            ally.hidingSpot = alt;
          } else {
            // No free spot — stay put in WANDERING
            ally.state = STATE_WANDERING;
          }
        }
      }
      break;

    case STATE_HIDING:
      if (!threatNearby) {
        // Release spot and go back to wandering
        ally.hidingSpot.isOccupied = false;
        ally.hidingSpot.occupant   = null;
        ally.hidingSpot = null;
        ally.state = STATE_WANDERING;
      }
      break;
  }

  // Catch check — any enemy touching ally
  for (var j = 0; j < enemies.length; j++) {
    var e = enemies[j];
    if (e.screenCol !== ally.screenCol) continue;
    if (e.screenRow !== ally.screenRow) continue;
    if (aabbOverlap(e, ally)) {
      allyCaught(ally);
      return;
    }
  }
}

function updateAllyWandering(ally, dt) {
  ally.wanderTimer -= dt;
  if (ally.wanderTimer <= 0) {
    ally.wanderAngle = Math.random() * Math.PI * 2;
    ally.wanderTimer = 800 + Math.random() * 1200; // 0.8–2s
  }
  var dx = Math.cos(ally.wanderAngle) * ALLY_WANDER_SPEED;
  var dy = Math.sin(ally.wanderAngle) * ALLY_WANDER_SPEED;
  ally.facingAngle = ally.wanderAngle;
  moveWithCollision(ally, dx, dy);
}

function allyCaught(ally) {
  // Free any hiding spot
  if (ally.hidingSpot) {
    ally.hidingSpot.isOccupied = false;
    ally.hidingSpot.occupant   = null;
    ally.hidingSpot = null;
  }
  ally.state = STATE_CAUGHT;
  ally.alive  = false;
}

// nearestFreeHidingSpot — returns closest unoccupied HidingSpot in same room, or null
function nearestFreeHidingSpot(entity, hidingSpots) {
  var best = null;
  var bestDist = Infinity;
  for (var i = 0; i < hidingSpots.length; i++) {
    var hs = hidingSpots[i];
    if (hs.isOccupied) continue;
    if (hs.room !== entity.room) continue;
    // Fake entity-like object to reuse entityDist
    var hsEnt = { x: hs.x, y: hs.y, width: TILE_SIZE, height: TILE_SIZE };
    var d = entityDist(entity, hsEnt);
    if (d < bestDist) {
      bestDist = d;
      best = hs;
    }
  }
  return best;
}

// aabbOverlap — generic AABB check for any two rect-like objects with x,y,width,height
function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.width  &&
    a.x + a.width  > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
