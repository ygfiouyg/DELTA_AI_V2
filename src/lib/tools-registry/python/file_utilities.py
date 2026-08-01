"""
Tool: file_utilities
Category: utility
Package: pure-Python (no external deps)
Description: أدوات ملفات شاملة — بحث، قراءة، كتابة، حذف، نسخ، ضغط.

Dependencies: none

Input:
  {
    "operation": "list_dir" | "read_file" | "write_file" | "delete" | "copy" | "move" |
                  "file_info" | "search_files" | "zip_dir" | "unzip" | "tree",
    "path": "/some/path",
    "params": {...}
  }

Output: operation-specific dict
"""
import sys
import os
import json
import shutil
import hashlib
from pathlib import Path


def operations(operation: str, path: str = None, params: dict = None):
    params = params or {}

    if operation == "list_dir":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"path not found: {path}"}
        if not os.path.isdir(path):
            return {"success": False, "error": "path is not a directory"}
        items = []
        for item in sorted(os.listdir(path)):
            full = os.path.join(path, item)
            try:
                st = os.stat(full)
                items.append({
                    "name": item,
                    "type": "dir" if os.path.isdir(full) else "file",
                    "size_bytes": st.st_size if os.path.isfile(full) else None,
                    "modified": st.st_mtime,
                })
            except Exception:
                items.append({"name": item, "type": "unknown"})
        return {"success": True, "path": path, "items": items, "count": len(items)}

    if operation == "read_file":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"file not found: {path}"}
        try:
            with open(path, "r", encoding="utf-8", errors="replace") as f:
                content = f.read(int(params.get("max_bytes", 100000)))
            return {
                "success": True,
                "path": path,
                "content": content,
                "size_bytes": os.path.getsize(path),
                "truncated": os.path.getsize(path) > int(params.get("max_bytes", 100000)),
            }
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "write_file":
        if not path:
            return {"success": False, "error": "path required"}
        content = params.get("content", "")
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True) if os.path.dirname(path) else None
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            return {"success": True, "path": path, "bytes_written": len(content.encode("utf-8"))}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "delete":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"path not found: {path}"}
        try:
            if os.path.isdir(path):
                shutil.rmtree(path)
            else:
                os.remove(path)
            return {"success": True, "deleted": path}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "copy":
        dest = params.get("destination")
        if not path or not os.path.exists(path) or not dest:
            return {"success": False, "error": "path and destination required"}
        try:
            if os.path.isdir(path):
                shutil.copytree(path, dest)
            else:
                shutil.copy2(path, dest)
            return {"success": True, "source": path, "destination": dest}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "move":
        dest = params.get("destination")
        if not path or not os.path.exists(path) or not dest:
            return {"success": False, "error": "path and destination required"}
        try:
            shutil.move(path, dest)
            return {"success": True, "source": path, "destination": dest}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "file_info":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"path not found: {path}"}
        try:
            st = os.stat(path)
            # MD5 hash for files
            md5 = ""
            if os.path.isfile(path) and st.st_size < 10 * 1024 * 1024:  # 10MB limit
                h = hashlib.md5()
                with open(path, "rb") as f:
                    for chunk in iter(lambda: f.read(8192), b""):
                        h.update(chunk)
                md5 = h.hexdigest()
            return {
                "success": True,
                "path": path,
                "type": "dir" if os.path.isdir(path) else "file",
                "size_bytes": st.st_size,
                "size_kb": round(st.st_size / 1024, 2),
                "created": st.st_ctime,
                "modified": st.st_mtime,
                "accessed": st.st_atime,
                "mode": oct(st.st_mode),
                "md5": md5,
                "extension": os.path.splitext(path)[1] if os.path.isfile(path) else None,
            }
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "search_files":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"path not found: {path}"}
        pattern = params.get("pattern", "*")
        recursive = params.get("recursive", True)
        max_results = int(params.get("max_results", 100))
        import fnmatch
        matches = []
        try:
            if recursive:
                for root, dirs, files in os.walk(path):
                    for name in files + dirs:
                        if fnmatch.fnmatch(name, pattern):
                            matches.append(os.path.join(root, name))
                            if len(matches) >= max_results:
                                break
                    if len(matches) >= max_results:
                        break
            else:
                for name in os.listdir(path):
                    if fnmatch.fnmatch(name, pattern):
                        matches.append(os.path.join(path, name))
                        if len(matches) >= max_results:
                            break
            return {"success": True, "path": path, "pattern": pattern, "matches": matches, "count": len(matches)}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "zip_dir":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"path not found: {path}"}
        output = params.get("output_path", path + ".zip")
        try:
            shutil.make_archive(output.replace(".zip", ""), "zip", path)
            return {"success": True, "source": path, "archive": output, "size_kb": round(os.path.getsize(output) / 1024, 2)}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "unzip":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"zip file not found: {path}"}
        dest = params.get("destination", os.path.dirname(path))
        try:
            shutil.unpack_archive(path, dest, "zip")
            return {"success": True, "archive": path, "extracted_to": dest}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "tree":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"path not found: {path}"}
        max_depth = int(params.get("max_depth", 3))
        def build_tree(p, depth=0):
            if depth > max_depth:
                return None
            try:
                items = []
                for item in sorted(os.listdir(p)):
                    full = os.path.join(p, item)
                    node = {"name": item, "type": "dir" if os.path.isdir(full) else "file"}
                    if os.path.isdir(full):
                        node["children"] = build_tree(full, depth + 1)
                    else:
                        node["size"] = os.path.getsize(full)
                    items.append(node)
                return items
            except Exception:
                return []
        return {"success": True, "path": path, "tree": build_tree(path)}

    return {"success": False, "error": f"unknown operation: {operation}"}



def _dispatch(args):
    return operations(args.get("operation", ""), args.get("path"), args.get("params", {}))


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
    parser.add_argument("--operation", required=True)
    parser.add_argument("--path", default=None)
    parser.add_argument("--params", default="{}", help="JSON string")
    args = parser.parse_args()
    params = json.loads(args.params)
    result = operations(args.operation, args.path, params)
    print(json.dumps(result, ensure_ascii=False, default=str))
