import { createEffect } from 'effector';
import { z } from 'zod';

import { API_INSTANCE } from '@/shared/config/api-instance';

export const AccessTokenSchema = z.object({
  accessToken: z.string(),
});
export const AuthTokensSchema = AccessTokenSchema.extend({
  refreshToken: z.string(),
});
type AccessToken = z.infer<typeof AccessTokenSchema>;

export const getAccessTokenByRefreshTokenFx = createEffect(
  async ({ refreshToken }: { refreshToken: string }) => {
    const { data } = await API_INSTANCE.post<AccessToken>(
      '/management-service/shop/admin/refresh-token',
      { refreshToken },
    );
    return AccessTokenSchema.parse(data);
  },
);
