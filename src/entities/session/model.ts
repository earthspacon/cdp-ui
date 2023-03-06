import { createMutation } from '@farfetched/core';
import { AxiosError } from 'axios';
import { attach, createEvent, createStore, Event, sample } from 'effector';
import { persist } from 'effector-storage';

import {
  API_INSTANCE,
  AuthTokens,
  sendAuthTokensFx,
} from '@/shared/config/api-instance';
import { routes } from '@/shared/config/routing';
import { EffectorStorageCookieAdapter } from '@/shared/lib/effector-storage-cookie-adapter';

import { AccessToken, accessTokenContract } from './api/contracts';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const $authTokens = createStore(new AuthTokens());
persist({
  store: $authTokens,
  key: 'authTokens',
  adapter: EffectorStorageCookieAdapter,
});

export const $isAuthorized = $authTokens.map(
  (tokens) => !!tokens.accessToken && !!tokens.refreshToken,
);

export const logout = createEvent();
export const login = createEvent<AuthTokens>();

sample({
  clock: logout,
  target: [$authTokens.reinit!, routes.login.open] as const,
});

sample({
  clock: login,
  target: [$authTokens, routes.segments.open] as const,
});

const getAuthTokensFx = attach({
  source: $authTokens,
  effect: (authTokens) => authTokens,
});
sendAuthTokensFx.use(() => getAuthTokensFx());

const getRefreshTokenMutation = createMutation({
  effect: attach({
    source: $authTokens,
    async effect({ refreshToken }) {
      const { data } = await API_INSTANCE.post<AccessToken>(
        '/management-service/shop/admin/refresh-tocken',
        { refreshToken },
      );
      return data;
    },
  }),
  contract: accessTokenContract,
});
export const $isAuthChecking = getRefreshTokenMutation.$pending;

sample({
  clock: getRefreshTokenMutation.finished.success,
  fn: ({ result: { accessToken } }) => ({
    accessToken,
    refreshToken: accessToken,
  }),
  target: $authTokens,
});

sample({
  clock: getRefreshTokenMutation.finished.failure,
  target: logout,
});

export function checkSession({ event }: { event: Event<void> }) {
  sample({ clock: event, target: getRefreshTokenMutation.start });
}

export function setApiInstanceInterceptors({
  appStarted,
}: {
  appStarted: Event<void>;
}) {
  const setupInterceptorsFx = attach({
    source: $authTokens,
    effect: ({ accessToken }) => {
      API_INSTANCE.interceptors.request.use((config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      });

      API_INSTANCE.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
          console.log({ error });
          const originalConfig = error.config;
          if (!originalConfig) return Promise.reject(error);

          if (!originalConfig?.url?.includes('sign-in') && error.response) {
            if (error.response.status === 401 && !originalConfig._retry) {
              originalConfig._retry = true;

              getRefreshTokenMutation.start();
              return API_INSTANCE(originalConfig);
            }
          }
        },
      );
    },
  });

  sample({ clock: appStarted, target: setupInterceptorsFx });
}
