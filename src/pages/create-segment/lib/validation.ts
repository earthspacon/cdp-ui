import dayjs from 'dayjs';
import { z } from 'zod';

import { createRule } from '@/shared/lib/validation-rules/create-rule';
import {
  checkIsStringValid,
  requiredString,
  requiredText,
} from '@/shared/lib/validation-rules/rules';

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
