import { createHistoryRouter, redirect } from 'atomic-router';
import { createRoutesView } from 'atomic-router-react';
import { createBrowserHistory } from 'history';

import { routes } from '@/shared/config/routing';

const routesMap = [
  { route: routes.root, path: '/', view: () => null },
  { route: routes.segments, path: '/segments', view: () => null },
  { route: routes.login, path: '/login', view: () => null },
  { route: routes.signUp, path: '/sign-up', view: () => null },
];

export const router = createHistoryRouter({ routes: routesMap });

export const RoutesView = createRoutesView({ routes: routesMap });

redirect({
  clock: [router.routeNotFound, routes.root.opened],
  route: routes.segments,
});

const history = createBrowserHistory();
router.setHistory(history);
