from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
import os
from datetime import datetime
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # FrontEnd
        "http://localhost:5174",   # TwitterClone
        "https://backslash-front.vercel.app",   # Production Frontend
        "https://backslash-frontend.vercel.app"  # Alternative production URL
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Request model
class ChatRequest(BaseModel):
    message: str

# Response model
class ChatResponse(BaseModel):
    response: str

@app.get("/")
async def root():
    return {"status": "ok", "message": "Backend is running"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        logger.info(f"Received request with message: {request.message}")
        
        # Get API URL and key from environment
        api_url = os.getenv("GEMINI_API_URL")
        api_key = os.getenv("GEMINI_API_KEY")
        
        if not api_url or not api_key:
            logger.error("API configuration missing")
            return {"response": "Error: API configuration missing"}
        
        # Construct the full URL with API key
        full_url = f"{api_url}?key={api_key}"
        logger.info(f"Making request to Gemini API at: {full_url}")
        
        # Prepare the request payload
        payload = {
            "contents": [{
                "role": "user",
                "parts": [{
                    "text": request.message
                }]
            }]
        }
        
        # Make API request
        response = requests.post(
            full_url,
            json=payload,
            headers={
                "Content-Type": "application/json"
            }
        )
        
        logger.info(f"Gemini API response status: {response.status_code}")
        
        if response.status_code != 200:
            error_msg = f"Gemini API error: {response.text}"
            logger.error(error_msg)
            return {"response": f"Error: {error_msg}"}
        
        try:
            response_data = response.json()
            logger.info(f"Parsed Gemini API response: {json.dumps(response_data)}")
        except json.JSONDecodeError as e:
            error_msg = f"Failed to parse Gemini API response: {str(e)}"
            logger.error(error_msg)
            return {"response": f"Error: {error_msg}"}
        
        if "candidates" not in response_data or not response_data["candidates"]:
            error_msg = "Invalid response from Gemini API: No candidates found"
            logger.error(error_msg)
            return {"response": f"Error: {error_msg}"}
        
        try:
            # Extract the response text
            gemini_response = response_data["candidates"][0]["content"]["parts"][0]["text"]
            logger.info(f"Extracted Gemini response: {gemini_response}")
        except (KeyError, IndexError) as e:
            error_msg = f"Failed to extract response from Gemini API: {str(e)}"
            logger.error(error_msg)
            return {"response": f"Error: {error_msg}"}
        
        # Send to TwitterBack
        tweet = send_to_twitterback(gemini_response)
        
        # Return the response in the expected format
        response = {"response": gemini_response}
        logger.info(f"Sending successful response: {response}")
        return response
            
    except requests.exceptions.RequestException as e:
        error_msg = f"Request failed: {str(e)}"
        logger.error(error_msg)
        return {"response": f"Error: {error_msg}"}
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        logger.error(error_msg)
        return {"response": f"Error: {error_msg}"}

def send_to_twitterback(content):
    tweet = {
        "content": content,
        "author": "Gemini",
        "username": "@gemini",
        "timestamp": datetime.now().strftime("%I:%M %p"),
        "likes": 0,
        "retweets": 0,
        "replies": 0
    }
    try:
        resp = requests.post("https://backslash-twitter-back.vercel.app/api/tweets", json=tweet)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error(f"Failed to send to TwitterBack: {str(e)}")
        return None

# For local development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)