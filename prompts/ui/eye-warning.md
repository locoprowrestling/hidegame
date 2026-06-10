# UI — Proximity Warning Eyes (2 icons)

> **SIZE: 16 × 16 pixels exactly, each. Square. PNG with alpha transparency.**
>
> **STYLE: Pixel art. Hard-aliased pixels. No anti-aliasing. No gradients.**
>
> **FORMAT: PNG-32 with alpha (generate on pure #ffffff background — the
> loader keys white out automatically).**

The top HUD bar flashes two text warnings about the Games Master
(`drawHUD` in `renderer.js`): **RUN** (he is chasing — red, 300 ms strobe)
and **DON'T LOOK** (he is within 6 tiles — amber, intensity scales with
distance). These icons render at 11×11 px just left of each warning text,
on the dark top-bar wood, flashing in sync with the text. Eye contact is
the game's core threat — the icons make that legible at a glance.

| File | Pairs with | Meaning |
|------|-----------|---------|
| `eye_open.png` | RUN | he has seen you |
| `eye_shut.png` | DON'T LOOK | keep your eyes down |

---

## Prompt — `eye_open`

Tiny pixel art game HUD icon, a wide-open staring eye, on a strict 16×16
pixel grid, every pixel a flat single colour, pure white background, no
anti-aliasing, no gradient.

- Almond eye outline spanning x 1–14, y 4–11: 1 px line of `#2a0808`.
- Sclera fill `#d8c8c0` (dirty bone-white, not pure white — pure white gets
  keyed out by the loader).
- Iris: 5×5 px disc of `#ff2200` with a `#7a0e0e` ring and a single
  `#ffd966` glint pixel top-left. Pupil: 1 px `#0a0806` centre.
- Three 1 px lash ticks of `#2a0808` radiating from the top lid, and two
  from the bottom — alarm, not beauty.
- Two stress lines: 2 px diagonal ticks of `#aa4444` floating off the left
  and right corners of the eye.

## Prompt — `eye_shut`

Same grid, same style, the same eye squeezed shut:

- A heavy closed lid: a 1 px arc of `#2a0808` curving down across x 1–14
  at y 7–9, with a 2 px band of `#6a4a2e` (lid skin, amber-lit) above it
  and `#3a2616` shading below.
- Three short lash ticks of `#2a0808` hanging from the lid arc.
- Above the lid, one 2 px bead of `#c87800` at each end — the amber of the
  DON'T LOOK warning text — like light pressing against the closed lid.
- No red anywhere: shut eye = safe(r).

**Colour budget:** 7 colours per icon.

---

## Post-processing

Generate each at **1024 × 1024** ("each logical pixel a flat 64×64 block"),
then:

```sh
magick raw.png -filter point -resize 16x16\! assets/ui/eye_open.png
```
