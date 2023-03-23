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

export const PasswordSchema = z
  .string()
  .min(1, { message: 'Введите пароль' })
  .regex(/[0-9]/, {
    message: 'Пароль должен содержать хотя бы одну цифру',
  })
  .regex(/[a-z]/, {
    message: 'Пароль должен содержать хотя бы одну букву',
  })
  .min(8, { message: 'Пароль должен быть не менее 8 символов' });
