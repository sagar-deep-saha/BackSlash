// const API_URL = 'http://localhost:8001/api';
const API_URL = 'backslash-twitter-back.vercel.app/api';

export const fetchTweets = async () => {
  const response = await fetch(`${API_URL}/tweets`);
  if (!response.ok) {
    throw new Error('Failed to fetch tweets');
  }
  return response.json();
};

export const createTweet = async (tweet) => {
  const response = await fetch(`${API_URL}/tweets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tweet),
  });
  if (!response.ok) {
    throw new Error('Failed to create tweet');
  }
  return response.json();
};

export const fetchUrlContent = async (url) => {
  const response = await fetch(`${API_URL}/fetch-url?url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch URL content');
  }
  return response.json();
}; 