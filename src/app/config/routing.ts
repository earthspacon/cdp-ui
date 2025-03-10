import { createHistoryRouter, redirect } from 'atomic-router';
import { createRoutesView } from 'atomic-router-react';
import { createBrowserHistory } from 'history';

import { CreateSegmentPage } from '@/pages/create-segment';
import { IntegrationPage } from '@/pages/integration';
import { MailingsPage } from '@/pages/mailings';
import { SegmentsPage } from '@/pages/segments';
import { SettingsPage } from '@/pages/settings';

import { MainDrawer } from '@/widgets/main-drawer';

import { routeControls, routes } from '@/shared/config/routing';

const routesMap = [
  {
    route: routes.root,
    path: '/',
    view: () => null,
  },
  {
    route: routes.segments,
    path: '/segments',
    view: SegmentsPage,
    layout: MainDrawer,
  },
  {
    route: routes.createSegment,
    path: '/segments/create',
    view: CreateSegmentPage,
  },
  {
    route: routes.integration,
    path: '/integration',
    view: IntegrationPage,
    layout: MainDrawer,
  },
  {
    route: routes.mailings,
    path: '/mailings',
    view: MailingsPage,
    layout: MainDrawer,
  },
  {
    route: routes.settings,
    path: '/settings',
    view: SettingsPage,
    layout: MainDrawer,
  },
  {
    route: routes.login,
    path: '/login',
    view: () => null,
    // view is defined at app.tsx
  },
  {
    route: routes.signUp,
    path: '/sign-up',
    view: () => null,
    // view is defined at app.tsx
  },
];

export const router = createHistoryRouter({
  routes: routesMap,
  controls: routeControls,
});

const privateViewRoutes = routesMap.filter(
  (route) => !['/login', '/sign-up'].includes(route.path),
);
export const PrivateRoutesView = createRoutesView({
  routes: privateViewRoutes,
});

redirect({
  clock: [router.routeNotFound, routes.root.opened],
  route: routes.segments,
});

const history = createBrowserHistory();
router.setHistory(history);
