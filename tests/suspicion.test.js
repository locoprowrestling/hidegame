// tests/suspicion.test.js
// Run: node tests/suspicion.test.js

// ─── Inline constants needed by the tested function ───────────────
var SUSPICION_ZONE_GOOD_MULT = 0.3;
var SUSPICION_ZONE_BAD_MULT  = 2.0;

// ─── Copy of getZoneMultiplier (browser globals not available in Node) ─
function getZoneMultiplier(room, objId, px, py) {
  var zones = room.zones;
  for (var i = 0; i < zones.length; i++) {
    var z = zones[i];
    if (px >= z.x && px < z.x + z.w && py >= z.y && py < z.y + z.h) {
      if (z.believableObjects.indexOf(objId) !== -1) return SUSPICION_ZONE_GOOD_MULT;
      return z.defaultMult;
    }
  }
  return 1.0;
}

var pass = 0, fail = 0;
function assert(cond, msg) {
  if (cond) { pass++; } else { fail++; process.stderr.write('FAIL: ' + msg + '\n'); }
}

var mockRing = {
  zones: [
    {name:'ring_interior', x:84, y:84, w:88, h:88, believableObjects:[], defaultMult:2.0},
    {name:'ringside',      x:48, y:48, w:160,h:160,believableObjects:['chair','ladder'], defaultMult:1.0},
    {name:'open_floor',    x:0,  y:20, w:256,h:236,believableObjects:[], defaultMult:1.0},
  ]
};

// chair inside ring → bad (2.0)
assert(getZoneMultiplier(mockRing,'chair',128,128) === 2.0,
  'ring interior: chair should be 2.0, got ' + getZoneMultiplier(mockRing,'chair',128,128));

// chair at ringside (not in ring_interior) → good (0.3)
assert(getZoneMultiplier(mockRing,'chair',50,60) === SUSPICION_ZONE_GOOD_MULT,
  'ringside: chair should be 0.3, got ' + getZoneMultiplier(mockRing,'chair',50,60));

// road_case at ringside → neutral (1.0, not in believableObjects)
assert(getZoneMultiplier(mockRing,'road_case',50,60) === 1.0,
  'ringside: road_case should be 1.0 neutral, got ' + getZoneMultiplier(mockRing,'road_case',50,60));

// outside all zones → fallthrough neutral (1.0)
assert(getZoneMultiplier(mockRing,'chair',5,5) === 1.0,
  'outside zones: should fall through to 1.0');

process.stdout.write('Suspicion zone tests: ' + pass + ' passed, ' + fail + ' failed\n');
if (fail > 0) process.exit(1);
