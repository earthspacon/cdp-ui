import { createEffect, sample } from 'effector';
import { createForm } from 'effector-forms';
import { debounce } from 'patronum';
import { z } from 'zod';

import { createRule } from '@/shared/lib/validation-rules/create-rule';

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

type LoginParams = {
  email: string;
  password: string;
};

const loginFx = createEffect(async (params: LoginParams) => {
  console.log({ params });
});
export const $loginFxPending = loginFx.pending;

const debouncedLogin = debounce({ source: loginFx, timeout: 3000 });

sample({
  clock: loginForm.formValidated,
  target: debouncedLogin,
});
