// constants.js
var CANVAS_SIZE   = 256;
var TILE_SIZE     = 16;

// Screen states
var SCREEN_TITLE      = 'title';
var SCREEN_TEAM       = 'team';
var SCREEN_CHAR       = 'char';
var SCREEN_ROOM_INTRO = 'room_intro';
var SCREEN_GAMEPLAY   = 'gameplay';
var SCREEN_WIN        = 'win';
var SCREEN_GAMEOVER   = 'gameover';

// Game phases (during SCREEN_GAMEPLAY)
var PHASE_SETUP = 'setup';
var PHASE_HUNT  = 'hunt';

// Timers (seconds)
var SETUP_TIMER          = 10;
var HUNT_TIMER           = 45;
var ROOM_INTRO_MS        = 1500;

// Speeds (px/frame)
var PLAYER_SPEED_BASE    = 2.0;
var HUNTER_PATROL_SPEED  = 1.2;
var HUNTER_INSPECT_SPEED = 1.6;
var ALLY_MOVE_SPEED      = 1.8;

// Suspicion
var SUSPICION_MAX            = 100;
var SUSPICION_MOVE_RATE      = 5;    // /s: moving while transformed in sight cone
var SUSPICION_INSPECT_RATE   = 3;    // /s: hunter actively inspecting player object
var SUSPICION_DRAIN_RATE     = 1;    // /s: passive drain when still
var SUSPICION_DRAIN_FAR      = 2;    // /s: bonus drain when hunter > FAR threshold
var SUSPICION_RETRANSFORM    = 10;   // flat penalty per retransform during hunt
var SUSPICION_ZONE_GOOD_MULT = 0.3;
var SUSPICION_ZONE_BAD_MULT  = 2.0;

// Hunter
var HUNTER_SIGHT_RANGE     = 80;              // px (5 tiles)
var HUNTER_SIGHT_HALF_ARC  = Math.PI / 4;    // 45° each side = 90° cone
var HUNTER_INSPECT_RANGE   = 20;             // px: begin eval pause when within this
var HUNTER_INSPECT_MS      = 1500;           // ms: pause duration at object
var HUNTER_NOTICE_MS       = 600;            // ms: "?" pause before walking
var HUNTER_FAR_DIST        = 80;             // px: threshold for drain bonus
var HUNTER_INSPECT_CHANCE  = 0.006;          // per-frame chance to pick an object

// Hunter AI states
var HUNTER_ENTERING   = 'entering';
var HUNTER_PATROLLING = 'patrolling';
var HUNTER_NOTICING   = 'noticing';
var HUNTER_INSPECTING = 'inspecting';
var HUNTER_ACCUSING   = 'accusing';
var HUNTER_RETURNING  = 'returning';

// Scoring
var SCORE_BASE              = 100;
var SCORE_PER_SECOND        = 2;
var SCORE_ALLY_BONUS        = 10;
var SCORE_STILL_BONUS       = 25;   // never moved while transformed during hunt
var SCORE_NO_RETRANSFORM    = 15;   // never retransformed during hunt
var SCORE_GOOD_ZONE_BONUS   = 20;   // was in a good zone when hunt ended

// UI
var UI_BAR_H     = 20;   // px: top HUD bar height
var MINIMAP_W    = 48;
var MINIMAP_H    = 48;
