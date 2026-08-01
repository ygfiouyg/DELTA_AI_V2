"""
Tool: AutoGPT_remove_color_codes
Source: Significant-Gravitas/AutoGPT (185,748 stars)
License: NOASSERTION
Original file: autogpt_platform/autogpt_libs/autogpt_libs/logging/utils.py

Description:
AutoGPT is the vision of accessible AI for everyone, to use and to build on. Our mission is to provide the tools, so that you can focus on what matters.

Parameters:
  s: required

Repo URL: https://github.com/Significant-Gravitas/AutoGPT
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(s):
    """Execute remove_color_codes from Significant-Gravitas/AutoGPT."""
    try:
        import importlib
        try:
            mod = importlib.import_module("autogpt")
            if hasattr(mod, "remove_color_codes"):
                fn = getattr(mod, "remove_color_codes")
                result = fn(s)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "Significant-Gravitas/AutoGPT"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'AutoGPT' not installed. Install: pip install autogpt",
            "repo_url": "https://github.com/Significant-Gravitas/AutoGPT",
            "original_function": "remove_color_codes",
            "docstring": "N/A",
            "params": ["s"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['s']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["s"]}))
