"""
Tool: rust_key
Source: rust-lang/rust (115,011 stars)
License: Apache-2.0
Original file: src/tools/clippy/util/versions.py

Description:
Empowering everyone to build reliable and efficient software.

Parameters:
  v: required

Repo URL: https://github.com/rust-lang/rust
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(v):
    """Execute key from rust-lang/rust."""
    try:
        import importlib
        try:
            mod = importlib.import_module("rust")
            if hasattr(mod, "key"):
                fn = getattr(mod, "key")
                result = fn(v)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "rust-lang/rust"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'rust' not installed. Install: pip install rust",
            "repo_url": "https://github.com/rust-lang/rust",
            "original_function": "key",
            "docstring": "N/A",
            "params": ["v"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['v']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["v"]}))
