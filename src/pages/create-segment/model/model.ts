import dayjs from 'dayjs';
import { createStore, sample } from 'effector';
import { debug } from 'patronum';

import { createLoyaltyLevelsQuery } from '@/shared/api/segments';
import { routes } from '@/shared/config/routing';
import { toLabelValueArray, translitToLatin } from '@/shared/lib/mappers';
import { LabelValue } from '@/shared/types/utility';

import { segmentCreationForm } from './form';
import { loadCreateSegmentPageFx } from './lazy-load';

export const loyaltyLevelsQuery = createLoyaltyLevelsQuery();

export const $segmentCode =
  segmentCreationForm.fields.segmentName.$value.map(translitToLatin);
export const $loyaltyLevelOptions = createStore<LabelValue<string>[]>([]);

// Fetching loyalty levels
{
  sample({
    clock: [loadCreateSegmentPageFx.done, routes.createSegment.opened],
    fn() {
      return;
    },
    target: loyaltyLevelsQuery.start,
  });

  sample({
    clock: loyaltyLevelsQuery.finished.success,
    fn: ({ result: { statuses } }) => toLabelValueArray(statuses),
    target: $loyaltyLevelOptions,
  });
}

// Trigger validation on form values change
{
  // sample({
  //   clock: segmentCreationForm.$values.updates,
  //   target: segmentCreationForm.validate,
  // });

  sample({
    clock: [
      segmentCreationForm.fields.birthDateFrom.$value.updates,
      segmentCreationForm.fields.birthDateTo.$value.updates,
    ],
    target: [
      segmentCreationForm.fields.birthDateFrom.validate,
      segmentCreationForm.fields.birthDateTo.validate,
    ],
  });
}

sample({
  clock: segmentCreationForm.formValidated,
  filter: segmentCreationForm.$eachValid,
  fn(values) {
    console.log({ values });
  },
});
