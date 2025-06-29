from pymongo import MongoClient
from core.config import settings
from core.logger import logger

if not settings.MONGO_URI:
    logger.error("MONGO_URI is missing in environment variables")
    raise ValueError("MONGO_URI environment variable is required")

client = MongoClient(settings.MONGO_URI)
db = client["kureghor"]
collection = db["queries"] 