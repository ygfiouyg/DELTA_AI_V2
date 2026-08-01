"""
Tool: audio_processor
Category: media
Package: pydub, librosa
Description: معالجة الصوت — تحويل formats، تقطيع، دمج، تطبيع، استخراج features.

Dependencies:
  - pydub (pip install pydub)
  - librosa (pip install librosa) — optional, for advanced features
  - System: ffmpeg (apt install ffmpeg)

Input:
  {
    "input_path": "/path/to/audio.mp3",
    "output_path": "/path/to/output.wav",
    "operation": "convert" | "cut" | "merge" | "normalize" | "info" | "extract_features",
    "params": {
      "format": "mp3" | "wav" | "ogg" | "flac",
      "start_time": 0,
      "end_time": 30,
      "bitrate": "192k",
      "merge_files": ["/path/to/other.mp3"]
    }
  }

Output:
  {
    "success": true,
    "file": "/path/to/output.wav",
    "duration_seconds": 30.5,
    "size_kb": 480.2
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def process(input_path: str = None, output_path: str = None, operation: str = "info", params: dict = None):
    params = params or {}

    try:
        from pydub import AudioSegment
    except ImportError as e:
        return {"success": False, "error": f"pydub not installed: {e}"}

    if operation == "info":
        if not input_path or not os.path.exists(input_path):
            return {"success": False, "error": f"input file not found: {input_path}"}
        try:
            audio = AudioSegment.from_file(input_path)
            return {
                "success": True,
                "file": input_path,
                "duration_seconds": round(len(audio) / 1000, 2),
                "channels": audio.channels,
                "sample_width": audio.sample_width,
                "frame_rate": audio.frame_rate,
                "frame_count": audio.frame_count(),
                "size_kb": round(os.path.getsize(input_path) / 1024, 2),
                "dbfs": round(audio.dBFS, 2) if audio.dBFS != float("-inf") else None,
            }
        except Exception as e:
            return {"success": False, "error": f"failed to read audio: {str(e)[:200]}"}

    if operation == "convert":
        if not input_path or not os.path.exists(input_path):
            return {"success": False, "error": f"input file not found: {input_path}"}
        if not output_path:
            return {"success": False, "error": "output_path required for convert"}
        try:
            audio = AudioSegment.from_file(input_path)
            fmt = params.get("format", os.path.splitext(output_path)[1][1:].lower())
            bitrate = params.get("bitrate", "192k")
            if fmt in ("mp3",):
                audio.export(output_path, format="mp3", bitrate=bitrate)
            elif fmt in ("wav",):
                audio.export(output_path, format="wav")
            elif fmt in ("ogg",):
                audio.export(output_path, format="ogg", bitrate=bitrate)
            elif fmt in ("flac",):
                audio.export(output_path, format="flac")
            else:
                return {"success": False, "error": f"unsupported format: {fmt}"}
            return {
                "success": True,
                "file": output_path,
                "format": fmt,
                "duration_seconds": round(len(audio) / 1000, 2),
                "size_kb": round(os.path.getsize(output_path) / 1024, 2),
            }
        except Exception as e:
            return {"success": False, "error": f"convert failed: {str(e)[:200]}"}

    if operation == "cut":
        if not input_path or not os.path.exists(input_path):
            return {"success": False, "error": f"input file not found: {input_path}"}
        if not output_path:
            return {"success": False, "error": "output_path required for cut"}
        try:
            audio = AudioSegment.from_file(input_path)
            start_ms = int(params.get("start_time", 0) * 1000)
            end_ms = int(params.get("end_time", len(audio) / 1000) * 1000)
            cut = audio[start_ms:end_ms]
            cut.export(output_path, format=os.path.splitext(output_path)[1][1:].lower() or "mp3")
            return {
                "success": True,
                "file": output_path,
                "start_seconds": start_ms / 1000,
                "end_seconds": end_ms / 1000,
                "duration_seconds": round(len(cut) / 1000, 2),
                "size_kb": round(os.path.getsize(output_path) / 1024, 2),
            }
        except Exception as e:
            return {"success": False, "error": f"cut failed: {str(e)[:200]}"}

    if operation == "merge":
        if not input_path:
            return {"success": False, "error": "input_path required for merge"}
        merge_files = params.get("merge_files", [])
        if not merge_files:
            return {"success": False, "error": "merge_files list required for merge"}
        if not output_path:
            return {"success": False, "error": "output_path required for merge"}
        try:
            combined = AudioSegment.empty()
            all_files = [input_path] + merge_files
            for f in all_files:
                if os.path.exists(f):
                    seg = AudioSegment.from_file(f)
                    combined += seg
            fmt = os.path.splitext(output_path)[1][1:].lower() or "mp3"
            combined.export(output_path, format=fmt)
            return {
                "success": True,
                "file": output_path,
                "merged_count": len(all_files),
                "duration_seconds": round(len(combined) / 1000, 2),
                "size_kb": round(os.path.getsize(output_path) / 1024, 2),
            }
        except Exception as e:
            return {"success": False, "error": f"merge failed: {str(e)[:200]}"}

    if operation == "normalize":
        if not input_path or not os.path.exists(input_path):
            return {"success": False, "error": f"input file not found: {input_path}"}
        if not output_path:
            return {"success": False, "error": "output_path required for normalize"}
        try:
            audio = AudioSegment.from_file(input_path)
            # Normalize to -3 dB
            target_dbfs = -3.0
            change = target_dbfs - audio.dBFS if audio.dBFS != float("-inf") else 0
            normalized = audio.apply_gain(change)
            fmt = os.path.splitext(output_path)[1][1:].lower() or "mp3"
            normalized.export(output_path, format=fmt)
            return {
                "success": True,
                "file": output_path,
                "original_dbfs": round(audio.dBFS, 2),
                "normalized_dbfs": round(normalized.dBFS, 2),
                "duration_seconds": round(len(normalized) / 1000, 2),
                "size_kb": round(os.path.getsize(output_path) / 1024, 2),
            }
        except Exception as e:
            return {"success": False, "error": f"normalize failed: {str(e)[:200]}"}

    if operation == "extract_features":
        if not input_path or not os.path.exists(input_path):
            return {"success": False, "error": f"input file not found: {input_path}"}
        try:
            import librosa
            import numpy as np
            y, sr = librosa.load(input_path, sr=None)
            duration = len(y) / sr
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            # Spectral features
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
            rms = librosa.feature.rms(y=y)[0]
            zero_crossing_rate = librosa.feature.zero_crossing_rate(y)[0]
            return {
                "success": True,
                "file": input_path,
                "duration_seconds": round(float(duration), 2),
                "sample_rate": int(sr),
                "tempo_bpm": round(float(tempo), 2),
                "rms_mean": round(float(np.mean(rms)), 4),
                "spectral_centroid_mean": round(float(np.mean(spectral_centroids)), 2),
                "zero_crossing_rate_mean": round(float(np.mean(zero_crossing_rate)), 4),
            }
        except ImportError:
            return {"success": False, "error": "librosa not installed for feature extraction"}
        except Exception as e:
            return {"success": False, "error": f"feature extraction failed: {str(e)[:200]}"}

    return {"success": False, "error": f"unknown operation: {operation}"}



def _dispatch(args):
    return process(args.get("input_path"), args.get("output_path"), args.get("operation", "info"), args.get("params", {}))


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
    parser.add_argument("--input_path", default=None)
    parser.add_argument("--output_path", default=None)
    parser.add_argument("--operation", required=True, choices=["convert", "cut", "merge", "normalize", "info", "extract_features"])
    parser.add_argument("--params", default="{}", help="JSON string of params")
    args = parser.parse_args()
    params = json.loads(args.params)
    result = process(args.input_path, args.output_path, args.operation, params)
    print(json.dumps(result, ensure_ascii=False, default=str))
