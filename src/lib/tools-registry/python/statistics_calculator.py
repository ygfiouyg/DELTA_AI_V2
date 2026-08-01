"""
Tool: statistics_calculator
Category: data
Package: numpy, scipy
Description: حساب إحصائيات شاملة لمجموعة أرقام — متوسط، وسيط، انحراف معياري، ارتباط، إلخ.

Dependencies:
  - numpy (pip install numpy)
  - scipy (pip install scipy)

Input:
  {
    "numbers": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "operation": "descriptive" | "correlation" | "ttest" | "regression"
  }

Output:
  {
    "success": true,
    "count": 10,
    "mean": 5.5,
    "median": 5.5,
    "std": 2.87,
    "var": 8.25,
    "min": 1, "max": 10,
    "q1": 3.25, "q3": 7.75,
    "skewness": 0,
    "kurtosis": -1.56
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def calc(numbers: list, operation: str = "descriptive", numbers2: list = None):
    if not numbers or not isinstance(numbers, list):
        return {"success": False, "error": "numbers list required"}

    try:
        import numpy as np
        from scipy import stats as sp_stats
    except ImportError as e:
        return {"success": False, "error": f"numpy/scipy not installed: {e}"}

    try:
        arr = np.array(numbers, dtype=float)
    except (ValueError, TypeError) as e:
        return {"success": False, "error": f"invalid numbers: {e}"}

    if operation == "descriptive":
        result = {
            "success": True,
            "count": int(len(arr)),
            "mean": round(float(np.mean(arr)), 4),
            "median": round(float(np.median(arr)), 4),
            "std": round(float(np.std(arr, ddof=1)) if len(arr) > 1 else 0.0, 4),
            "var": round(float(np.var(arr, ddof=1)) if len(arr) > 1 else 0.0, 4),
            "min": round(float(np.min(arr)), 4),
            "max": round(float(np.max(arr)), 4),
            "sum": round(float(np.sum(arr)), 4),
            "q1": round(float(np.percentile(arr, 25)), 4),
            "q3": round(float(np.percentile(arr, 75)), 4),
            "iqr": round(float(np.percentile(arr, 75) - np.percentile(arr, 25)), 4),
            "skewness": round(float(sp_stats.skew(arr)) if len(arr) > 2 else 0.0, 4),
            "kurtosis": round(float(sp_stats.kurtosis(arr)) if len(arr) > 3 else 0.0, 4),
        }
        # Mode (most common)
        mode_result = sp_stats.mode(arr, keepdims=False)
        result["mode"] = float(mode_result.mode)
        result["mode_count"] = int(mode_result.count)
        return result

    elif operation == "correlation":
        if not numbers2 or len(numbers2) != len(numbers):
            return {"success": False, "error": "correlation requires numbers2 of same length"}
        arr2 = np.array(numbers2, dtype=float)
        pearson_r, pearson_p = sp_stats.pearsonr(arr, arr2)
        spearman_r, spearman_p = sp_stats.spearmanr(arr, arr2)
        return {
            "success": True,
            "pearson_r": round(float(pearson_r), 4),
            "pearson_p": round(float(pearson_p), 4),
            "spearman_r": round(float(spearman_r), 4),
            "spearman_p": round(float(spearman_p), 4),
            "covariance": round(float(np.cov(arr, arr2)[0, 1]), 4),
        }

    elif operation == "ttest":
        if not numbers2:
            # One-sample t-test against mean=0
            t_stat, p_val = sp_stats.ttest_1samp(arr, 0)
            return {
                "success": True,
                "test": "one-sample",
                "t_statistic": round(float(t_stat), 4),
                "p_value": round(float(p_val), 4),
                "mean": round(float(np.mean(arr)), 4),
                "null_hypothesis_mean": 0,
            }
        arr2 = np.array(numbers2, dtype=float)
        t_stat, p_val = sp_stats.ttest_ind(arr, arr2)
        return {
            "success": True,
            "test": "two-sample",
            "t_statistic": round(float(t_stat), 4),
            "p_value": round(float(p_val), 4),
            "mean1": round(float(np.mean(arr)), 4),
            "mean2": round(float(np.mean(arr2)), 4),
        }

    elif operation == "regression":
        if not numbers2 or len(numbers2) != len(numbers):
            return {"success": False, "error": "regression requires numbers2 (x) of same length as numbers (y)"}
        x = np.array(numbers2, dtype=float)
        y = arr
        slope, intercept, r_value, p_value, std_err = sp_stats.linregress(x, y)
        return {
            "success": True,
            "slope": round(float(slope), 4),
            "intercept": round(float(intercept), 4),
            "r_value": round(float(r_value), 4),
            "r_squared": round(float(r_value ** 2), 4),
            "p_value": round(float(p_value), 4),
            "std_err": round(float(std_err), 4),
            "equation": f"y = {slope:.4f} * x + {intercept:.4f}",
        }

    else:
        return {"success": False, "error": f"unknown operation: {operation}"}



def _dispatch(args):
    return calc(args.get("numbers", []), args.get("operation", "descriptive"), args.get("numbers2"))


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
    parser.add_argument("--numbers", nargs="*", type=float, required=True)
    parser.add_argument("--numbers2", nargs="*", type=float, default=None)
    parser.add_argument("--operation", default="descriptive", choices=["descriptive", "correlation", "ttest", "regression"])
    args = parser.parse_args()
    result = calc(args.numbers, args.operation, args.numbers2)
    print(json.dumps(result, ensure_ascii=False))
