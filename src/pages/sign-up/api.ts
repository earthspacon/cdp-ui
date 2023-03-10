import { createMutation } from '@farfetched/core';
import { createEffect } from 'effector';

import { AuthTokens, authTokensContract } from '@/shared/api/auth-tokens';
import { API_INSTANCE } from '@/shared/config/api-instance';

type SignupParams = {
  email: string;
  password: string;
  shopUrl: string;
};

export const signupMutation = createMutation({
  effect: createEffect(async (params: SignupParams) => {
    const response = await API_INSTANCE.post<AuthTokens>(
      '/management-service/shop/admin/signup',
      params,
    );
    return response.data;
  }),
  contract: authTokensContract,
});
