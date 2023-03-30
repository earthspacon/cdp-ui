import { sample } from 'effector';
import { createForm } from 'effector-forms';
import { z } from 'zod';

import { sessionModel } from '@/entities/session';

import { EmailSchema, PasswordSchema } from '@/shared/api/auth';
import { createRule } from '@/shared/lib/validation-rules/create-rule';

import { signupMutation } from '../api';

export const signupForm = createForm({
  fields: {
    email: {
      init: '',
      rules: [createRule({ name: 'email', schema: EmailSchema })],
    },
    password: {
      init: '',
      rules: [createRule({ name: 'password', schema: PasswordSchema })],
    },
    confirmPassword: {
      init: '',
      rules: [
        {
          name: 'confirmPassword',
          validator: (confirm, { password }) => ({
            isValid: confirm === password,
            errorText: 'Пароли не совпадают',
          }),
        },
      ],
    },
    shopUrl: {
      init: '',
      rules: [
        createRule({
          name: 'shopUrl',
          schema: z.string().url('Неверный формат ссылки'),
        }),
      ],
    },
  },
  validateOn: ['submit', 'change', 'blur'],
});

sample({
  clock: signupForm.formValidated,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fn: ({ confirmPassword, ...params }) => params,
  target: signupMutation.start,
});

sample({
  clock: signupMutation.finished.success,
  fn: ({ result: authTokens }) => authTokens,
  target: sessionModel.login,
});
