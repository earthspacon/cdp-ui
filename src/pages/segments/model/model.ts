import { cache } from '@farfetched/core';
import { redirect } from 'atomic-router';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { spread } from 'patronum';

import {
  createSegmentsCustomersCountQuery,
  createSegmentsListQuery,
} from '@/shared/api/segments';
import { routes } from '@/shared/config/routing';
import { InferStoreValues } from '@/shared/types/utility';

import { MappedSegment, mapSegments } from '../lib';
import { loadSegmentsPageFx } from './lazy-load';

export const PAGE_SIZE = 10;

const segmentsListQuery = createSegmentsListQuery();
const segmentsCustomersCountQuery = createSegmentsCustomersCountQuery();

type SegmentCustomer = { id: string; loading: boolean; customersCount: number };

const $page = createStore(0);
const $segmentsList = createStore<MappedSegment[]>([]);
const $segmentsTotalCount = createStore(0);
export const $segmentCustomers = createStore<SegmentCustomer[]>([]);

export const pageChanged = createEvent<number>();
export const createSegmentClicked = createEvent();

const startFetchingCustomersCountFx = createEffect((segmentIds: string[]) => {
  return segmentIds.map((id) => {
    segmentsCustomersCountQuery.start(id);

    return { id, loading: true, customersCount: 0 };
  });
});

// Fetching segments list and setting to store
{
  cache(segmentsListQuery, { staleAfter: '5min' });
  cache(segmentsCustomersCountQuery, { staleAfter: '5min' });

  sample({
    clock: [loadSegmentsPageFx.done, routes.segments.opened],
    source: $page,
    fn: (page) => ({ page, size: PAGE_SIZE }),
    target: segmentsListQuery.start,
  });

  sample({
    clock: pageChanged,
    fn: (page) => ({ page, params: { page, size: PAGE_SIZE } }),
    target: spread({
      targets: { page: $page, params: segmentsListQuery.start },
    }),
  });

  sample({
    clock: segmentsListQuery.finished.success,
    fn({ result: { array: segments, totalRecordsCount } }) {
      const mappedSegments = mapSegments(segments);
      const segmentIds = mappedSegments.map((segment) => segment.id);

      return {
        segments: mappedSegments,
        totalRecordsCount,
        segmentIds,
      };
    },
    target: spread({
      targets: {
        segments: $segmentsList,
        totalRecordsCount: $segmentsTotalCount,
        segmentIds: startFetchingCustomersCountFx,
      },
    }),
  });

  sample({
    clock: startFetchingCustomersCountFx.doneData,
    target: $segmentCustomers,
  });

  sample({
    clock: segmentsCustomersCountQuery.finished.success,
    source: $segmentCustomers,
    fn: (
      segmentCustomers,
      { result: { customersCount }, params: segmentId },
    ): SegmentCustomer[] => {
      return segmentCustomers.map((segmentCustomer) => {
        if (segmentCustomer.id === segmentId) {
          return { id: segmentId, loading: false, customersCount };
        }

        return segmentCustomer;
      });
    },
    target: $segmentCustomers,
  });
}

redirect({
  clock: createSegmentClicked,
  route: routes.createSegment,
});

export const segmentsContentStores = {
  page: $page,
  segmentsList: $segmentsList,
  segmentsTotalCount: $segmentsTotalCount,
  isSegmentsLoading: segmentsListQuery.$pending,
};

export type SegmentsContentStores = InferStoreValues<
  typeof segmentsContentStores
>;
