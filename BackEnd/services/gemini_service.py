from app.core.config import settings
import requests

def get_gemini_response(message):
    api_url = settings.GEMINI_API_URL
    api_key = settings.GEMINI_API_KEY
    if not api_url or not api_key:
        return None, "Error: API configuration missing"
    full_url = f"{api_url}?key={api_key}"
    payload = {
        "contents": [{
            "role": "user",
            "parts": [{"text": message}]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 1024,
        }
    }
    try:
        response = requests.post(full_url, json=payload, headers={"Content-Type": "application/json"})
        if response.status_code != 200:
            return None, f"Gemini API error: {response.text}"
        data = response.json()
        if "candidates" not in data or not data["candidates"]:
            return None, "Invalid response from Gemini API: No candidates found"
        return data["candidates"][0]["content"]["parts"][0]["text"], None
    except Exception as e:
        return None, f"Request failed: {str(e)}" 