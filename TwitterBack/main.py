from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from typing import List, Optional
import json
from datetime import datetime

app = FastAPI()
router = APIRouter(prefix="/api")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # FrontEnd
        "http://localhost:5174",   # TwitterClone
        "https://backslash-twitter-clone.vercel.app",   # TwitterClone2
        "https://backslash-twitter-back.vercel.app"   # TwitterClone2
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    return tweets

@router.post("/tweets", response_model=Tweet)
async def create_tweet(tweet: Tweet):
    tweet.id = len(tweets) + 1
    tweet.timestamp = datetime.now().strftime("%I:%M %p")
    tweets.append(tweet)
    return tweet

@router.get("/fetch-url")
async def fetch_url(url: str):
    try:
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
        
        return new_tweet
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Include the router in the app
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    # uvicorn.run(app, host="127.0.0.1", port=8001)
    uvicorn.run(app, host="0.0.0.0", port=8001)
    # uvicorn.run(app, host="https://backslash-twitter-back.vercel.app/", port=8001) 
    # uvicorn.run(app)