import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Replace with your Django backend URL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies for authentication
});

export default axiosInstance;