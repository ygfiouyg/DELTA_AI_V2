#!/usr/bin/env python3
"""Patch all gh_*.py tools to try submodules if top-level import fails."""
import re
from pathlib import Path

TOOLS_DIR = Path("/home/z/my-project/src/lib/tools-registry/python")

# Map of known submodules for common packages
SUBMODULE_HINTS = {
    "requests": ["requests._internal_utils", "requests.utils", "requests.sessions", "requests.models", "requests.adapters", "requests.hooks", "requests.auth", "requests.cookies", "requests.structures"],
    "flask": ["flask.logging", "flask.helpers", "flask.app", "flask.config", "flask.ctx", "flask.globals", "flask.wrappers", "flask.blueprints"],
    "whisper": ["whisper.audio", "whisper.decoding", "whisper.model", "whisper.tokenizer", "whisper.triton"],
    "langchain": ["langchain_core", "langchain_community", "langchain.chains", "langchain.agents", "langchain.tools", "langchain.utilities"],
    "django": ["django.conf", "django.core", "django.db", "django.utils", "django.http", "django.urls", "django.views"],
    "fastapi": ["fastapi.routing", "fastapi.params", "fastapi.security", "fastapi.middleware", "fastapi.encoders", "fastapi.openapi"],
    "playwright": ["playwright.sync_api", "playwright.async_api", "playwright._impl"],
    "scrapy": ["scrapy.spiders", "scrapy.crawler", "scrapy.selector", "scrapy.http", "scrapy.utils", "scrapy.pipelines"],
    "pandas": ["pandas.core", "pandas.io", "pandas.api", "pandas.util"],
    "numpy": ["numpy.core", "numpy.lib", "numpy.fft", "numpy.linalg", "numpy.random", "numpy.ma"],
    "transformers": ["transformers.models", "transformers.pipelines", "transformers.tokenization_utils", "transformers.modeling_utils"],
}

patched = 0
for f in TOOLS_DIR.glob("gh_*.py"):
    content = f.read_text()
    
    # Extract package name from content
    pkg_match = re.search(r"importlib\.import_module\(\"([^\"]+)\"\)", content)
    if not pkg_match:
        continue
    pkg_name = pkg_match.group(1)
    
    # Get the function name from filename
    fname = f.stem  # gh_requests_unicode_is_ascii
    parts = fname.replace("gh_", "").rsplit("_", 1)
    if len(parts) != 2:
        continue
    repo_part, func_name = parts
    # The function name in the file
    func_match = re.search(r'hasattr\(mod, "([^"]+)"\)', content)
    if not func_match:
        continue
    orig_func = func_match.group(1)
    
    # Skip if already patched
    if "submodules_to_try" in content:
        continue
    
    # Get submodules to try
    submodules = SUBMODULE_HINTS.get(pkg_name, [])
    if not submodules:
        continue
    
    # Build the new import logic
    submodules_str = ", ".join(f'"{s}"' for s in submodules)
    
    # Replace the import block
    old_block = f'''        try:
            mod = importlib.import_module("{pkg_name}")
            if hasattr(mod, "{orig_func}"):
                fn = getattr(mod, "{orig_func}")
                result = fn({", ".join(re.findall(r'def execute\s*\(([^)]*)\)', content)[0].split(",") if re.search(r'def execute\s*\(([^)]*)\)', content) else [])})
                return {{"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "{pkg_name}"}}'''
    
    # Actually let's just add submodule fallback BEFORE the original block
    # Insert after: try:\n        import importlib
    fallback_block = f'''
        # V.146: Try submodules if top-level import doesn't have the function
        submodules_to_try = [{submodules_str}]
        for submod_name in submodules_to_try:
            try:
                submod = importlib.import_module(submod_name)
                if hasattr(submod, "{orig_func}"):
                    fn = getattr(submod, "{orig_func}")
'''
    
    # Get the params from execute()
    exec_match = re.search(r'def execute\s*\(([^)]*)\)', content)
    if not exec_match:
        continue
    params = [p.strip().split("=")[0].split(":")[0].strip() for p in exec_match.group(1).split(",") if p.strip() and not p.startswith("*")]
    params_call = ", ".join(params)
    
    fallback_block += f'''                    result = fn({params_call})
                    return {{"success": True, "result": str(result)[:2000] if result is not None else "None", "source": submod_name}}
            except (ImportError, AttributeError):
                continue
'''
    
    # Insert the fallback block after `try:\n        import importlib\n`
    new_content = content.replace(
        '    try:\n        import importlib',
        '    try:\n        import importlib\n' + fallback_block
    )
    
    if new_content != content:
        f.write_text(new_content)
        patched += 1
        print(f"  ✅ {f.name}")

print(f"\n✅ Patched {patched} tools with submodule fallback")
