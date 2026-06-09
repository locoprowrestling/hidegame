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
