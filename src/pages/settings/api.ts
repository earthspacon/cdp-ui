import { createQuery } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { createEffect } from 'effector';
import { z } from 'zod';

import { API_INSTANCE } from '@/shared/config/api-instance';

const StatusMappingsSchema = z.object({
  mappings: z.array(
    z.object({
      externalStatus: z.string(),
      cdpStatus: z.string(),
    }),
  ),
});
export type StatusMappings = z.infer<typeof StatusMappingsSchema>;

export const statusMappingsQuery = createQuery({
  effect: createEffect(async () => {
    const response = await API_INSTANCE.get<StatusMappings>(
      '/management-service/orders/status-mappings',
    );
    return response.data;
  }),
  contract: zodContract(StatusMappingsSchema),
});
