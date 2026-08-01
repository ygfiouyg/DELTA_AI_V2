"""
Tool: math_solver
Category: science
Package: sympy, numpy
Description: حل مسائل رياضية رمزية ومعادلات، تفاضل، تكامل، تبسيط.

Dependencies:
  - sympy (pip install sympy)
  - numpy (pip install numpy)

Input:
  {
    "operation": "solve" | "simplify" | "derivative" | "integrate" | "expand" | "factor" | "evaluate",
    "expression": "x^2 + 2*x + 1",
    "variable": "x",
    "params": {...}
  }

Output:
  {"success": true, "result": "...", "steps": "..."}
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def solve(operation: str, expression: str, variable: str = "x", params: dict = None):
    params = params or {}
    if not expression:
        return {"success": False, "error": "expression required"}

    try:
        import sympy
        from sympy import symbols, sympify, solve as sym_solve, simplify, diff, integrate, expand, factor, latex, Eq
    except ImportError as e:
        return {"success": False, "error": f"sympy not installed: {e}"}

    try:
        # Define the variable
        var_symbols = symbols(variable)
        # Parse the expression
        expr = sympify(expression.replace("^", "**"))

        if operation == "solve":
            # Solve equation = 0
            solutions = sym_solve(expr, var_symbols)
            return {
                "success": True,
                "operation": "solve",
                "expression": str(expr),
                "variable": variable,
                "solutions": [str(s) for s in solutions],
                "solutions_count": len(solutions),
                "latex": latex(expr),
            }

        if operation == "simplify":
            result = simplify(expr)
            return {
                "success": True,
                "operation": "simplify",
                "original": str(expr),
                "simplified": str(result),
                "latex": latex(result),
            }

        if operation == "derivative":
            order = int(params.get("order", 1))
            result = expr
            for _ in range(order):
                result = diff(result, var_symbols)
            return {
                "success": True,
                "operation": "derivative",
                "original": str(expr),
                "derivative": str(result),
                "order": order,
                "variable": variable,
                "latex": latex(result),
            }

        if operation == "integrate":
            definite = params.get("definite", False)
            if definite:
                lower = params.get("lower", 0)
                upper = params.get("upper", 1)
                result = integrate(expr, (var_symbols, lower, upper))
                return {
                    "success": True,
                    "operation": "integrate_definite",
                    "original": str(expr),
                    "integral": str(result),
                    "bounds": [lower, upper],
                    "variable": variable,
                }
            else:
                result = integrate(expr, var_symbols)
                return {
                    "success": True,
                    "operation": "integrate",
                    "original": str(expr),
                    "integral": str(result),
                    "variable": variable,
                    "latex": latex(result),
                }

        if operation == "expand":
            result = expand(expr)
            return {
                "success": True,
                "operation": "expand",
                "original": str(expr),
                "expanded": str(result),
                "latex": latex(result),
            }

        if operation == "factor":
            result = factor(expr)
            return {
                "success": True,
                "operation": "factor",
                "original": str(expr),
                "factored": str(result),
                "latex": latex(result),
            }

        if operation == "evaluate":
            values = params.get("values", {})
            substitutions = {symbols(k): v for k, v in values.items()}
            result = expr.subs(substitutions)
            numerical = float(result) if result.is_number else str(result)
            return {
                "success": True,
                "operation": "evaluate",
                "expression": str(expr),
                "substitutions": values,
                "result": str(result),
                "numerical": numerical,
            }

        return {"success": False, "error": f"unknown operation: {operation}"}

    except Exception as e:
        return {"success": False, "error": f"math operation failed: {str(e)[:200]}"}



def _dispatch(args):
    return solve(args.get("operation", ""), args.get("expression", ""), args.get("variable", "x"), args.get("params", {}))


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
    parser.add_argument("--operation", required=True, choices=["solve", "simplify", "derivative", "integrate", "expand", "factor", "evaluate"])
    parser.add_argument("--expression", required=True)
    parser.add_argument("--variable", default="x")
    parser.add_argument("--params", default="{}", help="JSON string")
    args = parser.parse_args()
    params = json.loads(args.params)
    result = solve(args.operation, args.expression, args.variable, params)
    print(json.dumps(result, ensure_ascii=False))
