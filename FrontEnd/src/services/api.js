import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: import.meta.DEV 
        ? 'http://localhost:8000' 
        // : 'http://localhost:8000',
        : 'https://back-slash-back-server.vercel.app',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 30000, // 30 second timeout
    validateStatus: status => status >= 200 && status < 500 // Accept all responses to handle them in the catch block
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
    console.log('Starting Request:', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        data: request.data
    });
    return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
    response => {
        console.log('Response:', {
            status: response.status,
            headers: response.headers,
            data: response.data
        });
        return response;
    },
    error => {
        console.error('API Error:', {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            status: error.response?.status
        });

        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('Request timed out. Please try again.'));
        }
        
        if (!error.response) {
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }

        // Handle specific error cases
        if (error.response.status === 404) {
            return Promise.reject(new Error('API endpoint not found.'));
        }
        
        if (error.response.status === 500) {
            return Promise.reject(new Error('Server error. Please try again later.'));
        }

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