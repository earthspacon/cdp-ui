import dayjs from 'dayjs';
import { z } from 'zod';

import { createRule } from '@/shared/lib/validation-rules/create-rule';
import {
  checkIsStringValid,
  requiredString,
  requiredText,
} from '@/shared/lib/validation-rules/rules';

export function getRuleForNumberField<Value>({
  value,
  field,
  name,
  type,
}: {
  value: Value;
  field: Value;
  name: string;
  type: 'string' | 'date';
}) {
  if (Number(value) < 0) {
    return [
      {
        name: 'ordersNumberFrom',
        validator: () => ({
          isValid: false,
          errorText: 'Значение не может быть отрицательным',
        }),
      },
    ];
  }

  return getRuleToValidateByField({ field, name, type });
}

export function getRuleToValidateByField<Value>({
  field,
  name,
  type,
}: {
  field: Value;
  name: string;
  type: 'string' | 'date';
}) {
  const schema =
    type === 'string'
      ? requiredString({ errorMassage: requiredText })
      : requiredDate();
  const isFieldValid =
    type === 'string' ? checkIsStringValid(field) : checkIsDateValid(field);

  return isFieldValid ? [createRule({ name, schema })] : [];
}

export function requiredDate() {
  return z.custom((value) => checkIsDateValid(value), {
    message: requiredText,
  });
}

export function checkIsDateValid(date: unknown): date is dayjs.Dayjs {
  return dayjs.isDayjs(date) && date.isValid();
}
