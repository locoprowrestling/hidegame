# Screen Backgrounds — Style Guide

## CRITICAL OUTPUT REQUIREMENTS

1. **320 × 200 pixels exactly. Landscape. 16:10 aspect ratio.**
   This is the native canvas resolution. CSS scales it 3× to 960×600 for display.
   `imageSmoothingEnabled = false` — pixel art scales with no blur.
2. **Pixel art.** Hard-aliased pixels only. No anti-aliasing. No smooth gradients.
   Banded shading with flat colour steps. No brush strokes. No painting.
3. **PNG, 8-bit RGB, no alpha channel.**
4. **No post-processing filters.** No vignette, no bloom, no lens flare added by
   the generator. Atmospheric effects must be done in flat pixel shading only.

**Style reference:** DOOM / Quake shareware title screens. Early 1990s PC game splash art.
Hard-edged pixel illustration. Dark, detailed, menacing. Looks hand-pixeled, not painted.

---

## Text overlay zones

The renderer draws text on top of these images at runtime. The background must remain
**legible through dark text** — meaning the background should be darkest in the areas
where text appears. Details and visual interest should live at the edges, corners, and
vertical thirds away from the text band.

### Title screen text zones

```text
y   0–35   ░░░░░░ clear — can have detail (above title text)
y  35–70   ████  dark — title "GAMES MASTER" + subtitle in gold
y  70–80   ░░░░░ clear — divider line zone
y  80–135  ████  dark — instructions text (3 lines)
y 135–170  ████  dark — controls text (2 lines)
y 170–200  ░░░░░ clear — can have detail (below prompts)
```

### Game Over text zones

```text
y   0–50   ░░░░░░ clear — can have detail
y  50–100  ████  dark — "THE PERFORMANCE / IS OVER." (large text)
y 100–130  ████  dark — "The Games Master found you."
y 130–160  ░░░░░ clear — breathing room
y 160–185  ████  dark — "PRESS R TO TRY AGAIN"
y 185–200  ░░░░░ clear
```

### Win screen text zones

```text
y   0–45   ░░░░░░ clear — can have detail
y  45–110  ████  dark — "CURTAIN CALL" + 2 lines + divider
y 110–155  ████  dark — flavour text (2 lines)
y 155–175  ░░░░░ clear — breathing room
y 175–200  ████  dark — "PRESS R TO PLAY AGAIN"
```

**Rule:** Any pixel in a dark zone should be value ≤ 35% brightness. Any pixel in
a clear zone can go up to 65% brightness. Vignette edges (outermost 20 px on all sides)
can always be dark regardless of zone.

---

## Setting

Abandoned Victorian Opera House — 1870s-built, sealed 1940s, untouched since.
Grand in its bones, hostile now: damp, cold, dark, decaying.

**Materials visible in scene backgrounds:**

- Granite block walls — dark blue-grey, coarse-grained, crystalline
- Lime plaster — crumbling ornamental mouldings, stained ivory
- Theatrical velvet — deep crimson stage curtains, folds and drapes
- Tarnished brass fittings — chandeliers, fixtures, once gold now dark
- Dark hardwood — banisters, balcony rails, worn and split
- Cracked marble — foyer floor, once grand

**Colour temperature:**

- Overall: very dark. Maximum value ~55% across most pixels.
- Title: cool blue-grey environment with warm amber accent light
- Game Over: deep red-black. No warm light — hostile, suffocating
- Win: amber-gold light source visible (moonlight through open doors), but still
  predominantly dark — the relief is uneasy, not triumphant

**The Games Master's presence:**

- Title: his silhouette visible in the far distance, back to viewer, cane in hand
- Game Over: his mask filling the upper portion of frame, looming from above
- Win: absent — but his absence is eerie. The Opera House is empty again.

---

## Files

| File | Screen | Scene |
|------|--------|-------|
| `title.md` | Title / start screen | Grand Foyer interior, GM distant silhouette at staircase |
| `gameover.md` | Game Over | GM mask looming close, extreme low-angle POV from floor |
| `win.md` | Victory / escape | Front doors ajar, cold moonlight crack, GM silhouette at far staircase |
