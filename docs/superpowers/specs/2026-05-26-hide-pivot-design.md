# Hide — Object Disguise Prototype: Pivot Design

**Date:** 2026-05-26
**Status:** Approved

---

## Concept

"Hide" is a top-down object-disguise game set in a fictional event venue. The player is a member of one rival team trying to avoid detection by the opposing team's hunters by transforming into backstage props and looking natural.

The central question every round: _Can I get into position and look like I belong before they inspect the room?_

The prior stealth-maze direction is discarded. This is not a maze game. It is a disguise-and-survive game.

---

## Round Flow

```
Start Screen → Team Select → Character Select →
Room Intro (1s) → Setup Phase (10s) → Hunt Phase (45s) →
Win ("SURVIVED") or Loss ("FOUND") → Restart
```

**Setup phase**: Player and CPU allies spawn. Enemies are not yet present. Player moves freely, selects an object, and transforms into position. Timer counts down visibly.

**Hunt phase**: Hunters enter and search. Player must remain still and look believable. Suspicion builds if the player is moving, badly placed, or actively inspected. Win by reaching 0 on the hunt timer. Lose if suspicion hits 100.

---

## Teams and Characters

No real names, no real brand references.

- **Team A**: A1, A2, A3, A4
- **Team B**: B1, B2, B3, B4

Each character has a `speedMult` and a `hideMult` (affects how quickly suspicion rises when inspected). Team A renders in one accent color; Team B in another.

The opposing team always acts as hunters. If the player picks Team A, hunters are Team B, and vice versa.

---

## Rooms

Six rooms. One is selected randomly each round.

| ID | Label | Notes |
|----|-------|-------|
| `ring_area` | Ring Area | Wrestling ring in center; ringside chairs along apron |
| `backstage_hallway` | Backstage Hallway | Long horizontal corridor; road cases and crates along walls |
| `locker_room` | Locker Room | Benches and lockers along walls; trash cans in corners |
| `merch_area` | Merch Table Area | Tables with merch boxes; chairs behind tables |
| `storage_room` | Storage Room | Dense objects; almost everything natural near walls |
| `entrance_curtain` | Entrance Curtain | Curtain bundles, road cases; sparse floor space |

Each room definition includes:
- `label`: display name
- `bgTileset`: path to tileset image (fallback: solid fill color)
- `staticProps`: array of decorative objects placed at fixed positions (not hitable spots — visual only)
- `hidingZones`: array of named rectangles defining the playfield
- `patrolPath`: ordered waypoints for hunter patrol
- `spawnPoints`: positions for player/allies to start

---

## Objects (Disguise List)

Eight disguisable objects. Player cycles through all eight regardless of room, but believability varies.

| # | Name | Size | Believable In | Bad In |
|---|------|------|---------------|--------|
| 1 | Folding Chair | small | ring area (ringside), locker room (wall), storage | ring center, hallway path |
| 2 | Road Case | medium | backstage, entrance, storage | ring, locker room center |
| 3 | Crate | medium | storage, backstage, locker near wall | ring center, merch floor |
| 4 | Trash Can | small | locker room (corner), backstage (wall) | ring center, entrance path |
| 5 | Merch Box | medium | merch area (behind table), storage | ring, hallway path |
| 6 | Microphone Stand | tall-narrow | ring area (entrance side), entrance curtain | locker room, storage |
| 7 | Ladder | tall-wide | ring area (ringside), storage | locker room, merch line |
| 8 | Curtain Bundle | large | entrance curtain, backstage near wall | ring center, locker room center |

Each `ObjectDefinition`:
```js
{
  id: 'folding_chair',
  label: 'Folding Chair',
  w: 14, h: 14,          // px at logical resolution
  sprite: 'obj-chair-stack.png',  // in Assets/sprites/objects/; shapes fallback if missing
  believableRooms: ['ring_area', 'locker_room', 'storage_room'],
  believableZoneNames: ['ringside', 'locker_wall', 'storage_wall'],
  suspicionMultiplier: 1.0   // base; bad zones apply 2.0×, good zones 0.3×
}
```

---

## Believability Zones

Each room defines zones. When a transformed player is in a matching zone for their chosen object, the suspicion multiplier from passive presence and inspection is reduced. When in a non-matching zone, it is increased.

**Zone matching logic:**
1. Is the player's current object in `believableZoneNames` for the active room? → base multiplier
2. Is the player inside a zone listed in the object's `believableZoneNames`? → 0.3× multiplier
3. Is the player in a zone not listed, or in center open space? → 2.0× multiplier

The player sees no explicit "this spot is good/bad" indicator during the hunt phase — feedback comes from the suspicion meter rising or staying stable.

---

## Suspicion System

Range: 0–100. Starts at 0 each round.

**Increases when:**
- Player moves while transformed and is within a hunter's sight cone (+5/s base, ×object multiplier)
- Hunter is in INSPECTING state targeting the player's object (+3/s × zone multiplier)
- Hunter enters ACCUSING state (rapid fill to 100 over 1.5s)
- Player untransforms and retransforms during hunt phase (+10 flat each time)

**Decreases when:**
- Player is still and not being inspected (−1/s)
- Hunter moves more than 5 tiles away from player (−2/s bonus)

**At 100:** Game over — "YOU WERE FOUND"

**At hunt timer 0:** Win — "YOU STAYED HIDDEN"

---

## Hunter AI

One hunter per round in the prototype. Hunter belongs to the opposing team.

**States:**

| State | Behavior |
|-------|----------|
| ENTERING | Moves from entry point to first patrol waypoint |
| PATROLLING | Follows waypoints in order; after each, small chance to pick an object to inspect |
| NOTICING | Pauses 0.5s, turns toward a chosen object, emits "?" indicator |
| INSPECTING | Moves toward the chosen object; pauses 1.5s at it; evaluates suspicion |
| ACCUSING | Target identified as the player; runs rapidsuspicion fill; triggers game over |
| RETURNING | Returns to patrol after inspecting (if player not found) |

**Inspection evaluation:**
The hunter does not know it has found the player during the INSPECTING approach — it just walks to the object and evaluates. Suspicion increases only during the evaluation pause (1.5s), not during the walk.

When INSPECTING completes:
- If target is the player: apply zone multiplier to suspicion increase. If suspicion ≥ 100 after application → ACCUSING.
- If target is an ally: check `allyBadHide`. If true, ally is "found" (ally.alive = false, counter decrements). Hunter returns to patrol.
- If target is a static prop: hunter glances, pauses briefly, returns.

**Sight cone:** 90° arc, 5-tile range, used only for movement-while-transformed suspicion ticks.

**Hunter object selection:** Weighted random — objects in the player's vicinity (within 4 tiles) are 3× more likely to be chosen for inspection. Objects transformed by allies are also candidates.

---

## CPU Allies

Two allies per round (same team as player).

**Behavior:**
1. On round start, each ally picks a random believable zone for their team accent and a random believable object for that zone.
2. During setup phase, ally moves to that zone and transforms.
3. During hunt phase, ally stays still.
4. Has a hidden `allyBadHide` flag (25% chance true) — if the hunter inspects them with `allyBadHide=true`, ally is found after 1.5s inspection.

Allies do not need pathfinding. They move toward their target with simple steering (no collision avoidance) during setup; during hunt they are static.

Score bonus: +10 per surviving ally at round end.

---

## Scoring

Tracked and displayed on the win screen.

| Event | Points |
|-------|--------|
| Base survival | 100 |
| Per second survived | +2 |
| Surviving ally (each) | +10 |
| Never moved while transformed (during hunt) | +25 |
| Never retransformed during hunt | +15 |
| Believable zone placement | +20 |

No score on loss.

---

## Mini-map

Small overlay (bottom-right corner, ~48×48px logical).

Shows:
- Room boundary
- Hunter position as a colored dot (opposing team color)
- Ally positions as dots (player team color, dimmed)
- Player position as a dot **during setup only** — hidden once hunt phase begins
- No tile detail — just dots on a dark rectangle

---

## Controls

| Key | Action |
|-----|--------|
| WASD / Arrow keys | Move |
| Space | Transform / Untransform |
| Q / E | Cycle object (prev/next) |
| 1–8 | Select object directly |
| R | Restart after win/loss |
| M | Mute/unmute music |

---

## UI Layout

All drawn on canvas (no DOM elements during gameplay).

- **Top bar**: Phase label ("SETUP" or "HUNT"), timer, suspicion meter (red fill bar labeled "SUSPICION"), current object name
- **Bottom-right**: Mini-map
- **Center**: Room + entities
- **On transform**: Brief flash of the object's name for 0.5s

---

## File Architecture

| File | Responsibility |
|------|----------------|
| `index.html` | Canvas, embedded JSON (teams, rooms, objects), script loading |
| `style.css` | Canvas centering, body background |
| `constants.js` | SCREEN_*, PHASE_*, timers, speeds, suspicion rates, tile size |
| `objects.js` | `OBJECTS` array — 8 object definitions |
| `rooms.js` | `ROOMS` map — 6 room definitions with zones, patrol paths, spawn points |
| `entities.js` | `Player`, `Hunter`, `Ally` constructors |
| `suspicion.js` | `SuspicionSystem` — per-tick update given game state |
| `ai.js` | Hunter state machine update function |
| `renderer.js` | Full canvas render — room, entities, UI, mini-map |
| `audio.js` | API unchanged (`playMusic`, `initAudio`, `toggleMute`); game.js calls `playMusic('menu')` on title/select, `playMusic('gameplay')` on setup+hunt start, `playMusic('win')`/`playMusic('gameover')` on end screens |
| `game.js` | `GameState`, main loop, input, phase transitions, scoring |
| `README.md` | Rewritten — disguise game concept, controls, rules, future ideas |

Files removed: `world.js` (replaced by `rooms.js`), `assets.js` (asset loading inlined into renderer).

---

## Canvas Size

Logical canvas: **256×256 px**. Rendered at 3× scale via CSS: **768×768 px**. All pixel values in this spec are logical (256-space). This matches the existing hidegame setup.

---

## Visual Style

- Hybrid: load tileset images from `Assets/bg_tiles/hide/` and object sprites from `Assets/sprites/objects/` where available; fall back to colored rectangles for anything missing
- Player character: team-colored filled rectangle + small letter label (e.g. "A1") until wrestler sprites are wired
- When transformed: render object sprite centered on player position
- Hunters: opposing team color, slightly larger, "H" label
- Allies: player team color, lower opacity
- Suspicion meter: red gradient fill bar at top of screen
- Phase label: large text, blinks on phase change

---

## What Is NOT in This Prototype

- 4×4 room grid navigation (future expansion)
- Multiple hunters (future expansion)
- Sprite animation (future expansion)
- Sound effects (future expansion)
- Room-specific hazards (future expansion)
- Unlockable characters or objects (future expansion)
- Online or networked play (never)

---

## How to Run Locally

```bash
cd hidegame
python3 -m http.server 8181
# open http://localhost:8181
```

No build step. No npm. Static files only.

---

## How to Deploy

Push to the `master` branch of the GitHub repo. GitHub Pages serves from the repo root.
