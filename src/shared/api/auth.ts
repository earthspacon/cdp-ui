import { zodContract } from '@farfetched/zod';
import { z } from 'zod';

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const authTokensContract = zodContract(AuthTokensSchema);

export type AuthTokens = z.infer<typeof AuthTokensSchema>;
