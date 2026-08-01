"""
Tool: youtube_downloader
Category: web/media
Package: yt-dlp
Description: تحميل فيديوهات/صوت من YouTube و منصات تانية باستخدام yt-dlp.

Dependencies:
  - yt-dlp (pip install yt-dlp)

Input:
  {
    "url": "https://www.youtube.com/watch?v=xxx",
    "format": "best" | "bestaudio" | "bestvideo" | "720p" | "1080p",
    "output_path": "/tmp/youtube_downloads",
    "extract_info_only": false  # if true, just return metadata
  }

Output:
  {
    "success": true,
    "title": "...",
    "duration": 245,
    "uploader": "...",
    "view_count": 1234567,
    "files": [{"path": "/tmp/.../video.mp4", "size_mb": 12.5}]
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


FORMAT_MAP = {
    "best": "bestvideo+bestaudio/best",
    "bestaudio": "bestaudio/best",
    "bestvideo": "bestvideo",
    "720p": "bestvideo[height<=720]+bestaudio/best[height<=720]/best",
    "1080p": "bestvideo[height<=1080]+bestaudio/best[height<=1080]/best",
    "480p": "bestvideo[height<=480]+bestaudio/best[height<=480]/best",
}


def download(url: str, format: str = "best", output_path: str = "/tmp/youtube_downloads", extract_info_only: bool = False):
    if not url:
        return {"success": False, "error": "url required"}

    try:
        from yt_dlp import YoutubeDL
    except ImportError as e:
        return {"success": False, "error": f"yt-dlp not installed: {e}"}

    os.makedirs(output_path, exist_ok=True)

    ydl_opts = {
        "outtmpl": os.path.join(output_path, "%(title).80s.%(ext)s"),
        "quiet": True,
        "no_warnings": True,
        "noprogress": True,
    }

    if not extract_info_only:
        fmt = FORMAT_MAP.get(format, format)
        ydl_opts["format"] = fmt
        # Merge for video formats
        if "bestvideo" in fmt and "+" in fmt:
            ydl_opts["merge_output_format"] = "mp4"

    try:
        with YoutubeDL(ydl_opts) as ydl:
            # Extract info first
            info = ydl.extract_info(url, download=not extract_info_only)

            result = {
                "success": True,
                "title": info.get("title", "")[:200],
                "duration": info.get("duration"),
                "uploader": info.get("uploader", ""),
                "view_count": info.get("view_count"),
                "like_count": info.get("like_count"),
                "upload_date": info.get("upload_date", ""),
                "description": (info.get("description") or "")[:500],
                "webpage_url": info.get("webpage_url", url),
                "extractor": info.get("extractor_key", ""),
            }

            if extract_info_only:
                result["thumbnails"] = [t["url"] for t in info.get("thumbnails", [])[:3]]
                result["available_formats"] = [
                    {"format_id": f.get("format_id"), "ext": f.get("ext"), "height": f.get("height"), "filesize": f.get("filesize")}
                    for f in info.get("formats", [])[:10]
                ]
                return result

            # Get downloaded file path
            if "requested_downloads" in info:
                files = []
                for d in info["requested_downloads"]:
                    fpath = d.get("filepath")
                    if fpath and os.path.exists(fpath):
                        files.append({
                            "path": fpath,
                            "size_mb": round(os.path.getsize(fpath) / 1024 / 1024, 2),
                            "ext": d.get("ext", ""),
                        })
                result["files"] = files
            else:
                # Fallback: look in output dir for recent files
                result["files"] = []

            return result

    except Exception as e:
        return {"success": False, "error": f"download failed: {str(e)[:200]}"}



def _dispatch(args):
    return download(args.get("url", ""), args.get("format", "best"), args.get("output_path", "/tmp/youtube_downloads"), bool(args.get("extract_info_only", False)))


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
    parser.add_argument("--format", default="best", choices=list(FORMAT_MAP.keys()))
    parser.add_argument("--output_path", default="/tmp/youtube_downloads")
    parser.add_argument("--info_only", action="store_true")
    args = parser.parse_args()
    result = download(args.url, args.format, args.output_path, args.info_only)
    print(json.dumps(result, ensure_ascii=False, indent=2))
