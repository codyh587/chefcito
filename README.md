# CHEFCITO

### Mobile web application for ML-powered recipe recommendations.

<br />
<div align="center">
  <img src="./client/public/logo.svg" alt="Logo" height="200" />
</div>

## Built with:

<!-- https://github.com/Ileriayo/markdown-badges -->

![React](https://img.shields.io/badge/react-20232A?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MediaPipe](https://img.shields.io/badge/mediapipe-0097A7?style=for-the-badge&logo=mediapipe&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white)

## About

¡Bienvenido a CHEFCITO!

CHEFCITO is a mobile web application that leverages machine learning to deliver personalized recipe recommendations tailored to your allergies, dietary preferences, and cooking habits. Simply tell CHEFCITO what you have on hand — or let it identify ingredients for you — and it will suggest recipes uniquely suited to you.

CHEFCITO supports manual ingredient entry alongside Google MediaPipe-powered object detection and barcode scanning, making it easy to log groceries straight from the store. Your ingredients, recipes, and preferences are persisted locally on your browser. CHEFCITO's recommendation system is powered by PyTorch and cosine similarity scoring to suggest the best recipe recommendations for every user.

## Installation

1. Install [Node.js](https://nodejs.org) and [Python](https://python.org)
2. Clone the repository `git clone https://github.com/codyh587/chefcito.git`
3. Install npm packages `npm install` in the `client` folder
4. Create/activate a Python virtual environment `python -m venv .venv` in the `server` folder
5. Install python packages `pip install -r requirements.txt` in the `server` folder
6. For Windows: run `./start_client` and `./start_server` to start the application \
   For macOS/Linux: run `npm run dev -- --port 3000` in the `client` folder and `fastapi dev main.py --reload --port 8000` in the `server` folder to start the application

## License

Distributed under the MIT License. See `LICENSE.md` for more information.
