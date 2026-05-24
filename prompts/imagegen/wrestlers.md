# Wrestler Sprites — Prompt Cards

All prompts use the anchor sentence from `style-guide.md`. Attach the referenced logo or spritesheet as an image input in OpenAI when instructed.

---

## Generic Templates

---

### Generic Idle Pose (Top-Down)

**Purpose:** Base template for any unnamed wrestler; adapt palette and silhouette for named characters.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a pro wrestler character, facing downward (toward viewer), idle standing pose, 32x32 pixels, chunky pixel-art silhouette, bright costume colors, hard pixel edges, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle
- No side-scrolling perspective

**NOTES:** Combine with walking or hiding templates below by using this card to establish the base character design, then request additional poses.

---

### Generic Walking Sprite Sheet (4 Directions × 3 Frames)

**Purpose:** Base walking animation sheet for any wrestler; 4 rows (down, left, right, up), 3 frames per row.
**Size:** Sheet: 96×128 px (3 cols × 32px, 4 rows × 32px with 2px padding)
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Sprite sheet of a top-down pro wrestler walk cycle, arranged in a clean grid on transparent background, uniform cell size 32x32 pixels, consistent scale, 2px padding between cells. 4 rows and 3 columns: row 1 = walking down (toward viewer) frames 1-3, row 2 = walking left frames 1-3, row 3 = walking right frames 1-3, row 4 = walking up (away from viewer) frames 1-3. Chunky pixel-art style, hard pixel edges, flat colors. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle
- No side-scrolling perspective

**NOTES:** Grid is 3 columns × 4 rows. Each cell is 32×32 with 2px padding. Total sheet dimensions: (32×3)+(2×2) = 100px wide, (32×4)+(3×2) = 134px tall.

---

### Generic Hiding Pose

**Purpose:** Crouched/tucked hiding animation frame for any wrestler.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a pro wrestler crouched into a hiding pose, tucked low, 32x32 pixels, chunky pixel-art silhouette clearly distinct from standing pose, hard pixel edges, flat costume colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** The silhouette should be noticeably smaller/lower than the idle pose to signal hiding state clearly at small sizes.

---

### Generic Caught/Stunned Pose

**Purpose:** Dazed or caught animation frame — X-eyes or stagger indicator.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a pro wrestler in a stunned/caught pose, dazed expression with X-shaped eyes or swirling stars above head, slightly slumped, 32x32 pixels, chunky pixel-art style, hard pixel edges, flat costume colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** X-eyes must be readable at 32×32 — use 2-pixel-wide X marks.

---

## Named Wrestler Cards — The Rising (Blue/Yellow)

---

### Zeak (The Rising)

**Purpose:** Idle top-down sprite for Zeak Gallent, faction: The Rising.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a pro wrestler named Zeak, The Rising faction, facing downward (idle), 32x32 pixels. Costume colors: bright blue and electric yellow. Silhouette: tall and lean build, distinctive spiky or swept-back hair. Chunky pixel-art style, hard pixel edges, flat colors only, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle
- No side-scrolling perspective

**NOTES:**
- Logo reference: `Assets/logos-web/logo-zeak.png` — attach as image input for style matching.
- Spritesheet reference: `Assets/players-web/spritesheets/zeak.png` — attach for character reference.
- TAS reference image: `Assets/players-web/tas-zeak-gallent.png`.
- Faction: The Rising — primary bright blue, secondary electric yellow, accent white.

---

### Erza (The Rising)

**Purpose:** Idle top-down sprite for Erza, faction: The Rising.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a female pro wrestler named Erza, The Rising faction, facing downward (idle), 32x32 pixels. Costume colors: bright blue and electric yellow. Silhouette: medium build, long hair visible from top-down angle, athletic stance. Chunky pixel-art style, hard pixel edges, flat colors only, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle
- No side-scrolling perspective

**NOTES:**
- No dedicated logo file exists for Erza. Base the design on faction palette (bright blue/electric yellow/white) and silhouette description above.
- Spritesheet reference: `Assets/players-web/spritesheets/erza.png` — attach for character reference.
- TAS reference image: `Assets/players-web/tas-erza.png`.
- Faction: The Rising — primary bright blue, secondary electric yellow, accent white.

---

### Johnny Crash (The Rising)

**Purpose:** Idle top-down sprite for Johnny Crash, faction: The Rising.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a male pro wrestler named Johnny Crash, The Rising faction, facing downward (idle), 32x32 pixels. Costume colors: bright blue and electric yellow. Silhouette: stocky or compact muscular build, short hair or buzzcut visible from top, aggressive stance. Chunky pixel-art style, hard pixel edges, flat colors only, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle
- No side-scrolling perspective

**NOTES:**
- No dedicated logo file exists for Johnny Crash. Base the design on faction palette (bright blue/electric yellow/white) and silhouette description above.
- Spritesheet reference: `Assets/players-web/spritesheets/crash.png` — attach for character reference.
- TAS reference image: `Assets/players-web/tas-johnny-crash.png`.
- Faction: The Rising — primary bright blue, secondary electric yellow, accent white.

---

### Carter Cash (The Rising)

**Purpose:** Idle top-down sprite for Carter Cash, faction: The Rising.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a male pro wrestler named Carter Cash, The Rising faction, facing downward (idle), 32x32 pixels. Costume colors: bright blue and electric yellow. Silhouette: tall and broad-shouldered build, slicked-back or side-parted hair visible from top-down angle, confident stance. Chunky pixel-art style, hard pixel edges, flat colors only, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle
- No side-scrolling perspective

**NOTES:**
- Logo reference: `Assets/logos-web/logo-carter-cash.png` — attach as image input for style matching.
- Spritesheet reference: `Assets/players-web/spritesheets/carter.png` — attach for character reference.
- TAS reference image: `Assets/players-web/tas-carter-cash.png`.
- Faction: The Rising — primary bright blue, secondary electric yellow, accent white.

---

## Named Wrestler Cards — The Pillars (Purple/Gold)

---

### JT Staten (The Pillars)

**Purpose:** Idle top-down sprite for JT Staten, faction: The Pillars.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a male pro wrestler named JT Staten, The Pillars faction, facing downward (idle), 32x32 pixels. Costume colors: deep purple and gold. Silhouette: tall regal build, short groomed hair or bald head visible from top-down angle, authoritative stance. Chunky pixel-art style, hard pixel edges, flat colors only, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle
- No side-scrolling perspective

**NOTES:**
- Logo reference: `Assets/logos-web/logo-jt-staten.png` — attach as image input for style matching.
- Spritesheet reference: `Assets/players-web/spritesheets/jt.png` — attach for character reference.
- TAS reference image: `Assets/players-web/tas-jt-staten.png`.
- Faction: The Pillars — primary deep purple, secondary gold, accent black.

---

### Cody Devine (The Pillars)

**Purpose:** Idle top-down sprite for Cody Devine, faction: The Pillars.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a male pro wrestler named Cody Devine, The Pillars faction, facing downward (idle), 32x32 pixels. Costume colors: deep purple and gold. Silhouette: lean athletic build, distinctive flowing or styled hair visible from top-down angle, cocky stance with hands on hips. Chunky pixel-art style, hard pixel edges, flat colors only, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle
- No side-scrolling perspective

**NOTES:**
- Logo reference: `Assets/logos-web/logo-cody-devine.png` — attach as image input for style matching.
- Spritesheet reference: `Assets/players-web/spritesheets/cody.png` — attach for character reference.
- TAS reference image: `Assets/players-web/tas-cody-devine.png`.
- Faction: The Pillars — primary deep purple, secondary gold, accent black.

---

### Nicky Hyde (The Pillars)

**Purpose:** Idle top-down sprite for Nicky Hyde, faction: The Pillars.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a male pro wrestler named Nicky Hyde, The Pillars faction, facing downward (idle), 32x32 pixels. Costume colors: deep purple and gold. Silhouette: medium build, wild or unkempt hair visible from top-down angle, twitchy aggressive stance. Chunky pixel-art style, hard pixel edges, flat colors only, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle
- No side-scrolling perspective

**NOTES:**
- Logo reference: `Assets/logos-web/logo-nicky-hyde.png` — attach as image input for style matching.
- Spritesheet reference: `Assets/players-web/spritesheets/nicky.png` — attach for character reference.
- TAS reference image: `Assets/players-web/tas-nicky-hyde.png`.
- Faction: The Pillars — primary deep purple, secondary gold, accent black.

---

### Franky (The Pillars)

**Purpose:** Idle top-down sprite for Franky Gonzales, faction: The Pillars.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a male pro wrestler named Franky, The Pillars faction, facing downward (idle), 32x32 pixels. Costume colors: deep purple and gold. Silhouette: heavyset powerful build, slicked-back dark hair visible from top-down angle, intimidating wide-legged stance. Chunky pixel-art style, hard pixel edges, flat colors only, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle
- No side-scrolling perspective

**NOTES:**
- Logo reference: `Assets/logos-web/logo-franky.png` — attach as image input for style matching.
- Spritesheet reference: `Assets/players-web/spritesheets/franky.png` — attach for character reference.
- TAS reference image: `Assets/players-web/tas-franky-gonzales.png`.
- Faction: The Pillars — primary deep purple, secondary gold, accent black.

---

## Neutral Characters

---

### Referee / Security Guard

**Purpose:** Neutral NPC — referee or security guard who patrols the venue hunting hiding wrestlers.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a referee or security guard character, facing downward (idle), 32x32 pixels. Costume: black and white striped shirt for referee variant OR dark navy security uniform for guard variant. Neutral build, short hair, alert authoritative stance. Chunky pixel-art style, hard pixel edges, flat colors only, no faction colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle
- No side-scrolling perspective
- No faction colors (no blue, yellow, purple, or gold)

**NOTES:** Generate two variants: one with black-and-white striped shirt (referee), one with dark navy uniform (security). Both use the same base prompt — append "referee variant, black and white stripes" or "security guard variant, dark navy uniform" to the end.
