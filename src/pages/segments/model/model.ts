import { cache } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { spread } from 'patronum';

import { routes } from '@/shared/config/routing';
import { InferStoreValues } from '@/shared/types/utility';

import { segmentsListQuery } from '../api';
import { MappedSegment, mapSegments } from '../lib';
import { loadSegmentsPageFx } from './lazy-load';

export const PAGE_SIZE = 10;

const $page = createStore(0);
const $segmentsList = createStore<MappedSegment[]>([]);
const $segmentsTotalCount = createStore(0);

export const pageChanged = createEvent<number>();

// Fetching segments list and setting to store
{
  cache(segmentsListQuery, { staleAfter: '5min' });

  sample({
    clock: [loadSegmentsPageFx.done, routes.segments.opened],
    fn: () => {
      return;
    },
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
    fn({ result: { segments, totalRecordsCount } }) {
      const mappedSegments = mapSegments(segments);
      return { segments: mappedSegments, totalRecordsCount };
    },
    target: spread({
      targets: {
        segments: $segmentsList,
        totalRecordsCount: $segmentsTotalCount,
      },
    }),
  });
}

export const segmentsContentStores = {
  page: $page,
  segmentsList: $segmentsList,
  segmentsTotalCount: $segmentsTotalCount,
  isSegmentsLoading: segmentsListQuery.$pending,
};

export type SegmentsContentStores = InferStoreValues<
  typeof segmentsContentStores
>;
