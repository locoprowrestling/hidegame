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
