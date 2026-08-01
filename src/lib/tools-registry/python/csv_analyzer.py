"""
Tool: csv_analyzer
Category: data
Package: pandas, numpy
Description: تحليل ملف CSV أو نص CSV — يعطي إحصائيات، أنواع البيانات، قيم مفقودة.

Dependencies:
  - pandas (pip install pandas)
  - numpy (pip install numpy)

Input:
  {
    "csv_path": "/path/to/file.csv",  # OR
    "csv_text": "name,age,city\\nJohn,30,NYC\\n...",
    "analysis_type": "summary" | "stats" | "head" | "correlation"
  }

Output:
  {
    "success": true,
    "shape": [100, 5],
    "columns": [...],
    "dtypes": {...},
    "head": [[...], ...],
    "stats": {...},
    "missing": {...}
  }
"""
import sys
import os
import json
import io

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def analyze(csv_path: str = None, csv_text: str = None, analysis_type: str = "summary"):
    try:
        import pandas as pd
        import numpy as np
    except ImportError as e:
        return {"success": False, "error": f"pandas/numpy not installed: {e}"}

    # Load data
    try:
        if csv_path and os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
        elif csv_text:
            df = pd.read_csv(io.StringIO(csv_text))
        else:
            return {"success": False, "error": "csv_path or csv_text required"}
    except Exception as e:
        return {"success": False, "error": f"failed to read CSV: {str(e)[:200]}"}

    result = {
        "success": True,
        "shape": list(df.shape),
        "columns": list(df.columns),
        "dtypes": {col: str(df[col].dtype) for col in df.columns},
    }

    if analysis_type in ("summary", "head"):
        # First 5 rows
        head = df.head(5).to_dict(orient="records")
        result["head"] = [
            {k: (v if not (isinstance(v, float) and np.isnan(v)) else None) for k, v in row.items()}
            for row in head
        ]

    if analysis_type in ("summary", "stats"):
        # Numeric stats
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if numeric_cols:
            stats = df[numeric_cols].describe().to_dict()
            result["stats"] = {
                col: {k: round(float(v), 4) if not np.isnan(v) else None for k, v in stats[col].items()}
                for col in numeric_cols
            }
        else:
            result["stats"] = {}

        # Categorical value counts
        cat_cols = df.select_dtypes(include=["object"]).columns.tolist()
        result["categorical_summary"] = {}
        for col in cat_cols[:5]:  # first 5 categorical
            counts = df[col].value_counts().head(10).to_dict()
            result["categorical_summary"][col] = {str(k): int(v) for k, v in counts.items()}

    if analysis_type in ("summary", "missing"):
        # Missing values
        missing = df.isnull().sum()
        result["missing"] = {
            col: {"count": int(missing[col]), "percent": round(float(missing[col] / len(df) * 100), 2)}
            for col in df.columns
            if missing[col] > 0
        }
        if not result["missing"]:
            result["missing"] = "No missing values"

    if analysis_type == "correlation":
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if len(numeric_cols) >= 2:
            corr = df[numeric_cols].corr()
            result["correlation"] = {
                row: {col: round(float(corr.loc[row, col]), 4) for col in numeric_cols}
                for row in numeric_cols
            }
        else:
            result["correlation"] = "Need at least 2 numeric columns"

    return result



def _dispatch(args):
    return analyze(args.get("csv_path"), args.get("csv_text"), args.get("analysis_type", "summary"))


if __name__ == "__main__":

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

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv_path", default=None)
    parser.add_argument("--csv_text", default=None)
    parser.add_argument("--analysis_type", default="summary", choices=["summary", "stats", "head", "correlation"])
    args = parser.parse_args()
    result = analyze(args.csv_path, args.csv_text, args.analysis_type)
    print(json.dumps(result, ensure_ascii=False, default=str))
