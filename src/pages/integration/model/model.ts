import { cache } from '@farfetched/core';
import { createStore, sample } from 'effector';

import { routes } from '@/shared/config/routing';

import {
  ApiCatalogHistory,
  catalogHistoryQuery,
  CatalogHistoryStatus,
  uploadCatalogMutation,
} from '../api';
import { loadIntegrationPageFx } from './lazy-load';

const PAGE_SIZE = 10;

export type CatalogHistory = ApiCatalogHistory['history'][0] & {
  statusLabel: string;
};

export const $catalogHistory = createStore<CatalogHistory[]>([]);
export const $page = createStore(1);

sample({
  clock: [loadIntegrationPageFx.done, routes.integration.opened],
  source: $page,
  fn: (page) => ({ page, size: PAGE_SIZE }),
  target: catalogHistoryQuery.start,
});

cache(catalogHistoryQuery, {
  staleAfter: '10min',
  purge: uploadCatalogMutation.finished.success.map(() => {
    return;
  }),
});

sample({
  clock: catalogHistoryQuery.finished.success,
  fn: ({ result: catalog }) => {
    return catalog.history.map((history) => ({
      ...history,
      statusLabel: getHistoryStatusLabel(history.status),
    }));
  },
  target: $catalogHistory,
});

function getHistoryStatusLabel(status: CatalogHistoryStatus) {
  switch (status) {
    case 'IN_PROGRESS':
      return 'В процессе';
    case 'SUCCESS':
      return 'Успешно';
    case 'FAILED':
      return 'Произошла ошибка';
  }
}
