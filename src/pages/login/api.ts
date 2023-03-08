import { createMutation } from '@farfetched/core';
import { createEffect } from 'effector';

import { AuthTokens, authTokensContract } from '@/shared/api/auth-tokens';
import { API_INSTANCE } from '@/shared/config/api-instance';

type LoginParams = {
  email: string;
  password: string;
};

export const loginMutation = createMutation({
  effect: createEffect(async (params: LoginParams) => {
    const response = await API_INSTANCE.post<AuthTokens>(
      '/management-service/shop/admin/signin',
      params,
    );
    return response.data;
  }),
  contract: authTokensContract,
});
