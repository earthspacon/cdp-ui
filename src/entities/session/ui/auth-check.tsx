import { variant } from '@effector/reflect';
import { not, or } from 'patronum';

import { ChildrenProp } from '@/shared/types/utility';
import { AppLoading } from '@/shared/ui/app-loading';

import { $isAuthorized, getRefreshTokenFx } from '../model';

export const AuthCheck = variant({
  if: or(not($isAuthorized), getRefreshTokenFx.pending),
  then: AppLoading,
  else: ({ children }: ChildrenProp) => <>{children}</>,
});
