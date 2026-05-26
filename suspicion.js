// suspicion.js — zone matching and per-tick suspicion logic

// Returns which zone the point (px, py) falls in, checking in order.
// First match wins. Returns null if no zone contains the point.
function getZone(room, px, py) {
  var zones = room.zones;
  for (var i = 0; i < zones.length; i++) {
    var z = zones[i];
    if (px >= z.x && px < z.x + z.w && py >= z.y && py < z.y + z.h) {
      return z;
    }
  }
  return null;
}

// Returns the suspicion multiplier for placing objId at (px, py) in room.
function getZoneMultiplier(room, objId, px, py) {
  var zone = getZone(room, px, py);
  if (!zone) return 1.0;
  if (zone.believableObjects.indexOf(objId) !== -1) return SUSPICION_ZONE_GOOD_MULT;
  return zone.defaultMult;
}

// Returns true if point (tx, ty) is inside hunter's sight cone.
function inSightCone(hunter, tx, ty) {
  var hx = hunter.x + hunter.width  / 2;
  var hy = hunter.y + hunter.height / 2;
  var dx = tx - hx;
  var dy = ty - hy;
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > HUNTER_SIGHT_RANGE) return false;
  var angle = Math.atan2(dy, dx);
  var diff  = Math.abs(angle - hunter.facingAngle);
  if (diff > Math.PI) diff = 2 * Math.PI - diff;
  return diff <= HUNTER_SIGHT_HALF_ARC;
}

// Tick suspicion for one frame. Mutates gs.suspicion and player scoring flags.
// Call once per frame only during PHASE_HUNT.
function tickSuspicion(dt, gs) {
  var player  = gs.player;
  var hunter  = gs.hunter;
  var seconds = dt / 1000;

  if (gs.phase !== PHASE_HUNT || !player.isTransformed) {
    // Passive drain still applies if transformed but phase not hunt — skip entirely
    gs.suspicion = Math.max(0, gs.suspicion - SUSPICION_DRAIN_RATE * seconds);
    return;
  }

  var obj   = OBJECTS[player.objIdx];
  var room  = gs.room;
  var px    = player.x + player.width  / 2;
  var py    = player.y + player.height / 2;
  var mult  = getZoneMultiplier(room, obj.id, px, py);

  // Track good-zone status for scoring
  if (mult === SUSPICION_ZONE_GOOD_MULT) player.wasInGoodZone = true;

  // Passive drain
  gs.suspicion -= SUSPICION_DRAIN_RATE * seconds;

  if (hunter) {
    var hx   = hunter.x + hunter.width  / 2;
    var hy   = hunter.y + hunter.height / 2;
    var dist = Math.sqrt((px - hx) * (px - hx) + (py - hy) * (py - hy));

    // Bonus drain when hunter is far away
    if (dist > HUNTER_FAR_DIST) {
      gs.suspicion -= SUSPICION_DRAIN_FAR * seconds;
    }

    // Player moving while transformed and inside sight cone
    if (player.isMoving && inSightCone(hunter, px, py)) {
      gs.suspicion += SUSPICION_MOVE_RATE * seconds * mult * obj.suspicionMult;
      player.movedWhileTransformed = true;
    }

    // Hunter actively inspecting the player's object
    if (hunter.state === HUNTER_INSPECTING && hunter.inspectTarget === player) {
      gs.suspicion += SUSPICION_INSPECT_RATE * seconds * mult * obj.suspicionMult * player.char.hideMult;
    }
  }

  gs.suspicion = Math.max(0, Math.min(SUSPICION_MAX, gs.suspicion));
}
