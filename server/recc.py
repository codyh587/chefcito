import json
import re
import math
import pandas as pd
import torch
import torch.nn as nn
from collections import Counter


# TODO:
# 1) Index the recipes so it easier to keep track of the users prev prefences.
# 2) Find a way to make this quicker server-side,
#  so that we arent scanning thru recipes each run
# 4) think about two more latent varaibles and which will be the best to implement
# e.g., time of day, sounds great but WHAT makes a food breakfast v. dinner,
# some people like pancakes for dinner, others steak for breakfast
# so find some variable in which all users can create a nice distinction like diets.
# 5) If you feel so, more or less follow how I implemented protien based foods
# follow that feeling for just KOSHER and VEGETARIAN
# (not vegan, our dataset labels vegetarian), Kosher is a nice challenge
# 6) 7 💯
# 8) More cleaning to ingrentients list (data-cleaner needs final touches)
RECIPES = []
with open("clean_recipes.jsonl", encoding="utf-8") as f:
    for line in f:
        RECIPES.append(json.loads(line))


ALLERGEN_MAP = {
    "milk": {"milk", "butter", "cream", "cheese", "yogurt"},
    "eggs": {"egg", "eggs"},
    "nuts": {"almond", "walnut", "peanut", "cashew"},
    "soy": {"soy", "tofu", "soy sauce"},
    "gluten": {"flour", "wheat", "bread", "pasta"}
}


def contains_allergen(ingredients, blocked):
    """
    This functions returns a boolean, given a list of 
    ingredients, returns False if the given list does NOT
    contain any allergents that are provided.

    :param ingredients: List of ingredients in a recipe
    :param blocked: List of allergens the user has
    """
    ing_set = set(ingredients)
    for allergen in blocked:
        if ing_set & ALLERGEN_MAP.get(allergen, set()):
            return True
    return False


# ============================================================
# METADATA
# ============================================================

def extract_metadata(recipe):
    """
    Extracts all keywords / metadata from a recipe. E.g, prep time

    :param recipe: A JSON repr. of the recipe from the Dataset
    """
    ing = {i for i in recipe["ingredients"]}

    protein_sources = {
        "chicken", "beef", "pork", "fish", "tofu", "beans",
        "lentils", "eggs", "turkey"
    }

    return {
        "protein_filled": bool(ing & protein_sources),
        "prep_time": recipe.get("num_steps", 15),
        "cook_time": recipe.get("cook_time", 30),
        "spice": recipe.get("spice", 0.3),
        "pastry": recipe.get("pastry", False),
        "ingredients": ing
    }


# ============================================================
# FILTERING
# ============================================================

def passes_filters(meta, intent):
    """
    This does a layer of hard filtering, ensuring that the user does not recv.
    any recipes that do not fit qualifications.

    :param meta: Metadata of the recipe
    :param intent: The intent of the user
    """
    if intent["pastry"] is not None and meta["pastry"] != intent["pastry"]:
        return False

    if intent["protein_filled"] and not meta["protein_filled"]:
        return False

    if meta["prep_time"] > intent["max_prep_time"]:
        return False

    if meta["cook_time"] > intent["max_cook_time"]:
        return False

    if contains_allergen(meta["ingredients"], intent["allergens"]):
        return False

    if intent["loose"] is False:
        if not intent["ingredients"].issubset(meta["ingredients"]):
            return False
    else:
        if len(intent["ingredients"] & meta["ingredients"]) == 0:
            return False

    return True


# ============================================================
# FEATURES
# ============================================================

def build_ingredient_weights(recipes):
    '''
    Creates inverse wieghts for the list of recipes

    :param recipes: a list of recipes
    '''
    counter = Counter()
    for r in recipes:
        counter.update(extract_metadata(r)["ingredients"])
    total = sum(counter.values())
    return {k: math.log(total / v) for k, v in counter.items()}


def recipe_features(meta, intent, weights, user_profile):
    overlap = len(meta["ingredients"] & intent["ingredients"]
                  ) / max(len(intent["ingredients"]), 1)

    weighted_overlap = sum(
        weights.get(i, 0.0)
        for i in meta["ingredients"] & intent["ingredients"]
    )

    spice_dist = abs(meta["spice"] - intent["spice"])
    user_sim = user_similarity(meta, user_profile)

    return torch.tensor([
        overlap,
        weighted_overlap,
        1 - spice_dist,
        float(meta["protein_filled"]),
        meta["prep_time"] / 60.0,
        meta["cook_time"] / 60.0,
        user_sim
    ], dtype=torch.float32)


# ============================================================
# ML RANKER
# ============================================================
def build_user_profile(liked_recipes):
    profile = Counter()
    for r in liked_recipes:
        profile.update(extract_metadata(r)["ingredients"])
    return profile


def user_similarity(meta, user_profile):
    score = 0.0
    for ing in meta["ingredients"]:
        score += user_profile.get(ing, 0)
    return score / max(sum(user_profile.values()), 1)


class Ranker(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(7, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x).squeeze(-1)


# ============================================================
# DIVERSITY
# ============================================================

def recipe_similarity(a, b):
    return len(a & b) / len(a | b)


def diversify(indices, metas, k=10, max_sim=0.3):
    selected = []
    for c in indices:
        if all(
            recipe_similarity(
                metas[c]["ingredients"],
                metas[s]["ingredients"]
            ) < max_sim
            for s in selected
        ):
            selected.append(c)
        if len(selected) == k:
            break
    return selected


# ============================================================
# MAIN RECOMMENDER
# ============================================================

def recommend(recipes, intent, ranker, liked_recipes, k=10):
    metas = [extract_metadata(r) for r in recipes]
    weights = build_ingredient_weights(recipes)
    user_profile = build_user_profile(liked_recipes)

    candidates = []

    for idx, meta in enumerate(metas):
        if not passes_filters(meta, intent):
            continue

        feats = recipe_features(meta, intent, weights, user_profile)

        with torch.no_grad():
            ml_score = ranker(feats.unsqueeze(0)).item()

        base_score = feats[0].item()
        score = 0.7 * ml_score + 0.3 * base_score

        candidates.append((idx, score))

    candidates.sort(key=lambda x: x[1], reverse=True)
    indices = [idx for idx, _ in candidates]
    indices = diversify(indices, metas, k)

    return [recipes[i] for i in indices]


# ============================================================
# EXAMPLE
# ============================================================
liked_recipes = [  # tell diego to index
    RECIPES[3],
    RECIPES[17],
    RECIPES[42]
]  # 8) previous likes

intent = {
    "ingredients": {"ground beef", "potatoe", "tomato sauce", "onion", "garlic", "jalapeno"},  # var 1
    "allergens": {"nuts", "soy"},  # var 2
    "pastry": False,  # var 3
    "max_prep_time": 40,  # var 4
    "max_cook_time": 60,  # var 5
    "spice": 0.3,  # var 6
    "protein_filled": True,  # 7) update to dietary restriction
    "loose": True # 
}
# future plans to add more restriction, Kosher, Vegan, Vegatian


ranker = Ranker()

results = recommend(
    RECIPES,
    intent,
    ranker,
    liked_recipes
)

for r in results:
    print("•", r["recipe_title"])
