import dayjs from 'dayjs';

import {
  GenderMAppingValue,
  genderNumberMapping,
  hasValueBooleanMapping,
  HasValueMappingValue,
  LoyaltyProgramStatus,
} from '@/shared/api/segments';
import { OrderStatus } from '@/shared/api/status-mappings';
import { checkIsStringValid } from '@/shared/lib/validation-rules/rules';
import { FormDate } from '@/shared/types/utility';

import { checkIsDateValid } from './validation';

export function toIsEmptyObject(emptyValue: HasValueMappingValue | '') {
  const isValueEmpty = emptyValue === '' || emptyValue === 'UNDEFINED';
  return isValueEmpty ? null : { isEmpty: hasValueBooleanMapping[emptyValue] };
}

export function toValuesRange(from: string, to: string) {
  const isValuesValid =
    checkCanParseToNumber(from) && checkCanParseToNumber(to);
  return isValuesValid
    ? { fromValue: Number(from), toValue: Number(to) }
    : null;
}

export function toDateRange(from: FormDate, to: FormDate) {
  const isValuesValid = checkIsDateValid(from) && checkIsDateValid(to);
  return isValuesValid
    ? { fromDate: formatDate(from), toDate: formatDate(to) }
    : null;
}

export function getGenderValue(value: GenderMAppingValue | '') {
  return value === '' || value === 'UNDEFINED'
    ? null
    : toValueObject(genderNumberMapping[value]);
}

export function getOrderStatusValue(value: OrderStatus | '') {
  return value === '' || value === 'NO_STATUS' ? null : toValueObject(value);
}

export function getLoyaltyStatusValue(value: LoyaltyProgramStatus | '') {
  return value === '' ? null : toValueObject(value);
}

function toValueObject<V>(value: V) {
  return { value };
}

export function checkCanParseToNumber(value: string) {
  return checkIsStringValid(value) && !isNaN(Number(value));
}

function formatDate(date: dayjs.Dayjs) {
  return date.format('YYYY-MM-DD');
}
