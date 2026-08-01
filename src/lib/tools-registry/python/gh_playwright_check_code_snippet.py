"""
Tool: playwright_check_code_snippet
Source: microsoft/playwright (93,783 stars)
License: Apache-2.0
Original file: utils/doclint/linting-code-snippets/python/main.py

Description:
Playwright is a framework for Web Testing and Automation. It allows testing Chromium, Firefox and WebKit with a single API. 

Parameters:
  code_snippet: required

Repo URL: https://github.com/microsoft/playwright
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(code_snippet):
    """Execute check_code_snippet from microsoft/playwright."""
    try:
        import importlib

        # V.146: Try submodules if top-level import doesn't have the function
        submodules_to_try = ["playwright.sync_api", "playwright.async_api", "playwright._impl"]
        for submod_name in submodules_to_try:
            try:
                submod = importlib.import_module(submod_name)
                if hasattr(submod, "check_code_snippet"):
                    fn = getattr(submod, "check_code_snippet")
                    result = fn(code_snippet)
                    return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": submod_name}
            except (ImportError, AttributeError):
                continue

        try:
            mod = importlib.import_module("playwright")
            if hasattr(mod, "check_code_snippet"):
                fn = getattr(mod, "check_code_snippet")
                result = fn(code_snippet)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "microsoft/playwright"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'playwright' not installed. Install: pip install playwright",
            "repo_url": "https://github.com/microsoft/playwright",
            "original_function": "check_code_snippet",
            "docstring": "N/A",
            "params": ["code_snippet"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['code_snippet']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["code_snippet"]}))
