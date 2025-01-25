import axios from 'axios';
import config from '../config';

const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
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

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            return Promise.reject({
                status: error.response.status,
                message: error.response.data.error || 'An error occurred',
                data: error.response.data
            });
        }
        return Promise.reject({
            status: 500,
            message: 'Network error occurred'
        });
    }
);

// Auth methods
const auth = {
    login(email, password) {
        return api.post('/auth/login', { email, password });
    },

    signup(userData) {
        return api.post('/auth/signup', userData);
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// Test methods
const tests = {
    getQuestions(testType) {
        return api.get(`/tests/${testType}/questions`);
    },

    submitTest(testType, answers) {
        return api.post(`/tests/${testType}/submit`, { answers });
    },

    getRecentTests() {
        return api.get('/tests/recent');
    }
};

export { auth, tests };
export default api;
