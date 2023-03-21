import { z } from 'zod';

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
