from fastapi import FastAPI
from pydantic import BaseModel

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


# please don't write the entire backend in a single file. however,
# it's more convenient for fastapi to put all the endpoint declarations here.
# all the helpers/ml stuff can go in different files and these functions
# can just call those helpers from this file.
