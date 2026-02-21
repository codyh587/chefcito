import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from emoji_generator import find_best_food_emoji
from recommender import recommend, extract_metadata, build_idf


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


RECIPES = []
with open("clean_recipes.jsonl", encoding="utf-8") as fin:
    for line in fin:
        RECIPES.append(json.loads(line))

METAS = [extract_metadata(r) for r in RECIPES]
IDF = build_idf(METAS)
ID_TO_RECIPE = {r["recipe_id"]: r for r in RECIPES}


class RecommendBody(BaseModel):
    ingredients: set[str]
    allergens: set[str]
    pastry: bool
    max_num_ingredients: int
    max_cook_time: int
    spice: float
    protein_filled: bool
    loose: bool
    limit: int
    liked: set[int]


@app.post("/recommend")
def post_recommend(body: RecommendBody):
    recipes = []

    for _, recipe in recommend(
        recipes=RECIPES,
        metas=METAS,
        idf=IDF,
        intent=body.model_dump(),
        liked=[ID_TO_RECIPE[recipe_id] for recipe_id in body.liked],
        disliked=[],
        k=body.limit,
    ):
        recipe["emoji"] = find_best_food_emoji(
            recipe["recipe_title"], recipe["category"], recipe["subcategory"]
        )[0]

        recipes.append(recipe)

    return {"data": recipes}
