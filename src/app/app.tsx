import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Route, RouterProvider } from 'atomic-router-react';
import { createEvent } from 'effector';
import { Suspense } from 'react';

import { LoginPage } from '@/pages/login';

import { AuthCheck, sessionModel } from '@/entities/session';

import { routes } from '@/shared/config/routing';
import { styled } from '@/shared/config/stitches.config';
import { AppLoading } from '@/shared/ui/app-loading';

import { PrivateRoutesView, router } from './config/routing';
import './styles.css';

const appStarted = createEvent();

sessionModel.setApiInstanceInterceptors({ appStarted });
sessionModel.checkSession({ event: appStarted });

appStarted();

export function App() {
  return (
    <AppWrapper>
      <Suspense fallback={<AppLoading />}>
        <RouterProvider router={router}>
          <Route route={routes.login} view={LoginPage} />
          <Route route={routes.signUp} view={() => null} />

          <AuthCheck>
            <PrivateRoutesView />
          </AuthCheck>
        </RouterProvider>
      </Suspense>
    </AppWrapper>
  );
}

const AppWrapper = styled('div', {
  w: '100vw',
  h: '100vh',
});
