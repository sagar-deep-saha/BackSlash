import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000, // 10 second timeout
    validateStatus: status => status >= 200 && status < 500 // Accept all responses to handle them in the catch block
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
    console.log('Starting Request:', request);
    return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
            return Promise.reject(new Error('Request timed out. Please try again.'));
        }
        if (!error.response) {
            console.error('Network Error:', error);
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }
        console.error('Response Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            config: error.config
        });
        return Promise.reject(error);
    }
);

export const sendMessage = async (message) => {
    try {
        console.log('Sending message to backend:', message);
        const response = await api.post('/api/chat', {
            message: message
        });
        
        console.log('Raw response from backend:', response);
        console.log('Response data:', response.data);
        
        if (!response.data) {
            console.error('No data in response');
            throw new Error('No data received from server');
        }
        
        if (!response.data.response) {
            console.error('Invalid response format:', response.data);
            throw new Error('Invalid response format from server');
        }
        
        console.log('Received response from backend:', response.data);
        return response.data.response;
    } catch (error) {
        console.error('Error in sendMessage:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            error: error
        });
        
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        if (error.message) {
            throw new Error(error.message);
        }
        throw new Error('Failed to get response from server');
    }
};

export const sendToSecondaryAPI = async (message) => {
    try {
        await api.post('/api/secondary', { message });
    } catch (error) {
        console.error('Error calling secondary API:', error);
        throw error;
    }
}; 