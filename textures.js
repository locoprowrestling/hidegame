// Texture loader — all PNG assets read into pixel arrays for fast raycaster access
var WALL_TEXTURES   = {};  // keyed by wall type 1-5
var FLOOR_TEXTURES  = {};  // keyed by floor index 0-3
var CEIL_TEXTURES   = {};  // keyed by floor index 0-3
var SPRITE_TEXTURES = {};  // keyed by name; stored as {canvas, w, h} for drawImage

var _texLoadCount = 0;
var _texLoadTotal = 13;

function _loadTex(src, cb) {
  var img = new Image();
  img.onload = function() {
    var c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    var cx = c.getContext('2d');
    cx.drawImage(img, 0, 0);
    var id = cx.getImageData(0, 0, img.width, img.height);
    cb({ data: id.data, w: img.width, h: img.height });
    if (++_texLoadCount >= _texLoadTotal) _texLoadCount = _texLoadTotal;
  };
  img.onerror = function() { ++_texLoadCount; };
  img.src = src;
}

// Sprite textures are stored as canvases (used with drawImage, not pixel arrays).
// If the image has no alpha channel (all pixels fully opaque), white pixels are
// keyed out so white-background PNGs render correctly as transparent sprites.
function _loadSprite(src, key) {
  var img = new Image();
  img.onload = function() {
    var c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    var cx = c.getContext('2d');
    cx.drawImage(img, 0, 0);
    var id = cx.getImageData(0, 0, c.width, c.height);
    var d = id.data;
    // Key out fully-opaque near-white pixels regardless of whether other pixels
    // have transparency — handles white-background PNGs with anti-aliased edges
    for (var i = 0; i < d.length; i += 4) {
      if (d[i+3] === 255 && d[i] > 240 && d[i+1] > 240 && d[i+2] > 240) d[i+3] = 0;
    }
    cx.putImageData(id, 0, 0);
    SPRITE_TEXTURES[key] = { canvas: c, w: img.width, h: img.height };
  };
  img.src = src;
}

function loadTextures() {
  _loadTex('assets/textures/wall_stone.png',         function(t) { WALL_TEXTURES[1] = t; });
  _loadTex('assets/textures/wall_plaster.png',       function(t) { WALL_TEXTURES[2] = t; });
  _loadTex('assets/textures/wall_curtain.png',       function(t) { WALL_TEXTURES[3] = t; });
  _loadTex('assets/textures/wall_brick.png',         function(t) { WALL_TEXTURES[4] = t; });
  _loadTex('assets/textures/wall_wood.png',          function(t) { WALL_TEXTURES[5] = t; });
  _loadTex('assets/textures/floor_foyer.png',        function(t) { FLOOR_TEXTURES[0] = t; });
  _loadTex('assets/textures/floor_auditorium.png',   function(t) { FLOOR_TEXTURES[1] = t; });
  _loadTex('assets/textures/floor_gallery.png',      function(t) { FLOOR_TEXTURES[2] = t; });
  _loadTex('assets/textures/floor_flies.png',        function(t) { FLOOR_TEXTURES[3] = t; });
  _loadTex('assets/textures/ceiling_foyer.png',      function(t) { CEIL_TEXTURES[0] = t; });
  _loadTex('assets/textures/ceiling_auditorium.png', function(t) { CEIL_TEXTURES[1] = t; });
  _loadTex('assets/textures/ceiling_gallery.png',    function(t) { CEIL_TEXTURES[2] = t; });
  _loadTex('assets/textures/ceiling_flies.png',      function(t) { CEIL_TEXTURES[3] = t; });

  _loadSprite('assets/items/program.png',      'program');
  _loadSprite('assets/items/program-full.png', 'program-full');
  _loadSprite('assets/screens/title.png',      'screen-title');
  _loadSprite('assets/screens/gameover.png',   'screen-gameover');
  _loadSprite('assets/screens/win.png',        'screen-win');
  _loadSprite('assets/gm/gm-idle.png',         'gm-idle');
  _loadSprite('assets/gm/gm-walk-a.png',       'gm-walk-a');
  _loadSprite('assets/gm/gm-walk-b.png',       'gm-walk-b');
  _loadSprite('assets/gm/gm-lunge.png',        'gm-lunge');
  _loadSprite('assets/gm/gm-back.png',         'gm-back');
  _loadSprite('assets/gm/gm-back-a.png',       'gm-back-a');
  _loadSprite('assets/gm/gm-back-b.png',       'gm-back-b');
}

loadTextures();
