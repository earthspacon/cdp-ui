import { createHistoryRouter, redirect } from 'atomic-router';
import { createBrowserHistory } from 'history';

import { routes } from '@/shared/config/routing';

export const routesMap = [
  { route: routes.root, path: '/', view: null },
  { route: routes.segments, path: '/posts-list', view: null },
];

export const router = createHistoryRouter({ routes: routesMap });

redirect({
  clock: [router.routeNotFound, routes.root.opened],
  route: routes.segments,
});

router.setHistory(createBrowserHistory());
