"""
Tool: data_visualizer
Category: data
Package: matplotlib, pandas, numpy
Description: إنشاء رسوم بيانية مختلفة (line, bar, scatter, histogram, pie) وحفظها كـ PNG.

Dependencies:
  - matplotlib (pip install matplotlib)
  - pandas (pip install pandas)
  - numpy (pip install numpy)

Input:
  {
    "chart_type": "line" | "bar" | "scatter" | "histogram" | "pie",
    "title": "Sales Over Time",
    "x": [1, 2, 3, 4, 5],
    "y": [10, 20, 15, 25, 30],
    "x_label": "Month",
    "y_label": "Sales",
    "output_path": "/tmp/chart.png"
  }

Output:
  {"success": true, "file": "/tmp/chart.png", "size_kb": 12.5}
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)

# Use non-interactive backend
import matplotlib
matplotlib.use("Agg")


def create_chart(chart_type: str, x=None, y=None, title: str = "", x_label: str = "", y_label: str = "", output_path: str = "/tmp/chart.png", **kwargs):
    try:
        import matplotlib.pyplot as plt
        import numpy as np
    except ImportError as e:
        return {"success": False, "error": f"matplotlib not installed: {e}"}

    if not x and not y:
        return {"success": False, "error": "x and/or y data required"}

    x = x or list(range(len(y))) if y else []
    y = y or []

    fig, ax = plt.subplots(figsize=(10, 6), dpi=100)

    try:
        if chart_type == "line":
            ax.plot(x, y, marker="o", linewidth=2, markersize=6, color="#4F46E5")
        elif chart_type == "bar":
            ax.bar(x, y, color="#10B981", edgecolor="black", linewidth=0.5)
        elif chart_type == "scatter":
            ax.scatter(x, y, s=80, c="#F59E0B", alpha=0.7, edgecolors="black")
        elif chart_type == "histogram":
            ax.hist(y or x, bins=kwargs.get("bins", 20), color="#EF4444", edgecolor="black")
        elif chart_type == "pie":
            if not x or not y:
                return {"success": False, "error": "pie chart requires x (labels) and y (values)"}
            ax.pie(y, labels=x, autopct="%1.1f%%", startangle=90)
            ax.axis("equal")
        else:
            return {"success": False, "error": f"unknown chart_type: {chart_type}"}

        if title:
            ax.set_title(title, fontsize=14, fontweight="bold", pad=15)
        if x_label and chart_type != "pie":
            ax.set_xlabel(x_label, fontsize=11)
        if y_label and chart_type != "pie":
            ax.set_ylabel(y_label, fontsize=11)

        if chart_type != "pie":
            ax.grid(True, alpha=0.3, linestyle="--")
            ax.spines["top"].set_visible(False)
            ax.spines["right"].set_visible(False)

        plt.tight_layout()
        plt.savefig(output_path, dpi=100, bbox_inches="tight", facecolor="white")
        plt.close()

        size_kb = os.path.getsize(output_path) / 1024
        return {
            "success": True,
            "file": output_path,
            "size_kb": round(size_kb, 2),
            "chart_type": chart_type,
            "data_points": len(x) if chart_type != "histogram" else len(y or x),
        }
    except Exception as e:
        plt.close()
        return {"success": False, "error": f"chart creation failed: {str(e)[:200]}"}



def _dispatch(args):
    return create_chart(args.get("chart_type"), args.get("x"), args.get("y"), args.get("title", ""), args.get("x_label", ""), args.get("y_label", ""), args.get("output_path", "/tmp/chart.png"))


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
    parser.add_argument("--chart_type", required=True, choices=["line", "bar", "scatter", "histogram", "pie"])
    parser.add_argument("--title", default="")
    parser.add_argument("--x", nargs="*", type=float, default=None)
    parser.add_argument("--y", nargs="*", type=float, default=None)
    parser.add_argument("--x_label", default="")
    parser.add_argument("--y_label", default="")
    parser.add_argument("--output_path", default="/tmp/chart.png")
    args = parser.parse_args()
    # Convert float x to string labels for pie
    x = args.x if args.chart_type != "pie" else [str(v) for v in args.x]
    result = create_chart(args.chart_type, x, args.y, args.title, args.x_label, args.y_label, args.output_path)
    print(json.dumps(result, ensure_ascii=False))
