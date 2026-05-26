// audio.js - single-BGM music controller for Hide

var AUDIO_BASE = 'Assets/audio/';

var AUDIO_TRACKS = {
  menu: {
    intro: 'BG-00-MENU-Pause Menu Drift.mp3',
    loop: 'BG-00-MENU-Pause Menu Drift-2.mp3'
  },
  gameplay: {
    intro: 'BG-05-Opera House Level 5-L21-25.mp3',
    loop: 'BG-05-Opera House Level 5-L21-25-2.mp3'
  },
  win: {
    intro: 'BG-00-FANFARE-Winner.mp3',
    loop: 'BG-00-FINAL-Final Menu.mp3'
  },
  gameover: {
    intro: 'BG-00-FINAL-Final Menu.mp3',
    loop: 'BG-00-FINAL-Final Menu.mp3',
    loopImmediately: true
  }
};

var _bgm = new Audio();
var _muted = false;
var _audioInitialized = false;

function setBgmSource(filename, shouldLoop) {
  _bgm.loop = !!shouldLoop;
  _bgm.src = AUDIO_BASE + filename;
  _bgm.muted = _muted;
  _bgm.currentTime = 0;
}

function playBgm() {
  var result = _bgm.play();
  if (result && typeof result.catch === 'function') {
    result.catch(function() {});
  }
}

function initAudio() {
  if (_audioInitialized) return;
  _audioInitialized = true;
  _bgm.muted = _muted;
}

function playMusic(key) {
  var track = AUDIO_TRACKS[key];
  if (!track) return;

  _bgm.pause();
  _bgm.onended = null;

  if (track.loopImmediately) {
    setBgmSource(track.loop, true);
  } else {
    setBgmSource(track.intro, false);
    if (track.loop) {
      _bgm.onended = function() {
        setBgmSource(track.loop, true);
        playBgm();
      };
    }
  }

  playBgm();
}

function stopMusic() {
  _bgm.pause();
  _bgm.currentTime = 0;
}

function toggleMute() {
  _muted = !_muted;
  _bgm.muted = _muted;
  return _muted;
}

function isMuted() {
  return _muted;
}
