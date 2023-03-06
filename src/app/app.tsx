import { CircularProgress } from '@mui/material';
import { Route, RouterProvider } from 'atomic-router-react';
import { createEvent } from 'effector';
import { Suspense } from 'react';

import { LoginPage } from '@/pages/login';

import { AuthCheck, checkSession } from '@/entities/session';

import { routes } from '@/shared/config/routing';
import { styled } from '@/shared/config/stitches.config';
import { Centered } from '@/shared/ui/centered';

import { PrivateRoutesView, router } from './config/routing';

const appStarted = createEvent();

checkSession({ event: appStarted });

appStarted();

export function App() {
  return (
    <AppWrapper>
      <Suspense
        fallback={
          <Centered>
            <CircularProgress size={30} />
          </Centered>
        }
      >
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
