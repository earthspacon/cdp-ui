import { variant } from '@effector/reflect';
import { CircularProgress } from '@mui/material';

import { ChildrenProp } from '@/shared/types/utility';
import { Centered } from '@/shared/ui/centered';

import { $isAuthorized } from '../model';

export const AuthCheck = variant({
  if: $isAuthorized,
  then: ({ children }: ChildrenProp) => <>{children}</>,
  else: () => (
    <Centered>
      <CircularProgress size={30} />
    </Centered>
  ),
});
