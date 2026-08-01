"""
Tool: text_to_speech
Category: media/audio
Package: edge-tts, gtts (fallback)
Description: تحويل نص إلى صوت MP3 — يدعم العربية والإنجليزية و 50+ لغة.

Dependencies:
  - edge-tts (pip install edge-tts)  # primary, high-quality neural voices
  - gtts (pip install gTTS)  # fallback

Input:
  {
    "text": "النص المطلوب تحويله لصوت",
    "voice": "ar-EG-SalmaNeural" | "en-US-JennyNeural" | "auto",
    "output_path": "/tmp/tts_output.mp3",
    "rate": "+0%",  # speed
    "volume": "+0%"  # volume
  }

Output:
  {"success": true, "file": "/tmp/tts_output.mp3", "size_kb": 12.5, "duration_seconds": 5.2}
"""
import sys
import os
import json
import asyncio

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


# Default voices by language
DEFAULT_VOICES = {
    "ar": "ar-EG-SalmaNeural",
    "en": "en-US-JennyNeural",
    "fr": "fr-FR-DeniseNeural",
    "es": "es-ES-ElviraNeural",
    "de": "de-DE-KatjaNeural",
    "it": "it-IT-ElsaNeural",
    "ru": "ru-RU-SvetlanaNeural",
    "tr": "tr-TR-EmelNeural",
    "hi": "hi-IN-SwaraNeural",
    "ja": "ja-JP-NanamiNeural",
    "ko": "ko-KR-SunHiNeural",
    "zh": "zh-CN-XiaoxiaoNeural",
}


def detect_language(text: str) -> str:
    """Quick language detection."""
    arabic_chars = sum(1 for c in text if "\u0600" <= c <= "\u06FF")
    if arabic_chars > len(text) * 0.3:
        return "ar"
    return "en"


async def _edge_tts_synthesize(text: str, voice: str, output_path: str, rate: str, volume: str):
    import edge_tts
    communicate = edge_tts.Communicate(text, voice, rate=rate, volume=volume)
    await communicate.save(output_path)


def synthesize(text: str, voice: str = "auto", output_path: str = "/tmp/tts_output.mp3", rate: str = "+0%", volume: str = "+0%"):
    if not text or not text.strip():
        return {"success": False, "error": "text required"}

    # Auto-pick voice
    if voice == "auto" or not voice:
        lang = detect_language(text)
        voice = DEFAULT_VOICES.get(lang, "en-US-JennyNeural")

    # Try edge-tts first
    try:
        asyncio.run(_edge_tts_synthesize(text, voice, output_path, rate, volume))
        size_kb = os.path.getsize(output_path) / 1024
        # Estimate duration (~15 chars/sec for neural TTS)
        duration = len(text) / 15.0
        return {
            "success": True,
            "file": output_path,
            "voice": voice,
            "size_kb": round(size_kb, 2),
            "duration_seconds": round(duration, 2),
            "text_length": len(text),
            "engine": "edge-tts",
        }
    except ImportError:
        pass
    except Exception as e:
        # Fallback to gTTS
        pass

    # Fallback: gTTS
    try:
        from gtts import gTTS
        lang = "ar" if "ar-" in voice else "en"
        tts = gTTS(text=text, lang=lang, slow=False)
        tts.save(output_path)
        size_kb = os.path.getsize(output_path) / 1024
        return {
            "success": True,
            "file": output_path,
            "voice": f"gTTS-{lang}",
            "size_kb": round(size_kb, 2),
            "duration_seconds": round(len(text) / 15.0, 2),
            "text_length": len(text),
            "engine": "gtts",
        }
    except ImportError as e:
        return {"success": False, "error": f"neither edge-tts nor gtts installed: {e}"}
    except Exception as e:
        return {"success": False, "error": f"TTS failed: {str(e)[:200]}"}



def _dispatch(args):
    return synthesize(args.get("text", ""), args.get("voice", "auto"), args.get("output_path", "/tmp/tts_output.mp3"), args.get("rate", "+0%"), args.get("volume", "+0%"))


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
    parser.add_argument("--text", required=True)
    parser.add_argument("--voice", default="auto")
    parser.add_argument("--output_path", default="/tmp/tts_output.mp3")
    parser.add_argument("--rate", default="+0%")
    parser.add_argument("--volume", default="+0%")
    args = parser.parse_args()
    result = synthesize(args.text, args.voice, args.output_path, args.rate, args.volume)
    print(json.dumps(result, ensure_ascii=False))
