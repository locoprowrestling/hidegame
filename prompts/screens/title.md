# Screen Background — Title / Start Screen

> **SIZE: 320 × 200 pixels. Landscape. 16:10 aspect ratio.**
>
> **STYLE: Pixel art. Hard-aliased pixels. Banded shading. No anti-aliasing. No gradients.**
>
> **FORMAT: PNG, 8-bit RGB, no alpha channel.**

See `style-guide.md` for text overlay zones, brightness rules, and setting reference.

Text drawn on top of this image in gold and amber tones. The image must stay below
~35% brightness in the y 35–170 text band. Detail and contrast live in the top strip,
the far edges, and the bottom strip.

---

## Prompt

Pixel art game background, 320×200 pixels, no alpha, PNG 8-bit RGB.
Retro PC game title screen art — early 1990s first-person horror game splash screen style.
Hard aliased pixels, flat colour banding, banded shading only, no anti-aliasing, no gradients,
no brush strokes. Looks hand-pixeled, not painted. 20–32 colours maximum.

**Scene:** The Grand Foyer of an abandoned Victorian opera house, viewed from the inside
looking toward the far end of the hall. The player's perspective — standing at ground level,
facing forward into the vast dark space.

**Architecture:**
The hall is long and wide. Massive granite columns run along both sides — dark blue-grey
stone (#1a1c22), monolithic. Between the columns: arched alcoves with black iron lamp
sconces, unlit, cobwebbed. The floor is cracked marble — dark grey with faint pale vein
lines, barely visible in the dark. High above: a domed or vaulted ceiling, only the
nearest sections visible in faint ambient light; the upper reaches dissolve into near-black.
At the far end of the hall: a grand staircase rises to a mezzanine level, disappearing
into darkness. The staircase balustrade is dark tarnished wood with ornate carved posts.

**Light:**
A single source: one of the great brass chandeliers, directly overhead, gives off the
faintest amber glow — enough to catch the tops of the nearest columns and the first
three metres of floor, nothing more. All other light is dead. The far end of the hall
is deep shadow. The alcoves are black. The ceiling is black. This is a scene of almost
total darkness relieved by one small warm spot.

**The Games Master:**
At the far end of the hall, at the base of the grand staircase, stands a lone figure.
He is small at this distance — perhaps 6–8 pixels tall — but unmistakeable:
broad-shouldered in a black suit, a faint red shape at his head (the mask), a vertical
line beside him (the cane). He stands with his back to the viewer. Still. Waiting.
He is not lit — he is a silhouette darker than the darkness around him, visible only
because the vague light catches the edge of his shoulder and the faint red of the mask.
Do not make him large or prominent — he should reward a second look, not dominate.

**Curtains:**
To the left of the staircase, a massive stage curtain hangs from ceiling to floor —
deep crimson velvet (#2a0303 to #4a0808 in fold ranges), heavy, sagging. The folds
are pixel-art banded: three to four distinct tones stepping from near-black in the
creases to dark red on the forward fold faces. No bright red — the curtain is old,
faded, dusty.

**Darkness rules:**
- Foreground (bottom strip, y 185–200): floor tiles in near-black, barely distinguished
  from pure black. Max value 20%.
- Mid-ground (y 80–160): the hall stretches back. Columns fade with distance.
  Near columns: value 25–35%. Far columns: 10–15%.
- Far end and staircase (y 50–100): value 8–20%. The GM figure is here.
- Top (y 0–35): ceiling arch or chandelier fitting visible. Amber accent (#4a3010)
  on the nearest chandelier frame. Value up to 40% in the lamp glow area only.
- Left and right edges (x 0–20, x 300–320): solid near-black columns/wall framing.
  Value 5–12%. These frame the scene and hide the rendered text behind a dark border.

**Pixel detail notes:**
- Column surfaces: 2–3 px wide flat-colour bands for stone facets. No smooth shading.
- Floor cracks: 1-px dark lines (#0a0a0c) on the marble field.
- Chandelier: small, 5–7 px across, a ring of tarnished brass pixels (#3a2808)
  with 2–3 px of amber glow pixels (#6a4818) beneath it — suggesting light without
  painting a gradient.
- Cobwebs in column alcoves: 1-px diagonal lines in near-black (#0e0e10).

**Mood:** Dread and grandeur. The space was magnificent once. It is hostile now.
The Games Master owns it.
