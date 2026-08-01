"""
Tool: ocr_extractor
Category: media
Package: pytesseract, pillow
Description: استخراج النص من صور باستخدام Tesseract OCR.

Dependencies:
  - pytesseract (pip install pytesseract)
  - pillow (pip install pillow)
  - System: tesseract-ocr (apt install tesseract-ocr)

Input:
  {
    "image_path": "/path/to/image.png",
    "language": "eng" | "ara" | "eng+ara",
    "output_format": "text" | "data" | "hocr"
  }

Output:
  {
    "success": true,
    "text": "...",
    "confidence": 87.5,
    "words_count": 42,
    "lines_count": 5
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def extract_text(image_path: str, language: str = "eng", output_format: str = "text"):
    if not image_path or not os.path.exists(image_path):
        return {"success": False, "error": f"image file not found: {image_path}"}

    try:
        import pytesseract
        from PIL import Image
    except ImportError as e:
        return {"success": False, "error": f"pytesseract/Pillow not installed: {e}"}

    try:
        img = Image.open(image_path)
    except Exception as e:
        return {"success": False, "error": f"failed to open image: {str(e)[:200]}"}

    try:
        if output_format == "text":
            text = pytesseract.image_to_string(img, lang=language)
            words = [w for w in text.split() if w.strip()]
            lines = [l for l in text.split("\n") if l.strip()]
            return {
                "success": True,
                "text": text.strip(),
                "words_count": len(words),
                "lines_count": len(lines),
                "language": language,
            }

        elif output_format == "data":
            data = pytesseract.image_to_data(img, lang=language, output_type=pytesseract.Output.DICT)
            words = []
            confidences = []
            for i, txt in enumerate(data["text"]):
                if txt.strip():
                    words.append({
                        "text": txt,
                        "confidence": float(data["conf"][i]),
                        "bbox": [int(data["left"][i]), int(data["top"][i]), int(data["width"][i]), int(data["height"][i])],
                    })
                    if data["conf"][i] > 0:
                        confidences.append(float(data["conf"][i]))

            avg_conf = sum(confidences) / len(confidences) if confidences else 0
            return {
                "success": True,
                "words": words[:100],
                "words_count": len(words),
                "confidence": round(avg_conf, 2),
                "language": language,
                "text": " ".join(w["text"] for w in words),
            }

        elif output_format == "hocr":
            hocr = pytesseract.image_to_pdf_or_hocr(img, lang=language, extension="hocr")
            return {
                "success": True,
                "hocr": hocr.decode("utf-8")[:5000] if isinstance(hocr, bytes) else str(hocr)[:5000],
                "language": language,
            }

        else:
            return {"success": False, "error": f"unknown output_format: {output_format}"}

    except pytesseract.TesseractNotFoundError:
        return {"success": False, "error": "tesseract binary not found. Install with: apt-get install tesseract-ocr"}
    except Exception as e:
        return {"success": False, "error": f"OCR failed: {str(e)[:200]}"}



def _dispatch(args):
    return extract_text(args.get("image_path", ""), args.get("language", "eng"), args.get("output_format", "text"))


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
    parser.add_argument("--image_path", required=True)
    parser.add_argument("--language", default="eng")
    parser.add_argument("--output_format", default="text", choices=["text", "data", "hocr"])
    args = parser.parse_args()
    result = extract_text(args.image_path, args.language, args.output_format)
    print(json.dumps(result, ensure_ascii=False))
