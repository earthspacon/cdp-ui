import { createMutation, createQuery } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { createEffect } from 'effector';
import { z } from 'zod';

import { API_INSTANCE } from '@/shared/config/api-instance';

const CatalogHistorySchema = z.object({
  history: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      status: z
        .literal('IN_PROGRESS')
        .or(z.literal('SUCCESS').or(z.literal('FAILED'))),
      errorDetails: z.string(),
    }),
  ),
  totalRecordsCount: z.number(),
});
export type ApiCatalogHistory = z.infer<typeof CatalogHistorySchema>;
export type CatalogHistoryStatus = ApiCatalogHistory['history'][0]['status'];

type GetCatalogHistoryParams = {
  page: number;
  size: number;
};

export const catalogHistoryQuery = createQuery({
  effect: createEffect(async (params?: GetCatalogHistoryParams) => {
    const response = await API_INSTANCE.get<ApiCatalogHistory>(
      '/import-service/catalog/history',
      { params },
    );
    return response.data;
  }),
  contract: zodContract(CatalogHistorySchema),
});

export const uploadCatalogMutation = createMutation({
  handler: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await API_INSTANCE.post(
      '/import-service/catalog/upload-file',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },
});

const apiTokenContract = zodContract(z.string());

export const getApiTokenQuery = createQuery({
  effect: createEffect(async () => {
    const response = await API_INSTANCE.get<{ data: string }>(
      '/management-service/shop/admin/api-token',
    );
    return response.data.data;
  }),
  contract: apiTokenContract,
});

export const generateApiTokenMutation = createMutation({
  effect: createEffect(async () => {
    const response = await API_INSTANCE.post<{ data: string }>(
      '/management-service/shop/admin/api-token',
    );
    return response.data.data;
  }),
  contract: apiTokenContract,
});
