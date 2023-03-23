import { createEffect } from 'effector';

import { AccessToken, AccessTokenSchema } from '@/shared/api/auth';
import { API_INSTANCE } from '@/shared/config/api-instance';

export const getAccessTokenByRefreshTokenFx = createEffect(
  async ({ refreshToken }: { refreshToken: string }) => {
    const { data } = await API_INSTANCE.post<AccessToken>(
      '/management-service/shop/admin/refresh-token',
      { refreshToken },
    );
    return AccessTokenSchema.parse(data);
  },
);
