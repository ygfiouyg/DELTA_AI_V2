"""
Tool: fake_data_generator
Category: utility
Package: faker
Description: توليد بيانات وهمية واقعية — أسماء، إيميلات، عناوين، أرقام هواتف.

Dependencies:
  - faker (pip install faker)

Input:
  {
    "data_type": "name" | "email" | "address" | "phone" | "company" | "text" | "all",
    "count": 10,
    "locale": "en_US" | "ar_EG" | "fr_FR"
  }

Output:
  {"success": true, "data": [...], "count": 10}
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def generate(data_type: str = "name", count: int = 10, locale: str = "en_US"):
    if count < 1 or count > 1000:
        count = min(max(count, 1), 1000)

    try:
        from faker import Faker
        fake = Faker(locale)
    except ImportError as e:
        return {"success": False, "error": f"faker not installed: {e}"}
    except Exception as e:
        # Fallback to en_US if locale invalid
        try:
            from faker import Faker
            fake = Faker("en_US")
        except ImportError as e:
            return {"success": False, "error": f"faker not installed: {e}"}

    data = []
    for _ in range(count):
        try:
            if data_type == "name":
                data.append(fake.name())
            elif data_type == "email":
                data.append(fake.email())
            elif data_type == "address":
                data.append(fake.address().replace("\n", ", "))
            elif data_type == "phone":
                data.append(fake.phone_number())
            elif data_type == "company":
                data.append(fake.company())
            elif data_type == "text":
                data.append(fake.text(max_nb_chars=200))
            elif data_type == "date":
                data.append(fake.date_of_birth().isoformat())
            elif data_type == "url":
                data.append(fake.url())
            elif data_type == "credit_card":
                data.append(fake.credit_card_number())
            elif data_type == "uuid":
                data.append(str(fake.uuid4()))
            elif data_type == "all":
                data.append({
                    "name": fake.name(),
                    "email": fake.email(),
                    "phone": fake.phone_number(),
                    "address": fake.address().replace("\n", ", "),
                    "company": fake.company(),
                    "job": fake.job(),
                    "date_of_birth": fake.date_of_birth().isoformat(),
                })
            else:
                return {"success": False, "error": f"unknown data_type: {data_type}"}
        except Exception as e:
            data.append(None)

    return {
        "success": True,
        "data": data,
        "count": len(data),
        "data_type": data_type,
        "locale": locale,
    }



def _dispatch(args):
    return generate(args.get("data_type", "name"), int(args.get("count", 10)), args.get("locale", "en_US"))


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
    parser.add_argument("--data_type", default="name", choices=["name", "email", "address", "phone", "company", "text", "date", "url", "credit_card", "uuid", "all"])
    parser.add_argument("--count", type=int, default=10)
    parser.add_argument("--locale", default="en_US")
    args = parser.parse_args()
    result = generate(args.data_type, args.count, args.locale)
    print(json.dumps(result, ensure_ascii=False))
