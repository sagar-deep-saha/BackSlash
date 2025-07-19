import requests
from core.config import settings
from core.logger import logger

def send_to_twitterclone(contentx):
    tweet = {
        "username": settings.TWITTER_USERNAME,
        "text": contentx
    }
    try:
        twitter_clone_api_url = settings.TWITTER_CLONE_API_URL
        twitter_clone_api_key = settings.TWITTER_CLONE_API_KEY

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