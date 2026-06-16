# GAMES MASTER

A first-person retro-horror hide-and-seek game for LoCo Pro Wrestling, rendered
at 320×200 with a hand-written raycasting engine (3× CSS upscale). A raycasted
overworld — Longmont, CO at night — connects three buildings. Inside each, find
every collectible across the floors and reach the exit while avoiding **The
Games Master**. Look him in the eye and he gives chase.

Vanilla JavaScript, no build step, no dependencies.

## Running

Serve the folder over HTTP (a local server is required — `fetch` and the audio
APIs are blocked on `file://`):

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## The rounds

Rounds unlock in order; completion is tracked in `localStorage`.

| Round | Building | Floors | Collectibles |
| ----- | -------- | ------ | ------------ |
| R1 | The Opera House | 4 | 28 opera programmes (7/floor) |
| R2 | The Sugar Works | 8 | 40 punch cards (5/floor) |
| R3 | Hotel Imperial | 10 | 40 room keys (4/floor) |

Win a round by collecting everything and reaching that floor's exit.

## How to play

- **Title → Enter** drops you into the overworld. Walk to a building's door and
  press **Space** to enter.
- Move with the arrow keys / WASD; **hold Tab** to flash the map overlay (3 uses
  per run).
- The Games Master patrols, ambushes, and — when your stress climbs high enough
  — actively hunts. Breaking line of sight buys you time. Caught? You respawn in
  the overworld outside the building you left.

## Project layout

All scripts are plain globals, loaded in dependency order by `index.html`:

```text
constants.js → map.js → map_r3.js → overworld.js → entities.js →
textures.js → decals.js → raycaster.js → sprites.js → ai.js →
audio.js → renderer.js → game.js
```

- `raycaster.js` / `renderer.js` — DDA raycasting and the per-frame draw pipeline
- `ai.js` — the Games Master state machine (patrol, chase, search, ambush, hunt…)
- `map.js` / `map_r3.js` / `overworld.js` — level geometry (2D integer grids)
- `textures.js` / `decals.js` / `sprites.js` — art loading and compositing
- `constants.js` — all difficulty and tuning knobs
- `assets/` — generated pixel-art PNGs (procedural fallbacks if absent)
- `manual.html` — in-game manual

`CLAUDE.md` documents the architecture, AI states, stress system, map-editing
rules, and tuning constants in depth. Asset-generation prompts live in
`prompts/`; the production lifecycle is described in `docs/`.
