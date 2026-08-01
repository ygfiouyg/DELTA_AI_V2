"""
Tool: image_processor
Category: media
Package: pillow, numpy
Description: معالجة الصور — resize, crop, rotate, filter, watermark, format conversion.

Dependencies:
  - pillow (pip install pillow)
  - numpy (pip install numpy)

Input:
  {
    "input_path": "/path/to/input.jpg",
    "output_path": "/path/to/output.jpg",
    "operation": "resize" | "crop" | "rotate" | "grayscale" | "blur" | "sharpen" | "thumbnail" | "watermark" | "convert",
    "params": {
      "width": 800, "height": 600,
      "angle": 90,
      "filter": "gaussian" | "box" | "median",
      "radius": 2,
      "watermark_text": "© 2025",
      "format": "JPEG" | "PNG" | "WEBP"
    }
  }

Output:
  {"success": true, "file": "/path/to/output.jpg", "size_kb": 12.5, "dimensions": [800, 600]}
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def process(input_path: str, output_path: str, operation: str, params: dict = None):
    if not input_path or not os.path.exists(input_path):
        return {"success": False, "error": f"input file not found: {input_path}"}

    try:
        from PIL import Image, ImageFilter, ImageDraw, ImageFont
    except ImportError as e:
        return {"success": False, "error": f"Pillow not installed: {e}"}

    params = params or {}

    try:
        img = Image.open(input_path)
        original_size = os.path.getsize(input_path) / 1024
        original_dims = list(img.size)
    except Exception as e:
        return {"success": False, "error": f"failed to open image: {str(e)[:200]}"}

    try:
        if operation == "resize":
            w = int(params.get("width", img.width))
            h = int(params.get("height", img.height))
            img = img.resize((w, h), Image.LANCZOS)

        elif operation == "thumbnail":
            max_size = (int(params.get("width", 300)), int(params.get("height", 300)))
            img.thumbnail(max_size, Image.LANCZOS)

        elif operation == "crop":
            left = int(params.get("left", 0))
            top = int(params.get("top", 0))
            right = int(params.get("right", img.width))
            bottom = int(params.get("bottom", img.height))
            img = img.crop((left, top, right, bottom))

        elif operation == "rotate":
            angle = float(params.get("angle", 90))
            expand = bool(params.get("expand", True))
            img = img.rotate(angle, expand=expand)

        elif operation == "grayscale":
            img = img.convert("L")

        elif operation == "blur":
            radius = int(params.get("radius", 2))
            img = img.filter(ImageFilter.GaussianBlur(radius=radius))

        elif operation == "sharpen":
            img = img.filter(ImageFilter.SHARPEN)

        elif operation == "watermark":
            text = params.get("watermark_text", "WATERMARK")
            # Create overlay
            overlay = Image.new("RGBA", img.size, (255, 255, 255, 0))
            draw = ImageDraw.Draw(overlay)
            try:
                font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", max(20, img.width // 30))
            except (IOError, OSError):
                font = ImageFont.load_default()
            # Position: bottom-right
            text_w = draw.textlength(text, font=font)
            text_h = font.size
            margin = 20
            x = img.width - text_w - margin
            y = img.height - text_h - margin
            # Draw shadow + text
            draw.text((x + 2, y + 2), text, font=font, fill=(0, 0, 0, 128))
            draw.text((x, y), text, font=font, fill=(255, 255, 255, 180))
            # Convert image to RGBA, composite, convert back
            if img.mode != "RGBA":
                img = img.convert("RGBA")
            img = Image.alpha_composite(img, overlay)
            img = img.convert("RGB")

        elif operation == "convert":
            fmt = params.get("format", "JPEG").upper()
            if fmt in ("JPEG", "JPG"):
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                img.save(output_path, format="JPEG", quality=int(params.get("quality", 85)))
            elif fmt == "PNG":
                img.save(output_path, format="PNG")
            elif fmt == "WEBP":
                img.save(output_path, format="WEBP", quality=int(params.get("quality", 85)))
            else:
                return {"success": False, "error": f"unsupported format: {fmt}"}
            size_kb = os.path.getsize(output_path) / 1024
            return {
                "success": True,
                "file": output_path,
                "size_kb": round(size_kb, 2),
                "dimensions": list(img.size),
                "original_dimensions": original_dims,
                "original_size_kb": round(original_size, 2),
                "operation": operation,
            }

        else:
            return {"success": False, "error": f"unknown operation: {operation}"}

        # Save
        if output_path.lower().endswith((".jpg", ".jpeg")):
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img.save(output_path, "JPEG", quality=85)
        elif output_path.lower().endswith(".png"):
            img.save(output_path, "PNG")
        elif output_path.lower().endswith(".webp"):
            img.save(output_path, "WEBP", quality=85)
        else:
            img.save(output_path)

        size_kb = os.path.getsize(output_path) / 1024
        return {
            "success": True,
            "file": output_path,
            "size_kb": round(size_kb, 2),
            "dimensions": list(img.size),
            "original_dimensions": original_dims,
            "original_size_kb": round(original_size, 2),
            "operation": operation,
        }

    except Exception as e:
        return {"success": False, "error": f"image processing failed: {str(e)[:200]}"}



def _dispatch(args):
    return process(args.get("input_path", ""), args.get("output_path", ""), args.get("operation", ""), args.get("params", {}))


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
    parser.add_argument("--input_path", required=True)
    parser.add_argument("--output_path", required=True)
    parser.add_argument("--operation", required=True, choices=["resize", "crop", "rotate", "grayscale", "blur", "sharpen", "thumbnail", "watermark", "convert"])
    parser.add_argument("--params", default="{}", help="JSON string of params")
    args = parser.parse_args()
    params = json.loads(args.params)
    result = process(args.input_path, args.output_path, args.operation, params)
    print(json.dumps(result, ensure_ascii=False))
