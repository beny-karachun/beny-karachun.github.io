"""Set local asset URLs to versions derived from their file contents."""

import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ("styles.css", "script.js", "resume.css", "benjamin-karachun-resume.pdf", "assets/circuit-atlas-matrix.jpg")

for page_name in ("index.html", "resume.html"):
    page = ROOT / page_name
    original = page.read_text()
    updated = original
    for asset in ASSETS:
        version = hashlib.sha256((ROOT / asset).read_bytes()).hexdigest()[:12]
        pattern = rf'((?:href|src)="){re.escape(asset)}(?:\?[^"\s]*)?("[\s>])'
        updated = re.sub(pattern, rf'\g<1>{asset}?v={version}\g<2>', updated)
    if updated != original:
        page.write_text(updated)
        print(f"Updated asset versions in {page_name}")
