# UI — Collectible Pips (6 icons)

> **SIZE: 8 × 8 pixels exactly, each. Square. PNG with alpha transparency.**
>
> **STYLE: Pixel art. Hard-aliased pixels. No anti-aliasing. No gradients.**
>
> **FORMAT: PNG-32 with alpha (generate on pure #ffffff background — the
> loader keys white out automatically).**

Replace the flat 7×7 squares in the top HUD bar that count this floor's
collectibles (`drawHUD` in `renderer.js`). Seven (R1), five (R2) or four (R3)
pips render in a centred row at y 6, spaced 9 px apart, on the dark
`#2a1f0e` wood of the top bar. Each round needs a **lit** (collected) and
**dim** (missing) state:

| File | Round | State |
|------|-------|-------|
| `pip_program_lit.png` | R1 Opera House | collected |
| `pip_program_dim.png` | R1 Opera House | missing |
| `pip_card_lit.png` | R2 Sugar Works | collected |
| `pip_card_dim.png` | R2 Sugar Works | missing |
| `pip_key_lit.png` | R3 Hotel Imperial | collected |
| `pip_key_dim.png` | R3 Hotel Imperial | missing |

At 8×8 there is no room for detail — these are **glyphs**, not
illustrations. Maximum 5 colours per icon. Every icon gets a 1 px outline in
`#0a0806` where the shape meets transparency, so it separates from the wood.

---

## Prompts — lit states

Common preamble for all three: *Tiny pixel art game HUD icon on a strict
8×8 pixel grid, every pixel a flat single colour, pure white background,
no anti-aliasing, no shading gradients, 1-pixel dark outline #0a0806.*

**`pip_program_lit` — opera programme booklet, angled upright:**
A 5×7 px upright booklet shape, slightly off-centre. Cover fill `#c0a060`,
a 1 px vertical spine line on the left in `#7a5c2e`, a 1 px page-edge
sliver on the right in `#e8d8a8`, and a single 2 px horizontal title-band
pixel pair in `#7a5c2e` near the top. Outline `#0a0806`.

**`pip_card_lit` — punched data card:**
A 7×5 px horizontal card, top-left corner cut by 1 px (the classic punch-card
notch). Fill `#c0a060`, the cut corner edge `#e8d8a8`, and three punched
holes as single `#0a0806` pixels in a staggered row across the middle.
Outline `#0a0806`.

**`pip_key_lit` — hotel room key, bow at top:**
A vertical key, 4 px wide bow at top: a ring of `#c0a060` with a single
transparent pixel hole in its centre and one `#e8d8a8` catch-light pixel at
top-left. A 1 px shaft of `#c0a060` drops to y 6, ending in two 1 px teeth
pointing right in `#7a5c2e`. Outline `#0a0806`.

## Prompts — dim states

Same silhouette as the lit version, but rendered as an **empty recess**:
entire shape filled `#1a1a1a`, interior details (holes, teeth, spine) in
`#2a2a2a`, outline `#000000`. No gold anywhere. It must read at a glance as
"slot not yet filled" next to its lit twin.

---

## Post-processing

Generate each icon separately at **1024 × 1024** ("each logical pixel is a
flat 128×128 block"), then:

```sh
magick raw.png -filter point -resize 8x8\! assets/ui/pip_program_lit.png
```

Check the pair side-by-side at 3× zoom on a `#2a1f0e` swatch — lit must pop,
dim must recede.
