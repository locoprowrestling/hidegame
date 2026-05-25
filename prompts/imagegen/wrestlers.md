# Wrestler Sprites — Prompt Cards

All prompts use the anchor sentence from `style-guide.md`.

> **How to use:** For every named character card, attach the listed reference images as image inputs *before* sending the prompt. The prompt text alone is not enough — the model must see the actual character to match it.

> **Note on faction colors:** The style guide palette table lists faction colors, but the actual characters do not wear faction uniforms. Each character has their own personal costume colors documented below. Do not override costume descriptions with generic faction palette.

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
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a pro wrestler character, facing downward (toward viewer), idle standing pose, 32x32 pixels, chunky pixel-art silhouette, hard pixel edges, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:** No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.

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

**NOTES:** Grid is 3 columns × 4 rows. Each cell is 32×32 with 2px padding. Total sheet: (32×3)+(2×2) = 100px wide, (32×4)+(3×2) = 134px tall.

**AVOID:** No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.

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

**NOTES:** Silhouette should be noticeably smaller/lower than the idle pose to signal hiding state clearly at small sizes.

**AVOID:** No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.

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

**NOTES:** X-eyes must be readable at 32×32 — use 2-pixel-wide X marks.

**AVOID:** No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.

---

## Named Wrestler Cards — The Rising

---

### Zeak Gallent (The Rising)

**Purpose:** Idle top-down sprite for Zeak Gallent.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**ATTACH THESE REFERENCE IMAGES:**
- `Assets/players-web/tas-zeak-gallent.png` — primary character reference
- `Assets/players-web/spritesheets/zeak.png` — in-game sprite reference
- `Assets/logos-web/logo-zeak.png` — logo/style reference

**What Zeak actually looks like (from reference):**
- Tall, lean but muscular build
- Large dark full beard
- Black hood pulled up, part of a sleeveless black hooded top
- Exposed midsection / abs visible
- Dark crimson/maroon patterned shorts over black tights
- Dark crimson/maroon fingerless gloves / wrist wraps
- Black boots
- Dominant colors: black, dark crimson/maroon

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Match the character in the attached reference image exactly. Top-down view of Zeak Gallent: tall lean wrestler, black hood up, large dark beard, sleeveless black hooded top with exposed midsection, dark crimson-maroon patterned shorts over black tights, dark crimson-maroon fingerless gloves, black boots. Facing downward, idle standing pose, 32x32 pixels, hard pixel edges, isolated on transparent background. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:** No generic wrestler. No blue/yellow — Zeak's costume is black and dark crimson/maroon. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.

---

### Erza (The Rising)

**Purpose:** Idle top-down sprite for Erza.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**ATTACH THESE REFERENCE IMAGES:**
- `Assets/players-web/tas-erza.png` — primary character reference
- `Assets/players-web/spritesheets/erza.png` — in-game sprite reference

**What Erza actually looks like (from reference):**
- Female wrestler, medium athletic build
- Long straight black hair hanging past shoulders
- Black crop top / sports bra
- Black shorts
- Fishnet stockings on thighs
- Black knee pads
- Black arm wraps / elbow-length gloves
- Pink accent trim on belt buckle and boot trim
- Dominant colors: black with pink accents

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Match the character in the attached reference image exactly. Top-down view of Erza: female wrestler, long straight black hair visible from above, black crop top, black shorts, fishnet thighs, black knee pads, black arm wraps, pink accent trim on belt and boots. Facing downward, idle standing pose, 32x32 pixels, hard pixel edges, isolated on transparent background. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:** No generic female wrestler. No blue/yellow — Erza's costume is black with pink accents. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.

---

### Johnny Crash (The Rising)

**Purpose:** Idle top-down sprite for Johnny Crash.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**ATTACH THESE REFERENCE IMAGES:**
- `Assets/players-web/tas-johnny-crash.png` — primary character reference
- `Assets/players-web/spritesheets/crash.png` — in-game sprite reference

**What Johnny Crash actually looks like (from reference):**
- Very large, heavyset / massively built body
- Short bright yellow/blonde mohawk
- Sunglasses
- Black sleeveless tank top with skull graphic ("The Rising" text and skull)
- Black trunks with red side-panel stripes
- Black boots with red panel accents
- Visible tattoos: star on one arm, "Mom" on other arm
- Dominant colors: black and red, yellow mohawk

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Match the character in the attached reference image exactly. Top-down view of Johnny Crash: massive heavyset wrestler, bright yellow mohawk visible from above, black sleeveless tank top, black trunks with red side stripes, black boots with red panels. Facing downward, idle standing pose, 32x32 pixels, hard pixel edges, isolated on transparent background. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:** No slim or average build — Johnny is massive and heavyset. No blue/yellow costume — his costume is black and red with a yellow mohawk. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.

---

### Carter Cash (The Rising)

**Purpose:** Idle top-down sprite for Carter Cash.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**ATTACH THESE REFERENCE IMAGES:**
- `Assets/players-web/tas-carter-cash.png` — primary character reference
- `Assets/players-web/spritesheets/carter.png` — in-game sprite reference
- `Assets/logos-web/logo-carter-cash.png` — logo/style reference

**What Carter Cash actually looks like (from reference):**
- Lean, medium build
- Long straight dark/black hair
- Open dark navy jacket, shirtless underneath
- Dark navy/black pants with blue flame graphic trim at the ankles
- Black boots
- Dominant colors: dark navy/black, blue flame accents

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Match the character in the attached reference image exactly. Top-down view of Carter Cash: lean wrestler, long straight dark hair visible from above, open dark navy jacket worn over bare chest, dark navy pants with blue flame graphic trim at ankles, black boots. Facing downward, idle standing pose, 32x32 pixels, hard pixel edges, isolated on transparent background. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:** No generic jacket wrestler. No bright blue/yellow — Carter's palette is dark navy/black with blue flame accents. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.

---

## Named Wrestler Cards — The Pillars

---

### JT Staten (The Pillars)

**Purpose:** Idle top-down sprite for JT Staten.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**ATTACH THESE REFERENCE IMAGES:**
- `Assets/players-web/tas-jt-staten.png` — primary character reference
- `Assets/players-web/spritesheets/jt.png` — in-game sprite reference
- `Assets/logos-web/logo-jt-staten.png` — logo/style reference

**What JT Staten actually looks like (from reference):**
- Heavy-set, powerfully built, authoritative posture
- Short dark hair, darker skin tone
- White long-sleeve dress shirt, buttoned to the collar
- Dark charcoal/grey waistcoat (vest) over the shirt
- Black dress trousers
- Black dress boots/shoes
- Arms crossed — looks like a manager or authority figure, not a traditional ring gear wrestler
- Dominant colors: white, charcoal grey, black

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Match the character in the attached reference image exactly. Top-down view of JT Staten: heavy-set wrestler dressed in formal authority figure attire — white long-sleeve dress shirt, dark charcoal grey waistcoat/vest, black dress trousers, black dress shoes. Short dark hair visible from above, arms-crossed authoritative stance. Facing downward, idle standing pose, 32x32 pixels, hard pixel edges, isolated on transparent background. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:** No ring gear or trunks — JT wears formal business attire. No purple/gold — his costume is white, charcoal, and black. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.

---

### Cody Devine (The Pillars)

**Purpose:** Idle top-down sprite for Cody Devine.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**ATTACH THESE REFERENCE IMAGES:**
- `Assets/players-web/tas-cody-devine.png` — primary character reference
- `Assets/players-web/spritesheets/cody.png` — in-game sprite reference
- `Assets/logos-web/logo-cody-devine.png` — logo/style reference

**What Cody Devine actually looks like (from reference):**
- Stocky, powerfully muscular build
- Short dark brown hair with a green headband
- Full dark beard / facial hair
- Shirtless
- Black wrist wraps / arm bands
- Black and green diagonal-striped trunks/pants — bold diagonal stripe bands
- Black lace-up boots
- Dominant colors: black and green diagonal stripes

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Match the character in the attached reference image exactly. Top-down view of Cody Devine: stocky muscular wrestler, shirtless, short dark hair with green headband visible from above, full beard, black wrist wraps, black and bright green diagonal-striped trunks with bold diagonal stripe pattern, black lace-up boots. Facing downward, idle standing pose, 32x32 pixels, hard pixel edges, isolated on transparent background. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:** No purple/gold — Cody's costume is black and green diagonal stripes. No shirt — Cody is shirtless. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.

---

### Nicky Hyde (The Pillars)

**Purpose:** Idle top-down sprite for Nicky Hyde.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**ATTACH THESE REFERENCE IMAGES:**
- `Assets/players-web/tas-nicky-hyde.png` — primary character reference
- `Assets/players-web/spritesheets/nicky.png` — in-game sprite reference
- `Assets/logos-web/logo-nicky-hyde.png` — logo/style reference

**What Nicky Hyde actually looks like (from reference):**
- Medium athletic build
- Short light brown/sandy hair
- White theatrical comedy/drama mask covering the face — smooth, slightly smiling expression
- Ornate royal blue brocade long coat (floor-length or knee-length) with gold lace trim and fringe detail
- Blue trunks/briefs
- Blue knee pads
- Black boots
- Very theatrical, showman character
- Dominant colors: royal blue brocade, gold trim, white mask

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Match the character in the attached reference image exactly. Top-down view of Nicky Hyde: theatrical wrestler wearing a smooth white comedy/drama mask, ornate royal blue brocade long coat with gold lace trim and fringe, blue trunks, blue knee pads, black boots. Short light hair visible at edges of mask from above. Facing downward, arms-wide theatrical idle pose, 32x32 pixels, hard pixel edges, isolated on transparent background. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:** No plain blue outfit — the coat is specifically ornate brocade fabric with gold trim. The mask is the most distinctive feature; it must be readable even at 32×32. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.

---

### Franky Gonzales (The Pillars)

**Purpose:** Idle top-down sprite for Franky Gonzales.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**ATTACH THESE REFERENCE IMAGES:**
- `Assets/players-web/tas-franky-gonzales.png` — primary character reference
- `Assets/players-web/spritesheets/franky.png` — in-game sprite reference
- `Assets/logos-web/logo-franky.png` — logo/style reference

**What Franky Gonzales actually looks like (from reference):**
- Medium lean build
- Dark skin tone, short dark hair, thin goatee
- Black sleeveless tank top with "PRETTY BOY" text on front
- Black shorts/trunks with distressed/torn look
- Black pants with blue flame graphic on one leg
- Black boots
- Relaxed, vain/cocky pose (holding something near face — phone or mirror)
- Dominant colors: black dominant, blue flame accent on one leg

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Match the character in the attached reference image exactly. Top-down view of Franky Gonzales: lean wrestler with dark skin, short dark hair, thin goatee visible from above, black sleeveless tank top, black distressed shorts, black pants with blue flame graphic on one leg, black boots. Facing downward, relaxed cocky idle pose, 32x32 pixels, hard pixel edges, isolated on transparent background. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:** No purple/gold — Franky's costume is black with a blue flame accent. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.

---

## Neutral Characters

---

### Referee

**Purpose:** Neutral NPC — referee who patrols the venue.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a pro wrestling referee character, facing downward (idle), 32x32 pixels. Black and white vertically striped shirt, dark trousers, short hair, alert authoritative stance. Chunky pixel-art style, hard pixel edges, flat colors only, no faction colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:** No faction colors (no blue, yellow, purple, gold, red, green). No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.

---

### Security Guard

**Purpose:** Neutral NPC — security guard who patrols the venue.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a security guard character, facing downward (idle), 32x32 pixels. Dark navy security uniform, short hair, alert patrol stance, utility belt or badge detail. Chunky pixel-art style, hard pixel edges, flat colors only, no faction colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no side-scrolling perspective.
```

**AVOID:** No faction colors. No referee stripes. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
