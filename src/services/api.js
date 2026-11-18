import axios from 'axios';


const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'https://hospital-management-backend-2-00oy.onrender.com'}/api`,
});

// 1. Axios Request Interceptor: Har request se pehle token attach karega
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Axios Response Interceptor: 403 (Access Denied) ya 401 errors ko handle karega
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;

            // Agar user ke paas action perform karne ki permission na ho
            if (status === 403) {
                alert("Access Denied: You do not have permission to perform this action.");
            }
            // Agar token expire ho gaya ho ya unauthorized ho
            else if (status === 401) {
                alert("Session expired. Please log in again.");
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default API;