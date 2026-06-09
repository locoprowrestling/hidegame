# Stage III — Win Screen (screen-win-r3)

> **320 × 200 pixels. PNG. No alpha.**
>
> **STYLE: Pixel art. Hard edges. No anti-aliasing. No gradients.**

The win screen displayed when the player reaches the Master Suite door on the Penthouse
floor with all 40 room keys collected.

---

## Prompt

Pixel art scene, 320×200 pixels, PNG, no alpha channel.
Early 1990s PC game splash art style — DOOM / Wolfenstein era.
Hard aliased pixels, flat colour banding, no anti-aliasing, no gradients, no brush strokes.

**Scene:** The Penthouse corridor of the Hotel Imperial at night. The player has
reached the Master Suite door and it stands ajar. The Games Master is gone — the corridor
is empty, still, and cold.

---

## Composition

**Background — mahogany corridor:**
The corridor walls are floor-to-ceiling dark mahogany panelling. The panels run the full
image height on both sides, converging in perspective toward the vanishing point at the
centre-right (approximately x=200, y=95). Panels rendered as flat dark brown-red
rectangles (#1e1008 to #2a1408) with 1-px grain lines and 1-px raised panel bevel edges
(#3a2010 highlight, #0e0806 shadow). The perspective convergence creates 3–4 visible
panel frames on each side, each frame slightly narrower than the last.

**Floor:** The Penthouse marble floor. Dark green-black (#1e2018) with barely visible
white-grey veining (#3a3a30, 1-px jagged lines). The floor plane extends in perspective
from the bottom edge to approximately y=130 at the vanishing point. A pale moonlight
reflection runs along the floor centre — a 6-px wide stripe of slightly lighter value
(#282c22) running from y=200 toward the vanishing point.

**Ceiling:** Gilt coffered plaster, dark. The coffered pattern in perspective — flat
rectangular pixel shapes converging toward the vanishing point. Coffer ribs: dark warm
grey (#2e2c22). Tarnished gold glints on 2–3 rib sections: 2-px flat dark gold pixels
(#5a4a10). The ceiling occupies y=0 to y=65 at the near end.

**The Master Suite door:**
Centred at approximately x=185–215, y=40–165 — a tall double door in dark mahogany.
The door stands **4–6 px ajar** — a slim vertical gap of cold silver-blue light (#b0c0d0)
showing through the crack between the two door panels, from floor to top of the door.
This crack is the most important element of the image — it is the only bright, saturated
colour, and it draws the eye.

Door details (both panels):
- Raised panels: same flat-value construction as the wall panelling
- Brass door handles: small dark gold oval shapes (#6a5010), 4×3 px each, one per door
  panel at mid-height
- Brass keyhole plate: a dark gold rectangle (#6a5010), 3×6 px, below each handle
  on the right panel — the thing the 40 keys were for

**Moonlight through the crack:**
The thin crack of light at the door is the scene's only bright source. The cold silver-blue
(#b0c0d0) light bleeds out into the dark corridor in a narrow fan: a flat pale band on the
floor directly in front of the door (4 px wide at the door, fanning to 10 px wide at y=160,
value stepping down from #707880 at the source to #282c2e at y=175). Hard pixel edges on
this fan — banded flat steps, not a smooth gradient.

**GM's absence:**
The corridor is empty. No figure visible anywhere. This emptiness should feel unnatural —
everything in this game has the Games Master in it. The text overlay will note his absence;
the image should simply be still.

---

## Text zone compliance

These corridor zones must be dark enough for text overlay:

- y=40–105: the door centre and corridor mid-depth. The door panels are dark mahogany.
  The text will be gold on this dark wood background.
- y=105–145: lower corridor, dark floor. Floor tiles here are their darkest value.
- y=170–200: near floor edge. Very dark — the floor at the player's feet.

The moonlight crack (x=185–215) must be the only bright element in the y=40–165 range.
Everywhere else in that vertical band must be ≤ 35% brightness.

---

## Palette guidance (not prescriptive — maintain 8-bit pixel art rules)

| Hex      | Element                          |
|----------|----------------------------------|
| #b0c0d0  | Door crack — cold moonlight      |
| #707880  | Moonlight fan on floor (near)    |
| #3a3830  | Moonlight fan on floor (far)     |
| #2a1408  | Mahogany panel mid-tone          |
| #1e1008  | Mahogany deep shadow             |
| #3a2010  | Mahogany bevel highlight         |
| #6a5010  | Brass fittings                   |
| #5a4a10  | Gilt ceiling glints              |
| #2e2c22  | Ceiling rib                      |
| #1e2018  | Marble floor base                |
| #3a3a30  | Marble veining                   |
| #0e0806  | Deepest shadow, panel grooves    |
