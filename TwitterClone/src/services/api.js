// const API_URL = 'http://localhost:8001/api';
const API_URL = 'https://backslash-twitter-back-xi.vercel.app/api';

export const fetchTweets = async () => {
  try {
    const response = await fetch(`${API_URL}/tweets`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch tweets');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
};

export const createTweet = async (tweet) => {
  try {
    console.log('Creating tweet:', tweet);
    const response = await fetch(`${API_URL}/tweets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tweet),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create tweet');
    }
    
    const data = await response.json();
    console.log('Tweet created:', data);
    return data;
  } catch (error) {
    console.error('Error creating tweet:', error);
    throw error;
  }
};

export const fetchUrlContent = async (url) => {
  try {
    const response = await fetch(`${API_URL}/fetch-url?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch URL content');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching URL content:', error);
    throw error;
  }
}; 