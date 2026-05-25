# Image-Gen Prompt Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 9 Markdown files in `prompts/imagegen/` containing copy-paste-ready OpenAI image generation prompt cards for every visual asset needed in "LoCo Pro Wrestling: Hide."

**Architecture:** Each file is a standalone Markdown document with self-contained prompt cards following Option B format (Purpose / Size / Transparency / Output path / Prompt code block / AVOID list / NOTES). No code is generated — only Markdown. The style-guide.md is the single source of truth for style rules; all other files reference it but are independently usable.

**Tech Stack:** Markdown only. No build tools, no dependencies. Target: OpenAI image generation (DALL-E 3 / GPT image gen).

---

## File Map

| File | Responsibility |
|------|---------------|
| `prompts/imagegen/README.md` | Usage guide, asset integration paths, naming conventions |
| `prompts/imagegen/style-guide.md` | Anchor sentence, palette tables, pixel-art constraints, full AVOID list |
| `prompts/imagegen/wrestlers.md` | 8 named wrestler cards + 4 generic pose templates + referee card |
| `prompts/imagegen/factions.md` | Faction emblems, badges, mini-map markers, status markers |
| `prompts/imagegen/tiles-and-environments.md` | 10 room tile set cards |
| `prompts/imagegen/objects-and-hiding-spots.md` | 15 individual object cards + hiding-spot sheet card |
| `prompts/imagegen/ui-and-icons.md` | HUD, mini-map, UI element, badge, and button cards |
| `prompts/imagegen/title-screen.md` | 7 screen states × 2 variants (text + no-text) |
| `prompts/imagegen/sprite-sheet-template.md` | 6 reusable sprite sheet layout templates |

---

## Existing Asset References

Logo files confirmed at `Assets/logos-web/`:
- `logo-zeak.png`, `logo-carter-cash.png`, `logo-jt-staten.png`, `logo-cody-devine.png`, `logo-nicky-hyde.png`, `logo-franky.png`, `logo-the-rising.png`, `logo-the-pillars.png`
- No logo exists for Erza or Johnny Crash

Spritesheets confirmed at `Assets/players-web/spritesheets/`:
- All 16 wrestlers have spritesheets (e.g. `erza.png`, `crash.png`, `zeak.png`, etc.)

TAS reference images at `Assets/players-web/` (e.g. `tas-erza.png`, `tas-zeak-gallent.png`) — useful visual references to note in cards.

---

## Task 1: Create directory and README.md

**Files:**
- Create: `prompts/imagegen/README.md`

- [ ] **Step 1: Create the `prompts/imagegen/` directory**

```bash
mkdir -p "g:/LoCo Pro Wrestling (PC)/hidegame/prompts/imagegen"
```

- [ ] **Step 2: Write `prompts/imagegen/README.md`**

Full content:

````markdown
# LoCo Pro Wrestling: Hide — Image-Gen Prompt Library

Copy-paste-ready prompts for OpenAI image generation (DALL-E 3 / GPT image gen).

---

## Files in This Library

| File | Contents |
|------|----------|
| `style-guide.md` | Master style reference — anchor sentence, palette rules, full AVOID list |
| `wrestlers.md` | Character sprite prompt cards for 8 named wrestlers + pose templates |
| `factions.md` | Faction emblem, badge, and mini-map marker prompt cards |
| `tiles-and-environments.md` | Room tile set prompt cards (10 room types) |
| `objects-and-hiding-spots.md` | Individual object prompt cards (15 objects) + hiding-spot sheet |
| `ui-and-icons.md` | HUD, mini-map frame, icon, badge, and button prompt cards |
| `title-screen.md` | Full-screen art prompt cards (7 screen states, text + no-text variants) |
| `sprite-sheet-template.md` | Reusable sprite sheet layout template prompt cards |

---

## How to Use a Prompt Card

1. Open the relevant file and find the card for the asset you need.
2. Copy the full text inside the **Prompt** code block.
3. Paste it into OpenAI image generation (DALL-E 3 or GPT image gen).
4. If the card lists a logo or spritesheet under **NOTES**, attach that file as an image input before generating.
5. Download the result and save it to the **Output path** listed on the card.

---

## Requesting Transparent Backgrounds

Every card that needs transparency already includes this phrase in the prompt:

> `transparent background, PNG-ready, isolated asset`

If you add a new prompt manually, include that exact phrase.

---

## Requesting Sprite Sheets

Cards that produce sprite sheets include:

> `arranged in a clean grid on a transparent background, uniform cell size, consistent scale, 2px padding between cells`

---

## Keeping Style Consistent

Every prompt already begins with the **anchor sentence** from `style-guide.md`:

> `Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background.`

If you write a new prompt from scratch, prepend that exact sentence.

---

## Text in Images

**Omit text from all prompts unless the specific card calls for it.** The title-screen cards have explicit text-variant and no-text-variant versions. All other assets are text-free.

---

## Asset Integration Guide

Save generated files to these paths:

| Asset type | Save to |
|------------|---------|
| Wrestler sprites | `Assets/sprites/wrestlers/` |
| Tiles / environments | `Assets/bg_tiles/hide/` |
| Objects / hiding spots | `Assets/sprites/objects/` |
| UI icons and HUD elements | `Assets/ui/` |
| Title / full-screen art | `Assets/screens/` |

### Naming Conventions

- Wrestler sprites: `[wrestler-name]-idle.png`, `[wrestler-name]-walk-sheet.png`, `[wrestler-name]-hiding.png`, `[wrestler-name]-caught.png`
- Tiles: `[room-type]-tileset.png` (e.g. `locker-room-tileset.png`)
- Objects: `obj-[object-name].png` (e.g. `obj-road-case.png`)
- UI: `ui-[element-name].png` (e.g. `ui-minimap-frame.png`, `ui-timer-icon.png`)
- Screens: `screen-[state]-[variant].png` (e.g. `screen-title-no-text.png`, `screen-gameover-text.png`)
- Faction assets: `faction-[faction]-[type].png` (e.g. `faction-rising-emblem.png`)

---

## Generation Priority (Suggested Order)

1. `style-guide.md` — lock in the style anchor first
2. `factions.md` — establish faction visual language before character work
3. `wrestlers.md` — characters with faction colors locked in
4. `objects-and-hiding-spots.md` — props and hiding spots
5. `tiles-and-environments.md` — room tile sets
6. `ui-and-icons.md` — HUD and mini-map elements
7. `title-screen.md` — full-screen art last, when visual language is proven
````

- [ ] **Step 3: Verify the file exists**

```
ls "g:/LoCo Pro Wrestling (PC)/hidegame/prompts/imagegen/README.md"
```

Expected: file listed with nonzero size.

---

## Task 2: Write style-guide.md

**Files:**
- Create: `prompts/imagegen/style-guide.md`

- [ ] **Step 1: Write `prompts/imagegen/style-guide.md`**

Full content:

````markdown
# Style Guide — LoCo Pro Wrestling: Hide

Master style reference. **Not a paste-ready prompt.** All other files in this library draw from this document. When in doubt, come here first.

---

## Anchor Sentence

Prepend this to any prompt for maximum style consistency:

```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background.
```

---

## Palette Rules

| Faction / Context | Primary | Secondary | Accent | Neutral |
|-------------------|---------|-----------|--------|---------|
| The Rising | Bright blue (#2563EB approx) | Electric yellow (#FACC15 approx) | White | Light gray |
| The Pillars | Deep purple (#6B21A8 approx) | Gold (#D97706 approx) | Black | Dark gray |
| Environment | Warm tan / wood brown | Cool gray stone | Dark navy shadow | Off-white highlight |

### Rules
- Use **8–16 colors maximum** per sprite.
- Colors must be **flat** — no gradients, no blends, no dithering unless intentional NES-style ordered dithering.
- Faction members always incorporate their faction's primary and secondary colors somewhere in the costume.
- Environment tiles use the environment palette; faction colors only appear on props and banners, not floors or walls.

---

## Pixel-Art Constraints

- **No anti-aliasing** — hard pixel edges only.
- **No sub-pixel detail** — every detail must be readable at native size.
- **Chunky pixels** — features should be visible at 32×32 without zooming in.
- **No blur** of any kind.
- **No glow or bloom effects.**
- **Limited color count** — 8–16 colors per sprite. Full tile sheets may use up to 32.

---

## Top-Down Perspective Rules

- **Slight overhead angle** — not isometric, not side-scrolling, not full top-down bird's eye.
- **Default idle direction:** character faces downward (toward the camera).
- **Implied light source:** upper-left.
- **No perspective distortion** on objects — flat projection.
- **No cast shadows** unless they are a single dark pixel offset for readability.

---

## Recommended Asset Sizes

| Asset Type | Size |
|------------|------|
| Character sprites | 32×32 or 48×48 |
| Object sprites | 16×16, 24×24, or 32×32 |
| Tiles | 16×16 |
| Title / full-screen art | 1280×720 |
| UI icons | 32×32 |
| Mini-map frame | 64×64 |
| Faction emblems (small badge) | 32×32 |
| Faction emblems (victory screen) | 128×128 |
| Mini-map faction markers | 8×8 or 16×16 |
| Sprite sheet cells | Consistent to asset size, 2px padding between cells |

---

## Full AVOID List

Use this as a reference when writing new prompts, or as a negative-prompt list for tools that support it.

- No gradients
- No realistic lighting or shadows
- No blur or glow effects
- No modern 3D rendering
- No photorealism
- No anime or manga style
- No side-scrolling perspective
- No isometric angle
- No text unless the card specifically requests it
- No copyrighted symbols or IP references
- No modern glossy UI effects
- No anti-aliasing
- No sub-pixel detail
- No perspective distortion on objects
````

- [ ] **Step 2: Verify the file exists**

```
ls "g:/LoCo Pro Wrestling (PC)/hidegame/prompts/imagegen/style-guide.md"
```

---

## Task 3: Write wrestlers.md

**Files:**
- Create: `prompts/imagegen/wrestlers.md`

- [ ] **Step 1: Write `prompts/imagegen/wrestlers.md`**

Full content:

````markdown
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
````

- [ ] **Step 2: Verify the file exists**

```
ls "g:/LoCo Pro Wrestling (PC)/hidegame/prompts/imagegen/wrestlers.md"
```

---

## Task 4: Write factions.md

**Files:**
- Create: `prompts/imagegen/factions.md`

- [ ] **Step 1: Write `prompts/imagegen/factions.md`**

Full content:

````markdown
# Faction Assets — Prompt Cards

Symbol-only assets. No text, no wordmarks. All prompts use the anchor sentence from `style-guide.md`.

---

### The Rising — Faction Emblem (Symbol Only)

**Purpose:** Main faction symbol for The Rising; used on banners, select screens, and overlays.
**Size:** 128×128 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Faction emblem for a pro wrestling group called The Rising, symbol only, no text or wordmarks. Upward-motion or flame-rise symbol design. Colors: bright blue, electric yellow, white. 128x128 pixels, chunky pixel-art style, hard pixel edges, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no copyrighted symbols.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text or wordmarks
- No copyrighted symbols
- No isometric angle

**NOTES:**
- Logo reference: `Assets/logos-web/logo-the-rising.png` — attach as image input for style matching.
- Faction colors: bright blue (#2563EB approx), electric yellow (#FACC15 approx), white.

---

### The Pillars — Faction Emblem (Symbol Only)

**Purpose:** Main faction symbol for The Pillars; used on banners, select screens, and overlays.
**Size:** 128×128 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Faction emblem for a pro wrestling group called The Pillars, symbol only, no text or wordmarks. Column, crown, or arch motif. Colors: deep purple, gold, black. 128x128 pixels, chunky pixel-art style, hard pixel edges, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no copyrighted symbols.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text or wordmarks
- No copyrighted symbols
- No isometric angle

**NOTES:**
- Logo reference: `Assets/logos-web/logo-the-pillars.png` — attach as image input for style matching.
- Faction colors: deep purple (#6B21A8 approx), gold (#D97706 approx), black.

---

### The Rising — Small Badge Icon (32×32)

**Purpose:** Small faction badge for HUD, character select, and score display.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Small faction badge icon, The Rising pro wrestling faction, upward-motion symbol, colors: bright blue and electric yellow, 32x32 pixels, chunky pixel-art style, hard pixel edges, high contrast, readable at small size, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no copyrighted symbols.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No copyrighted symbols

**NOTES:** Must be readable at 32×32 — keep the symbol very simple, at most 3 colors.

---

### The Pillars — Small Badge Icon (32×32)

**Purpose:** Small faction badge for HUD, character select, and score display.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Small faction badge icon, The Pillars pro wrestling faction, column or arch symbol, colors: deep purple and gold, 32x32 pixels, chunky pixel-art style, hard pixel edges, high contrast, readable at small size, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no copyrighted symbols.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No copyrighted symbols

**NOTES:** Must be readable at 32×32 — keep the symbol very simple, at most 3 colors.

---

### The Rising — Victory Screen Badge (128×128)

**Purpose:** Large badge for the victory/game-over screen when The Rising wins.
**Size:** 128×128 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Large victory badge for The Rising pro wrestling faction, upward-motion or flame symbol, colors: bright blue, electric yellow, white, 128x128 pixels, celebratory pixel-art design, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no copyrighted symbols.
```

**AVOID:**
- No gradients
- No realistic lighting or glow
- No blur
- No anime style
- No text
- No copyrighted symbols

**NOTES:** May include decorative star or burst pixels around the badge for a "victory" feel, as long as they are flat pixel-art style.

---

### The Pillars — Victory Screen Badge (128×128)

**Purpose:** Large badge for the victory/game-over screen when The Pillars win.
**Size:** 128×128 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Large victory badge for The Pillars pro wrestling faction, column or crown symbol, colors: deep purple, gold, black, 128x128 pixels, imposing pixel-art design, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no copyrighted symbols.
```

**AVOID:**
- No gradients
- No realistic lighting or glow
- No blur
- No anime style
- No text
- No copyrighted symbols

**NOTES:** Should feel authoritative and imposing rather than celebratory.

---

### Mini-Map Faction Marker — The Rising

**Purpose:** Tiny dot marker for The Rising wrestlers on the mini-map.
**Size:** 16×16 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tiny mini-map dot marker, faction color bright blue, 16x16 pixels, simple filled circle or diamond shape, hard pixel edges, no outline or 1px dark outline for contrast, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text.
```

**AVOID:**
- No gradients
- No blur or glow
- No anti-aliasing
- No text

**NOTES:** Should be the simplest possible shape. Two variants recommended: filled solid blue circle, and lighter blue circle for ally display.

---

### Mini-Map Faction Marker — The Pillars

**Purpose:** Tiny dot marker for The Pillars wrestlers on the mini-map.
**Size:** 16×16 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tiny mini-map dot marker, faction color deep purple, 16x16 pixels, simple filled circle or diamond shape, hard pixel edges, no outline or 1px dark outline for contrast, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text.
```

**AVOID:**
- No gradients
- No blur or glow
- No anti-aliasing
- No text

**NOTES:** Should be the simplest possible shape. Two variants: filled solid purple circle (enemy), lighter purple circle (ally).

---

### Mini-Map Enemy Dot (Red)

**Purpose:** Red enemy dot for the mini-map — marks hostile wrestlers searching for the player.
**Size:** 16×16 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tiny mini-map dot marker, solid red color, 16x16 pixels, simple filled circle or diamond shape, hard pixel edges, 1px dark outline for contrast, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text.
```

**AVOID:**
- No gradients
- No blur or glow
- No anti-aliasing
- No text

**NOTES:** Red (#DC2626 approx). Should be distinctly different from faction dots at a glance.

---

### "Caught" Status Marker

**Purpose:** Red X or flash indicator shown over a caught wrestler on mini-map or HUD.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Status indicator icon showing a bold red X shape, pixel-art style, 32x32 pixels, hard pixel edges, flat red color (#DC2626), 3-4 pixel stroke width, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no thin lines.
```

**AVOID:**
- No gradients
- No blur or glow
- No thin lines (minimum 3px stroke)
- No text

**NOTES:** Must be instantly readable at 32×32 and smaller. Bold stroke is essential.

---

### "Hidden" Status Marker

**Purpose:** Lock or shadow symbol shown when a wrestler is successfully hidden on mini-map or HUD.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Status indicator icon showing a padlock or shadow silhouette symbol indicating hidden state, pixel-art style, 32x32 pixels, hard pixel edges, dark navy or dark gray color, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text.
```

**AVOID:**
- No gradients
- No blur or glow
- No text

**NOTES:** Dark navy (#1E3A5F approx) or dark gray. Should contrast with both blue and purple faction colors.
````

- [ ] **Step 2: Verify the file exists**

```
ls "g:/LoCo Pro Wrestling (PC)/hidegame/prompts/imagegen/factions.md"
```

---

## Task 5: Write tiles-and-environments.md

**Files:**
- Create: `prompts/imagegen/tiles-and-environments.md`

- [ ] **Step 1: Write `prompts/imagegen/tiles-and-environments.md`**

Full content:

````markdown
# Tiles and Environments — Prompt Cards

Each card covers one room type. The 4×4 grid layout is noted per card (center cells = open/dangerous, edge cells = hiding-rich). All prompts use the anchor sentence from `style-guide.md`. Tile size is 16×16 px.

---

### Wrestling Ring Room — Tile Set

**Purpose:** Floor and wall tiles for the wrestling ring room. Grid position: center (open/dangerous zone).
**Size:** Tile sheet — 10 tiles arranged in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No (solid floor tiles)
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down pro wrestling ring room. 10 tiles in a single row, each 16x16 pixels, solid backgrounds (not transparent). Tiles: canvas floor (red/white), ring rope section (red rope pixel line), corner turnbuckle (red pad), dark arena floor, wall tile (gray concrete), ring apron edge, ring post base, crowd barrier, dark boundary tile, highlight/damage canvas tile. Flat colors, hard pixel edges, chunky pixel-art style, consistent scale. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/wrestling-ring-tileset.png`. Red/white canvas dominates. Dark floor around ring perimeter. Hiding spots are under ring apron (tile 6) and behind barrier (tile 8).

---

### Backstage Hallway — Tile Set

**Purpose:** Floor and wall tiles for the backstage hallway. Grid position: edges (moderate hiding opportunity).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down backstage hallway. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: gray concrete floor, concrete wall, cable bundle on floor, equipment cart wheel, dark shadow corner, door frame tile, electrical box on wall, painted stripe on floor, scuff mark floor tile, recessed ceiling tile. Flat colors, hard pixel edges, chunky pixel-art style. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/backstage-hallway-tileset.png`. Gray concrete dominates. Dim implied lighting from upper-left. Hiding spots: behind curtains (tile 6), behind road cases.

---

### Locker Room — Tile Set

**Purpose:** Floor and wall tiles for the locker room. Grid position: edges (hiding-rich).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down locker room. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: teal metal locker door (closed), teal locker door (open), gray bench top, gray bench leg/side, tile floor (light gray), locker room wall tile, wet floor corner tile, drain tile, coat hook on wall, overhead light tile. Flat colors, hard pixel edges, chunky pixel-art style. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/locker-room-tileset.png`. Teal and gray dominate. Primary hiding spot: inside open lockers (tile 2).

---

### Storage Room — Tile Set

**Purpose:** Floor and wall tiles for the storage room. Grid position: corners (very hiding-rich).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down storage room. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: worn wood floor plank, dusty concrete floor, wooden crate side, stacked crate top, storage trunk lid, shadowed corner tile, cobweb corner tile, storage rack shelf, wall-mounted shelf, dark back wall. Flat colors, hard pixel edges, chunky pixel-art style, brown wood and gray stone palette. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/storage-room-tileset.png`. Warm brown and dusty gray palette. Hiding spots: inside crates (tile 3), behind stacks.

---

### Merch Area — Tile Set

**Purpose:** Floor and wall tiles for the merchandise area. Grid position: edges (moderate hiding).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down merchandise area. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: bright retail floor tile, merchandise table surface, table skirt edge, poster stand base, t-shirt rack base, price tag tile (no readable text), carpet floor, wall display tile, product shelf, entrance mat. Flat colors, hard pixel edges, chunky pixel-art style, bright retail colors. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No readable text on tiles
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/merch-area-tileset.png`. Bright retail colors — avoid drab/dark. Hiding spots: under tables, behind racks.

---

### Entrance Curtain — Tile Set

**Purpose:** Floor and wall tiles for the entrance curtain area. Grid position: edges (hiding-rich due to curtains).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down entrance curtain area. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: black curtain panel, gold curtain trim, black carpet floor, curtain rod section (top-down), spotlight pool on floor (flat circle, no gradient), black wall tile, dramatic arch column base, velvet rope floor tile, curtain fold left, curtain fold right. Flat colors, hard pixel edges, chunky pixel-art style, black and gold palette. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting or spotlight glow
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/entrance-curtain-tileset.png`. Black and gold palette. Hiding spot: behind curtains (tile 1/10).

---

### Seating Aisle — Tile Set

**Purpose:** Floor and wall tiles for the seating aisle. Grid position: edges (moderate hiding).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down stadium seating aisle. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: stadium gray concrete floor, red fold-up seat top, seat row edge, crowd barrier side, pillar cross-section (top-down), stair step tile, aisle stripe tile, under-seat shadow, steel railing segment, emergency light floor marker (flat, no glow). Flat colors, hard pixel edges, chunky pixel-art style. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/seating-aisle-tileset.png`. Stadium gray and red seat colors. Hiding spots: under seats (tile 8), behind pillars (tile 5).

---

### Production Booth — Tile Set

**Purpose:** Floor and wall tiles for the production/tech booth. Grid position: corner (very hiding-rich).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down production booth. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: dark tech gray floor, equipment rack front, monitor screen top-down (dark with flat pixel highlights), cable conduit floor strip, mixing board surface, dark wall panel, server rack vent, raised floor tile, dim indicator light tile (single flat pixel dot), black ceiling tile. Flat colors, hard pixel edges, chunky pixel-art style, dark tech gray palette. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting or screen glow
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/production-booth-tileset.png`. Dark gray dominates. Hiding spots: behind equipment racks (tile 2), behind monitors.

---

### Office — Tile Set

**Purpose:** Floor and wall tiles for the promoter's office. Grid position: corner (hiding-rich).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down office. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: warm carpet floor, wood desk surface, filing cabinet top-down, office chair top-down, bookshelf edge, window (top-down sill), door mat, potted plant base, wall baseboard, framed art on wall (no readable content). Flat colors, hard pixel edges, chunky pixel-art style, warm wood and carpet palette. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No readable text on tiles
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/office-tileset.png`. Warm wood brown and carpet tan palette. Hiding spots: under desks (tile 2), behind filing cabinets (tile 3).

---

### Opera House Interior — Tile Set

**Purpose:** Floor and wall tiles for an ornate opera house interior. Grid position: edges (hiding-rich in alcoves).
**Size:** Tile sheet — 10 tiles in a row, each 16×16 px. Sheet: 160×16 px.
**Transparency:** No
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down ornate opera house interior. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: cream marble floor, gold trim edge tile, ornate column cross-section (top-down), velvet carpet strip, balcony railing segment, alcove shadow tile, chandelier base (top-down flat circle), decorative arch keystone, cream wall panel with gold detail, polished wood balcony floor. Flat colors, hard pixel edges, chunky pixel-art style, ornate cream and gold palette. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting or chandelier glow
- No blur
- No anime style
- No text
- No isometric angle

**NOTES:** Output path: `Assets/bg_tiles/hide/opera-house-tileset.png`. Cream, gold, and velvet red palette. Hiding spots: behind columns (tile 3), in alcoves (tile 6).
````

- [ ] **Step 2: Verify the file exists**

```
ls "g:/LoCo Pro Wrestling (PC)/hidegame/prompts/imagegen/tiles-and-environments.md"
```

---

## Task 6: Write objects-and-hiding-spots.md

**Files:**
- Create: `prompts/imagegen/objects-and-hiding-spots.md`

- [ ] **Step 1: Write `prompts/imagegen/objects-and-hiding-spots.md`**

Full content:

````markdown
# Objects and Hiding Spots — Prompt Cards

Each card produces an isolated top-down asset on a transparent background with a clear collision silhouette. All prompts use the anchor sentence from `style-guide.md`.

---

### Locker

**Purpose:** Upright metal locker — primary hiding spot in the locker room.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a single upright metal locker, teal and gray colors, closed door with visible handle pixel, clear collision silhouette, 32x32 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-locker.png`. Also generate an open-door variant: append "locker door open, dark interior visible" to prompt. Save as `obj-locker-open.png`.

---

### Road Case

**Purpose:** Large wheeled equipment road case — hiding spot in backstage hallway.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a large wheeled road case equipment trunk, dark gray or black with metal corner hardware pixels, lid closed, clear rectangular collision silhouette, 32x32 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-road-case.png`.

---

### Crate

**Purpose:** Wooden storage crate — hiding spot in storage room.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a wooden storage crate, warm brown wood planks with dark pixel gaps, lid visible from above, clear square collision silhouette, 32x32 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-crate.png`.

---

### Curtain

**Purpose:** Heavy hanging curtain panel — hiding spot near entrance and backstage areas.
**Size:** 32×48 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a heavy hanging curtain panel, deep black or dark red fabric with fold detail pixels, viewed from slightly above, tall narrow silhouette, 32x48 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-curtain.png`. Black variant for entrance curtain, dark red variant for opera house — append color to prompt.

---

### Merch Table

**Purpose:** Merchandise display table — hiding spot (under) in merch area.
**Size:** 48×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a folding merchandise table, white tabletop with bright color rectangles suggesting product display, table skirt draped around edges, clear rectangular collision silhouette, 48x32 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no readable text on products, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No readable text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-merch-table.png`.

---

### Folding Chair Stack

**Purpose:** Stack of folding chairs — obstacle and partial hiding spot in aisle/storage.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a stack of folding metal chairs, silver and gray, stacked 4-5 high with visible seat backs, clear tall narrow collision silhouette, 32x32 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-chair-stack.png`.

---

### Ring Apron

**Purpose:** The skirted edge of the wrestling ring — hiding spot (under apron).
**Size:** 48×16 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a wrestling ring apron edge section, red and white canvas with apron skirt hanging down, seen from slight overhead angle, 48x16 pixels, clear horizontal collision silhouette, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-ring-apron.png`. Represents the hiding-spot edge of the ring.

---

### Trash Can

**Purpose:** Large metal trash or recycling can — minor hiding spot and obstacle.
**Size:** 24×24 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a large metal trash can, silver or gray with lid, circular top-down silhouette, 24x24 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-trash-can.png`.

---

### Lighting Rig

**Purpose:** Overhead lighting rig / truss section — top-down obstacle, no hiding.
**Size:** 48×16 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a stage lighting rig truss bar, dark gray metal with pixel fixtures, narrow horizontal beam shape, 48x16 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting or light beams, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting or light beams
- No blur
- No text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-lighting-rig.png`.

---

### Cable Coil

**Purpose:** Coiled stage cable on the floor — obstacle in backstage areas.
**Size:** 24×24 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a coiled stage cable on the floor, black cable in a spiral coil shape, circular outline, 24x24 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-cable-coil.png`.

---

### Poster Stand

**Purpose:** Upright poster display stand — obstacle and partial hiding spot in merch area.
**Size:** 16×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a poster display stand, thin vertical pole on a base plate, small colored rectangle representing a poster from above, 16x32 pixels, hard pixel edges, flat colors, no readable text on poster, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No readable text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-poster-stand.png`.

---

### Trophy Case

**Purpose:** Glass trophy display case — obstacle and decorative element in office or hallway.
**Size:** 32×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a glass trophy case cabinet, dark wood frame with glass top, small gold trophy shapes visible inside, 32x32 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting or reflections, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting or reflections
- No blur
- No text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-trophy-case.png`.

---

### Office Desk

**Purpose:** Large office desk — primary hiding spot in the office room.
**Size:** 48×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a large office desk, warm wood brown surface with flat pixel detail (small screen rectangle, papers), 48x32 pixels, hard pixel edges, flat colors, clear rectangular collision silhouette, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no readable text on papers, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No readable text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-office-desk.png`. Under-desk area is the hiding spot.

---

### Wardrobe Rack

**Purpose:** Rolling clothes/costume rack — hiding spot in backstage/locker areas.
**Size:** 32×16 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a rolling wardrobe/costume rack, metal bar with colorful costume rectangles hanging, two wheels visible, 32x16 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-wardrobe-rack.png`.

---

### Equipment Trunk

**Purpose:** Large travel equipment trunk — hiding spot in storage/backstage.
**Size:** 40×32 px
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Top-down view of a large travel equipment trunk, dark navy or black hard-shell case with metal latches as pixel details, lid closed, 40x32 pixels, hard pixel edges, flat colors, clear rectangular collision silhouette, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle

**NOTES:** Output path: `Assets/sprites/objects/obj-equipment-trunk.png`.

---

## Hiding Spot Sprite Sheet

### All Hiding Spots — Grid Sheet

**Purpose:** All 15 hiding spot objects arranged in one sprite sheet for easy batch import.
**Size:** Sheet: 5 columns × 3 rows, each cell 48×48 px (to accommodate largest object). Sheet: 240×144 px.
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Sprite sheet of hiding spot objects arranged in a clean grid on transparent background, 5 columns by 3 rows, uniform cell size 48x48 pixels, consistent scale, 2px padding between cells. Objects (left to right, top to bottom): locker, road case, crate, curtain, merch table, folding chair stack, ring apron, trash can, lighting rig, cable coil, poster stand, trophy case, office desk, wardrobe rack, equipment trunk. Each object shown as isolated top-down pixel-art asset, hard pixel edges, flat colors. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text labels on sheet
- No isometric angle
- No decorative borders between cells

**NOTES:** Output path: `Assets/sprites/objects/hiding-spots-sheet.png`. Cell order matches the list above. Labels are in this NOTES section only — not in the image.
````

- [ ] **Step 2: Verify the file exists**

```
ls "g:/LoCo Pro Wrestling (PC)/hidegame/prompts/imagegen/objects-and-hiding-spots.md"
```

---

## Task 7: Write ui-and-icons.md

**Files:**
- Create: `prompts/imagegen/ui-and-icons.md`

- [ ] **Step 1: Write `prompts/imagegen/ui-and-icons.md`**

Full content:

````markdown
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
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Mini-map grid cell tile, active/visited state, dark navy fill with 1px lighter blue border, 16x16 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no glossy effects.
```

**AVOID:**
- No gradients
- No blur
- No glossy effects
- No text

**NOTES:** Output path: `Assets/ui/ui-minimap-cell-active.png`.

---

### Mini-Map Grid Cell — Inactive State

**Purpose:** Individual 4×4 grid cell tile for the mini-map, unvisited/inactive state.
**Size:** 16×16 px
**Transparency:** No
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Mini-map grid cell tile, inactive/unvisited state, very dark navy fill nearly black with barely visible 1px dark border, 16x16 pixels, hard pixel edges, flat colors, isolated on transparent background, PNG-ready. No gradients, no realistic lighting, no blur, no anime style, no text, no glossy effects.
```

**AVOID:**
- No gradients
- No blur
- No glossy effects
- No text

**NOTES:** Output path: `Assets/ui/ui-minimap-cell-inactive.png`. Should be much darker than active state.

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
````

- [ ] **Step 2: Verify the file exists**

```
ls "g:/LoCo Pro Wrestling (PC)/hidegame/prompts/imagegen/ui-and-icons.md"
```

---

## Task 8: Write title-screen.md

**Files:**
- Create: `prompts/imagegen/title-screen.md`

- [ ] **Step 1: Write `prompts/imagegen/title-screen.md`**

Full content:

````markdown
# Title Screen and Full-Screen Art — Prompt Cards

All images: 1280×720 px. Each screen state has two variants: **text** (with specified text) and **no-text** (pure background for in-game font overlay). All prompts use the anchor sentence from `style-guide.md`.

---

## Main Title Screen

---

### Main Title Screen — No-Text Variant

**Purpose:** Background illustration for the main title screen; in-game font overlays the title.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Wide 1280x720 pixel-art background illustration for a pro wrestling hide-and-seek game title screen. Top-down view of an indoor wrestling venue at night, two factions (blue and yellow vs deep purple and gold) visually split across the scene, arena lights as flat pixel circles on the floor, chunky pixel-art wrestlers silhouettes hiding behind objects, dramatic but flat color composition. No text, no gradients, no realistic lighting, no blur, no anime style, no copyrighted references, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text or logos
- No anime style
- No copyrighted references
- No isometric angle

**NOTES:** Output path: `Assets/screens/screen-title-no-text.png`. In-game title "LoCo Pro Wrestling: HIDE" is overlaid by the game engine.

---

### Main Title Screen — Text Variant

**Purpose:** Title screen background with "LoCo Pro Wrestling: HIDE" baked into the image.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, transparent background. Wide 1280x720 pixel-art title screen for a pro wrestling hide-and-seek game. Title text "LoCo Pro Wrestling: HIDE" in bold chunky pixel font, centered upper third, bright yellow letters with dark outline on a dramatic top-down wrestling venue background, two factions (blue/yellow vs purple/gold) visually split. No gradients, no realistic lighting, no blur, no anime style, no copyrighted references, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No copyrighted references
- No anime style
- No isometric angle

**NOTES:** Output path: `Assets/screens/screen-title-text.png`. Text must be in a pixel/retro font style, not modern sans-serif.

---

## Faction Select Screen

---

### Faction Select Screen — No-Text Variant

**Purpose:** Background for the faction selection screen.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Wide 1280x720 pixel-art background for a faction selection screen in a pro wrestling game. Screen divided vertically down the center — left half in bright blue and electric yellow for The Rising faction, right half in deep purple and gold for The Pillars faction. Each half features faction emblem symbols (no text), chunky pixel-art border between them. No text, no gradients, no realistic lighting, no blur, no anime style, no copyrighted references.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text or wordmarks
- No anime style
- No copyrighted references

**NOTES:** Output path: `Assets/screens/screen-faction-select-no-text.png`.

---

### Faction Select Screen — Text Variant

**Purpose:** Faction select screen with "CHOOSE YOUR FACTION" heading baked in.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, transparent background. Wide 1280x720 pixel-art faction selection screen for a pro wrestling game. Header text "CHOOSE YOUR FACTION" in bold chunky pixel font, white letters with dark outline, centered at top. Screen split vertically: left = bright blue/yellow with "THE RISING" label below faction symbol, right = deep purple/gold with "THE PILLARS" label below faction symbol. No gradients, no realistic lighting, no blur, no anime style, no copyrighted references.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No copyrighted references

**NOTES:** Output path: `Assets/screens/screen-faction-select-text.png`.

---

## Game Over Screen

---

### Game Over Screen — No-Text Variant

**Purpose:** Background for the game over screen.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Wide 1280x720 pixel-art background for a game over screen in a top-down wrestling game. Dark dramatic scene, deep red and black color scheme, top-down view of a wrestling venue floor with a spotlight circle in the center (flat single color, no gradient), ominous chunky pixel-art atmosphere. No text, no gradients, no realistic lighting, no blur, no anime style, no copyrighted references.
```

**AVOID:**
- No gradients
- No realistic lighting or spotlight glow
- No blur
- No text
- No anime style
- No copyrighted references

**NOTES:** Output path: `Assets/screens/screen-gameover-no-text.png`.

---

### Game Over Screen — Text Variant

**Purpose:** Game over screen with "GAME OVER" text baked in.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, transparent background. Wide 1280x720 pixel-art game over screen. Bold text "GAME OVER" in large chunky pixel font, dark red letters with black outline, centered in the screen. Dark dramatic background in black and deep red, ominous top-down wrestling venue. No gradients, no realistic lighting, no blur, no anime style, no copyrighted references.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No copyrighted references

**NOTES:** Output path: `Assets/screens/screen-gameover-text.png`.

---

## Victory Screen

---

### Victory Screen — No-Text Variant

**Purpose:** Background for the victory screen.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Wide 1280x720 pixel-art background for a victory screen in a top-down wrestling game. Bright celebratory scene, gold and white color scheme, pixel-art confetti stars scattered across the screen (flat shapes), top-down wrestling venue background in a triumphant mood. No text, no gradients, no realistic lighting, no blur, no anime style, no copyrighted references.
```

**AVOID:**
- No gradients
- No realistic lighting or glow
- No blur
- No text
- No anime style
- No copyrighted references

**NOTES:** Output path: `Assets/screens/screen-victory-no-text.png`.

---

### Victory Screen — Text Variant

**Purpose:** Victory screen with "VICTORY!" text baked in.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, transparent background. Wide 1280x720 pixel-art victory screen. Bold text "VICTORY!" in large chunky pixel font, bright gold letters with dark outline, centered and prominent. Bright celebratory background, confetti pixel stars, gold and white color scheme. No gradients, no realistic lighting, no blur, no anime style, no copyrighted references.
```

**AVOID:**
- No gradients
- No realistic lighting or glow
- No blur
- No anime style
- No copyrighted references

**NOTES:** Output path: `Assets/screens/screen-victory-text.png`.

---

## Loading Screen

---

### Loading Screen — No-Text Variant

**Purpose:** Background for the loading screen.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Wide 1280x720 pixel-art background for a game loading screen. Dark top-down wrestling venue interior, minimal detail, mostly dark navy and gray tones, subtle pixel texture. No text, no gradients, no realistic lighting, no blur, no anime style, no copyrighted references.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No anime style
- No copyrighted references

**NOTES:** Output path: `Assets/screens/screen-loading-no-text.png`. Should be simple and fast to read — complex details not needed.

---

### Loading Screen — Text Variant

**Purpose:** Loading screen with "LOADING..." text baked in.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, transparent background. Wide 1280x720 pixel-art loading screen. Text "LOADING..." in chunky pixel font, white letters with dark outline, centered lower third. Dark minimal background in navy and gray. No gradients, no realistic lighting, no blur, no anime style, no copyrighted references.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No copyrighted references

**NOTES:** Output path: `Assets/screens/screen-loading-text.png`.

---

## "You Survived" Screen

---

### You Survived Screen — No-Text Variant

**Purpose:** Background for the "You Survived" end-of-round screen.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Wide 1280x720 pixel-art background for a survival success screen in a top-down wrestling game. Green and white color scheme, relieved/triumphant mood, pixel-art wrestler silhouette emerging from hiding spot, top-down wrestling venue background. No text, no gradients, no realistic lighting, no blur, no anime style, no copyrighted references.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No anime style
- No copyrighted references

**NOTES:** Output path: `Assets/screens/screen-survived-no-text.png`.

---

### You Survived Screen — Text Variant

**Purpose:** "You Survived" screen with text baked in.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, transparent background. Wide 1280x720 pixel-art screen. Bold text "YOU SURVIVED!" in chunky pixel font, bright green letters with dark outline, centered and prominent. Green and white celebratory background, top-down wrestling venue. No gradients, no realistic lighting, no blur, no anime style, no copyrighted references.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No copyrighted references

**NOTES:** Output path: `Assets/screens/screen-survived-text.png`.

---

## "You Were Found" Screen

---

### You Were Found Screen — No-Text Variant

**Purpose:** Background for the "You Were Found" elimination screen.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Wide 1280x720 pixel-art background for an elimination screen in a top-down wrestling game. Red and dark gray color scheme, tense defeated mood, pixel-art wrestler silhouette caught/grabbed from above, top-down wrestling venue, searchlight flat circle on floor. No text, no gradients, no realistic lighting, no blur, no anime style, no copyrighted references.
```

**AVOID:**
- No gradients
- No realistic lighting or spotlight glow
- No blur
- No text
- No anime style
- No copyrighted references

**NOTES:** Output path: `Assets/screens/screen-found-no-text.png`.

---

### You Were Found Screen — Text Variant

**Purpose:** "You Were Found" screen with text baked in.
**Size:** 1280×720 px
**Transparency:** No
**Output path:** `Assets/screens/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, transparent background. Wide 1280x720 pixel-art screen. Bold text "YOU WERE FOUND!" in chunky pixel font, bright red letters with dark outline, centered and prominent. Dark tense background in red and dark gray, top-down wrestling venue. No gradients, no realistic lighting, no blur, no anime style, no copyrighted references.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No anime style
- No copyrighted references

**NOTES:** Output path: `Assets/screens/screen-found-text.png`.
````

- [ ] **Step 2: Verify the file exists**

```
ls "g:/LoCo Pro Wrestling (PC)/hidegame/prompts/imagegen/title-screen.md"
```

---

## Task 9: Write sprite-sheet-template.md

**Files:**
- Create: `prompts/imagegen/sprite-sheet-template.md`

- [ ] **Step 1: Write `prompts/imagegen/sprite-sheet-template.md`**

Full content:

````markdown
# Sprite Sheet Templates — Prompt Cards

Reusable layout templates for sprite sheets. Apply any named character, object set, or tile set by substituting the subject into the prompt. All prompts use the anchor sentence from `style-guide.md`.

### Template Requirements (All Sheets)
- Grid dimensions and cell size specified per template
- Transparent background
- Consistent sprite scale across all cells
- No shadows unless a single dark pixel offset for readability
- No rotated or perspective-mismatched sprites
- Uniform 2px padding between cells
- No decorative borders or backgrounds on individual cells

---

### Template: Character Idle Sheet (1 Row, 4 Directions)

**Purpose:** One idle frame per direction (down, left, right, up) for any character.
**Size:** 4 columns × 1 row, each cell [CHARACTER SIZE] px. Sheet: 4×[SIZE] + 3×2px padding = [WIDTH]×[SIZE] px.
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Sprite sheet of a [CHARACTER DESCRIPTION] idle pose in 4 directions, arranged in a clean grid on transparent background, 4 columns 1 row, uniform cell size [SIZE]x[SIZE] pixels, consistent scale, 2px padding between cells. Column 1: facing down (toward viewer), Column 2: facing left, Column 3: facing right, Column 4: facing up (away from viewer). Chunky pixel-art style, hard pixel edges, flat colors. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle
- No decorative cell backgrounds

**NOTES:** Replace `[CHARACTER DESCRIPTION]` with the wrestler's name and faction (e.g., "Zeak, The Rising faction, bright blue and yellow costume"). Replace `[SIZE]` with 32 or 48 depending on the character. Attach logo or spritesheet reference as image input. Example output path: `Assets/sprites/wrestlers/zeak-idle-sheet.png`.

---

### Template: Character Walk Cycle Sheet (4 Rows × 3 Frames)

**Purpose:** Full walk animation — 4 directions, 3 frames each — for any character.
**Size:** 3 columns × 4 rows, each cell [CHARACTER SIZE] px.
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Sprite sheet of a [CHARACTER DESCRIPTION] walk cycle, arranged in a clean grid on transparent background, 3 columns 4 rows, uniform cell size [SIZE]x[SIZE] pixels, consistent scale, 2px padding between cells. Row 1: walking down frames 1-3, Row 2: walking left frames 1-3, Row 3: walking right frames 1-3, Row 4: walking up frames 1-3. Chunky pixel-art style, hard pixel edges, flat colors, legs and arms clearly animated between frames. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle
- No decorative cell backgrounds

**NOTES:** Replace `[CHARACTER DESCRIPTION]` and `[SIZE]` as above. Example output: `Assets/sprites/wrestlers/zeak-walk-sheet.png`.

---

### Template: Enemy Patrol Sheet (4 Rows × 3 Frames)

**Purpose:** Patrol walk animation for enemy/NPC characters (referee, security guard).
**Size:** 3 columns × 4 rows, each cell 32×32 px.
**Transparency:** Yes
**Output path:** `Assets/sprites/wrestlers/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Sprite sheet of a [ENEMY TYPE, e.g. referee in black and white stripes] patrol walk cycle, arranged in a clean grid on transparent background, 3 columns 4 rows, uniform cell size 32x32 pixels, consistent scale, 2px padding between cells. Row 1: walking down frames 1-3, Row 2: walking left frames 1-3, Row 3: walking right frames 1-3, Row 4: walking up frames 1-3. Chunky pixel-art style, hard pixel edges, flat colors, alert patrol body language. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle
- No decorative cell backgrounds

**NOTES:** Replace `[ENEMY TYPE]` with "referee in black and white stripes" or "security guard in dark navy uniform". Output examples: `Assets/sprites/wrestlers/referee-patrol-sheet.png`, `Assets/sprites/wrestlers/security-patrol-sheet.png`.

---

### Template: Hiding Object Sheet (Grid of All Hiding Spots)

**Purpose:** All hiding spot objects in one sheet for batch import. Reuse when adding new hiding spot objects.
**Size:** 5 columns × 3 rows, each cell 48×48 px. Sheet: ~250×154 px with padding.
**Transparency:** Yes
**Output path:** `Assets/sprites/objects/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Sprite sheet of [LIST OF HIDING OBJECTS] arranged in a clean grid on transparent background, [N] columns by [M] rows, uniform cell size 48x48 pixels, consistent scale, 2px padding between cells. Each object shown as isolated top-down pixel-art asset, hard pixel edges, flat colors. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle, no decorative cell borders.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text labels on sheet
- No isometric angle
- No decorative cell borders

**NOTES:** Replace `[LIST OF HIDING OBJECTS]` with the comma-separated list of objects to include. Replace `[N]` and `[M]` with column and row counts. See `objects-and-hiding-spots.md` for the canonical full-set card. Output: `Assets/sprites/objects/hiding-spots-sheet.png`.

---

### Template: Environmental Tile Sheet (One Room Type)

**Purpose:** All tiles for one room type in a single row sheet. Reuse per room.
**Size:** 10 columns × 1 row, each cell 16×16 px. Sheet: 164×16 px (with 2px padding).
**Transparency:** No (solid tiles)
**Output path:** `Assets/bg_tiles/hide/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. Tile sheet for a top-down [ROOM TYPE] in a pro wrestling game. 10 tiles in a single row, each 16x16 pixels, solid backgrounds. Tiles: [TILE 1 DESCRIPTION], [TILE 2 DESCRIPTION], [TILE 3 DESCRIPTION], [TILE 4 DESCRIPTION], [TILE 5 DESCRIPTION], [TILE 6 DESCRIPTION], [TILE 7 DESCRIPTION], [TILE 8 DESCRIPTION], [TILE 9 DESCRIPTION], [TILE 10 DESCRIPTION]. [ROOM PALETTE DESCRIPTION]. Hard pixel edges, flat colors. No gradients, no realistic lighting, no blur, no anime style, no text, no isometric angle.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text
- No isometric angle

**NOTES:** Replace `[ROOM TYPE]` with the room name. Replace each `[TILE N DESCRIPTION]` with a one-phrase tile description (e.g., "gray concrete floor", "metal locker door closed"). Replace `[ROOM PALETTE DESCRIPTION]` with the dominant color scheme. See `tiles-and-environments.md` for complete room-by-room tile lists. Output: `Assets/bg_tiles/hide/[room-type]-tileset.png`.

---

### Template: UI Icon Sheet (All UI Icons in a Grid)

**Purpose:** All UI icons in one sheet for easy import into the game engine.
**Size:** 4 columns × 4 rows, each cell 32×32 px. Sheet: ~134×134 px with padding.
**Transparency:** Yes
**Output path:** `Assets/ui/`

**Prompt:**
```
Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background. UI icon sprite sheet arranged in a clean grid on transparent background, 4 columns by 4 rows, uniform cell size 32x32 pixels, consistent scale, 2px padding between cells. Icons (left to right, top to bottom): hidden state padlock, timer clock, timer hourglass, ally count silhouettes, player dot blue, ally dot light blue, player dot purple, ally dot light purple, enemy dot red, caught X marker, hidden lock marker, start button frame idle, start button frame hover, faction select frame, character select frame, blank placeholder cell. All in chunky pixel-art style, hard pixel edges, flat colors. No gradients, no realistic lighting, no blur, no anime style, no text, no decorative cell borders.
```

**AVOID:**
- No gradients
- No realistic lighting
- No blur
- No text labels on sheet
- No isometric angle
- No decorative cell borders

**NOTES:** Output: `Assets/ui/ui-icons-sheet.png`. Cell order matches the list above. Last cell is intentionally blank (for future additions). Individual icon files from `ui-and-icons.md` cards can be extracted from this sheet or generated independently.
````

- [ ] **Step 2: Verify the file exists**

```
ls "g:/LoCo Pro Wrestling (PC)/hidegame/prompts/imagegen/sprite-sheet-template.md"
```

---

## Self-Review Checklist

After all tasks are complete, verify the following against the spec:

### Spec Coverage

| Spec Section | Covered By |
|---|---|
| README.md — usage guide | Task 1 |
| README.md — asset integration guide + naming | Task 1 |
| style-guide.md — anchor sentence | Task 2 |
| style-guide.md — palette tables | Task 2 |
| style-guide.md — pixel-art constraints | Task 2 |
| style-guide.md — full AVOID list | Task 2 |
| wrestlers.md — 8 named wrestlers | Task 3 |
| wrestlers.md — pose templates (idle, walk, hiding, caught) | Task 3 |
| wrestlers.md — referee/security guard | Task 3 |
| wrestlers.md — logo references for Zeak, Carter, JT, Cody, Nicky, Franky | Task 3 |
| wrestlers.md — Erza/Johnny: no logo, faction palette only | Task 3 |
| factions.md — emblems (symbol only) | Task 4 |
| factions.md — small badges 32×32 | Task 4 |
| factions.md — victory badges 128×128 | Task 4 |
| factions.md — mini-map markers | Task 4 |
| factions.md — caught marker + hidden marker | Task 4 |
| tiles-and-environments.md — 10 room types | Task 5 |
| tiles-and-environments.md — grid position notes | Task 5 |
| objects-and-hiding-spots.md — 15 individual objects | Task 6 |
| objects-and-hiding-spots.md — hiding spot sheet card | Task 6 |
| ui-and-icons.md — mini-map frame | Task 7 |
| ui-and-icons.md — grid cell tiles (active/inactive) | Task 7 |
| ui-and-icons.md — faction dots + enemy dot | Task 7 |
| ui-and-icons.md — hidden/timer/ally-count icons | Task 7 |
| ui-and-icons.md — game over + victory badges | Task 7 |
| ui-and-icons.md — start button (idle + hover) | Task 7 |
| ui-and-icons.md — faction select frame | Task 7 |
| ui-and-icons.md — character select frame | Task 7 |
| title-screen.md — 7 screen states × 2 variants | Task 8 |
| sprite-sheet-template.md — 6 reusable templates | Task 9 |

### Verify All Files Present After Execution

```
ls "g:/LoCo Pro Wrestling (PC)/hidegame/prompts/imagegen/"
```

Expected output: 9 files — README.md, style-guide.md, wrestlers.md, factions.md, tiles-and-environments.md, objects-and-hiding-spots.md, ui-and-icons.md, title-screen.md, sprite-sheet-template.md.
