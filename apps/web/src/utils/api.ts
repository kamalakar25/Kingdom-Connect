import { Capacitor } from '@capacitor/core';

// Environment Configuration
const isProduction = import.meta.env.PROD;
const RENDER_API_URL = import.meta.env.VITE_API_URL || 'https://kingdom-connect-api.onrender.com';
const LOCAL_ANDROID_URL = 'http://10.0.2.2:5000';
const LOCAL_WEB_URL = 'http://localhost:5000';

const getBaseUrl = () => {
    if (isProduction) {
        return RENDER_API_URL;
    }
    // Development Logic
    if (Capacitor.getPlatform() === 'android') {
        return LOCAL_ANDROID_URL;
    }
    return LOCAL_WEB_URL;
};

const API_URL = `${getBaseUrl()}/api/v1`;

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.message || error.error || `Error ${response.status}`);
    }

    return response.json();
};

export const login = async (email: string, password: string) => {
    return apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const register = async (email: string, password: string, name: string) => {
    return apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name, locale: 'en' }),
    });
};

export const googleLogin = async (credential: string) => {
    return apiClient('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential }),
    });
};
