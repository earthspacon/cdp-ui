import { variant } from '@effector/reflect';
import { CircularProgress } from '@mui/material';
import { not, or } from 'patronum';

import { ChildrenProp } from '@/shared/types/utility';
import { Centered } from '@/shared/ui/centered';

import { $isAuthChecking, $isAuthorized } from '../model';

export const AuthCheck = variant({
  if: or(not($isAuthorized), $isAuthChecking),
  then: () => (
    <Centered>
      <CircularProgress size={30} />
    </Centered>
  ),
  else: ({ children }: ChildrenProp) => <>{children}</>,
});
