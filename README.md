# BackSlash Project

BackSlash is a full-stack application that combines a chat interface with a Twitter-like social media platform. The project consists of multiple components that work together to provide a seamless user experience.

## Project Structure

- `FrontEnd/` - Main frontend application
- `BackEnd/` - Main backend API service
<!-- - `TwitterClone/` - Twitter-like social media interface -->
<!-- - `TwitterBack/` - Twitter backend service -->

## Public URLs

### Frontend Applications
- Vercel Frontend: https://back-slash-front-ui.vercel.app
<!-- - Alternative Frontend: https://backslash-front.vercel.app -->
<!-- - Twitter Clone: https://backslash-twitter-clone-five.vercel.app -->
- Render Frontend: https://backslash-twitter-clone.onrender.com

### Backend Services
- Kept secret
<!-- - Main Backend: https://backslash-backend.vercel.app -->
<!-- - Twitter Backend: https://backslash-twitter-back-xi.vercel.app -->

## API Endpoints

### Main Backend API (`/api`)
- `GET /` - Health check endpoint
- `POST /api/chat` - Chat endpoint for interacting with the AI

<!-- ### Twitter Backend API (`/api`)
- `GET /api/tweets` - Get all tweets
- `POST /api/tweets` - Create a new tweet -->
<!-- - `GET /api/fetch-url` - Fetch content from a URL and create a tweet -->

## Features

1. **AI Chat Integration**
   - Interactive chat interface
   - Powered by Gemini API
   - Automatic tweet generation from chat responses

2. **Twitter-like Functionality**
   - Create and view tweets
   <!-- - Like, retweet, and reply to tweets -->
   - Share content from external URLs

3. **Cross-Platform Support**
   - Multiple frontend deployments
   - Scalable backend services
   - CORS enabled for secure cross-origin requests

## Technology Stack

- **Frontend**: Solid.js
- **Backend**: FastAPI (Python)
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

## Environment Variables

Required environment variables:
- `GEMINI_API_URL` - URL for the Gemini API
- `GEMINI_API_KEY` - API key for Gemini

<!-- ## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request -->

<!-- ## License

This project is licensed under the MIT License.  -->