"""
Tool: http_api_tester
Category: web
Package: requests
Description: اختبار API endpoint — GET, POST, PUT, DELETE مع headers و body مخصص.

Dependencies:
  - requests (pip install requests)

Input:
  {
    "url": "https://api.example.com/users",
    "method": "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    "headers": {"Authorization": "Bearer xxx"},
    "params": {"page": 1},
    "body": {"name": "John"},
    "body_type": "json" | "form" | "raw",
    "timeout": 30
  }

Output:
  {
    "success": true,
    "status_code": 200,
    "status_text": "OK",
    "headers": {...},
    "body": "...",
    "json": {...},  # if response is JSON
    "elapsed_ms": 145,
    "size_bytes": 1234
  }
"""
import sys
import os
import json
import time

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def test_request(url: str, method: str = "GET", headers: dict = None, params: dict = None, body=None, body_type: str = "json", timeout: int = 30):
    if not url:
        return {"success": False, "error": "url required"}

    try:
        import requests
    except ImportError as e:
        return {"success": False, "error": f"requests not installed: {e}"}

    method = method.upper()
    if method not in ("GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"):
        return {"success": False, "error": f"invalid method: {method}"}

    # Prepare request kwargs
    req_kwargs = {
        "headers": headers or {},
        "params": params or {},
        "timeout": timeout,
        "allow_redirects": True,
    }

    # Add body for non-GET methods
    if method != "GET" and body is not None:
        if body_type == "json":
            req_kwargs["json"] = body
        elif body_type == "form":
            req_kwargs["data"] = body
        elif body_type == "raw":
            req_kwargs["data"] = str(body)
            req_kwargs["headers"].setdefault("Content-Type", "text/plain")

    start = time.time()
    try:
        resp = requests.request(method, url, **req_kwargs)
        elapsed_ms = int((time.time() - start) * 1000)
    except requests.exceptions.Timeout:
        return {"success": False, "error": f"timeout after {timeout}s"}
    except requests.exceptions.ConnectionError as e:
        return {"success": False, "error": f"connection error: {str(e)[:200]}"}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"request failed: {str(e)[:200]}"}

    result = {
        "success": True,
        "status_code": resp.status_code,
        "status_text": resp.reason,
        "url": resp.url,
        "elapsed_ms": elapsed_ms,
        "size_bytes": len(resp.content),
        "headers": dict(resp.headers),
    }

    # Try to parse JSON response
    content_type = resp.headers.get("Content-Type", "")
    if "application/json" in content_type:
        try:
            result["json"] = resp.json()
            result["body"] = "(parsed as JSON)"
        except Exception:
            result["body"] = resp.text[:5000]
    else:
        result["body"] = resp.text[:5000]

    return result



def _dispatch(args):
    return test_request(args.get("url", ""), args.get("method", "GET"), args.get("headers"), args.get("params"), args.get("body"), args.get("body_type", "json"), int(args.get("timeout", 30)))


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
    parser.add_argument("--url", required=True)
    parser.add_argument("--method", default="GET")
    parser.add_argument("--headers", default=None, help="JSON string")
    parser.add_argument("--params", default=None, help="JSON string")
    parser.add_argument("--body", default=None, help="JSON string")
    parser.add_argument("--body_type", default="json", choices=["json", "form", "raw"])
    parser.add_argument("--timeout", type=int, default=30)
    args = parser.parse_args()
    headers = json.loads(args.headers) if args.headers else None
    params = json.loads(args.params) if args.params else None
    body = json.loads(args.body) if args.body else None
    result = test_request(args.url, args.method, headers, params, body, args.body_type, args.timeout)
    print(json.dumps(result, ensure_ascii=False, indent=2))
