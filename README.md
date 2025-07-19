# BackSlash Project

BackSlash is a full-stack application that combines a chat interface with a Twitter-like social media platform. The project consists of multiple components that work together to provide a seamless user experience.

## Project Structure

- `FrontEnd/` - Main frontend application (Solid.js/React)
- `BackEnd/` - Main backend API service (FastAPI)

## Public URLs

### Frontend Applications
- Vercel Frontend: https://back-slash-front-ui.vercel.app
- Render Frontend: https://backslash-front-ui.onrender.com

## Workflow

1. **User requests a post on a topic.**
2. **Backend gets the answer from Gemini and returns it to the frontend.**
3. **Frontend displays the answer in an editable field.**
4. **User can edit the answer.**
5. **User clicks 'Post to Twitter' to submit the edited answer.**
6. **Backend posts the edited answer to the Twitter clone.**
7. **Every query and answer (original and edited) are saved in MongoDB.**

## API Endpoints

### Main Backend API (`/api`)
- `GET /` - Health check endpoint
- `POST /api/chat` - Get Gemini answer and save to MongoDB
- `POST /api/post_tweet` - Post edited answer to Twitter clone and update MongoDB


## Features

1. **AI Chat Integration**
   - Interactive chat interface
   - Powered by Gemini API
   - User can edit AI-generated answers before posting

2. **Twitter-like Functionality**
   - Post edited answers to Twitter clone
   - View history of queries and answers

3. **Persistence**
   - All queries and answers are saved in MongoDB

4. **Cross-Platform Support**
   - Multiple frontend deployments
   - Scalable backend services
   - CORS enabled for secure cross-origin requests

## Technology Stack

- **Frontend**: Solid.js/React
- **Backend**: FastAPI (Python)
- **Database**: MongoDB Atlas
- **Deployment**: Vercel, Render
- **AI Integration**: Google Gemini API

## Development

To run the project locally:

1. Clone the repository
2. Set up environment variables
3. Install dependencies for each component
4. Run the services:
   - Main Backend: `uvicorn main:app --host 0.0.0.0 --port 8000`
   - Frontend: `npm run dev`
