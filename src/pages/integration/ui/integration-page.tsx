import { Button, TextField, Typography } from '@mui/material';
import { DataGrid, gridClasses, GridColDef } from '@mui/x-data-grid';
import { styled } from '@stitches/react';
import { useUnit } from 'effector-react';

import { Centered } from '@/shared/ui/centered';
import { LoadingButton } from '@/shared/ui/loading-button';

import { catalogHistoryQuery, uploadCatalogMutation } from '../api';
import '../model/model';
import {
  $apiToken,
  $catalogHistory,
  $page,
  CatalogHistory,
  fileUploaded,
  PAGE_SIZE,
  pageChanged,
} from '../model/model';

// eslint-disable-next-line import/no-default-export
export default function IntegrationPage() {
  const { catalogHistory, apiToken, page, isCatalogLoading, uploadingCatalog } =
    useUnit({
      catalogHistory: $catalogHistory,
      apiToken: $apiToken,
      page: $page,
      isCatalogLoading: catalogHistoryQuery.$pending,
      uploadingCatalog: uploadCatalogMutation.$pending,
    });

  return (
    <Wrapper>
      <TablePart>
        <Typography variant="h6">Загрузка каталога</Typography>

        <UploadWrapper>
          <LoadingButton
            loading={uploadingCatalog}
            variant="contained"
            component="label"
          >
            Загрузить каталог
            <input
              hidden
              accept=".yml"
              type="file"
              onChange={(evt) => fileUploaded(evt.target.files)}
            />
          </LoadingButton>
        </UploadWrapper>

        <DataGrid
          rows={catalogHistory}
          columns={columns}
          sx={dataGridStyles}
          autoHeight
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          paginationMode="server"
          loading={isCatalogLoading}
          rowCount={100} // TODO: remove after backend sends total count
          paginationModel={{ page: page, pageSize: PAGE_SIZE }}
          onPaginationModelChange={({ page }) => pageChanged(page)}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            noResultsOverlay: CustomNoRowsOverlay,
          }}
        />
      </TablePart>

      <ApiTokenPart>
        <Typography variant="h6">
          Создать API Token для загрузки пользователей и заказов
        </Typography>

        <ApiTokenBody>
          <TextField
            fullWidth
            InputProps={{ readOnly: true }}
            value={apiToken}
          />

          <ApiTokenButtons>
            <LoadingButton loading={false} variant="contained">
              Создать новый API Token
            </LoadingButton>

            {apiToken.length > 0 && (
              <Button variant="outlined">Скопировать</Button>
            )}
          </ApiTokenButtons>
        </ApiTokenBody>
      </ApiTokenPart>
    </Wrapper>
  );
}

const columns: GridColDef<CatalogHistory>[] = [
  {
    field: 'date',
    headerName: 'Дата',
    flex: 1,
  },
  {
    field: 'statusLabel',
    headerName: 'Статус загрузки',
    flex: 1,
  },
  {
    field: 'errorDetails',
    headerName: 'Обнаруженные ошибки',
    flex: 1,
    sortable: false,
  },
];

const dataGridStyles = {
  [`& .${gridClasses.cell}`]: {
    py: 2,
  },
};

const Wrapper = styled('div', {
  maxWidth: '80%',
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
});

const TablePart = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
});

const UploadWrapper = styled('div', {
  display: 'flex',

  label: {
    padding: '8px 25px',
  },
});

const ApiTokenPart = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
});

const ApiTokenBody = styled('div', {
  width: '80%',
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
  alignItems: 'center',
  justifyContent: 'center',
});

const ApiTokenButtons = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '25px',
});

const CustomNoRowsOverlay = () => (
  <Centered>
    <Typography color="GrayText">Нет данных</Typography>
  </Centered>
);
