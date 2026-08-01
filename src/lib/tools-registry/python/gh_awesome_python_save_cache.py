"""
Tool: awesome-python_save_cache
Source: vinta/awesome-python (311,494 stars)
License: NOASSERTION
Original file: website/fetch_github_stars.py

Description:
Build a GraphQL query with aliases for up to 100 repos.

Parameters:
  cache: required

Repo URL: https://github.com/vinta/awesome-python
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(cache):
    """Execute save_cache from vinta/awesome-python."""
    try:
        import importlib
        try:
            mod = importlib.import_module("awesome_python")
            if hasattr(mod, "save_cache"):
                fn = getattr(mod, "save_cache")
                result = fn(cache)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "vinta/awesome-python"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'awesome-python' not installed. Install: pip install awesome-python",
            "repo_url": "https://github.com/vinta/awesome-python",
            "original_function": "save_cache",
            "docstring": "Build a GraphQL query with aliases for up to 100 repos.",
            "params": ["cache"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['cache']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["cache"]}))
