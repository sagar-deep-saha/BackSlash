import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGO_URI = os.getenv("MONGO_URI")
    GEMINI_API_URL = os.getenv("GEMINI_API_URL")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")  # Use same key for LangChain
    TWITTER_CLONE_API_URL = os.getenv("TWITTER_CLONE_API_URL")
    TWITTER_CLONE_API_KEY = os.getenv("TWITTER_CLONE_API_KEY")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    TWITTER_USERNAME = os.getenv("TWITTER_USERNAME", "sagar")
    HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

settings = Settings() 