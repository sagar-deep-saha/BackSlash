from fastapi import FastAPI, HTTPException, APIRouter, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from typing import List, Optional
import json
from datetime import datetime
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

app = FastAPI()
router = APIRouter(prefix="/api")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # FrontEnd
        "http://localhost:5177",   # TwitterClone local
        "https://backslash-twitter-clone-five.vercel.app",   # Production TwitterClone
        "https://back-slash-front-ui.vercel.app",   # Main Frontend
        "https://backslash-twitter-clone.onrender.com",   # Render Frontend
        "https://backslash-twitter-back-xi.vercel.app"   # Backend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Add logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    logger.info(f"Request headers: {request.headers}")
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Request failed: {str(e)}")
        raise

class Tweet(BaseModel):
    id: Optional[int] = None
    content: str
    author: str
    username: str
    timestamp: str
    likes: int = 0
    retweets: int = 0
    replies: int = 0

# In-memory storage for tweets
tweets: List[Tweet] = []

@router.get("/tweets", response_model=List[Tweet])
async def get_tweets():
    logger.info("Getting tweets")
    return tweets

@router.post("/tweets", response_model=Tweet)
async def create_tweet(tweet: Tweet):
    try:
        logger.info(f"Creating tweet: {tweet.dict()}")
        tweet.id = len(tweets) + 1
        tweet.timestamp = datetime.now().strftime("%I:%M %p")
        tweets.append(tweet)
        logger.info(f"Tweet created with ID: {tweet.id}")
        return tweet
    except Exception as e:
        logger.error(f"Error creating tweet: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fetch-url")
async def fetch_url(url: str):
    try:
        logger.info(f"Fetching URL: {url}")
        response = requests.get(url)
        response.raise_for_status()
        
        # Create a tweet from the URL content
        content = f"Shared from {url}\n\n{response.text[:200]}..."  # Truncate content
        new_tweet = Tweet(
            content=content,
            author="URL Fetcher",
            username="@urlfetcher",
            timestamp=datetime.now().strftime("%I:%M %p")
        )
        
        # Add to tweets list
        new_tweet.id = len(tweets) + 1
        tweets.append(new_tweet)
        logger.info(f"URL content fetched and tweet created with ID: {new_tweet.id}")
        
        return new_tweet
    except Exception as e:
        logger.error(f"Error fetching URL: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Include the router in the app
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    # For local development
    # uvicorn.run(app, host="127.0.0.1", port=8001)
    # For production (Vercel)
    uvicorn.run(app, host="0.0.0.0", port=8001)
    # uvicorn.run(app)