// assets.js — Image preloader. Must be the first script loaded.
// Defines ASSETS global and assetsReady() used by renderer.js and game.js.

var ASSETS        = {};
var ASSETS_TOTAL  = 0;
var ASSETS_LOADED = 0;

function loadImage(key, src) {
  ASSETS_TOTAL++;
  var img     = new Image();
  img.onload  = function() { ASSETS_LOADED++; };
  img.onerror = function() { ASSETS_LOADED++; console.warn('Asset missing: ' + src); };
  img.src     = src;
  ASSETS[key] = img;
}

function assetsReady() {
  return ASSETS_TOTAL > 0 && ASSETS_LOADED >= ASSETS_TOTAL;
}

// ─── Screens ──────────────────────────────────────────────────────────
loadImage('screenLoading',  'Assets/screens/screen-loading-text.png');
loadImage('screenTitle',    'Assets/screens/screen-title-text.png');
loadImage('screenSelect',   'Assets/screens/screen-faction-select-text.png');
loadImage('screenGameover', 'Assets/screens/screen-gameover-text.png');
loadImage('screenFound',    'Assets/screens/screen-found-text.png');
loadImage('screenVictory',  'Assets/screens/screen-victory-text.png');
loadImage('screenSurvived', 'Assets/screens/screen-survived-text.png');

// ─── Player character spritesheets (real character art) ───────────────
loadImage('sheetZeak',   'Assets/players-web/spritesheets/zeak.png');
loadImage('sheetErza',   'Assets/players-web/spritesheets/erza.png');
loadImage('sheetJohnny', 'Assets/players-web/spritesheets/crash.png');
loadImage('sheetCarter', 'Assets/players-web/spritesheets/carter.png');
loadImage('sheetJT',     'Assets/players-web/spritesheets/jt.png');
loadImage('sheetCody',   'Assets/players-web/spritesheets/cody.png');
loadImage('sheetNicky',  'Assets/players-web/spritesheets/nicky.png');
loadImage('sheetFranky', 'Assets/players-web/spritesheets/franky.png');
loadImage('sheetAlly',   'Assets/players-web/spritesheets/anuka.png');

// ─── Character select portraits (TAS images) ─────────────────────
loadImage('portraitAnuka',    'Assets/players-web/tas-anuka-gutierrez.png');
loadImage('portraitAvalon',   'Assets/players-web/tas-avalon.png');
loadImage('portraitCarter',   'Assets/players-web/tas-carter-cash.png');
loadImage('portraitCodah',    'Assets/players-web/tas-codah.png');
loadImage('portraitCody',     'Assets/players-web/tas-cody-devine.png');
loadImage('portraitDean',     'Assets/players-web/tas-dean-mercer.png');
loadImage('portraitErza',     'Assets/players-web/tas-erza.png');
loadImage('portraitFranky',   'Assets/players-web/tas-franky-gonzales.png');
loadImage('portraitHussy',    'Assets/players-web/tas-hussy.png');
loadImage('portraitJohnny',   'Assets/players-web/tas-johnny-crash.png');
loadImage('portraitJT',       'Assets/players-web/tas-jt-staten.png');
loadImage('portraitGlory',    'Assets/players-web/tas-major-glory.png');
loadImage('portraitMorgana',  'Assets/players-web/tas-morgana-lavey.png');
loadImage('portraitNicky',    'Assets/players-web/tas-nicky-hyde.png');
loadImage('portraitVigilante','Assets/players-web/tas-vigilante-oai.png');
loadImage('portraitZeak',     'Assets/players-web/tas-zeak-gallent.png');

// ─── Generic wrestler pose sprites ────────────────────────────────
loadImage('genericIdle',  'Assets/sprites/wrestlers/generic-idle.png');
loadImage('genericWalk',  'Assets/sprites/wrestlers/generic-walk-sheet.png');
loadImage('hidingSprite', 'Assets/sprites/wrestlers/generic-hiding.png');
loadImage('caughtSprite', 'Assets/sprites/wrestlers/generic-caught.png');

// ─── Enemy sprites ────────────────────────────────────────────────────
loadImage('refereeIdle',  'Assets/sprites/wrestlers/referee-idle.png');
loadImage('securityIdle', 'Assets/sprites/wrestlers/security-guard-idle.png');

// ─── Tilesets ─────────────────────────────────────────────────────────
loadImage('tileLockerRoom',    'Assets/bg_tiles/hide/locker-room-tileset.png');
loadImage('tileBackstage',     'Assets/bg_tiles/hide/backstage-hallway-tileset.png');
loadImage('tileWrestlingRing', 'Assets/bg_tiles/hide/wrestling-ring-tileset.png');
loadImage('tileEntrance',      'Assets/bg_tiles/hide/entrance-curtain-tileset.png');
loadImage('tileStorage',       'Assets/bg_tiles/hide/storage-room-tileset.png');

// ─── UI ───────────────────────────────────────────────────────────────
loadImage('minimapFrame',     'Assets/ui/ui-minimap-frame.png');
loadImage('dotPlayerRising',  'Assets/ui/ui-dot-player-rising.png');
loadImage('dotPlayerPillars', 'Assets/ui/ui-dot-player-pillars.png');
loadImage('dotAllyRising',    'Assets/ui/ui-dot-ally-rising.png');
loadImage('dotAllyPillars',   'Assets/ui/ui-dot-ally-pillars.png');
loadImage('dotEnemy',         'Assets/ui/ui-dot-enemy.png');
loadImage('iconsSheet',       'Assets/ui/ui-icons-sheet.png');
loadImage('iconHidden',       'Assets/ui/ui-icon-hidden.png');
loadImage('emblemRising',     'Assets/ui/faction-rising-emblem.png');
loadImage('emblemPillars',    'Assets/ui/faction-pillars-emblem.png');
