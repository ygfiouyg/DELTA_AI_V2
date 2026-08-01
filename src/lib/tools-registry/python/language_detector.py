"""
Tool: language_detector
Category: ai/nlp
Package: langdetect (fallback: pure-Python heuristic)
Description: كشف لغة نص معين ويرجع اللغة + نسبة الثقة.

Dependencies:
  - langdetect (pip install langdetect)

Input:
  {"text": "some text in any language"}

Output:
  {
    "success": true,
    "language": "en",
    "confidence": 0.98,
    "alternatives": [{"lang": "fr", "prob": 0.02}]
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


# Unicode ranges for quick detection
RANGES = [
    ("ar", 0x0600, 0x06FF),  # Arabic
    ("zh", 0x4E00, 0x9FFF),  # CJK Unified
    ("ja", 0x3040, 0x30FF),  # Hiragana + Katakana
    ("ko", 0xAC00, 0xD7AF),  # Hangul Syllables
    ("ru", 0x0400, 0x04FF),  # Cyrillic
    ("el", 0x0370, 0x03FF),  # Greek
    ("he", 0x0590, 0x05FF),  # Hebrew
    ("hi", 0x0900, 0x097F),  # Devanagari
    ("th", 0x0E00, 0x0E7F),  # Thai
]


def detect_by_unicode(text: str) -> list:
    """Quick detection via Unicode ranges."""
    counts = Counter = {}
    for char in text:
        cp = ord(char)
        for lang, lo, hi in RANGES:
            if lo <= cp <= hi:
                counts[lang] = counts.get(lang, 0) + 1
                break
    return sorted(counts.items(), key=lambda x: x[1], reverse=True)


def detect(text: str):
    if not text or not text.strip():
        return {"success": False, "error": "text required"}

    # Try langdetect first
    try:
        from langdetect import detect as ld_detect, detect_langs, DetectorFactory
        DetectorFactory.seed = 0  # deterministic
        langs = detect_langs(text)
        if langs:
            top = langs[0]
            return {
                "success": True,
                "language": top.lang,
                "confidence": round(top.prob, 4),
                "alternatives": [{"lang": l.lang, "prob": round(l.prob, 4)} for l in langs[1:4]],
                "method": "langdetect",
            }
    except ImportError:
        pass
    except Exception:
        pass

    # Fallback: Unicode-based detection
    detected = detect_by_unicode(text)
    total_chars = sum(c for _, c in detected)
    if not detected:
        # Likely Latin/English
        ascii_count = sum(1 for c in text if c.isascii() and c.isalpha())
        if ascii_count > 0:
            return {
                "success": True,
                "language": "en",
                "confidence": 0.7,
                "alternatives": [],
                "method": "unicode_heuristic",
            }
        return {"success": False, "error": "Could not detect language"}

    top_lang, top_count = detected[0]
    confidence = round(top_count / max(1, total_chars), 4)
    return {
        "success": True,
        "language": top_lang,
        "confidence": confidence,
        "alternatives": [{"lang": l, "prob": round(c / max(1, total_chars), 4)} for l, c in detected[1:4]],
        "method": "unicode_heuristic",
    }



def _dispatch(args):
    return detect(args.get("text", ""))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True)
    args = parser.parse_args()
    print(json.dumps(detect(args.text), ensure_ascii=False))
