import { cache } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { v4 as uuid } from 'uuid';

import { routes } from '@/shared/config/routing';

import {
  ApiStatusMappings,
  saveStatusMappingsMutation,
  statusMappingsQuery,
} from '../api';
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
    const newStatusMapping: StatusMappings = {
      id: uuid(),
      externalStatus: '',
      cdpStatus: 'NO_STATUS',
      cdpStatusLabel: orderStatues.NO_STATUS,
    };

    return [...prevStatuses, newStatusMapping];
  });
}

// Saving status mappings
// {
//   sample({
//     clock: saveStatusMappingsClicked,
//     source: $statusMappings,
//     fn(statusMappings) {

//     },
//     target: saveStatusMappingsMutation.start,
//   });
// }

export const orderStatues = {
  NO_STATUS: 'Не задано',
  NEW: 'Новый',
  IN_PROGRESS: 'В работе',
  DELIVERY: 'Передан в службу доставки',
  DELIVERED: 'Доставлен',
  CANCEL: 'Отменен',
};
export type OrderStatus = keyof typeof orderStatues;

export const orderStatusLabels = Object.fromEntries(
  Object.entries(orderStatues).map(([key, value]) => [value, key]),
) as Record<string, OrderStatus>;
