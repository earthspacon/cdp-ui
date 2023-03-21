import { createQuery } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { createEffect } from 'effector';
import { z } from 'zod';

import { LoyaltyProgramStatusSchema } from '@/shared/api/segments';
import { StatusSchema } from '@/shared/api/status-mappings';
import { PaginationParams } from '@/shared/api/types';
import { API_INSTANCE } from '@/shared/config/api-instance';

const FromToSchema = z.object({
  fromValue: z.number(),
  toValue: z.number(),
});
const FromDateToDateSchema = z.object({
  fromDate: z.string(),
  toDate: z.string(),
});
const IsEmptySchema = z.object({
  isEmpty: z.boolean(),
});

const SegmentsListSchema = z.object({
  segments: z.array(
    z.object({
      id: z.string(),
      createdAt: z.string(),
      name: z.string(),
      code: z.string(),
      filters: z.object({
        customer: z.object({
          email: IsEmptySchema,
          gender: z.object({ value: z.number() }),
          phoneNumber: IsEmptySchema,
          birthDate: FromDateToDateSchema,
        }),
        order: z.object({
          date: FromDateToDateSchema,
          status: z.object({ value: StatusSchema }),
          ordersCount: FromToSchema,
          ordersPriceSum: FromToSchema,
        }),
        loyalty: z.object({
          level: z.object({ value: z.string() }),
          status: z.object({ value: LoyaltyProgramStatusSchema }),
          amountOfBonuses: FromToSchema,
        }),
      }),
    }),
  ),
  totalRecordsCount: z.number(),
});

export type SegmentsList = z.infer<typeof SegmentsListSchema>;
export type Segment = SegmentsList['segments'][number];
export type Filters = Segment['filters'];

export const segmentsListQuery = createQuery({
  effect: createEffect(async (params?: PaginationParams) => {
    const response = await API_INSTANCE.get<SegmentsList>(
      '/management-service/segments/configuration',
      { params },
    );
    return response.data;
  }),
  contract: zodContract(SegmentsListSchema),
});
