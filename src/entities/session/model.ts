import {
  chainRoute,
  RouteInstance,
  RouteParams,
  RouteParamsAndQuery,
} from 'atomic-router';
import {
  createEffect,
  createEvent,
  createStore,
  Event,
  sample,
  split,
} from 'effector';
import Cookies from 'js-cookie';

import { routes } from '@/shared/config/routing';

export const logout = createEvent();
const tokenReceived = createEvent<string>();

export const $authToken = createStore('');
export const $isAuthorized = $authToken.map(Boolean);

$authToken.on(tokenReceived, (_, token) => token);
$authToken.reset(logout);

const removeTokenFromCookiesFx = createEffect(() => {
  Cookies.remove('AUTH_TOKEN');
});
const getTokenFromCookiesFx = createEffect(() => Cookies.get('AUTH_TOKEN'));

sample({
  clock: logout,
  target: [removeTokenFromCookiesFx, routes.login.open],
});

export function startSessionCheck({ appStarted }: { appStarted: Event<void> }) {
  sample({
    clock: appStarted,
    target: getTokenFromCookiesFx,
  });

  split({
    source: getTokenFromCookiesFx.doneData,
    match: (token) => (token ? 'tokenReceived' : 'tokenErased'),
    cases: { tokenErased: logout, tokenReceived },
  });
}

export function getAuthorizedRoute<Params extends RouteParams>(
  route: RouteInstance<Params>,
) {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();

  const alreadyAuthorized = sample({
    clock: sessionCheckStarted,
    filter: $isAuthorized,
  });

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: [alreadyAuthorized, tokenReceived],
  });
}
