import { cache, update } from '@farfetched/core';
import { attach, createEvent, createStore, sample } from 'effector';
import { spread } from 'patronum';

import { routes } from '@/shared/config/routing';
import { notifyError, notifySuccess } from '@/shared/lib/notification';

import {
  ApiCatalogHistory,
  catalogHistoryQuery,
  CatalogHistoryStatus,
  generateApiTokenMutation,
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
export const $noApiToken = createStore(false);
export const $page = createStore(0);
export const $fileInputValue = createStore('');

export const pageChanged = createEvent<number>();
export const fileUploaded = createEvent<FileList | null>();
export const generateTokenClicked = createEvent();
export const copyTokenClicked = createEvent();

const copyTokenFx = attach({
  source: $apiToken,
  effect(apiToken) {
    navigator.clipboard.writeText(apiToken);
  },
});

cache(catalogHistoryQuery, { staleAfter: '5min' });

update(catalogHistoryQuery, {
  on: uploadCatalogMutation,
  by: { success: () => ({ result: { history: [] }, refetch: true }) },
});

sample({
  clock: [loadIntegrationPageFx.done, routes.integration.opened],
  fn: () => {
    return;
  },
  target: [catalogHistoryQuery.start, getApiTokenQuery.start],
});

sample({
  clock: pageChanged,
  fn: (page) => ({ page, params: { page, size: PAGE_SIZE } }),
  target: spread({
    targets: { page: $page, params: catalogHistoryQuery.start },
  }),
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
      return { noApiToken: true, apiToken };
    } else {
      return { apiToken, noApiToken: false };
    }
  },
  target: spread({
    targets: { apiToken: $apiToken, noApiToken: $noApiToken },
  }),
});

sample({
  clock: fileUploaded,
  filter: isFileListYml,
  fn: (fileList) => fileList?.[0] as File,
  target: uploadCatalogMutation.start,
});
sample({
  clock: fileUploaded,
  filter: (fileList) => !isFileListYml(fileList),
  fn: () => ({ message: 'Неверный формат файла' }),
  target: notifyError,
});
sample({ clock: fileUploaded, target: $fileInputValue.reinit! });

sample({
  clock: uploadCatalogMutation.finished.success,
  fn: () => {
    return;
  },
  target: getApiTokenQuery.start,
});

sample({
  clock: uploadCatalogMutation.finished.success,
  fn: () => ({ message: 'Каталог успешно загружен' }),
  target: notifySuccess,
});
sample({
  clock: uploadCatalogMutation.finished.failure,
  fn: () => ({ message: 'Произошла ошибка при загрузке каталога' }),
  target: notifyError,
});

sample({ clock: generateTokenClicked, target: generateApiTokenMutation.start });

sample({
  clock: generateApiTokenMutation.finished.success,
  fn: ({ result: apiToken }) => {
    return { apiToken, message: { message: 'Токен успешно сгенерирован' } };
  },
  target: spread({
    targets: { apiToken: $apiToken, message: notifySuccess },
  }),
});

sample({ clock: copyTokenClicked, target: copyTokenFx });

sample({
  clock: copyTokenFx.done,
  fn: () => ({ message: 'Токен успешно скопирован' }),
  target: notifySuccess,
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

function isFileListYml(fileList: FileList | null) {
  return fileList?.[0]?.name?.endsWith('.yml') === true;
}
