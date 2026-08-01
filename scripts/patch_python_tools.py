#!/usr/bin/env python3
"""Patch all Python tool scripts to support --args_file argument."""
import os, re
from pathlib import Path

TOOLS_DIR = Path("/home/z/my-project/tools/python")

# Common pattern to inject at the top of __main__ block
ARGS_FILE_PATCH = '''
    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)
'''

# Per-script dispatch logic (each script gets its own dispatcher)
DISPATCHERS = {
    "sentiment_analysis.py": '''
def _dispatch(args):
    return analyze(args.get("text", ""), args.get("language", "auto"))
''',
    "text_classifier.py": '''
def _dispatch(args):
    return classify(args.get("text", ""), args.get("categories"))
''',
    "text_summarizer.py": '''
def _dispatch(args):
    return summarize(args.get("text", ""), int(args.get("sentences_count", 3)), args.get("language", "en"))
''',
    "keyword_extractor.py": '''
def _dispatch(args):
    return extract_keywords(args.get("text", ""), int(args.get("top_n", 10)), args.get("language", "en"))
''',
    "language_detector.py": '''
def _dispatch(args):
    return detect(args.get("text", ""))
''',
    "csv_analyzer.py": '''
def _dispatch(args):
    return analyze(args.get("csv_path"), args.get("csv_text"), args.get("analysis_type", "summary"))
''',
    "statistics_calculator.py": '''
def _dispatch(args):
    return calc(args.get("numbers", []), args.get("operation", "descriptive"), args.get("numbers2"))
''',
    "data_visualizer.py": '''
def _dispatch(args):
    return create_chart(args.get("chart_type"), args.get("x"), args.get("y"), args.get("title", ""), args.get("x_label", ""), args.get("y_label", ""), args.get("output_path", "/tmp/chart.png"))
''',
    "web_scraper.py": '''
def _dispatch(args):
    return scrape(args.get("url", ""), args.get("extract", "all"), int(args.get("timeout", 30)))
''',
    "http_api_tester.py": '''
def _dispatch(args):
    return test_request(args.get("url", ""), args.get("method", "GET"), args.get("headers"), args.get("params"), args.get("body"), args.get("body_type", "json"), int(args.get("timeout", 30)))
''',
    "youtube_downloader.py": '''
def _dispatch(args):
    return download(args.get("url", ""), args.get("format", "best"), args.get("output_path", "/tmp/youtube_downloads"), bool(args.get("extract_info_only", False)))
''',
    "image_processor.py": '''
def _dispatch(args):
    return process(args.get("input_path", ""), args.get("output_path", ""), args.get("operation", ""), args.get("params", {}))
''',
    "ocr_extractor.py": '''
def _dispatch(args):
    return extract_text(args.get("image_path", ""), args.get("language", "eng"), args.get("output_format", "text"))
''',
    "pdf_processor.py": '''
def _dispatch(args):
    return process(args.get("pdf_path", ""), args.get("operation", "extract_text"), args.get("output_path"), args.get("pages", "all"), args.get("merge_files"))
''',
    "audio_processor.py": '''
def _dispatch(args):
    return process(args.get("input_path"), args.get("output_path"), args.get("operation", "info"), args.get("params", {}))
''',
    "text_to_speech.py": '''
def _dispatch(args):
    return synthesize(args.get("text", ""), args.get("voice", "auto"), args.get("output_path", "/tmp/tts_output.mp3"), args.get("rate", "+0%"), args.get("volume", "+0%"))
''',
    "qr_code_generator.py": '''
def _dispatch(args):
    return generate(args.get("data", ""), args.get("output_path", "/tmp/qr.png"), int(args.get("size", 10)), int(args.get("border", 4)), args.get("fill_color", "black"), args.get("back_color", "white"), args.get("error_correction", "M"))
''',
    "translator.py": '''
def _dispatch(args):
    return translate(args.get("text", ""), args.get("source_lang", "auto"), args.get("target_lang", "en"), args.get("engine", "google"))
''',
    "document_generator.py": '''
def _dispatch(args):
    return generate(args.get("format", ""), args.get("output_path", ""), args.get("title", ""), args.get("content", {}))
''',
    "fake_data_generator.py": '''
def _dispatch(args):
    return generate(args.get("data_type", "name"), int(args.get("count", 10)), args.get("locale", "en_US"))
''',
    "file_utilities.py": '''
def _dispatch(args):
    return operations(args.get("operation", ""), args.get("path"), args.get("params", {}))
''',
    "crypto_utilities.py": '''
def _dispatch(args):
    return operations(args.get("operation", ""), args.get("data", ""), args.get("params", {}))
''',
    "math_solver.py": '''
def _dispatch(args):
    return solve(args.get("operation", ""), args.get("expression", ""), args.get("variable", "x"), args.get("params", {}))
''',
}

patched = 0
for script_path in sorted(TOOLS_DIR.glob("*.py")):
    name = script_path.name
    if name in DISPATCHERS:
        content = script_path.read_text()
        # Skip if already patched
        if "_dispatch" in content and "--args_file" in content:
            print(f"  ⏭️  {name} (already patched)")
            continue
        dispatcher = DISPATCHERS[name]
        # Insert dispatcher before __main__ block
        if 'if __name__ == "__main__":' in content:
            # Insert dispatcher just before __main__
            content = content.replace(
                'if __name__ == "__main__":',
                dispatcher + '\n\nif __name__ == "__main__":'
            )
            # Insert args_file handler at the top of __main__ block
            # Find the line after __main__: and insert our handler
            content = content.replace(
                'if __name__ == "__main__":\n    import argparse',
                'if __name__ == "__main__":\n' + ARGS_FILE_PATCH + '\n    import argparse'
            )
            script_path.write_text(content)
            print(f"  ✅ {name} (patched)")
            patched += 1
        else:
            print(f"  ⚠️  {name} (no __main__ block)")
    else:
        print(f"  ❓ {name} (no dispatcher)")

print(f"\n✅ Patched {patched} scripts")
