# Wall Decals — Style Guide
# (posters, paintings, signage hung on wall faces)

## CRITICAL OUTPUT REQUIREMENTS

1. **48 × 64 pixels exactly. Portrait. 3:4 aspect ratio.**
2. **Pixel art.** Hard-edged aliased pixels, flat colour banding, no anti-aliasing,
   no gradients, no blur. Early-90s FPS wall-art style (think DOOM wall hangings).
3. **PNG, 8-bit RGBA — alpha channel IS used.** Transparent pixels show the wall
   texture behind the decal. Posters can have torn/irregular edges; framed
   paintings should fill the canvas edge-to-edge.
4. **No post-processing filters.**

## Renderer context

Decals are composited over wall textures in the raycaster wherever decal alpha
is above ~50%. A decal occupies the central band of one wall tile — roughly the
middle 64% horizontally and the upper-middle 60% vertically (eye level). It is
seen at every distance from point-blank to fog limit, so:

- Big bold shapes carry the read; 1-px detail vanishes beyond ~3 tiles.
- "Text" should be suggested with bars and blocks unless it's a single short
  word in huge letters (TONIGHT, MISSING, KEEP OUT). Real small text turns to mush.
- Lighting is applied by the engine (candle grade, fog, GM light-drain) — bake
  NO lighting into the art beyond local shading. Max brightness ~70% value.

## Engine slots

Loaded from `assets/decals/<name>.png` into `DECAL_TEXTURES['<name>']`
(textures.js). Procedural placeholders in decals.js are overridden when the
PNG exists. Placement is automatic inside buildings (decals.js auto-scatter)
and hand-placed on the overworld (OW_DECALS).

Per-round sets — see the sibling prompt files:
- `r1-opera-posters.md` — poster_gala, poster_masque, poster_seance, portrait_gm
- `r2-mill-signage.md` — mill_safety, mill_tonnage, mill_missing, mill_sugar
- `r3-hotel-paintings.md` — hotel_portrait_a, hotel_portrait_b, hotel_hunt, hotel_rates
- `overworld-billboards.md` — ow_billboard_a, ow_billboard_b, ow_hotel_plaque, ow_mill_notice
