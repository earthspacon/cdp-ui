import { z } from 'zod';

export const requiredText = 'Поле обязательно для заполнения';

export function checkIsStringValid(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function requiredString(options?: { errorMassage?: string }) {
  return z.string().min(1, {
    message: options?.errorMassage || requiredText,
  });
}

export const PasswordSchema = requiredString({ errorMassage: 'Введите пароль' })
  .regex(/[0-9]/, {
    message: 'Пароль должен содержать хотя бы одну цифру',
  })
  .regex(/[a-z]/, {
    message: 'Пароль должен содержать хотя бы одну букву',
  })
  .min(8, { message: 'Пароль должен быть не менее 8 символов' });

export const EmailSchema = requiredString({
  errorMassage: 'Введите email',
}).email('Неверный формат email');
