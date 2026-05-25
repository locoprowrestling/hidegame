// ─── Rendering ────────────────────────────────────────────────
var TILE_SIZE        = 16;   // pixels per tile
var SCREEN_TILES     = 16;   // tiles per screen dimension → 256×256 px canvas
var GRID_SIZE        = 4;    // 4×4 screen grid
var CANVAS_SIZE      = TILE_SIZE * SCREEN_TILES; // 256

// ─── Minimap ──────────────────────────────────────────────────
var MINIMAP_SIZE     = 64;   // px — full minimap square
var MINIMAP_CELL     = MINIMAP_SIZE / GRID_SIZE; // 16px per grid cell

// ─── Movement ─────────────────────────────────────────────────
var PLAYER_BASE_SPEED   = 2;    // px per frame
var ENEMY_PATROL_SPEED  = 1.2;  // px per frame
var ENEMY_CHASE_SPEED   = 2.8;  // px per frame
var ALLY_WANDER_SPEED   = 0.8;  // px per frame
var ALLY_FLEE_SPEED     = 1.8;  // px per frame

// ─── Vision ───────────────────────────────────────────────────
var VISION_CONE_ANGLE   = 90;   // degrees, half = 45° each side of facing
var VISION_CONE_DEPTH   = 5;    // tiles

// ─── Detection ────────────────────────────────────────────────
var HIDE_DETECT_RADIUS  = 1.5;  // tiles — base, multiplied by wrestler.hideMult
var HIDE_INTERACT_RADIUS = 1;    // tiles — player must be within this to press Space
var ALLY_FLEE_RADIUS    = 6;    // tiles — enemy within this triggers ally flee

// ─── Timing ───────────────────────────────────────────────────
var SEARCH_TIMEOUT      = 3000; // ms before enemy gives up searching
var ROUND_TIMER         = 90;   // seconds
var TIMER_WARN_SECONDS  = 20;   // timer turns red below this threshold
var ALERTED_FRAMES      = 30;   // frames enemy stays ALERTED before CHASING (~0.5s at 60fps)

// ─── Animation ────────────────────────────────────────────────
var ANIM_WALK_FRAME_MS  = 150;  // ms per player/ally walk frame
var ANIM_ENEMY_FRAME_MS = 200;  // ms per enemy patrol frame
var WALK_FRAMES         = 8;    // frames in player/ally walk cycle
var WALK_FRAME_W        = 107;  // px — floor(323/3)
var WALK_FRAME_H        = 80;   // px — floor(323/4)
var ENEMY_FRAME_W       = 81;   // px — floor(244/3)
var ENEMY_FRAME_H       = 81;   // px — floor(326/4)
var IDLE_FRAME_W        = 97;   // px — floor(390/4)
var IDLE_FRAME_H        = 96;   // px — full idle sheet height

// ─── Entity counts ────────────────────────────────────────────
var ENEMY_COUNT         = 4;
var ALLY_COUNT          = 3;

// ─── Scoring ──────────────────────────────────────────────────
var SCORE_PER_SECOND    = 10;
var SCORE_PER_ALLY      = 500;
var SCORE_FULL_SURVIVAL = 1000;

// ─── Colors ───────────────────────────────────────────────────
var COLOR_RISING        = '#E63946';
var COLOR_PILLARS       = '#457B9D';
var COLOR_FLOOR         = '#2a2a2a';
var COLOR_WALL          = '#111111';
var COLOR_OBSTACLE      = '#444444';
var COLOR_HIDING_SPOT   = '#1a3a1a';
var COLOR_HIDING_OCC    = '#2d6a2d';
var COLOR_VISION_PATROL = 'rgba(255,220,0,0.25)';
var COLOR_VISION_ALERT  = 'rgba(255,140,0,0.35)';
var COLOR_VISION_CHASE  = 'rgba(255,40,40,0.40)';
var COLOR_HUD_BG        = 'rgba(0,0,0,0.7)';
var COLOR_TIMER_WARN    = '#ff4444';
var COLOR_WHITE         = '#ffffff';
var COLOR_BLACK         = '#000000';

// ─── Tile chars ───────────────────────────────────────────────
var TILE_FLOOR       = 'F';
var TILE_WALL        = 'W';
var TILE_OBSTACLE    = 'O';
var TILE_HIDING      = 'H';

// ─── Enemy states ─────────────────────────────────────────────
var STATE_PATROL     = 'PATROL';
var STATE_ALERTED    = 'ALERTED';
var STATE_CHASING    = 'CHASING';
var STATE_SEARCHING  = 'SEARCHING';
var STATE_RETURNING  = 'RETURNING';

// ─── Ally states ──────────────────────────────────────────────
var STATE_WANDERING  = 'WANDERING';
var STATE_FLEEING    = 'FLEEING';
var STATE_HIDING     = 'HIDING';
var STATE_CAUGHT     = 'CAUGHT';

// ─── Screen flow states ───────────────────────────────────────
var SCREEN_LOADING   = 'LOADING';
var SCREEN_TITLE     = 'TITLE';
var SCREEN_SELECT    = 'CHARACTER_SELECT';
var SCREEN_GAMEPLAY  = 'GAMEPLAY';
var SCREEN_WIN       = 'WIN';
var SCREEN_GAMEOVER  = 'GAME_OVER';
