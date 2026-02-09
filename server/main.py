from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from recc import Ranker, recommend


RECIPES = []
RANKER = Ranker()

with open("clean_recipes.jsonl", encoding="utf-8") as f:
    for line in f:
        RECIPES.append(json.loads(line))


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    return {"data": r}
