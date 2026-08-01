"""
Tool: whisper_pad_or_trim
Source: openai/whisper (106,333 stars)
License: MIT
Original file: whisper/audio.py

Description:
Robust Speech Recognition via Large-Scale Weak Supervision

Parameters:
  array: required
  length: N_SAMPLES
  axis: -1

Repo URL: https://github.com/openai/whisper
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute(array, length, axis):
    """Execute pad_or_trim from openai/whisper."""
    try:
        import importlib

        # V.146: Try submodules if top-level import doesn't have the function
        submodules_to_try = ["whisper.audio", "whisper.decoding", "whisper.model", "whisper.tokenizer", "whisper.triton"]
        for submod_name in submodules_to_try:
            try:
                submod = importlib.import_module(submod_name)
                if hasattr(submod, "pad_or_trim"):
                    fn = getattr(submod, "pad_or_trim")
                    result = fn(array, length, axis)
                    return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": submod_name}
            except (ImportError, AttributeError):
                continue

        try:
            mod = importlib.import_module("whisper")
            if hasattr(mod, "pad_or_trim"):
                fn = getattr(mod, "pad_or_trim")
                result = fn(array, length, axis)
                return {"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "openai/whisper"}
        except ImportError:
            pass
        
        return {
            "success": False,
            "error": f"Package 'whisper' not installed. Install: pip install whisper",
            "repo_url": "https://github.com/openai/whisper",
            "original_function": "pad_or_trim",
            "docstring": "N/A",
            "params": ["array", "length", "axis"],
        }
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = ['array', 'length', 'axis']
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
    print(json.dumps({"usage": "Use --args_file <path> with JSON args", "params": ["array", "length", "axis"]}))
