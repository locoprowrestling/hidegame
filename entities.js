// ─────────────────────────────────────────────────────────────────
// entities.js — Player, Enemy, Ally, HidingSpot constructors
// Depends on: constants.js, world.js
// ─────────────────────────────────────────────────────────────────

// ─── HidingSpot ───────────────────────────────────────────────────
// tileCol, tileRow: tile-aligned grid position on the room
// Pixel position is the top-left corner of the tile.
function HidingSpot(tileCol, tileRow, room) {
  this.tileCol    = tileCol;
  this.tileRow    = tileRow;
  this.room       = room;          // reference to owning Room
  this.x          = tileCol * TILE_SIZE;
  this.y          = tileRow * TILE_SIZE;
  this.cx         = this.x + TILE_SIZE / 2; // pixel center X
  this.cy         = this.y + TILE_SIZE / 2; // pixel center Y
  this.isOccupied = false;
  this.occupant   = null;          // entity currently hiding here
}

// ─── Player ───────────────────────────────────────────────────────
// wrestler: { name, speedMult, hideMult }
// faction:  { name, color }
// startRoom: Room
function Player(wrestler, faction, startRoom) {
  this.wrestler   = wrestler;
  this.faction    = faction;
  this.room       = startRoom;
  this.screenCol  = startRoom.gridCol;
  this.screenRow  = startRoom.gridRow;

  // Spawn at center of screen
  this.x          = CANVAS_SIZE / 2 - TILE_SIZE / 2;
  this.y          = CANVAS_SIZE / 2 - TILE_SIZE / 2;

  this.width      = TILE_SIZE - 2;
  this.height     = TILE_SIZE - 2;

  this.speed      = PLAYER_BASE_SPEED * wrestler.speedMult;
  this.hideDetectRadius = HIDE_DETECT_RADIUS * wrestler.hideMult; // tiles

  this.isHidden   = false;
  this.hidingSpot = null;   // HidingSpot | null

  this.facingAngle = 0;     // radians, 0 = right
  this.alive       = true;

  this.animFrame  = 0;
  this.animTimer  = 0;
  this.animDir    = 0;      // 0=down 1=left 2=right 3=up
  this.facingRight = true;  // regenerated sheets face right; flip only for left
  this.isMoving   = false;
}

// ─── Enemy ────────────────────────────────────────────────────────
// homeRoom: Room — enemy returns here after SEARCHING
// patrolPoints: [[col,row],...] — tile coords for patrol loop
function Enemy(homeRoom, patrolPoints) {
  this.homeRoom       = homeRoom;
  this.room           = homeRoom;
  this.screenCol      = homeRoom.gridCol;
  this.screenRow      = homeRoom.gridRow;

  // Start at first patrol point (fall back to tile [1,1] if array is empty)
  var startPt         = patrolPoints[0] || [1, 1];
  this.x              = startPt[0] * TILE_SIZE;
  this.y              = startPt[1] * TILE_SIZE;

  this.width          = TILE_SIZE - 2;
  this.height         = TILE_SIZE - 2;

  this.patrolPoints   = patrolPoints;
  this.patrolIndex    = 0;           // current waypoint index

  this.facingAngle    = 0;           // radians

  this.state          = STATE_PATROL;
  this.alertedFrames  = 0;           // counts down from ALERTED_FRAMES

  // Last known player position (pixel, on enemy's current screen)
  this.lastKnownX     = null;
  this.lastKnownY     = null;

  this.searchTimer    = 0;           // ms remaining in SEARCHING/RETURNING timeout
  this.isChasing      = false;       // true while following player across screens

  this.animFrame  = 0;
  this.animTimer  = 0;
  this.animDir    = 0;
  this.isMoving   = true;            // enemies are always moving
}

// ─── Ally ─────────────────────────────────────────────────────────
// spawnRoom: Room — allies never cross screens
// spawnPoint: [col, row] tile coords
function Ally(spawnRoom, spawnPoint) {
  this.room       = spawnRoom;
  this.screenCol  = spawnRoom.gridCol;
  this.screenRow  = spawnRoom.gridRow;

  this.x          = spawnPoint[0] * TILE_SIZE;
  this.y          = spawnPoint[1] * TILE_SIZE;

  this.width      = TILE_SIZE - 2;
  this.height     = TILE_SIZE - 2;

  this.state      = STATE_WANDERING;
  this.hidingSpot = null;          // target HidingSpot when FLEEING, current when HIDING

  // Wander: random direction timer
  this.wanderAngle    = Math.random() * Math.PI * 2;
  this.wanderTimer    = 0;         // ms until next direction change

  this.facingAngle    = 0;
  this.alive          = true;

  this.animFrame   = 0;
  this.animTimer   = 0;
  this.animDir     = 0;
  this.facingRight = true;
  this.isMoving    = false;
}

// ─── Entity distance helper (pixel space) ────────────────────────
// Returns distance in pixels between two entities' centers
// Note: uses entity center (x + width/2). HidingSpots use x + TILE_SIZE/2 as center
// (a 1px difference). Do not pass HidingSpot directly — compute distance via tileCol/tileRow.
function entityDist(a, b) {
  var ax = a.x + a.width  / 2;
  var ay = a.y + a.height / 2;
  var bx = b.x + b.width  / 2;
  var by = b.y + b.height / 2;
  var dx = ax - bx;
  var dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

// Distance in tiles between entity centers
function entityDistTiles(a, b) {
  return entityDist(a, b) / TILE_SIZE;
}

// ─── Build HidingSpots from a Room ────────────────────────────────
// Scans room tiles for TILE_HIDING and returns an array of HidingSpot objects.
function buildHidingSpotsForRoom(room) {
  var spots = [];
  for (var row = 0; row < SCREEN_TILES; row++) {
    for (var col = 0; col < SCREEN_TILES; col++) {
      if (room.getTile(col, row) === TILE_HIDING) {
        spots.push(new HidingSpot(col, row, room));
      }
    }
  }
  return spots;
}
