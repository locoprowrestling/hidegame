var _bgm   = new Audio();
var _muted = false;
var _ready = false;

var TRACKS = {
  menu: {
    src:  'audio/Echoes in the Void.mp3',
    loop: 'audio/Echoes in the Void v2.mp3'
  },
  play: {
    src:  'audio/Backrooms of the Opera.mp3',
    loop: 'audio/Backrooms of the Opera v2.mp3'
  },
  win: {
    src:  'audio/Echoes in the Void v2.mp3',
    loop: 'audio/Echoes in the Void v2.mp3',
    immediate: true
  },
  gameover: {
    src:  'audio/Echoes in the Void.mp3',
    loop: 'audio/Echoes in the Void v2.mp3',
    immediate: true
  }
};

function initAudio() {
  if (_ready) return;
  _ready = true;
  _bgm.muted = _muted;
}

function playTrack(key) {
  var t = TRACKS[key];
  if (!t) return;
  _bgm.pause();
  _bgm.onended = null;
  if (t.immediate) {
    _bgm.src = t.src;
    _bgm.loop = true;
  } else {
    _bgm.src = t.src;
    _bgm.loop = false;
    _bgm.onended = function() {
      if (t.loop) { _bgm.src = t.loop; _bgm.loop = true; }
      _bgm.play().catch(function(){});
    };
  }
  _bgm.muted = _muted;
  _bgm.play().catch(function(){});
}

_bgm.onerror = function() {};

function toggleMute() {
  _muted = !_muted;
  _bgm.muted = _muted;
  for (var k in _sfxCache) _sfxCache[k].muted = _muted;
}

// ── One-shot SFX (audio/sfx/*.wav) ────────────────────────────────────────────
// AMB-* play randomly for atmosphere; EVT-* accompany the scare events.
var _SFX_AMB    = ['AMB-voicescream', 'AMB-voicescream2', 'AMB-voicemoan', 'AMB-voicemoan2'];
var _SFX_VERSES = ['EVT-verse1', 'EVT-verse2'];
var _sfxCache = {};

function playSfx(name, vol) {
  if (_muted) return;
  var a = _sfxCache[name];
  if (!a) {
    a = new Audio('audio/sfx/' + name + '.wav');
    a.preload = 'auto';
    a.onerror = function() {};
    _sfxCache[name] = a;
  }
  try {
    a.currentTime = 0;
    a.volume = vol == null ? 1 : vol;
    a.play().catch(function(){});
  } catch (e) {}
}

function playScareLaugh() {
  playSfx('EVT-evillaugh', 0.55);
}

function playScareVerse() {
  playSfx(_SFX_VERSES[(Math.random() * _SFX_VERSES.length) | 0], 0.55);
}

// Ambient voices — long random gaps so they stay unsettling, not predictable
var _ambTimer = 14000 + Math.random() * 20000;

function updateAmbience(dt) {
  _ambTimer -= dt;
  if (_ambTimer > 0) return;
  _ambTimer = 25000 + Math.random() * 30000;
  playSfx(_SFX_AMB[(Math.random() * _SFX_AMB.length) | 0], 0.3);
}

// ── Heartbeat SFX — WebAudio thump that quickens with stress ──────────────────
var _actx    = null;
var _hbTimer = 0;

function _getACtx() {
  if (_actx) return _actx;
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (AC) _actx = new AC();
  } catch (e) { _actx = null; }
  return _actx;
}

function _thump(vol) {
  var ac = _getACtx();
  if (!ac) return;
  if (ac.state === 'suspended') { ac.resume().catch(function(){}); }
  try {
    var t = ac.currentTime;
    var osc  = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(58, t);
    osc.frequency.exponentialRampToValueAtTime(34, t + 0.13);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.connect(gain); gain.connect(ac.destination);
    osc.start(t); osc.stop(t + 0.18);
    // softer second beat — "lub-dub"
    var osc2  = ac.createOscillator();
    var gain2 = ac.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(50, t + 0.16);
    osc2.frequency.exponentialRampToValueAtTime(30, t + 0.27);
    gain2.gain.setValueAtTime(0.0001, t);
    gain2.gain.setValueAtTime(vol * 0.6, t + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc2.connect(gain2); gain2.connect(ac.destination);
    osc2.start(t + 0.16); osc2.stop(t + 0.32);
  } catch (e) {}
}

function updateHeartbeat(stress, dt) {
  if (_muted || stress < STRESS_HEARTBEAT) { _hbTimer = 0; return; }
  _hbTimer -= dt;
  if (_hbTimer <= 0) {
    var frac = (stress - STRESS_HEARTBEAT) / (STRESS_MAX - STRESS_HEARTBEAT); // 0..1
    _thump(0.10 + 0.14 * frac);
    _hbTimer = 1050 - 580 * frac; // 1.05 s → 0.47 s between beats
  }
}

function stopHeartbeat() {
  _hbTimer = 0;
}
