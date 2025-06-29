# BackSlash Backend

This is the backend for the BackSlash project, built with FastAPI. It provides APIs for chat, posting tweets, and history, and integrates with Gemini, MongoDB, and a Twitter clone service.

## Project Structure

```
BackSlash/
├── .venv/                     # Virtual environment (in root directory)
│   └── ...
├── BackEnd/
│   ├── .env                      # Your environment variables
│   ├── .gitignore
│   ├── requirements.txt          # Dependencies
│   ├── README.md
│   ├── main.py                   # App entrypoint (FastAPI instance)
│   ├── api/
│   │   ├── routes_chat.py
│   │   └── routes_misc.py
│   ├── services/
│   │   ├── gemini_service.py
│   │   ├── twitter_service.py
│   │   └── langchain_agent.py
│   ├── models/
│   │   ├── request_models.py
│   │   └── response_models.py
│   ├── db/
│   │   └── mongo.py
│   └── core/
│       ├── config.py
│       ├── logger.py
│       └── middleware.py
```

## Setup

1. Navigate to the root directory and activate the virtual environment:
   ```bash
   cd BackSlash
   .venv\Scripts\activate  # On Windows
   # or
   source .venv/bin/activate  # On Unix/Linux
   ```
2. Navigate to BackEnd and install dependencies:
   ```bash
   cd BackEnd
   pip install -r requirements.txt
   ```
3. Copy `.env` and fill in your environment variables.
4. Run the app:
   ```bash
   uvicorn main:app --reload
   ``` 