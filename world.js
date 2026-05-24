// ─────────────────────────────────────────────────────────────────
// world.js — Room class, 4×4 ScreenGrid, tile helpers
// Depends on: constants.js
// ─────────────────────────────────────────────────────────────────

// ─── Room ─────────────────────────────────────────────────────────
// Parses a flat 256-character tile string into a 16×16 2D array.
// Also holds patrol waypoints and ally spawn points from JSON.
//
// roomData shape: { id, label, gridCol, gridRow, tiles: string(256),
//                   enemyPatrolPoints: [[col,row],...],
//                   allySpawnPoints: [[col,row],...] }
function Room(roomData) {
  this.id          = roomData.id;
  this.label       = roomData.label;
  this.gridCol     = roomData.gridCol;
  this.gridRow     = roomData.gridRow;
  this.patrolPoints = roomData.enemyPatrolPoints;  // [[col,row],...]
  this.spawnPoints  = roomData.allySpawnPoints;    // [[col,row],...]

  // Build 16×16 tile grid from flat string, skipping spaces/newlines
  var clean = roomData.tiles.replace(/[\s\n]/g, '');
  this.tiles = [];
  for (var row = 0; row < SCREEN_TILES; row++) {
    this.tiles[row] = [];
    for (var col = 0; col < SCREEN_TILES; col++) {
      var ch = clean[row * SCREEN_TILES + col];
      // Default to FLOOR if tile string is malformed
      this.tiles[row][col] = ch || TILE_FLOOR;
    }
  }
}

// getTile(col, row) — returns tile char, or TILE_WALL for out-of-bounds
Room.prototype.getTile = function(col, row) {
  if (col < 0 || col >= SCREEN_TILES || row < 0 || row >= SCREEN_TILES) {
    return TILE_WALL;
  }
  return this.tiles[row][col];
};

// isPassable(col, row) — true if movement is allowed on this tile
Room.prototype.isPassable = function(col, row) {
  var t = this.getTile(col, row);
  return t === TILE_FLOOR || t === TILE_HIDING;
};

// pixelToTile(px) — convert a pixel coordinate to a tile index
function pixelToTile(px) {
  return Math.floor(px / TILE_SIZE);
}

// tileToPixelCenter(tileIndex) — pixel at center of tile
function tileToPixelCenter(tileIndex) {
  return tileIndex * TILE_SIZE + TILE_SIZE / 2;
}

// ─── ScreenGrid ────────────────────────────────────────────────────
// Holds all 16 Room objects indexed by [row][col].
// Built once at game start from parsed JSON.
function ScreenGrid(roomsArray) {
  this.rooms = [];
  for (var row = 0; row < GRID_SIZE; row++) {
    this.rooms[row] = [];
    for (var col = 0; col < GRID_SIZE; col++) {
      this.rooms[row][col] = null;
    }
  }

  for (var i = 0; i < roomsArray.length; i++) {
    var room = new Room(roomsArray[i]);
    this.rooms[room.gridRow][room.gridCol] = room;
  }
}

// getRoom(col, row) — returns Room or null if out of bounds
ScreenGrid.prototype.getRoom = function(col, row) {
  if (col < 0 || col >= GRID_SIZE || row < 0 || row >= GRID_SIZE) {
    return null;
  }
  return this.rooms[row][col];
};

// getRoomById(id) — linear scan, used during init only
ScreenGrid.prototype.getRoomById = function(id) {
  for (var row = 0; row < GRID_SIZE; row++) {
    for (var col = 0; col < GRID_SIZE; col++) {
      if (this.rooms[row][col] && this.rooms[row][col].id === id) {
        return this.rooms[row][col];
      }
    }
  }
  return null;
};
