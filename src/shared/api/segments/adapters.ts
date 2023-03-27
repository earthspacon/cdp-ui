import { z } from 'zod';

import { LabelValue } from '@/shared/types/utility';

export const LoyaltyProgramLevelSchema = z.object({
  statuses: z.array(z.string()),
});

export type LoyaltyProgramLevel = z.infer<typeof LoyaltyProgramLevelSchema>;

export const LoyaltyProgramStatusSchema = z
  .literal('ACTIVATED')
  .or(z.literal('DEACTIVATED'))
  .or(z.literal('UNVERIFIED'));

export type LoyaltyProgramStatus = z.infer<typeof LoyaltyProgramStatusSchema>;

export const loyaltyProgramStatuses = {
  UNVERIFIED: 'Не подтвержден',
  ACTIVATED: 'Активирован',
  DEACTIVATED: 'Деактивирован',
};

export const loyaltyProgramStatusOptions = Object.entries(
  loyaltyProgramStatuses,
).map(([value, label]) => ({
  value,
  label,
})) as LabelValue<LoyaltyProgramStatus>[];

export const hasValueMapping = {
  UNDEFINED: 'Не задано',
  EMPTY: 'Пусто',
  NOT_EMPTY: 'Не пусто',
};

export type HasValueMappingValue = keyof typeof hasValueMapping;

export const hasValueBooleanMapping = {
  EMPTY: true,
  NOT_EMPTY: false,
};

export const hasValueBoolToLabelMapping = {
  true: hasValueMapping.EMPTY,
  false: hasValueMapping.NOT_EMPTY,
};

export const hasValueOptions = Object.entries(hasValueMapping).map(
  ([value, label]) => ({ value, label }),
) as LabelValue<HasValueMappingValue>[];

export const genderMapping = {
  UNDEFINED: 'Не задано',
  MALE: 'Мужской',
  FEMALE: 'Женский',
};

export const genderNumberMapping = {
  MALE: 1,
  FEMALE: 2,
};

export const genderNumberToLabelMapping = {
  1: genderMapping.MALE,
  2: genderMapping.FEMALE,
};

export type GenderMAppingValue = keyof typeof genderMapping;

export const genderOptions = Object.entries(genderMapping).map(
  ([value, label]) => ({ value, label }),
) as LabelValue<GenderMAppingValue>[];
