"""
Tool: translator
Category: ai/nlp
Package: deep-translator, googletrans (fallback)
Description: ترجمة نص بين لغات مختلفة باستخدام محركات متعددة.

Dependencies:
  - deep-translator (pip install deep-translator)

Input:
  {
    "text": "Hello world",
    "source_lang": "en" | "auto",
    "target_lang": "ar",
    "engine": "google" | "microsoft" | "deepl" | "mymemory"
  }

Output:
  {
    "success": true,
    "original": "Hello world",
    "translated": "مرحبا بالعالم",
    "source_lang": "en",
    "target_lang": "ar",
    "engine": "google"
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def translate(text: str, source_lang: str = "auto", target_lang: str = "en", engine: str = "google"):
    if not text or not text.strip():
        return {"success": False, "error": "text required"}
    if not target_lang:
        return {"success": False, "error": "target_lang required"}

    try:
        if engine == "google":
            from deep_translator import GoogleTranslator
            t = GoogleTranslator(source=source_lang if source_lang != "auto" else "auto", target=target_lang)
            result = t.translate(text)
        elif engine == "microsoft":
            from deep_translator import MicrosoftTranslator
            t = MicrosoftTranslator(source=source_lang if source_lang != "auto" else "auto", target=target_lang)
            result = t.translate(text)
        elif engine == "deepl":
            from deep_translator import DeeplTranslator
            t = DeeplTranslator(source=source_lang if source_lang != "auto" else None, target=target_lang, use_free_api=True)
            result = t.translate(text)
        elif engine == "mymemory":
            from deep_translator import MyMemoryTranslator
            t = MyMemoryTranslator(source=source_lang if source_lang != "auto" else "auto", target=target_lang)
            result = t.translate(text)
        else:
            return {"success": False, "error": f"unknown engine: {engine}"}

        return {
            "success": True,
            "original": text,
            "translated": result,
            "source_lang": source_lang,
            "target_lang": target_lang,
            "engine": engine,
            "original_length": len(text),
            "translated_length": len(result) if result else 0,
        }
    except ImportError as e:
        return {"success": False, "error": f"deep-translator not installed: {e}"}
    except Exception as e:
        return {"success": False, "error": f"translation failed: {str(e)[:200]}"}


def detect_language(text: str):
    """Detect source language."""
    try:
        from deep_translator import GoogleTranslator
        t = GoogleTranslator(source="auto", target="en")
        # Trigger detection
        t.translate(text)
        detected = t.detect_language(text) if hasattr(t, "detect_language") else None
        return {"success": True, "language": detected, "engine": "google"}
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}



def _dispatch(args):
    return translate(args.get("text", ""), args.get("source_lang", "auto"), args.get("target_lang", "en"), args.get("engine", "google"))


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
    parser.add_argument("--source_lang", default="auto")
    parser.add_argument("--target_lang", default="en")
    parser.add_argument("--engine", default="google", choices=["google", "microsoft", "deepl", "mymemory"])
    args = parser.parse_args()
    result = translate(args.text, args.source_lang, args.target_lang, args.engine)
    print(json.dumps(result, ensure_ascii=False))
