import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { styled } from '@stitches/react';
import { Route, RouterProvider } from 'atomic-router-react';
import { createEvent } from 'effector';
import { Suspense } from 'react';

import { LoginPage } from '@/pages/login';
import { SignUpPage } from '@/pages/sign-up';

import { AuthCheck, sessionModel } from '@/entities/session';

import { routes } from '@/shared/config/routing';
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
          <Route route={routes.signUp} view={SignUpPage} />

          <AuthCheck>
            <PrivateRoutesView />
          </AuthCheck>
        </RouterProvider>
      </Suspense>
    </AppWrapper>
  );
}

const AppWrapper = styled('div', {
  width: '100vw',
  height: '100vh',
});
