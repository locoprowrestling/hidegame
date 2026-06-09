# Stage III — Games Master in the Hotel Imperial

The Games Master character is identical across all three stages — same body, same suit,
same mask, same cane. He does not change between rounds. All sprite files from Stage I
(`gm-idle.png`, `gm-walk-a.png`, `gm-walk-b.png`, `gm-lunge.png`, `gm-back.png`,
`gm-back-a.png`, `gm-back-b.png`) are reused unchanged.

See the [Stage I GM style guide](../../GM/style-guide.md) for the full character specification.

---

## Narrative context

In Stage III the Games Master is on home territory — the Hotel Imperial is his seat of
power. He is at his most deliberate and unhurried here. He owns these corridors.

The aesthetic contrast between the red lucha mask and the tarnished gilt mahogany is the
strongest in the game. Against crimson velvet he almost disappears. Against white kitchen
tile he is starkly visible.

None of this affects the sprite — the contrast is a product of the environment textures
alone.

---

## Stress escalation note

At stress ≥ 65 the GM hunts the player through walls (BFS pathfinding, no line-of-sight
requirement). This is the first time in the game the player cannot escape by running. The
sprite used during hunting is the standard walk cycle — no new sprite is needed. The terror
is mechanical, not visual.

---

## Future variant (optional)

If a distinct Stage III GM variant is produced, it should be minimal: perhaps a hotel
master key on a chain hanging from the suit pocket — a single prop addition, 4×8 px,
hanging at hip level in the idle and walk poses. The red mask and skeletal gloves remain
non-negotiable. Spec: 64×128 px, transparent PNG, same pixel art rules as Stage I.
