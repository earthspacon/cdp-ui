import { AxiosError } from 'axios';
import { createStore, sample } from 'effector';
import { createForm } from 'effector-forms';
import { z } from 'zod';

import { sessionModel } from '@/entities/session';

import { createRule } from '@/shared/lib/validation-rules/create-rule';

import { loginMutation } from '../api';

export const $loginErrors = createStore({
  userNotFound: false,
  anotherError: false,
});

export const loginForm = createForm({
  fields: {
    email: {
      init: '',
      rules: [
        createRule({
          name: 'email',
          schema: z
            .string()
            .min(1, { message: 'Введите email' })
            .email('Неверный формат email'),
        }),
      ],
    },
    password: {
      init: '',
      rules: [
        createRule({
          name: 'password',
          schema: z
            .string()
            .min(1, { message: 'Введите пароль' })
            .min(4, { message: 'Пароль должен быть не менее 4 символов' }),
        }),
      ],
    },
  },
  validateOn: ['submit', 'change', 'blur'],
});

sample({
  clock: loginForm.formValidated,
  target: loginMutation.start,
});

sample({
  clock: loginMutation.finished.failure,
  fn: ({ error }) => {
    if (error instanceof AxiosError && error.status === 401) {
      return { userNotFound: true, anotherError: false };
    }
    return { anotherError: true, userNotFound: false };
  },
  target: $loginErrors,
});

sample({
  clock: loginMutation.finished.success,
  fn: ({ result: authTokens }) => authTokens,
  target: sessionModel.login,
});
