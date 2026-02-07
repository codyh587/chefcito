from fastapi import FastAPI
from pydantic import BaseModel
import json
from recc import Ranker, recommend

RECIPES = []
with open("clean_recipes.jsonl", encoding="utf-8") as f:
    for line in f:
        RECIPES.append(json.loads(line))
RANKER = Ranker()

# run start_server.bat and go to localhost:8000/docs to test the api
app = FastAPI()


# this is a sample get endpoint
@app.get("/welcome")
def get_welcome():
    return {"message": "Welcome to CHEFCITO!"}


# sample endpoint with request body (takes in JSON), this class is required
# (post endpoints are best when you have a body)
class EchoBody(BaseModel):
    field1: str
    field2: float


@app.post("/echo")
def post_echo(body: EchoBody):
    return {"field1": body.field1, "field2": body.field2}


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


# please don't write the entire backend in a single file. however,
# it's more convenient for fastapi to put all the endpoint declarations here.
# all the helpers/ml stuff can go in different files and these functions
# can just call those helpers from this file.
