import { cache } from '@farfetched/core';
import { combine, createEvent, createStore, merge, sample } from 'effector';
import { spread } from 'patronum';

import {
  createCalcSegmentsDiffFx,
  createSegmentsListQuery,
  Segment,
} from '@/shared/api/segments';
import { routes } from '@/shared/config/routing';
import { emptyCallback } from '@/shared/lib/mappers';

import { loadMailingPageFx } from './lazy-load';

const PAGE_SIZE = 20;

export const segmentsListQuery = createSegmentsListQuery();
const calcSegmentsDiffFx = createCalcSegmentsDiffFx();

const $page = createStore(0);
export const $segments = createStore<Segment[]>([]);
export const $includedSegments = createStore<Segment[]>([]);
export const $excludedSegments = createStore<Segment[]>([]);
export const $usersCountStatus = createStore<'loading' | 'count' | 'button'>(
  'loading',
);
const $totalSegmentsCount = createStore(0);

export const $hasNextPage = combine(
  $segments,
  $totalSegmentsCount,
  (segments, total) => segments.length < total,
);

export const includedSegmentsSelected = createEvent<Segment[]>();
export const excludedSegmentsSelected = createEvent<Segment[]>();
export const calcDiffClicked = createEvent();
export const nextPageWillLoad = createEvent();

const pageOpened = merge([loadMailingPageFx.done, routes.mailingLists.opened]);

{
  cache(segmentsListQuery, { staleAfter: '5min' });

  sample({
    clock: pageOpened,
    source: $page,
    fn: (page) => ({ page, size: PAGE_SIZE }),
    target: segmentsListQuery.start,
  });

  sample({
    clock: pageOpened,
    source: [$includedSegments, $excludedSegments],
    filter([includedSegments, excludedSegments]) {
      return includedSegments.length === 0 || excludedSegments.length === 0;
    },
    fn: emptyCallback,
    target: calcSegmentsDiffFx,
  });

  sample({
    clock: segmentsListQuery.finished.success,
    fn: ({ result: { array: segments, totalRecordsCount } }) => ({
      segments,
      totalRecordsCount,
    }),
    target: spread({
      targets: { segments: $segments, totalRecordsCount: $totalSegmentsCount },
    }),
  });
}

{
  sample({
    clock: nextPageWillLoad,
    source: $page,
    fn: (page) => ({
      newPage: page + 1,
      params: { page: page + 1, size: PAGE_SIZE },
    }),
    target: spread({
      targets: { page: $page, params: segmentsListQuery.start },
    }),
  });
}

{
  sample({
    source: calcSegmentsDiffFx.pending,
    fn: (pending) => (pending ? 'loading' : 'count'),
    target: $usersCountStatus,
  });

  sample({
    clock: [$includedSegments.updates, $excludedSegments.updates],
    fn: () => 'button' as const,
    target: $usersCountStatus,
  });
}

{
  sample({
    clock: calcDiffClicked,
    source: {
      includedSegments: $includedSegments,
      excludedSegments: $excludedSegments,
    },
    fn({ includedSegments, excludedSegments }) {
      return {
        includeSegmentIds: includedSegments.map(({ id }) => id),
        excludeSegmentIds: excludedSegments.map(({ id }) => id),
      };
    },
    target: calcSegmentsDiffFx,
  });
}

$includedSegments.on(includedSegmentsSelected, (_, newSegments) => newSegments);
$excludedSegments.on(excludedSegmentsSelected, (_, newSegments) => newSegments);
