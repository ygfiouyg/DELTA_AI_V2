"""
Tool: vscode_patch_dmg_icon
Source: microsoft/vscode (188,085 stars)
License: MIT
Original file: build/darwin/patch-dmg.py

Description:
Visual Studio Code

Parameters:
  dmg_path: required
  new_icon_path: required

Repo URL: https://github.com/microsoft/vscode
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(dmg_path, new_icon_path):
    """Execute patch_dmg_icon from microsoft/vscode."""
    try:
        import importlib
        try:
            mod = importlib.import_module("vscode")
            if hasattr(mod, "patch_dmg_icon"):
                fn = getattr(mod, "patch_dmg_icon")
                result = fn(dmg_path, new_icon_path)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "microsoft/vscode"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'vscode' not installed. Install: pip install vscode",
            "repo_url": "https://github.com/microsoft/vscode",
            "original_function": "patch_dmg_icon",
            "docstring": "N/A",
            "params": ["dmg_path", "new_icon_path"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['dmg_path', 'new_icon_path']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["dmg_path", "new_icon_path"]}))
