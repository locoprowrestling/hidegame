#!/usr/bin/env node

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const audioPath = path.join(root, 'audio.js');

function makeAudioStub() {
  const instances = [];

  function AudioStub() {
    this.src = '';
    this.loop = false;
    this.muted = false;
    this.currentTime = 0;
    this.paused = true;
    this.playCalls = 0;
    this.pauseCalls = 0;
    this.onended = null;
    instances.push(this);
  }

  AudioStub.prototype.play = function play() {
    this.playCalls += 1;
    this.paused = false;
    return Promise.resolve();
  };

  AudioStub.prototype.pause = function pause() {
    this.pauseCalls += 1;
    this.paused = true;
  };

  return { AudioStub, instances };
}

function loadAudioModule() {
  const audio = makeAudioStub();
  const context = {
    Audio: audio.AudioStub,
    console: { log() {}, warn() {}, error() {} },
    window: {},
  };
  context.globalThis = context;

  const source = fs.readFileSync(audioPath, 'utf8');
  vm.runInNewContext(source, context, { filename: audioPath });

  return { context, instances: audio.instances };
}

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (err) {
    console.error(`not ok - ${name}`);
    console.error(err && err.stack ? err.stack : err);
    process.exitCode = 1;
  }
}

test('playMusic("menu") plays the menu intro then hands off to the loop', () => {
  const { context, instances } = loadAudioModule();
  const bgm = instances[0];

  context.playMusic('menu');

  assert.strictEqual(bgm.src, 'Assets/audio/BG-00-MENU-Pause Menu Drift.mp3');
  assert.strictEqual(bgm.loop, false);
  assert.strictEqual(bgm.playCalls, 1);
  assert.strictEqual(typeof bgm.onended, 'function');

  bgm.onended();

  assert.strictEqual(bgm.src, 'Assets/audio/BG-00-MENU-Pause Menu Drift-2.mp3');
  assert.strictEqual(bgm.loop, true);
  assert.strictEqual(bgm.playCalls, 2);
});

test('playMusic("win") plays the fanfare once then loops final menu music', () => {
  const { context, instances } = loadAudioModule();
  const bgm = instances[0];

  context.playMusic('win');
  assert.strictEqual(bgm.src, 'Assets/audio/BG-00-FANFARE-Winner.mp3');
  assert.strictEqual(bgm.loop, false);

  bgm.onended();

  assert.strictEqual(bgm.src, 'Assets/audio/BG-00-FINAL-Final Menu.mp3');
  assert.strictEqual(bgm.loop, true);
});

test('toggleMute updates muted state used by the active BGM', () => {
  const { context, instances } = loadAudioModule();
  const bgm = instances[0];

  assert.strictEqual(context.isMuted(), false);
  assert.strictEqual(context.toggleMute(), true);
  assert.strictEqual(context.isMuted(), true);
  assert.strictEqual(bgm.muted, true);

  context.playMusic('gameplay');
  assert.strictEqual(bgm.muted, true);
  assert.strictEqual(bgm.src, 'Assets/audio/BG-05-Opera House Level 5-L21-25.mp3');
});

test('stopMusic pauses and rewinds the active BGM', () => {
  const { context, instances } = loadAudioModule();
  const bgm = instances[0];

  context.playMusic('gameover');
  bgm.currentTime = 12;

  context.stopMusic();

  assert.strictEqual(bgm.pauseCalls >= 1, true);
  assert.strictEqual(bgm.currentTime, 0);
});
