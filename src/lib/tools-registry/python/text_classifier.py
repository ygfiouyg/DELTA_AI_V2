"""
Tool: text_classifier
Category: ai/nlp
Package: scikit-learn, numpy
Description: تصنيف نص إلى فئة من فئات محددة باستخدام TF-IDF + Naive Bayes.

Dependencies:
  - scikit-learn (pip install scikit-learn)
  - numpy (pip install numpy)

Input:
  {
    "text": "النص المراد تصنيفه",
    "categories": ["tech", "sports", "politics"]  # optional, defaults to built-in
  }

Output:
  {
    "success": true,
    "category": "tech",
    "confidence": 0.87,
    "all_scores": {"tech": 0.87, "sports": 0.08, "politics": 0.05}
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)

# Built-in training data (small but works for demos)
TRAINING_DATA = {
    "tech": [
        "computer software hardware programming code algorithm database network server",
        "ai machine learning python javascript framework api cloud docker kubernetes",
        "iphone android smartphone laptop processor ram gpu motherboard",
        "software development git github deployment microservices",
        "data science analytics visualization dashboard etl pipeline",
    ],
    "sports": [
        "football basketball soccer tennis baseball cricket rugby golf",
        "olympics athlete championship tournament league match goal score",
        "team player coach referee stadium fan victory defeat",
        "swimming running cycling marathon race competition medal",
        "world cup premier league nba nfl fifa uefa",
    ],
    "politics": [
        "election government president minister parliament congress senate",
        "policy law bill vote campaign democracy republican democrat",
        "political party candidate legislation foreign affairs diplomacy",
        "prime minister cabinet opposition rally debate",
        "constitution reform treaty alliance sanction",
    ],
    "business": [
        "company market stock investment profit revenue sales customer",
        "startup entrepreneur ceo cfo acquisition merger ipo shares",
        "trade commerce finance economy budget tax banking",
        "marketing strategy brand advertising campaign growth",
        "supply chain logistics manufacturing retail wholesale",
    ],
    "health": [
        "doctor patient hospital medicine disease treatment symptoms",
        "health medical clinic surgery therapy diagnosis prescription",
        "virus infection vaccine immunity wellness nutrition diet",
        "mental health psychology stress anxiety depression therapy",
        "fitness exercise yoga meditation sleep lifestyle",
    ],
    "education": [
        "school university student teacher professor lecture course",
        "education learning study exam test homework assignment",
        "academic research paper thesis dissertation science",
        "curriculum subject mathematics literature history chemistry",
        "scholarship degree diploma certificate online learning",
    ],
}


def classify(text: str, categories=None):
    if not text or not text.strip():
        return {"success": False, "error": "text required"}

    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.naive_bayes import MultinomialNB
        from sklearn.pipeline import Pipeline
    except ImportError as e:
        return {"success": False, "error": f"scikit-learn not installed: {e}"}

    # Select categories
    cats = categories if categories else list(TRAINING_DATA.keys())
    cats = [c for c in cats if c in TRAINING_DATA]
    if not cats:
        return {"success": False, "error": "no valid categories"}

    # Build training data
    train_texts = []
    train_labels = []
    for cat in cats:
        for sample in TRAINING_DATA[cat]:
            train_texts.append(sample)
            train_labels.append(cat)

    # Train
    model = Pipeline([
        ("tfidf", TfidfVectorizer(lowercase=True, stop_words="english")),
        ("clf", MultinomialNB()),
    ])
    model.fit(train_texts, train_labels)

    # Predict
    probs = model.predict_proba([text])[0]
    classes = model.classes_

    scores = {cls: round(float(p), 4) for cls, p in zip(classes, probs)}
    best_idx = probs.argmax()
    best_cat = classes[best_idx]
    confidence = float(probs[best_idx])

    return {
        "success": True,
        "category": best_cat,
        "confidence": round(confidence, 4),
        "all_scores": scores,
    }



def _dispatch(args):
    return classify(args.get("text", ""), args.get("categories"))


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
    parser.add_argument("--categories", nargs="*", default=None)
    args = parser.parse_args()
    result = classify(args.text, args.categories)
    print(json.dumps(result, ensure_ascii=False))
