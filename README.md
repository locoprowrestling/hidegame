# LoCo Pro Wrestling: Hide

A single-player, top-down, 8-bit browser game. Pick a wrestler from The Rising or The Pillars, then hide from the opposing faction's hunters on a 16-screen map while CPU allies do the same. Survive 90 seconds to win.

## Play

Open `index.html` in any modern browser (Chrome, Firefox, Edge). No server required — works from `file://`.

To serve locally (avoids any file:// quirks):
```
npx serve .
```
Then open `http://localhost:3000`.

## Controls

| Key | Action |
|---|---|
| WASD / Arrow keys | Move |
| Space | Hide / Unhide (must be adjacent to a hiding spot) |
| Left / Right Arrow | Change faction (Character Select) |
| Up / Down Arrow | Pick wrestler (Character Select) |
| Enter | Confirm / advance screen |

## Wrestlers

Each wrestler has a speed multiplier and a hide multiplier:
- **Speed** — movement speed relative to base
- **Hide** — detection radius while hiding (lower = harder for enemies to detect you)

| Wrestler | Faction | Speed | Hide |
|---|---|---|---|
| Zeak | The Rising | 1.2× | 0.9× |
| Erza | The Rising | 0.9× | 0.7× |
| Johnny | The Rising | 1.0× | 1.0× |
| Carter | The Rising | 0.8× | 1.3× |
| JT | The Pillars | 1.2× | 0.9× |
| Cody | The Pillars | 0.9× | 0.7× |
| Nicky | The Pillars | 1.0× | 1.0× |
| Franky | The Pillars | 0.8× | 1.3× |

## Scoring

| Event | Points |
|---|---|
| Each second survived | 10 |
| Each ally still alive at end | 500 |
| Full 90-second survival | +1000 bonus |

## Deployment (GitHub Pages)

1. Push repository to GitHub.
2. In the repository Settings → Pages, set source to the `main` branch, root folder.
3. The game is live at `https://<username>.github.io/<repo>/`.

No build step required.

## Known Limitations (Prototype)

- No audio
- No save / high score persistence
- Ally AI uses straight-line movement only (no pathfinding)
- All 16 room layouts are hand-authored; no map editor
- Entities are colored rectangles with direction nubs — no animated sprites
- Single fixed difficulty (tunable by editing `constants.js`)

## Suggested Next Steps

1. **Audio** — chiptune SFX (footsteps, hide, caught, win jingle)
2. **Wrestler abilities** — unique skills beyond speed/hide multipliers
3. **Animated sprites** — replace colored rectangles
4. **Difficulty selector** — affects enemy count, speed, vision cone size
5. **High score persistence** — `localStorage`
6. **Ally pathfinding** — A* or flow fields
7. **More room types and a map editor**
8. **Mobile touch controls**

## File Structure

```
index.html     Canvas, JSON data, script tags
style.css      Full-screen layout, Press Start 2P font
constants.js   All tuning values — single source of truth
world.js       Room class, 4×4 ScreenGrid, tile helpers
entities.js    Player, Enemy, Ally, HidingSpot constructors
ai.js          State machines, vision cone, collision
renderer.js    All canvas draw calls
game.js        Main loop, input, screen transitions, scoring
```
