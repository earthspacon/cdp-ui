import axios from 'axios';
import { createEvent } from 'effector';

export const API_INSTANCE = axios.create({
  baseURL: 'http://localhost:8082',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const unAuthorized = createEvent();

API_INSTANCE.interceptors.request.use(
  (data) => data,
  (error) => {
    if (error instanceof axios.AxiosError) {
      if (error.status === 401) {
        unAuthorized();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
