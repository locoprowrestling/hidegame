# Round II — Punch Card (Collectible Item)

Two versions required:

---

## punch-card — In-world sprite (billboard)

> **64 × 64 pixels. PNG. Transparent background (alpha = 0 for background).**
>
> **STYLE: Pixel art. Hard edges. No anti-aliasing.**

An IBM-style punch card from the late 1960s / early 1970s era — the kind used in
industrial batch processing systems. The card is rendered slightly angled (about 10°
clockwise tilt) so it looks like it has been dropped or propped against something.

**Card body:** Pale cream-yellow card stock (#dcd8c0), approximately 50×28 px at the
tilted angle. The card has a notched upper-left corner (the standard IBM card corner
notch, 4×4 px). Along the top edge: row of small printed column numbers in dark ink
(1 px character marks, #2a2820). Across the card face: the characteristic punch-hole
grid — 80 columns × 12 rows of rectangular holes (each hole approximately 1×2 px, #0a0a08,
punched in an irregular pattern suggesting an actual batch record). A factory stamp in
dark red ink (#7a1010) near the lower-right corner: a small beet silhouette or the
initials "GWS" (Great Western Sugar), roughly 6×4 px. Card edge shadow: 1 px dark line
(#2a2818) along the bottom and right edges.

**Background:** fully transparent.

**Dominant tone:** pale cream-yellow with dark punch holes

---

## punch-card-full — Full-screen pickup flash image

> **160 × 160 pixels. PNG. Transparent background.**
>
> **STYLE: Pixel art. Hard edges.**

Larger version of the punch card shown centred on screen when the player collects one.
The card fills roughly 120×68 px of the 160×160 canvas, centred, slightly tilted (~8°).
Same design as the small version but with more detail visible:
- Column and row index numbers printed along all four edges (1-2 px characters, #2a2820)
- Hole pattern clearly readable as rows and columns
- The GWS factory stamp more legible — shows a stylised beet root shape (8×6 px)
  and "G.W.S. — LOT #" followed by a 3-digit number in dark red (#7a1010)
- A faint vertical fold crease near the card centre (1 px, slightly darker #c8c4ac)
- Light pencil annotation: one corner has a handwritten-style "×" mark in mid-grey
  (#6a6a5a), suggesting it was checked off by a supervisor

**Background:** fully transparent.
