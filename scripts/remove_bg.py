"""
Background removal for Agnix Studio logos.

Usage:
  python scripts/remove_bg.py                         # auto-detect from public/assets/
  python scripts/remove_bg.py logo.png title.png      # explicit paths
  python scripts/remove_bg.py --agnix logo.png --antar title.png
"""

import sys
import os
import shutil
import argparse
import pathlib
import numpy as np
from PIL import Image, ImageFilter


OUT_DIR = pathlib.Path("public/assets")


# ── Helpers ────────────────────────────────────────────────────────────────

def load_rgba(path: pathlib.Path) -> np.ndarray:
    img = Image.open(path).convert("RGBA")
    return np.array(img, dtype=np.float32)


def crop_with_padding(arr: np.ndarray, pad: int = 12) -> np.ndarray:
    img = Image.fromarray(arr.astype(np.uint8), mode="RGBA")
    bbox = img.getbbox()
    if not bbox:
        return arr
    x0 = max(0, bbox[0] - pad)
    y0 = max(0, bbox[1] - pad)
    x1 = min(img.width,  bbox[2] + pad)
    y1 = min(img.height, bbox[3] + pad)
    return np.array(img.crop((x0, y0, x1, y1)), dtype=np.float32)


def save_rgba(arr: np.ndarray, path: pathlib.Path) -> None:
    Image.fromarray(arr.astype(np.uint8), mode="RGBA").save(path, "PNG", optimize=True)
    print(f"  Saved: {path}  ({arr.shape[1]}×{arr.shape[0]})")


# ── Green-background removal (Agnix Studio logo) ───────────────────────────

def remove_green_bg(src: pathlib.Path, out: pathlib.Path) -> None:
    print(f"\nRemoving green background: {src.name}")
    data = load_rgba(src)
    r, g, b = data[:, :, 0], data[:, :, 1], data[:, :, 2]

    r_n = r / 255.0
    g_n = g / 255.0
    b_n = b / 255.0

    max_c = np.maximum(np.maximum(r_n, g_n), b_n)
    min_c = np.minimum(np.minimum(r_n, g_n), b_n)
    delta = max_c - min_c

    # Saturation (HSV)
    sat = np.where(max_c > 1e-6, delta / max_c, 0.0)

    # Hue normalised to [0, 1]
    hue = np.zeros_like(r_n)
    m_g = (max_c == g_n) & (delta > 1e-6)
    m_r = (max_c == r_n) & (delta > 1e-6)
    m_b = (max_c == b_n) & (delta > 1e-6)
    hue[m_r] = ((g_n[m_r] - b_n[m_r]) / delta[m_r]) / 6.0 % 1.0
    hue[m_g] = ((b_n[m_g] - r_n[m_g]) / delta[m_g] + 2.0) / 6.0
    hue[m_b] = ((r_n[m_b] - g_n[m_b]) / delta[m_b] + 4.0) / 6.0

    val = max_c

    # Green pixel mask — HSV range that covers typical chroma-key greens
    green = (hue >= 0.22) & (hue <= 0.50) & (sat > 0.22) & (val > 0.12)

    # Hard alpha: background = 0, foreground = 255
    alpha_hard = np.where(green, 0.0, 255.0)

    # Feather edge pixels
    alpha_img = Image.fromarray(alpha_hard.astype(np.uint8), mode="L")
    alpha_soft = np.array(
        alpha_img.filter(ImageFilter.GaussianBlur(radius=1.0)), dtype=np.float32
    )

    # Despill: neutralise green fringe on semi-transparent edge pixels
    result = data.copy()
    edge = (alpha_soft > 8) & (alpha_soft < 248)
    if edge.any():
        max_rb = np.maximum(r[edge], b[edge])
        result[:, :, 1][edge] = np.minimum(g[edge], max_rb)

    # Zero out background RGB to prevent colour bleed
    transparent = alpha_soft < 6
    result[:, :, 0][transparent] = 0
    result[:, :, 1][transparent] = 0
    result[:, :, 2][transparent] = 0
    result[:, :, 3] = alpha_soft

    result = crop_with_padding(result, pad=12)
    save_rgba(result, out)


# ── White-background removal (Agnix Studio logo on white) ─────────────────

def remove_white_bg(src: pathlib.Path, out: pathlib.Path) -> None:
    print(f"\nRemoving white background: {src.name}")
    data = load_rgba(src)
    r, g, b = data[:, :, 0], data[:, :, 1], data[:, :, 2]

    # Deviation from pure white per channel
    dr = 255.0 - r
    dg = 255.0 - g
    db = 255.0 - b

    # Max deviation from white = how "non-white" the pixel is → drives alpha
    dist_from_white = np.maximum(np.maximum(dr, dg), db)

    # Boost mid-range so anti-aliased edges are fully opaque
    alpha = np.clip(dist_from_white * 2.2, 0.0, 255.0)

    # Feather for smooth edges
    alpha_img = Image.fromarray(alpha.astype(np.uint8), mode="L")
    alpha_soft = np.array(
        alpha_img.filter(ImageFilter.GaussianBlur(radius=0.8)), dtype=np.float32
    )

    result = data.copy()
    result[:, :, 3] = alpha_soft

    transparent = alpha_soft < 6
    result[:, :, 0][transparent] = 0
    result[:, :, 1][transparent] = 0
    result[:, :, 2][transparent] = 0
    result[:, :, 3][transparent] = 0

    result = crop_with_padding(result, pad=12)
    save_rgba(result, out)


# ── Black-background removal (ANTAR title logo) ────────────────────────────

def remove_black_bg(src: pathlib.Path, out: pathlib.Path) -> None:
    print(f"\nRemoving black background: {src.name}")
    data = load_rgba(src)
    r, g, b = data[:, :, 0], data[:, :, 1], data[:, :, 2]

    # Max channel as luminosity → becomes alpha
    lum = np.maximum(np.maximum(r, g), b)

    # Push dark values harder to zero
    alpha = np.clip(lum * 1.08 - 12.0, 0.0, 255.0)

    # Light feather for anti-aliased edges
    alpha_img = Image.fromarray(alpha.astype(np.uint8), mode="L")
    alpha_soft = np.array(
        alpha_img.filter(ImageFilter.GaussianBlur(radius=0.6)), dtype=np.float32
    )

    result = data.copy()
    result[:, :, 3] = alpha_soft

    transparent = alpha_soft < 6
    result[:, :, 0][transparent] = 0
    result[:, :, 1][transparent] = 0
    result[:, :, 2][transparent] = 0
    result[:, :, 3][transparent] = 0

    result = crop_with_padding(result, pad=10)
    save_rgba(result, out)


# ── Auto-detect source images ──────────────────────────────────────────────

EXTS = {".png", ".jpg", ".jpeg", ".webp"}


def candidate_images(directory: pathlib.Path) -> list[pathlib.Path]:
    return [p for p in directory.iterdir() if p.suffix.lower() in EXTS]


def has_green_bg(path: pathlib.Path, sample: int = 200) -> bool:
    """Heuristic: sample corners; green dominant means green BG."""
    try:
        img = Image.open(path).convert("RGB").resize((sample, sample))
        arr = np.array(img, dtype=np.float32)
        corners = np.concatenate([
            arr[:10, :10].reshape(-1, 3),
            arr[:10, -10:].reshape(-1, 3),
            arr[-10:, :10].reshape(-1, 3),
            arr[-10:, -10:].reshape(-1, 3),
        ])
        r_mean, g_mean, b_mean = corners[:, 0].mean(), corners[:, 1].mean(), corners[:, 2].mean()
        return (g_mean > r_mean * 1.3) and (g_mean > b_mean * 1.3) and (g_mean > 80)
    except Exception:
        return False


def has_black_bg(path: pathlib.Path, sample: int = 200) -> bool:
    try:
        img = Image.open(path).convert("RGB").resize((sample, sample))
        arr = np.array(img, dtype=np.float32)
        corners = np.concatenate([
            arr[:10, :10].reshape(-1, 3),
            arr[:10, -10:].reshape(-1, 3),
            arr[-10:, :10].reshape(-1, 3),
            arr[-10:, -10:].reshape(-1, 3),
        ])
        return corners.mean() < 30
    except Exception:
        return False


# ── Main ────────────────────────────────────────────────────────────────────

def has_white_bg(path: pathlib.Path, sample: int = 200) -> bool:
    try:
        img = Image.open(path).convert("RGB").resize((sample, sample))
        arr = np.array(img, dtype=np.float32)
        corners = np.concatenate([
            arr[:10, :10].reshape(-1, 3),
            arr[:10, -10:].reshape(-1, 3),
            arr[-10:, :10].reshape(-1, 3),
            arr[-10:, -10:].reshape(-1, 3),
        ])
        return corners.mean() > 220
    except Exception:
        return False


def main() -> None:
    parser = argparse.ArgumentParser(description="Background removal for Agnix Studio logos")
    parser.add_argument("--agnix", metavar="PATH", help="Path to Agnix Studio logo (white or green BG)")
    parser.add_argument("--antar", metavar="PATH", help="Path to ANTAR title logo (green or black BG)")
    parser.add_argument("--hero", metavar="PATH", help="Path to hero background image")
    parser.add_argument("positional", nargs="*", metavar="PATH",
                        help="Positional: [agnix_logo] [antar_title] [hero_bg]")
    args = parser.parse_args()

    agnix_src: pathlib.Path | None = None
    antar_src: pathlib.Path | None = None
    hero_src: pathlib.Path | None = None

    if args.agnix:
        agnix_src = pathlib.Path(args.agnix)
    if args.antar:
        antar_src = pathlib.Path(args.antar)
    if args.hero:
        hero_src = pathlib.Path(args.hero)

    if args.positional:
        if len(args.positional) >= 1 and not agnix_src:
            agnix_src = pathlib.Path(args.positional[0])
        if len(args.positional) >= 2 and not antar_src:
            antar_src = pathlib.Path(args.positional[1])
        if len(args.positional) >= 3 and not hero_src:
            hero_src = pathlib.Path(args.positional[2])

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    if agnix_src and agnix_src.exists():
        out = OUT_DIR / "agnix-logo-transparent.png"
        if has_white_bg(agnix_src):
            remove_white_bg(agnix_src, out)
        else:
            remove_green_bg(agnix_src, out)
        shutil.copy2(out, OUT_DIR / "agnix-logo-transparent@2x.png")
        print(f"  Copied @2x variant.")
    else:
        print(f"\n⚠  Agnix Studio logo not found — skipping.")
        if agnix_src:
            print(f"   Looked for: {agnix_src}")

    if antar_src and antar_src.exists():
        out = OUT_DIR / "antar-title-transparent.png"
        if has_green_bg(antar_src):
            remove_green_bg(antar_src, out)
        else:
            remove_black_bg(antar_src, out)
        shutil.copy2(out, OUT_DIR / "antar-title-transparent@2x.png")
        print(f"  Copied @2x variant.")
    else:
        print(f"\n⚠  ANTAR title logo not found — skipping.")
        if antar_src:
            print(f"   Looked for: {antar_src}")

    if hero_src and hero_src.exists():
        target = OUT_DIR / "hero-bg.jpg"
        print(f"\nHero background: {hero_src.name} → hero-bg.jpg")
        img = Image.open(hero_src).convert("RGB")
        img.save(target, "JPEG", quality=92, optimize=True)
        print(f"  Saved: {target}  ({img.width}×{img.height})")
    else:
        _canonicalise_hero(OUT_DIR, {agnix_src, antar_src})

    print("\nDone. Run verify_alpha.py to confirm transparency.")


def _canonicalise_hero(directory: pathlib.Path, exclude: set) -> None:
    """Find the hero background and export it as hero-bg.jpg at quality 92."""
    target = directory / "hero-bg.jpg"
    if target.exists():
        return

    candidates = [
        p for p in candidate_images(directory)
        if p not in exclude
        and "transparent" not in p.name.lower()
        and "verify" not in p.name.lower()
        and not p.name.startswith("_")
    ]
    if not candidates:
        return

    best = max(candidates, key=lambda p: p.stat().st_size)
    print(f"\nHero background: {best.name} → hero-bg.jpg")
    img = Image.open(best).convert("RGB")
    img.save(target, "JPEG", quality=92, optimize=True)
    print(f"  Saved: {target}  ({img.width}×{img.height})")


if __name__ == "__main__":
    main()
