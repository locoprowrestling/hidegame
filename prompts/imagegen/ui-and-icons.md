# UI and Icons — Prompt Cards

All pixel-art, no gradients, web-game readable. All prompts use the anchor sentence from `style-guide.md`.

---

### Mini-Map Outer Frame

**Purpose:** Decorative outer frame for the mini-map HUD element.
**Size:** 64×64 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Mini-map outer frame, square pixel-art border design, dark navy with light pixel highlight corners, inner area transparent (empty), 64x64 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no rounded corners, no glossy effects.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No rounded corners
- No glossy effects

**NOTES:** Output path: `Assets/ui/ui-minimap-frame.png`. Inner transparent area should be approximately 48×48 — the grid tiles render inside it.

---

### Mini-Map Grid Cell — Active State

**Purpose:** Individual 4×4 grid cell tile for the mini-map, active/visible state.
**Size:** 16×16 px
**Transparency:** No (semi-opaque fill)
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text. Mini-map grid cell tile, active/visited state, dark navy solid fill with 1px lighter blue border, 16x16 pixels, hard pixel edges, flat colors, solid opaque background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no glossy effects.
```

**AVOID:**
- No gradients
- No blur
- No glossy effects
- No text

**NOTES:** Output path: `Assets/ui/ui-minimap-cell-active.png`. This card has `Transparency: No` — the cell tile has a solid dark fill. Do not request a transparent background; the fill color is part of the asset.

---

### Mini-Map Grid Cell — Inactive State

**Purpose:** Individual 4×4 grid cell tile for the mini-map, unvisited/inactive state.
**Size:** 16×16 px
**Transparency:** No
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text. Mini-map grid cell tile, inactive/unvisited state, very dark navy solid fill nearly black with barely visible 1px dark border, 16x16 pixels, hard pixel edges, flat colors, solid opaque background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no glossy effects.
```

**AVOID:**
- No gradients
- No blur
- No glossy effects
- No text

**NOTES:** Output path: `Assets/ui/ui-minimap-cell-inactive.png`. Should be much darker than active state. This card has `Transparency: No` — the cell tile has a solid dark fill. Do not request a transparent background; the fill color is part of the asset.

---

### Player Dot — Rising Faction

**Purpose:** Player position dot on mini-map, The Rising faction color.
**Size:** 16×16 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tiny mini-map player dot, solid bright blue circle, 16x16 pixels, simple filled circle shape with 1px dark outline for contrast, hard pixel edges, isolated on transparent background, PNG-ready. No gradients, no blur, no anti-aliasing, no text.
```

**AVOID:**
- No gradients
- No blur or glow
- No anti-aliasing
- No text

**NOTES:** Output path: `Assets/ui/ui-dot-player-rising.png`.

---

### Ally Dot — Rising Faction

**Purpose:** Ally position dot on mini-map, lighter Rising faction color.
**Size:** 16×16 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tiny mini-map ally dot, light sky blue circle (lighter than player dot), 16x16 pixels, simple filled circle shape with 1px dark outline, hard pixel edges, isolated on transparent background, PNG-ready. No gradients, no blur, no anti-aliasing, no text.
```

**AVOID:**
- No gradients
- No blur or glow
- No anti-aliasing
- No text

**NOTES:** Output path: `Assets/ui/ui-dot-ally-rising.png`. Must be visibly lighter than the player dot.

---

### Player Dot — Pillars Faction

**Purpose:** Player position dot on mini-map, The Pillars faction color.
**Size:** 16×16 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tiny mini-map player dot, solid deep purple circle, 16x16 pixels, simple filled circle shape with 1px dark outline, hard pixel edges, isolated on transparent background, PNG-ready. No gradients, no blur, no anti-aliasing, no text.
```

**AVOID:**
- No gradients
- No blur or glow
- No anti-aliasing
- No text

**NOTES:** Output path: `Assets/ui/ui-dot-player-pillars.png`.

---

### Ally Dot — Pillars Faction

**Purpose:** Ally position dot on mini-map, lighter Pillars faction color.
**Size:** 16×16 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tiny mini-map ally dot, medium purple circle (lighter than deep purple player dot), 16x16 pixels, simple filled circle shape with 1px dark outline, hard pixel edges, isolated on transparent background, PNG-ready. No gradients, no blur, no anti-aliasing, no text.
```

**AVOID:**
- No gradients
- No blur or glow
- No anti-aliasing
- No text

**NOTES:** Output path: `Assets/ui/ui-dot-ally-pillars.png`.

---

### Enemy Dot (Red)

**Purpose:** Enemy/hostile wrestler dot on mini-map.
**Size:** 16×16 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tiny mini-map enemy dot, solid red circle, 16x16 pixels, simple filled circle shape with 1px dark outline, hard pixel edges, isolated on transparent background, PNG-ready. No gradients, no blur, no anti-aliasing, no text.
```

**AVOID:**
- No gradients
- No blur or glow
- No anti-aliasing
- No text

**NOTES:** Output path: `Assets/ui/ui-dot-enemy.png`.

---

### Hidden State Icon

**Purpose:** Icon shown when a wrestler is successfully hidden; used on HUD and over character.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Pixel-art padlock icon indicating hidden state, dark navy color, bold chunky design readable at small size, 32x32 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no glossy effects.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No glossy effects

**NOTES:** Output path: `Assets/ui/ui-icon-hidden.png`. Padlock must be clearly recognizable at 32×32.

---

### Timer Icon

**Purpose:** Clock or timer icon for the HUD countdown display.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Pixel-art clock or hourglass icon for a game timer, white or light gray, bold chunky design readable at small size, 32x32 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no glossy effects.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No glossy effects

**NOTES:** Output path: `Assets/ui/ui-icon-timer.png`. Generate both clock and hourglass variants — append "clock face variant" or "hourglass variant" to the prompt.

---

### Ally Count Icon

**Purpose:** Icon representing number of remaining allied wrestlers; used in HUD.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Pixel-art icon of two small wrestler silhouettes side by side, representing an ally count, white or light gray, bold and readable at small size, 32x32 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no glossy effects.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No glossy effects

**NOTES:** Output path: `Assets/ui/ui-icon-ally-count.png`. Two silhouettes side by side, extremely simplified at 32×32.

---

### Game Over Badge

**Purpose:** Game over screen badge graphic, used on the game over overlay.
**Size:** 128×128 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Pixel-art badge or shield design for a game over screen, dark red and black color scheme, bold chunky design, ominous feel, 128x128 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no glossy effects.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No glossy effects

**NOTES:** Output path: `Assets/ui/ui-badge-gameover.png`. Deliberately ominous — no bright colors.

---

### Victory Badge

**Purpose:** Victory screen badge graphic.
**Size:** 128×128 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Pixel-art trophy or star badge design for a victory screen, bright gold and white color scheme, celebratory feel, 128x128 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no glossy effects.
```

**AVOID:**
- No gradients
- No realistic lighting or glow
- No blur
- No text
- No glossy effects

**NOTES:** Output path: `Assets/ui/ui-badge-victory.png`. Gold and white — celebratory contrast to game over badge.

---

### Start Button — Idle State

**Purpose:** Start/play button for the title screen, idle (unselected) state.
**Size:** 128×48 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Pixel-art rectangular button frame for a game start button, idle state, dark navy blue with lighter blue 2px border, chunky design, 128x48 pixels, hard pixel edges, flat colors, inner area transparent (for text overlay), isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no glossy effects, no rounded corners.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text (text overlaid separately in game)
- No glossy effects
- No rounded corners

**NOTES:** Output path: `Assets/ui/ui-button-start-idle.png`. Inner area is transparent — game engine overlays button text.

---

### Start Button — Hover State

**Purpose:** Start/play button, hover/selected state.
**Size:** 128×48 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Pixel-art rectangular button frame for a game start button, hover/selected state, bright electric yellow with dark 2px border, chunky design, 128x48 pixels, hard pixel edges, flat colors, inner area transparent, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no glossy effects, no rounded corners.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No glossy effects
- No rounded corners

**NOTES:** Output path: `Assets/ui/ui-button-start-hover.png`. Yellow border signals selection.

---

### Faction Select Frame

**Purpose:** Frame/panel used on the faction selection screen to highlight a faction.
**Size:** 160×200 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Pixel-art selection frame panel for a faction select screen, tall rectangle, dark navy with 3px pixel border, subtle corner ornament pixels, inner area transparent, 160x200 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no glossy effects.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No glossy effects

**NOTES:** Output path: `Assets/ui/ui-frame-faction-select.png`. Generate two variants: unselected (dark navy border) and selected (bright border — append "selected state, bright blue border highlight" to prompt). Save selected as `ui-frame-faction-select-active.png`.

---

### Character Select Frame

**Purpose:** Frame/panel used on the character selection screen around each wrestler portrait.
**Size:** 64×80 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Pixel-art character portrait frame, compact rectangle, dark navy with 2px pixel border, corner pixel ornaments, inner area transparent for character image, 64x80 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no glossy effects.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No glossy effects

**NOTES:** Output path: `Assets/ui/ui-frame-char-select.png`. Two variants: unselected and selected (append "selected state, bright yellow or gold border"). Save selected as `ui-frame-char-select-active.png`.
