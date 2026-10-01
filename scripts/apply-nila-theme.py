from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS_PATH = ROOT / "client/src/index.css"
css = CSS_PATH.read_text(encoding="utf-8").lower()
expected = ["#fff9bf", "#fffef0", "#111111", "#333333", "#f2c200", "#000000", "#fff0a6", "#1a1a1a", "#fff3b0"]
missing = [color for color in expected if color not in css]
if missing:
    raise SystemExit(f"Yellow-and-black palette is incomplete; missing: {', '.join(missing)}")
print(f"Verified yellow-and-black Selvi palette in {CSS_PATH}")
