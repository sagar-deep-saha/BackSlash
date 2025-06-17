from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
import os
from datetime import datetime
import json
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # FrontEnd local
        "https://back-slash-front-ui.vercel.app",   # Production Frontend
        "https://backslash-front.vercel.app"   # Alternative Production Frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"]  # Expose all headers
)

# Add middleware for request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    logger.info(f"Headers: {request.headers}")
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Request failed: {str(e)}")
        raise

# Request model
class ChatRequest(BaseModel):
    message: str

# Response model
class ChatResponse(BaseModel):
    response: str

def send_to_twitterback(content):
    tweet = {
        "content": content,
        "author": "Pr Manager",
        "username": "@manager",
        "timestamp": datetime.now().strftime("%I:%M %p"),
        "likes": 0,
        "retweets": 0,
        "replies": 0
    }
    try:
        # resp = requests.post("http://localhost:8001/api/tweets", json=tweet)
        resp = requests.post("https://backslash-twitter-back-xi.vercel.app/api/tweets", json=tweet)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error(f"Failed to send to TwitterBack: {str(e)}")
        return None

@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {"status": "ok", "message": "Backend is running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        logger.info(f"Received chat request: {request.message}")
        
        # Get API URL and key from environment
        api_url = os.getenv("GEMINI_API_URL")
        api_key = os.getenv("GEMINI_API_KEY")
        
        if not api_url or not api_key:
            logger.error("API configuration missing")
            return {"response": "Error: API configuration missing"}
        
        # Construct the full URL with API key
        full_url = f"{api_url}?key={api_key}"
        logger.info(f"Making request to Gemini API: {full_url}")
        
        # Prepare the request payload
        payload = {
            "contents": [{
                "role": "user",
                "parts": [{
                    "text": request.message
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024,
            }
        }
        
        # Make API request
        try:
            response = requests.post(
                full_url,
                json=payload,
                headers={
                    "Content-Type": "application/json"
                }
            )
            
            logger.info(f"Gemini API response status: {response.status_code}")
            logger.info(f"Gemini API response: {response.text}")
            
            if response.status_code == 400:
                error_data = response.json()
                if "error" in error_data and "message" in error_data["error"]:
                    error_msg = error_data["error"]["message"]
                    logger.error(f"Gemini API error: {error_msg}")
                    return {"response": f"Error: {error_msg}"}
            
            if response.status_code != 200:
                error_msg = f"Gemini API error: {response.text}"
                logger.error(error_msg)
                return {"response": f"Error: {error_msg}"}
            
            try:
                response_data = response.json()
                logger.info("Successfully parsed Gemini API response")
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
                logger.info("Successfully extracted response from Gemini API")
            except (KeyError, IndexError) as e:
                error_msg = f"Failed to extract response from Gemini API: {str(e)}"
                logger.error(error_msg)
                return {"response": f"Error: {error_msg}"}
            
            # Send to TwitterBack
            tweet = send_to_twitterback(gemini_response)
            if tweet:
                logger.info("Successfully sent to TwitterBack")
            else:
                logger.warning("Failed to send to TwitterBack")
            
            # Return the response in the expected format
            return {"response": gemini_response}
                
        except requests.exceptions.RequestException as e:
            error_msg = f"Request failed: {str(e)}"
            logger.error(error_msg)
            return {"response": f"Error: {error_msg}"}
            
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        logger.error(error_msg)
        return {"response": f"Error: {error_msg}"}

if __name__ == "__main__":
    import uvicorn
    # uvicorn.run(app, host="0.0.0.0", port=8000)
    uvicorn.run(app, host="0.0.0.0", port=8000)