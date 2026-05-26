#!/usr/bin/env python3
"""Generate deterministic top-down pixel sprites for LoCo Pro Wrestling: Hide."""

from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
WRESTLER_DIR = ROOT / "Assets" / "sprites" / "wrestlers"
SHEET_DIR = ROOT / "Assets" / "players-web" / "spritesheets"

FRAME_W = 64
FRAME_H = 96
LOGICAL_W = 32
LOGICAL_H = 48

TRANSPARENT = (0, 0, 0, 0)
OUTLINE = (18, 18, 20, 255)
BLACK = (30, 31, 34, 255)
DARK = (45, 46, 50, 255)
BOOT = (20, 22, 25, 255)
WHITE = (238, 236, 224, 255)


def rgba(hex_color):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4)) + (255,)


CHARACTERS = {
    "generic": {
        "skin": "#d89556",
        "hair": "#4b3420",
        "outfit": "#202225",
        "accent": "#111111",
        "build": "heavy",
    },
    "zeak": {
        "skin": "#c9824a",
        "hair": "#1b1718",
        "outfit": "#15161a",
        "accent": "#5d1f2a",
        "build": "tall",
        "hood": True,
        "beard": True,
    },
    "erza": {
        "skin": "#d28c65",
        "hair": "#16171c",
        "outfit": "#19191d",
        "accent": "#e85aaa",
        "build": "slim",
        "long_hair": True,
        "fishnet": True,
    },
    "crash": {
        "skin": "#df9a5c",
        "hair": "#f4d12b",
        "outfit": "#17191d",
        "accent": "#9c2026",
        "build": "huge",
        "mohawk": True,
        "sunglasses": True,
    },
    "carter": {
        "skin": "#d79258",
        "hair": "#17191d",
        "outfit": "#1b2a3f",
        "accent": "#1f6fbf",
        "build": "lean",
        "long_hair": True,
        "jacket": True,
        "flame": True,
    },
    "jt": {
        "skin": "#7c4f35",
        "hair": "#18191c",
        "outfit": "#39393c",
        "accent": "#f1f0ea",
        "build": "heavy",
        "formal": True,
    },
    "cody": {
        "skin": "#d69055",
        "hair": "#201b18",
        "outfit": "#151719",
        "accent": "#33b64b",
        "build": "stocky",
        "shirtless": True,
        "beard": True,
        "headband": True,
    },
    "nicky": {
        "skin": "#d99a64",
        "hair": "#5a3b20",
        "outfit": "#2250a6",
        "accent": "#d8a629",
        "build": "medium",
        "mask": True,
        "coat": True,
        "long_hair": True,
    },
    "franky": {
        "skin": "#74472e",
        "hair": "#141416",
        "outfit": "#17191d",
        "accent": "#1e77c9",
        "build": "lean",
        "goatee": True,
        "flame": True,
    },
    "referee": {
        "skin": "#c9824a",
        "hair": "#222222",
        "outfit": "#ffffff",
        "accent": "#191919",
        "build": "medium",
        "referee": True,
    },
    "security": {
        "skin": "#a66a43",
        "hair": "#1e1e1e",
        "outfit": "#14263d",
        "accent": "#304b6b",
        "build": "heavy",
        "badge": True,
    },
}


def build_offsets(phase):
    if phase == 0:
        return {
            "l_leg": (0, 0),
            "r_leg": (0, 0),
            "l_arm": (0, 0),
            "r_arm": (0, 0),
        }
    wave = [-2, -1, 0, 1, 2, 1, 0, -1][phase - 1]
    return {
        "l_leg": (-wave, abs(wave) // 2),
        "r_leg": (wave, 1 if abs(wave) == 2 else 0),
        "l_arm": (wave // 2, -abs(wave) // 2),
        "r_arm": (-wave // 2, abs(wave) // 2),
    }


def build_dims(build):
    dims = {
        "slim": (9, 13, 7),
        "lean": (10, 14, 7),
        "medium": (11, 15, 8),
        "tall": (10, 16, 7),
        "stocky": (13, 15, 9),
        "heavy": (14, 15, 10),
        "huge": (16, 16, 11),
    }
    return dims.get(build, dims["medium"])


def rect(draw, box, fill, outline=OUTLINE):
    draw.rectangle(box, fill=fill, outline=outline)


def ellipse(draw, box, fill, outline=OUTLINE):
    draw.ellipse(box, fill=fill, outline=outline)


def polygon(draw, points, fill, outline=OUTLINE):
    draw.polygon(points, fill=fill)
    draw.line(points + [points[0]], fill=outline, width=1)


def draw_limbs(draw, cfg, offsets, caught=False):
    skin = rgba(cfg["skin"])
    outfit = rgba(cfg["outfit"])
    accent = rgba(cfg["accent"])
    torso_w, _, arm_w = build_dims(cfg.get("build", "medium"))
    side_w = max(3, min(4, arm_w // 2))
    cx = 16

    if caught:
        ellipse(draw, (5, 24, 15, 28), skin)
        ellipse(draw, (17, 24, 27, 28), skin)
    else:
        ldx, ldy = offsets["l_arm"]
        rdx, rdy = offsets["r_arm"]
        ellipse(draw, (cx - torso_w // 2 - side_w + ldx, 20 + ldy, cx - torso_w // 2 + ldx, 31 + ldy), skin)
        ellipse(draw, (cx + torso_w // 2 + rdx, 20 + rdy, cx + torso_w // 2 + side_w + rdx, 31 + rdy), skin)
        rect(draw, (cx - torso_w // 2 - side_w + 1 + ldx, 22 + ldy, cx - torso_w // 2 + 1 + ldx, 28 + ldy), outfit)
        rect(draw, (cx + torso_w // 2 - 1 + rdx, 22 + rdy, cx + torso_w // 2 + side_w - 1 + rdx, 28 + rdy), outfit)

    ldx, ldy = offsets["l_leg"]
    rdx, rdy = offsets["r_leg"]
    leg_color = outfit if cfg.get("formal") or cfg.get("jacket") else skin
    pants = outfit if cfg.get("formal") or cfg.get("jacket") else rgba(cfg["accent"])

    rect(draw, (12 + ldx, 31 + ldy, 15 + ldx, 40 + ldy), pants)
    rect(draw, (17 + rdx, 31 + rdy, 20 + rdx, 40 + rdy), pants)
    rect(draw, (11 + ldx, 39 + ldy, 16 + ldx, 43 + ldy), BOOT)
    rect(draw, (16 + rdx, 39 + rdy, 21 + rdx, 43 + rdy), BOOT)

    if cfg.get("fishnet"):
        draw.point([(13 + ldx, 34 + ldy), (15 + ldx, 36 + ldy), (18 + rdx, 34 + rdy), (20 + rdx, 36 + rdy)], fill=rgba("#d6b0a0"))
    if cfg.get("flame"):
        draw.line((18 + rdx, 33 + rdy, 20 + rdx, 37 + rdy, 18 + rdx, 40 + rdy), fill=accent, width=1)


def draw_body(draw, cfg, caught=False):
    skin = rgba(cfg["skin"])
    outfit = rgba(cfg["outfit"])
    accent = rgba(cfg["accent"])
    torso_w, torso_h, _ = build_dims(cfg.get("build", "medium"))
    cx = 16

    if caught:
        polygon(draw, [(10, 17), (22, 17), (25, 30), (7, 30)], outfit)
        return

    shoulder_w = torso_w + 5
    ellipse(draw, (cx - shoulder_w // 2, 17, cx + shoulder_w // 2, 25), outfit)

    if cfg.get("shirtless"):
        polygon(draw, [(cx - torso_w // 2, 20), (cx + torso_w // 2, 20), (cx + torso_w // 2 - 2, 32), (cx - torso_w // 2 + 2, 32)], skin)
        rect(draw, (cx - 5, 29, cx + 5, 34), outfit)
    elif cfg.get("formal"):
        polygon(draw, [(cx - torso_w // 2, 19), (cx + torso_w // 2, 19), (cx + torso_w // 2 - 2, 33), (cx - torso_w // 2 + 2, 33)], WHITE)
        polygon(draw, [(cx - 5, 20), (cx + 5, 20), (cx + 4, 33), (cx - 4, 33)], outfit)
        draw.line((16, 20, 16, 33), fill=OUTLINE, width=1)
    elif cfg.get("coat"):
        polygon(draw, [(cx - torso_w // 2 - 2, 18), (cx + torso_w // 2 + 2, 18), (cx + torso_w // 2, 38), (cx - torso_w // 2, 38)], outfit)
        draw.line((cx - 5, 22, cx + 5, 22), fill=accent, width=1)
        draw.line((cx - 6, 35, cx + 6, 35), fill=accent, width=1)
    elif cfg.get("jacket"):
        polygon(draw, [(cx - torso_w // 2, 18), (cx + torso_w // 2, 18), (cx + torso_w // 2 - 1, 33), (cx - torso_w // 2 + 1, 33)], outfit)
        polygon(draw, [(cx - 3, 21), (cx + 4, 21), (cx + 3, 31), (cx - 2, 31)], skin)
        draw.line((cx - 5, 20, cx - 2, 32), fill=accent, width=1)
    else:
        polygon(draw, [(cx - torso_w // 2, 19), (cx + torso_w // 2, 19), (cx + torso_w // 2 - 2, 33), (cx - torso_w // 2 + 2, 33)], outfit)

    if cfg.get("headband"):
        draw.line((11, 9, 21, 9), fill=accent, width=1)
    if cfg.get("accent") and not cfg.get("formal"):
        draw.line((cx - 5, 31, cx + 5, 31), fill=accent, width=1)
    if cfg.get("referee"):
        for x in range(cx - 5, cx + 6, 3):
            draw.line((x, 19, x, 33), fill=BLACK, width=1)
    if cfg.get("badge"):
        rect(draw, (19, 22, 21, 24), rgba("#d7b85a"), outline=rgba("#d7b85a"))


def draw_head(draw, cfg, caught=False):
    skin = WHITE if cfg.get("mask") else rgba(cfg["skin"])
    hair = rgba(cfg["hair"])
    accent = rgba(cfg["accent"])

    if cfg.get("long_hair") or cfg.get("hood") or cfg.get("coat"):
        ellipse(draw, (9, 4, 23, 17), hair if not cfg.get("hood") else rgba(cfg["outfit"]))
    elif cfg.get("mohawk"):
        ellipse(draw, (10, 6, 22, 17), hair)
    else:
        ellipse(draw, (10, 6, 22, 17), hair)

    if cfg.get("hood"):
        ellipse(draw, (11, 6, 23, 17), rgba(cfg["outfit"]))
        ellipse(draw, (14, 8, 23, 16), rgba(cfg["skin"]))
    else:
        ellipse(draw, (12, 7, 23, 17), skin)

    if cfg.get("mohawk"):
        rect(draw, (15, 3, 18, 11), hair, outline=hair)
    if cfg.get("headband"):
        draw.line((12, 9, 23, 9), fill=accent, width=1)
    if cfg.get("sunglasses"):
        rect(draw, (17, 10, 22, 12), BLACK, outline=BLACK)
    else:
        draw.point((20, 11), fill=BLACK)
    if cfg.get("mask"):
        draw.point((18, 11), fill=BLACK)
        draw.point((21, 11), fill=BLACK)
    if cfg.get("beard") or cfg.get("goatee"):
        draw.line((17, 15, 22, 16), fill=hair, width=1)
    if caught:
        draw.line((17, 10, 19, 12), fill=BLACK, width=1)
        draw.line((19, 10, 17, 12), fill=BLACK, width=1)
        draw.line((21, 10, 23, 12), fill=BLACK, width=1)
        draw.line((23, 10, 21, 12), fill=BLACK, width=1)


def draw_character_frame(cfg, phase=0, pose="walk"):
    img = Image.new("RGBA", (LOGICAL_W, LOGICAL_H), TRANSPARENT)
    draw = ImageDraw.Draw(img)
    offsets = build_offsets(phase)

    if pose == "hide":
        draw_hiding(draw, cfg)
    elif pose == "caught":
        draw_limbs(draw, cfg, offsets, caught=True)
        draw_body(draw, cfg, caught=True)
        draw_head(draw, cfg, caught=True)
    else:
        draw_limbs(draw, cfg, offsets)
        draw_body(draw, cfg)
        draw_head(draw, cfg)

    return img.resize((FRAME_W, FRAME_H), Image.Resampling.NEAREST)


def draw_hiding(draw, cfg):
    skin = rgba(cfg["skin"])
    outfit = rgba(cfg["outfit"])
    hair = rgba(cfg["hair"])
    accent = rgba(cfg["accent"])
    ellipse(draw, (8, 19, 24, 33), outfit)
    ellipse(draw, (12, 12, 24, 24), hair if cfg.get("hood") else skin)
    if cfg.get("hood"):
        ellipse(draw, (12, 12, 24, 24), outfit)
        ellipse(draw, (16, 15, 24, 22), skin)
    draw.line((9, 30, 23, 30), fill=accent, width=1)
    rect(draw, (8, 31, 13, 36), BOOT)
    rect(draw, (18, 31, 23, 36), BOOT)


def make_sheet(cfg):
    sheet = Image.new("RGBA", (FRAME_W * 9, FRAME_H), TRANSPARENT)
    for i in range(9):
        frame = draw_character_frame(cfg, phase=i)
        sheet.alpha_composite(frame, (i * FRAME_W, 0))
    return sheet


def write(path, img):
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)
    print(f"wrote {path.relative_to(ROOT)} {img.size}")


def main():
    write(WRESTLER_DIR / "generic-idle.png", draw_character_frame(CHARACTERS["generic"], phase=0))
    write(WRESTLER_DIR / "generic-walk-sheet.png", make_sheet(CHARACTERS["generic"]))
    write(WRESTLER_DIR / "generic-hiding.png", draw_character_frame(CHARACTERS["generic"], pose="hide").crop((0, 16, 64, 80)))
    write(WRESTLER_DIR / "generic-caught.png", draw_character_frame(CHARACTERS["generic"], pose="caught"))

    sheet_targets = {
        "zeak": "zeak.png",
        "erza": "erza.png",
        "crash": "crash.png",
        "carter": "carter.png",
        "jt": "jt.png",
        "cody": "cody.png",
        "nicky": "nicky.png",
        "franky": "franky.png",
    }
    for key, filename in sheet_targets.items():
        write(SHEET_DIR / filename, make_sheet(CHARACTERS[key]))

    write(WRESTLER_DIR / "referee-idle.png", draw_character_frame(CHARACTERS["referee"], phase=0))
    write(WRESTLER_DIR / "security-guard-idle.png", draw_character_frame(CHARACTERS["security"], phase=0))


if __name__ == "__main__":
    main()
