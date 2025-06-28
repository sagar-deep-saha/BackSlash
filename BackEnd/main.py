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
from pymongo import MongoClient
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

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

# MongoDB setup
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    logger.error("MONGO_URI is missing in environment variables")
    raise ValueError("MONGO_URI environment variable is required")

client = MongoClient(MONGO_URI)
print(client.list_database_names())
db = client["kureghor"]
collection = db["queries"]

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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

# Request models
class ChatRequest(BaseModel):
    message: str

class PostTweetRequest(BaseModel):
    id: str  # MongoDB document id
    edited_answer: str

# Response model
class ChatResponse(BaseModel):
    response: str
    id: str

def send_to_twitterclone(contentx):
    tweet = {
        "username": os.getenv("TWITTER_USERNAME", "sagar"),
        "text": contentx
    }
    try:
        twitter_clone_api_url = os.getenv("TWITTER_CLONE_API_URL")
        twitter_clone_api_key = os.getenv("TWITTER_CLONE_API_KEY")

        if not twitter_clone_api_url:
            logger.error("Twitter Clone API URL is missing in environment variables")
            return None
        if not twitter_clone_api_key:
            logger.error("Twitter Clone API KEY is missing in environment variables")
            return None

        headers = {
            "Content-Type": "application/json",
            "api-key": twitter_clone_api_key
        }

        resp = requests.post(twitter_clone_api_url, json=tweet, headers=headers)
        logger.info(f"Twitter clone response: {resp.status_code} {resp.text}")
        resp.raise_for_status()
        return resp.json()

    except Exception as e:
        logger.error(f"Failed to send to TwitterClone: {str(e)}")
        return None

def get_gemini_response(message):
    api_url = os.getenv("GEMINI_API_URL")
    api_key = os.getenv("GEMINI_API_KEY")
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

@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {"status": "ok", "message": "Backend is running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        instruction = (
            "I want the response as a Twitter Post within 300 characters, "
            "human style post writing, minimum of 3 hashtags, and to be precise on the topic."
        )
        full_message = f"{request.message}\n\n{instruction}"
        gemini_response, error = get_gemini_response(full_message)
        if error:
            return {"response": error, "id": ""}
        # Save to MongoDB
        doc = {
            "query": request.message,
            "answer": gemini_response,
            "created_at": datetime.utcnow(),
            "tweeted": False,
            "tweet_id": None,
            "edited_answer": None
        }
        result = collection.insert_one(doc)
        return {"response": gemini_response, "id": str(result.inserted_id)}
    except Exception as e:
        return {"response": f"Unexpected error: {str(e)}", "id": ""}

@app.post("/api/post_tweet")
async def post_tweet(req: PostTweetRequest):
    try:
        # Find the document
        doc = collection.find_one({"_id": ObjectId(req.id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Query not found")
        # Post to Twitter clone
        tweet_result = send_to_twitterclone(req.edited_answer)
        if tweet_result:
            # Update DB
            collection.update_one(
                {"_id": ObjectId(req.id)},
                {"$set": {"tweeted": True, "tweet_id": tweet_result.get("_id"), "edited_answer": req.edited_answer}}
            )
            return {"status": "success", "tweet_result": tweet_result}
        else:
            raise HTTPException(status_code=500, detail="Failed to post to TwitterClone")
    except Exception as e:
        logger.error(f"Error in post_tweet: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
async def get_history():
    try:
        docs = list(collection.find().sort("created_at", -1))
        for doc in docs:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
        return JSONResponse(content=jsonable_encoder(docs))
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch history")

if __name__ == "__main__":
    import uvicorn
    # uvicorn.run(app, host="127.0.0.1", port=8000)
    uvicorn.run(app, host="0.0.0.0", port=8000)