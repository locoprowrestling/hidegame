# Manual artwork — imagegen prompts

Three optional illustrations for `manual.html`. The manual renders fine without
them (each `<img>` hides itself or falls back to a screenshot if the file is
absent). Generate with imagegen, then save to the exact paths below.

| Prompt file      | Output path                          | Size (resize with `sips` after gen) |
| ---------------- | ------------------------------------ | ----------------------------------- |
| `cover.md`       | `assets/manual/art/cover.png`        | 1280×720                            |
| `gm_portrait.md` | `assets/manual/art/gm_portrait.png`  | 832×1024                            |
| `town_map.md`    | `assets/manual/art/town_map.png`     | 1280×860                            |

Shared art direction (repeat in every generation request):

- Retro horror, late-1980s PC game box / instruction-booklet illustration style.
- Palette anchored to the game: aged gold `#c0a060`, parchment tan `#cdbd9d`,
  blood red `#a01818`, near-black warm browns. No neon, no modern UI elements.
- Painterly with visible grain is fine; **do not** imitate any specific living
  artist. No photoreal faces. No text/lettering in the image (the manual sets
  its own type) **except** where a prompt explicitly asks for illegible
  scrawl/signage shapes.

Post-process (matches the repo's other assets):

```sh
sips -z 720 1280 cover-raw.png    --out assets/manual/art/cover.png
sips -z 1024 832 portrait-raw.png --out assets/manual/art/gm_portrait.png
sips -z 860 1280 map-raw.png      --out assets/manual/art/town_map.png
```
