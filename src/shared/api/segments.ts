import { createQuery } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { createEffect } from 'effector';
import { z } from 'zod';

import { API_INSTANCE } from '../config/api-instance';
import { LabelValue } from '../types/utility';

export const LoyaltyProgramLevelSchema = z.object({
  statuses: z.array(z.string()),
});
type LoyaltyProgramLevel = z.infer<typeof LoyaltyProgramLevelSchema>;

export function createLoyaltyLevelsQuery() {
  return createQuery({
    effect: createEffect(async () => {
      const response = await API_INSTANCE.get<LoyaltyProgramLevel>(
        '/management-service/loyalty/statuses',
      );
      return response.data;
    }),
    contract: zodContract(LoyaltyProgramLevelSchema),
  });
}

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
) as LabelValue<keyof typeof hasValueMapping>[];

export const genderMapping = {
  UNDEFINED: 'Не задано',
  MALE: 'Мужской',
  FEMALE: 'Женский',
};
export const genderOptions = Object.entries(genderMapping).map(
  ([value, label]) => ({ value, label }),
) as LabelValue<keyof typeof genderMapping>[];
