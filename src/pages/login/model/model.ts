import { AxiosError } from 'axios';
import { createStore, sample } from 'effector';
import { createForm } from 'effector-forms';

import { sessionModel } from '@/entities/session';

import { EmailSchema, PasswordSchema } from '@/shared/api/auth';
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
      rules: [createRule({ name: 'email', schema: EmailSchema })],
    },
    password: {
      init: '',
      rules: [createRule({ name: 'password', schema: PasswordSchema })],
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
