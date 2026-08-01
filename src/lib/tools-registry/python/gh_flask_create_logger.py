"""
Tool: flask_create_logger
Source: pallets/flask (72,016 stars)
License: BSD-3-Clause
Original file: src/flask/logging.py

Description:
The Python micro framework for building web applications.

Parameters:
  app: required

Repo URL: https://github.com/pallets/flask
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(app):
    """Execute create_logger from pallets/flask."""
    try:
        import importlib

        # V.146: Try submodules if top-level import doesn't have the function
        submodules_to_try = ["flask.logging", "flask.helpers", "flask.app", "flask.config", "flask.ctx", "flask.globals", "flask.wrappers", "flask.blueprints"]
        for submod_name in submodules_to_try:
            try:
                submod = importlib.import_module(submod_name)
                if hasattr(submod, "create_logger"):
                    fn = getattr(submod, "create_logger")
                    result = fn(app)
                    return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": submod_name}
            except (ImportError, AttributeError):
                continue

        try:
            mod = importlib.import_module("flask")
            if hasattr(mod, "create_logger"):
                fn = getattr(mod, "create_logger")
                result = fn(app)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "pallets/flask"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'flask' not installed. Install: pip install flask",
            "repo_url": "https://github.com/pallets/flask",
            "original_function": "create_logger",
            "docstring": "N/A",
            "params": ["app"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['app']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["app"]}))
