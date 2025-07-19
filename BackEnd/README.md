# BackSlash Backend

This is the backend for the BackSlash project, built with FastAPI. It provides APIs for chat, posting tweets, and history, and integrates with Gemini, MongoDB, and a Twitter clone service.

## Project Structure

BackSlash/
    .venv/                     
        ...
    BackEnd/
        .env                      
        .gitignore
        requirements.txt          
        README.md
        main.py                   
        api/
            routes_chat.py
            routes_misc.py
        services/
            gemini_service.py
            twitter_service.py
            langchain_agent.py
        models/
            request_models.py
            response_models.py
        db/
            mongo.py
        core/
            config.py
            logger.py
            middleware.py

## Setup

1. Navigate to the root directory and activate the virtual environment:
   cd BackSlash
   .venv\Scripts\activate  
   source .venv/bin/activate  
2. Navigate to BackEnd and install dependencies:
   cd BackEnd
   pip install -r requirements.txt
3. Copy .env and fill in your environment variables.
4. Run the app:
   uvicorn main:app --reload 