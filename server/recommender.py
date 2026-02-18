import json
import math
import re
from collections import Counter
import numpy as np

# =========================
# NORMALIZATION
# =========================

UNITS = {"lb", "lbs", "pound", "cup", "cups",
         "tsp", "tbsp", "oz", "ounce", "ounces"}


def normalize_ing(ing):
    ing = ing.lower()
    ing = re.sub(r"[^\w\s]", "", ing)
    tokens = ing.split()
    tokens = [t for t in tokens if t not in UNITS and not t.isdigit()]
    return " ".join(tokens)


def tokenize_ing(ing):
    return set(normalize_ing(ing).split())

# =========================
# KNOWLEDGE
# =========================


ALLERGEN_MAP = {
    "milk": {"milk", "butter", "cream", "cheese", "yogurt"},
    "eggs": {"egg", "eggs"},
    "nuts": {"almond", "walnut", "peanut", "cashew"},
    "soy": {"soy", "tofu", "soy sauce"},
    "gluten": {"flour", "wheat", "bread", "pasta"}
}

PROTEIN_CANONICAL = {
    "beef": {"beef", "ground beef", "steak", "sirloin"},
    "chicken": {"chicken", "chicken breast", "thigh"},
    "pork": {"pork", "bacon", "ham"},
    "fish": {"fish", "salmon", "tuna", "cod"},
    "turkey": {"turkey", "ground turkey"},
    "eggs": {"egg", "eggs"},
    "tofu": {"tofu"},
    "beans": {"beans", "black beans", "kidney beans"},
    "lentils": {"lentils"}
}

SPICY_INGREDIENTS = {
    "jalapeno": 0.6,
    "serrano": 0.7,
    "habanero": 1.0,
    "ghost pepper": 1.0,
    "chili": 0.5,
    "chile": 0.5,
    "chili powder": 0.4,
    "red pepper": 0.4,
    "cayenne": 0.7,
    "hot sauce": 0.6,
    "sriracha": 0.6,
    "gochujang": 0.6,
    "harissa": 0.6,
    "wasabi": 0.5,
    "horseradish": 0.5,
    "kimchi": 0.5,
    "curry paste": 0.5
}

# =========================
# FEATURE EXTRACTION
# =========================


def extract_proteins(norm_ingredients):
    found = set()
    joined = " ".join(norm_ingredients)
    for canon, variants in PROTEIN_CANONICAL.items():
        for v in variants:
            if v in joined:
                found.add(canon)
    return found


def infer_spice(norm_ingredients):
    score = 0.0
    for ing in norm_ingredients:
        for spicy, w in SPICY_INGREDIENTS.items():
            if spicy in ing:
                score += w
    return min(score, 1.0)


def extract_metadata(recipe):
    norm = [normalize_ing(i) for i in recipe["clean_ingredients"]]
    tokens = set()
    for i in norm:
        tokens |= tokenize_ing(i)

    proteins = extract_proteins(norm)

    return {
        "ingredients": set(norm),
        "tokens": tokens,
        "proteins": proteins,
        "protein_filled": bool(proteins),
        "num_ingredients": len(norm),
        "cook_time": recipe.get("num_steps", 10) * 3,
        "spice": infer_spice(norm),
        "pastry": recipe.get("subcategory", "").lower().startswith("dessert")
    }

# =========================
# VECTOR SPACE
# =========================


def build_idf(metas):
    counter = Counter()
    for m in metas:
        counter.update(m["tokens"])
    total = sum(counter.values())
    return {k: math.log(total / v) for k, v in counter.items()}


def cosine_similarity(a, b):
    dot = sum(a.get(i, 0) * b.get(i, 0) for i in b)
    norm_a = math.sqrt(sum(v*v for v in a.values()))
    norm_b = math.sqrt(sum(v*v for v in b.values()))
    return dot / max(norm_a * norm_b, 1e-6)

# =========================
# FILTERING
# =========================


def ingredient_match(user_ings, recipe_ings):
    for u in user_ings:
        for r in recipe_ings:
            if u in r or r in u:
                return True
    return False

# =========================
# LINEAR RANKER
# =========================


WEIGHTS = np.array([
    2.0,  # overlap
    1.5,  # tf-idf
    1.0,  # spice
    1.0,  # protein
    0.8,  # cook time
    0.5,  # simplicity
    1.2,  # user similarity
    1.0,  # dislike distance
    0.6,  # novelty
    1.0   # spice tolerance
])


def recommend(recipes, metas, idf, intent, liked, disliked, k=10):
    user_norm = {normalize_ing(i) for i in intent["ingredients"]}
    user_tokens = set()
    for i in user_norm:
        user_tokens |= tokenize_ing(i)
    user_proteins = extract_proteins(user_norm)

    user_prof = Counter()
    for r in liked:
        user_prof.update(extract_metadata(r)["tokens"])

    disliked_prof = Counter()
    for r in disliked:
        disliked_prof.update(extract_metadata(r)["tokens"])

    avg_spice = np.mean([m["spice"] for m in metas]) if liked else 0.3

    scored = []

    for r, meta in zip(recipes, metas):
        if intent["pastry"] is not None and meta["pastry"] != intent["pastry"]:
            continue
        if intent["protein_filled"] and not meta["protein_filled"]:
            continue
        if meta["num_ingredients"] > intent["max_num_ingredients"]:
            continue
        if meta["cook_time"] > intent["max_cook_time"]:
            continue
        if user_proteins and not user_proteins.issubset(meta["proteins"]):
            continue

        if intent["loose"]:
            if not ingredient_match(user_norm, meta["ingredients"]):
                continue
        else:
            if not all(any(u in r for r in meta["ingredients"]) for u in user_norm):
                continue

        overlap = len(meta["tokens"] & user_tokens) / max(len(user_tokens), 1)
        weighted_overlap = sum(idf.get(i, 0)
                               for i in meta["tokens"] & user_tokens)
        spice_match = 1 - abs(meta["spice"] - intent["spice"])
        cook_time = meta["cook_time"] / 120
        complexity = meta["num_ingredients"] / 20
        user_sim = cosine_similarity(user_prof, Counter(meta["tokens"]))
        dislike_sim = cosine_similarity(disliked_prof, Counter(meta["tokens"]))
        novelty = len(meta["tokens"] - user_prof.keys()) / \
            max(len(meta["tokens"]), 1)
        protein_match = len(meta["proteins"] & user_proteins) > 0
        spice_user_match = 1 - abs(meta["spice"] - avg_spice)

        vec = np.array([
            overlap,
            weighted_overlap,
            spice_match,
            protein_match,
            1 - cook_time,
            1 - complexity,
            user_sim,
            1 - dislike_sim,
            novelty,
            spice_user_match
        ])

        score = np.dot(vec, WEIGHTS)
        scored.append((score, r))

    scored.sort(key=lambda x: x[0], reverse=True)
    return scored[:k]

# =========================
# USAGE
# =========================


if __name__ == "__main__":
    RAW_RECIPES = []
    with open("clean_recipes.jsonl", encoding="utf-8") as f:
        for line in f:
            RAW_RECIPES.append(json.loads(line))

    METAS = [extract_metadata(r) for r in RAW_RECIPES]
    IDF = build_idf(METAS)

    intent = {
        "ingredients": {"ground beef", "miso"},
        "allergens": {"nuts", "soy"},
        "pastry": False,
        "max_num_ingredients": 10,
        "max_cook_time": 60,
        "spice": 0.4,
        "protein_filled": True,
        "loose": True
    }

    liked_recipes = RAW_RECIPES[:10]
    disliked_recipes = RAW_RECIPES[10:20]

    results = recommend(
        RAW_RECIPES,
        METAS,
        IDF,
        intent,
        liked_recipes,
        disliked_recipes,
        k=10
    )

    print("\nTop Recommendations:\n")
    for score, r in results:
        print(f"{score:.3f} | {r['recipe_title']}")
