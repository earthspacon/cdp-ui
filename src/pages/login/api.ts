import { createMutation } from '@farfetched/core';
import axios from 'axios';
import { createEffect } from 'effector';

import { AuthTokens, authTokensContract } from '@/shared/api/auth';
import { API_INSTANCE } from '@/shared/config/api-instance';

type LoginParams = {
  email: string;
  password: string;
};

export const loginMutation = createMutation({
  effect: createEffect(async (params: LoginParams) => {
    const response = await axios.post<AuthTokens>(
      '/management-service/shop/admin/signin',
      params,
      {
        baseURL: API_INSTANCE.defaults.baseURL,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  }),
  contract: authTokensContract,
});
