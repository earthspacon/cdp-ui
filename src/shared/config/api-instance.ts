import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = `${API_URL}/api/v1`;

export const API_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors configured at entities/session/model
