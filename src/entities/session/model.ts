import { AxiosError } from 'axios';
import {
  attach,
  createEffect,
  createEvent,
  createStore,
  Event,
  sample,
} from 'effector';
import { persist } from 'effector-storage';
import Cookies from 'js-cookie';

import { API_INSTANCE } from '@/shared/config/api-instance';
import { routes } from '@/shared/config/routing';
import { EffectorStorageCookieAdapter } from '@/shared/lib/effector-storage-cookie-adapter';

import { AuthTokensSchema, getAccessTokenByRefreshTokenFx } from './api';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

class AuthTokens {
  accessToken = '';
  refreshToken = '';
}

const $authTokens = createStore(new AuthTokens());
persist({
  store: $authTokens,
  adapter: EffectorStorageCookieAdapter,
  key: 'authTokens',
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

const getRefreshTokenFx = attach({
  source: $authTokens,
  effect: getAccessTokenByRefreshTokenFx,
});
export const $isAuthChecking = getRefreshTokenFx.pending;

sample({
  clock: getRefreshTokenFx.doneData,
  fn: ({ accessToken }) => ({ accessToken, refreshToken: accessToken }),
  target: $authTokens,
});

sample({
  clock: getRefreshTokenFx.fail,
  target: logout,
});

export function checkSession({ event }: { event: Event<void> }) {
  sample({ clock: event, target: getRefreshTokenFx });
}

export function setApiInstanceInterceptors({
  appStarted,
}: {
  appStarted: Event<void>;
}) {
  const setupInterceptorsFx = createEffect(() => {
    API_INSTANCE.interceptors.request.use((config) => {
      const parsedTokens = AuthTokensSchema.safeParse(
        Cookies.get('authTokens'),
      );
      if (parsedTokens.success) {
        config.headers.Authorization = `Bearer ${parsedTokens.data.accessToken}`;
      }
      return config;
    });

    API_INSTANCE.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalConfig = error.config;
        if (!originalConfig) return Promise.reject(error);

        if (!originalConfig?.url?.includes('sign-in') && error.response) {
          if (error.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;

            try {
              await getRefreshTokenFx();
              return API_INSTANCE(originalConfig);
            } catch (error) {
              return Promise.reject(error);
            }
          }
        }
      },
    );
  });

  sample({ clock: appStarted, target: setupInterceptorsFx });
}
