"""
Tool: keyword_extractor
Category: ai/nlp
Package: scikit-learn, nltk, rapidfuzz
Description: استخراج الكلمات المفتاحية من نص باستخدام TF-IDF + YAKE-like scoring.

Dependencies:
  - scikit-learn (pip install scikit-learn)
  - nltk (pip install nltk)

Input:
  {
    "text": "the text to extract keywords from",
    "top_n": 10,
    "language": "en"
  }

Output:
  {
    "success": true,
    "keywords": [
      {"word": "machine learning", "score": 0.92},
      {"word": "data science", "score": 0.85}
    ]
  }
"""
import sys
import os
import json
import re
from collections import Counter

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


# Stop words (basic — for English + Arabic)
STOP_WORDS = {
    # English
    "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "be", "been",
    "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
    "may", "might", "must", "shall", "can", "need", "dare", "ought", "used",
    "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them",
    "my", "your", "his", "its", "our", "their", "this", "that", "these", "those",
    "what", "which", "who", "whom", "whose", "where", "when", "why", "how",
    "all", "any", "both", "each", "few", "more", "most", "other", "some", "such",
    "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very",
    "s", "t", "just", "don", "now", "in", "on", "at", "to", "for", "of", "with",
    "by", "from", "up", "about", "into", "through", "during", "before", "after",
    "above", "below", "between", "under", "again", "further", "then", "once",
    # Arabic
    "في", "من", "على", "إلى", "عن", "مع", "هذا", "هذه", "ذلك", "تلك", "التي", "الذي",
    "كان", "كانت", "يكون", "تكون", "قد", "لقد", "كل", "بعض", "غير", "بين", "حتى",
    "إذا", "إذ", "ثم", "أو", "أم", "لكن", "بل", "لكن", "حيث", "كما", "ايضا", "أيضا",
    "هو", "هي", "هم", "هن", "نحن", "أنا", "أنت", "أنتم", "فيه", "فيها", "عنه", "عنها",
}


def extract_keywords(text: str, top_n: int = 10, language: str = "en"):
    if not text or not text.strip():
        return {"success": False, "error": "text required"}
    if top_n < 1:
        top_n = 10

    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
    except ImportError as e:
        return {"success": False, "error": f"scikit-learn not installed: {e}"}

    # Split into "documents" (sentences) for TF-IDF
    sentences = re.split(r"[.!?؟]+", text)
    sentences = [s.strip() for s in sentences if s.strip()]
    if not sentences:
        sentences = [text]

    # Build TF-IDF
    try:
        vectorizer = TfidfVectorizer(
            lowercase=True,
            stop_words=list(STOP_WORDS),
            ngram_range=(1, 3),
            min_df=1,
            max_df=0.9,
        )
        tfidf_matrix = vectorizer.fit_transform(sentences)
    except ValueError as e:
        return {"success": False, "error": f"tfidf failed: {e}"}

    # Get feature names
    feature_names = vectorizer.get_feature_names_out()

    # Sum TF-IDF scores across all sentences
    scores = tfidf_matrix.sum(axis=0).A1

    # Rank keywords
    ranked = sorted(zip(feature_names, scores), key=lambda x: x[1], reverse=True)

    # Filter: prefer longer phrases, dedupe substrings
    keywords = []
    seen_words = set()
    for word, score in ranked:
        if score <= 0:
            continue
        # Skip if substring of already-seen keyword
        is_substring = any(word in sw for sw in seen_words)
        if not is_substring:
            keywords.append({"word": word, "score": round(float(score), 4)})
            seen_words.add(word)
        if len(keywords) >= top_n:
            break

    return {
        "success": True,
        "keywords": keywords,
        "count": len(keywords),
        "language": language,
    }



def _dispatch(args):
    return extract_keywords(args.get("text", ""), int(args.get("top_n", 10)), args.get("language", "en"))


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
    parser.add_argument("--top_n", type=int, default=10)
    parser.add_argument("--language", default="en")
    args = parser.parse_args()
    result = extract_keywords(args.text, args.top_n, args.language)
    print(json.dumps(result, ensure_ascii=False))
