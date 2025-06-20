# BackSlash Project

BackSlash is a full-stack application that combines a chat interface with a Twitter-like social media platform. The project consists of multiple components that work together to provide a seamless user experience.

## Project Structure

- `FrontEnd/` - Main frontend application (Solid.js/React)
- `BackEnd/` - Main backend API service (FastAPI)
<!-- - `TwitterClone/` - Twitter-like social media interface -->
<!-- - `TwitterBack/` - Twitter backend service -->

## Public URLs

### Frontend Applications
- Vercel Frontend: https://back-slash-front-ui.vercel.app
<!-- - Alternative Frontend: https://backslash-front.vercel.app -->
<!-- - Twitter Clone: https://backslash-twitter-clone-five.vercel.app -->
- Render Frontend: https://backslash-twitter-clone.onrender.com

### Backend Services
- Kept secret for security
<!-- - Main Backend: https://backslash-backend.vercel.app -->
<!-- - Twitter Backend: https://backslash-twitter-back-xi.vercel.app -->

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

<!-- ### Twitter Backend API (`/api`)
- `GET /api/tweets` - Get all tweets
- `POST /api/tweets` - Create a new tweet -->
<!-- - `GET /api/fetch-url` - Fetch content from a URL and create a tweet -->

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
   <!-- - Twitter Backend: `uvicorn main:app --host 0.0.0.0 --port 8001` -->
   - Frontend: `npm run dev`

<!-- ## Environment Variables -->

<!-- Required environment variables for backend:
- `GEMINI_API_URL` - URL for the Gemini API
- `GEMINI_API_KEY` - API key for Gemini
- `TWITTER_CLONE_API_URL` - URL for the Twitter clone backend
- `TWITTER_CLONE_API_KEY` - API key for the Twitter clone backend -->

<!-- ## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request -->

<!-- ## License

This project is licensed under the MIT License.  -->