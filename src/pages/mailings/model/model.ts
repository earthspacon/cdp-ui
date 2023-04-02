import { cache } from '@farfetched/core';
import { combine, createEvent, createStore, merge, sample } from 'effector';
import { createForm } from 'effector-forms';
import { combineEvents, not, spread } from 'patronum';

import { createStripoPluginEditorModel } from '@/features/stripo-plugin';

import {
  createSendEmailToEmailMutation,
  createSendEmailToSegmentsMutation,
  SendEmailToEmailParams,
  SendEmailToSegmentParams,
} from '@/shared/api/mailings';
import {
  createCalcSegmentsDiffFx,
  createSegmentsListQuery,
  Segment,
} from '@/shared/api/segments';
import { routes } from '@/shared/config/routing';
import { emptyCallback } from '@/shared/lib/mappers';
import { notifyError, notifySuccess } from '@/shared/lib/notification';
import { createRule } from '@/shared/lib/validation-rules/create-rule';
import {
  checkIsStringValid,
  EmailSchema,
  requiredString,
  requiredText,
} from '@/shared/lib/validation-rules/rules';

import { loadMailingsPageFx } from './lazy-load';

const PAGE_SIZE = 20;

export const stripoPluginEditorModel = createStripoPluginEditorModel();

export const segmentsListQuery = createSegmentsListQuery();
const calcSegmentsDiffFx = createCalcSegmentsDiffFx();
export const sendEmailToEmailMutation = createSendEmailToEmailMutation();
export const sendEmailToSegmentsMutation = createSendEmailToSegmentsMutation();

export const mailingsForm = createForm({
  fields: {
    fromWhom: {
      init: '',
      rules: [createRule({ name: 'fromWhom', schema: EmailSchema })],
    },
    letterSubject: {
      init: '',
      rules: [createRule({ name: 'letterSubject', schema: requiredString() })],
    },
    emailBody: {
      init: '',
      rules: [
        {
          name: 'emailBody',
          source: stripoPluginEditorModel.$emailContentHtml,
          validator: (emailBody, _, htmlContent) => ({
            isValid: !checkIsStringValid(htmlContent)
              ? checkIsStringValid(emailBody)
              : true,
            errorText: requiredText,
          }),
        },
      ],
    },
    useUtmChecked: { init: false },
  },
  validateOn: ['submit', 'change', 'blur'],
});

export const testSendEmailForm = createForm({
  fields: {
    toWhomEmail: {
      init: '',
      rules: [createRule({ name: 'toWhomEmail', schema: EmailSchema })],
    },
  },
  validateOn: ['submit', 'change', 'blur'],
});

const $page = createStore(0);
export const $segments = createStore<Segment[]>([]);
export const $includedSegments = createStore<Segment[]>([]);
export const $excludedSegments = createStore<Segment[]>([]);
export const $usersCount = createStore<number | null>(null);
export const $usersCountStatus = createStore<'loading' | 'count' | 'button'>(
  'loading',
);
const $totalSegmentsCount = createStore(0);
export const $isEditorOpen = createStore(false);

export const $nonNullUsersCount = $usersCount.map((usersCount) =>
  usersCount === null ? 0 : usersCount,
);
export const $hasNextPage = combine(
  $segments,
  $totalSegmentsCount,
  (segments, total) => segments.length < total,
);

export const includedSegmentsSelected = createEvent<Segment[]>();
export const excludedSegmentsSelected = createEvent<Segment[]>();
export const calcDiffClicked = createEvent();
export const nextPageWillLoad = createEvent();
export const openEditorClicked = createEvent();
export const sendTestEmailClicked = createEvent();
export const sendEmailNowClicked = createEvent();

const pageOpened = merge([loadMailingsPageFx.done, routes.mailings.opened]);

const testSendEmailValidated = combineEvents({
  events: [
    sendTestEmailClicked,
    mailingsForm.formValidated,
    testSendEmailForm.formValidated,
  ],
});
const sendEmailNowValidated = combineEvents({
  events: [sendEmailNowClicked, mailingsForm.formValidated],
});

// Fetching initial data
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
    source: $usersCount,
    filter: (usersCount) => usersCount === null,
    fn: emptyCallback,
    target: calcSegmentsDiffFx,
  });

  sample({
    clock: segmentsListQuery.finished.success,
    source: $segments,
    fn: (prevSegments, { result: { array: segments, totalRecordsCount } }) => ({
      segments: [...prevSegments, ...segments],
      totalRecordsCount,
    }),
    target: spread({
      targets: { segments: $segments, totalRecordsCount: $totalSegmentsCount },
    }),
  });

  sample({
    clock: calcSegmentsDiffFx.doneData,
    fn: ({ customersCount }) => customersCount,
    target: $usersCount,
  });
}

// Loading next page
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

$includedSegments.on(includedSegmentsSelected, handleSegmentsSelect);
$excludedSegments.on(excludedSegmentsSelected, handleSegmentsSelect);

// Updating $usersCountStatus on segments changes and on calcSegmentsDiffFx.pending
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

// Calculating segments diff
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

// Opening editor and initializing it
{
  $isEditorOpen.on(openEditorClicked, () => true);

  sample({
    clock: openEditorClicked,
    filter: not(stripoPluginEditorModel.$isInitialized),
    target: stripoPluginEditorModel.initStripoPlugin,
  });

  $isEditorOpen.on(stripoPluginEditorModel.closeEditor, () => false);
  $isEditorOpen.on(stripoPluginEditorModel.contentSaved, () => false);
}

sample({
  clock: stripoPluginEditorModel.contentSaved,
  target: mailingsForm.fields.emailBody.validate,
});

// Sending test email
{
  sample({
    clock: sendTestEmailClicked,
    target: [mailingsForm.validate, testSendEmailForm.validate],
  });

  sample({
    clock: testSendEmailValidated,
    source: stripoPluginEditorModel.$emailContentHtml,

    fn(htmlContent, [, mailingData, { toWhomEmail }]): SendEmailToEmailParams {
      const emailBody =
        htmlContent.length > 0 ? htmlContent : mailingData.emailBody;
      return {
        toAddress: toWhomEmail,
        emailParams: {
          fromAddress: mailingData.fromWhom,
          subject: mailingData.letterSubject,
          body: emailBody,
        },
        conversionParams: {
          isUTMMarksEnabled: mailingData.useUtmChecked,
        },
      };
    },
    target: sendEmailToEmailMutation.start,
  });
}

// Sending email to segments
{
  sample({
    clock: sendEmailNowClicked,
    target: mailingsForm.validate,
  });

  sample({
    clock: sendEmailNowValidated,

    source: {
      htmlContent: stripoPluginEditorModel.$emailContentHtml,
      includedSegments: $includedSegments,
      excludedSegments: $excludedSegments,
    },

    fn(
      { htmlContent, includedSegments, excludedSegments },
      [, mailingData],
    ): SendEmailToSegmentParams {
      const emailBody =
        htmlContent.length > 0 ? htmlContent : mailingData.emailBody;
      return {
        segments: {
          includeSegmentIds: includedSegments.map(({ id }) => id),
          excludeSegmentIds: excludedSegments.map(({ id }) => id),
        },
        emailParams: {
          fromAddress: mailingData.fromWhom,
          subject: mailingData.letterSubject,
          body: emailBody,
        },
        conversionParams: {
          isUTMMarksEnabled: mailingData.useUtmChecked,
        },
      };
    },
    target: sendEmailToSegmentsMutation.start,
  });

  sample({
    clock: sendEmailNowValidated,
    target: [mailingsForm.resetErrors, testSendEmailForm.resetErrors],
  });
}

// Handling send email statuses
{
  sample({
    clock: sendEmailToEmailMutation.finished.success,
    fn: () => ({ message: 'Тестовое письмо успешно отправлено' }),
    target: notifySuccess,
  });

  sample({
    clock: sendEmailToSegmentsMutation.finished.success,
    fn: () => ({ message: 'Рассылка успешно запущена' }),
    target: notifySuccess,
  });

  sample({
    clock: sendEmailToEmailMutation.finished.failure,
    fn: () => ({ message: 'Ошибка при отправке тестового письма' }),
    target: notifyError,
  });

  sample({
    clock: sendEmailToSegmentsMutation.finished.failure,
    fn: () => ({ message: 'Ошибка при запуске рассылки' }),
    target: notifyError,
  });
}

sample({
  clock: routes.mailings.closed,
  target: stripoPluginEditorModel.resetContent,
});

function handleSegmentsSelect(prevSegments: Segment[], newSegments: Segment[]) {
  return newSegments.length > 2 ? prevSegments : newSegments;
}
