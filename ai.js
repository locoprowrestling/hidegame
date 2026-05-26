// ai.js — Hunter state machine and ally setup movement

// ─── Hunter update (call once per frame during PHASE_HUNT) ────────
function updateHunter(hunter, dt, gs) {
  switch (hunter.state) {
    case HUNTER_ENTERING:   _hunterEntering(hunter, dt, gs);   break;
    case HUNTER_PATROLLING: _hunterPatrolling(hunter, dt, gs); break;
    case HUNTER_NOTICING:   _hunterNoticing(hunter, dt, gs);   break;
    case HUNTER_INSPECTING: _hunterInspecting(hunter, dt, gs); break;
    case HUNTER_ACCUSING:   _hunterAccusing(hunter, dt, gs);   break;
    case HUNTER_RETURNING:  _hunterReturning(hunter, dt, gs);  break;
  }
}

function _hunterEntering(hunter, dt, gs) {
  var wp = gs.room.patrolPath[0];
  if (moveToward(hunter, wp.x, wp.y, hunter.speed)) {
    hunter.state = HUNTER_PATROLLING;
    hunter.patrolIdx = 0;
  }
}

function _hunterPatrolling(hunter, dt, gs) {
  var path = gs.room.patrolPath;
  var wp   = path[hunter.patrolIdx % path.length];
  if (moveToward(hunter, wp.x, wp.y, hunter.speed)) {
    hunter.patrolIdx = (hunter.patrolIdx + 1) % path.length;
  }

  // Randomly decide to inspect something
  if (Math.random() < HUNTER_INSPECT_CHANCE) {
    var target = _pickInspectTarget(hunter, gs);
    if (target !== undefined) {
      hunter.inspectTarget = target;
      hunter.state         = HUNTER_NOTICING;
      hunter.stateTimer    = HUNTER_NOTICE_MS;
    }
  }
}

function _hunterNoticing(hunter, dt, gs) {
  hunter.stateTimer -= dt;
  // Face the target (or destination)
  var tx, ty;
  if (hunter.inspectTarget) {
    tx = hunter.inspectTarget.x + hunter.inspectTarget.width  / 2;
    ty = hunter.inspectTarget.y + hunter.inspectTarget.height / 2;
  } else {
    tx = hunter.inspectDest ? hunter.inspectDest.x : hunter.x;
    ty = hunter.inspectDest ? hunter.inspectDest.y : hunter.y;
  }
  hunter.facingAngle = Math.atan2(ty - (hunter.y + hunter.height/2), tx - (hunter.x + hunter.width/2));

  if (hunter.stateTimer <= 0) {
    // Set destination for inspection walk
    if (hunter.inspectTarget) {
      hunter.inspectDest = {
        x: hunter.inspectTarget.x + hunter.inspectTarget.width  / 2,
        y: hunter.inspectTarget.y + hunter.inspectTarget.height / 2
      };
    } else {
      // Random floor point
      hunter.inspectDest = {
        x: 40 + Math.random() * 176,
        y: UI_BAR_H + 10 + Math.random() * (CANVAS_SIZE - UI_BAR_H - 20)
      };
    }
    hunter.returnDest  = {x: hunter.x + hunter.width/2, y: hunter.y + hunter.height/2};
    hunter.state       = HUNTER_INSPECTING;
    hunter.stateTimer  = HUNTER_INSPECT_MS;
    hunter.speed       = HUNTER_INSPECT_SPEED;
  }
}

function _hunterInspecting(hunter, dt, gs) {
  var dest = hunter.inspectDest;
  var arrived = moveToward(hunter, dest.x, dest.y, hunter.speed);

  if (arrived) {
    // Pause at destination while stateTimer counts down
    hunter.stateTimer -= dt;
    if (hunter.stateTimer <= 0) {
      _evaluateInspection(hunter, gs);
    }
  }
}

function _evaluateInspection(hunter, gs) {
  var target = hunter.inspectTarget;

  if (target === gs.player && gs.player.isTransformed) {
    // Suspicion is handled by tickSuspicion; check if it's over threshold
    if (gs.suspicion >= SUSPICION_MAX) {
      hunter.state = HUNTER_ACCUSING;
      return;
    }
  }

  if (target && target !== gs.player && target.alive) {
    // Ally inspection
    if (target.badHide) {
      target.alive = false;
      gs.alliesAlive = Math.max(0, gs.alliesAlive - 1);
    }
  }

  // Return to patrol
  hunter.inspectTarget = null;
  hunter.inspectDest   = null;
  hunter.state         = HUNTER_RETURNING;
  hunter.speed         = HUNTER_PATROL_SPEED;
}

function _hunterAccusing(hunter, dt, gs) {
  // Move toward player rapidly
  var player = gs.player;
  moveToward(hunter, player.x + player.width/2, player.y + player.height/2, HUNTER_INSPECT_SPEED * 1.5);
  // Fill suspicion to max; game.js watches for suspicion >= SUSPICION_MAX
  gs.suspicion = SUSPICION_MAX;
}

function _hunterReturning(hunter, dt, gs) {
  var dest = hunter.returnDest;
  if (!dest || moveToward(hunter, dest.x, dest.y, hunter.speed)) {
    hunter.state      = HUNTER_PATROLLING;
    hunter.returnDest = null;
  }
}

// Pick a target for inspection.
// Returns: a Player, an Ally, or null (fake inspection point).
// undefined means no valid target and no inspection should start.
function _pickInspectTarget(hunter, gs) {
  var candidates = [];

  // Player if transformed
  if (gs.player.isTransformed) {
    var d = entityDist(hunter, gs.player);
    candidates.push({target: gs.player, weight: d < 80 ? 3 : 1});
  }

  // Alive allies
  for (var i = 0; i < gs.allies.length; i++) {
    if (gs.allies[i].alive) {
      candidates.push({target: gs.allies[i], weight: 1});
    }
  }

  // Null = fake inspection walk
  candidates.push({target: null, weight: 2});

  if (candidates.length === 0) return undefined;

  var total = 0;
  for (var j = 0; j < candidates.length; j++) total += candidates[j].weight;
  var r = Math.random() * total;
  var acc = 0;
  for (var k = 0; k < candidates.length; k++) {
    acc += candidates[k].weight;
    if (r <= acc) return candidates[k].target;
  }
  return null;
}

// ─── Ally setup movement (call during PHASE_SETUP) ─────────────────
// Moves ally toward its destX/destY; transforms when arrived.
function updateAllySetup(ally) {
  if (ally.isTransformed) return;
  if (moveToward(ally, ally.destX, ally.destY, ally.speed)) {
    ally.isTransformed = true;
    ally.isMoving      = false;
  }
}
