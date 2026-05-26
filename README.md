# Hide

A top-down object-disguise game. You are a member of a rival team trying to avoid detection by hiding as backstage props.

## How to Play

A round begins in a random venue room. You have **10 seconds** to pick a disguise and position yourself somewhere believable. Then hunters enter and search. Survive **45 seconds** without being found.

### Controls

| Key | Action |
|-----|--------|
| WASD / Arrow keys | Move |
| Space | Transform / Untransform |
| Q / E | Cycle disguise |
| 1–8 | Select disguise directly |
| R | Restart after win/loss |
| M | Mute/unmute |

### Round Flow

1. Pick your team (A or B)
2. Pick your character
3. Room loads — you have 10 seconds to get into position
4. Hunter enters and searches for 45 seconds
5. Survive → score. Get caught → try again.

## Disguise Objects

| # | Object | Best Rooms |
|---|--------|------------|
| 1 | Folding Chair | Ring area, Locker room |
| 2 | Road Case | Backstage, Entrance, Storage |
| 3 | Crate | Storage, Backstage |
| 4 | Trash Can | Locker room, Backstage |
| 5 | Merch Box | Merch area, Storage |
| 6 | Mic Stand | Ring area, Entrance |
| 7 | Ladder | Ring area, Storage |
| 8 | Curtain Bundle | Entrance, Backstage |

## Suspicion Rules

The suspicion meter (top-right bar) fills if:
- You move while disguised and the hunter can see you
- You are disguised in the wrong place for that object
- The hunter stops to inspect your object

It drains if:
- You stay still
- The hunter is far away

If it hits 100 → **YOU WERE FOUND**. Reach 0 on the hunt timer → **SURVIVED**.

## Scoring

| Bonus | Points |
|-------|--------|
| Survival | 100 |
| Per second survived | +2 |
| Per surviving ally | +10 |
| Never moved while disguised | +25 |
| Never changed disguise during hunt | +15 |
| Good hiding spot | +20 |

## Run Locally

```bash
python3 -m http.server 8181
# open http://localhost:8181
```

No build step. No npm. Static files.

## Deploy

Push to `master`. GitHub Pages serves from the repo root.

## Future Expansions

- 4×4 venue grid (multi-room navigation)
- More characters with unique abilities
- Sprite artwork for objects and characters
- Sound effects
- Multiple hunters
- Room-specific hazards (lighting rigs, cameras)
- Unlockable disguise objects
