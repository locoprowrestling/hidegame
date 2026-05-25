# Screen Overlay Regeneration — Prompt Cards

5 of 7 screen overlays need to be regenerated. The previous generation combined multiple screen states into single images.

**DO NOT regenerate:**
- `screen-title-text.png` — correct and looks great
- `screen-faction-select-text.png` — correct and looks great

**Regenerate these 5:**
- `screen-loading-text.png` — currently shows "VICTORY!" content
- `screen-gameover-text.png` — currently shows faction select content + "GAME OVER"
- `screen-victory-text.png` — currently shows "OVER" + "VICTORY!" combined
- `screen-survived-text.png` — currently shows "LOADING..." + "YOU SURVIVED!"
- `screen-found-text.png` — currently shows mixed content + "YOU WERE FOUND!"

## Required format for ALL screen overlays

- **Size:** 471×238 px (letterbox aspect ~2:1, displayed at 256×129 centered on 256×256 canvas)
- **Style:** Pixel art, SNES-era, chunky pixels, limited palette, flat colors, hard edges
- **Each image:** ONE screen state only — do not combine multiple states
- **Text:** Baked into the pixel art as large chunky pixel font — NOT as regular typography
- **Color palette:** Dark backgrounds (black, very dark gray, dark red, etc.) with bright accent colors for the main text/focal element

---

### Loading Screen

**Purpose:** Shown briefly while game assets load before the title screen appears.
**Size:** 471×238 px
**Output path:** `Assets/screens/screen-loading-text.png`

**Prompt:**
```
Single pixel art loading screen for a retro pro wrestling video game, SNES-era style. Landscape format, 471x238 pixels. ONE image only, not a collage or multiple screens combined.

Scene: Dark backstage corridor viewed from a low angle, dim overhead lights, crates stacked on the sides. Center text in large chunky pixel font reads "LOADING..." in bright yellow-white. Small animated-looking pixel dots after the text. Dark and atmospheric, stage light glow from above. Limited color palette: black, dark gray, dim yellow-white. Chunky pixel art style, hard edges, no gradients, no realistic rendering.

This is a SINGLE standalone screen. Do not include any other screen states, titles, or game over content.
```

**AVOID:**
- "VICTORY", "GAME OVER", "YOU SURVIVED", or any other screen state text
- Multiple screens combined into one image
- Gradients or realistic lighting
- Text rendered in a modern font — must be chunky pixel-art letterforms

**NOTES:** Letterboxed to ~256×129 when drawn on 256×256 canvas. Keep focal text and important elements in the center 80% of the image.

---

### Game Over Screen

**Purpose:** Shown when the player is caught by an enemy.
**Size:** 471×238 px
**Output path:** `Assets/screens/screen-gameover-text.png`

**Prompt:**
```
Single pixel art game over screen for a retro pro wrestling video game, SNES-era style. Landscape format, 471x238 pixels. ONE image only, not a collage or multiple screens combined.

Scene: Dark red-lit wrestling ring viewed from above at a dramatic angle, spotlights illuminating the ring. Center foreground: large chunky pixel text "GAME OVER" in deep red with a dark shadow/outline. The ring ropes and mat are visible in the dark background. Atmosphere: tense, dramatic, dark. Color palette: black, dark red, blood red, dim gray. Chunky pixel art, hard edges, limited palette, no gradients.

This is a SINGLE standalone screen. Do not include faction emblems, wrestler selection, "YOU SURVIVED", "VICTORY", or any other screen state.
```

**AVOID:**
- "THE RISING", "THE PILLARS", faction emblems, or character select content
- "YOU SURVIVED", "VICTORY", "YOU WERE FOUND" text
- Multiple screens in one image
- Modern typography — pixel font only

---

### Victory Screen

**Purpose:** Shown when the player survives the full round with ALL allies saved.
**Size:** 471×238 px
**Output path:** `Assets/screens/screen-victory-text.png`

**Prompt:**
```
Single pixel art victory screen for a retro pro wrestling video game, SNES-era style. Landscape format, 471x238 pixels. ONE image only, not a collage.

Scene: Celebration scene — wrestling ring showered in golden confetti pixels, spotlights blazing. Center text in large chunky pixel font: "VICTORY!" in bright gold/yellow with a black outline. Small pixel star/sparkle shapes scattered around the text. Background shows a packed arena with pixel crowd. Triumphant, celebratory, bright. Color palette: black, dark gold, bright yellow, white sparkles, orange. Chunky SNES pixel art, hard edges, no gradients.

This is a SINGLE standalone screen showing only "VICTORY!" — do not include "GAME OVER", "YOU SURVIVED", "LOADING", or any other screen state.
```

**AVOID:**
- "GAME OVER", "OVER", "YOU SURVIVED", "LOADING" text
- Two halves with different content
- Gradients, blur, realistic rendering

---

### Survived Screen

**Purpose:** Shown when the player survives but did NOT save all allies.
**Size:** 471×238 px
**Output path:** `Assets/screens/screen-survived-text.png`

**Prompt:**
```
Single pixel art "you survived" screen for a retro pro wrestling video game, SNES-era style. Landscape format, 471x238 pixels. ONE image only, not a collage.

Scene: Backstage locker room, dim green emergency lighting. A lone pixel art wrestler silhouette catches their breath near lockers. Center text in large chunky pixel font: "YOU SURVIVED!" in bright green with dark outline. Atmosphere: relieved but not triumphant — tense, exhausted. Color palette: black, dark green, dim teal, gray. Chunky SNES pixel art, hard edges, limited palette, no gradients.

This is a SINGLE standalone screen. Do not include "LOADING", "VICTORY", "GAME OVER", "YOU WERE FOUND", or any other text from other screen states.
```

**AVOID:**
- "LOADING..." text
- "VICTORY!", "GAME OVER", or other screen state text
- Multiple screens stacked or side-by-side
- Modern fonts — pixel letterforms only

---

### You Were Found Screen

**Purpose:** Shown when the player is caught with allies still alive (variant of game over).
**Size:** 471×238 px
**Output path:** `Assets/screens/screen-found-text.png`

**Prompt:**
```
Single pixel art "you were found" screen for a retro pro wrestling video game, SNES-era style. Landscape format, 471x238 pixels. ONE image only, not a collage.

Scene: Dark backstage room, two pixel art security guard silhouettes with flashlight beams converging on center. Dramatic red spotlight effect. Center text in large chunky pixel font: "YOU WERE FOUND!" in bright red with dark outline. Flashlight beams in white/yellow pixel rays. Atmosphere: caught, panicked. Color palette: black, dark red, red, white beam accents. Chunky SNES pixel art, hard edges, no gradients.

This is a SINGLE standalone screen. Do not include "LOADING", "VICTORY", "YOU SURVIVED", "GAME OVER", or content from any other screen state.
```

**AVOID:**
- Content from other screen states mixed in
- "LOADING", "VICTORY", "GAME OVER", "YOU SURVIVED" text
- Stacked or side-by-side multiple screens
- Gradients or blur

---

## Delivery checklist

After generating all 5, verify each file before replacing:
- [ ] `screen-loading-text.png` — shows ONLY "LOADING..." scene, dark backstage
- [ ] `screen-gameover-text.png` — shows ONLY "GAME OVER", dark red ring
- [ ] `screen-victory-text.png` — shows ONLY "VICTORY!", golden confetti
- [ ] `screen-survived-text.png` — shows ONLY "YOU SURVIVED!", green locker room
- [ ] `screen-found-text.png` — shows ONLY "YOU WERE FOUND!", flashlight beams

Replace files at `Assets/screens/` and redeploy. No code changes needed.
