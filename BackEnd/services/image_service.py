import requests
import logging
from core.config import settings
import base64

logger = logging.getLogger("backslash")

# IMGGEN API configuration
IMGGEN_API_URL = "http://localhost:9002/api/generate-image"
IMGGEN_API_KEY = "1234567890123456"

def generate_image_bytes(prompt):
    """Generate an image from a text prompt using the IMGGEN API and return image bytes directly. Logs all errors and responses for debugging."""
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
        if 'image/' in content_type:
            logger.info(f"[DEBUG] Received image data directly from IMGGEN (Content-Type: {content_type}, {len(response.content)} bytes)")
            return response.content, None
        else:
            logger.info(f"[DEBUG] IMGGEN API response text: {response.text[:500]}")
            try:
                data = response.json()
                logger.info(f"[DEBUG] IMGGEN JSON response: {data}")
                if not data.get("success"):
                    error_msg = data.get("error", "Unknown error from IMGGEN")
                    logger.error(f"[DEBUG] IMGGEN error: {error_msg}")
                    if "quota" in error_msg.lower() or "429" in error_msg:
                        return None, "Image generation quota exceeded. Please try again later or upgrade your plan."
                    return None, error_msg
                if data.get("imageData"):
                    image_data = base64.b64decode(data["imageData"])
                    logger.info("[DEBUG] Received base64 image data from IMGGEN")
                    return image_data, None
                image_url = data.get("imageUrl")
                if image_url:
                    logger.info(f"[DEBUG] Downloading image from URL: {image_url}")
                    img_response = requests.get(image_url, timeout=30)
                    logger.info(f"[DEBUG] Image download status: {img_response.status_code}, headers: {dict(img_response.headers)}")
                    if img_response.status_code == 200:
                        logger.info("[DEBUG] Successfully downloaded image from URL")
                        return img_response.content, None
                    else:
                        logger.error(f"[DEBUG] Failed to download image from URL: {img_response.status_code}, body: {img_response.text[:200]}")
                        return None, "Failed to download generated image"
                logger.error("[DEBUG] No image data or URL found in IMGGEN response")
                return None, "No image data returned from IMGGEN"
            except Exception as json_error:
                logger.error(f"[DEBUG] Error parsing IMGGEN response: {json_error}")
                return None, "Invalid response from IMGGEN"
    except requests.exceptions.Timeout:
        error_msg = "Request timed out after 120 seconds"
        logger.error(f"[DEBUG] {error_msg}")
        return None, error_msg
    except requests.exceptions.ConnectionError as e:
        error_msg = f"Connection error: {str(e)}"
        logger.error(f"[DEBUG] {error_msg}")
        return None, error_msg
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        logger.error(f"[DEBUG] {error_msg}")
        return None, error_msg
