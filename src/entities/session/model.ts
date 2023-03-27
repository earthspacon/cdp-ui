import { AxiosError, AxiosResponse } from 'axios';
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
import { not, or } from 'patronum';

import { AuthTokensSchema } from '@/shared/api/auth';
import { API_INSTANCE } from '@/shared/config/api-instance';
import { routes } from '@/shared/config/routing';
import { EffectorStorageCookieAdapter } from '@/shared/lib/effector-storage-cookie-adapter';

import { getAccessTokenByRefreshTokenFx } from './api';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const AUTH_TOKENS_COOKIE_KEY = 'AUTH_TOKENS';

class AuthTokens {
  accessToken = '';
  refreshToken = '';
}

const $authTokens = createStore(new AuthTokens());
persist({
  store: $authTokens,
  adapter: EffectorStorageCookieAdapter,
  key: AUTH_TOKENS_COOKIE_KEY,
});

export const $isAuthorized = $authTokens.map(
  (tokens) => !!tokens.accessToken && !!tokens.refreshToken,
);

export const logout = createEvent();
export const login = createEvent<AuthTokens>();

export const getRefreshTokenFx = attach({
  source: $authTokens,
  effect: getAccessTokenByRefreshTokenFx,
  mapParams: (_: void, { refreshToken }) => ({ refreshToken }),
});
const retryRequestAfter401Fx = createEffect(
  async (request: () => Promise<AxiosResponse>) => {
    return request();
  },
);

sample({
  clock: logout,
  target: [$authTokens.reinit!, routes.login.open] as const,
});

sample({
  clock: login,
  target: [$authTokens, routes.segments.open] as const,
});

sample({
  clock: getRefreshTokenFx.doneData,
  source: $authTokens,
  fn: (prevTokens, { accessToken }) => ({
    accessToken,
    refreshToken: prevTokens.refreshToken, // FIX refresh token is not changed
  }),
  target: $authTokens,
});

sample({
  clock: getRefreshTokenFx.fail,
  target: logout,
});

export function checkSession({ event }: { event: Event<void> }) {
  sample({
    clock: event,
    filter: not(or(routes.login.$isOpened, routes.signUp.$isOpened)),
    target: getRefreshTokenFx,
  });
}

export function setApiInstanceInterceptors({
  appStarted,
}: {
  appStarted: Event<void>;
}) {
  const setupInterceptorsFx = createEffect(() => {
    API_INSTANCE.interceptors.request.use((config) => {
      const parsedTokens = AuthTokensSchema.safeParse(
        JSON.parse(Cookies.get(AUTH_TOKENS_COOKIE_KEY) ?? '{}'),
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
              await retryRequestAfter401Fx(() => API_INSTANCE(originalConfig));
            } catch (err) {
              Promise.reject(err);
            }
          }
        }

        return Promise.reject(error);
      },
    );
  });

  sample({ clock: appStarted, target: setupInterceptorsFx });
}
