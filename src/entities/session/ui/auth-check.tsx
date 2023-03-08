import { variant } from '@effector/reflect';
import { not, or } from 'patronum';

import { ChildrenProp } from '@/shared/types/utility';
import { AppLoading } from '@/shared/ui/app-loading';

import { $isAuthChecking, $isAuthorized } from '../model';

export const AuthCheck = variant({
  if: or(not($isAuthorized), $isAuthChecking),
  then: AppLoading,
  else: ({ children }: ChildrenProp) => <>{children}</>,
});
