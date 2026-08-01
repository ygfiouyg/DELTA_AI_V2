"""
Tool: scrapy_job_dir
Source: scrapy/scrapy (63,532 stars)
License: BSD-3-Clause
Original file: scrapy/utils/job.py

Description:
Scrapy, a fast high-level web crawling & scraping framework for Python.

Parameters:
  settings: required

Repo URL: https://github.com/scrapy/scrapy
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(settings):
    """Execute job_dir from scrapy/scrapy."""
    try:
        import importlib

        # V.146: Try submodules if top-level import doesn't have the function
        submodules_to_try = ["scrapy.spiders", "scrapy.crawler", "scrapy.selector", "scrapy.http", "scrapy.utils", "scrapy.pipelines"]
        for submod_name in submodules_to_try:
            try:
                submod = importlib.import_module(submod_name)
                if hasattr(submod, "job_dir"):
                    fn = getattr(submod, "job_dir")
                    result = fn(settings)
                    return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": submod_name}
            except (ImportError, AttributeError):
                continue

        try:
            mod = importlib.import_module("scrapy")
            if hasattr(mod, "job_dir"):
                fn = getattr(mod, "job_dir")
                result = fn(settings)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "scrapy/scrapy"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'scrapy' not installed. Install: pip install scrapy",
            "repo_url": "https://github.com/scrapy/scrapy",
            "original_function": "job_dir",
            "docstring": "N/A",
            "params": ["settings"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['settings']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["settings"]}))
