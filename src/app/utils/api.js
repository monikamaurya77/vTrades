// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // All API routes will be prefixed with /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for token attachment or error handling
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('userToken'); // Get token from local storage
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error('API Error:', error.response?.data || error.message);
    // You can handle specific error codes here, e.g., redirect to login on 401
    return Promise.reject(error.response?.data || { message: 'An unexpected error occurred.' });
  }
);

export default api;