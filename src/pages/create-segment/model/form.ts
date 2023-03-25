import dayjs from 'dayjs';
import { createForm } from 'effector-forms';
import { z } from 'zod';

import { createRule } from '@/shared/lib/validation-rules/create-rule';
import { FormDate } from '@/shared/types/utility';

const requiredText = 'Поле обязательно для заполнения';

export const segmentCreationForm = createForm({
  fields: {
    segmentName: {
      init: '',
      rules: [createRule({ name: 'segmentName', schema: requiredString() })],
    },
    email: {
      init: '',
    },
    gender: {
      init: '',
    },
    phoneNumber: {
      init: '',
    },
    birthDateFrom: {
      init: null as FormDate,
      rules(_, form) {
        return validateByAnotherField({
          field: form.birthDateTo,
          name: 'birthDateFrom',
          type: 'date',
        });
      },
    },
    birthDateTo: {
      init: null as FormDate,
      rules(_, form) {
        return validateByAnotherField({
          field: form.birthDateFrom,
          name: 'birthDateTo',
          type: 'date',
        });
      },
    },

    ordersNumberFrom: {
      init: '',
      rules(_, form) {
        return validateByAnotherField({
          field: form.ordersNumberTo,
          name: 'ordersNumberFrom',
          type: 'string',
        });
      },
    },
    ordersNumberTo: {
      init: '',
      rules(_, form) {
        return validateByAnotherField({
          field: form.ordersNumberFrom,
          name: 'ordersNumberTo',
          type: 'string',
        });
      },
    },
    ordersTotalFrom: {
      init: '',
      rules(_, form) {
        return validateByAnotherField({
          field: form.ordersTotalTo,
          name: 'ordersTotalFrom',
          type: 'string',
        });
      },
    },
    ordersTotalTo: {
      init: '',
      rules(_, form) {
        return validateByAnotherField({
          field: form.ordersTotalFrom,
          name: 'ordersTotalTo',
          type: 'string',
        });
      },
    },
    ordersStatus: {
      init: '',
    },
    purchaseDateRangeFrom: {
      init: null as FormDate,
      rules(_, form) {
        return validateByAnotherField({
          field: form.purchaseDateRangeTo,
          name: 'purchaseDateRangeFrom',
          type: 'date',
        });
      },
    },
    purchaseDateRangeTo: {
      init: null as FormDate,
      rules(_, form) {
        return validateByAnotherField({
          field: form.purchaseDateRangeFrom,
          name: 'purchaseDateRangeTo',
          type: 'date',
        });
      },
    },

    loyaltyProgramLevel: {
      init: '',
    },
    loyaltyProgramStatus: {
      init: '',
    },
    bonusesBalanceFrom: {
      init: '',
      rules(_, form) {
        return validateByAnotherField({
          field: form.bonusesBalanceTo,
          name: 'bonusesBalanceFrom',
          type: 'string',
        });
      },
    },
    bonusesBalanceTo: {
      init: '',
      rules(_, form) {
        return validateByAnotherField({
          field: form.bonusesBalanceFrom,
          name: 'purchaseDateRangeTo',
          type: 'string',
        });
      },
    },
  },
  validateOn: ['submit', 'blur', 'change'],
});

function validateByAnotherField<Value>({
  field,
  name,
  type,
}: {
  field: Value;
  name: string;
  type: 'string' | 'date';
}) {
  const schema = type === 'string' ? requiredString() : requiredDate();
  const isFieldValid =
    type === 'string' ? checkIsStringValid(field) : checkIsDateValid(field);

  return isFieldValid ? [createRule({ name, schema })] : [];
}

function requiredString() {
  return z.string().min(1, { message: requiredText });
}

function requiredDate() {
  return z.custom((value) => checkIsDateValid(value), {
    message: requiredText,
  });
}

export function checkIsDateValid(date: unknown) {
  return dayjs.isDayjs(date) && date.isValid();
}

export function checkIsStringValid(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}
