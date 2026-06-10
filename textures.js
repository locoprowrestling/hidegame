// Texture loader — all PNG assets read into pixel arrays for fast raycaster access
var WALL_TEXTURES   = {};  // keyed by wall type 1-5
var FLOOR_TEXTURES  = {};  // keyed by floor index 0-3
var CEIL_TEXTURES   = {};  // keyed by floor index 0-3
var SPRITE_TEXTURES = {};  // keyed by name; stored as {canvas, w, h} for drawImage

var _texLoadCount = 0;
var _texLoadTotal = 87;  // 5 R1 + 5 R2 + 5 R3 + 4 OW walls + 3 doors + 4 upper + 16 decals + OW ground + (4+8+10) floors + (4+8+10) ceilings

function _loadTex(src, cb, removeBg) {
  var img = new Image();
  img.onload = function() {
    var c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    var cx = c.getContext('2d');
    cx.drawImage(img, 0, 0);
    var id = cx.getImageData(0, 0, img.width, img.height);
    if (removeBg) {
      var d = id.data, w = c.width, h = c.height;
      // Sample top-left corner to detect background color (handles white or chroma-key green)
      var bgR = d[0], bgG = d[1], bgB = d[2];
      var visited = new Uint8Array(w * h);
      var queue = [];
      function isBg(p) {
        var i = p * 4, dr = d[i] - bgR, dg = d[i+1] - bgG, db = d[i+2] - bgB;
        return dr*dr + dg*dg + db*db < 3600; // tolerance ~60 per channel
      }
      for (var bx = 0; bx < w; bx++) {
        for (var by = 0; by < h; by += (bx === 0 || bx === w - 1) ? 1 : h - 1) {
          var bp = by * w + bx;
          if (!visited[bp] && isBg(bp)) { visited[bp] = 1; queue.push(bp); }
        }
      }
      while (queue.length) {
        var p = queue.pop();
        d[p * 4 + 3] = 0;
        var px = p % w, py = (p / w) | 0;
        var ns = [];
        if (px > 0)     ns.push(p - 1);
        if (px < w - 1) ns.push(p + 1);
        if (py > 0)     ns.push(p - w);
        if (py < h - 1) ns.push(p + w);
        for (var n = 0; n < ns.length; n++) {
          if (!visited[ns[n]] && isBg(ns[n])) { visited[ns[n]] = 1; queue.push(ns[n]); }
        }
      }
    }
    cb({ data: id.data, w: img.width, h: img.height });
    if (++_texLoadCount >= _texLoadTotal) _texLoadCount = _texLoadTotal;
  };
  img.onerror = function() { ++_texLoadCount; };
  img.src = src;
}

// Sprite textures are stored as canvases (used with drawImage, not pixel arrays).
// Background removal: flood-fill from all four border edges, keying out any
// near-white pixel reachable from the border. Interior bright pixels are safe.
function _loadSprite(src, key) {
  var img = new Image();
  img.onload = function() {
    var c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    var cx = c.getContext('2d');
    cx.drawImage(img, 0, 0);
    var id = cx.getImageData(0, 0, c.width, c.height);
    var d = id.data;
    var w = c.width, h = c.height;

    // Check if the image already has meaningful transparency — if so, skip keying
    var hasAlpha = false;
    for (var i = 3; i < d.length; i += 4) {
      if (d[i] < 200) { hasAlpha = true; break; }
    }

    if (!hasAlpha) {
      var visited = new Uint8Array(w * h);
      var queue = [];
      function nearWhite(p) {
        var i = p * 4;
        var r = d[i], g = d[i+1], b = d[i+2];
        // Neutral grey (low saturation) AND bright — catches white and grey checkerboard
        var mx = r > g ? (r > b ? r : b) : (g > b ? g : b);
        var mn = r < g ? (r < b ? r : b) : (g < b ? g : b);
        return (mx - mn) < 50 && (r + g + b) > 450;
      }
      // Seed from every border pixel
      for (var bx = 0; bx < w; bx++) {
        for (var by = 0; by < h; by += (bx === 0 || bx === w - 1) ? 1 : h - 1) {
          var bp = by * w + bx;
          if (!visited[bp] && nearWhite(bp)) { visited[bp] = 1; queue.push(bp); }
        }
      }
      // BFS flood-fill
      while (queue.length) {
        var p = queue.pop();
        d[p * 4 + 3] = 0;
        var px = p % w, py = (p / w) | 0;
        var ns = [];
        if (px > 0)     ns.push(p - 1);
        if (px < w - 1) ns.push(p + 1);
        if (py > 0)     ns.push(p - w);
        if (py < h - 1) ns.push(p + w);
        for (var n = 0; n < ns.length; n++) {
          if (!visited[ns[n]] && nearWhite(ns[n])) { visited[ns[n]] = 1; queue.push(ns[n]); }
        }
      }
    }

    cx.putImageData(id, 0, 0);
    SPRITE_TEXTURES[key] = { canvas: c, w: img.width, h: img.height };
  };
  img.src = src;
}

function loadTextures() {
  // Round 1 walls
  _loadTex('assets/textures/wall_stone.png',         function(t) { WALL_TEXTURES[1] = t; });
  _loadTex('assets/textures/wall_plaster.png',       function(t) { WALL_TEXTURES[2] = t; });
  _loadTex('assets/textures/wall_curtain.png',       function(t) { WALL_TEXTURES[3] = t; });
  _loadTex('assets/textures/wall_brick.png',         function(t) { WALL_TEXTURES[4] = t; });
  _loadTex('assets/textures/wall_wood.png',          function(t) { WALL_TEXTURES[5] = t; });
  // Round 2 walls
  _loadTex('assets/r2/textures/wall_concrete.png',      function(t) { WALL_TEXTURES[6]  = t; });
  _loadTex('assets/r2/textures/wall_corrugated.png',    function(t) { WALL_TEXTURES[7]  = t; });
  _loadTex('assets/r2/textures/wall_lime.png',          function(t) { WALL_TEXTURES[8]  = t; });
  _loadTex('assets/r2/textures/wall_pipemetal.png',     function(t) { WALL_TEXTURES[9]  = t; });
  _loadTex('assets/r2/textures/wall_sugar.png',         function(t) { WALL_TEXTURES[10] = t; });
  // Round 3 walls
  _loadTex('assets/r3/textures/wall_wallpaper.png',     function(t) { WALL_TEXTURES[11] = t; });
  _loadTex('assets/r3/textures/wall_mahogany.png',      function(t) { WALL_TEXTURES[12] = t; });
  _loadTex('assets/r3/textures/wall_tile.png',          function(t) { WALL_TEXTURES[13] = t; });
  _loadTex('assets/r3/textures/wall_gilt.png',          function(t) { WALL_TEXTURES[14] = t; });
  _loadTex('assets/r3/textures/wall_cellarstone.png',   function(t) { WALL_TEXTURES[15] = t; });
  // Overworld exterior walls
  _loadTex('assets/overworld/textures/wall_opera_facade.png',  function(t) { WALL_TEXTURES[17] = t; });
  _loadTex('assets/overworld/textures/wall_mill_facade.png',   function(t) { WALL_TEXTURES[18] = t; });
  _loadTex('assets/overworld/textures/wall_hotel_facade.png',  function(t) { WALL_TEXTURES[19] = t; });
  _loadTex('assets/overworld/textures/wall_hedge.png',         function(t) { WALL_TEXTURES[20] = t; });
  _loadTex('assets/overworld/textures/ground.png',             function(t) { FLOOR_TEXTURES['ow_ground'] = t; });
  // Doors + upper storeys + decals — procedural placeholders live in decals.js;
  // these PNGs override them when the assets exist (prompts under prompts/).
  _loadTex('assets/overworld/textures/door_opera.png',  function(t) { WALL_TEXTURES[21] = t; });
  _loadTex('assets/overworld/textures/door_mill.png',   function(t) { WALL_TEXTURES[22] = t; });
  _loadTex('assets/overworld/textures/door_hotel.png',  function(t) { WALL_TEXTURES[23] = t; });
  _loadTex('assets/overworld/textures/upper_opera.png',      function(t) { UPPER_TEXTURES[17] = UPPER_TEXTURES[21] = t; });
  _loadTex('assets/overworld/textures/upper_mill.png',       function(t) { UPPER_TEXTURES[18] = UPPER_TEXTURES[22] = t; });
  _loadTex('assets/overworld/textures/upper_hotel.png',      function(t) { UPPER_TEXTURES[19] = UPPER_TEXTURES[23] = t; });
  _loadTex('assets/overworld/textures/upper_storefront.png', function(t) { UPPER_TEXTURES[4] = t; });
  var _decalNames = [
    'poster_gala', 'poster_masque', 'poster_seance', 'portrait_gm',
    'mill_safety', 'mill_tonnage', 'mill_missing', 'mill_sugar',
    'hotel_portrait_a', 'hotel_portrait_b', 'hotel_hunt', 'hotel_rates',
    'ow_billboard_a', 'ow_billboard_b', 'ow_hotel_plaque', 'ow_mill_notice',
  ];
  _decalNames.forEach(function(name) {
    _loadTex('assets/decals/' + name + '.png', function(t) { DECAL_TEXTURES[name] = t; }, true);
  });
  // Round 1 floors + ceilings
  _loadTex('assets/textures/floor_foyer.png',        function(t) { FLOOR_TEXTURES[0] = t; });
  _loadTex('assets/textures/floor_auditorium.png',   function(t) { FLOOR_TEXTURES[1] = t; });
  _loadTex('assets/textures/floor_gallery.png',      function(t) { FLOOR_TEXTURES[2] = t; });
  _loadTex('assets/textures/floor_flies.png',        function(t) { FLOOR_TEXTURES[3] = t; });
  _loadTex('assets/textures/ceiling_foyer.png',      function(t) { CEIL_TEXTURES[0] = t; });
  _loadTex('assets/textures/ceiling_auditorium.png', function(t) { CEIL_TEXTURES[1] = t; });
  _loadTex('assets/textures/ceiling_gallery.png',    function(t) { CEIL_TEXTURES[2] = t; });
  _loadTex('assets/textures/ceiling_flies.png',      function(t) { CEIL_TEXTURES[3] = t; });
  // Round 2 floors + ceilings (indices 4–11 map to R2 floor 0–7)
  _loadTex('assets/r2/textures/floor_beetyard.png',       function(t) { FLOOR_TEXTURES[4]  = t; });
  _loadTex('assets/r2/textures/floor_washhouse.png',      function(t) { FLOOR_TEXTURES[5]  = t; });
  _loadTex('assets/r2/textures/floor_slicefloor.png',     function(t) { FLOOR_TEXTURES[6]  = t; });
  _loadTex('assets/r2/textures/floor_diffusion.png',      function(t) { FLOOR_TEXTURES[7]  = t; });
  _loadTex('assets/r2/textures/floor_limehouse.png',      function(t) { FLOOR_TEXTURES[8]  = t; });
  _loadTex('assets/r2/textures/floor_evaporator.png',     function(t) { FLOOR_TEXTURES[9]  = t; });
  _loadTex('assets/r2/textures/floor_panhouse.png',       function(t) { FLOOR_TEXTURES[10] = t; });
  _loadTex('assets/r2/textures/floor_sugartower.png',     function(t) { FLOOR_TEXTURES[11] = t; });
  _loadTex('assets/r2/textures/ceiling_beetyard.png',     function(t) { CEIL_TEXTURES[4]  = t; });
  _loadTex('assets/r2/textures/ceiling_washhouse.png',    function(t) { CEIL_TEXTURES[5]  = t; });
  _loadTex('assets/r2/textures/ceiling_slicefloor.png',   function(t) { CEIL_TEXTURES[6]  = t; });
  _loadTex('assets/r2/textures/ceiling_diffusion.png',    function(t) { CEIL_TEXTURES[7]  = t; });
  _loadTex('assets/r2/textures/ceiling_limehouse.png',    function(t) { CEIL_TEXTURES[8]  = t; });
  _loadTex('assets/r2/textures/ceiling_evaporator.png',   function(t) { CEIL_TEXTURES[9]  = t; });
  _loadTex('assets/r2/textures/ceiling_panhouse.png',     function(t) { CEIL_TEXTURES[10] = t; });
  _loadTex('assets/r2/textures/ceiling_sugartower.png',   function(t) { CEIL_TEXTURES[11] = t; });
  // Round 3 floors + ceilings (indices 12–21 map to R3 floor 0–9)
  _loadTex('assets/r3/textures/floor_lobby.png',        function(t) { FLOOR_TEXTURES[12] = t; });
  _loadTex('assets/r3/textures/floor_ballroom.png',     function(t) { FLOOR_TEXTURES[13] = t; });
  _loadTex('assets/r3/textures/floor_kitchen.png',      function(t) { FLOOR_TEXTURES[14] = t; });
  _loadTex('assets/r3/textures/floor_guestII.png',      function(t) { FLOOR_TEXTURES[15] = t; });
  _loadTex('assets/r3/textures/floor_guestIII.png',     function(t) { FLOOR_TEXTURES[16] = t; });
  _loadTex('assets/r3/textures/floor_guestIV.png',      function(t) { FLOOR_TEXTURES[17] = t; });
  _loadTex('assets/r3/textures/floor_honeymoon.png',    function(t) { FLOOR_TEXTURES[18] = t; });
  _loadTex('assets/r3/textures/floor_maids.png',        function(t) { FLOOR_TEXTURES[19] = t; });
  _loadTex('assets/r3/textures/floor_attic.png',        function(t) { FLOOR_TEXTURES[20] = t; });
  _loadTex('assets/r3/textures/floor_penthouse.png',    function(t) { FLOOR_TEXTURES[21] = t; });
  _loadTex('assets/r3/textures/ceiling_lobby.png',      function(t) { CEIL_TEXTURES[12] = t; });
  _loadTex('assets/r3/textures/ceiling_ballroom.png',   function(t) { CEIL_TEXTURES[13] = t; });
  _loadTex('assets/r3/textures/ceiling_kitchen.png',    function(t) { CEIL_TEXTURES[14] = t; });
  _loadTex('assets/r3/textures/ceiling_guestII.png',    function(t) { CEIL_TEXTURES[15] = t; });
  _loadTex('assets/r3/textures/ceiling_guestIII.png',   function(t) { CEIL_TEXTURES[16] = t; });
  _loadTex('assets/r3/textures/ceiling_guestIV.png',    function(t) { CEIL_TEXTURES[17] = t; });
  _loadTex('assets/r3/textures/ceiling_honeymoon.png',  function(t) { CEIL_TEXTURES[18] = t; });
  _loadTex('assets/r3/textures/ceiling_maids.png',      function(t) { CEIL_TEXTURES[19] = t; });
  _loadTex('assets/r3/textures/ceiling_attic.png',      function(t) { CEIL_TEXTURES[20] = t; });
  _loadTex('assets/r3/textures/ceiling_penthouse.png',  function(t) { CEIL_TEXTURES[21] = t; });

  _loadSprite('assets/items/program.png',      'program');
  _loadSprite('assets/items/program-full.png', 'program-full');
  _loadSprite('assets/screens/title.png',      'screen-title');
  _loadSprite('assets/screens/gameover.png',   'screen-gameover');
  _loadSprite('assets/screens/win.png',        'screen-win');
  _loadSprite('assets/gm/gm-idle.png',         'gm-idle');
  _loadSprite('assets/gm/gm-walk-a.png',       'gm-walk-a');
  _loadSprite('assets/gm/gm-walk-b.png',       'gm-walk-b');
  _loadSprite('assets/gm/gm-lunge.png',        'gm-lunge');
  _loadSprite('assets/gm/gm-back.png',                'gm-back');
  _loadSprite('assets/gm/gm-back-a.png',             'gm-back-a');
  _loadSprite('assets/gm/gm-back-b.png',             'gm-back-b');
  _loadSprite('assets/overworld/gm/stalker.png',     'gm-stalker');
  _loadSprite('assets/r2/items/punch-card.png',      'punch-card');
  _loadSprite('assets/r2/items/punch-card-full.png', 'punch-card-full');
  _loadSprite('assets/r2/screens/win.png',           'screen-win-r2');
  _loadSprite('assets/r3/items/room-key.png',        'room-key');
  _loadSprite('assets/r3/items/room-key-full.png',   'room-key-full');
  _loadSprite('assets/r3/screens/win.png',           'screen-win-r3');

  // UI / HUD chrome — optional polish sprites (prompts under prompts/ui/).
  // Every one of these has a procedural fallback in renderer.js / sprites.js /
  // overworld.js; missing files cost nothing.
  _loadSprite('assets/ui/topbar.png',           'ui-topbar');
  _loadSprite('assets/ui/bottombar.png',        'ui-bottombar');
  _loadSprite('assets/ui/map_parchment.png',    'ui-map');
  _loadSprite('assets/ui/logo.png',             'ui-logo');
  _loadSprite('assets/ui/lucky.png',            'ui-lucky');
  _loadSprite('assets/ui/eye_open.png',         'ui-eye-open');
  _loadSprite('assets/ui/eye_shut.png',         'ui-eye-shut');
  _loadSprite('assets/ui/arrow_up.png',         'ui-arrow-up');
  _loadSprite('assets/ui/arrow_down.png',       'ui-arrow-down');
  _loadSprite('assets/ui/arrow_door.png',       'ui-arrow-door');
  _loadSprite('assets/ui/arrow_locked.png',     'ui-arrow-locked');
  ['program', 'card', 'key'].forEach(function(item) {
    _loadSprite('assets/ui/pip_' + item + '_lit.png', 'ui-pip-' + item + '-lit');
    _loadSprite('assets/ui/pip_' + item + '_dim.png', 'ui-pip-' + item + '-dim');
  });
  ['opera', 'mill', 'hotel'].forEach(function(b) {
    _loadSprite('assets/ui/stage_' + b + '_lit.png', 'ui-stage-' + b + '-lit');
    _loadSprite('assets/ui/stage_' + b + '_dim.png', 'ui-stage-' + b + '-dim');
  });
}

loadTextures();
