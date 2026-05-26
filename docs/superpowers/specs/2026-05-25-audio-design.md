# Design: Audio Wiring

**Date:** 2026-05-25
**Status:** Approved

## What we're building

Wire up the existing MP3 assets in `Assets/audio/` to the hidegame screen state machine. No new audio files needed. Temporary solution — new audio will be built later; this makes the game non-silent in the meantime.

## New file

**`audio.js`** — loaded before `game.js` in `index.html`. Manages a single HTML5 `Audio` object for BGM with intro→loop handoff and mute toggle.

### Public API (globals)

```js
initAudio()        // unlock autoplay — call once on first user gesture
playMusic(key)     // key: 'menu' | 'gameplay' | 'win' | 'gameover'
stopMusic()        // pause and reset
toggleMute()       // flip muted state
isMuted()          // returns bool
```

### Internal behaviour

- One `var _bgm = new Audio()` for all BGM.
- `playMusic(key)` looks up the track config, pauses current audio, sets `src` to the intro file, and calls `.play()` (catching autoplay rejections silently).
- Intro→loop handoff: `_bgm.onended` swaps `src` to the loop file and sets `loop = true`. Cleared when no loop file exists.
- `toggleMute()` flips `_bgm.muted` and a module-level `_muted` var (so new `Audio` objects inherit state).
- `stopMusic()` calls `_bgm.pause()` and resets `_bgm.currentTime`.

## Track mapping

| Key | Intro | Loop body |
|-----|-------|-----------|
| `menu` | `BG-00-MENU-Pause Menu Drift.mp3` | `BG-00-MENU-Pause Menu Drift-2.mp3` |
| `gameplay` | `BG-05-Opera House Level 5-L21-25.mp3` | `BG-05-Opera House Level 5-L21-25-2.mp3` |
| `win` | `BG-00-FANFARE-Winner.mp3` (one-shot) | → then `BG-00-FINAL-Final Menu.mp3` (loop, no intro) |
| `gameover` | — | `BG-00-FINAL-Final Menu.mp3` (loop, no intro) |

FANFARE and FINAL have no `-2` variants; they use the single file as both intro and loop. WIN is the only two-stage handoff: fanfare plays once, then hands off to FINAL looping.

All asset paths are relative: `Assets/audio/<filename>`.

## Integration — game.js call sites

| Event | Call |
|-------|------|
| First keypress on TITLE screen | `initAudio(); playMusic('menu');` |
| `startGame()` (SELECT → GAMEPLAY) | `playMusic('gameplay');` |
| Win condition reached | `playMusic('win');` |
| Game-over condition reached | `playMusic('gameover');` |
| `M` key (any screen) | `toggleMute();` |

## index.html change

Add one `<script>` tag for `audio.js` before the `game.js` tag:
```html
<script src="audio.js"></script>
```

## Out of scope

- SFX (footsteps, hide, caught) — no SFX assets exist yet
- Volume control beyond mute toggle
- Crossfading between tracks
- localStorage persistence of mute state (save system not yet built)
