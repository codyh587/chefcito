from fastapi import FastAPI

app = FastAPI()


@app.get("/welcome")
def read_user():
    return {"message": "Welcome to Chefcito!"}
