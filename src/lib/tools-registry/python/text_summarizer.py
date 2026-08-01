"""
Tool: text_summarizer
Category: ai/nlp
Package: nltk, scikit-learn
Description: تلخيص نص طويل باستخدام extractive summarization (TF-IDF + sentence scoring).

Dependencies:
  - nltk (pip install nltk)
  - scikit-learn (pip install scikit-learn)
  - numpy

Input:
  {
    "text": "long text to summarize...",
    "sentences_count": 3,  # number of sentences in summary
    "language": "en"
  }

Output:
  {
    "success": true,
    "summary": "Sentence 1. Sentence 2. Sentence 3.",
    "original_length": 1245,
    "summary_length": 320,
    "compression_ratio": 0.26
  }
"""
import sys
import os
import json
import re

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def split_sentences(text: str, language: str = "en") -> list:
    """Split text into sentences (handles Arabic and English)."""
    # Try nltk first
    try:
        import nltk
        try:
            nltk.data.find("tokenizers/punkt")
        except LookupError:
            nltk.download("punkt", quiet=True)
            nltk.download("punkt_tab", quiet=True)
        return nltk.sent_tokenize(text, language="arabic" if language == "ar" else "english")
    except Exception:
        # Fallback: regex
        # Split on ., !, ? followed by space + capital/Arabic letter
        sentences = re.split(r"(?<=[.!?؟])\s+(?=[A-Z\u0600-\u06FF])", text)
        return [s.strip() for s in sentences if s.strip()]


def summarize(text: str, sentences_count: int = 3, language: str = "en"):
    if not text or not text.strip():
        return {"success": False, "error": "text required"}
    if sentences_count < 1:
        sentences_count = 1

    sentences = split_sentences(text, language)
    if len(sentences) <= sentences_count:
        return {
            "success": True,
            "summary": " ".join(sentences),
            "original_length": len(text),
            "summary_length": len(" ".join(sentences)),
            "compression_ratio": round(len(" ".join(sentences)) / max(1, len(text)), 4),
            "note": "Text was already short, no summarization needed",
        }

    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        import numpy as np
    except ImportError as e:
        return {"success": False, "error": f"scikit-learn/numpy not installed: {e}"}

    # Build TF-IDF matrix
    try:
        vectorizer = TfidfVectorizer(lowercase=True, stop_words="english" if language == "en" else None)
        tfidf_matrix = vectorizer.fit_transform(sentences)
    except ValueError:
        # Fallback: no stop words
        vectorizer = TfidfVectorizer(lowercase=True)
        tfidf_matrix = vectorizer.fit_transform(sentences)

    # Compute sentence similarity
    sim_matrix = cosine_similarity(tfidf_matrix)

    # Score sentences: sum of similarities to other sentences (TextRank-like)
    scores = sim_matrix.sum(axis=1)

    # Boost first sentences (position bias)
    for i in range(min(3, len(sentences))):
        scores[i] *= 1.2

    # Get top sentences (preserving original order)
    ranked_indices = np.argsort(scores)[::-1][:sentences_count]
    selected_indices = sorted(ranked_indices)

    summary = " ".join(sentences[i] for i in selected_indices)

    return {
        "success": True,
        "summary": summary,
        "original_length": len(text),
        "summary_length": len(summary),
        "compression_ratio": round(len(summary) / max(1, len(text)), 4),
        "sentences_original": len(sentences),
        "sentences_summary": len(selected_indices),
    }



def _dispatch(args):
    return summarize(args.get("text", ""), int(args.get("sentences_count", 3)), args.get("language", "en"))


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
    parser.add_argument("--sentences", type=int, default=3)
    parser.add_argument("--language", default="en")
    args = parser.parse_args()
    result = summarize(args.text, args.sentences, args.language)
    print(json.dumps(result, ensure_ascii=False))
