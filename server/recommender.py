import json
import math
from collections import Counter
import torch
import torch.nn as nn
import numpy as np


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


def extract_proteins(ingredients):
    found = set()
    for canon, variants in PROTEIN_CANONICAL.items():
        if ingredients & variants:
            found.add(canon)
    return found


def contains_allergen(ingredients, blocked):
    for allergen in blocked:
        if ingredients & ALLERGEN_MAP.get(allergen, set()):
            return True
    return False


def infer_spice(ingredients):
    score = 0.0
    for ing in ingredients:
        for spicy, weight in SPICY_INGREDIENTS.items():
            if spicy in ing:
                score += weight
    return min(score, 1.0)


def extract_metadata(recipe):
    ing = {i.lower() for i in recipe["ingredients"]}
    proteins = extract_proteins(ing)
    spice = infer_spice(ing)

    return {
        # usefull if we want to make veggiterian
        "protein_filled": bool(proteins),
        "proteins": proteins,
        "num_ingredients": len(ing),
        # assuming each step takes ~ 3 minutes
        "cook_time": recipe.get("num_steps", 10) * 3,
        "spice": spice,
        "pastry": recipe.get("subcategory", "") == "Allrecipes Allstars Desserts",
        "ingredients": ing
    }


def passes_filters(meta, intent):
    if intent["pastry"] is not None and meta["pastry"] != intent["pastry"]:
        return False
    if intent["protein_filled"] and not meta["protein_filled"]:
        return False
    if meta["num_ingredients"] > intent["max_num_ingredients"]:
        return False
    if meta["cook_time"] > intent["max_cook_time"]:
        return False
    if contains_allergen(meta["ingredients"], intent["allergens"]):
        return False

    if not intent["loose"]:
        if not intent["ingredients"].issubset(meta["ingredients"]):
            return False
    else:
        if len(intent["ingredients"] & meta["ingredients"]) == 0:
            return False

    return True


def build_legal_recipe_universe(recipes, intent):
    user_proteins = extract_proteins(intent["ingredients"])
    legal = []

    for r in recipes:
        meta = extract_metadata(r)
        if not passes_filters(meta, intent):
            continue

        if user_proteins:
            if meta["proteins"] != user_proteins:
                continue

        legal.append(r)

    return legal


def build_ingredient_weights(recipes):
    counter = Counter()
    for r in recipes:
        counter.update(extract_metadata(r)["ingredients"])
    total = sum(counter.values())
    return {k: math.log(total / v) for k, v in counter.items()}


def build_user_profile(recipes):
    profile = Counter()
    for r in recipes:
        profile.update(extract_metadata(r)["ingredients"])
    return profile


def similarity(meta, profile):
    score = 0.0
    for ing in meta["ingredients"]:
        score += profile.get(ing, 0)
    return score / max(sum(profile.values()), 1)


def recipe_features(meta, intent, weights, user_profile, disliked_profile, avg_spice):
    overlap = len(meta["ingredients"] & intent["ingredients"]
                  ) / max(len(intent["ingredients"]), 1)
    weighted_overlap = sum(weights.get(i, 0.0)
                           for i in meta["ingredients"] & intent["ingredients"])
    spice_dist = abs(meta["spice"] - intent["spice"])
    user_sim = similarity(meta, user_profile)
    dislike_sim = similarity(meta, disliked_profile)
    novelty = len(meta["ingredients"] - user_profile.keys()
                  ) / max(len(meta["ingredients"]), 1)
    protein_score = len(meta["proteins"] &
                        extract_proteins(intent["ingredients"]))
    spice_user_dist = abs(meta["spice"] - avg_spice)

    return torch.tensor([
        overlap,                       # 1
        weighted_overlap,              # 2
        1 - spice_dist,                # 3
        protein_score,                 # 4
        meta["cook_time"],             # 5 (time in minutes)
        meta["num_ingredients"] / 20,  # 6
        user_sim,                      # 7
        1 - dislike_sim,               # 8
        novelty,                       # 9
        1 - spice_user_dist,           # 10
        float(meta["pastry"]),         # 11
        len(meta["proteins"])          # 12
    ], dtype=torch.float32)

# -------------------------------
# RANKER
# -------------------------------


class Ranker(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(12, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x).squeeze(-1)

# -------------------------------
# TRAINING
# -------------------------------


def train_ranker(ranker, liked, disliked, intent, epochs=50, lr=0.01):
    weights = build_ingredient_weights(RECIPES)
    user_profile = build_user_profile(liked)
    disliked_profile = build_user_profile(disliked)
    avg_spice = np.mean([extract_metadata(r)["spice"]
                        for r in liked]) if liked else 0.3

    optimizer = torch.optim.Adam(ranker.parameters(), lr=lr)
    criterion = nn.BCELoss()

    X, y = [], []

    for r in liked:
        meta = extract_metadata(r)
        X.append(recipe_features(meta, intent, weights,
                 user_profile, disliked_profile, avg_spice))
        y.append(torch.tensor(1.0))

    for r in disliked:
        meta = extract_metadata(r)
        X.append(recipe_features(meta, intent, weights,
                 user_profile, disliked_profile, avg_spice))
        y.append(torch.tensor(0.0))

    if not X:
        return

    X = torch.stack(X)
    y = torch.stack(y)

    for _ in range(epochs):
        optimizer.zero_grad()
        loss = criterion(ranker(X), y)
        loss.backward()
        optimizer.step()

# -------------------------------
# RECOMMENDER
# -------------------------------


def recommend(recipes, intent, ranker, liked, disliked=None, k=10):
    disliked = disliked or []
    metas = [extract_metadata(r) for r in recipes]
    weights = build_ingredient_weights(recipes)
    user_profile = build_user_profile(liked)
    disliked_profile = build_user_profile(disliked)
    avg_spice = np.mean([extract_metadata(r)["spice"]
                        for r in liked]) if liked else 0.3

    scores = []

    for r, meta in zip(recipes, metas):
        feats = recipe_features(meta, intent, weights,
                                user_profile, disliked_profile, avg_spice)
        with torch.no_grad():
            ml_score = ranker(feats.unsqueeze(0)).item()
        scores.append((r, ml_score))

    scores.sort(key=lambda x: x[1], reverse=True)
    return [r for r, _ in scores[:k]]


if __name__ == "__main__":
    # Recommendation factors:
    # 1) Ingredient overlap with user intent
    # 2) Weighted ingredient importance (TF-IDF)
    # 3) Spice match to user preference
    # 4) Protein match score
    # 5) Cook time
    # 6) Recipe complexity (num ingredients)
    # 7) Similarity to liked recipes
    # 8) Distance from disliked recipes
    # 9) Novelty vs familiarity
    # 10) Personal spice tolerance
    # 11) Allergens (just to ensure we are right)

    RAW_RECIPES = []
    with open("clean_recipes.jsonl", encoding="utf-8") as f:
        for line in f:
            RAW_RECIPES.append(json.loads(line))

    intent = {
        "ingredients": {"chicken", "potato", "tomato sauce", "onion", "garlic", "jalapeno"},
        "allergens": {"nuts", "soy"},
        "pastry": False,
        "max_num_ingredients": 10,
        "max_cook_time": 60,  # measured in minutes
        "spice": 0.4,
        "protein_filled": True,
        "loose": True
    }

    RECIPES = build_legal_recipe_universe(RAW_RECIPES, intent)

    print(f"Loaded {len(RAW_RECIPES)} recipes")
    print(f"Legal universe: {len(RECIPES)} recipes")
    liked_recipes = RECIPES[:5]
    disliked_recipes = RECIPES[5:10]

    ranker = Ranker()
    train_ranker(ranker, liked_recipes, disliked_recipes, intent)

    results = recommend(RECIPES, intent, ranker,
                        liked_recipes, disliked_recipes)

    print("\nTop recommendations:")
    for r in results:
        print("•", r["recipe_title"])
