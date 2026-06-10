// decals.js — wall decals (posters, paintings, signage) plus procedural
// placeholder pixel art for the building doors and upper-storey facades.
//
// Placeholders are generated synchronously here; PNG assets loaded in
// textures.js use the same keys and override them when present (see
// prompts/decals/ and prompts/overworld/textures/ for the imagegen specs).
//
// A decal hangs on one face of a solid wall tile. Faces: 'N','S','W','E'.
// The raycaster samples the decal over the wall texture wherever the decal
// pixel's alpha > 127.

var DECAL_TEXTURES = {};   // name → {data, w, h} — RGBA, alpha respected
var UPPER_TEXTURES = {};   // wall type → {data, w, h} — storeys above ground

// Band of the wall face a decal occupies (fractions of the tile)
var DECAL_X0 = 0.18, DECAL_X1 = 0.82;
var DECAL_Y0 = 0.12, DECAL_Y1 = 0.72;

// ── Painter helper ────────────────────────────────────────────────────────────
function _paintTex(w, h, fn) {
  var c = document.createElement('canvas');
  c.width = w; c.height = h;
  var cx = c.getContext('2d');
  fn(cx, w, h);
  var id = cx.getImageData(0, 0, w, h);
  return { data: id.data, w: w, h: h };
}

// Rows of short bars that read as text at raycaster resolution
function _textBars(g, x, y, w, rows, color) {
  g.fillStyle = color;
  for (var i = 0; i < rows; i++) {
    var rw = Math.round(w * (0.55 + ((i * 53) % 40) / 100));
    g.fillRect(x + ((w - rw) >> 1), y + i * 4, rw, 2);
  }
}

// ── Door textures (placeholders for WALL_TEXTURES 21–23) ─────────────────────
WALL_TEXTURES[WALL_DOOR_OPERA] = _paintTex(64, 64, function(g) {
  g.fillStyle = '#3a3026'; g.fillRect(0, 0, 64, 64);            // stone surround
  g.fillStyle = '#16100c'; g.fillRect(5, 6, 54, 58);            // recess
  g.fillStyle = '#c0a060';                                       // gilt arch
  g.fillRect(5, 6, 54, 2); g.fillRect(5, 6, 2, 58); g.fillRect(57, 6, 2, 58);
  g.fillStyle = '#5a1414'; g.fillRect(9, 13, 21, 51);           // left leaf
  g.fillRect(34, 13, 21, 51);                                    // right leaf
  g.fillStyle = '#702020';                                       // raised panels
  g.fillRect(11, 17, 17, 18); g.fillRect(36, 17, 17, 18);
  g.fillRect(11, 41, 17, 18); g.fillRect(36, 41, 17, 18);
  g.fillStyle = '#c0a060'; g.fillRect(30, 13, 4, 51);           // centre stile
  g.fillStyle = '#e8cc88'; g.fillRect(27, 36, 2, 6); g.fillRect(35, 36, 2, 6); // handles
  g.fillStyle = '#0a0806'; g.fillRect(9, 13, 46, 3);            // arch shadow
});

WALL_TEXTURES[WALL_DOOR_MILL] = _paintTex(64, 64, function(g) {
  for (var x = 0; x < 64; x += 4) {                              // corrugated bg
    g.fillStyle = (x % 8) ? '#26241f' : '#2e2c26';
    g.fillRect(x, 0, 4, 64);
  }
  g.fillStyle = '#383028'; g.fillRect(6, 10, 52, 54);           // sliding door slab
  g.fillStyle = '#241f18';
  for (var y = 14; y < 62; y += 10) g.fillRect(8, y, 48, 2);    // panel seams
  g.fillStyle = '#4a2c16';                                       // rust bleed
  g.fillRect(6, 52, 14, 12); g.fillRect(44, 10, 10, 9); g.fillRect(26, 30, 7, 14);
  g.fillStyle = '#6a6a66';                                       // chain — stepped diagonals
  for (var i = 0; i < 13; i++) {
    g.fillRect(8 + i * 4, 16 + i * 3, 4, 3);
    g.fillRect(56 - i * 4 - 4, 16 + i * 3, 4, 3);
  }
  g.fillStyle = '#8a7430'; g.fillRect(28, 34, 9, 11);           // padlock body
  g.fillStyle = '#1a160f'; g.fillRect(30, 30, 5, 5);            // shackle gap
  g.fillStyle = '#8a7430'; g.fillRect(29, 29, 7, 2); g.fillRect(29, 29, 2, 6); g.fillRect(34, 29, 2, 6);
});

WALL_TEXTURES[WALL_DOOR_HOTEL] = _paintTex(64, 64, function(g) {
  g.fillStyle = '#3c241c'; g.fillRect(0, 0, 64, 64);            // brick surround
  g.fillStyle = '#150f0c'; g.fillRect(6, 4, 52, 60);            // recess
  g.fillStyle = '#56523c'; g.fillRect(10, 7, 44, 9);            // transom — faint sick glow
  g.fillStyle = '#73704e'; g.fillRect(13, 9, 8, 5); g.fillRect(28, 9, 8, 5); g.fillRect(43, 9, 8, 5);
  g.fillStyle = '#34180e'; g.fillRect(10, 19, 21, 45);          // mahogany leaves
  g.fillRect(33, 19, 21, 45);
  g.fillStyle = '#482612';                                       // door panels
  g.fillRect(12, 23, 17, 16); g.fillRect(35, 23, 17, 16);
  g.fillRect(12, 44, 17, 16); g.fillRect(35, 44, 17, 16);
  g.fillStyle = '#9a7c3a'; g.fillRect(30, 19, 4, 45);           // brass stile
  g.fillRect(10, 58, 44, 3);                                     // brass kick plate
  g.fillStyle = '#c8a85a'; g.fillRect(27, 38, 2, 7); g.fillRect(35, 38, 2, 7); // handles
});

// ── Upper-storey textures (overworld fake floors) ────────────────────────────
function _makeUpper(base, brickShadow, win, litIdx, litColor) {
  return _paintTex(64, 64, function(g) {
    g.fillStyle = base; g.fillRect(0, 0, 64, 64);
    g.fillStyle = brickShadow;
    for (var y = 6; y < 64; y += 9) g.fillRect(0, y, 64, 1);    // course lines
    for (var i = 0; i < 3; i++) {                                // three windows
      var x = 6 + i * 19;
      g.fillStyle = (i === litIdx) ? litColor : win;
      g.fillRect(x, 16, 12, 24);
      g.fillStyle = 'rgba(0,0,0,0.55)';                          // muntins
      g.fillRect(x + 5, 16, 2, 24); g.fillRect(x, 27, 12, 2);
      g.fillStyle = 'rgba(255,255,255,0.10)';                    // sill
      g.fillRect(x - 1, 40, 14, 2);
    }
    g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(0, 60, 64, 4);  // storey band
  });
}
// One lit window high in the Opera House and the Hotel — someone is up there.
UPPER_TEXTURES[17] = UPPER_TEXTURES[21] = _makeUpper('#46382a', '#2e241a', '#14121c', 1, '#7a5c22');
UPPER_TEXTURES[19] = UPPER_TEXTURES[23] = _makeUpper('#3c241c', '#281712', '#120f18', 2, '#6e5a2a');
UPPER_TEXTURES[18] = UPPER_TEXTURES[22] = _makeUpper('#2a2a26', '#1c1c1a', '#0e1014', -1, '#000');
UPPER_TEXTURES[4]  = _makeUpper('#38231a', '#241610', '#13111a', -1, '#000');

// ── Decal placeholder art ─────────────────────────────────────────────────────
// Round 1 — Opera House: old playbills + a portrait of the Games Master
DECAL_TEXTURES['poster_gala'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#cfc4a0'; g.fillRect(2, 2, 44, 60);            // aged paper
  g.fillStyle = '#7a1414'; g.fillRect(2, 2, 44, 12);            // title band
  _textBars(g, 6, 6, 36, 1, '#e8d8b0');
  g.fillStyle = '#26201a';                                       // proscenium arch
  g.fillRect(8, 20, 32, 3); g.fillRect(8, 20, 3, 22); g.fillRect(37, 20, 3, 22);
  g.fillStyle = '#7a1414'; g.fillRect(11, 23, 26, 19);          // curtain
  g.fillStyle = '#1a1410'; g.fillRect(20, 30, 8, 12);           // figure on stage
  _textBars(g, 6, 48, 36, 3, '#3a3026');
});
DECAL_TEXTURES['poster_masque'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#1c2440'; g.fillRect(2, 2, 44, 60);            // midnight paper
  g.fillStyle = '#d8cfae';                                       // two masks
  g.fillRect(9, 16, 13, 16); g.fillRect(26, 16, 13, 16);
  g.fillStyle = '#1c2440';                                       // eye holes
  g.fillRect(12, 21, 3, 4); g.fillRect(17, 21, 3, 4);
  g.fillRect(29, 21, 3, 4); g.fillRect(34, 21, 3, 4);
  g.fillStyle = '#7a1414'; g.fillRect(26, 28, 13, 4);           // one mask grins
  _textBars(g, 6, 42, 36, 4, '#a89c70');
});
DECAL_TEXTURES['poster_seance'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#241a2c'; g.fillRect(2, 2, 44, 60);
  g.fillStyle = '#b8a8d0';                                       // spirit ring
  g.fillRect(14, 14, 20, 2); g.fillRect(14, 32, 20, 2);
  g.fillRect(12, 16, 2, 16); g.fillRect(34, 16, 2, 16);
  g.fillStyle = '#e8e0c8'; g.fillRect(21, 20, 6, 8);            // pale face within
  g.fillStyle = '#241a2c'; g.fillRect(22, 22, 1, 2); g.fillRect(25, 22, 1, 2);
  _textBars(g, 6, 42, 36, 4, '#8a7aa0');
});
DECAL_TEXTURES['portrait_gm'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#8a6c2c'; g.fillRect(0, 0, 48, 64);            // gilt frame
  g.fillStyle = '#52400e'; g.fillRect(3, 3, 42, 58);
  g.fillStyle = '#16101a'; g.fillRect(6, 6, 36, 52);            // dark canvas
  g.fillStyle = '#0a0810'; g.fillRect(14, 28, 20, 30);          // shoulders
  g.fillStyle = '#c8b89c'; g.fillRect(19, 16, 10, 13);          // pale face
  g.fillStyle = '#0a0810'; g.fillRect(16, 8, 16, 9);            // top hat
  g.fillRect(13, 15, 22, 3);
  g.fillStyle = '#aa2222'; g.fillRect(21, 21, 2, 2); g.fillRect(26, 21, 2, 2); // eyes
});

// Round 2 — Sugar Mill: works signage
DECAL_TEXTURES['mill_safety'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#c4b482'; g.fillRect(2, 2, 44, 60);
  g.fillStyle = '#a82414'; g.fillRect(2, 2, 44, 14);
  _textBars(g, 6, 6, 36, 2, '#e8dcb8');
  _textBars(g, 6, 22, 36, 5, '#3a3424');
  g.fillStyle = '#1a1814';                                       // hazard chevrons
  for (var x = 2; x < 46; x += 8) g.fillRect(x, 54, 4, 8);
  g.fillStyle = '#b89a2a';
  for (var x2 = 6; x2 < 46; x2 += 8) g.fillRect(x2, 54, 4, 8);
});
DECAL_TEXTURES['mill_tonnage'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#3a3026'; g.fillRect(0, 0, 48, 64);            // wood frame
  g.fillStyle = '#18221c'; g.fillRect(4, 4, 40, 56);            // chalkboard
  _textBars(g, 8, 9, 32, 2, '#b8c4b4');
  g.fillStyle = '#8a9a8a';                                       // tally grid
  for (var y = 24; y < 56; y += 8) g.fillRect(8, y, 32, 1);
  g.fillRect(24, 22, 1, 34);
  _textBars(g, 8, 26, 14, 4, '#a8b4a4');
});
DECAL_TEXTURES['mill_missing'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#aaa28c'; g.fillRect(3, 2, 42, 60);            // grey notice
  g.fillStyle = '#7a1414'; g.fillRect(3, 2, 42, 10);            // MISSING band
  _textBars(g, 8, 5, 32, 1, '#e0d8c0');
  g.fillStyle = '#2c281f'; g.fillRect(14, 16, 20, 24);          // photo
  g.fillStyle = '#8a8270'; g.fillRect(19, 20, 10, 9);           // face, washed out
  _textBars(g, 7, 46, 34, 4, '#46412f');
});
DECAL_TEXTURES['mill_sugar'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#92aab0'; g.fillRect(2, 2, 44, 60);            // faded ad blue
  _textBars(g, 6, 6, 36, 2, '#e8e8e0');
  g.fillStyle = '#d8d0b4';                                       // sugar sack
  g.fillRect(14, 22, 20, 26);
  g.fillRect(12, 26, 24, 18);
  g.fillStyle = '#a82414'; g.fillRect(14, 30, 20, 8);           // brand band
  _textBars(g, 10, 52, 28, 2, '#3a4a4e');
});

// Round 3 — Hotel Imperial: gilt portraits + a dark landscape
function _hotelPortrait(faceTint, hairColor, collar) {
  return _paintTex(48, 64, function(g) {
    g.clearRect(0, 0, 48, 64);
    g.fillStyle = '#8a6c2c'; g.fillRect(0, 0, 48, 64);
    g.fillStyle = '#52400e'; g.fillRect(3, 3, 42, 58);
    g.fillStyle = '#141018'; g.fillRect(6, 6, 36, 52);
    g.fillStyle = '#100c14'; g.fillRect(13, 30, 22, 28);        // shoulders
    g.fillStyle = collar; g.fillRect(19, 30, 10, 6);            // collar/lace
    g.fillStyle = faceTint; g.fillRect(18, 15, 12, 15);         // face
    g.fillStyle = hairColor; g.fillRect(16, 10, 16, 7);         // hair
    g.fillStyle = '#aa2222'; g.fillRect(21, 21, 2, 2); g.fillRect(26, 21, 2, 2);
  });
}
DECAL_TEXTURES['hotel_portrait_a'] = _hotelPortrait('#c8b09c', '#1c140e', '#cfc8b8');
DECAL_TEXTURES['hotel_portrait_b'] = _hotelPortrait('#bca48e', '#3c3430', '#2a2622');
DECAL_TEXTURES['hotel_hunt'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#6c5420'; g.fillRect(0, 6, 48, 52);            // frame
  g.fillStyle = '#1a2026'; g.fillRect(4, 10, 40, 44);           // night sky
  g.fillStyle = '#10160e'; g.fillRect(4, 34, 40, 20);           // black treeline
  g.fillStyle = '#202c16';
  g.fillRect(8, 28, 6, 8); g.fillRect(20, 26, 8, 10); g.fillRect(34, 29, 6, 7);
  g.fillStyle = '#8a8060'; g.fillRect(30, 16, 6, 6);            // low moon
  g.fillStyle = '#aa2222'; g.fillRect(14, 44, 2, 5);            // a red figure in the field
});
DECAL_TEXTURES['hotel_rates'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#3a2818'; g.fillRect(2, 2, 44, 60);            // wood board
  g.fillStyle = '#9a7c3a'; g.fillRect(5, 5, 38, 2);             // brass rule
  _textBars(g, 7, 11, 34, 2, '#c8a85a');
  _textBars(g, 7, 24, 34, 7, '#8a7450');
  g.fillStyle = '#9a7c3a'; g.fillRect(5, 57, 38, 2);
});

// Overworld — street-side boards and plaques
DECAL_TEXTURES['ow_billboard_a'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#332a1e'; g.fillRect(0, 0, 48, 64);            // board
  g.fillStyle = '#c4b88e'; g.fillRect(5, 5, 38, 54);            // playbill
  g.fillStyle = '#7a1414'; g.fillRect(5, 5, 38, 13);            // TONIGHT
  _textBars(g, 9, 9, 30, 1, '#e8dcb8');
  g.fillStyle = '#16101a'; g.fillRect(18, 24, 12, 16);          // top-hatted figure
  g.fillStyle = '#c8b89c'; g.fillRect(21, 27, 6, 6);
  _textBars(g, 9, 44, 30, 3, '#3a3026');
});
DECAL_TEXTURES['ow_billboard_b'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#332a1e'; g.fillRect(0, 0, 48, 64);
  g.fillStyle = '#b4a87e'; g.fillRect(5, 5, 38, 50);            // torn playbill
  _textBars(g, 9, 10, 30, 3, '#54422a');
  g.fillStyle = '#7a1414'; g.fillRect(9, 26, 30, 7);
  _textBars(g, 9, 38, 30, 2, '#54422a');
  g.fillStyle = '#332a1e';                                       // torn corner — stepped
  g.fillRect(28, 47, 15, 8); g.fillRect(34, 41, 9, 8); g.fillRect(39, 35, 4, 8);
});
DECAL_TEXTURES['ow_hotel_plaque'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#6e5524'; g.fillRect(6, 14, 36, 36);           // brass plaque
  g.fillStyle = '#8a6c2c'; g.fillRect(8, 16, 32, 32);
  _textBars(g, 11, 21, 26, 2, '#41320f');
  _textBars(g, 11, 34, 26, 2, '#41320f');
});
DECAL_TEXTURES['ow_mill_notice'] = _paintTex(48, 64, function(g) {
  g.clearRect(0, 0, 48, 64);
  g.fillStyle = '#a89c84'; g.fillRect(6, 8, 36, 48);            // stained notice
  g.fillStyle = '#181410'; g.fillRect(6, 8, 36, 12);            // KEEP OUT band
  _textBars(g, 10, 11, 28, 1, '#c4b890');
  _textBars(g, 10, 25, 28, 5, '#3c3426');
  g.fillStyle = '#5c4a2e'; g.fillRect(6, 50, 36, 6);            // water stain
});

// ── Hand-placed overworld decals ─────────────────────────────────────────────
// Flanking the entrances + storefront windows along Main Street.
var OW_DECALS = [
  // Opera House — poster boards either side of the doors (east faces)
  { x: 13, y:  5, face: 'E', tex: 'ow_billboard_a' },
  { x: 13, y:  7, face: 'E', tex: 'ow_billboard_b' },
  // Hotel Imperial — brass plaque + notice (west faces)
  { x: 23, y:  5, face: 'W', tex: 'ow_hotel_plaque' },
  { x: 23, y:  7, face: 'W', tex: 'ow_billboard_b' },
  // Sugar Mill — keep-out notices either side of the sliding door
  { x: 24, y: 20, face: 'W', tex: 'ow_mill_notice' },
  { x: 24, y: 22, face: 'W', tex: 'ow_mill_notice' },
  // Storefront windows on Main Street
  { x:  5, y: 17, face: 'N', tex: 'ow_billboard_b' },
  { x: 12, y: 17, face: 'N', tex: 'ow_billboard_a' },
  { x: 14, y: 19, face: 'E', tex: 'ow_billboard_a' },
  { x: 14, y: 23, face: 'E', tex: 'ow_billboard_b' },
];

// ── Interior auto-placement ───────────────────────────────────────────────────
// Posters/paintings are scattered deterministically: a wall tile with a walkable
// neighbour gets a decal when its position hash lands under the density cut.
var DECAL_SETS = [
  ['poster_gala', 'poster_masque', 'poster_seance', 'portrait_gm'],
  ['mill_safety', 'mill_tonnage', 'mill_missing', 'mill_sugar'],
  ['hotel_portrait_a', 'hotel_portrait_b', 'hotel_hunt', 'hotel_rates'],
];
var DECAL_DENSITY = 10;  // % of eligible wall tiles that get a decal

function _floorDecals(floorObj, floorIdx, roundIdx) {
  if (floorObj._decals) return floorObj._decals;
  var set = DECAL_SETS[roundIdx] || DECAL_SETS[0];
  var m = floorObj.map;
  var H = m.length, W = m[0].length;
  var out = [];
  for (var r = 0; r < H; r++) {
    for (var c = 0; c < W; c++) {
      var t = m[r][c];
      if (t <= 0 || t === 3 || t >= 17) continue;  // skip floor, curtains, facades/doors
      var h = ((c * 73856093) ^ (r * 19349663) ^ ((floorIdx + 1) * 83492791) ^
               ((roundIdx + 1) * 15485863)) >>> 0;
      if (h % 100 >= DECAL_DENSITY) continue;
      var faces = [];
      if (r > 0     && m[r - 1][c] === 0) faces.push('N');
      if (r < H - 1 && m[r + 1][c] === 0) faces.push('S');
      if (c > 0     && m[r][c - 1] === 0) faces.push('W');
      if (c < W - 1 && m[r][c + 1] === 0) faces.push('E');
      if (!faces.length) continue;
      out.push({ x: c, y: r, face: faces[(h >> 16) % faces.length],
                 tex: set[(h >> 8) % set.length] });
    }
  }
  floorObj._decals = out;
  return out;
}

// ── Per-frame lookup for the raycaster ───────────────────────────────────────
var _decalLookupCache = {};

function getDecalLookup(gs) {
  var key = gs.isOverworld ? 'ow' : gs.currentRound + ':' + gs.currentFloor;
  var lk = _decalLookupCache[key];
  if (lk) return lk;
  var list = gs.isOverworld
    ? OW_DECALS
    : _floorDecals(FLOORS[gs.currentFloor], gs.currentFloor, gs.currentRound);
  lk = {};
  for (var i = 0; i < list.length; i++) {
    var d = list[i];
    lk[d.x + ',' + d.y + ',' + d.face] = d;
  }
  _decalLookupCache[key] = lk;
  return lk;
}
