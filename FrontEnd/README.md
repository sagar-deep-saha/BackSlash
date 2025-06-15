# Gemini Chat

A chat interface built with SolidJS that integrates with Google's Gemini API and a secondary API for responses.

## Features

- Modern chat interface similar to ChatGPT
- Integration with Google's Gemini API
- Secondary API integration for responses
- Real-time typing indicators
- Message timestamps
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Gemini API key
- Secondary API endpoint

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd GeminiChat
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SECONDARY_API_URL=your_secondary_api_url_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- SolidJS
- Vite
- Google Generative AI SDK
- Axios
- TypeScript

## License

MIT

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

Learn more about deploying your application with the [documentations](https://vite.dev/guide/static-deploy.html)
