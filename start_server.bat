cd server
call .venv/Scripts/activate
fastapi dev main.py --reload --port 8000
