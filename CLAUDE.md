# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the game

No build step. Open `index.html` in a browser — a local dev server is strongly recommended because `fetch` / audio APIs block on `file://`:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

There are no tests, linter, or CI configs.

## What this is

**GAMES MASTER** — first-person retro-horror game (320×200, 3× CSS scale). A raycasted overworld (Longmont, CO at night) connects three buildings, each a multi-floor hide-and-seek with a single enemy, The Games Master. Avoid eye contact.

Three rounds, unlocked in order via `localStorage` completion keys:

| Round | Building | Floors | Collectibles |
|-------|----------|--------|--------------|
| R1 | The Opera House | 4 | 28 opera programmes (7/floor) |
| R2 | The Sugar Works | 8 | 40 punch cards (5/floor) |
| R3 | Hotel Imperial | 10 | 40 room keys (4/floor) — in progress |

Win condition per round: collect everything, reach the exit (floor-specific).

## Architecture

All vanilla JS, no modules, no bundler. Load order matters — `index.html` scripts them in dependency order:

```
constants.js → map.js → map_r3.js → overworld.js → entities.js →
textures.js → decals.js → raycaster.js → sprites.js → ai.js →
audio.js → renderer.js → game.js
```

**Key globals** (treat as singletons):
- `gs` — all live game state (screen, player, gm, stress, floor, round, etc.)
- `FLOORS` / `PROGRAMS` / `FLOOR_COLLECTED` / `EXIT` — rebuilt by `switchToRound()` + `switchToFloor()`. Never reference directly from `map.js` before calling those.
- `MAP_W` / `MAP_H` — dynamic; set by `switchToFloor` (overworld is 38×28, buildings vary).
- `ROUNDS[]` — round definitions live in `map.js`; R3 is pushed by `map_r3.js`.

**Screen flow**: Title → `SCREEN_OVERWORLD` (Enter) → `SCREEN_PLAY` (approach door + Space). Win/gameover → R returns to overworld outside the building you left. `SCREEN_ROUND_SELECT` and `drawRoundSelect` exist in the code but are vestigial — the overworld serves as the round select.

**Raycaster** (`raycaster.js`): DDA engine renders into a fixed 320×200 offscreen canvas, then blits with `ctx.drawImage()`. `putImageData` ignores DPR transforms — do not call it on the main `ctx` directly.

**GM AI** (`ai.js`): State machine with six states. `updateGM(gm, player, playerFloor, dt, stress)` — the `stress` parameter drives hunt mode.

| State | Trigger | Behaviour |
| ----- | ------- | --------- |
| `patrol` | default | BFS between waypoints; on arrival may branch to `ambush` |
| `chase` | player looks at GM + LOS clear | Direct pursuit; exits to `search` after 4 s without LOS |
| `search` | lost chase | BFS to last-known position, then back to `patrol` |
| `to_stairs` | floor-change timer | BFS to stairwell, then teleports to that tile on next floor |
| `ambush` | 40% on waypoint arrival | BFS to an uncollected item; lurks 9 s |
| `camp` | 30% after floor change | Stands at the stairwell 6 s |
| `hunt` | `stress ≥ 65` | BFS toward player with no LOS needed; repath every 2.6 s; exits at stress < 50 |

`_gmTryStartChase` (called from every non-chase state) is the single entry point for the look-trigger: fires only when `_playerLooksAtGM` (dot product > 0.78) AND `_gmHasSight` (ray clear) are both true.

**Stress system** (`constants.js` + `game.js`): `gs.stress` 0–100. Rises near the GM (≤7 tiles, distance-scaled), fast during chase, bumps from scare events and overworld stalker sightings. Decays slowly otherwise. Affects: vignette pulse (≥18), screen shake (≥45), WebAudio heartbeat (≥55), GM hunt mode (≥65). Carried across building exits capped at 30; starts at 18 on entering a building.

**Scare events** (`game.js` `_updateScares`): Fire every 22–46 s in buildings. Three types: darkness flicker, whisper text mid-screen, or fake-GM silhouette 6–11 tiles ahead for ~0.5 s.

**Overworld** (`overworld.js`): Stalker GM (`floor: -1` = hidden, `floor: 0` = visible) spawns at a distance every 9–19 s, vanishes when within 5.5 tiles, stared at >1.3 s, or after 9 s — with flicker, whisper, and stress bump. Cannot catch the player outdoors.

**Escalation** (`ai.js` + `constants.js`): As `totalCollected() / totalPrograms()` rises 0→1, GM speed scales toward `GM_ESCALATE_SPEED` (×1.55) and floor-change interval toward `GM_ESCALATE_CADENCE` (×0.45 of the base timer).

**Textures / decals**: Flat-colour fallback if PNG assets absent. `textures.js` loads PNGs into `WALL_TEXTURES`, `FLOOR_TEXTURES`, `CEIL_TEXTURES`, `SPRITE_TEXTURES`. `decals.js` alpha-composites posters/signs onto wall faces (hand-placed overworld billboards + deterministic hash-based auto-scatter in buildings).

**Rendering pipeline per frame** (`game.js` loop):
1. `castAndDraw` — walls, floor, ceiling with light grading + fake building storeys (overworld)
2. `drawSprites` — collectibles, GM, fake-GM scare glimpse (z-sorted, zBuffer-clipped)
3. In overworld: `drawDoorIndicators`; in building: `drawStairIndicators`
4. `drawVignette`, `drawPickupFlash`, `drawLuckyFlash`
5. `drawHUD`, `drawMinimap`

## Map editing

Maps are 2D integer arrays. `0` = walkable, non-zero = wall (wall-type ID). Overworld lives in `overworld.js`; R1/R2 floors in `map.js`; R3 in `map_r3.js`. `parseMapStrings` in `map.js` accepts the compact string format used by R2/R3.

**After any map edit**, manually verify:
- Every collectible, patrol waypoint, playerStart, gmStart, and exit tile is `0` (walkable).
- All reachable areas are connected (BFS from playerStart should reach all items).
- Stair exits at matching positions on adjacent floors.

Sealed decorative pockets (auditorium boxes, vat centres) are intentional — fine as long as no items/waypoints are inside.

## Tuning constants

All numeric knobs are in `constants.js`. Key ones for difficulty:

| Constant | Effect |
|----------|--------|
| `GM_CHASE_SPEED` / `GM_PATROL_SPEED` | Base speeds before escalation |
| `GM_FLOOR_CHANGE_MS` | How often GM changes floors (lower = more pressure) |
| `GM_FOLLOW_PROB` | Probability GM moves toward player's floor |
| `GM_ESCALATE_SPEED` / `GM_ESCALATE_CADENCE` | End-game speed/cadence multipliers |
| `STRESS_HUNT_THRESHOLD` | Stress level that triggers hunt mode (hysteresis exits at −15) |
| `GM_AMBUSH_PROB` / `GM_STAIR_CAMP_PROB` | Ambush/camp chance on arrival |

**Not in constants**: The lucky-warp probability (catch escape) is hardcoded at 4% in `game.js` inside the `gmCaughtPlayer` check. The map overlay is limited to 3 uses per run (`gs.mapUsesLeft`), held Tab to display.

## Asset generation

Image prompts live in `prompts/`. Textures are 64×64 px pixel art PNG (hard-edged, banded shading, no anti-aliasing). GM sprites are 64×128 px portrait with transparency. After generating, resize with `sips` if needed and drop into `assets/`. PNG slots are wired in `textures.js` — add new paths there to activate them.

Follow `docs/asset-production.md` for the source/archive/runtime lifecycle,
verification commands, status vocabulary, and reusable templates. Record
meaningful generation batches under `docs/asset-runs/` so later work can reuse
successful commands and avoid known failures.

**UI / HUD chrome**: prompts under `prompts/ui/` (see its `style-guide.md` for the shared palette, per-file dimensions, and ImageGen post-processing commands). Finished PNGs go in `assets/ui/`. Every UI sprite — HUD bars, pips, indicator arrows, map parchment, title logo, LUCKY stamp, warning eyes — is an optional override: the renderer keeps its procedural drawing as fallback when the PNG is absent.
