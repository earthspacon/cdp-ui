import { createMutation, createQuery } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { createEffect } from 'effector';

import { API_INSTANCE } from '@/shared/config/api-instance';

import { LoyaltyProgramLevel, LoyaltyProgramLevelSchema } from './adapters';

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

export function createSegmentCreationMutation() {
  return createMutation({
    handler: async (body: CreateSegmentBody) => {
      const response = await API_INSTANCE.post(
        '/management-service/segments/configuration',
        body,
      );
      return response.data;
    },
  });
}

export interface CreateSegmentBody {
  name: string;
  code: string;
  filters: Filters;
}

interface Filters {
  customer: Customer | null;
  order: Order | null;
  loyalty: Loyalty | null;
}

interface Customer {
  email?: IsEmpty;
  gender?: Value;
  phoneNumber?: IsEmpty;
  birthDate?: DateRange;
}

interface Order {
  date?: DateRange;
  status?: Value;
  ordersCount?: ValuesRange;
  ordersPriceSum?: ValuesRange;
}

interface Loyalty {
  level?: Value;
  status?: Value;
  amountOfBonuses?: ValuesRange;
}

export interface DateRange {
  fromDate: string;
  toDate: string;
}

export interface ValuesRange {
  fromValue: number;
  toValue: number;
}

interface IsEmpty {
  isEmpty: boolean;
}

interface Value {
  value: number;
}
