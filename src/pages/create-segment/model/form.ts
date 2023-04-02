import { createForm } from 'effector-forms';

import {
  GenderMAppingValue,
  HasValueMappingValue,
  LoyaltyProgramStatus,
} from '@/shared/api/segments';
import { OrderStatus } from '@/shared/api/status-mappings';
import { createRule } from '@/shared/lib/validation-rules/create-rule';
import { requiredString } from '@/shared/lib/validation-rules/rules';
import { FormDate } from '@/shared/types/utility';

import { getRuleToValidateByField } from '../lib/validation';

export const segmentCreationForm = createForm({
  fields: {
    segmentName: {
      init: '',
      rules: [
        createRule({
          name: 'segmentName',
          schema: requiredString(),
        }),
      ],
    },
    email: {
      init: '' as HasValueMappingValue | '',
    },
    gender: {
      init: '' as GenderMAppingValue | '',
    },
    phoneNumber: {
      init: '' as HasValueMappingValue | '',
    },
    birthDateFrom: {
      init: null as FormDate,
      rules(_, form) {
        return getRuleToValidateByField({
          field: form.birthDateTo,
          name: 'birthDateFrom',
          type: 'date',
        });
      },
    },
    birthDateTo: {
      init: null as FormDate,
      rules(_, form) {
        return getRuleToValidateByField({
          field: form.birthDateFrom,
          name: 'birthDateTo',
          type: 'date',
        });
      },
    },

    ordersNumberFrom: {
      init: '',
      rules(_, form) {
        return getRuleToValidateByField({
          field: form.ordersNumberTo,
          name: 'ordersNumberFrom',
          type: 'string',
        });
      },
    },
    ordersNumberTo: {
      init: '',
      rules(_, form) {
        return getRuleToValidateByField({
          field: form.ordersNumberFrom,
          name: 'ordersNumberTo',
          type: 'string',
        });
      },
    },
    ordersTotalFrom: {
      init: '',
      rules(_, form) {
        return getRuleToValidateByField({
          field: form.ordersTotalTo,
          name: 'ordersTotalFrom',
          type: 'string',
        });
      },
    },
    ordersTotalTo: {
      init: '',
      rules(_, form) {
        return getRuleToValidateByField({
          field: form.ordersTotalFrom,
          name: 'ordersTotalTo',
          type: 'string',
        });
      },
    },
    ordersStatus: {
      init: '' as OrderStatus | '',
    },
    purchaseDateRangeFrom: {
      init: null as FormDate,
      rules(_, form) {
        return getRuleToValidateByField({
          field: form.purchaseDateRangeTo,
          name: 'purchaseDateRangeFrom',
          type: 'date',
        });
      },
    },
    purchaseDateRangeTo: {
      init: null as FormDate,
      rules(_, form) {
        return getRuleToValidateByField({
          field: form.purchaseDateRangeFrom,
          name: 'purchaseDateRangeTo',
          type: 'date',
        });
      },
    },

    loyaltyProgramLevel: {
      init: '',
    },
    loyaltyProgramStatus: {
      init: '' as LoyaltyProgramStatus | '',
    },
    bonusesBalanceFrom: {
      init: '',
      rules(_, form) {
        return getRuleToValidateByField({
          field: form.bonusesBalanceTo,
          name: 'bonusesBalanceFrom',
          type: 'string',
        });
      },
    },
    bonusesBalanceTo: {
      init: '',
      rules(_, form) {
        return getRuleToValidateByField({
          field: form.bonusesBalanceFrom,
          name: 'purchaseDateRangeTo',
          type: 'string',
        });
      },
    },
  },
  validateOn: ['submit', 'blur', 'change'],
});

export const formFields = segmentCreationForm.fields;
