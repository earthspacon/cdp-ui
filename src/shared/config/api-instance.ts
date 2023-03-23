import axios from 'axios';


const url_pattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const API_URL = url_pattern.test(window.VITE_API_URL) ? window.VITE_API_URL : import.meta.env.VITE_API_URL;
const API_BASE_URL = `${API_URL}/api/v1`;

export const API_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors configured at entities/session/model
