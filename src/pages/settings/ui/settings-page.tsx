import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { styled } from '@stitches/react';
import { useUnit } from 'effector-react';

import { LoadingButton } from '@/shared/ui/loading-button';
import { NoData } from '@/shared/ui/no-data';

import { statusMappingsQuery } from '../api';
import {
  $statusMappings,
  addRowClicked,
  externalStatusChanged,
  saveStatusMappingsClicked,
} from '../model/model';
import { columns } from './columns';

// eslint-disable-next-line import/no-default-export
export default function SettingsPage() {
  const { statusMappings, isStatusesLoading } = useUnit({
    statusMappings: $statusMappings,
    isStatusesLoading: statusMappingsQuery.$pending,
  });

  return (
    <Wrapper>
      <TableWrapper>
        <Typography variant="h6">Статус заказов</Typography>

        <StyledDataGridWrapper>
          <DataGrid
            rows={statusMappings}
            columns={columns}
            autoHeight={statusMappings.length < 9}
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
        </StyledDataGridWrapper>

        <SaveButtonWrapper>
          <LoadingButton
            loading={false}
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

const StyledDataGridWrapper = muiStyled(Box)(() => ({
  maxHeight: '600px',
  height: '100%',
  '& .Mui-error': {
    backgroundColor: 'rgb(126,10,15, 0.1)',
    color: '#750f0f',
    height: '100%',
  },
}));
