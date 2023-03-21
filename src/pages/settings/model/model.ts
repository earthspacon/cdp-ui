import { cache, update } from '@farfetched/core';
import { createEvent, createStore, sample, split } from 'effector';
import { v4 as uuid } from 'uuid';

import {
  ApiStatusMappings,
  createSaveStatusMappingsMutation,
  createStatusMappingsQuery,
  orderStatues,
  OrderStatus,
} from '@/shared/api/status-mappings';
import { routes } from '@/shared/config/routing';
import { notifyError } from '@/shared/lib/notification';

import { loadSettingsPageFx } from './lazy-load';

export type StatusMappings = Omit<
  ApiStatusMappings['mappings'][0],
  'cdpStatus'
> & {
  id: string;
  cdpStatus: OrderStatus;
  cdpStatusLabel: string;
};

export const $statusMappings = createStore<StatusMappings[]>([]);

export const cdpStatusChanged = createEvent<{
  id: string;
  status: OrderStatus;
  externalStatus: string;
}>();
export const externalStatusChanged = createEvent<{
  id: string;
  externalStatus: string;
}>();
export const deleteRowClicked = createEvent<{ id: string }>();
export const addRowClicked = createEvent();
export const saveStatusMappingsClicked = createEvent();

export const statusMappingsQuery = createStatusMappingsQuery();

export const saveStatusMappingsMutation = createSaveStatusMappingsMutation();

// Fetching statuses and setting them to the store
{
  cache(statusMappingsQuery, { staleAfter: '5min' });

  sample({
    clock: [loadSettingsPageFx.done, routes.settings.opened],
    fn() {
      return;
    },
    target: statusMappingsQuery.start,
  });

  $statusMappings.on(
    statusMappingsQuery.finished.success,
    (prevStatusMappings, { result: mappings }) => {
      if (prevStatusMappings.length > 0) {
        return prevStatusMappings;
      } else {
        return mappings.mappings.map((mapping) => ({
          ...mapping,
          id: uuid(),
          cdpStatusLabel: orderStatues[mapping.cdpStatus],
        }));
      }
    },
  );
}

// Updating $statusMappings on crud operations
{
  $statusMappings.on(cdpStatusChanged, (prevStatuses, { id, status }) => {
    return prevStatuses.map((mapping) =>
      mapping.id === id
        ? {
            ...mapping,
            cdpStatus: status,
            cdpStatusLabel: orderStatues[status],
          }
        : mapping,
    );
  });

  $statusMappings.on(
    externalStatusChanged,
    (prevStatuses, { id, externalStatus }) => {
      return prevStatuses.map((mapping) =>
        mapping.id === id ? { ...mapping, externalStatus } : mapping,
      );
    },
  );

  $statusMappings.on(deleteRowClicked, (prevStatuses, { id }) => {
    return prevStatuses.filter((mapping) => mapping.id !== id);
  });

  $statusMappings.on(addRowClicked, (prevStatuses) => {
    const newStatusMapping = {
      id: uuid(),
      externalStatus: '',
      cdpStatus: 'NO_STATUS' as const,
      cdpStatusLabel: orderStatues.NO_STATUS,
    };

    return [...prevStatuses, newStatusMapping];
  });
}

// Saving status mappings
{
  const prependedSaveStatuses = saveStatusMappingsMutation.start.prepend(
    (statusMappings: StatusMappings[]) => {
      const filteredStatusMappings = statusMappings
        .filter((mapping) => {
          const externalStatusValid = isExternalStatusValid(
            mapping.externalStatus,
          );
          const cdpStatusValid = isCdpStatusValid(mapping.cdpStatus);

          return externalStatusValid && cdpStatusValid;
        })
        .map((mapping) => ({
          externalStatus: mapping.externalStatus,
          cdpStatus: mapping.cdpStatus,
        }));

      return { mappings: filteredStatusMappings } as ApiStatusMappings;
    },
  );

  const notifyNoCdpStatus = notifyError.prepend(() => ({
    message: noCdpStatusErrorMessage,
  }));
  const notifyNoExternalStatus = notifyError.prepend(() => ({
    message: noExternalStatusErrorMessage,
  }));

  split({
    clock: saveStatusMappingsClicked,
    source: $statusMappings,
    match: {
      noExternalStatus: (statusMappings) => {
        return statusMappings.some(isExternalStatusNotValid);
      },
      noCdpStatus: (statusMappings) => {
        return statusMappings.some(isCdpStatusNotValid);
      },
    },
    cases: {
      noExternalStatus: notifyNoExternalStatus,
      noCdpStatus: notifyNoCdpStatus,
      __: prependedSaveStatuses,
    },
  });

  $statusMappings.reset(saveStatusMappingsMutation.finished.success);

  update(statusMappingsQuery, {
    on: saveStatusMappingsMutation,
    by: { success: () => ({ result: { mappings: [] }, refetch: true }) },
  });
}

function isExternalStatusValid(externalStatus: string) {
  return externalStatus.trim().length > 0;
}
function isCdpStatusValid(cdpStatus: OrderStatus) {
  return cdpStatus !== 'NO_STATUS';
}

function isExternalStatusNotValid(mapping: StatusMappings) {
  const externalStatusValid = isExternalStatusValid(mapping.externalStatus);
  const cdpStatusValid = isCdpStatusValid(mapping.cdpStatus);

  if (!externalStatusValid && !cdpStatusValid) {
    return false;
  }

  if (!externalStatusValid) return true;

  return false;
}
function isCdpStatusNotValid(mapping: StatusMappings) {
  const externalStatusValid = isExternalStatusValid(mapping.externalStatus);
  const cdpStatusValid = isCdpStatusValid(mapping.cdpStatus);

  if (!externalStatusValid && !cdpStatusValid) {
    return false;
  }

  if (!cdpStatusValid) return true;

  return false;
}

const noCdpStatusErrorMessage =
  'Для каждого статуса в магазине должен быть задан статус в CDP';
const noExternalStatusErrorMessage =
  'Статус в магазине не может быть пустой строкой или содержать одни пробелы';
