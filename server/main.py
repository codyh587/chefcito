from fastapi import FastAPI
from pydantic import BaseModel
import json
from recc import Ranker, recommend

RECIPES = []
with open("clean_recipes.jsonl", encoding="utf-8") as f:
    for line in f:
        RECIPES.append(json.loads(line))
RANKER = Ranker()


app = FastAPI()


class IntentBody(BaseModel):
    ingredients: set[str]
    allergens: set[str]
    pastry: bool
    max_prep_time: int
    max_cook_time: int
    spice: float
    protein_filled: bool
    loose: bool
    num_reccomendations: int = 3  # default is 3 for now


@app.post("/recommend")
def post_recommend(body: IntentBody):
    r = recommend(RECIPES, body.model_dump(), RANKER, [], body.num_reccomendations)
    return r
