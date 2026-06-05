# GM Sprite — Walk Frame B (right foot forward)

> **SIZE: 64 × 128 pixels. Portrait. 1:2 aspect ratio.**
>
> **STYLE: Pixel art. Hard-aliased pixels only. No anti-aliasing. No gradients. Banded shading.**
>
> **FORMAT: PNG with full alpha transparency. Transparent background. No floor shadow.**

See `style-guide.md` for full palette, character design, and renderer context.
Designed to loop with `walk-a.md` — alternate frames of a walk cycle.

---

## Prompt

Pixel art game sprite, 64×128 pixels, transparent background, PNG with alpha.
Retro first-person shooter enemy sprite style — Wolfenstein 3D / DOOM era.
Hard aliased pixels, flat colour banding, no anti-aliasing, no gradients, no brush strokes.

The Games Master: tall imposing villain, facing the viewer directly, mid-stride walking.

**Pose — Walk Frame B:** Right leg stepped forward, left leg back and slightly raised at
the heel. Right foot plants near centre-canvas, left foot toe-down at back. Right arm swings
slightly back, left arm swings slightly forward. The cane is in the left hand — as the left
arm swings forward the cane comes forward too, angled forward at roughly 15–20 degrees
from vertical. Body has a very slight forward lean. Head stays level, facing viewer.

This is the mirror of `walk-a.md`. Right foot is the planted foot — weight right,
momentum carrying. The arm-and-cane positions are opposite to frame A.

**Suit:** Same black suit. Trouser legs mirrored from walk-a — right leg trouser forward,
left pulled back. Jacket fold tension lines mirror frame A. The overall silhouette of the
figure mirrors frame A horizontally but must not simply be a horizontal flip — the cane
stays in the left hand which is now swinging forward (cane angles toward viewer-right).

**Shoes:** Same polished black. Right shoe toe-cap faces viewer, left shoe shows slight
sole underside.

**Mask, gloves, cane:** Identical character design to `idle.md`. Same cane angle as
walk-a but on the opposite swing.

**Figure proportions within 64×128 canvas:**
- Skull pommel (cane, angled forward-right): y 8–12 approximate
- Mask top: y 4–8
- Mask base / collar: y 22–26
- Shoulders: y 22–28, x 6–58
- Jacket body: y 26–80
- Right leg (forward): y 84–120, x 26–44
- Left leg (back): y 88–122, x 20–38
- Shoe soles: y 118–126

**16 colours maximum.** Together with walk-a, the two frames must read as a smooth
two-frame walk cycle when alternated. The key differences from walk-a are:
leg positions mirrored, cane angled to the other side.
