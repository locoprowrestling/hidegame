# Screen Background — Win / Victory Screen

> **SIZE: 320 × 200 pixels. Landscape. 16:10 aspect ratio.**
>
> **STYLE: Pixel art. Hard-aliased pixels. Banded shading. No anti-aliasing. No gradients.**
>
> **FORMAT: PNG, 8-bit RGB, no alpha channel.**

See `style-guide.md` for text overlay zones, brightness rules, and setting reference.

Text drawn on top in gold and amber tones (y 45–200 band). Keep the image dark in
the centre column — visual interest and lighter values at the left edge, right edge,
and the bottom strip where the front doors open.

---

## Prompt

Pixel art game background, 320×200 pixels, no alpha, PNG 8-bit RGB.
Retro PC game victory screen art — early 1990s first-person horror game style.
Hard aliased pixels, flat colour banding, banded shading only, no anti-aliasing, no gradients.
Looks hand-pixeled, not painted. 20–32 colours maximum.

**Scene:** The Grand Foyer of the opera house, now seen from the far end looking back
toward the front entrance. The player has reached the front doors. They stand open —
just barely, cracked ajar — and through the gap: the outside world. Cold moonlight.
Freedom. But the hall behind is still dark, still wrong.

**The front doors (primary focal point, y 130–200, x 100–220):**
Two massive arched wooden doors, taller than anything human. Dark oak or mahogany,
almost black (#0e0c08), with ornate iron fittings — hinges, a central iron ring
handle, a decorative iron escutcheon. The doors are slightly ajar — a vertical crack
of light between them and at the left edge where the left door stands slightly open.

Through the gap: **moonlight.** Not warm — cold blue-silver (#a0b4c0 at brightest,
stepping down through #607080, #303c44 into near-black). The crack of light is the
brightest element in the entire image — a thin vertical blade of silver-blue, 4–8 px
wide at most. Through it: the barest suggestion of stone steps and a dark night sky
beyond. Just enough to know there is an outside.

The door surfaces in the dark foreground: value 5–15%. The moonlight crack: up to
70% value (the single brightest point in the image). Iron fittings: 1-px highlight
in dark silver (#404040) against the near-black door field.

**The foyer behind (y 0–160):**
The Grand Foyer stretches back from the viewer's position at the doors. The long hall
recedes into the darkness — columns on both sides, the marble floor, the chandelier
overhead. The perspective is reversed from the title screen: we are now at the door
end, looking back in.

- Columns: same granite blue-grey, near-black at this distance. Value 10–18%.
- Floor: cracked marble, dark. A faint reflection of the moonlight on the closest
  floor tiles — 2–3 pixel-wide pale streaks (#202c34) stretching toward the viewer
  from the door crack. Banded, not smooth.
- Chandelier: just visible overhead — a tarnished brass ring, near-black (#1a1208)
  with a faint warm glow pixel cluster (#3a2808) — but it gives no real light.
  All warmth is dead. The only light is the cold moon.

**The staircase (far end of hall, y 30–80, x 80–240):**
At the far end, partially visible: the grand staircase. In the darkness, a lone figure
can be seen standing at the top of the staircase — the Games Master.

He is back to the viewer again, as on the title screen. Slightly larger than in the
title (he is closer, or the perspective makes him more visible), but still small —
perhaps 10–14 px tall. He does not pursue. He watches. His silhouette: broad shoulders,
black suit, faint red of the mask, the vertical line of the cane. Motionless.
The text "The Games Master waits for the next unsuspecting visitor" will be drawn
over this zone — his figure should be clearly visible despite the text, suggesting
that the text describes what we are seeing.

**Colour temperature:**
Two competing temperatures:
- The interior: very dark cool blue-grey-black. The stone, the dark, the emptiness.
- The door crack: cold blue-silver moonlight — the only relief, and it is not warm.

There is no warmth in this image. The player escaped but nothing is resolved.
The opera house is exactly as it was. The Games Master is at his post.

**Brightness rules:**
- Door crack / moonlight (x 155–163, y 130–200): up to 65–70% value — brightest point
- Moonlight floor reflection (x 130–190, y 185–200): up to 30% value
- Door surfaces (x 80–260, y 120–200): 5–15% value
- Column sides catching moonlight edge (x 80–100, y 130–200): up to 25% value (left
  column nearest the open door catches a sliver of moonlight)
- Upper hall and ceiling (y 0–120): 6–18% value
- GM silhouette (y 30–80, x 80–240): 4–10% — slightly darker than surroundings
- All text zones (y 45–200, centre column): maximum 18% value in background

**Pixel detail notes:**
- The door crack is the image's compositional anchor — thin, bright, centred.
  Everything else organises around it.
- The moonlight reflection on the floor tiles must be banded — 3 discrete value
  steps, not a smooth fade. It is pixel art.
- The GM silhouette at the staircase: suggest the red mask with 2–3 dark red pixels
  (#3a0808) — not bright, not prominent, but identifiable to a player who looks.
- Iron door fittings: 1-px silver highlights, otherwise near-black.

**Mood:** Escaped. But not free. The Opera House is still there. He is still there.
The moonlight is cold. The player got out — this time.
