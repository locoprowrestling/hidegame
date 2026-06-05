# GM Sprite — Walk Frame A (left foot forward)

> **SIZE: 64 × 128 pixels. Portrait. 1:2 aspect ratio.**
>
> **STYLE: Pixel art. Hard-aliased pixels only. No anti-aliasing. No gradients. Banded shading.**
>
> **FORMAT: PNG with full alpha transparency. Transparent background. No floor shadow.**

See `style-guide.md` for full palette, character design, and renderer context.
Designed to loop with `walk-b.md` — alternate frames of a walk cycle.

---

## Prompt

Pixel art game sprite, 64×128 pixels, transparent background, PNG with alpha.
Retro first-person shooter enemy sprite style — Wolfenstein 3D / DOOM era.
Hard aliased pixels, flat colour banding, no anti-aliasing, no gradients, no brush strokes.

The Games Master: tall imposing villain, facing the viewer directly, mid-stride walking.

**Pose — Walk Frame A:** Left leg stepped forward, right leg back and slightly raised at
the heel. Left foot plants near centre-canvas, right foot toe-down at back. Left arm swings
slightly back, right arm swings slightly forward. The cane is carried in the left hand,
angled forward at roughly 15–20 degrees from vertical — it does not touch the ground in
this frame. Body has a very slight forward lean (2–3 px offset from idle upright).
Head stays level, facing viewer.

This is the frame where the left foot is the planted foot — weight on the left,
momentum carrying forward.

**Suit:** Same black suit as idle. Trouser legs show stride split — left leg trouser
extends forward, right trouser pulled back. Slight jacket movement — right lapel edge
may show 1–2 px of shirt beneath from the arm swing. Fold lines in the jacket differ
from idle: more diagonal tension lines across the torso.

**Shoes:** Same polished black. Left shoe toe-cap faces viewer, right shoe shows slight
sole (1–2 px dark underside strip).

**Mask, gloves, cane:** Identical character design to `idle.md`. Cane shaft angled —
no longer perfectly vertical. Silver skull pommel position shifts accordingly.

**Figure proportions within 64×128 canvas:**
- Skull pommel (cane, angled): y 8–12 approximate (shifts with angle)
- Mask top: y 4–8
- Mask base / collar: y 22–26
- Shoulders: y 22–28, x 6–58
- Jacket body: y 26–80
- Left leg (forward): y 84–120, x 20–38
- Right leg (back): y 88–122, x 26–44
- Shoe soles: y 118–126

**16 colours maximum.** Must read clearly as "walking" at all scale sizes.
The stride split between the legs is the key silhouette difference from idle.
