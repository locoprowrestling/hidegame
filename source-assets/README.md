# Source Assets

This folder stores original high-resolution generated artwork.

- Files here are production sources, not runtime game assets.
- Game-ready files belong under `assets/` and use the dimensions and formats
  defined in their prompt style guides.
- Runtime code must continue to reference `assets/`, never `source-assets/`.
- Canonical source filenames mirror their runtime asset filenames.
- Superseded generations belong under `variants/` with a descriptive suffix.
- Chroma-key backgrounds may remain in source images; transparency is applied
  when producing the optimized runtime copy.

## Workflow

1. Save the untouched generated image here.
2. Resize, palette-limit, and remove backgrounds as required.
3. Save the processed game asset under the corresponding `assets/` path.
4. Verify the runtime file dimensions, color mode, and alpha requirements.

