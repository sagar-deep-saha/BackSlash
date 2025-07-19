import requests
import logging
from core.config import settings
import base64

logger = logging.getLogger("backslash")

IMGGEN_API_URL = "https://imggen-amber.vercel.app/api/generate-image"
IMGGEN_API_KEY = "sagar_1234567890123456"

def generate_image_bytes(prompt):
    try:
        logger.info(f"[DEBUG] Received prompt: {prompt}")
        headers = {
            "Content-Type": "application/json",
            "x-api-key": IMGGEN_API_KEY
        }
        payload = {"prompt": prompt}
        logger.info(f"[DEBUG] Calling IMGGEN API at: {IMGGEN_API_URL} with payload: {payload}")
        response = requests.post(
            IMGGEN_API_URL,
            headers=headers,
            json=payload,
            timeout=120
        )
        logger.info(f"[DEBUG] IMGGEN API response status: {response.status_code}")
        logger.info(f"[DEBUG] IMGGEN API response headers: {dict(response.headers)}")
        content_type = response.headers.get('content-type', '')
        if response.status_code != 200:
            logger.error(f"[DEBUG] IMGGEN API error: {response.text}")
            return None, f"IMGGEN API error: {response.text}"
        if 'image' in content_type:
            return response.content, None
        elif 'application/json' in content_type:
            data = response.json()
            if 'image_base64' in data:
                return base64.b64decode(data['image_base64']), None
            else:
                logger.error(f"[DEBUG] IMGGEN API JSON error: {data}")
                return None, f"IMGGEN API JSON error: {data}"
        else:
            logger.error(f"[DEBUG] Unexpected content type: {content_type}")
            return None, f"Unexpected content type: {content_type}"
    except Exception as e:
        logger.error(f"[DEBUG] Exception in generate_image_bytes: {str(e)}")
        return None, f"Exception in generate_image_bytes: {str(e)}"
