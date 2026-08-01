"""
Tool: web_scraper
Category: web
Package: requests, beautifulsoup4, trafilatura
Description: استخراج المحتوى من صفحة ويب — نص نظيف، روابط، صور، meta.

Dependencies:
  - requests (pip install requests)
  - beautifulsoup4 (pip install beautifulsoup4)
  - trafilatura (pip install trafilatura)
  - lxml (pip install lxml)

Input:
  {
    "url": "https://example.com/article",
    "extract": "text" | "links" | "images" | "meta" | "all",
    "timeout": 30
  }

Output:
  {
    "success": true,
    "url": "...",
    "title": "...",
    "text": "...",
    "links": [...],
    "images": [...],
    "meta": {...}
  }
"""
import sys
import os
import json
import urllib.parse

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def scrape(url: str, extract: str = "all", timeout: int = 30):
    if not url or not url.startswith(("http://", "https://")):
        return {"success": False, "error": "valid url required (must start with http/https)"}

    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError as e:
        return {"success": False, "error": f"requests/bs4 not installed: {e}"}

    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        resp = requests.get(url, headers=headers, timeout=timeout, allow_redirects=True)
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"HTTP request failed: {str(e)[:200]}"}

    soup = BeautifulSoup(resp.text, "lxml")

    result = {
        "success": True,
        "url": resp.url,
        "status_code": resp.status_code,
        "title": (soup.title.string.strip() if soup.title and soup.title.string else "")[:200],
    }

    if extract in ("text", "all"):
        # Try trafilatura for clean article text
        try:
            import trafilatura
            downloaded = trafilatura.fetch_url(url)
            if downloaded:
                clean_text = trafilatura.extract(downloaded, include_comments=False, include_tables=True)
                if clean_text:
                    result["text"] = clean_text[:5000]  # cap
                    result["text_length"] = len(clean_text)
                else:
                    result["text"] = soup.get_text(separator="\n", strip=True)[:5000]
            else:
                result["text"] = soup.get_text(separator="\n", strip=True)[:5000]
        except ImportError:
            # Fallback: just soup
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()
            text = soup.get_text(separator="\n", strip=True)
            result["text"] = text[:5000]
            result["text_length"] = len(text)

    if extract in ("links", "all"):
        links = []
        for a in soup.find_all("a", href=True):
            href = a["href"]
            # Resolve relative URLs
            full_url = urllib.parse.urljoin(resp.url, href)
            text = a.get_text(strip=True)[:100]
            links.append({"url": full_url, "text": text})
        result["links"] = links[:50]  # cap
        result["links_count"] = len(links)

    if extract in ("images", "all"):
        images = []
        for img in soup.find_all("img", src=True):
            src = img["src"]
            full_url = urllib.parse.urljoin(resp.url, src)
            alt = img.get("alt", "")[:100]
            images.append({"src": full_url, "alt": alt})
        result["images"] = images[:20]
        result["images_count"] = len(images)

    if extract in ("meta", "all"):
        meta = {}
        # Standard meta tags
        for m in soup.find_all("meta"):
            name = m.get("name") or m.get("property") or m.get("http-equiv")
            content = m.get("content")
            if name and content:
                meta[name] = content[:500]
        result["meta"] = meta

        # Open Graph
        og = {}
        for m in soup.find_all("meta", attrs={"property": True}):
            if m["property"].startswith("og:"):
                og[m["property"]] = m.get("content", "")[:300]
        if og:
            result["open_graph"] = og

    return result



def _dispatch(args):
    return scrape(args.get("url", ""), args.get("extract", "all"), int(args.get("timeout", 30)))


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
    parser.add_argument("--extract", default="all", choices=["text", "links", "images", "meta", "all"])
    parser.add_argument("--timeout", type=int, default=30)
    args = parser.parse_args()
    result = scrape(args.url, args.extract, args.timeout)
    print(json.dumps(result, ensure_ascii=False))
