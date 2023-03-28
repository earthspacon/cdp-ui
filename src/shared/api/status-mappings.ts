import { createMutation, createQuery } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { createEffect } from 'effector';
import { z } from 'zod';

import { API_INSTANCE } from '@/shared/config/api-instance';

import { LabelValue } from '../types/utility';

export const StatusSchema = z
  .literal('NEW')
  .or(
    z
      .literal('IN_PROGRESS')
      .or(z.literal('DELIVERY'))
      .or(z.literal('DELIVERED'))
      .or(z.literal('CANCEL')),
  );

const StatusMappingsSchema = z.object({
  mappings: z.array(
    z.object({
      externalStatus: z.string(),
      cdpStatus: StatusSchema,
    }),
  ),
});
export type ApiStatusMappings = z.infer<typeof StatusMappingsSchema>;

export function createStatusMappingsQuery() {
  return createQuery({
    effect: createEffect(async () => {
      const response = await API_INSTANCE.get<ApiStatusMappings>(
        '/management-service/orders/status-mappings',
      );
      return response.data;
    }),
    contract: zodContract(StatusMappingsSchema),
  });
}

export function createSaveStatusMappingsMutation() {
  return createMutation({
    handler: async (statusMappings: ApiStatusMappings) => {
      const response = await API_INSTANCE.post(
        '/management-service/orders/status-mappings',
        statusMappings,
      );
      return response.data;
    },
  });
}

export const orderStatuses = {
  NO_STATUS: 'Не задано',
  NEW: 'Новый',
  IN_PROGRESS: 'В работе',
  DELIVERY: 'Передан в службу доставки',
  DELIVERED: 'Доставлен',
  CANCEL: 'Отменен',
};
export type OrderStatus = keyof typeof orderStatuses;

export const orderStatusLabels = Object.fromEntries(
  Object.entries(orderStatuses).map(([key, value]) => [value, key]),
) as Record<string, OrderStatus>;

export const orderStatusOptions = Object.entries(orderStatuses).map(
  ([value, label]) => ({ value, label }),
) as LabelValue<OrderStatus>[];
