"""
Tool: requests_dispatch_hook
Source: psf/requests (54,201 stars)
License: Apache-2.0
Original file: src/requests/hooks.py

Description:
A simple, yet elegant, HTTP library.

Parameters:
  key: required
  hooks: required
  hook_data: required

Repo URL: https://github.com/psf/requests
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(key, hooks, hook_data):
    """Execute dispatch_hook from psf/requests."""
    try:
        import importlib

        # V.146: Try submodules if top-level import doesn't have the function
        submodules_to_try = ["requests._internal_utils", "requests.utils", "requests.sessions", "requests.models", "requests.adapters", "requests.hooks", "requests.auth", "requests.cookies", "requests.structures"]
        for submod_name in submodules_to_try:
            try:
                submod = importlib.import_module(submod_name)
                if hasattr(submod, "dispatch_hook"):
                    fn = getattr(submod, "dispatch_hook")
                    result = fn(key, hooks, hook_data)
                    return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": submod_name}
            except (ImportError, AttributeError):
                continue

        try:
            mod = importlib.import_module("requests")
            if hasattr(mod, "dispatch_hook"):
                fn = getattr(mod, "dispatch_hook")
                result = fn(key, hooks, hook_data)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "psf/requests"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'requests' not installed. Install: pip install requests",
            "repo_url": "https://github.com/psf/requests",
            "original_function": "dispatch_hook",
            "docstring": "N/A",
            "params": ["key", "hooks", "hook_data"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['key', 'hooks', 'hook_data']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["key", "hooks", "hook_data"]}))
