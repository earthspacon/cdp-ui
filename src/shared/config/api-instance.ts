import axios, { AxiosInstance } from 'axios';
import { createEffect, createEvent, createStore } from 'effector';

const API_URL = 'http://localhost:3000/api/v1';

export const $apiInstance = createStore<AxiosInstance | null>(null);

export const API_INSTANCE = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class AuthTokens {
  accessToken = '';
  refreshToken = '';
}

export const checkAuthorized = createEvent();
export const sendAuthTokensFx = createEffect<void, AuthTokens>();

API_INSTANCE.interceptors.request.use(async (config) => {
  const { accessToken } = await sendAuthTokensFx();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

API_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalConfig = error.config;

    if (
      !['sign-in', 'sign-up'].includes(originalConfig.url) &&
      error.response
    ) {
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        checkAuthorized();

        // try {
        //   const rs = await instance.post('/auth/refreshtoken', {
        //     refreshToken: TokenService.getLocalRefreshToken(),
        //   });

        //   const { accessToken } = rs.data;
        //   TokenService.updateLocalAccessToken(accessToken);

        //   return instance(originalConfig);
        // } catch (_error) {
        //   return Promise.reject(_error);
        // }
      }
    }

    return Promise.reject(error);
  },
);
