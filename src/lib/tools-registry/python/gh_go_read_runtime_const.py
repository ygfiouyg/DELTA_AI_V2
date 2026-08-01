"""
Tool: go_read_runtime_const
Source: golang/go (135,455 stars)
License: BSD-3-Clause
Original file: src/runtime/runtime-gdb.py

Description:
The Go programming language

Parameters:
  varname: required
  default: required

Repo URL: https://github.com/golang/go
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(varname, default):
    """Execute read_runtime_const from golang/go."""
    try:
        import importlib
        try:
            mod = importlib.import_module("go")
            if hasattr(mod, "read_runtime_const"):
                fn = getattr(mod, "read_runtime_const")
                result = fn(varname, default)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "golang/go"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'go' not installed. Install: pip install go",
            "repo_url": "https://github.com/golang/go",
            "original_function": "read_runtime_const",
            "docstring": "N/A",
            "params": ["varname", "default"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['varname', 'default']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["varname", "default"]}))
