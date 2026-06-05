# GM Sprite — Lunge / Catch

> **SIZE: 64 × 128 pixels. Portrait. 1:2 aspect ratio.**
>
> **STYLE: Pixel art. Hard-aliased pixels only. No anti-aliasing. No gradients. Banded shading.**
>
> **FORMAT: PNG with full alpha transparency. Transparent background. No floor shadow.**

See `style-guide.md` for full palette, character design, and renderer context.
This sprite is used when the GM is close to the player (dist < catch threshold).

---

## Prompt

Pixel art game sprite, 64×128 pixels, transparent background, PNG with alpha.
Retro first-person shooter enemy sprite style — Wolfenstein 3D / DOOM era.
Hard aliased pixels, flat colour banding, no anti-aliasing, no gradients, no brush strokes.

The Games Master: tall imposing villain, facing the viewer, lunging aggressively forward.

**Pose:** Both arms thrust forward and outward toward the viewer. Red skeletal gloved hands
are spread wide, reaching — like a man about to grab something. Right hand (cane hand) holds
the cane extended outward and forward, the skull pommel pointed slightly toward the viewer.
Left hand is open, fingers spread, reaching. Body leans sharply forward from the waist —
torso angled toward viewer, head pushed forward aggressively. Feet are spread, one leg
driving the lunge.

The overall shape: torso fills more of the canvas width because the arms are spread.
The figure appears closer, more imposing, filling the frame more than idle or walk poses.

**Suit:** Jacket pulled and stressed at the shoulders — diagonal tension lines across the
back and shoulders. Lapels open wider from the forward lean. Right sleeve extends forward
with the cane arm — sleeve end and red glove prominent. Left sleeve extends forward, hand
spread. The suit reads as "action" not "composed."

**Mask:** Same red skull mask. Eye holes facing viewer — the two red glow pixels (#ff2200)
are larger or brighter in this frame to emphasise menace. The mask should feel like it is
aimed at the viewer.

**Red skeletal gloves:** Both hands prominent and visible. Bone-line markings clear on
both hands. The reaching gesture makes the gloves a strong visual element in this frame.

**Cane:** Extended outward at a sharp angle, not planted. Skull pommel leads the cane
outward — it reads almost like a weapon being thrust. Cane shaft diagonal across the
lower-right of the sprite.

**Figure proportions within 64×128 canvas:**
- Mask top: y 2–6 (head pushed forward / higher in frame due to lean)
- Mask face: y 6–22
- Shoulders: y 18–24, spread to x 2–62 (wider from outstretched arms)
- Left hand / glove: y 34–50, x 2–14
- Right hand + skull pommel: y 34–50, x 48–62
- Torso (foreshortened from lean): y 24–72
- Cane shaft: diagonal from ~(56, 46) to ~(62, 100)
- Legs (wide planted stance): y 72–122

**16 colours maximum.** This sprite must read as "danger / imminent catch" at all scales.
Key silhouette difference from idle/walk: arms spread wide, torso leaning forward,
hands prominent at the sides of the frame.

**Atmosphere note:** This is the frame the player sees just before losing. It should feel
large, sudden, and threatening — like a jump scare frozen in pixel art.
