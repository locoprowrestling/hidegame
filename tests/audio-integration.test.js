#!/usr/bin/env node

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

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

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

test('index.html loads audio.js before game.js', () => {
  const html = read('index.html');
  const audioIdx = html.indexOf('<script src="audio.js"></script>');
  const gameIdx = html.indexOf('<script src="game.js"></script>');

  assert.notStrictEqual(audioIdx, -1);
  assert.notStrictEqual(gameIdx, -1);
  assert.strictEqual(audioIdx < gameIdx, true);
});

test('game.js wires music to title, gameplay, win, gameover, and mute events', () => {
  const game = read('game.js');

  assert.match(game, /initAudio\(\);\s*playMusic\('menu'\);/);
  assert.match(game, /toggleMute\(\);/);
  assert.match(game, /function startGame\(\)[\s\S]*playMusic\('gameplay'\);/);
  assert.match(game, /gs\.screen = SCREEN_WIN;[\s\S]*playMusic\('win'\);/);
  assert.match(game, /gs\.screen = SCREEN_GAMEOVER;[\s\S]*playMusic\('gameover'\);/);
});

test('game.js exposes web-game test hooks', () => {
  const game = read('game.js');

  assert.match(game, /window\.render_game_to_text = renderGameToText;/);
  assert.match(game, /window\.advanceTime = function\(ms\)/);
});
