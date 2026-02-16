# main.py
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from recommender import (
    recommend,
    extract_metadata,
    build_idf
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

recipes = []
with open("clean_recipes.jsonl", encoding="utf-8") as fin:
    for line in fin:
        recipes.append(json.loads(line))

METAS = [extract_metadata(r) for r in recipes]
IDF = build_idf(METAS)

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

@app.post("/recommend")
def post_recommend(body: RecommendBody):
    return {
        "data": recommend(
            recipes=recipes,
            metas=METAS,
            idf=IDF,
            intent=body.model_dump(),
            liked=[],
            disliked=[],
            k=body.limit,
        )
    }
