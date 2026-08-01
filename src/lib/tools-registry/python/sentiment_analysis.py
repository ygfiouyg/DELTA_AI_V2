"""
Tool: sentiment_analysis
Category: ai/nlp
Package: vaderSentiment, textblob
Description: تحليل المشاعر في نص معين — يحدد إيجابي/سلبي/محايد مع نسبة الثقة.

Dependencies:
  - vaderSentiment (pip install vaderSentiment)
  - textblob (pip install textblob)

Input:
  {
    "text": "I love this product! It's amazing.",
    "language": "auto" | "en" | "ar"
  }

Output:
  {
    "success": true,
    "sentiment": "positive" | "negative" | "neutral",
    "score": 0.85,        # -1.0 to 1.0
    "confidence": 0.92,   # 0.0 to 1.0
    "language": "en",
    "details": { "pos": 0.6, "neg": 0.05, "neu": 0.35, "compound": 0.85 }
  }
"""
import sys
import json
import os

# Ensure site-packages are on path
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages", "/home/z/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def analyze(text: str, language: str = "auto"):
    """Analyze sentiment of text. Auto-detect language if needed."""
    if not text or not text.strip():
        return {"success": False, "error": "text required"}

    # Detect language if auto
    detected_lang = "en"
    if language == "auto":
        try:
            # Try Arabic first (RTL chars)
            arabic_chars = sum(1 for c in text if "\u0600" <= c <= "\u06FF")
            if arabic_chars > len(text) * 0.3:
                detected_lang = "ar"
            else:
                detected_lang = "en"
        except Exception:
            detected_lang = "en"
    else:
        detected_lang = language

    details = {}
    score = 0.0
    sentiment = "neutral"
    confidence = 0.5

    try:
        if detected_lang == "ar":
            # Use vaderSentiment (works on Arabic social media too if normalized)
            try:
                from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
                analyzer = SentimentIntensityAnalyzer()
                vs = analyzer.polarity_scores(text)
                score = vs["compound"]
                details = vs
            except ImportError:
                # Fallback: textblob-style word-list
                score = _simple_ar_sentiment(text)
                details = {"compound": score, "method": "simple_wordlist"}
        else:
            # English: use vaderSentiment
            try:
                from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
                analyzer = SentimentIntensityAnalyzer()
                vs = analyzer.polarity_scores(text)
                score = vs["compound"]
                details = vs
            except ImportError:
                # Fallback: textblob
                try:
                    from textblob import TextBlob
                    blob = TextBlob(text)
                    score = float(blob.sentiment.polarity)
                    details = {"polarity": score, "subjectivity": float(blob.sentiment.subjectivity)}
                except ImportError:
                    score = _simple_en_sentiment(text)
                    details = {"compound": score, "method": "simple_wordlist"}

        # Classify
        if score >= 0.05:
            sentiment = "positive"
            confidence = min(1.0, abs(score) + 0.1)
        elif score <= -0.05:
            sentiment = "negative"
            confidence = min(1.0, abs(score) + 0.1)
        else:
            sentiment = "neutral"
            confidence = 0.5 + (0.5 - abs(score)) * 0.5

        return {
            "success": True,
            "sentiment": sentiment,
            "score": round(score, 4),
            "confidence": round(confidence, 4),
            "language": detected_lang,
            "details": {k: round(v, 4) if isinstance(v, float) else v for k, v in details.items()},
        }
    except Exception as e:
        return {"success": False, "error": f"sentiment analysis failed: {str(e)[:200]}"}


def _simple_ar_sentiment(text: str) -> float:
    """Simple Arabic word-list sentiment (fallback)."""
    pos_words = {"جيد", "ممتاز", "رائع", "حلو", "جميل", "سعيد", "حب", "أحب", "شكرا", "مذهل", "مفيد", "ناجح", "فرح"}
    neg_words = {"سيء", "سيئ", "رديء", "حزين", "كره", "أكره", "غلط", "خطأ", "فشل", "مشكلة", "صعب", "ضعيف", "مزعج"}
    tokens = text.split()
    pos = sum(1 for t in tokens if t in pos_words)
    neg = sum(1 for t in tokens if t in neg_words)
    total = max(1, len(tokens))
    return (pos - neg) / total


def _simple_en_sentiment(text: str) -> float:
    """Simple English word-list sentiment (fallback)."""
    pos_words = {"good", "great", "excellent", "amazing", "love", "happy", "wonderful", "fantastic", "best", "awesome", "nice", "perfect"}
    neg_words = {"bad", "terrible", "awful", "hate", "sad", "horrible", "worst", "poor", "disappointed", "angry", "ugly", "wrong"}
    tokens = text.lower().split()
    pos = sum(1 for t in tokens if t in pos_words)
    neg = sum(1 for t in tokens if t in neg_words)
    total = max(1, len(tokens))
    return (pos - neg) / total



def _dispatch(args):
    return analyze(args.get("text", ""), args.get("language", "auto"))


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
    parser.add_argument("--text", required=True, help="Text to analyze")
    parser.add_argument("--language", default="auto")
    args = parser.parse_args()
    result = analyze(args.text, args.language)
    print(json.dumps(result, ensure_ascii=False))
