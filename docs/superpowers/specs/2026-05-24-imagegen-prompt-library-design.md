# LoCo Pro Wrestling: Hide — Image-Gen Prompt Library Design Spec
**Date:** 2026-05-24
**Status:** Approved

---

## Overview

A structured Markdown prompt library in `prompts/imagegen/` that covers every visual asset needed for "LoCo Pro Wrestling: Hide." Prompts are written for OpenAI image generation (DALL-E 3 / GPT image gen), copy-paste ready, and organized as self-contained prompt cards. No image files are generated as part of this deliverable — only the Markdown planning files.

---

## Format: Self-Contained Prompt Cards (Option B)

Every prompt in every file follows this card structure:

```
### [Asset Name]

**Purpose:** One-line description of what this asset is and where it's used in the game.
**Size:** e.g. 32×32 px
**Transparency:** Yes / No
**Output path:** e.g. Assets/sprites/wrestlers/

**Prompt:**
```
[Full prompt text with inline avoid instructions]
```

**AVOID:**
- bullet list of exclusions (for reference, and for tools that support negative prompts)

**NOTES:** Any usage notes, logo reference paths, or generation tips.
```

---

## File Structure

```
prompts/
  imagegen/
    README.md                     – how to use the library
    style-guide.md                – master style reference (not a paste-ready prompt)
    wrestlers.md                  – character sprite prompts
    factions.md                   – faction emblem and marker prompts
    tiles-and-environments.md     – room tile set prompts
    objects-and-hiding-spots.md   – individual object and hiding spot prompts
    ui-and-icons.md               – HUD, mini-map, and UI element prompts
    title-screen.md               – full-screen art prompts (1280×720)
    sprite-sheet-template.md      – reusable sprite sheet layout templates
```

---

## README.md

Covers:
- What each file is for (one-line per file)
- How to use a prompt card: copy the code block → paste into OpenAI image gen → optionally attach the referenced logo as an image input
- How to request transparent backgrounds: include "transparent background, PNG-ready, isolated asset" in the prompt
- How to request sprite sheets: include "arranged in a clean grid on a transparent background, uniform cell size, consistent scale"
- How to keep style consistent: prepend the anchor sentence from `style-guide.md` to any prompt
- Warning: omit text from prompts unless the specific card calls for it
- **Asset integration guide:** where to save generated files
  - Wrestler sprites → `Assets/sprites/wrestlers/`
  - Tiles / environments → `Assets/bg_tiles/hide/`
  - Objects / hiding spots → `Assets/sprites/objects/`
  - UI icons → `Assets/ui/`
  - Title / full-screen art → `Assets/screens/`
- Naming conventions: `[wrestler-name]-idle.png`, `[room-type]-tileset.png`, `ui-minimap-frame.png`, etc.

---

## style-guide.md

Master style reference. Not a paste-ready prompt — the source of truth that all other files draw from.

### Anchor Sentence
A single condensed style statement to prepend to any prompt for extra consistency:
> "Top-down pixel-art game asset, 8-bit NES-inspired style, flat colors, limited palette, chunky pixels, no gradients, no realistic lighting, no blur, no text, transparent background."

### Palette Rules
| Faction | Primary | Secondary | Accent | Neutral |
|---------|---------|-----------|--------|---------|
| The Rising | Bright blue | Electric yellow | White | Light gray |
| The Pillars | Deep purple | Gold | Black | Dark gray |
| Environment | Warm tan / wood brown | Cool gray stone | Dark navy shadow | Off-white highlight |

### Pixel-Art Constraints
- Limited color count per sprite (8–16 colors max)
- No anti-aliasing
- No sub-pixel detail
- Hard pixel edges
- Chunky, readable at small sizes

### Top-Down Perspective Rules
- Slight overhead angle (not isometric, not side-scrolling)
- Characters face down = default idle direction
- Consistent light source implied from upper-left
- No perspective distortion on objects

### Recommended Asset Sizes
| Asset Type | Size |
|------------|------|
| Character sprites | 32×32 or 48×48 |
| Object sprites | 16×16, 24×24, or 32×32 |
| Tiles | 16×16 |
| Title / full-screen art | 1280×720 |
| UI icons | 32×32 |
| Mini-map frame | 64×64 |
| Sprite sheet cells | Consistent to asset size with 2px padding |

### Full AVOID List
Inline in prompts AND as a reference list:
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

---

## wrestlers.md

### Cards Included
- Generic wrestler template (faction-agnostic)
- Top-down idle pose
- Walking sprite sheet (4 directions × 2–3 frames)
- Hiding pose (crouched/tucked)
- Caught/stunned pose (X-eyes or dazed indicator)
- One named card per wrestler:
  - **Zeak** — Rising, references `Assets/logos-web/logo-zeak.png`
  - **Erza** — Rising, no logo file exists; described from faction palette only
  - **Johnny** — Rising, no logo file exists; described from faction palette only
  - **Carter** — Rising, references `Assets/logos-web/logo-carter-cash.png`
  - **JT** — Pillars, references `Assets/logos-web/logo-jt-staten.png`
  - **Cody** — Pillars, references `Assets/logos-web/logo-cody-devine.png`
  - **Nicky** — Pillars, references `Assets/logos-web/logo-nicky-hyde.png`
  - **Franky** — Pillars, references `Assets/logos-web/logo-franky.png`
- Neutral referee / security guard character

### Per-Wrestler Card Approach
Each named card:
- References the logo file as an image input instruction
- Describes faction palette, a silhouette motif (hair shape, costume detail, body type) to ensure distinctness at 32×32
- Includes idle and "can be combined with walking/hiding templates" note
- Erza and Johnny cards note the missing logo and rely on faction palette + unique silhouette description

---

## factions.md

### Cards Included
- The Rising faction emblem (symbol only, no text)
- The Pillars faction emblem (symbol only, no text)
- Small faction badge icons (32×32)
- Victory screen faction badge (larger, 128×128)
- Mini-map faction markers (8×8 or 16×16 dots)
- "Caught" marker (red X or flash indicator)
- "Hidden" marker (shadow/lock symbol)

### Visual Direction
- Rising: upward-motion or flame-rise symbol, blue/yellow/white
- Pillars: column, crown, or arch motif, purple/gold/black
- All symbol-only — no text, no wordmarks

---

## tiles-and-environments.md

### Cards Included (one per room type)
| Room | Palette Notes | Collision Ideas | Hiding Spot Ideas |
|------|--------------|-----------------|-------------------|
| Wrestling ring room | Red/white canvas, dark floor | Ring ropes, corner posts | Under apron, behind barrier |
| Backstage hallway | Gray concrete, dim lighting | Cable bundles, equipment carts | Behind curtains, road cases |
| Locker room | Teal/gray metal lockers | Benches, lockers | Inside lockers |
| Storage room | Brown wood, dusty | Crates, trunks | Inside crates, behind stacks |
| Merch area | Bright retail colors | Tables, poster stands | Under tables, behind racks |
| Entrance curtain | Black/gold, dramatic | Curtain barriers | Behind curtains |
| Seating aisle | Stadium gray, red seats | Chairs, barriers | Under seats, behind pillars |
| Production booth | Dark tech gray | Equipment racks, monitors | Behind racks |
| Office | Warm wood, carpet | Desks, filing cabinets | Under desks, behind cabinets |
| Opera house interior | Ornate cream/gold | Columns, balcony edges | Behind columns, in alcoves |

Each card notes its position in the 4×4 grid (center = open/dangerous, edges = hiding-rich).

---

## objects-and-hiding-spots.md

### Individual Object Cards
One card each for: locker, road case, crate, curtain, merch table, folding chair stack, ring apron, trash can, lighting rig, cable coil, poster stand, trophy case, office desk, wardrobe rack, equipment trunk.

Each card: isolated top-down asset, transparent background, clear collision silhouette, 16×16 or 32×32.

### Hiding Spot Sprite Sheet Card
All hiding spot objects arranged in a clean grid, transparent background, uniform cell size, labeled by object type in the NOTES section (not in the image).

---

## ui-and-icons.md

### Cards Included
- Mini-map outer frame (64×64)
- 4×4 grid cell tile (16×16, active and inactive states)
- Player dot (faction color variant)
- Ally dot (lighter faction color variant)
- Enemy dot (red)
- Hidden state icon (lock or shadow symbol, 32×32)
- Timer icon (32×32)
- Ally count icon (32×32)
- Game over badge (128×128)
- Victory badge (128×128)
- Start button (idle and hover states)
- Faction select frame
- Character select frame

All pixel-art, no gradients, web-game readable.

---

## title-screen.md

### Cards Included (each with text + no-text variants)
- Main title screen background
- Faction select background
- Game over screen
- Victory screen
- Loading screen
- "You Survived" screen
- "You Were Found" screen

### Style Direction
- 1280×720
- Top-down wrestling venue mood
- Two-faction visual split where applicable
- 8-bit inspired, clean and readable
- No copyrighted references
- Text variant specifies exact string and pixel-font aesthetic
- No-text variant is pure background/illustration for layering with in-game font

---

## sprite-sheet-template.md

### Templates Included
- Character idle sheet (1 row, 4 directions)
- Character walk cycle (4 rows × 3 frames, one row per direction)
- Enemy patrol sheet (same structure as walk cycle)
- Hiding object sheet (all hiding spots in a grid)
- Environmental tile sheet (all tiles for one room type in a grid)
- UI icon sheet (all UI icons in a grid)

### Per-Template Requirements
- Grid dimensions and cell size specified
- Transparent background
- Consistent sprite scale across all cells
- No shadows unless part of pixel-art readability
- No rotated or perspective-mismatched sprites
- Uniform 2px padding between cells
- No decorative borders or backgrounds on individual cells

---

## Asset Generation Priority (Suggested Order)

1. **style-guide.md** — anchor the style first
2. **factions.md** — establish faction visual language before any character work
3. **wrestlers.md** — characters next, with faction colors locked in
4. **objects-and-hiding-spots.md** — props and hiding spots
5. **tiles-and-environments.md** — room tile sets
6. **ui-and-icons.md** — HUD and mini-map elements
7. **title-screen.md** — full-screen art last, when the visual language is proven
