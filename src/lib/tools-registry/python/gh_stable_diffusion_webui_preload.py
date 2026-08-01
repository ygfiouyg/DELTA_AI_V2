"""
Tool: stable-diffusion-webui_preload
Source: AUTOMATIC1111/stable-diffusion-webui (164,323 stars)
License: AGPL-3.0
Original file: extensions-builtin/LDSR/preload.py

Description:
Stable Diffusion web UI

Parameters:
  parser: required

Repo URL: https://github.com/AUTOMATIC1111/stable-diffusion-webui
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(parser):
    """Execute preload from AUTOMATIC1111/stable-diffusion-webui."""
    try:
        import importlib
        try:
            mod = importlib.import_module("stable_diffusion_webui")
            if hasattr(mod, "preload"):
                fn = getattr(mod, "preload")
                result = fn(parser)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "AUTOMATIC1111/stable-diffusion-webui"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'stable-diffusion-webui' not installed. Install: pip install stable-diffusion-webui",
            "repo_url": "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
            "original_function": "preload",
            "docstring": "N/A",
            "params": ["parser"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['parser']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["parser"]}))
