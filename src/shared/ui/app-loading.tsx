import { CircularProgress } from '@mui/material';

import { Centered } from './centered';

export const AppLoading = () => (
  <Centered>
    <CircularProgress size={50} />
  </Centered>
);
