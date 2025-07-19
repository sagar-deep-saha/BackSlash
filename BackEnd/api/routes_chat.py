from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from bson import ObjectId
from datetime import datetime
from models.request_models import ChatRequest, PostTweetRequest
from models.response_models import ChatResponse
from services.langchain_agent import get_langchain_response
from services.twitter_service import send_to_twitterclone
from db.mongo import collection
from fastapi.encoders import jsonable_encoder

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        last_prompts_cursor = collection.find({}, {"query": 1}).sort("created_at", -1).limit(10)
        last_prompts = [doc["query"] for doc in reversed(list(last_prompts_cursor))]
        langchain_response, error = get_langchain_response(request.message, context_prompts=last_prompts)
        if error:
            return {"response": error, "id": ""}
        doc = {
            "query": request.message,
            "answer": langchain_response,
            "created_at": datetime.utcnow(),
            "tweeted": False,
            "tweet_id": None,
            "edited_answer": None
        }
        result = collection.insert_one(doc)
        return {"response": langchain_response, "id": str(result.inserted_id)}
    except Exception as e:
        return {"response": f"Unexpected error: {str(e)}", "id": ""}

@router.post("/post_tweet")
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
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history():
    try:
        docs = list(collection.find().sort("created_at", -1))
        for doc in docs:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
        return JSONResponse(content=jsonable_encoder(docs))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch history") 