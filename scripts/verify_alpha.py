"""
Verify that processed logo PNGs have genuine alpha transparency.

Usage:
  python scripts/verify_alpha.py
"""

import pathlib
import sys
import tempfile
import numpy as np
from PIL import Image


ASSETS = pathlib.Path("public/assets")
LOGOS = [
    ASSETS / "agnix-logo-transparent.png",
    ASSETS / "antar-title-transparent.png",
]


def check(path: pathlib.Path) -> bool:
    print(f"\n── {path.name} ──")
    if not path.exists():
        print(f"  ✗  File not found: {path}")
        return False

    try:
        img = Image.open(path)
    except Exception as e:
        print(f"  ✗  Cannot open: {e}")
        return False

    if img.format != "PNG":
        print(f"  ✗  Format is {img.format!r}, expected PNG")
        return False

    if img.mode != "RGBA":
        print(f"  ✗  Mode is {img.mode!r}, expected RGBA")
        return False

    arr = np.array(img, dtype=np.uint8)
    alpha = arr[:, :, 3]
    h, w = arr.shape[:2]

    min_a = int(alpha.min())
    max_a = int(alpha.max())
    transparent_px = int((alpha == 0).sum())
    opaque_px = int((alpha == 255).sum())

    print(f"  Size       : {w}×{h}")
    print(f"  Alpha min  : {min_a}  (want 0)")
    print(f"  Alpha max  : {max_a}  (want 255)")
    print(f"  Transparent: {transparent_px} px")
    print(f"  Opaque     : {opaque_px} px")

    ok = True

    if min_a != 0:
        print("  ✗  No fully transparent pixels — background may still be solid")
        ok = False
    else:
        print("  ✓  Fully transparent pixels exist")

    if max_a != 255:
        print("  ✗  No fully opaque pixels — logo may be missing")
        ok = False
    else:
        print("  ✓  Opaque logo pixels exist")

    # Corner check: corners should be transparent (no solid background)
    pad = max(6, min(h, w) // 20)
    corners = np.concatenate([
        alpha[:pad, :pad].flatten(),
        alpha[:pad, -pad:].flatten(),
        alpha[-pad:, :pad].flatten(),
        alpha[-pad:, -pad:].flatten(),
    ])
    corner_mean = float(corners.mean())
    if corner_mean > 30:
        print(f"  ✗  Corner alpha mean {corner_mean:.1f} > 30 — background may remain")
        ok = False
    else:
        print(f"  ✓  Corners transparent (mean alpha {corner_mean:.1f})")

    # Composite test over solid colours
    test_colours = [
        ("black",      (0,   0,   0)),
        ("white",      (255, 255, 255)),
        ("dark-red",   (80,  0,   0)),
        ("dark-green", (0,   60,  0)),
    ]
    with tempfile.TemporaryDirectory() as tmp:
        strips = []
        for name, colour in test_colours:
            bg = Image.new("RGBA", (w, h), colour + (255,))
            composite = Image.alpha_composite(bg, img)
            strips.append(composite.convert("RGB"))
            strip_path = pathlib.Path(tmp) / f"verify_{path.stem}_{name}.png"
            composite.save(strip_path)

        # Save a single verification contact sheet
        sheet_w = w * len(strips)
        sheet = Image.new("RGB", (sheet_w, h))
        for i, s in enumerate(strips):
            sheet.paste(s, (i * w, 0))
        sheet_path = ASSETS / f"_verify_{path.stem}.png"
        sheet.save(sheet_path)
        print(f"  → Verification sheet: {sheet_path}")

    return ok


def main() -> None:
    print("Alpha verification for Agnix Studio transparent logos")
    print("=" * 54)

    all_ok = True
    for logo in LOGOS:
        passed = check(logo)
        all_ok = all_ok and passed

    print("\n" + "=" * 54)
    if all_ok:
        print("ALL CHECKS PASSED ✓")
        print("\nDelete verification sheets when satisfied:")
        for logo in LOGOS:
            sheet = ASSETS / f"_verify_{logo.stem}.png"
            if sheet.exists():
                print(f"  del {sheet}")
    else:
        print("SOME CHECKS FAILED ✗ — re-run remove_bg.py and inspect sheets")
        sys.exit(1)


if __name__ == "__main__":
    main()
