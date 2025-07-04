# import os
# import requests

# def generate_workout_plan(prompt: str):
#     # TODO: Replace with actual Google Gemini API call and authentication
#     api_key = os.getenv("GEMINI_API_KEY", "your-gemini-api-key")
#     endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
#     headers = {"Authorization": f"Bearer {api_key}"}
#     data = {
#         "contents": [{"parts": [{"text": prompt}]}]
#     }
#     response = requests.post(endpoint, json=data, headers=headers)
#     if response.status_code == 200:
#         return response.json()
#     else:
#         return {"error": response.text}

import os
import requests
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env

def generate_workout_plan(prompt: str):
    api_key = os.getenv("GEMINI_API_KEY")
    endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    headers = {"Authorization": f"Bearer {api_key}"}
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    response = requests.post(endpoint, json=data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.text}
