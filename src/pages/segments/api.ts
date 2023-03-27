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
  array: z.array(
    z.object({
      id: z.string(),
      createdAt: z.string().nullable(),
      name: z.string(),
      code: z.string(),
      filters: z.object({
        customer: z
          .object({
            email: IsEmptySchema.nullable(),
            gender: z
              .object({ value: z.literal(1).or(z.literal(2)) })
              .nullable(),
            phoneNumber: IsEmptySchema.nullable(),
            birthDate: FromDateToDateSchema.nullable(),
          })
          .nullable(),
        order: z
          .object({
            date: FromDateToDateSchema.nullable(),
            status: z.object({ value: StatusSchema }).nullable(),
            ordersCount: FromToSchema.nullable(),
            ordersPriceSum: FromToSchema.nullable(),
          })
          .nullable(),
        loyalty: z
          .object({
            level: z.object({ value: z.string() }).nullable(),
            status: z.object({ value: LoyaltyProgramStatusSchema }).nullable(),
            amountOfBonuses: FromToSchema.nullable(),
          })
          .nullable(),
      }),
    }),
  ),
  totalRecordsCount: z.number(),
});

export type SegmentsList = z.infer<typeof SegmentsListSchema>;
export type Segment = SegmentsList['array'][number];
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

const CustomersCountSchema = z.object({ customersCount: z.number() });
type CustomersCount = z.infer<typeof CustomersCountSchema>;

export const segmentsCustomersCountQuery = createQuery({
  effect: createEffect(async (segmentId: string) => {
    const response = await API_INSTANCE.get<CustomersCount>(
      `/management-service/segments/${segmentId}/count`,
    );
    return response.data;
  }),
  contract: zodContract(CustomersCountSchema),
});
