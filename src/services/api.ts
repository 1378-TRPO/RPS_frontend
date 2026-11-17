import axios from 'axios';

import { tokenStorage } from '@/utils/tokenStorage';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    if (!tokenStorage.isAccessValid()) {
        tokenStorage.clear();
        return config;
    }

    const token = tokenStorage.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            tokenStorage.clear();
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.assign('/login');
            }
        }
        return Promise.reject(error);
    },
);
