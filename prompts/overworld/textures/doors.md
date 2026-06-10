# Overworld — Building Entrance Doors (3 textures)

> **SIZE: 64 × 64 pixels. Square. 1:1 aspect ratio.**
>
> **STYLE: Pixel art. Hard-edged aliased pixels only. Banded shading. 12–20 colours max.**
>
> **FORMAT: PNG, 8-bit RGB, no alpha channel.**
>
> These render as full wall tiles in the raycaster — the door fills the whole tile,
> floor to ceiling. No tiling requirement (each appears on exactly one tile face).
> See style-guide.md for the overworld setting and renderer context.

Procedural placeholders exist in `decals.js`; dropping these PNGs in overrides them.

---

## 1. Opera House doors

**Asset path:** `assets/overworld/textures/door_opera.png`
**Engine slot:** `WALL_TEXTURES[21]` (also used for the interior front doors, R1 floor 0)

Grand crimson double doors recessed in a sandstone surround. Gilt-trimmed arch,
brass handles at centre, a thin line of warm light leaking between the leaves.
Faded gold leaf, scuffed kick plates, one cracked panel. Palette: deep crimson
`#5a1414`, tarnished gold `#c0a060`, sandstone `#3a3026`, near-black recess.
Max brightness ~45% — night exterior, but this is the inviting door: it should
read a touch warmer than everything around it.

## 2. Sugar Mill door

**Asset path:** `assets/overworld/textures/door_mill.png`
**Engine slot:** `WALL_TEXTURES[22]`

Industrial corrugated-steel sliding door on a rusted track, set in sheet-metal
wall. A heavy chain crosses it in an X with a brass padlock at centre (the mill
is chained until Round 1 is survived — the chain is canon). Rust streaks bleeding
down from bolt heads, stencilled lettering ghost barely visible. Palette: gunmetal
`#2c2a26`, rust `#4a2c16`, chain grey `#6a6a66`, brass `#8a7430`. Max brightness ~40%.

## 3. Hotel Imperial doors

**Asset path:** `assets/overworld/textures/door_hotel.png`
**Engine slot:** `WALL_TEXTURES[23]` (also used for the lobby's inside face, R3 floor 0)

Mahogany double doors with brass stiles and kick plates under a glowing transom
window — a sickly yellow-green light from inside, the only lit glass on the
street. Brick surround. Etched glass panels gone dark. The transom must read
**"HOTEL IMPERIAL" exactly** in clear block capitals — do not misspell, add, omit,
or merge any letters. Palette: mahogany `#34180e`, brass `#9a7c3a`, sick glow
`#73704e`, brick `#3c241c`. Max brightness ~45%, concentrated in the transom.
