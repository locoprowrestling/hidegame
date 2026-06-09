# GAMES MASTER — Progress Notes

## What this is

First-person horror game set in a night-time town vaguely based on Longmont, Colorado.
A first-person overworld (Main Street at night) connects three buildings — three stages,
unlocked in order:

| Stage | Building            | Floors | Collectibles (per floor × floors)  | Exit                |
|-------|---------------------|--------|------------------------------------|---------------------|
| I     | The Opera House     | 4      | 28 programs (7 × 4)                | Front doors, F0     |
| II    | The Sugar Mill      | 8      | 40 punch cards (5 × 8)             | Roof hatch, F7      |
| III   | Hotel Imperial      | 10     | 40 room keys (4 × 10)              | Master Suite, F9    |

Avoid The Games Master. He also stalks the overworld — appearing at a distance,
vanishing when approached or stared at. Out there he can't catch you. Inside, he can.

---

## Architecture

**Files:**

- `constants.js` — all magic numbers (incl. stress system + GM escalation tuning)
- `map.js` — R1 (4 floors) + R2 (8 floors) maps, `parseMapStrings` helper, ROUNDS table,
  active-floor state. `MAP_W`/`MAP_H` are dynamic — set by `switchToFloor` (overworld is 38×28)
- `map_r3.js` — R3 Hotel Imperial: 10 floors as string maps, pushes `ROUNDS[2]`
- `overworld.js` — Longmont night map, building doors + lock logic, stalker GM,
  door beacons, overworld HUD
- `entities.js` — player + GM constructors, movement, collision
- `raycaster.js` — DDA raycasting engine; overworld mode = night sky/ground flat colors,
  longer fog (17 tiles) and ray depth (52)
- `sprites.js` — billboard sprites: collectibles, GM, fake-GM scare glimpse
- `ai.js` — GM state machine: patrol/chase/to_stairs/search + ambush/camp/hunt, escalation
- `audio.js` — BGM intro/loop system + WebAudio heartbeat (rate scales with stress)
- `renderer.js` — title, HUD (incl. stress bar), win/gameover screens, stress FX, whispers
- `game.js` — main loop, input, overworld↔building flow, stress + scare events
- `index.html` / `style.css` — shell, 320×200 canvas at 3× CSS scale

**Canvas:** 320×200 native, 3× CSS scale (960×600 display). DPR-aware via `setTransform`.

---

## Overworld (2026-06-09 overhaul)

- 38×28 outdoor map: Main Street runs north–south, a cross avenue east–west.
  Opera House (NW, facade type 17) faces Hotel Imperial (NE, 19) across Main.
  Sugar Mill (SE, 18) sits in a fenced yard with a west gate. Brick storefronts (reuses
  type 4) fill the SW blocks; tree/hedge border (20).
- Doors in `OW_DOORS` — stand close, press Space. Linear unlock via localStorage
  completion keys: Opera House always open → Sugar Mill after R1 → Hotel after R2.
  Locked doors show a red message ("CHAINED…", "BOARDED UP…").
- Win/Game Over → R returns to town, reappearing outside the building you left
  (`OW_RETURN`). Title ENTER → south Main Street spawn.
- Stalker GM: spawns at a distant street spot every 9–19 s, stands and watches
  (rendered through normal sprite path, `floor: -1` = hidden). Vanishes when within
  5.5 tiles, stared at >1.3 s, or after 9 s — with a darkness flicker, a whisper,
  and a stress bump. He cannot catch you in town.

## Stress system

- `gs.stress` 0–100. Rises near the GM (≤7 tiles, distance-scaled), fast while chased,
  bumps from scare events and stalker sightings. Decays slowly otherwise. Starts at 18
  on entering a building; capped at 30 carrying back into town.
- Effects: edge vignette + pulse (≥18), screen shake (≥45), WebAudio heartbeat that
  quickens (≥55), and at ≥65 the GM **hunts** — pathfinds toward you with no
  line-of-sight needed ("HE FEELS YOUR FEAR" flashes on the HUD).
- Scare events every 22–46 s in buildings: lights die (negative flicker), whispers
  (italic text mid-screen), or a fake GM silhouette 6–11 tiles ahead for ~0.5 s.

## GM escalation + new AI states

- Escalation ramps with collection %: speed ×1 → ×1.55, floor-change cadence ×1 → ×0.45.
- `ambush` — 40% chance on patrol-waypoint arrival to walk to an uncollected item on his
  floor and lurk 9 s.
- `camp` — 30% chance after a floor change to wait 6 s at the stairwell he arrived at.
- `hunt` — stress ≥65 (hysteresis exits at 50): BFS toward player, repath every 2.6 s.
- Look-trigger chase rule unchanged (the "don't look" mechanic) and applies from all states.

---

## Map — 4-floor Opera House

Each floor is a 30×20 tile grid. Wall types: 1=stone/granite, 2=plaster, 3=curtain, 4=brick, 5=wood.

| Floor | Name           | Character                                     |
|-------|----------------|-----------------------------------------------|
| 0     | Grand Foyer    | Entrance level, stone, wide open              |
| 1     | The Auditorium | Performance hall, plaster + crimson curtains  |
| 2     | Upper Gallery  | Balcony level, wood panelling, narrow         |
| 3     | The Flies      | Industrial rigging loft above stage, brick    |

Stairs at east col 27 / west col 2, row 10 on every floor. Press Space to use.
Player starts on Floor 0. GM starts on Floor 0. Win = all 28 collected + reach front doors.

---

## Controls

| Key | Action |
| --- | --- |
| W / S | Move forward / back |
| A / D | Strafe left / right |
| Shift + A / D | Rotate left / right |
| Q / E | Rotate left / right |
| Arrow Up / Down | Move forward / back |
| Arrow Left / Right | Strafe left / right |
| Shift + Arrow Left / Right | Rotate |
| Mouse | Rotate (pointer lock on click) |
| Space / F | Collect program or use stairs |
| Tab (hold) | Show map overlay |
| M | Mute |

---

## Games Master AI

State machine in `ai.js`:

- **patrol** — BFS pathfinding between waypoints on current floor. Recomputes path on each waypoint arrival. Resolves around all wall barriers correctly.
- **chase** — direct pursuit. Triggered only when player looks at GM (dot-product camera direction vs. GM position > 0.78) AND line of sight is clear. No proximity-only trigger.
- **to_stairs** — BFS path to exit tile, then floor transition. No teleporting.

**Floor changes:** GM changes floors every ~55s (±15s random). Walks to the staircase first, appears at that same position on the target floor. 60% bias toward player's floor.

**Detection rule:** "Don't look" — the GM only starts chasing when the player looks directly at him. Looking away breaks detection. Chase ends after 4s without line of sight.

**Rendering:** GM only rendered and dangerous when on the same floor as the player.

---

## Bugs fixed

### DPR + putImageData incompatibility

**Problem:** `putImageData` ignores canvas transforms. On a 2× retina display the raycasted scene only filled the top-left quarter of the canvas.

**Fix:** Raycaster renders into a fixed 320×200 offscreen canvas, then blits with `ctx.drawImage()` which respects the DPR transform.

**Lesson:** `putImageData` bypasses the context transform matrix entirely. Always use offscreen canvas + `drawImage` as the final blit when the main canvas is DPR-scaled.

---

### Collision detection blocking doorway traversal

**Problem:** Collision checked both leading AND trailing edge simultaneously. The trailing edge hit the wall behind a doorway, blocking entry even when the path ahead was clear. Produced an "invisible barrier".

**Fix:** Check only the leading edge in the axis of movement, sampled at ±80% of player radius on the perpendicular axis. Also widened map doorways to match room width.

**Lesson:** Only the leading edge should block. Doorway width in the map must be at least as wide as the room it serves.

---

### GM frozen / camping in corner

**Problem:** Simple "move toward + wall slide" AI couldn't navigate around horizontal wall barriers. When a waypoint required crossing a barrier, the GM slid into the corner and stopped.

**Fix:** Replaced direct movement with BFS pathfinding (`_bfsPath` in `ai.js`). Path computed on waypoint arrival, stored on GM object, followed step by step. 0.12ms per call on the 30×20 grid — negligible cost. GM resets path on floor change and on state transitions.

**Lesson:** "Move toward + wall slide" works in open spaces but fails whenever the optimal path requires moving perpendicular to the target first. Any map with internal walls needs grid pathfinding for AI.

---

### GM warping between floors

**Problem:** Floor changes teleported GM instantly to `gmStart` on the new floor, producing a visible warp.

**Fix:** Added `to_stairs` state. GM walks (via BFS) to the staircase exit tile on its current floor, then transitions — placed at that same tile position on the new floor. No teleport.

**Lesson:** Floor transitions must move the entity to a shared physical reference point (the staircase) so the appearance-on-new-floor is spatially coherent.

---

### GM collision using wrong floor's map

**Problem:** `_gmMoveToward` called `isWall()` which used `ACTIVE_FLOOR_IDX` (the player's floor). When GM was on a different floor, his collision ran against the wrong map.

**Fix:** Added `isWallOnFloor(col, row, floorIdx)` to `map.js`. All GM movement uses this with `gm.floor`.

**Lesson:** When entities can be on different floors simultaneously, wall-check functions must be parameterised by floor index, not read from a global active-floor variable.

---

## Asset prompts

All Codex image generation prompts live in `prompts/`. Three subfolders:

**Workflow note:** When asking Codex to "generate images", use `imagegen` directly.
Do not replace that request with a local procedural generator unless explicitly asked.

### `prompts/textures/` — wall/floor/ceiling tiles

| File | Contents |
| --- | --- |
| `style-guide.md` | Format spec, pixel art rules, palette, material reference |
| `walls.md` | 5 wall types: granite, plaster, curtain, brick, wood |
| `floors.md` | 4 floor surfaces: marble, carpet, floorboards, steel grating |
| `ceilings.md` | 4 ceiling surfaces: coffered plaster, painted vault, joists, ironwork |

**Spec:** 64×64 px, square (1:1), PNG 8-bit RGB, no alpha. Pixel art — hard-edged aliased
pixels, banded shading, no anti-aliasing, no gradients. 12–20 colours per tile.

**Known generation issues:**

- Generators defaulted to rectangular output — size constraint now repeated at file header AND on each individual tile entry.
- Generators produced painted realism — IP-name style references removed; replaced with explicit pixel-level descriptions (flat colour steps, 1 px hard edges, banded shading).

### `prompts/GM/` — Games Master billboard sprites

| File | Pose |
| --- | --- |
| `style-guide.md` | Character design, 16-colour palette, canvas rationale |
| `idle.md` | Standing, cane planted — default state |
| `walk-a.md` | Left foot forward, mid-stride |
| `walk-b.md` | Right foot forward — loops with walk-a |
| `lunge.md` | Arms spread, leaning in — catch / near-player |
| `back.md` | Rear view, walking away |

**Spec:** 64×128 px portrait (1:2), transparent PNG. Pixel art, 16 colours max.
Matches raycaster billboard ratio: `spriteW = spriteH * 0.45`.
Character ref: red lucha skull-demon mask, black suit, red skeletal gloves, skull-topped cane.

### `prompts/items/` — collectible item sprites

| File | Item |
| --- | --- |
| `style-guide.md` | Renderer context, pixel art rules, floor-offset billboard spec |
| `program.md` | Victorian opera programme booklet (28 collectibles, one sprite) |

**Spec:** 64×64 px square (1:1), transparent PNG. Pixel art, 12 colours max.
Rendered floor-level with `vOffset = +0.3 × spriteH`. Runtime applies a pulse glow effect
on top — sprite should be generated at mid-brightness.

---

## Generated image assets

### 2026-06-04 imagegen run

Generated all five GM prompt images from `prompts/GM/` with `imagegen`:

- `idle.md`
- `walk-a.md`
- `walk-b.md`
- `back.md`
- `lunge.md`

These GM generations were created in the Codex generated-images folder, but were not copied
into the local repo during that pass.

Generated the item prompt from `prompts/items/program.md` with `imagegen`.

Saved local item outputs:

- `assets/items/program.png` — resized game-ready copy, 64×64 PNG.
- `assets/items/program-full.png` — original full-size `imagegen` output, 1254×1254 PNG.

The original generated image was left untouched in the Codex generated-images folder.
`imagegen` did not return the requested 64×64 size directly, so the repo copy was resized
with `sips`.

---

## Bugs fixed in the 2026-06-09 overhaul

### Round 2 was uncompletable (sealed rooms + items in walls)

A map-verifier script (BFS reachability + walkability of every item/patrol/exit/start
tile) found: Lime House (R2F4) kiln chambers and Sugar Tower (R2F7) office blocks were
fully sealed — 4 of 5 punch cards on F4 unreachable; several other cards/patrol points
sat inside wall tiles on F0/F1/F2/F6/F7. Fixed by adding door gaps (F4 rows 9/11 cols
5/24; F7 row 9 cols 6/24) and moving in-wall items to adjacent open tiles.

**Lesson:** never ship a floor without an automated reachability check. The verifier
pattern lives in this overhaul's history — re-run it after any map edit.

---

## Known issues / future work

- Hotel Imperial (R3) and overworld render with flat-colour walls — no textures
  generated yet (wall types 11–15, 17–20; floor/ceiling texture indices 12–21).
  Prompts not yet written under `prompts/r3/` and `prompts/overworld/`.
- The overworld stalker reuses the GM idle sprite; a dedicated distant-silhouette
  sprite would read better.
- Sealed decorative pockets exist (R1 auditorium boxes, R2 machine-block/vat
  centres) — harmless, no items inside.

- Textures not yet integrated into the raycaster — walls, floors, ceilings still flat colour. Raycaster needs texture-sampling pass once assets are generated.
- GM sprites not yet integrated — GM is still rendered procedurally. Generated GM images need to be copied into the repo, normalized to the prompt spec if needed, loaded, and wired into `_drawGMColumn` in `sprites.js`.
- Program sprite generated and saved at `assets/items/program.png`, but not yet integrated — program collectibles are still rendered procedurally. Wire the image into `_drawProgramColumn` / sprite rendering.
- Exit (front doors, floor 0) has no visible sprite — currently proximity-only trigger.
- GM has no "searching" state — after losing the player it returns immediately to patrol rather than investigating the last known position.
- No ambient sound (creaking floors, distant music, dripping). Would significantly heighten dread.
