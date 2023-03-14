import { Typography } from '@mui/material';

import { Centered } from './centered';

export function NoData() {
  return (
    <Centered>
      <Typography color="GrayText">Нет данных</Typography>
    </Centered>
  );
}
