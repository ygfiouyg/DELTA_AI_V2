"""
Tool: ComfyUI_enable_args_parsing
Source: Comfy-Org/ComfyUI (123,080 stars)
License: GPL-3.0
Original file: comfy/options.py

Description:
The most powerful and modular diffusion model GUI, api and backend with a graph/nodes interface.

Parameters:
  enable: True

Repo URL: https://github.com/Comfy-Org/ComfyUI
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(enable):
    """Execute enable_args_parsing from Comfy-Org/ComfyUI."""
    try:
        import importlib
        try:
            mod = importlib.import_module("comfyui")
            if hasattr(mod, "enable_args_parsing"):
                fn = getattr(mod, "enable_args_parsing")
                result = fn(enable)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "Comfy-Org/ComfyUI"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'ComfyUI' not installed. Install: pip install comfyui",
            "repo_url": "https://github.com/Comfy-Org/ComfyUI",
            "original_function": "enable_args_parsing",
            "docstring": "N/A",
            "params": ["enable"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['enable']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["enable"]}))
