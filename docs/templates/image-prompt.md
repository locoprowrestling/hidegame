# Image Prompt Template

Copy this into the appropriate `prompts/<family>/` folder and remove sections
that do not apply.

```md
# <Family> - <Asset Name>

> **FINAL SIZE:** <width> x <height> pixels. <aspect ratio>.
>
> **STYLE:** Pixel art. Hard-aliased pixels. No anti-aliasing or gradients.
>
> **FORMAT:** <RGB/RGBA PNG>. <background or transparency strategy>.

See `style-guide.md` for the shared palette and renderer context.

## Runtime Context

- Loaded by: `<file/function>`
- Runtime key or path: `<key/path>`
- Drawn at: `<size and scale behavior>`
- Must remain legible at: `<smallest useful size>`
- Fallback behavior: `<procedural/missing/none>`

## Prompt

Use case: stylized-concept
Asset type: <game texture, billboard sprite, HUD glyph, screen art>
Primary request: <one direct sentence>
Scene/backdrop: <opaque field or exact key color>
Subject: <shape, pose, material, and gameplay identity>
Style/medium: <pixel construction and era reference>
Composition/framing: <placement, padding, orientation>
Color palette: <exact hex values and maximum colors>
Constraints: <required details and invariants>
Avoid: <gradients, blur, shadows, text, extra objects, perspective, etc.>

## Post-processing

1. Archive untouched output at `source-assets/<family>/<name>.png`.
2. Produce `assets/<family>/<name>.png`.
3. Apply: `<resize/crop/key/palette operation>`.
4. Verify: `<dimensions, pixel format, alpha/key behavior>`.

## Acceptance Checks

- [ ] Correct silhouette at runtime size
- [ ] Correct dimensions and pixel format
- [ ] Palette and background behavior match the style guide
- [ ] No unintended fringe, smoothing, text, or extra objects
- [ ] Loader path or sprite key matches consuming code
- [ ] In-game context checked
```

