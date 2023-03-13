import { createEvent, createStore, sample } from 'effector';
import { enqueueSnackbar } from 'notistack';
import { spread } from 'patronum';

import { routes } from '@/shared/config/routing';

import {
  ApiCatalogHistory,
  catalogHistoryQuery,
  CatalogHistoryStatus,
  getApiTokenQuery,
  uploadCatalogMutation,
} from '../api';
import { loadIntegrationPageFx } from './lazy-load';

export const PAGE_SIZE = 10;

export type CatalogHistory = ApiCatalogHistory['history'][0] & {
  statusLabel: string;
};

export const $catalogHistory = createStore<CatalogHistory[]>([]);
export const $apiToken = createStore('');
export const $page = createStore(0);

export const pageChanged = createEvent<number>();
export const fileUploaded = createEvent<FileList | null>();

sample({
  clock: pageChanged,
  fn: (page) => ({ page, params: { page, size: PAGE_SIZE } }),
  target: spread({
    targets: { page: $page, params: catalogHistoryQuery.start },
  }),
});

sample({
  clock: [loadIntegrationPageFx.done, routes.integration.opened],
  fn: () => {
    return;
  },
  target: [catalogHistoryQuery.start, getApiTokenQuery.start],
});

sample({
  clock: catalogHistoryQuery.finished.success,
  fn: ({ result: catalog }) => {
    const catalogHistory = catalog.history.map((history) => ({
      ...history,
      statusLabel: getHistoryStatusLabel(history.status),
    }));
    return catalogHistory;
  },
  target: $catalogHistory,
});

sample({
  clock: getApiTokenQuery.finished.success,
  fn: ({ result: apiToken }) => {
    if (apiToken.length === 0) {
      return 'Токен не найден';
    }
    return apiToken;
  },
  target: $apiToken,
});

sample({
  clock: fileUploaded,
  filter: (fileList) => {
    const isYml = fileList?.[0].name.endsWith('.yml');
    if (!isYml) {
      enqueueSnackbar('Неверный формат файла', { variant: 'error' });
    }
    return isYml === true;
  },
  fn: (fileList) => fileList?.[0] as File,
  target: uploadCatalogMutation.start,
});

sample({
  clock: uploadCatalogMutation.finished.success,
  fn: () => {
    enqueueSnackbar('Каталог успешно загружен', { variant: 'success' });
    return;
  },
  target: [catalogHistoryQuery.start, getApiTokenQuery.start],
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
