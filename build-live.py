"""Makes a single self-contained copy of the calculator (for instant phone testing)."""
import json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "src/calculator.html").read_text()
calc = (root / "src/lib/calc.js").read_text()
rates = json.dumps(json.loads((root / "src/lib/rates.json").read_text()))
tag = '<script src="lib/calc.js"></script>'
assert tag in html
out = html.replace(tag, "<script>window.__RATES__=" + rates + ";</script>\n<script>\n" + calc + "\n</script>")
dest = pathlib.Path("/mnt/user-data/outputs/calculator-live.html")
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text(out)
print("wrote", dest, len(out), "bytes")
