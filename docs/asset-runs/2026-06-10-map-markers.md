# 2026-06-10 - Tab-Map Markers

## Scope

- Prompt sources: `prompts/ui/style-guide.md`,
  `prompts/ui/map-markers.md`
- Runtime destinations: six `assets/ui/map_*.png` files
- Consuming code: marker slots in `textures.js`; drawing in `renderer.js`

## Generation

- Tool: ImageGen, one call per icon
- Outputs: player, Games Master, stairs, programme, punch card, room key
- Generator returned 1254 x 1254 RGB images instead of final 8 x 8 sprites.
- The images captured the requested silhouettes but included smooth shading
  and large margins.

## Processing

- Untouched outputs were archived under `source-assets/ui/` with filenames
  matching the runtime assets.
- Runtime copies were authored as exact 8 x 8 RGBA glyphs using the prompt's
  specified geometry and palette.
- A nearest-neighbor contact sheet was created temporarily for inspection.

## Verification

- SHA-256 hashes of archived sources matched the generator cache files.
- All six runtime files reported as 8 x 8 RGBA PNGs.
- Magnified inspection confirmed distinct silhouettes and transparent fields.
- Browser playtesting was unavailable during the run.

## Status

| Asset | Generated | Archived | Processed | Integrated | Verified | Playtested |
| --- | --- | --- | --- | --- | --- | --- |
| `map_you.png` | yes | yes | yes | yes | yes | no |
| `map_gm.png` | yes | yes | yes | yes | yes | no |
| `map_stairs.png` | yes | yes | yes | yes | yes | no |
| `map_item_program.png` | yes | yes | yes | yes | yes | no |
| `map_item_card.png` | yes | yes | yes | yes | yes | no |
| `map_item_key.png` | yes | yes | yes | yes | yes | no |

## Lessons

- At 8 x 8, direct downscaling of a loosely framed generated image is not
  reliable. Preserve the generated concept and validate or correct every
  runtime pixel.
- Shape differences are as important as color because adjacent markers and
  color-blind readability are gameplay concerns.

