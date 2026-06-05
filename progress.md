# GAMES MASTER — Progress Notes

## What this is

First-person horror exploration game. Player trapped in an abandoned Opera House.
Collect 7 programs on each of 4 floors (28 total). Avoid The Games Master. Escape through
the front doors on the ground floor.

---

## Architecture

**Files:**

- `constants.js` — all magic numbers
- `map.js` — 4 floor definitions (30×20 each), program positions, GM patrol routes, exits
- `entities.js` — player + GM constructors, movement, collision
- `raycaster.js` — DDA raycasting engine, offscreen canvas blit for DPR support
- `sprites.js` — billboard sprites for programs (gold) and GM (dark figure, red eyes)
- `ai.js` — GM state machine: BFS patrol + vision-triggered chase + stair navigation
- `audio.js` — BGM intro/loop system
- `renderer.js` — title, HUD, win/gameover screens, vignette, full-map overlay
- `game.js` — main loop, input, floor switching, win/lose conditions
- `index.html` / `style.css` — shell, 320×200 canvas at 3× CSS scale

**Canvas:** 320×200 native, 3× CSS scale (960×600 display). DPR-aware via `setTransform`.

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

## Known issues / future work

- Textures not yet integrated into the raycaster — walls, floors, ceilings still flat colour. Raycaster needs texture-sampling pass once assets are generated.
- GM sprites not yet integrated — GM is still rendered procedurally. Generated GM images need to be copied into the repo, normalized to the prompt spec if needed, loaded, and wired into `_drawGMColumn` in `sprites.js`.
- Program sprite generated and saved at `assets/items/program.png`, but not yet integrated — program collectibles are still rendered procedurally. Wire the image into `_drawProgramColumn` / sprite rendering.
- Exit (front doors, floor 0) has no visible sprite — currently proximity-only trigger.
- GM has no "searching" state — after losing the player it returns immediately to patrol rather than investigating the last known position.
- No ambient sound (creaking floors, distant music, dripping). Would significantly heighten dread.
