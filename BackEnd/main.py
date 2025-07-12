from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.logger import logger
from core.middleware import log_requests
from api import routes_chat, routes_misc, routes_image

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Middleware
app.middleware("http")(log_requests)

# Routers
app.include_router(routes_misc.router)
app.include_router(routes_chat.router, prefix="/api")
app.include_router(routes_image.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    # uvicorn.run(app, host="127.0.0.1", port=8000)
    uvicorn.run(app, host="0.0.0.0", port=8000)