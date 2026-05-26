# Character Sprite Regeneration — Prompt Cards

## What this replaces

| Current file | Problem | Replace with |
|---|---|---|
| `Assets/players-web/spritesheets/*.png` | Side-view illustration art, wrong perspective for top-down game | Top-down walk-cycle sheets (see below) |
| `Assets/sprites/wrestlers/*-idle.png` | Generated as 1254×1254 full illustrations, unusable as sprites | Top-down idle single frames (see below) |
| `Assets/sprites/wrestlers/generic-walk-sheet.png` | 1254×1254 illustration, wrong format | Top-down generic walk sheet (see below) |
| `Assets/sprites/wrestlers/referee-idle.png` | Likely wrong perspective | Top-down referee idle (see below) |
| `Assets/sprites/wrestlers/security-guard-idle.png` | Likely wrong perspective | Top-down security idle (see below) |

---

## Perspective: top-down 3/4 overhead

All gameplay sprites must use **classic SNES-RPG overhead perspective** — the same angle as Zelda: A Link to the Past, Secret of Mana, or Chrono Trigger. This is NOT bird's-eye, NOT isometric, NOT side-scrolling.

**What it looks like:**
- You see the **top and front** of the character at roughly a 60° downward angle
- **Head and hair clearly visible** from above/slightly behind
- **Torso faces slightly toward the viewer** — costume front readable
- **Short legs**, one or both feet visible in motion
- Drawn as if the camera is mounted high on the wall looking down at the ring floor

**Wrong perspectives to avoid:**
- Bird's-eye (only see top of head) — too flat
- Isometric diamond grid — wrong axis
- Side-scrolling profile — wrong axis entirely
- 3/4 "slightly rotated" side view — not enough overhead angle

---

## Required sheet format

The game renderer (`renderer.js`) expects:

```
Single horizontal strip of frames, LEFT-TO-RIGHT:
  Frame 0 = idle/neutral (standing)
  Frames 1–8 = walk cycle (8 frames)

Each frame: 64 px wide × 96 px tall
Full sheet:  576 px wide × 96 px tall  (9 frames × 64 px)
Background:  transparent PNG
Direction:   CHARACTER FACES RIGHT — renderer auto-flips for left
```

The game code keys are `sheetZeak`, `sheetErza`, etc., loaded from
`Assets/players-web/spritesheets/`. Output new sprites there.

### Walk cycle anatomy (8 frames, facing right)

| Frame | Body state |
|---|---|
| 1 | Right foot forward, left arm forward |
| 2 | Weight transferring |
| 3 | Upright mid-stride |
| 4 | Left foot forward, right arm forward |
| 5 | Weight transferring |
| 6 | Upright mid-stride |
| 7 | Right foot forward again (loop back toward 1) |
| 8 | Transition to neutral |

Arm swing must be visible. Legs must clearly alternate. Head stays level (no bobbing needed at 16px display size).

---

## Style anchor (prepend to every prompt)

```
SNES-era top-down RPG sprite, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective (like Zelda: A Link to the Past), character faces right.
```

---

## Workflow recommendation

AI image generators struggle to produce consistent multi-frame sheets. The most reliable approach:

1. **Generate frame 0 (idle) first.** Get the character right before animating.
2. **Use frame 0 as image reference** when generating frames 1–8.
3. **Generate 2–4 frames per prompt** rather than the full 9 at once.
4. **Composite manually** into the 576×96 sheet in any pixel editor.

Alternatively, generate a FULL SHEET in one pass with this exact layout spec in the prompt — but verify frame consistency before use.

---

## Generic templates

---

### Generic idle frame (any unnamed wrestler)

**Output:** `Assets/sprites/wrestlers/generic-idle.png`
**Size:** 64×96 px, transparent PNG

**Prompt:**
```
SNES-era top-down RPG sprite, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective (like Zelda: A Link to the Past), character faces right.

Single idle-standing frame of a generic male pro wrestler.
Muscular build, dark singlet, dark boots. Viewed from slightly above and in front.
Head and hair visible from above, torso faces right, arms at sides, feet planted.
64 pixels wide, 96 pixels tall. Chunky pixel silhouette, hard edges.
No text, no faction colors, no shadows, no decorative background.
```

---

### Generic walk-cycle sheet (8-frame, generic wrestler)

**Output:** `Assets/sprites/wrestlers/generic-walk-sheet.png`
**Size:** 576×96 px (9 frames × 64 px wide), transparent PNG

**Prompt:**
```
SNES-era top-down RPG sprite sheet, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective (like Zelda: A Link to the Past), character faces right.

Sprite sheet: 9 frames in a single horizontal row, each frame exactly 64×96 pixels,
no padding between frames. Frame 0 = idle standing. Frames 1–8 = walk cycle facing right.
Subject: generic muscular male pro wrestler, dark singlet, dark boots.
Walk cycle shows clear leg alternation and arm swing. Head stays stable.
Total sheet: 576 pixels wide × 96 pixels tall.
No decorative background, no frame borders, no text.
```

---

### Generic hiding pose

**Output:** `Assets/sprites/wrestlers/generic-hiding.png`
**Size:** 64×64 px, transparent PNG

**Prompt:**
```
SNES-era top-down RPG sprite, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective, character faces right.

Single frame: generic male pro wrestler crouched and tucked into a hiding pose.
Clearly smaller silhouette than standing — knees bent, body low to the ground,
head ducked. Viewed from slightly above. 64 pixels wide, 64 pixels tall (shorter than idle).
No text, no faction colors, no decorative background.
```

---

### Generic caught/stunned pose

**Output:** `Assets/sprites/wrestlers/generic-caught.png`
**Size:** 64×96 px, transparent PNG

**Prompt:**
```
SNES-era top-down RPG sprite, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective, character faces right.

Single frame: generic male pro wrestler in a stunned/caught pose. Body slumped,
arms out to sides in a dazed stagger, X-shaped eyes (2-pixel-wide X marks, readable at
32px). Viewed from slightly above and front. 64 pixels wide, 96 pixels tall.
No text, no faction colors, no decorative background.
```

---

## Named wrestler cards — The Rising

For each card: **attach the listed reference images as image inputs before sending the prompt.**
The reference images show the real character — the AI must match them.

---

### Zeak Gallent — walk-cycle sheet

**References to attach:**
- `Assets/players-web/spritesheets/zeak.png` — current spritesheet (for costume/build reference)
- `Assets/sprites/wrestlers/zeak-idle.png` — generated idle (for pose reference)

**What Zeak looks like:**
- Tall, lean-muscular build
- Black hood pulled up over head
- Large dark full beard
- Sleeveless black hooded top, exposed midsection
- Dark crimson/maroon patterned shorts over black tights
- Dark crimson/maroon fingerless gloves
- Black boots
- Dominant colors: **black and dark crimson/maroon**

**Output:** `Assets/players-web/spritesheets/zeak.png`
**Size:** 576×96 px

**Prompt:**
```
SNES-era top-down RPG sprite sheet, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective (like Zelda: A Link to the Past), character faces right.
Match the character in the attached reference image exactly.

Sprite sheet: 9 frames in a single horizontal row, each frame 64×96 px, no padding.
Frame 0 = idle. Frames 1–8 = walk cycle facing right.
Character: Zeak Gallent — tall lean wrestler, black hood up, large dark beard,
sleeveless black top with exposed abs, dark crimson-maroon shorts over black tights,
dark crimson-maroon fingerless gloves, black boots.
Clear leg alternation and arm swing in walk cycle. Head/hood stable.
Total: 576×96 px. No background, no borders, no text.
```

**AVOID:** No blue or yellow. No bare head — Zeak always has the black hood up. No ring gear trunks.

---

### Erza — walk-cycle sheet

**References to attach:**
- `Assets/players-web/spritesheets/erza.png`
- `Assets/sprites/wrestlers/erza-idle.png`

**What Erza looks like:**
- Female wrestler, medium athletic build
- Long straight black hair
- Black crop top / sports bra
- Black shorts
- Fishnet stockings visible on thighs
- Black knee pads
- Black arm wraps to elbow
- Pink accent trim on belt and boot edges
- Dominant colors: **black with pink accents**

**Output:** `Assets/players-web/spritesheets/erza.png`
**Size:** 576×96 px

**Prompt:**
```
SNES-era top-down RPG sprite sheet, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective (like Zelda: A Link to the Past), character faces right.
Match the character in the attached reference image exactly.

Sprite sheet: 9 frames in a single horizontal row, each frame 64×96 px, no padding.
Frame 0 = idle. Frames 1–8 = walk cycle facing right.
Character: Erza — female wrestler, long straight black hair (visible top/back of head),
black crop top, black shorts, fishnet thigh-highs, black knee pads, black arm wraps,
pink accent trim on belt and boot edges. Clearly female silhouette.
Clear leg alternation and arm swing. Hair sways slightly with walk.
Total: 576×96 px. No background, no borders, no text.
```

**AVOID:** No male body shape. No blue/yellow. Costume is black with pink accents only.

---

### Johnny Crash — walk-cycle sheet

**References to attach:**
- `Assets/players-web/spritesheets/crash.png`
- `Assets/sprites/wrestlers/johnny-crash-idle.png`

**What Johnny looks like:**
- Very large, heavyset / massively built
- Short bright yellow/blonde mohawk (most distinctive feature)
- Sunglasses
- Black sleeveless tank top
- Black trunks with red side-panel stripes
- Black boots with red panel accents
- Dominant colors: **black and red, yellow mohawk**

**Output:** `Assets/players-web/spritesheets/crash.png`
**Size:** 576×96 px

**Prompt:**
```
SNES-era top-down RPG sprite sheet, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective (like Zelda: A Link to the Past), character faces right.
Match the character in the attached reference image exactly.

Sprite sheet: 9 frames in a single horizontal row, each frame 64×96 px, no padding.
Frame 0 = idle. Frames 1–8 = walk cycle facing right.
Character: Johnny Crash — massive heavyset wrestler, bright yellow mohawk clearly
visible from above, black sleeveless tank top, black trunks with red side stripes,
black boots with red accents. Wide body silhouette, heavier footfall in walk cycle.
Total: 576×96 px. No background, no borders, no text.
```

**AVOID:** No slim build — Johnny is massive. No missing mohawk. Black/red costume, NOT blue/yellow.

---

### Carter Cash — walk-cycle sheet

**References to attach:**
- `Assets/players-web/spritesheets/carter.png`
- `Assets/sprites/wrestlers/carter-cash-idle.png`

**What Carter looks like:**
- Lean, medium build
- Long straight dark/black hair
- Open dark navy jacket, shirtless underneath
- Dark navy/black pants with blue flame graphic trim at ankles
- Black boots
- Dominant colors: **dark navy/black with blue flame accents**

**Output:** `Assets/players-web/spritesheets/carter.png`
**Size:** 576×96 px

**Prompt:**
```
SNES-era top-down RPG sprite sheet, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective (like Zelda: A Link to the Past), character faces right.
Match the character in the attached reference image exactly.

Sprite sheet: 9 frames in a single horizontal row, each frame 64×96 px, no padding.
Frame 0 = idle. Frames 1–8 = walk cycle facing right.
Character: Carter Cash — lean wrestler, long straight dark hair (visible from above),
open dark navy jacket over bare chest, dark navy pants with blue flame graphic trim
at ankles, black boots. Jacket edges visible from above.
Total: 576×96 px. No background, no borders, no text.
```

**AVOID:** No bright blue costume — Carter's palette is dark navy/black with blue flame trim only.

---

## Named wrestler cards — The Pillars

---

### JT Staten — walk-cycle sheet

**References to attach:**
- `Assets/players-web/spritesheets/jt.png`
- `Assets/sprites/wrestlers/jt-staten-idle.png`

**What JT looks like:**
- Heavy-set, powerfully built, authoritative posture
- Short dark hair, darker skin tone
- White long-sleeve dress shirt, buttoned to collar
- Dark charcoal grey waistcoat/vest over shirt
- Black dress trousers
- Black dress shoes
- NOT in ring gear — formal business attire / authority figure
- Dominant colors: **white shirt, charcoal vest, black trousers**

**Output:** `Assets/players-web/spritesheets/jt.png`
**Size:** 576×96 px

**Prompt:**
```
SNES-era top-down RPG sprite sheet, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective (like Zelda: A Link to the Past), character faces right.
Match the character in the attached reference image exactly.

Sprite sheet: 9 frames in a single horizontal row, each frame 64×96 px, no padding.
Frame 0 = idle. Frames 1–8 = walk cycle facing right.
Character: JT Staten — heavy-set wrestler dressed in formal authority attire.
White long-sleeve dress shirt, dark charcoal grey waistcoat/vest, black dress trousers,
black dress shoes. Short dark hair visible from above. Wide powerful build.
Walk is deliberate and authoritative, not bouncy. No ring gear.
Total: 576×96 px. No background, no borders, no text.
```

**AVOID:** No ring trunks/singlet — JT wears FORMAL BUSINESS CLOTHES. No purple/gold.

---

### Cody Devine — walk-cycle sheet

**References to attach:**
- `Assets/players-web/spritesheets/cody.png`
- `Assets/sprites/wrestlers/cody-devine-idle.png`

**What Cody looks like:**
- Stocky, powerfully muscular build
- Short dark hair with a **green headband** (distinctive)
- Full dark beard
- Shirtless
- Black wrist wraps
- Black and **bright green diagonal-striped** trunks — bold diagonal stripes
- Black lace-up boots
- Dominant colors: **black and bright green diagonal stripes**

**Output:** `Assets/players-web/spritesheets/cody.png`
**Size:** 576×96 px

**Prompt:**
```
SNES-era top-down RPG sprite sheet, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective (like Zelda: A Link to the Past), character faces right.
Match the character in the attached reference image exactly.

Sprite sheet: 9 frames in a single horizontal row, each frame 64×96 px, no padding.
Frame 0 = idle. Frames 1–8 = walk cycle facing right.
Character: Cody Devine — stocky muscular wrestler, shirtless, short dark hair with
bright GREEN HEADBAND (must be readable), full dark beard, black wrist wraps,
black and bright green DIAGONAL-STRIPED trunks with bold stripe pattern, black boots.
Wide muscular torso visible from above.
Total: 576×96 px. No background, no borders, no text.
```

**AVOID:** No shirt — shirtless. Green headband is the key identifier — must be visible. No purple/gold.

---

### Nicky Hyde — walk-cycle sheet

**References to attach:**
- `Assets/players-web/spritesheets/nicky.png`
- `Assets/sprites/wrestlers/nicky-hyde-idle.png`

**What Nicky looks like:**
- Medium athletic build
- **White theatrical mask** covering face — the most distinctive feature
- Ornate **royal blue brocade long coat** with gold lace trim and fringe
- Blue trunks/briefs
- Blue knee pads
- Black boots
- Very theatrical, showman character
- Dominant colors: **royal blue coat, gold trim, white mask**

**Output:** `Assets/players-web/spritesheets/nicky.png`
**Size:** 576×96 px

**Prompt:**
```
SNES-era top-down RPG sprite sheet, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective (like Zelda: A Link to the Past), character faces right.
Match the character in the attached reference image exactly.

Sprite sheet: 9 frames in a single horizontal row, each frame 64×96 px, no padding.
Frame 0 = idle. Frames 1–8 = walk cycle facing right.
Character: Nicky Hyde — theatrical showman wrestler. WHITE THEATRICAL MASK (solid white,
slightly smiling, 2-pixel reads at game scale) — this is the most important feature.
Royal blue brocade long coat with gold lace trim and fringe detail at hem and sleeves,
blue trunks, blue knee pads, black boots. Coat flows slightly during walk.
Total: 576×96 px. No background, no borders, no text.
```

**AVOID:** No bare face — the white mask is ALWAYS visible and is the character's signature look.
The coat is ornate royal blue brocade with gold trim, not a plain blue jacket.

---

### Franky Gonzales — walk-cycle sheet

**References to attach:**
- `Assets/players-web/spritesheets/franky.png`
- `Assets/sprites/wrestlers/franky-idle.png`

**What Franky looks like:**
- Medium lean build
- Dark skin tone, short dark hair, thin goatee
- Black sleeveless tank top (has "PRETTY BOY" text but skip text at sprite size)
- Black distressed/torn shorts
- Black pants with **blue flame graphic** on one leg
- Black boots
- Cocky, relaxed posture
- Dominant colors: **black with blue flame accent on one leg**

**Output:** `Assets/players-web/spritesheets/franky.png`
**Size:** 576×96 px

**Prompt:**
```
SNES-era top-down RPG sprite sheet, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective (like Zelda: A Link to the Past), character faces right.
Match the character in the attached reference image exactly.

Sprite sheet: 9 frames in a single horizontal row, each frame 64×96 px, no padding.
Frame 0 = idle. Frames 1–8 = walk cycle facing right.
Character: Franky Gonzales — lean wrestler, dark skin tone, short dark hair, thin goatee
visible from above, black sleeveless tank top, black distressed shorts, black pants
with blue flame graphic on left leg (asymmetric — one leg has blue flame, other plain black),
black boots. Relaxed slightly cocky posture in idle frame.
Total: 576×96 px. No background, no borders, no text.
```

**AVOID:** No purple/gold. Blue flame is on ONE leg only — asymmetric is correct and distinctive.

---

## Enemy / NPC cards

---

### Referee — idle frame

**Output:** `Assets/sprites/wrestlers/referee-idle.png`
**Size:** 64×96 px, transparent PNG

**Prompt:**
```
SNES-era top-down RPG sprite, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective (like Zelda: A Link to the Past), character faces right.

Single idle frame: pro wrestling referee. Black and white vertical stripes shirt,
dark trousers, short hair, alert authoritative stance, arms ready at sides.
Neutral/no faction colors. 64 pixels wide, 96 pixels tall. Chunky silhouette.
No text, no decorative background.
```

---

### Security Guard — idle frame

**Output:** `Assets/sprites/wrestlers/security-guard-idle.png`
**Size:** 64×96 px, transparent PNG

**Prompt:**
```
SNES-era top-down RPG sprite, pixel art, flat colors, limited 8-16 color palette,
hard pixel edges, no gradients, no anti-aliasing, no blur, no glow, transparent background.
Classic overhead 3/4 perspective (like Zelda: A Link to the Past), character faces right.

Single idle frame: venue security guard. Dark navy uniform, short hair, broad
authoritative stance, utility belt or badge visible on chest. Different silhouette
from referee — blockier and more imposing build.
64 pixels wide, 96 pixels tall. No text, no faction colors, no decorative background.
```

---

## After generating: update assets.js

If new character sheet dimensions differ from current (e.g., frame width changes from 64 to X),
update the `frameW` values in `renderer.js`:

```javascript
var PLAYER_SHEETS = {
  'Zeak':   { key: 'sheetZeak',   frameW: 64 },  // update if frame width changes
  'Erza':   { key: 'sheetErza',   frameW: 64 },
  'Johnny': { key: 'sheetJohnny', frameW: 64 },
  'Carter': { key: 'sheetCarter', frameW: 64 },
  'JT':     { key: 'sheetJT',     frameW: 64 },
  'Cody':   { key: 'sheetCody',   frameW: 64 },
  'Nicky':  { key: 'sheetNicky',  frameW: 64 },
  'Franky': { key: 'sheetFranky', frameW: 64 },
};
```

All new sheets generated with this guide use **frameW: 64**.
