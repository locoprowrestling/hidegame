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
var GM_FLOOR_CHANGE_MS = 13000; // ~13 s before GM moves to another floor
var GM_FOLLOW_PROB     = 0.82;  // probability he moves toward player's floor

// Rendering
var FOV_HALF_PLANE = 0.66;  // camera plane magnitude → ~66° FOV
var MAX_RAY_DEPTH  = 24;

// Wall type IDs — Round 1
var WALL_STONE   = 1;  // outer stone — dark grey
var WALL_PLASTER = 2;  // auditorium plaster — dusty beige
var WALL_CURTAIN = 3;  // stage curtain wall — deep crimson
var WALL_BRICK   = 4;  // backstage brick — dark rust
var WALL_WOOD    = 5;  // dressing room wood — brown

// Wall type IDs — Round 2 (Sugar Works)
var WALL_CONCRETE    = 6;  // beet yard + lower mill — wet concrete
var WALL_CORRUGATED  = 7;  // wash house / slice floor — corrugated iron
var WALL_LIME        = 8;  // lime house — chalky kiln walls
var WALL_PIPEMETAL   = 9;  // evaporator / pan house — pipe-lagged metal
var WALL_SUGAR       = 10; // sugar tower — pale crystalline

// Wall type IDs — Round 3 (Hotel Imperial)
var WALL_WALLPAPER = 11;  // guest floors — rotting rose wallpaper
var WALL_MAHOGANY  = 12;  // lobby / ballroom — dark panelled wood
var WALL_TILE      = 13;  // kitchen / bathrooms — checkered tile
var WALL_GILT      = 14;  // gilded trim — penthouse / grand spaces
var WALL_CELLAR    = 15;  // service stone — attic / back-of-house

// Wall type IDs — Overworld (Longmont streets at night)
var WALL_FACADE_OPERA = 17;  // Opera House front
var WALL_FACADE_MILL  = 18;  // Sugar Mill sheet metal
var WALL_FACADE_HOTEL = 19;  // Hotel Imperial brick front
var WALL_HEDGE        = 20;  // trees / hedges

// Wall type IDs — Doors (solid; used on facades at entrance tiles + interiors)
var WALL_DOOR_OPERA = 21;  // crimson double doors, gilt arch
var WALL_DOOR_MILL  = 22;  // corrugated sliding door, chained
var WALL_DOOR_HOTEL = 23;  // mahogany + brass, glowing transom

// Baked facade art that faces opposite the raycaster's default UV direction.
var WALL_TEXTURE_FLIP_X = {
  23: true,  // Hotel entrance faces west; keep its signage readable from Main St.
};

// Fake building height — storeys drawn above the ground floor (overworld only).
// Storey 5 and above fade hard into the night sky.
var BUILDING_STORIES = {
   4: 2,           // brick storefronts — two-storey downtown blocks
  17: 4, 21: 4,    // Opera House — 4 storeys
  18: 3, 22: 3,    // Sugar Mill — 3-storey industrial block
  19: 7, 23: 7,    // Hotel Imperial — tower, upper floors lost in the dark
};
var STORY_DIM        = 0.16;  // per-storey brightness falloff
var STORY_FADE_START = 4;     // storey index where sky-fade begins (5th floor)
var STORY_FADE_RATE  = 0.38;  // sky blend added per storey past the start

// Wall base colors [r, g, b]
var WALL_COLORS = {
  1: [38, 34, 42],
  2: [55, 48, 38],
  3: [72, 10, 10],
  4: [50, 25, 15],
  5: [42, 28, 14],
  6: [28, 26, 22],
  7: [35, 20, 12],
  8: [56, 52, 44],
  9: [22, 24, 28],
 10: [50, 48, 44],
 11: [56, 28, 34],
 12: [46, 22, 14],
 13: [40, 46, 48],
 14: [64, 52, 22],
 15: [26, 24, 28],
 17: [58, 46, 30],
 18: [32, 32, 30],
 19: [52, 30, 24],
 20: [14, 28, 12],
 21: [70, 26, 20],
 22: [44, 34, 24],
 23: [52, 38, 18],
};

// Atmosphere
var FLOOR_COLOR   = [8, 6, 8];
var CEILING_COLOR = [4, 3, 6];
var FOG_DIST      = 12.0;  // tiles until full black fog

// Overworld atmosphere (night exterior)
var OW_SKY_COLOR    = [9, 10, 22];
var OW_GROUND_COLOR = [13, 11, 9];
var OW_FOG_DIST     = 17.0;
var OW_MAX_RAY_DEPTH = 52;

// ── Light grading ─────────────────────────────────────────────────────────────
// Per-channel multipliers on texture colour: `near` is the tint right at the
// player (their lantern), `far` is the tint things shift toward as they recede
// into the fog. Keep every value ≤ 1.0 — the raycaster does not clamp.
var ROUND_LIGHT = [
  { near: [1.00, 0.87, 0.64], far: [0.52, 0.60, 0.82] },  // OH: candle amber → cold blue dark
  { near: [0.80, 0.97, 0.86], far: [0.48, 0.60, 0.58] },  // Mill: sickly industrial green
  { near: [1.00, 0.82, 0.76], far: [0.56, 0.48, 0.68] },  // Hotel: gas-lamp rose → violet dark
];
var OW_LIGHT = { near: [0.78, 0.84, 1.00], far: [0.62, 0.68, 1.00] };  // moonlight

var LIGHT_GM_DRAIN = 0.28;  // max light loss when the GM is on top of you
var LIGHT_GM_RANGE = 7.0;   // tiles — drain begins inside this distance

// Screens
var SCREEN_ROUND_SELECT = 'round_select';
var SCREEN_OVERWORLD    = 'overworld';

// ── Stress system ─────────────────────────────────────────────────────────────
var STRESS_MAX            = 100;
var STRESS_DECAY          = 1.6;   // per second, when nothing scary nearby
var STRESS_NEAR_GM_RATE   = 7.0;   // per second at point-blank, scaled by distance
var STRESS_NEAR_GM_RANGE  = 7.0;   // tiles — GM proximity starts raising stress
var STRESS_CHASE_RATE     = 11.0;  // per second while chased
var STRESS_SCARE_BUMP     = 16;    // instant bump from a scare event
var STRESS_GLIMPSE_BUMP   = 12;    // overworld stalker sighting
var STRESS_HUNT_THRESHOLD = 65;    // above this, the GM senses your fear and hunts
var STRESS_SHAKE_START    = 45;    // screen shake begins
var STRESS_HEARTBEAT      = 55;    // heartbeat audio begins

// Scare events
var SCARE_MIN_GAP_MS = 22000;
var SCARE_MAX_GAP_MS = 46000;

// GM escalation — multipliers ramp from 1 → these values as items are collected
var GM_ESCALATE_SPEED   = 1.55;  // chase/patrol speed multiplier at 100% collected
var GM_ESCALATE_CADENCE = 0.45;  // floor-change wait multiplier at 100% collected
var GM_AMBUSH_PROB      = 0.40;  // chance, on arriving at a waypoint, to ambush an item
var GM_AMBUSH_WAIT_MS   = 9000;  // how long he lurks at an uncollected item
var GM_STAIR_CAMP_PROB  = 0.30;  // chance to camp the stairs after a floor change
var GM_STAIR_CAMP_MS    = 6000;
var GM_HUNT_REPATH_MS   = 2600;  // hunt-mode path recompute interval
