#!/usr/bin/env python3
"""
V.130: Generate callable wrappers for installed packages.
"""
import json, os

def get_import_name(pkg):
    mappings = {
        "PIL":"PIL","PyPDF2":"PyPDF2","RapidFuzz":"rapidfuzz","Faker":"faker",
        "APScheduler":"apscheduler","Authlib":"authlib","CairoSVG":"cairosvg",
        "ImageIO":"imageio","Jinja2":"jinja2","MarkupSafe":"markupsafe",
        "Pygments":"pygments","aiofiles":"aiofiles","aiohttp":"aiohttp",
        "anyio":"anyio","attrs":"attrs","babel":"babel","bleach":"bleach",
        "bokeh":"bokeh","celery":"celery","cffi":"cffi",
        "click":"click","cryptography":"cryptography","discord.py":"discord",
        "docker":"docker","fastapi":"fastapi","flask":"flask",
        "google-auth":"google_auth","graphql-core":"graphql","grpcio":"grpc",
        "httpx":"httpx","jsonschema":"jsonschema","kornia":"kornia",
        "langchain":"langchain","langgraph":"langgraph","loguru":"loguru",
        "lxml":"lxml","markdown":"markdown","msgpack":"msgpack",
        "numpy":"numpy","openpyxl":"openpyxl","orjson":"orjson",
        "packaging":"packaging","pandas":"pandas","paramiko":"paramiko",
        "passlib":"passlib","protobuf":"protobuf","psutil":"psutil",
        "pydantic":"pydantic","pyjwt":"jwt","pymongo":"pymongo","pytz":"pytz",
        "redis":"redis","requests":"requests","rich":"rich","scipy":"scipy",
        "selenium":"selenium","slack-sdk":"slack_sdk","spacy":"spacy",
        "sqlalchemy":"sqlalchemy","starlette":"starlette","streamlit":"streamlit",
        "tenacity":"tenacity","tiktoken":"tiktoken","tomli":"tomli",
        "tornado":"tornado","tqdm":"tqdm","typer":"typer","urllib3":"urllib3",
        "uvicorn":"uvicorn","watchdog":"watchdog","websockets":"websockets",
    }
    return mappings.get(pkg, pkg.replace('-','_').replace('.','_').lower())

def generate_wrapper(pkg, idx):
    imp = get_import_name(pkg)
    safe_name = pkg.replace('-','_').replace('.','_').replace('/','_').lower()
    
    template = '''
  // V.130: {pkg}
  {{
    name: "pkg_{safe}",
    description: "Execute {pkg} — import, inspect, or call functions",
    category: "package",
    package: "{pkg}",
    parameters: {{
      action: {{ type: "string", description: "info | call" }},
      function: {{ type: "string", description: "function name (for call)" }},
    }},
    execute: async (args) => {{
      const code = [
        "import importlib, json",
        "imp_name = '{imp}'",
        "func_name = '" + (args.function || '') + "'",
        "action = '" + (args.action || 'info') + "'",
        "try:",
        "    mod = importlib.import_module(imp_name)",
        "    if action == 'info':",
        "        result = {{'package': '{pkg}', 'version': getattr(mod, '__version__', 'unknown'), 'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}}",
        "    elif action == 'call' and func_name:",
        "        func = getattr(mod, func_name, None)",
        "        if func:",
        "            result = str(func())[:2000]",
        "        else:",
        "            result = {{'error': 'function not found', 'available': [x for x in dir(mod) if not x.startswith('_')][:20]}}",
        "    else:",
        "        result = {{'functions': [x for x in dir(mod) if not x.startswith('_')][:30]}}",
        "    print(json.dumps(result, default=str, ensure_ascii=False))",
        "except Exception as e:",
        "    print(json.dumps({{'error': str(e)[:200]}}))",
      ].join("\\n");
      return runPython(code, 30000);
    }},
  }},'''
    
    return template.format(pkg=pkg, safe=safe_name, imp=imp)

def main():
    batch_num = int(os.environ.get("BATCH_NUM", "1"))
    with open(f"/tmp/batch_{batch_num}.json") as f:
        packages = json.load(f)
    
    print(f"// ═══ V.130 Batch {batch_num}: {len(packages)} wrappers ═══")
    
    for pkg in packages:
        print(generate_wrapper(pkg, batch_num))
    
    print(f"// ═══ End Batch {batch_num} ═══")

if __name__ == "__main__":
    main()
