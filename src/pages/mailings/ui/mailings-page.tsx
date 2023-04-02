import { reflect, variant } from '@effector/reflect';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@stitches/react';
import { useField } from 'effector-forms';
import { useUnit } from 'effector-react';

import { StripoEditor } from '@/features/stripo-plugin';

import { ChildrenProp } from '@/shared/types/utility';
import { FormInput } from '@/shared/ui/form-control/form-input';
import { LoadingButton } from '@/shared/ui/loading-button';
import { VirtualizedInfiniteLoadAutocomplete } from '@/shared/ui/virtualized-infinite-load-autocomplete';

import {
  $excludedSegments,
  $hasNextPage,
  $includedSegments,
  $isEditorOpen,
  $nonNullUsersCount,
  $segments,
  $usersCountStatus,
  calcDiffClicked,
  excludedSegmentsSelected,
  includedSegmentsSelected,
  mailingsForm,
  nextPageWillLoad,
  openEditorClicked,
  segmentsListQuery,
  sendEmailNowClicked,
  sendEmailToEmailMutation,
  sendEmailToSegmentsMutation,
  sendTestEmailClicked,
  stripoPluginEditorModel,
  testSendEmailForm,
} from '../model/model';

// eslint-disable-next-line import/no-default-export
export default function MailingListsPage() {
  return (
    <Stack spacing={4}>
      <WhomToSendBlock />

      <LabelBlock title="Параметры email">
        <Stack spacing={3}>
          <FormInput
            field={mailingsForm.fields.fromWhom}
            textFieldProps={{
              label: 'От кого',
              type: 'email',
              sx: { width: '400px' },
            }}
          />
          <FormInput
            field={mailingsForm.fields.letterSubject}
            textFieldProps={{
              label: 'Тема письма',
              multiline: true,
              maxRows: 4,
              sx: { width: '400px' },
            }}
          />

          <EmailBody />

          <Box sx={{ width: 'fit-content' }}>
            <Button variant="outlined" onClick={() => openEditorClicked()}>
              Открыть редактор
            </Button>
          </Box>

          <EmailContent />
        </Stack>

        <EditorDialog />
      </LabelBlock>

      <ConversionBlock />

      <LabelBlock title="Тестирование рассылки">
        <Stack direction="row" spacing={3} alignItems="baseline">
          <FormInput
            field={testSendEmailForm.fields.toWhomEmail}
            textFieldProps={{
              label: 'Кому',
              type: 'email',
              size: 'small',
              sx: { width: '400px' },
            }}
          />
          <SendTestEmailButton />
        </Stack>
      </LabelBlock>

      <SendEmailNowButton />
    </Stack>
  );
}

function WhomToSendBlock() {
  const {
    options,
    includedSegments,
    excludedSegments,
    hasNextPage,
    isNextPageLoading,
  } = useUnit({
    options: $segments,
    includedSegments: $includedSegments,
    excludedSegments: $excludedSegments,
    hasNextPage: $hasNextPage,
    isNextPageLoading: segmentsListQuery.$pending,
  });

  return (
    <LabelBlock title="Кому отправить">
      <Stack spacing={2} width="400px">
        <VirtualizedInfiniteLoadAutocomplete
          multiple
          disableCloseOnSelect
          freeSolo={false}
          inputLabel="Включить сегменты"
          options={options}
          loading={isNextPageLoading}
          value={includedSegments}
          onChange={(_, values) => includedSegmentsSelected(values)}
          getOptionLabel={(option) => option.name}
          optionElemType="checkbox"
          itemsLength={options.length}
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          loadNextPage={() => nextPageWillLoad()}
        />
        <VirtualizedInfiniteLoadAutocomplete
          multiple
          disableCloseOnSelect
          freeSolo={false}
          inputLabel="Исключить сегменты"
          options={options}
          loading={isNextPageLoading}
          value={excludedSegments}
          onChange={(_, values) => excludedSegmentsSelected(values)}
          getOptionLabel={(option) => option.name}
          optionElemType="checkbox"
          itemsLength={options.length}
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          loadNextPage={() => nextPageWillLoad()}
        />
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <Typography>Всего пользователей в рассылке:</Typography>
        <UsersCount />
      </Stack>
    </LabelBlock>
  );
}

const UsersCount = variant({
  source: $usersCountStatus,
  cases: {
    loading: () => <CircularProgress size={20} />,
    count: reflect({
      view: ({ count }: { count: number }) => <Typography>{count}</Typography>,
      bind: { count: $nonNullUsersCount },
    }),
    button: () => (
      <Button size="small" variant="outlined" onClick={() => calcDiffClicked()}>
        Посчитать
      </Button>
    ),
  },
});

const EditorDialog = reflect({
  view: ({ isOpened }: { isOpened: boolean }) => (
    <Dialog
      open={isOpened}
      fullScreen
      keepMounted // keepMounted so that the editor is not reset when the dialog is closed
    >
      <StripoEditor model={stripoPluginEditorModel} />
    </Dialog>
  ),
  bind: { isOpened: $isEditorOpen },
});

const EmailBody = reflect({
  view: ({ htmlContent }: { htmlContent: string }) =>
    htmlContent.length === 0 ? (
      <FormInput
        field={mailingsForm.fields.emailBody}
        textFieldProps={{
          label: 'Тело письма',
          multiline: true,
          maxRows: 30,
          sx: { width: '800px' },
        }}
      />
    ) : null,
  bind: { htmlContent: stripoPluginEditorModel.$emailContentHtml },
});

const EmailContent = reflect({
  view: ({ html }: { html: string }) => (
    <Stack spacing={2}>
      {html.length > 0 && (
        <>
          <Typography variant="body1">Тело письма</Typography>
          <EmailContentWrapper
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          />
        </>
      )}
    </Stack>
  ),
  bind: { html: stripoPluginEditorModel.$emailContentHtml },
});

function ConversionBlock() {
  const utmField = useField(mailingsForm.fields.useUtmChecked);

  return (
    <LabelBlock title="Конверсия">
      <FormControlLabel
        control={
          <Checkbox
            value={utmField.value}
            onChange={(evt) => utmField.onChange(evt.target.checked)}
          />
        }
        label="Использовать UTM метки"
      />
    </LabelBlock>
  );
}

const SendTestEmailButton = reflect({
  view: ({ isLoading }: { isLoading: boolean }) => (
    <Box>
      <LoadingButton
        size="small"
        variant="outlined"
        loading={isLoading}
        onClick={() => sendTestEmailClicked()}
      >
        Отправить тестовое письмо
      </LoadingButton>
    </Box>
  ),
  bind: { isLoading: sendEmailToEmailMutation.$pending },
});

const SendEmailNowButton = reflect({
  view: ({ isLoading }: { isLoading: boolean }) => (
    <Box sx={{ paddingY: '30px' }}>
      <LoadingButton
        size="large"
        variant="contained"
        loading={isLoading}
        onClick={() => sendEmailNowClicked()}
      >
        Отправить сейчас
      </LoadingButton>
    </Box>
  ),
  bind: { isLoading: sendEmailToSegmentsMutation.$pending },
});

function LabelBlock({ title, children }: { title: string } & ChildrenProp) {
  return (
    <Stack spacing={2}>
      <Typography fontWeight={500} variant="h6">
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

const EmailContentWrapper = styled('div', {
  height: '100%',
  maxHeight: '700px',
  overflow: 'auto',
});
