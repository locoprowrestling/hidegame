# Stage III — Screen Backgrounds Style Guide

## CRITICAL OUTPUT REQUIREMENTS

1. **320 × 200 pixels exactly. Landscape. 16:10 aspect ratio.**
   Native canvas resolution. CSS scales it 3× to 960×600 for display.
   `imageSmoothingEnabled = false` — pixel art scales with no blur.
2. **Pixel art.** Hard-aliased pixels only. No anti-aliasing. No smooth gradients.
   Banded shading with flat colour steps. No brush strokes. No painting.
3. **PNG, 8-bit RGB, no alpha channel.**
4. **No post-processing filters.** No vignette, no bloom, no lens flare.

**Style reference:** DOOM / Quake shareware title screens. Early 1990s PC game splash art.
Hard-edged pixel illustration. Dark, detailed, menacing. Looks hand-pixeled, not painted.

---

## Text overlay zones

The renderer draws text on top of these images at runtime. The background must remain
**legible through dark text** — meaning the background should be darkest in the areas
where text appears.

### Stage III Win screen text zones

```text
y   0–40   ░░░░░░ clear — can have detail (above title text)
y  40–105  ████  dark — "MASTER KEY" + 2–3 lines of text
y 105–145  ████  dark — flavour text
y 145–170  ░░░░░ clear — breathing room
y 170–200  ████  dark — "PRESS R TO PLAY AGAIN"
```

**Rule:** Any pixel in a dark zone should be value ≤ 35% brightness. Any pixel in
a clear zone can go up to 65% brightness. Vignette edges (outermost 20 px on all sides)
always dark.

---

## Setting: Hotel Imperial

**The Hotel Imperial, Longmont, Colorado.** A five-storey Edwardian hotel sealed in 1971.
Now home to the Games Master. Defeated — the player has collected all 40 room keys and
reached the Master Suite door on the Penthouse floor.

**Materials:**

- Mahogany panelling — very dark brown-red, grain visible
- Gilded plaster mouldings — tarnished gold, ornate
- Dark marble floor tiles — dark green-black with pale veining
- Velvet drapes — deep crimson, heavy folds
- Brass fittings — tarnished, once polished

**Colour temperature:**

- Overall: very dark. Warm amber undertones in the gilt and mahogany.
- Win screen: a single source of cold silver-blue moonlight from a high window —
  cutting across the oppressive warmth like an escape route.
- The GM is absent. His absence is eerie.

---

## Files

| File     | Screen         | Scene                                                    |
|----------|----------------|----------------------------------------------------------|
| `win.md` | Victory screen | Penthouse corridor — the Master Suite door ajar, moonlight through high window |
