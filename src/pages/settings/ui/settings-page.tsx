import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { styled } from '@stitches/react';
import { useUnit } from 'effector-react';

import { HeightWrapper } from '@/shared/ui/height-wrapper';
import { LoadingButton } from '@/shared/ui/loading-button';
import { NoData } from '@/shared/ui/no-data';

import {
  $statusMappings,
  addRowClicked,
  externalStatusChanged,
  saveStatusMappingsClicked,
  saveStatusMappingsMutation,
  statusMappingsQuery,
} from '../model/model';
import { columns } from './columns';

const MAX_ROWS = 8;

// eslint-disable-next-line import/no-default-export
export default function SettingsPage() {
  const { statusMappings, isStatusesLoading, isSavingMappings } = useUnit({
    statusMappings: $statusMappings,
    isStatusesLoading: statusMappingsQuery.$pending,
    isSavingMappings: saveStatusMappingsMutation.$pending,
  });

  return (
    <Wrapper>
      <TableWrapper>
        <Typography variant="h6">Статус заказов</Typography>

        <HeightWrapper
          isMaxHeight={statusMappings.length > MAX_ROWS}
          maxHeight={600}
        >
          <DataGrid
            rows={statusMappings}
            columns={columns}
            autoHeight={statusMappings.length <= MAX_ROWS}
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            disableRowSelectionOnClick
            hideFooterPagination
            loading={isStatusesLoading}
            processRowUpdate={(newRow) => {
              externalStatusChanged({
                id: newRow.id,
                externalStatus: newRow.externalStatus,
              });
              return newRow;
            }}
            slots={{
              toolbar: AddRecord,
              noRowsOverlay: NoData,
              noResultsOverlay: NoData,
            }}
          />
        </HeightWrapper>

        <SaveButtonWrapper>
          <LoadingButton
            loading={isSavingMappings}
            variant="contained"
            onClick={() => saveStatusMappingsClicked()}
          >
            Сохранить
          </LoadingButton>
        </SaveButtonWrapper>
      </TableWrapper>
    </Wrapper>
  );
}

function AddRecord() {
  return (
    <GridToolbarContainer>
      <Button startIcon={<AddIcon />} onClick={() => addRowClicked()}>
        Добавить статус
      </Button>
    </GridToolbarContainer>
  );
}

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '25px',
});

const TableWrapper = styled('div', {
  width: '70%',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const SaveButtonWrapper = styled('div', {
  display: 'flex',
});
