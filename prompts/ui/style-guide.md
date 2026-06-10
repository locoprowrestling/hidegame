# UI / HUD Chrome — Sprite Style Guide

Prompts for every GUI element the renderer currently draws procedurally (flat
`fillRect` bars, vector arrows, font-rendered titles). Each generated PNG is an
**optional override** — `textures.js` loads it into `SPRITE_TEXTURES` and the
renderer falls back to the existing procedural drawing if the file is absent.
Drop finished PNGs into `assets/ui/` to activate them.

## CRITICAL OUTPUT REQUIREMENTS

1. **Pixel art.** Hard-aliased pixels only. No anti-aliasing, no smooth
   gradients, no glow blur, no drop shadows rendered by the generator.
   Banded shading with flat colour steps. Looks hand-pixeled, not painted.
2. **Exact final dimensions per file** (see table below). ImageGen cannot
   output these sizes natively — generate at 1024×1024 or 1536×1024, then
   downscale/crop per the *Post-processing* section in each prompt.
3. **Transparency:** sprites marked *alpha* must end up with a fully
   transparent background. Generate on a **pure white (#ffffff) background** —
   the loader (`_loadSprite` in `textures.js`) flood-fills near-white from the
   border and keys it out automatically. Never use white *inside* the artwork
   where it touches the border.
4. **No post-processing filters.** No vignette, bloom, lens flare, noise.

**Style reference:** DOOM / Hexen / Heretic HUD chrome. Early-1990s PC
shooter status bars — carved dark wood, riveted brass, engraved stone.
Victorian-occult flavour to match the GAMES MASTER setting.

---

## Renderer context

The game canvas is **320 × 200 px** upscaled 3× with
`imageSmoothingEnabled = false`. Every UI sprite is blitted with `drawImage`
at the *drawn size* listed below, so author artwork on that logical pixel
grid — one logical pixel = one canvas pixel.

Runtime text is drawn **on top of** the bars and map in gold
(`#c0a060`, `#806040`) and blue (`#88ccff`) — the centre of every bar and the
body of the map sheet must stay **≤ 25% brightness** so text reads.

---

## Shared palette

Use these exact colours so UI chrome matches the in-game HUD text and markers.

| Swatch | Hex | Used for |
|--------|-----|----------|
| HUD gold | `#c0a060` | Lit pips, legend text, frame filigree |
| Dark gold | `#806040` | Secondary text, dim brass |
| Bright gold | `#ffd966` | Door beacons, key highlights |
| Brass shadow | `#7a5c2e` | Bevel undersides |
| Pale gilt | `#e8d8a8` | Brightest bevel catch-light |
| Bar wood | `#2a1f0e` | HUD bar planks, map frame |
| Wood dark | `#1a1208` | Plank seams, recesses |
| Near black | `#0a0806` | Grooves, background field |
| Stair blue core | `#99ddff` | Stair arrow bright core |
| Stair blue mid | `#55bbff` | Stair arrow body |
| Stair blue glow | `#0088ff` | Stair arrow outer glow band |
| Danger red | `#ff2200` | RUN eye, stress flash |
| Lock red | `#aa4444` | Locked-door arrow |
| GM crimson | `#cc1a1a` | Mask-red accents (sparingly) |

---

## Files

| Prompt | Asset path | Final size | Alpha | Drawn at / usage |
|--------|-----------|-----------|-------|------------------|
| `topbar.md` | `assets/ui/topbar.png` | 320 × 23 | no | y 0–23 — floor name, pips, count + stress groove |
| `bottombar.md` | `assets/ui/bottombar.png` | 320 × 18 | no | y 182–200 — interaction prompts |
| `collectible-pips.md` | `assets/ui/pip_{program,card,key}_{lit,dim}.png` | 8 × 8 ×6 | yes | top-bar per-floor counters |
| `stage-pips.md` | `assets/ui/stage_{opera,mill,hotel}_{lit,dim}.png` | 8 × 8 ×6 | yes | overworld top-bar stage tracker |
| `indicator-arrows.md` | `assets/ui/arrow_{up,down,door,locked}.png` | 32 × 32 ×4 | yes | floating stair / door beacons |
| `map-parchment.md` | `assets/ui/map_parchment.png` | 320 × 200 | no | Tab map overlay background |
| `map-markers.md` | `assets/ui/map_{you,gm,stairs}.png` + `map_item_{program,card,key}.png` | 8 × 8 ×6 | yes | Tab map markers + legend swatches |
| `title-logo.md` | `assets/ui/logo.png` | 288 × 64 | yes | title screen logotype |
| `lucky-stamp.md` | `assets/ui/lucky.png` | 128 × 48 | yes | 4% lucky-escape flash |
| `eye-warning.md` | `assets/ui/eye_{open,shut}.png` | 16 × 16 ×2 | yes | RUN / DON'T LOOK proximity warnings |
| `../r3/items/room-key-full.md` | `assets/r3/items/room-key-full.png` | 160 × 160 | yes | R3 pickup-flash hero art |

---

## Generation & post-processing workflow

1. Generate with ImageGen at the size named in each prompt
   (`1024×1024` square sprites/icons, `1536×1024` wide strips).
2. Ask for the artwork on a **logical pixel grid** — e.g. "design on a 32×32
   pixel grid, each logical pixel rendered as a flat 32×32 block". This keeps
   downscaling lossless-looking.
3. Downscale with a point/nearest filter where available:

   ```sh
   magick raw.png -filter point -resize 32x32\! assets/ui/arrow_up.png
   # or, macOS:
   sips -z 32 32 raw.png --out assets/ui/arrow_up.png
   ```

4. Wide strips (topbar/bottombar): generate 1536×1024 with the strip artwork
   as a centred horizontal band, crop the band, then resize — exact commands
   are in each prompt.
5. Verify in-game: serve with `python3 -m http.server 8080`, the sprite
   activates automatically; delete/rename the PNG to fall back to procedural.
