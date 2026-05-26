#!/usr/bin/env node

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url = process.argv[2] || 'http://127.0.0.1:4173';
const outDir = process.argv[3] || path.resolve('.playwright-mcp/hidegame-audio-smoke');
const port = 9224;

if (!fs.existsSync(chromePath)) {
  throw new Error(`Google Chrome not found at ${chromePath}`);
}

fs.mkdirSync(outDir, { recursive: true });
const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hidegame-chrome-'));

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--remote-debugging-address=127.0.0.1',
  `--user-data-dir=${profileDir}`,
  '--autoplay-policy=no-user-gesture-required',
  '--disable-background-networking',
  '--disable-gpu',
  '--no-first-run',
  'about:blank'
], { stdio: ['ignore', 'pipe', 'pipe'] });

const errors = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(endpoint) {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`${endpoint} returned ${response.status}`);
  return response.json();
}

async function waitForDebugEndpoint() {
  const endpoint = `http://127.0.0.1:${port}/json/version`;
  for (let i = 0; i < 150; i++) {
    try {
      await fetchJson(endpoint);
      return;
    } catch {
      await sleep(100);
    }
  }
  throw new Error('Chrome DevTools endpoint did not become ready');
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result || {});
      return;
    }

    if (msg.method === 'Runtime.exceptionThrown') {
      errors.push({ type: 'exception', detail: msg.params.exceptionDetails.text });
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      errors.push({ type: 'log', detail: msg.params.entry.text });
    }
  });

  function send(method, params = {}) {
    const id = nextId++;
    ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
    });
  }

  return new Promise((resolve, reject) => {
    ws.addEventListener('open', () => resolve({ ws, send }));
    ws.addEventListener('error', reject);
  });
}

async function evaluate(send, expression, awaitPromise = false) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text);
  }
  return result.result ? result.result.value : undefined;
}

async function waitForScreen(send, screen) {
  for (let i = 0; i < 80; i++) {
    const current = await evaluate(send, `window.render_game_to_text ? JSON.parse(window.render_game_to_text()).screen : null`);
    if (current === screen) return;
    await evaluate(send, 'window.advanceTime && window.advanceTime(100)', true);
    await sleep(50);
  }
  throw new Error(`Timed out waiting for screen ${screen}`);
}

async function key(send, key, code, windowsVirtualKeyCode) {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode });
  await evaluate(send, 'window.advanceTime && window.advanceTime(100)', true);
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode });
  await evaluate(send, 'window.advanceTime && window.advanceTime(100)', true);
}

async function screenshot(send, name) {
  const result = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  fs.writeFileSync(path.join(outDir, name), Buffer.from(result.data, 'base64'));
}

try {
  await waitForDebugEndpoint();
  const targets = await fetchJson(`http://127.0.0.1:${port}/json`);
  const pageTarget = targets.find((target) => target.type === 'page');
  assert.ok(pageTarget, 'expected a Chrome page target');

  const { ws, send } = await connect(pageTarget.webSocketDebuggerUrl);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');
  await send('Page.navigate', { url });
  await sleep(1000);

  await waitForScreen(send, 'TITLE');
  await screenshot(send, 'title.png');

  await key(send, 'Enter', 'Enter', 13);
  const menuSrc = await evaluate(send, 'window._bgm ? window._bgm.src : ""');
  assert.match(menuSrc, /BG-00-MENU-Pause%20Menu%20Drift\.mp3|BG-00-MENU-Pause Menu Drift\.mp3/);

  await waitForScreen(send, 'CHARACTER_SELECT');
  await key(send, 'Enter', 'Enter', 13);
  await waitForScreen(send, 'GAMEPLAY');

  const gameplaySrc = await evaluate(send, 'window._bgm ? window._bgm.src : ""');
  assert.match(gameplaySrc, /BG-05-Opera%20House%20Level%205-L21-25\.mp3|BG-05-Opera House Level 5-L21-25\.mp3/);

  await key(send, 'm', 'KeyM', 77);
  assert.equal(await evaluate(send, 'window.isMuted()'), true);

  await key(send, 'ArrowRight', 'ArrowRight', 39);
  await key(send, 'ArrowDown', 'ArrowDown', 40);
  await screenshot(send, 'gameplay.png');

  const state = await evaluate(send, 'window.render_game_to_text()');
  fs.writeFileSync(path.join(outDir, 'state-gameplay.json'), state);

  assert.equal(JSON.parse(state).screen, 'GAMEPLAY');
  assert.equal(errors.length, 0, JSON.stringify(errors, null, 2));

  ws.close();
  console.log(`ok - browser smoke test passed; artifacts in ${outDir}`);
} finally {
  chrome.kill('SIGTERM');
  await new Promise((resolve) => {
    var settled = false;
    function done() {
      if (settled) return;
      settled = true;
      resolve();
    }
    chrome.once('exit', done);
    setTimeout(done, 1000);
  });
  fs.rmSync(profileDir, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 100
  });
}
