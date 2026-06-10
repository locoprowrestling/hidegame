# UI — Title Logotype "GAMES MASTER"

> **SIZE: 288 × 64 pixels exactly. Wide. PNG with alpha transparency.**
>
> **STYLE: Pixel art lettering. Hard-aliased pixels. Banded bevels. No
> anti-aliasing. No gradients. No glow blur.**
>
> **FORMAT: PNG-32 with alpha (generate on pure #ffffff background — the
> loader keys white out automatically).**

Replaces the font-rendered "GAMES MASTER" heading on the title screen
(`drawTitle` in `renderer.js`). Drawn centred at the top of the 320×200
title screen, over the dark gradient band of the existing title background
(`assets/screens/title.png` — abandoned opera-house foyer, near-black in the
y 0–70 region). The subtitle and controls text below it stay font-rendered
in `#8a7050` — the logo must harmonise with that gold family.

---

## Prompt

Pixel art video game logotype, the words "GAMES MASTER" in carved Victorian
playbill lettering, on a strict 288×64 pixel grid, every pixel a flat single
colour, pure white background, no anti-aliasing, no gradient, no blur, no
drop shadow.

**Lettering:**
- Two words side by side on one line, or "GAMES" above "MASTER" slightly
  staggered — whichever fills 288×64 better. Letters 26–40 px tall.
- Letterforms: heavy slab-serif woodtype, the kind on 1880s theatre
  playbills — thick vertical stems, bracketed serifs, slightly irregular
  edges as if hand-carved. Small chips and nicks (1–2 px bites) out of a few
  letters: the sign is old.
- **Bevel bands (flat steps, top to bottom of each letter face):**
  catch-light `#e8d8a8` (top 2 px of each stroke), face `#c0a060`
  (main fill), lower face `#a08040`, base shadow `#7a5c2e` (bottom 2 px).
- **Outline:** 1 px `#2a1208` around every letter, then a 1 px detached
  drop-edge of `#1a0c04` offset 1 px down-right (hard pixel shadow, not
  blur).

**Ornament:**
- A thin horizontal rule of `#7a5c2e`, 2 px tall, under the lettering, with
  diamond finials (5×5 px, `#c0a060` with `#e8d8a8` centre pixel) at each
  end.
- Centred on that rule, a small Games Master mask sigil, 12×10 px: the red
  lucha skull mask in `#cc1a1a` with `#7a0e0e` shading, two `#ff2200` eye
  pixels, 1 px `#1a0404` outline. The only red in the logo.

**Forbidden:** any background fill, vignettes, sparkles, lens flares, smooth
shading, more than 12 colours.

---

## Post-processing

Generate at **1536 × 1024** with the logotype as a centred band
(artwork region ≈ 1440×320, white elsewhere). Then:

```sh
magick raw.png -gravity center -crop 1440x320+0+0 +repage \
  -filter point -resize 288x64\! assets/ui/logo.png
```

Check over a near-black background: the `#1a0c04` drop-edge must still
separate the letters from the foyer scene.
