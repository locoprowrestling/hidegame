// entities.js — Player, Hunter, Ally constructors

// ─── Player ───────────────────────────────────────────────────────
function Player(teamData, charData) {
  this.team      = teamData;   // {name, color, characters}
  this.char      = charData;   // {id, label, speedMult, hideMult}

  this.x = 0; this.y = 0;     // set by startRound
  this.width  = 12;
  this.height = 12;
  this.speed  = PLAYER_SPEED_BASE * charData.speedMult;

  // Transform state
  this.isTransformed = false;
  this.objIdx        = 0;      // index into OBJECTS array

  // Scoring flags (reset each round)
  this.movedWhileTransformed = false;
  this.retransformed         = false;
  this.wasInGoodZone         = false;

  this.facingAngle = 0;
  this.isMoving    = false;
  this.alive       = true;
}

// ─── Hunter ───────────────────────────────────────────────────────
function Hunter(teamData, room) {
  this.team   = teamData;
  this.room   = room;

  // Start off-screen at entry point
  this.x = room.hunterEntry.x;
  this.y = room.hunterEntry.y;
  this.width  = 14;
  this.height = 14;
  this.speed  = HUNTER_PATROL_SPEED;

  this.state        = HUNTER_ENTERING;
  this.patrolIdx    = 0;          // current waypoint in room.patrolPath
  this.stateTimer   = 0;          // ms counter for timed states
  this.inspectTarget = null;      // entity being inspected (Player | Ally | null)
  this.inspectDest  = null;       // {x, y} target pixel for inspection walk
  this.returnDest   = null;       // {x, y} to return to after inspecting

  this.facingAngle  = 0;
  this.isMoving     = true;
}

// ─── Ally ─────────────────────────────────────────────────────────
function Ally(teamData, spawnPt) {
  this.team  = teamData;

  this.x = spawnPt.x;
  this.y = spawnPt.y;
  this.width  = 12;
  this.height = 12;
  this.speed  = ALLY_MOVE_SPEED;

  // Ally picks an object and a destination zone during setup
  this.objIdx      = 0;
  this.destX       = spawnPt.x;
  this.destY       = spawnPt.y;
  this.isTransformed = false;
  this.alive       = true;
  this.badHide     = Math.random() < 0.25;  // 25% chance of poor placement

  this.facingAngle = 0;
  this.isMoving    = false;
}

// ─── Pixel distance between two entities (centers) ────────────────
function entityDist(a, b) {
  var ax = a.x + a.width  / 2;
  var ay = a.y + a.height / 2;
  var bx = b.x + b.width  / 2;
  var by = b.y + b.height / 2;
  return Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
}

// ─── Pixel distance from entity center to a point ─────────────────
function distToPoint(entity, px, py) {
  var ex = entity.x + entity.width  / 2;
  var ey = entity.y + entity.height / 2;
  return Math.sqrt((ex - px) * (ex - px) + (ey - py) * (ey - py));
}

// ─── Move entity toward (tx, ty) at speed; returns true if arrived ─
function moveToward(entity, tx, ty, speed) {
  var dx = tx - (entity.x + entity.width  / 2);
  var dy = ty - (entity.y + entity.height / 2);
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist <= speed) {
    entity.x = tx - entity.width  / 2;
    entity.y = ty - entity.height / 2;
    entity.isMoving = false;
    return true;
  }
  entity.x += (dx / dist) * speed;
  entity.y += (dy / dist) * speed;
  entity.facingAngle = Math.atan2(dy, dx);
  entity.isMoving = true;
  return false;
}

// ─── Clamp entity to canvas playfield (below UI bar) ──────────────
function clampToField(entity) {
  var minX = 2;
  var minY = UI_BAR_H + 2;
  var maxX = CANVAS_SIZE - entity.width  - 2;
  var maxY = CANVAS_SIZE - entity.height - 2;
  entity.x = Math.max(minX, Math.min(maxX, entity.x));
  entity.y = Math.max(minY, Math.min(maxY, entity.y));
}
