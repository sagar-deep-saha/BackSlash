import axios from 'axios';

const API_URL = import.meta.env.DEV 
  ? 'http://localhost:8001/api'
  : 'https://backslash-twitter-back-xi.vercel.app/api';

console.log('Using API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    console.log('Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

export const fetchTweets = async () => {
  try {
    console.log('Fetching tweets...');
    const response = await api.get('/tweets');
    console.log('Tweets fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw new Error(error.response?.data?.detail || 'Failed to load tweets');
  }
};

export const createTweet = async (tweetData) => {
  try {
    console.log('Creating tweet:', tweetData);
    const response = await api.post('/tweets', tweetData);
    console.log('Tweet created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating tweet:', error);
    throw new Error(error.response?.data?.detail || 'Failed to create tweet');
  }
};

export const fetchUrlContent = async (url) => {
  try {
    console.log('Fetching URL content:', url);
    const response = await api.get(`/fetch-url?url=${encodeURIComponent(url)}`);
    console.log('URL content fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching URL content:', error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch URL content');
  }
}; 