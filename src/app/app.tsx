import { CircularProgress } from '@mui/material';
import { RouterProvider } from 'atomic-router-react';
import { createEvent } from 'effector';
import { Suspense } from 'react';

import { startSessionCheck } from '@/entities/session';

import { Centered } from '@/shared/ui/centered';

import { router, RoutesView } from './config/routing';

const appStarted = createEvent();

startSessionCheck({ appStarted });

appStarted();

export function App() {
  return (
    <Suspense
      fallback={
        <Centered>
          <CircularProgress size={30} />
        </Centered>
      }
    >
      <RouterProvider router={router}>
        <RoutesView />
      </RouterProvider>
    </Suspense>
  );
}
