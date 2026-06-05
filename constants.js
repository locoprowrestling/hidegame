var CANVAS_W = 320;
var CANVAS_H = 200;
var CSS_SCALE = 3;

// Screens
var SCREEN_TITLE    = 'title';
var SCREEN_PLAY     = 'play';
var SCREEN_GAMEOVER = 'gameover';
var SCREEN_WIN      = 'win';

// Player
var PLAYER_SPEED     = 0.055;
var PLAYER_ROT_SPEED = 0.07; // increased for snappier turning
var PLAYER_RADIUS    = 0.25;
var MOUSE_SENSITIVITY = 0.002;

// Games Master
var GM_PATROL_SPEED = 0.018;
var GM_CHASE_SPEED  = 0.038;
var GM_SIGHT_DIST      = 9.0;   // tiles — look-trigger detection range
var GM_CATCH_DIST      = 0.55;  // tiles — game over
var GM_LOSE_CHASE_MS   = 4000;  // ms without LOS before GM moves to last-known pos
var GM_SEARCH_MS       = 5000;  // ms spent walking to last-known pos before patrolling

// Collectibles
var PROGRAMS_PER_FLOOR = 7;
var TOTAL_PROGRAMS     = 28;  // 7 × 4 floors
var COLLECT_DIST       = 1.1; // tiles
var EXIT_DIST          = 1.5; // tiles — stair / front-door interaction range

// GM floor-change cadence
var GM_FLOOR_CHANGE_MS = 20000; // ~20 s before GM moves to another floor
var GM_FOLLOW_PROB     = 0.82;  // probability he moves toward player's floor

// Rendering
var FOV_HALF_PLANE = 0.66;  // camera plane magnitude → ~66° FOV
var MAX_RAY_DEPTH  = 24;

// Wall type IDs
var WALL_STONE   = 1;  // outer stone — dark grey
var WALL_PLASTER = 2;  // auditorium plaster — dusty beige
var WALL_CURTAIN = 3;  // stage curtain wall — deep crimson
var WALL_BRICK   = 4;  // backstage brick — dark rust
var WALL_WOOD    = 5;  // dressing room wood — brown

// Wall base colors [r, g, b]
var WALL_COLORS = {
  1: [38, 34, 42],
  2: [55, 48, 38],
  3: [72, 10, 10],
  4: [50, 25, 15],
  5: [42, 28, 14]
};

// Atmosphere
var FLOOR_COLOR   = [8, 6, 8];
var CEILING_COLOR = [4, 3, 6];
var FOG_DIST      = 12.0;  // tiles until full black fog
