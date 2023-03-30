import { Stack, Typography } from '@mui/material';
import { useUnit } from 'effector-react';

import { ChildrenProp } from '@/shared/types/utility';
import { VirtualizedInfiniteLoadAutocomplete } from '@/shared/ui/virtualized-infinite-load-autocomplete';

import {
  $excludedSegments,
  $hasNextPage,
  $includedSegments,
  $segments,
  $usersCountStatus,
  excludedSegmentsSelected,
  includedSegmentsSelected,
  nextPageWillLoad,
  segmentsListQuery,
} from '../model/model';

// eslint-disable-next-line import/no-default-export
export default function MailingListsPage() {
  return (
    <Stack spacing={3}>
      <WhomToSendBlock />
    </Stack>
  );
}

function WhomToSendBlock() {
  const {
    options,
    includedSegments,
    excludedSegments,
    usersCountStatus,
    hasNextPage,
    isNextPageLoading,
  } = useUnit({
    options: $segments,
    includedSegments: $includedSegments,
    excludedSegments: $excludedSegments,
    usersCountStatus: $usersCountStatus,
    hasNextPage: $hasNextPage,
    isNextPageLoading: segmentsListQuery.$pending,
  });

  return (
    <LabelBlock title="Кому отправить">
      <Stack spacing={1}>
        <VirtualizedInfiniteLoadAutocomplete
          multiple
          disableCloseOnSelect
          freeSolo={false}
          options={options}
          loading={isNextPageLoading}
          value={includedSegments}
          onChange={(_, values) => includedSegmentsSelected(values)}
          getOptionLabel={(option) => option.name}
          optionElemType="checkbox"
          itemsLength={options.length}
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          loadNextPage={() => new Promise((res) => res(nextPageWillLoad()))}
        />
        <VirtualizedInfiniteLoadAutocomplete
          multiple
          disableCloseOnSelect
          freeSolo={false}
          options={options}
          loading={isNextPageLoading}
          value={excludedSegments}
          onChange={(_, values) => excludedSegmentsSelected(values)}
          getOptionLabel={(option) => option.name}
          optionElemType="checkbox"
          itemsLength={options.length}
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          loadNextPage={nextPageWillLoad}
        />
      </Stack>
    </LabelBlock>
  );
}

function LabelBlock({ title, children }: { title: string } & ChildrenProp) {
  return (
    <Stack spacing={3}>
      <Typography fontWeight={500} variant="h4">
        {title}
      </Typography>
      {children}
    </Stack>
  );
}
