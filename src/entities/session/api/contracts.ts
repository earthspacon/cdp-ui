import { zodContract } from '@farfetched/zod';
import { z } from 'zod';

const AccessTokenSchema = z.object({
  accessToken: z.string(),
});

export type AccessToken = z.infer<typeof AccessTokenSchema>;
export const accessTokenContract = zodContract(AccessTokenSchema);
