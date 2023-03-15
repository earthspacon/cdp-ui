import { createMutation, createQuery } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { createEffect } from 'effector';
import { z } from 'zod';

import { API_INSTANCE } from '@/shared/config/api-instance';

const StatusMappingsSchema = z.object({
  mappings: z.array(
    z.object({
      externalStatus: z.string(),
      cdpStatus: z
        .literal('NEW')
        .or(
          z
            .literal('IN_PROGRESS')
            .or(z.literal('DELIVERY'))
            .or(z.literal('DELIVERED'))
            .or(z.literal('CANCEL')),
        ),
    }),
  ),
});
export type ApiStatusMappings = z.infer<typeof StatusMappingsSchema>;

export const statusMappingsQuery = createQuery({
  effect: createEffect(async () => {
    const response = await API_INSTANCE.get<ApiStatusMappings>(
      '/management-service/orders/status-mappings',
    );
    return response.data;
  }),
  contract: zodContract(StatusMappingsSchema),
});

export const saveStatusMappingsMutation = createMutation({
  handler: async (statusMappings: ApiStatusMappings) => {
    const response = await API_INSTANCE.post(
      '/management-service/orders/status-mappings',
      statusMappings,
    );
    return response.data;
  },
});
