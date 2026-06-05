# Screen Background — Game Over

> **SIZE: 320 × 200 pixels. Landscape. 16:10 aspect ratio.**
>
> **STYLE: Pixel art. Hard-aliased pixels. Banded shading. No anti-aliasing. No gradients.**
>
> **FORMAT: PNG, 8-bit RGB, no alpha channel.**

See `style-guide.md` for text overlay zones, brightness rules, and setting reference.

Text drawn on top in dark red tones. The renderer also draws `rgba(0,0,0,0.88)` over the
image before text — which means the background image will bleed through only very faintly
unless the renderer is updated to reduce that overlay. **Write this prompt for full
background visibility** (renderer will be updated to use a lighter overlay or none).

Text zones to keep dark: y 50–100 (large heading), y 100–130 (subtitle), y 160–185 (prompt).
Clear zones for detail: y 0–50 (top third) and y 130–160 (mid-gap).

---

## Prompt

Pixel art game background, 320×200 pixels, no alpha, PNG 8-bit RGB.
Retro PC game over screen art — early 1990s first-person horror game style.
Hard aliased pixels, flat colour banding, banded shading only, no anti-aliasing, no gradients.
Looks hand-pixeled, not painted. 20–32 colours maximum.

**Scene:** An extreme low-angle point-of-view — the player is on the floor, looking
straight up. The Games Master stands directly over them, looking down. This is the
moment of capture.

**The Games Master (dominant element):**
His figure fills the upper half of the frame (y 0–100) and the full width. We see him
from directly below — his chest, shoulders, and mask looming overhead in forced perspective.

- **Mask:** Takes up a large portion of the upper-centre. At this angle and proximity we
  see the underside of the chin and the face of the mask straight-on. The red skull-demon
  lucha mask (#cc1a1a base, #7a0e0e shadow underside of chin, #e83030 highlight on brow
  ridge). Black markings — jagged crack lines, flame shapes — in pixel art shorthand:
  2–3 px angular black strokes. The eye sockets face down at the viewer. Inside the eye
  sockets: two red glowing pixels (#ff2200), cold and direct.
- **Shoulders and jacket lapels:** Wide, dark — the suit jacket opens in a V below the
  mask, lapels framing the chest. Near-black (#0d0d0f) with dark charcoal highlight planes
  (#2c2c34) on the shoulder surfaces catching whatever light exists.
- **Red skeletal glove:** One hand visible at the side of frame, fingers spread —
  reaching down. The red bone-line markings (#cc1a1a) on near-black glove fabric.
  Maybe partially at the edge of frame, or half-visible below the jacket hem.
- **Cane:** The skull pommel is visible above his right shoulder, angling across the
  upper-right of the frame — a diagonal dark line with the silver skull (#9a9a9a)
  as a small bright accent near the top-right corner.

**Background — the auditorium ceiling:**
What the player sees beyond the GM: the painted vault ceiling of the Opera House
auditorium, far above. Crumbling plasterwork ornamental coffers — once cream and
gold, now dark with damp and age. Faded painted panels in near-black (#0d0c0a) with
the ghost of decorative borders in very dark gold (#2a2008). A tarnished chandelier
chain disappears into the darkness above. Everything at maximum darkness — value 10–20%.

**Colour temperature:**
Almost no warm light. The scene is dominated by the black suit and the red mask.
The only colours are:
- Near-black and dark charcoal for the suit (bulk of the image)
- Crimson and dark red for the mask (centre-upper)
- Red glow pixels for the eyes (2–4 pixels, #ff2200)
- Very dark ceiling plasterwork behind and above

No ambient light source. The scene feels suffocating.

**Brightness rules:**
- Mask area (y 0–55, x 90–230): up to 45% value — the dominant visual element
- Suit and shoulders (y 30–110, x 20–300): 5–20% value, near-black
- Ceiling far background (y 0–80 outside mask area): 8–18% value
- Lower half (y 100–200): very dark — the floor the player is lying on, or just
  deep shadow. Value 2–12%. This is where the dark text appears.
- Edge vignette (outermost 15 px all sides): near-black, 3–8% value

**Pixel detail notes:**
- The mask must be the first thing the eye goes to — it is the brightest element.
- The red eye-glow pixels should be distinct: 2 small bright (#ff2200) spots inside
  the dark socket areas. At this angle they face straight at the viewer.
- Suit folds at the shoulder: 3-tone banding — near-black, dark charcoal, slight
  blue-grey catch-light — all very dark.
- Ceiling plasterwork: faint 1-px ornamental border lines in very dark gold (#1a1408)
  on near-black field — barely visible, suggesting the grandeur that was.

**Mood:** Caught. Helpless. The Games Master does not speak — he simply looks down.
