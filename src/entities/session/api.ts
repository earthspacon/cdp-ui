import { createEffect } from 'effector';

import { AuthTokens, AuthTokensSchema } from '@/shared/api/auth';
import { API_INSTANCE } from '@/shared/config/api-instance';

export const getAuthTokensByRefreshTokenFx = createEffect(
  async (body: { refreshToken: string }) => {
    const { data } = await API_INSTANCE.post<AuthTokens>(
      '/management-service/shop/admin/refresh-token',
      body,
    );
    return AuthTokensSchema.parse(data);
  },
);
