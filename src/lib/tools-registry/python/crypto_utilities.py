"""
Tool: crypto_utilities
Category: utility/security
Package: cryptography, pynacl, hashlib
Description: أدوات تشفير شاملة — hashing, AES, RSA, HMAC, random tokens.

Dependencies:
  - cryptography (pip install cryptography)
  - pynacl (pip install pynacl)

Input:
  {
    "operation": "hash" | "aes_encrypt" | "aes_decrypt" | "hmac" | "random_token" | "bcrypt_hash" | "bcrypt_verify" | "base64_encode" | "base64_decode",
    "data": "...",
    "params": {...}
  }

Output:
  {"success": true, "result": "..."}
"""
import sys
import os
import json
import hashlib
import hmac as hmac_module
import base64
import secrets

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def operations(operation: str, data: str = None, params: dict = None):
    params = params or {}

    if operation == "hash":
        algo = params.get("algorithm", "sha256").lower()
        try:
            h = hashlib.new(algo)
            h.update((data or "").encode("utf-8"))
            return {"success": True, "hash": h.hexdigest(), "algorithm": algo, "input_length": len(data or "")}
        except ValueError as e:
            return {"success": False, "error": f"invalid algorithm: {e}"}

    if operation == "hmac":
        key = params.get("key", "")
        algo = params.get("algorithm", "sha256").lower()
        try:
            h = hmac_module.new(key.encode("utf-8"), (data or "").encode("utf-8"), algo)
            return {"success": True, "hmac": h.hexdigest(), "algorithm": algo}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "random_token":
        length = int(params.get("length", 32))
        if length < 1 or length > 1024:
            length = 32
        token = secrets.token_hex(length)
        url_safe = secrets.token_urlsafe(length)
        return {"success": True, "token": token, "url_safe": url_safe, "length": length}

    if operation == "bcrypt_hash":
        password = data or ""
        if not password:
            return {"success": False, "error": "password required"}
        try:
            import bcrypt
            salt = bcrypt.gensalt(rounds=int(params.get("rounds", 12)))
            hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
            return {"success": True, "hash": hashed.decode("utf-8")}
        except ImportError as e:
            return {"success": False, "error": f"bcrypt not installed: {e}"}

    if operation == "bcrypt_verify":
        password = data or ""
        hash_str = params.get("hash", "")
        if not password or not hash_str:
            return {"success": False, "error": "password and hash required"}
        try:
            import bcrypt
            valid = bcrypt.checkpw(password.encode("utf-8"), hash_str.encode("utf-8"))
            return {"success": True, "valid": valid}
        except ImportError as e:
            return {"success": False, "error": f"bcrypt not installed: {e}"}

    if operation == "aes_encrypt":
        plaintext = data or ""
        key = params.get("key", "")
        if not plaintext or not key:
            return {"success": False, "error": "data and key required"}
        try:
            from cryptography.fernet import Fernet
            # Derive a Fernet key from the user's key (module-level hashlib)
            key_bytes = hashlib.sha256(key.encode("utf-8")).digest()
            fernet_key = base64.urlsafe_b64encode(key_bytes)
            f = Fernet(fernet_key)
            encrypted = f.encrypt(plaintext.encode("utf-8"))
            return {"success": True, "encrypted": encrypted.decode("utf-8")}
        except ImportError as e:
            return {"success": False, "error": f"cryptography not installed: {e}"}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "aes_decrypt":
        ciphertext = data or ""
        key = params.get("key", "")
        if not ciphertext or not key:
            return {"success": False, "error": "data and key required"}
        try:
            from cryptography.fernet import Fernet
            key_bytes = hashlib.sha256(key.encode("utf-8")).digest()
            fernet_key = base64.urlsafe_b64encode(key_bytes)
            f = Fernet(fernet_key)
            decrypted = f.decrypt(ciphertext.encode("utf-8"))
            return {"success": True, "decrypted": decrypted.decode("utf-8")}
        except ImportError as e:
            return {"success": False, "error": f"cryptography not installed: {e}"}
        except Exception as e:
            return {"success": False, "error": f"decrypt failed (wrong key?): {str(e)[:200]}"}

    if operation == "base64_encode":
        try:
            encoded = base64.b64encode((data or "").encode("utf-8")).decode("utf-8")
            return {"success": True, "encoded": encoded}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "base64_decode":
        try:
            decoded = base64.b64decode((data or "").encode("utf-8")).decode("utf-8")
            return {"success": True, "decoded": decoded}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    return {"success": False, "error": f"unknown operation: {operation}"}



def _dispatch(args):
    return operations(args.get("operation", ""), args.get("data", ""), args.get("params", {}))


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
    parser.add_argument("--data", default="")
    parser.add_argument("--params", default="{}", help="JSON string")
    args = parser.parse_args()
    params = json.loads(args.params)
    result = operations(args.operation, args.data, params)
    print(json.dumps(result, ensure_ascii=False))
