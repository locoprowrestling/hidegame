# Overworld — Games Master Stalker Sprite

> **SIZE: 64 × 128 pixels. Portrait. 1:2 aspect ratio.**
>
> **STYLE: Pixel art. Hard-aliased pixels only. No anti-aliasing. No gradients. Banded shading.**
>
> **FORMAT: PNG with full alpha transparency. Transparent background. No floor shadow.**

See `../../GM/style-guide.md` for the full character specification and palette.

This is a **distant-silhouette variant** of the Games Master — the version seen in the
overworld, standing motionless at the far end of a dark street, watching. He is the same
character but rendered as a mostly-featureless dark figure. The only visible colour
detail is the faint red glow of his eyes.

---

## Context

In the overworld the GM stalks the player from a distance. He appears at 8–14 tiles away
and stands watching. Because of the raycaster's perspective scaling, at 8 tiles the sprite
renders at roughly 22 pixels tall on screen; at 12 tiles, roughly 14 pixels tall.

This sprite must read clearly as a threatening figure at 14–22 pixels of rendered height.
At that scale, fine suit details disappear — what reads is silhouette shape and eye glow.
The sprite must be designed with this primary rendering scale in mind.

---

## Prompt

Pixel art game sprite, 64×128 pixels, transparent background, PNG with alpha.
Retro first-person shooter enemy sprite style — Wolfenstein 3D / DOOM era.
Hard aliased pixels, flat colour banding, no anti-aliasing, no gradients, no brush strokes.

The Games Master in the overworld: **a distant, motionless, dark figure** standing upright
on a street at night. He is watching. He has not yet moved toward you.

---

## Visual approach: near-silhouette

This sprite is the same character as the `idle.md` sprite but redesigned for distance
legibility. At small sizes (14–22 px rendered height), fine detail becomes noise.
The priority is:

1. Clear upright human silhouette — tall, slightly broader at shoulder than hip
2. Two faint red points of light — the eyes inside the mask
3. A suggestion of the cane — a thin vertical line extending from hand to floor

Everything else is secondary. The suit, gloves, and mask markings should be present
but understated — this is a figure glimpsed at the end of a dark street, not a close view.

---

## Specific differences from the idle.md sprite

**Darkness:** The overall figure is 2–3 shades darker than the idle sprite. The suit,
instead of showing three banding values, shows only two: near-black (#0d0d0f) and deep
charcoal (#1a1a1e). No bright highlight planes. This is a figure consumed by night.

**Mask:** The mask is darker too — mask base (#7a1010 instead of #cc1a1a) with no
highlight catch-light. The eye glow (#ff2200) remains — two small bright red pixels,
2×2 px each, at the eye socket positions. These must survive at small scale and are the
only saturated colour in the sprite.

**Pose:** Identical to idle — standing, weight even, cane planted. No change to pose.

**Suit details:** Lapels and button may still be visible but are not a rendering priority.
Glove bone markings are not visible at this brightness level — the hands are dark masses.

**Cane:** A single 1-px wide near-black vertical line from the grip down to the ground.
Skull pommel: a 2-px cluster at the top (grey #4a4a4a, slightly lighter than the cane
and hand) — just enough to suggest it.

---

## Figure proportions within 64×128 canvas

Same proportional layout as `idle.md` — the silhouette must match for animation blending:

- Head top (mask): y 4–8
- Mask base / collar: y 22–26
- Shoulders: y 22–28, x 6–58
- Jacket body: y 26–80
- Waist: y 76–84
- Trouser legs: y 84–118
- Shoe soles: y 118–126

The silhouette outline must be hard-aliased pixel edges with no interior shading
complexity visible at 14-px rendered height.

---

## Palette (8 colours max — deliberately minimal)

| Hex      | Role                                    |
|----------|-----------------------------------------|
| #0d0d0f  | Suit deepest shadow, shoes, hair (void) |
| #1a1a1e  | Suit mid-tone, trousers                 |
| #7a1010  | Mask base — dark red, no highlight      |
| #ff2200  | Eye glow — the only bright pixels       |
| #181818  | Cane shaft                              |
| #4a4a4a  | Skull pommel                            |
| #0d0d10  | Glove / hand mass                       |
| transparent | Background                           |

**16 colours maximum as per spec — this sprite uses 7. Fewer is better here.**
The eye glow (#ff2200) is the only pixel in this sprite that must survive downsampling.

---

## Silhouette test

At 8×16 pixels (far overworld distance) the sprite must read as:
- A dark upright figure
- Two tiny red dots (eyes)
- A thin dark line (cane)

That is the complete legibility requirement for this sprite.
