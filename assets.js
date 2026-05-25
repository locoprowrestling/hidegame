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

// ─── Wrestler sprites ─────────────────────────────────────────────────
loadImage('walkSheet',       'Assets/sprites/wrestlers/generic-walk-sheet.png');
loadImage('idleSheet',       'Assets/sprites/wrestlers/generic-idle-sheet.png');
loadImage('idleSingle',      'Assets/sprites/wrestlers/generic-idle.png');
loadImage('hidingSprite',    'Assets/sprites/wrestlers/generic-hiding.png');
loadImage('caughtSprite',    'Assets/sprites/wrestlers/generic-caught.png');
loadImage('zeakIdle',        'Assets/sprites/wrestlers/zeak-idle.png');
loadImage('erzaIdle',        'Assets/sprites/wrestlers/erza-idle.png');
loadImage('johnnyCrashIdle', 'Assets/sprites/wrestlers/johnny-crash-idle.png');
loadImage('carterCashIdle',  'Assets/sprites/wrestlers/carter-cash-idle.png');
loadImage('jtStatenIdle',    'Assets/sprites/wrestlers/jt-staten-idle.png');
loadImage('codyDevineIdle',  'Assets/sprites/wrestlers/cody-devine-idle.png');
loadImage('nickyHydeIdle',   'Assets/sprites/wrestlers/nicky-hyde-idle.png');
loadImage('frankyIdle',      'Assets/sprites/wrestlers/franky-idle.png');

// ─── Enemy sprites ────────────────────────────────────────────────────
loadImage('refereeSheet',  'Assets/sprites/wrestlers/referee-patrol-sheet.png');
loadImage('securitySheet', 'Assets/sprites/wrestlers/security-patrol-sheet.png');

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
