"""
Tool: whisper_load_audio
Source: openai/whisper (106,333 stars)
License: MIT
Original file: whisper/audio.py

Description:
Robust Speech Recognition via Large-Scale Weak Supervision

Parameters:
  file: required
  sr: SAMPLE_RATE

Repo URL: https://github.com/openai/whisper
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(file, sr):
    """Execute load_audio from openai/whisper."""
    try:
        import importlib
        try:
            mod = importlib.import_module("whisper")
            if hasattr(mod, "load_audio"):
                fn = getattr(mod, "load_audio")
                result = fn(file, sr)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "openai/whisper"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'whisper' not installed. Install: pip install whisper",
            "repo_url": "https://github.com/openai/whisper",
            "original_function": "load_audio",
            "docstring": "N/A",
            "params": ["file", "sr"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['file', 'sr']
    filtered = {k: v for k, v in args.items() if k in valid_keys} if valid_keys else args
    return execute(**filtered)


if __name__ == "__main__":
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["file", "sr"]}))
