"""
Tool: node_DoMain
Source: nodejs/node (118,597 stars)
License: NOASSERTION
Original file: tools/v8_gypfiles/ForEachFormat.py

Description:
Node.js JavaScript runtime ✨🐢🚀✨

Parameters:
  args: required

Repo URL: https://github.com/nodejs/node
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(args):
    """Execute DoMain from nodejs/node."""
    try:
        import importlib
        try:
            mod = importlib.import_module("node")
            if hasattr(mod, "DoMain"):
                fn = getattr(mod, "DoMain")
                result = fn(args)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "nodejs/node"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'node' not installed. Install: pip install node",
            "repo_url": "https://github.com/nodejs/node",
            "original_function": "DoMain",
            "docstring": "N/A",
            "params": ["args"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['args']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["args"]}))
