import { cache, update } from '@farfetched/core';
import { attach, createEvent, createStore, sample } from 'effector';
import { spread } from 'patronum';

import { routes } from '@/shared/config/routing';
import { emptyCallback } from '@/shared/lib/mappers';
import { notifyError, notifySuccess } from '@/shared/lib/notification';

import {
  ApiCatalogHistory,
  catalogHistoryQuery,
  generateApiTokenMutation,
  getApiTokenQuery,
  uploadCatalogMutation,
} from '../api';
import { loadIntegrationPageFx } from './lazy-load';

export const PAGE_SIZE = 10;

const historyStatuses = {
  IN_PROGRESS: 'В процессе',
  SUCCESS: 'Успешно',
  FAILED: 'Произошла ошибка',
};

export type CatalogHistory = ApiCatalogHistory['history'][0] & {
  statusLabel: string;
};

export const $catalogHistory = createStore<CatalogHistory[]>([]);
export const $catalogHistoryTotalCount = createStore(0);
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
    return navigator.clipboard.writeText(apiToken);
  },
});

// Fetching catalog history and api token
{
  cache(catalogHistoryQuery, { staleAfter: '5min' });

  sample({
    clock: [loadIntegrationPageFx.done, routes.integration.opened],
    fn: emptyCallback,
    target: [catalogHistoryQuery.start, getApiTokenQuery.start],
  });

  sample({
    clock: pageChanged,
    fn: (page) => ({ page, params: { page, size: PAGE_SIZE } }),
    target: spread({
      targets: { page: $page, params: catalogHistoryQuery.start },
    }),
  });
}

// Updating stores with fetched data
{
  sample({
    clock: catalogHistoryQuery.finished.success,
    fn: ({ result: catalog }) => {
      const catalogHistory = catalog.history.map((history) => ({
        ...history,
        statusLabel: historyStatuses[history.status],
      }));
      const catalogHistoryTotalCount = catalog.totalRecordsCount;

      return { catalogHistory, catalogHistoryTotalCount };
    },
    target: spread({
      targets: {
        catalogHistory: $catalogHistory,
        catalogHistoryTotalCount: $catalogHistoryTotalCount,
      },
    }),
  });

  sample({
    clock: catalogHistoryQuery.finished.failure,
    fn: ({ error }) => {
      console.log('Failed to load the upload history: ', error);
    },
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
}

// Handling file upload
{
  sample({
    clock: fileUploaded,
    filter: isSupportedFileType,
    fn: (fileList) => fileList?.[0] as File,
    target: uploadCatalogMutation.start,
  });
  sample({
    clock: fileUploaded,
    filter: (fileList) => !isSupportedFileType(fileList),
    fn: () => ({ message: 'Неверный формат файла' }),
    target: notifyError,
  });
  sample({ clock: fileUploaded, target: $fileInputValue.reinit! });
}

// Handling catalog upload
{
  sample({
    clock: uploadCatalogMutation.finished.success,
    fn: emptyCallback,
    target: catalogHistoryQuery.start,
  });

  sample({
    clock: uploadCatalogMutation.finished.success,
    fn: () => ({ message: 'Загруженный файл находится в процессе обработки' }),
    target: notifySuccess,
  });
  sample({
    clock: uploadCatalogMutation.finished.failure,
    fn: () => ({ message: 'Произошла ошибка при загрузке каталога' }),
    target: notifyError,
  });
}

// Handling token generation
{
  sample({
    clock: generateTokenClicked,
    target: generateApiTokenMutation.start,
  });

  sample({
    clock: generateApiTokenMutation.finished.success,
    fn: ({ result: apiToken }) => ({
      apiToken,
      notifyParams: { message: 'Токен успешно сгенерирован' },
    }),
    target: spread({
      targets: { apiToken: $apiToken, notifyParams: notifySuccess },
    }),
  });
}

// Handling token copy
{
  sample({ clock: copyTokenClicked, target: copyTokenFx });

  sample({
    clock: copyTokenFx.done,
    fn: () => ({ message: 'Токен успешно скопирован' }),
    target: notifySuccess,
  });
}

function isSupportedFileType(fileList: FileList | null) {
  return fileList?.[0]?.name?.endsWith('.xml') === true;
}
