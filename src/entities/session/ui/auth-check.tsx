import { variant } from '@effector/reflect';

import { ChildrenProp } from '@/shared/types/utility';
import { AppLoading } from '@/shared/ui/app-loading';

import { $isAuthorized, getRefreshTokenFx } from '../model';

export const AuthCheck = variant({
  if: getRefreshTokenFx.pending,
  then: AppLoading,
  else: variant({
    if: $isAuthorized,
    then: ({ children }: ChildrenProp) => <>{children}</>,
    else: () => null,
  }),
});
