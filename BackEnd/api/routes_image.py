from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from services.image_service import generate_image_bytes

router = APIRouter()

class ImageRequest(BaseModel):
    prompt: str

@router.post("/generate_image")
def generate_image(request: ImageRequest):
    image_bytes, error = generate_image_bytes(request.prompt)
    if error:
        # Return error message in plain text for easier frontend debugging
        return Response(content=error, status_code=500, media_type="text/plain")
    return Response(content=image_bytes, media_type="image/jpeg")