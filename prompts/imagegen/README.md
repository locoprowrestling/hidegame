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
