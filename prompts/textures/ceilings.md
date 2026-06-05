# Ceiling Tiles

> **SIZE: 64 × 64 pixels. Square. 1:1 aspect ratio. Not rectangular.**
>
> **STYLE: Pixel art. Hand-pixeled retro game ceiling texture. No painting. No realism.**
> Hard-edged aliased pixels only. No anti-aliasing. No gradients. No brush strokes.
> Banded shading with flat colour steps. 12–20 colours per texture maximum.
>
> **FORMAT: PNG, 8-bit RGB, no alpha channel.**

Ceiling tiles must tile seamlessly in both axes (left↔right and top↔bottom).
In the raycaster the tile repeats across the overhead plane seen in perspective recession.
Large-scale features (8 px+) read better than fine grain at ceiling angles.
See style-guide.md for full palette rules and renderer context.

---

## ceiling_foyer — Grand Foyer Coffered Plaster (Floor 0)

> **64 × 64 px square. Pixel art. No painting.**

**Used:** Grand Foyer entrance hall.

Ornate coffered plaster ceiling, deeply decayed. The 64 × 64 tile contains a 2 × 2 grid of
coffers (each coffer roughly 28 × 28 px) separated by raised ribs (4 px wide).
Ribs: flat dark warm grey (#3a3430). Each rib casts a 2 px hard shadow on the coffer face
below it — a single flat darker pixel row, hard edge, no blend.
Coffer face: recessed, flat dark grey-cream (#3e3a34).
Decorative rose in each coffer: a circular form roughly 10 px diameter, rendered as flat
concentric rings of 1–2 px in slightly lighter values (#464040) — banded, pixel-circle shape,
no smooth curves. The ghost of former gilding: a few flat gold-brown pixels (#6a5010) on the
rose outline.
Cobwebs in upper-left coffer: flat 1 px pale grey lines (#5a5850) running between rib corners,
with a 2 × 2 px dust-knot at the junction.
Water stain on lower-right coffer: a flat darker patch (#2a2220) with a 1 px lighter ring
(#504030) at its edge — hard pixel boundary.

**Dominant tone:** dark warm grey

**Accent:** cobweb pixel lines, flat water-stain ring, ghost gilding pixels on rose

---

## ceiling_auditorium — Auditorium Painted Vault (Floor 1)

> **64 × 64 px square. Pixel art. No painting.**

**Used:** The Auditorium performance hall.

A shallow vault ceiling with elaborate paintwork now mostly destroyed.
Background: flat very dark blue-grey (#1e2028).
Ghost decorative forms: flat rectangles and curves in slightly lighter values (#2a2830, #242230)
suggesting cartouches and swag mouldings — rendered as flat pixel shapes, no detail visible,
just the silhouette.
Structural cracks: 1–2 px wide near-black lines radiating from a point near the upper-centre
of the tile, spreading across the tile in 3–4 branches. Hard pixel lines, no blur.
Fallen plaster patches: two ragged flat pale regions (#4a4440) with hard jagged pixel edges —
the surface layer gone, rough substrate exposed.
Remaining gold-leaf fragment: a small cluster of flat gold pixels (#806820, 3–4 px wide)
near the right-centre — the only saturated colour on this ceiling.

**Dominant tone:** very dark blue-grey

**Accent:** gold-leaf pixel cluster, radiating crack lines, pale fallen-plaster patches

---

## ceiling_gallery — Upper Gallery Exposed Joists (Floor 2)

> **64 × 64 px square. Pixel art. No painting.**

**Used:** Upper Gallery balcony level.

Raw structural timber joists exposed overhead. Joists run horizontally across the tile,
each joist 12 px tall. Gap between joists: 6 px.
Joist faces: flat very dark brown (#1e1610). Grain: horizontal 1 px lighter lines (#241c14)
within the joist face, flat and hard-edged. Knots: 3–4 px oval darker patches (#161008).
Gap fill (underside of boards above): flat dark brown (#28201a), slightly lighter than the
joists. Nail holes: isolated 1 px near-black dots at irregular intervals in the gap fill.
Cobwebs in the gap bays: flat 1 px lines (#2e2c28) stretching between joist sides,
with a small 2 × 2 px dust-mass in the left bay.
Distemper remnants on one joist face: a few flat very pale grey pixels (#c8c4bc)
scattered along the upper edge, hard pixel shapes.

**Dominant tone:** very dark brown-black

**Accent:** cobweb pixel lines, pale distemper fleck pixels, joist grain lines

---

## ceiling_flies — Fly Tower Structural Ironwork (Floor 3)

> **64 × 64 px square. Pixel art. No painting.**

**Used:** The Flies — the rigging loft.

Underside of the roof structure: cast iron trusses disappearing into void above.
Background: near-total black (#0a0a0c). All iron elements rendered as flat pixel shapes.
Main I-beam: runs horizontally across the upper quarter of the tile. Beam is 10 px tall.
Flanges (top and bottom of the I): 2 px tall each, flat mid dark blue-grey (#282c34).
Web (centre of the I): flat darker (#1e2028).
Rivet heads along the flanges: 2 × 2 px slightly lighter circles (#303440) at 6 px intervals.
Hanging rope below the beam: 2 px wide, dark hemp colour (#2a2418), flat vertical pixels
with a frayed bottom end — 3–4 stray 1 px pixels splaying out at the cut.
Block-and-tackle pulley: a flat dark circle (8 px diameter, dark iron #181a1e) with a 1 px
slot across its centre.
Secondary ironwork deeper in the void: barely perceptible flat pixel shapes (#121418)
against the near-black background — two or three faint horizontal lines.

**Dominant tone:** near-black

**Accent:** rivet-head pixel pairs on beam flange, fraying rope pixel ends
