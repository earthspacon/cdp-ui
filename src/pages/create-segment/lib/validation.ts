import dayjs from 'dayjs';
import { z } from 'zod';

import { createRule } from '@/shared/lib/validation-rules/create-rule';

const requiredText = 'Поле обязательно для заполнения';

export function getRuleToValidateByField<Value>({
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

export function requiredString() {
  return z.string().min(1, { message: requiredText });
}

export function requiredDate() {
  return z.custom((value) => checkIsDateValid(value), {
    message: requiredText,
  });
}

export function checkIsDateValid(date: unknown): date is dayjs.Dayjs {
  return dayjs.isDayjs(date) && date.isValid();
}

export function checkIsStringValid(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}
