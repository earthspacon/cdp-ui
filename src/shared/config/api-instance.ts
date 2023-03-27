import axios from 'axios';

const url_pattern =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

type Window = typeof window & {
  VITE_API_URL?: string;
};

const typedWindow = window as Window;

const windowApiUrl = typedWindow?.VITE_API_URL;
const envApiUrl = import.meta.env.VITE_API_URL;

const API_URL = url_pattern.test(windowApiUrl ?? '') ? windowApiUrl : envApiUrl;
const API_BASE_URL = `${API_URL}/api/v1`;

export const API_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors configured at entities/session/model
