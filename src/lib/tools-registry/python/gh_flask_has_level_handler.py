"""
Tool: flask_has_level_handler
Source: pallets/flask (72,016 stars)
License: BSD-3-Clause
Original file: src/flask/logging.py

Description:
The Python micro framework for building web applications.

Parameters:
  logger: required

Repo URL: https://github.com/pallets/flask
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(logger):
    """Execute has_level_handler from pallets/flask."""
    try:
        import importlib

        # V.146: Try submodules if top-level import doesn't have the function
        submodules_to_try = ["flask.logging", "flask.helpers", "flask.app", "flask.config", "flask.ctx", "flask.globals", "flask.wrappers", "flask.blueprints"]
        for submod_name in submodules_to_try:
            try:
                submod = importlib.import_module(submod_name)
                if hasattr(submod, "has_level_handler"):
                    fn = getattr(submod, "has_level_handler")
                    result = fn(logger)
                    return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": submod_name}
            except (ImportError, AttributeError):
                continue

        try:
            mod = importlib.import_module("flask")
            if hasattr(mod, "has_level_handler"):
                fn = getattr(mod, "has_level_handler")
                result = fn(logger)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "pallets/flask"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'flask' not installed. Install: pip install flask",
            "repo_url": "https://github.com/pallets/flask",
            "original_function": "has_level_handler",
            "docstring": "N/A",
            "params": ["logger"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['logger']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["logger"]}))
