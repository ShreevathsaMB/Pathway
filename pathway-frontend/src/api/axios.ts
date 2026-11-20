import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                    refresh: refreshToken,
                });

                const { access } = response.data;
                localStorage.setItem('access_token', access);

                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authAPI = {
    register: (data: any) => api.post('/users/register/', data),
    login: (data: any) => api.post('/users/login/', data),
    guestLogin: (data: any = {}) => api.post('/users/guest/', data),
    logout: (refreshToken: string) => api.post('/users/logout/', { refresh_token: refreshToken }),
    getProfile: () => api.get('/users/profile/'),
    updateProfile: (data: any) => api.put('/users/profile/', data),
};

// Mood API
export const moodAPI = {
    logMood: (data: any) => api.post('/users/mood/', data),
    getMoodHistory: () => api.get('/users/mood/history/'),
};

// Streak API
export const streakAPI = {
    updateStreak: () => api.post('/users/streak/update/'),
};

// Safety API
export const safetyAPI = {
    getContacts: () => api.get('/safety/contacts/'),
    getLegalInfo: (category?: string, lang?: string) =>
        api.get('/safety/legal/', { params: { category, lang } }),
    getTips: (category?: string, lang?: string) =>
        api.get('/safety/tips/', { params: { category, lang } }),
};
