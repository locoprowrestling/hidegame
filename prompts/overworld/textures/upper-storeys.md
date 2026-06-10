# Overworld — Upper-Storey Facade Textures (4 textures)

> **SIZE: 64 × 64 pixels. Square. 1:1 aspect ratio.**
>
> **STYLE: Pixel art. Hard-edged aliased pixels only. Banded shading. 12–20 colours max.**
>
> **FORMAT: PNG, 8-bit RGB, no alpha channel.**
>
> **Must tile horizontally** (left edge meets right edge seamlessly).
> Vertically the tile repeats once per storey — the bottom ~4 px should read as a
> storey band / cornice line so stacked repeats look like separate floors.

The raycaster fakes building height on the overworld: above each facade's ground
floor it stacks this texture once per storey (`BUILDING_STORIES` in constants.js —
Opera 4, Mill 3, Hotel 7, storefronts 2). Each repeat is drawn progressively
darker, and storeys 5+ dissolve into the night sky. So:

- Windows are the star feature: 2–3 per tile, tall, mostly DARK.
- At most ONE dimly lit window (amber, curtained, maybe a silhouette) — it will
  appear on every storey of that building, which reads as "someone on every
  floor is watching". That is intended.
- Keep contrast in the window frames/sills; the wall field stays murky.

Procedural placeholders exist in `decals.js`; PNGs override them.

---

## 1. Opera House upper storeys
**Asset path:** `assets/overworld/textures/upper_opera.png` → `UPPER_TEXTURES[17]`
Victorian sandstone, tall arched windows with stone hoods, one faint amber glow.
Palette anchored to facade `#46382a`.

## 2. Sugar Mill upper storeys
**Asset path:** `assets/overworld/textures/upper_mill.png` → `UPPER_TEXTURES[18]`
Corrugated sheet metal and riveted panels, small high industrial windows, all
dark, one broken. Palette anchored to `#2a2a26`.

## 3. Hotel Imperial upper storeys
**Asset path:** `assets/overworld/textures/upper_hotel.png` → `UPPER_TEXTURES[19]`
Brick with sash windows and stone sills; ragged curtains; one window dimly lit
sick yellow-green. Palette anchored to `#3c241c`. This texture stacks 6 high —
keep the repeat unobtrusive.

## 4. Storefront upper storeys
**Asset path:** `assets/overworld/textures/upper_storefront.png` → `UPPER_TEXTURES[4]`
Downtown Longmont two-storey brick block: cornice band, paired sash windows,
all dark. Palette anchored to `#38231a`.
