import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Button, Typography } from '@mui/material';
import { styled } from '@stitches/react';
import { Route, RouterProvider } from 'atomic-router-react';
import { createEvent } from 'effector';
import { SnackbarProvider } from 'notistack';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { LoginPage } from '@/pages/login';
import { SignUpPage } from '@/pages/sign-up';

import { AuthCheck, sessionModel } from '@/entities/session';

import { routeControls, routes } from '@/shared/config/routing';
import { AppLoading } from '@/shared/ui/app-loading';
import { Centered } from '@/shared/ui/centered';

import { PrivateRoutesView, router } from './config/routing';
import './styles.css';

const appStarted = createEvent();

sessionModel.setApiInstanceInterceptors({ appStarted });
sessionModel.checkSession({ event: appStarted });

appStarted();

export function App() {
  return (
    <AppWrapper>
      <ErrorBoundary FallbackComponent={ErrorComponent}>
        <StyledSnackbarProvider>
          <Suspense fallback={<AppLoading />}>
            <RouterProvider router={router}>
              <Route route={routes.login} view={LoginPage} />
              <Route route={routes.signUp} view={SignUpPage} />

              <AuthCheck>
                <PrivateRoutesView />
              </AuthCheck>
            </RouterProvider>
          </Suspense>
        </StyledSnackbarProvider>
      </ErrorBoundary>
    </AppWrapper>
  );
}

function ErrorComponent() {
  return (
    <Centered>
      <ErrorWrapper>
        <Typography variant="h4" fontWeight={500}>
          Произошла ошибка
        </Typography>
        <Button variant="contained" onClick={() => routeControls.back()}>
          Вернуться назад
        </Button>
      </ErrorWrapper>
    </Centered>
  );
}

const AppWrapper = styled('div', {
  width: '100vw',
  height: '100vh',
});

const StyledSnackbarProvider = styled(SnackbarProvider, {
  fontFamily: 'Roboto',
});

const ErrorWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
  alignItems: 'center',
  justifyContent: 'center',
});
