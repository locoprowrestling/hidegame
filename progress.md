Original prompt: implement audio design in hidegame

## 2026-05-26

- Started audio design implementation for `hidegame` using `docs/superpowers/specs/2026-05-25-audio-design.md`.
- No prior `hidegame/progress.md` existed.
- Added failing Node tests for the audio module API and game/page integration before production changes.
- Implemented `audio.js`, loaded it before `game.js`, wired music to title/gameplay/win/game-over states, added mute toggle on `M`, and exposed web-game verification hooks.
- Added a local Chrome DevTools smoke test for browser verification without installing npm packages.
- Verification passed on 2026-05-26: `node hidegame/tests/audio.test.js`, `node hidegame/tests/audio-integration.test.js`, and `node hidegame/tests/browser-smoke.mjs http://127.0.0.1:4173 /Users/gecko1/locopro/.playwright-mcp/hidegame-audio-smoke`.

## TODOs / suggestions

- Replace temporary BGM tracks when final audio is produced.
- Add SFX wiring after footstep/hide/caught assets exist.
