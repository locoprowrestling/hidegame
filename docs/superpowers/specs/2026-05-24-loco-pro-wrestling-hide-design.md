# LoCo Pro Wrestling: Hide — Design Spec
**Date:** 2026-05-24
**Status:** Approved

---

## Overview

A single-player, top-down, 8-bit-inspired stealth/hide-and-seek browser game deployable on GitHub Pages. The player picks a wrestler from one of two LoCo Pro Wrestling factions (The Rising or The Pillars), then hides from the opposing faction's hunters on a 16-screen map while CPU allies do the same. Survive 90 seconds to win.

Core loop: **Move. Hide. Watch the mini-map. Survive.**

---

## Architecture

### Approach
Multi-file vanilla JS loaded via `<script>` tags. No build step. Works from `file://` and from a local static server. JSON data embedded in `index.html` via `<script type="application/json">` tags, parsed once at startup.

### File Structure
```
index.html          – canvas, script tags, embedded JSON data blocks
style.css           – full-screen canvas, black background, Press Start 2P font
constants.js        – all magic numbers and configuration
world.js            – Room class, screen grid, tile map, hiding spot placement
entities.js         – Player, Enemy, Ally, HidingSpot classes
ai.js               – enemy patrol/chase state machine, ally hide-seeking logic
renderer.js         – all canvas draw calls (tiles, sprites, vision cones, mini-map, HUD)
game.js             – GameState, main loop (requestAnimationFrame), input, screen transitions
README.md           – project description, controls, deployment, limitations, next steps
```

**Script load order in index.html:**
`constants.js → world.js → entities.js → ai.js → renderer.js → game.js`

### Data Files (embedded JSON)

**`wrestlers-data`** — wrestler names, faction, and stats:
```json
{
  "factions": [
    {
      "name": "The Rising",
      "color": "#E63946",
      "wrestlers": [
        { "name": "Zeak",   "speedMult": 1.2, "hideMult": 0.9 },
        { "name": "Erza",   "speedMult": 0.9, "hideMult": 0.7 },
        { "name": "Johnny", "speedMult": 1.0, "hideMult": 1.0 },
        { "name": "Carter", "speedMult": 0.8, "hideMult": 1.3 }
      ]
    },
    {
      "name": "The Pillars",
      "color": "#457B9D",
      "wrestlers": [
        { "name": "JT",     "speedMult": 1.2, "hideMult": 0.9 },
        { "name": "Cody",   "speedMult": 0.9, "hideMult": 0.7 },
        { "name": "Nicky",  "speedMult": 1.0, "hideMult": 1.0 },
        { "name": "Franky", "speedMult": 0.8, "hideMult": 1.3 }
      ]
    }
  ]
}
```

**`rooms-data`** — 16 room definitions with tile layouts, patrol waypoints, and spawn points:
```json
[
  {
    "id": "locker_room",
    "label": "Locker Room",
    "tiles": "...16x16 string of F/W/O/H chars...",
    "enemyPatrolPoints": [[2,3],[12,3],[12,12],[2,12]],
    "allySpawnPoints": [[7,7],[8,8]]
  }
]
```
Tile chars: `F` = floor, `W` = wall, `O` = obstacle, `H` = hiding spot.

---

## Constants (`constants.js`)

```js
TILE_SIZE = 16          // pixels per tile
SCREEN_TILES = 16       // tiles per screen dimension (256×256 px canvas)
GRID_SIZE = 4           // 4×4 screen grid
PLAYER_BASE_SPEED = 2   // pixels per frame
ENEMY_PATROL_SPEED = 1.2
ENEMY_CHASE_SPEED = 2.8
VISION_CONE_ANGLE = 90  // degrees
VISION_CONE_DEPTH = 5   // tiles
HIDE_DETECT_RADIUS = 1.5 // tiles (base, modified by wrestler hideMult)
ALLY_FLEE_RADIUS = 6    // tiles — enemy within this triggers ally flee
SEARCH_TIMEOUT = 3000   // ms before enemy gives up and returns
ROUND_TIMER = 90        // seconds
ENEMY_COUNT = 4         // tunable
ALLY_COUNT = 3          // tunable
SCORE_PER_SECOND = 10
SCORE_PER_ALLY = 500
SCORE_FULL_SURVIVAL = 1000
```

---

## World & Screens

### Grid Layout
A fixed 4×4 grid of 16 screens. Each screen is 256×256 px (16×16 tiles at 16 px/tile). The canvas renders one screen at a time. Screen coordinates are `(col, row)` from `(0,0)` top-left to `(3,3)` bottom-right.

### Risk Gradient
- **Center screens (1,1), (1,2), (2,1), (2,2):** Open/dangerous — ringside and entrance areas
- **Edge screens:** Hiding-rich — locker rooms, storage, hallways

### Room Types
| Type | Character | Hiding Density |
|------|-----------|---------------|
| `entrance` | Open corridor, minimal cover | Low |
| `ringside` | Wide open, merch tables at walls | Very low |
| `locker_room` | Dense lockers, tight passages | High |
| `backstage` | Crates and curtains, medium density | Medium |
| `hallway` | Long and narrow, easy to get cornered | Low |
| `storage` | Packed obstacles, maze-like | Very high |

### Screen Transitions
Instant cut. Player appears at the opposite edge of the new screen. Chasing enemies that were on the same screen follow. All other enemies stay on their home screen.

### Off-screen Simulation
All enemies are updated every frame regardless of which screen is currently visible. This keeps mini-map positions accurate and ensures enemies on other screens are patrolling normally when the player arrives. Allies on non-visible screens are also updated so their hiding state is consistent.

---

## Entities

### Player
- Pixel position (x, y) within current screen; `currentScreen` (col, row)
- `isHidden: bool`, `hidingSpot: HidingSpot | null`
- Stats: `speed = PLAYER_BASE_SPEED * wrestler.speedMult`, `hideDetectRadius = HIDE_DETECT_RADIUS * wrestler.hideMult`
- Controls: WASD / arrow keys, Space to hide/unhide

### Enemy (Hunter)
- `homeScreen` (col, row), `currentScreen`, pixel position, facing angle
- States: `PATROL | ALERTED | CHASING | SEARCHING | RETURNING`
- Vision cone: 90° arc, 5 tiles deep, drawn as semi-transparent triangle
  - Yellow during `PATROL`
  - Orange during `ALERTED`
  - Red during `CHASING`/`SEARCHING`
- Patrol: walks looped waypoints defined in room JSON
- Chase: follows player across screens; gives up after 3s without line-of-sight
- Hidden player detection: within `player.hideDetectRadius` tiles (already incorporates `HIDE_DETECT_RADIUS × wrestler.hideMult`)

### Ally (CPU)
- Stays on spawn screen, does not cross screens
- States: `WANDERING | FLEEING | HIDING | CAUGHT`
- `WANDERING`: slow random movement
- `FLEEING`: moves toward nearest unoccupied hiding spot (straight-line, axis-split collision)
- `HIDING`: stationary in hiding spot
- `CAUGHT`: removed from map, ally count decremented
- Flee trigger: any enemy within 6 tiles on the same screen

### HidingSpot
- Tile-aligned position, `isOccupied: bool`, `occupant: entity | null`
- Rendered as a distinct tile color; shows a small indicator when occupied by the player

---

## AI

### Enemy State Machine
```
PATROL
  → player enters vision cone AND not hidden → ALERTED (1-frame)
  → ALERTED → CHASING

CHASING
  → touches player → GAME OVER
  → player hidden and outside close-detect radius → SEARCHING
  → player on new screen, no sight for 3s → RETURNING

SEARCHING
  → move to last known position, spin briefly
  → 3s timeout → RETURNING

RETURNING
  → pathfind back to home screen patrol start → PATROL
```

### Ally State Machine
```
WANDERING → enemy within 6 tiles → FLEEING
FLEEING → reached hiding spot → HIDING
HIDING → enemy leaves 6-tile radius → WANDERING
WANDERING | HIDING → enemy touches → CAUGHT
```

### Collision
Tile-based AABB. Movement attempted on X and Y axes separately each frame. `wall` and `obstacle` tiles block movement on the relevant axis.

---

## Hiding Mechanic

- Player presses Space within 1 tile of an unoccupied `HidingSpot`
- Player snaps to spot center, `isHidden = true`, movement locked
- Enemy vision cone is ignored while hidden
- Enemy can still detect if within `HIDE_DETECT_RADIUS * wrestler.hideMult` tiles
- Space again → `isHidden = false`, movement restored, spot freed

---

## UI

### Mini-map (upper-left, always visible)
- 64×64 px; each screen = 16×16 px cell
- Current screen: bright white border
- Player dot: faction color
- Ally dots: lighter faction color
- Enemy dots: red (always visible — player has full information)

### HUD
- Top of canvas: timer (large, turns red under 20s), ally count
- Bottom of canvas: current room name

### Screen Flow
```
TITLE → CHARACTER_SELECT → GAMEPLAY → WIN | GAME_OVER
```

- **TITLE:** Game name, "Press Enter", faction color accents
- **CHARACTER_SELECT:** Left/Right to toggle faction, Up/Down to pick wrestler, Enter to confirm. Shows speed and hide stats as pixel bars.
- **GAMEPLAY:** Main loop
- **WIN:** Timer hit 0. Shows time survived, allies saved, total score.
- **GAME_OVER:** Red screen flash, shows how long player survived.

### Scoring
```
Survival score   = seconds survived × 10
Ally bonus       = allies remaining × 500
Full clear bonus = +1000 if timer reached 0
```

### Font
Press Start 2P (Google Fonts) — loaded in `style.css`.

---

## Prototype Limitations (known at design time)

- No audio
- No save/high score persistence
- Ally AI uses straight-line movement only (no pathfinding)
- All 16 room tile layouts hand-authored in JSON (no editor)
- No animations — entities are colored rectangles with direction indicators
- Single fixed difficulty (tunable via constants)

---

## Suggested Next Steps (post-prototype)

1. Audio — simple chiptune SFX (footsteps, hide, caught, win)
2. Wrestler ability differentiation beyond speed/hide multipliers
3. Animated sprites replacing colored rectangles
4. Difficulty selector (affects enemy count, speed, vision cone size)
5. High score persistence via localStorage
6. Ally pathfinding using A* or flow fields
7. Additional room types and a map editor
8. Mobile touch controls
