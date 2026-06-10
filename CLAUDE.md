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

**Raycaster** (`raycaster.js`): DDA engine renders into a fixed 320×200 offscreen canvas, then blits with `ctx.drawImage()`. `putImageData` ignores DPR transforms — do not call it on the main `ctx` directly.

**GM AI** (`ai.js`): State machine — `patrol → chase → search → to_stairs`. Extra states: `ambush` (lurks at an uncollected item), `camp` (waits at the stairwell after a floor change), `hunt` (stress ≥65: BFS toward player without LOS). Chase triggers only when the player looks directly at the GM (dot product > 0.78) AND line-of-sight is clear — proximity alone does not trigger.

**Stress system** (`constants.js` + `game.js`): `gs.stress` 0–100. Rises near the GM, fast during chase, bumps from scare events. Affects: vignette (≥18), shake (≥45), heartbeat audio (≥55), GM hunt mode (≥65). Carried across building exits capped at 30.

**Overworld** (`overworld.js`): Separate map/stalker — GM appears at distance, vanishes on approach or stare. Cannot catch the player outdoors. Building doors locked until prior round completed (localStorage).

**Escalation** (`ai.js` + `constants.js`): As `totalCollected() / totalPrograms()` rises, GM speed scales toward `GM_ESCALATE_SPEED` (×1.55) and floor-change cadence toward `GM_ESCALATE_CADENCE` (×0.45 of the base timer).

**Textures / decals**: Flat-colour fallback if PNG assets absent. `textures.js` loads PNGs into `WALL_TEXTURES`, `FLOOR_TEXTURES`, `CEIL_TEXTURES`, `SPRITE_TEXTURES`. `decals.js` alpha-composites posters/signs onto wall faces (hand-placed overworld billboards + deterministic hash-based auto-scatter in buildings).

**Rendering pipeline per frame** (`game.js` loop):
1. `castAndDraw` — walls, floor, ceiling with light grading + fake building storeys (overworld)
2. `drawSprites` — collectibles, GM, fake-GM scare glimpse (z-sorted, zBuffer-clipped)
3. `drawStairIndicators`, `drawVignette`, `drawPickupFlash`, `drawLuckyFlash`
4. `drawHUD`, `drawMinimap`

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
| `STRESS_HUNT_THRESHOLD` | Stress level that triggers hunt mode |
| `GM_AMBUSH_PROB` / `GM_STAIR_CAMP_PROB` | Ambush/camp chance on arrival |

## Asset generation

Image prompts live in `prompts/`. Textures are 64×64 px pixel art PNG (hard-edged, banded shading, no anti-aliasing). GM sprites are 64×128 px portrait with transparency. After generating, resize with `sips` if needed and drop into `assets/`. PNG slots are wired in `textures.js` — add new paths there to activate them.
