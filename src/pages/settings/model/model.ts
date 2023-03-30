import { cache, update } from '@farfetched/core';
import { createEvent, createStore, sample, split } from 'effector';
import { v4 as uuid } from 'uuid';

import {
  ApiStatusMappings,
  createSaveStatusMappingsMutation,
  createStatusMappingsQuery,
  OrderStatus,
  orderStatuses,
} from '@/shared/api/status-mappings';
import { routes } from '@/shared/config/routing';
import { emptyCallback } from '@/shared/lib/mappers';
import { notifyError, notifySuccess } from '@/shared/lib/notification';

import {
  isCdpStatusNotValid,
  isCdpStatusValid,
  isExternalStatusNotValid,
  isExternalStatusValid,
  noCdpStatusErrorMessage,
  noExternalStatusErrorMessage,
  StatusMappings,
} from '../lib';
import { loadSettingsPageFx } from './lazy-load';

export const statusMappingsQuery = createStatusMappingsQuery();

export const saveStatusMappingsMutation = createSaveStatusMappingsMutation();

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

// Fetching statuses and setting them to the store
{
  cache(statusMappingsQuery, { staleAfter: '5min' });

  sample({
    clock: [loadSettingsPageFx.done, routes.settings.opened],
    fn: emptyCallback,
    target: statusMappingsQuery.start,
  });

  $statusMappings.on(
    statusMappingsQuery.finished.success,
    (prevStatusMappings, { result: { mappings } }) => {
      if (prevStatusMappings.length > 0) {
        return prevStatusMappings;
      } else {
        return mappings.map((mapping) => ({
          ...mapping,
          id: uuid(),
          cdpStatusLabel: orderStatuses[mapping.cdpStatus],
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
            cdpStatusLabel: orderStatuses[status],
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
      cdpStatusLabel: orderStatuses.NO_STATUS,
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

sample({
  clock: saveStatusMappingsMutation.finished.success,
  fn: () => ({ message: 'Статусы успешно сохранены' }),
  target: notifySuccess,
});
