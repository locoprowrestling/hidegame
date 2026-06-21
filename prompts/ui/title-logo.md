# UI: Title Logotype "GAMES MASTER"

> **SIZE: 288 × 64 pixels exactly. Wide. PNG with alpha transparency.**
>
> **STYLE: Pixel art lettering. Hard-aliased pixels. Banded bevels. No
> anti-aliasing. No gradients. No glow blur.**
>
> **FORMAT: PNG-32 with a fully transparent background. Use the API
> `background: "transparent"` parameter. Do NOT use a coloured background
> and do NOT rely on post-processing to remove the background.**

Replaces the font-rendered "GAMES MASTER" heading on the title screen
(`drawTitle` in `renderer.js`). Drawn centred at the top of the 320x200
title screen, over the dark gradient band of the existing title background
(`assets/screens/title.png`, abandoned opera-house foyer, near-black in the
y 0-70 region). The subtitle and controls text below it stay font-rendered
in `#8a7050`; the logo must harmonise with that gold family.

---

## Generation

**API call:** use `gpt-image-1` with `background: "transparent"`. The model
outputs a PNG-32 with a native alpha channel. Do not generate on any
background colour.

**Prompt text to send:**

Pixel art video game logotype on a transparent background. The words
"GAMES MASTER" in carved Victorian playbill lettering. Hard-aliased pixels
only: no anti-aliasing, no smooth gradients, no glow, no blur, no
drop shadows. Every pixel is a flat single colour from the palette below.
The background must be fully transparent with zero opacity: no fill,
no vignette, no fringe.

Lettering: heavy slab-serif woodtype in the style of 1880s theatre
playbills. Thick vertical stems, bracketed serifs, slightly irregular
edges as if hand-carved. Small chips and nicks (1-2 px bites) in a few
letters: the sign is old. Letters 26-40 px tall. The two words can sit
side by side on one line or "GAMES" above "MASTER" staggered, whichever
fills the space better.

Bevel bands on each letter face, top to bottom, flat colour steps only:
catch-light #e8d8a8 (top 2 px), face #c0a060 (main fill), lower face
#a08040, base shadow #7a5c2e (bottom 2 px). Outline: 1 px #2a1208 around
every letter, then a 1 px detached drop-edge of #1a0c04 offset 1 px
down-right.

Ornament below the lettering: a thin horizontal rule, #7a5c2e, 2 px tall,
with diamond finials (5x5 px, #c0a060 with #e8d8a8 centre pixel) at each
end. Centred on that rule: a small lucha skull mask sigil, 12x10 px, in
#cc1a1a with #7a0e0e shading, two #ff2200 eye pixels, 1 px #1a0404
outline. This is the only red in the image.

Permitted colours only: #e8d8a8, #c0a060, #a08040, #806040, #7a5c2e,
#2a1208, #1a0c04, #cc1a1a, #7a0e0e, #ff2200, #1a0404. No white. No other
colours. No magenta. No background fill of any kind.

---

## Post-processing

The output should already have a transparent background. Just trim and resize:

```sh
magick raw.png \
  -fuzz 2% -trim +repage \
  -filter point -resize 288x64\! \
  assets/ui/logo.png
```

Check over a near-black background (#0a0806): the #1a0c04 drop-edge must
clearly separate the letters from the foyer scene. No haloes. No fringe.
If any background colour remains, the generation prompt did not enforce
transparency: regenerate rather than attempting to key it out.
