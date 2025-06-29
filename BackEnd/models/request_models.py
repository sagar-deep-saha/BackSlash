from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

class PostTweetRequest(BaseModel):
    id: str  # MongoDB document id
    edited_answer: str 