import { createMutation } from '@farfetched/core';
import { AxiosError } from 'axios';
import { attach, createEvent, createStore, Event, sample } from 'effector';
import { persist } from 'effector-storage';

import {
  API_INSTANCE,
  AuthTokens,
  requestForAuthTokens,
  sendAuthTokensFx,
} from '@/shared/config/api-instance';
import { routes } from '@/shared/config/routing';
import { EffectorStorageCookieAdapter } from '@/shared/lib/effector-storage-cookie-adapter';

import { AccessToken, accessTokenContract } from './api/contracts';

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
  effect: sendAuthTokensFx,
  mapParams: () => ({}),
});

sample({
  clock: requestForAuthTokens,
  source: $authTokens,
  target: sendAuthTokensFx,
});

const getRefreshTokenMutation = createMutation({
  effect: attach({
    source: $authTokens,
    async effect({ refreshToken }) {
      const { data } = await API_INSTANCE.post<AccessToken>(
        '/management-service/shop/admin/refresh-token',
        { refreshToken },
      );
      return data;
    },
  }),
  contract: accessTokenContract,
});
export const $isAuthChecking = getRefreshTokenMutation.$pending;

type AppStarted = { appStarted: Event<void> };

export function startSessionCheck({ appStarted }: AppStarted) {
  sample({ clock: appStarted, target: getRefreshTokenMutation.start });

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
    filter: ({ error }) => {
      if (error instanceof AxiosError) {
        return error.response?.status === 401;
      }
      return false;
    },
    target: logout,
  });
}

export function setApiInstanceInterceptors({ appStarted }: AppStarted) {
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
        async (error) => {
          const originalConfig = error.config;

          if (
            !['sign-in', 'sign-up'].includes(originalConfig.url) &&
            error.response
          ) {
            if (error.response.status === 401 && !originalConfig._retry) {
              originalConfig._retry = true;

              try {
                const rs = await instance.post('/auth/refreshtoken', {
                  refreshToken: TokenService.getLocalRefreshToken(),
                });

                const { accessToken } = rs.data;
                TokenService.updateLocalAccessToken(accessToken);

                return instance(originalConfig);
              } catch (_error) {
                return Promise.reject(_error);
              }
            }
          }
        },
      );
    },
  });
}

// export function getAuthorizedRoute<Params extends RouteParams>(
//   route: RouteInstance<Params>,
// ) {
//   const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();

//   const alreadyAuthorized = sample({
//     clock: sessionCheckStarted,
//     filter: $isAuthorized,
//   });

//   return chainRoute({
//     route,
//     beforeOpen: sessionCheckStarted,
//     openOn: alreadyAuthorized,
//   });
// }
