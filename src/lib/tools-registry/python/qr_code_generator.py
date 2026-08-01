"""
Tool: qr_code_generator
Category: utility
Package: qrcode, pillow
Description: توليد QR codes بأنواع مختلفة — URL, text, WiFi, vCard, email.

Dependencies:
  - qrcode (pip install qrcode)
  - pillow (pip install pillow)

Input:
  {
    "data": "https://example.com",
    "output_path": "/tmp/qr.png",
    "size": 10,  # box size
    "border": 4,
    "fill_color": "black",
    "back_color": "white",
    "error_correction": "L" | "M" | "Q" | "H"
  }

Output:
  {"success": true, "file": "/tmp/qr.png", "size_kb": 2.5, "data": "..."}
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)

ERROR_LEVELS = {"L": 1, "M": 0, "Q": 3, "H": 2}  # qrcode.constants.ERROR_CORRECT_*


def generate(data: str, output_path: str = "/tmp/qr.png", size: int = 10, border: int = 4, fill_color: str = "black", back_color: str = "white", error_correction: str = "M"):
    if not data:
        return {"success": False, "error": "data required"}

    try:
        import qrcode
    except ImportError as e:
        return {"success": False, "error": f"qrcode not installed: {e}"}

    try:
        ec = ERROR_LEVELS.get(error_correction, 0)
        qr = qrcode.QRCode(
            version=1,
            error_correction=ec,
            box_size=size,
            border=border,
        )
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color=fill_color, back_color=back_color)
        img.save(output_path)
        size_kb = os.path.getsize(output_path) / 1024
        return {
            "success": True,
            "file": output_path,
            "size_kb": round(size_kb, 2),
            "data": data[:100],
            "data_length": len(data),
            "dimensions": list(img.size),
            "error_correction": error_correction,
        }
    except Exception as e:
        return {"success": False, "error": f"QR generation failed: {str(e)[:200]}"}


def generate_wifi(ssid: str, password: str, security: str = "WPA", hidden: bool = False, output_path: str = "/tmp/qr_wifi.png"):
    """Generate WiFi QR code."""
    data = f"WIFI:T:{security};S:{ssid};P:{password};H:{'true' if hidden else 'false'};;"
    return generate(data, output_path)


def generate_vcard(name: str, phone: str = "", email: str = "", org: str = "", output_path: str = "/tmp/qr_vcard.png"):
    """Generate vCard QR code."""
    data = f"BEGIN:VCARD\nVERSION:3.0\nFN:{name}\nORG:{org}\nTEL:{phone}\nEMAIL:{email}\nEND:VCARD"
    return generate(data, output_path)



def _dispatch(args):
    return generate(args.get("data", ""), args.get("output_path", "/tmp/qr.png"), int(args.get("size", 10)), int(args.get("border", 4)), args.get("fill_color", "black"), args.get("back_color", "white"), args.get("error_correction", "M"))


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
    parser.add_argument("--data", required=True)
    parser.add_argument("--output_path", default="/tmp/qr.png")
    parser.add_argument("--size", type=int, default=10)
    parser.add_argument("--border", type=int, default=4)
    parser.add_argument("--fill_color", default="black")
    parser.add_argument("--back_color", default="white")
    parser.add_argument("--error_correction", default="M", choices=["L", "M", "Q", "H"])
    args = parser.parse_args()
    result = generate(args.data, args.output_path, args.size, args.border, args.fill_color, args.back_color, args.error_correction)
    print(json.dumps(result, ensure_ascii=False))
