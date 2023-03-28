import { createEvent, createStore, sample } from 'effector';
import { Field } from 'effector-forms';

import {
  createLoyaltyLevelsQuery,
  CreateSegmentBody,
  createSegmentCreationMutation,
} from '@/shared/api/segments';
import { routes } from '@/shared/config/routing';
import {
  filterNullValues,
  toLabelValueArray,
  translitToLatin,
} from '@/shared/lib/mappers';
import { notifyError, notifySuccess } from '@/shared/lib/notification';
import { LabelValue } from '@/shared/types/utility';

import {
  getGenderValue,
  getLoyaltyStatusValue,
  getOrderStatusValue,
  toDateRange,
  toIsEmptyObject,
  toValuesRange,
} from '../lib/mappers';
import { checkIsStringValid } from '../lib/validation';
import { formFields, segmentCreationForm } from './form';
import { loadCreateSegmentPageFx } from './lazy-load';

export const loyaltyLevelsQuery = createLoyaltyLevelsQuery();
export const createSegmentMutation = createSegmentCreationMutation();

export const $segmentCode =
  segmentCreationForm.fields.segmentName.$value.map(translitToLatin);
export const $loyaltyLevelOptions = createStore<LabelValue<string>[]>([]);

export const cancelClicked = createEvent();

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
  const fieldsToValidateAndCompare = [
    {
      firstField: formFields.birthDateFrom,
      secondField: formFields.birthDateTo,
    },
    {
      firstField: formFields.ordersNumberFrom,
      secondField: formFields.ordersNumberTo,
    },
    {
      firstField: formFields.ordersTotalFrom,
      secondField: formFields.ordersTotalTo,
    },
    {
      firstField: formFields.purchaseDateRangeFrom,
      secondField: formFields.purchaseDateRangeTo,
    },
    {
      firstField: formFields.bonusesBalanceFrom,
      secondField: formFields.bonusesBalanceTo,
    },
  ];

  fieldsToValidateAndCompare.forEach((fields) => {
    validateOnFieldUpdates(fields as FieldsToValidate);
  });
}

// Post segment
{
  sample({
    clock: segmentCreationForm.formValidated,
    source: $segmentCode,
    fn(segmentCode, values): CreateSegmentBody {
      const genderValue = values.gender;
      const loyaltyLevel = values.loyaltyProgramLevel;

      const customer = {
        email: toIsEmptyObject(values.email),
        gender: getGenderValue(genderValue),
        phoneNumber: toIsEmptyObject(values.phoneNumber),
        birthDate: toDateRange(values.birthDateFrom, values.birthDateTo),
      };

      const order = {
        date: toDateRange(
          values.purchaseDateRangeFrom,
          values.purchaseDateRangeTo,
        ),
        status: getOrderStatusValue(values.ordersStatus),
        ordersCount: toValuesRange(
          values.ordersNumberFrom,
          values.ordersNumberTo,
        ),
        ordersPriceSum: toValuesRange(
          values.ordersTotalFrom,
          values.ordersTotalTo,
        ),
      };

      const loyalty = {
        level: checkIsStringValid(loyaltyLevel) ? loyaltyLevel : null,
        status: getLoyaltyStatusValue(values.loyaltyProgramStatus),
        amountOfBonuses: toValuesRange(
          values.bonusesBalanceFrom,
          values.bonusesBalanceTo,
        ),
      };

      const filters = {
        customer: filterNullValues(customer),
        order: filterNullValues(order),
        loyalty: filterNullValues(loyalty),
      };

      return {
        name: values.segmentName,
        code: segmentCode,
        filters,
      };
    },
    target: createSegmentMutation.start,
  });
}

sample({
  clock: createSegmentMutation.finished.success,
  fn: () => ({ message: 'Сегмент успешно создан' }),
  target: notifySuccess,
});

// Redirect to segments page and reset form on cancel, success and route closed
{
  sample({
    clock: [
      createSegmentMutation.finished.success,
      cancelClicked,
      routes.createSegment.closed,
    ],
    target: [routes.segments.open, segmentCreationForm.reset],
  });
}

sample({
  clock: createSegmentMutation.finished.failure,
  fn: () => ({ message: 'Не удалось создать сегмент' }),
  target: notifyError,
});

type FieldsToValidate = {
  firstField: Field<unknown>;
  secondField: Field<unknown>;
};
function validateOnFieldUpdates({ firstField, secondField }: FieldsToValidate) {
  sample({
    clock: secondField.$value.updates,
    target: firstField.validate,
  });

  sample({
    clock: firstField.$value.updates,
    target: secondField.validate,
  });
}
