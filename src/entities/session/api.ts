import axios from 'axios';
import { createEffect } from 'effector';

import { AuthTokens, AuthTokensSchema } from '@/shared/api/auth';
import { API_INSTANCE } from '@/shared/config/api-instance';

export const getAuthTokensByRefreshTokenFx = createEffect(
  async (body: { refreshToken: string }) => {
    const response = await axios.post<AuthTokens>(
      '/management-service/shop/admin/refresh-token',
      body,
      {
        baseURL: API_INSTANCE.defaults.baseURL,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return AuthTokensSchema.parse(response.data);
  },
);
