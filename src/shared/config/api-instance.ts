import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

export const API_INSTANCE = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors configured at entities/session/model
