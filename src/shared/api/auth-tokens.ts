import { zodContract } from '@farfetched/zod';
import { z } from 'zod';

export const AccessTokenSchema = z.object({
  accessToken: z.string(),
});
export const AuthTokensSchema = AccessTokenSchema.extend({
  refreshToken: z.string(),
});

export const authTokensContract = zodContract(AuthTokensSchema);

export type AccessToken = z.infer<typeof AccessTokenSchema>;
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
