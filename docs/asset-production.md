# Asset Production

This is the working playbook for generated bitmap assets in GAMES MASTER.
Prompt files define intent, `source-assets/` preserves generated masters, and
`assets/` contains the files the game actually loads.

## Source Of Truth

Use these locations consistently:

| Path | Purpose |
| --- | --- |
| `prompts/<family>/style-guide.md` | Shared palette, renderer constraints, and family-wide rules |
| `prompts/<family>/<asset>.md` | Concrete generation prompt and post-processing instructions |
| `source-assets/<family>/<asset>.png` | Untouched generated master |
| `source-assets/variants/...` | Rejected or superseded masters worth retaining |
| `assets/<family>/<asset>.png` | Processed runtime file |
| `docs/asset-runs/<date>-<slug>.md` | What was generated, processed, verified, and integrated |

Runtime code must never load from `source-assets/`.

## Workflow

1. Read the family style guide before the concrete prompt.
2. Inspect the consuming code and confirm the filename, dimensions, color
   mode, alpha behavior, and fallback behavior.
3. Generate one distinct asset per prompt. Do not treat multiple unrelated
   assets as variants of one prompt.
4. Copy the untouched generated image to the mirrored `source-assets/` path.
5. Verify the source copy against the generator output with a SHA-256 hash.
6. Produce the runtime copy under `assets/`. Resize, crop, key backgrounds,
   palette-limit, or hand-correct only this copy.
7. Verify the runtime file with `file` and, when useful, `ffprobe`.
8. Inspect the asset magnified with nearest-neighbor scaling.
9. Test in the game when browser access is available.
10. Add a short run note using
    [`docs/templates/asset-run.md`](templates/asset-run.md).

## Prompt Rules

- State the exact runtime size and aspect ratio near the top and repeat it in
  the concrete prompt.
- Describe pixel construction directly: hard-aliased edges, flat color
  blocks, banded shading, and maximum palette size.
- Include exact palette values when color identity affects gameplay.
- Describe the asset at its smallest rendered size, not only at source size.
- State the background strategy explicitly: opaque RGB, keyed white, keyed
  chroma color, or true alpha.
- List forbidden output traits such as gradients, blur, cast shadows, text,
  perspective, or extra objects.
- Keep shared rules in the style guide and asset-specific composition in the
  concrete prompt.

Use [`docs/templates/image-prompt.md`](templates/image-prompt.md) when adding a
new prompt family or an asset with unusual renderer constraints.

## Runtime Processing

Pixel art should be resized with nearest-neighbor sampling:

```sh
ffmpeg -i source.png -vf "scale=64:64:flags=neighbor,format=rgb24" runtime.png
```

For a basic macOS resize:

```sh
sips -z 64 64 source.png --out runtime.png
```

Use `sips` only when its result preserves the intended pixel geometry. For
very small glyphs, inspect the final pixels and correct the runtime copy
directly if a naive resize destroys the silhouette.

Generated transparency is not assumed. Follow the prompt family's loader
behavior:

- RGB textures: no alpha; save as `rgb24`.
- Keyed UI sprites: keep the specified border-connected key color.
- RGBA sprites: verify an alpha channel and transparent corners.

## Verification

Minimum checks:

```sh
file assets/path/*.png
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,pix_fmt -of csv=p=0 assets/path/file.png
shasum -a 256 generated.png source-assets/path/file.png
git diff --check
```

For batches, create a temporary nearest-neighbor contact sheet and inspect:

- silhouette at runtime size;
- transparent or keyed borders;
- accidental gradients or fringe colors;
- palette consistency;
- distinguishability between related sprites.

In-game verification should cover the asset's real context: distance scaling,
lighting, overlap, animation, HUD text, or wall orientation as applicable.

## Status Language

Keep these states distinct in notes:

- **Generated:** Image output exists in the generator cache.
- **Archived:** Untouched output is saved under `source-assets/`.
- **Processed:** A runtime-sized copy exists under `assets/`.
- **Integrated:** Runtime code has a loader slot and uses the asset.
- **Verified:** Dimensions and format passed checks.
- **Playtested:** The asset was inspected in the running game.

Do not claim integration or playtesting when only file generation completed.

## Common Failures

**Wrong dimensions:** Archive the original first, then resize only the runtime
copy.

**Smooth or painted output:** Strengthen logical-grid, flat-color, palette, and
anti-aliasing constraints. A clean runtime correction is acceptable for tiny
glyphs, but preserve the generated master.

**Mirrored wall art:** Trace raycaster texture-coordinate logic before changing
the source image. Orientation bugs often come from UV sampling.

**Missing files in the editor:** Verify absolute paths with `find`, `ls -la`,
and `file`; do not rely on the editor tree.

**Extra cache outputs:** Map files by generation time and inspect each image
before assigning canonical names.

