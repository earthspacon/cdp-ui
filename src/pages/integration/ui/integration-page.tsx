import { reflect, variant } from '@effector/reflect';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useUnit } from 'effector-react';

import { Centered } from '@/shared/ui/centered';
import { HeightWrapper } from '@/shared/ui/height-wrapper';
import { LoadingButton } from '@/shared/ui/loading-button';
import { NoData } from '@/shared/ui/no-data';

import * as styles from './styles';
import {
  catalogHistoryQuery,
  generateApiTokenMutation,
  getApiTokenQuery,
  uploadCatalogMutation,
} from '../api';
import {
  $apiToken,
  $catalogHistory,
  $catalogHistoryTotalCount,
  $fileInputValue,
  $noApiToken,
  $page,
  CatalogHistory,
  copyTokenClicked,
  fileUploaded,
  generateTokenClicked,
  PAGE_SIZE,
  pageChanged,
} from '../model/model';

const MAX_ROWS = 10;

// eslint-disable-next-line import/no-default-export
export default function IntegrationPage() {
  const {
    catalogHistory,
    page,
    isCatalogLoading,
    uploadingCatalog,
    fileInputValue,
    catalogHistoryTotalCount,
  } = useUnit({
    catalogHistory: $catalogHistory,
    page: $page,
    isCatalogLoading: catalogHistoryQuery.$pending,
    uploadingCatalog: uploadCatalogMutation.$pending,
    fileInputValue: $fileInputValue,
    catalogHistoryTotalCount: $catalogHistoryTotalCount,
  });

  return (
    <styles.Wrapper>
      <styles.TablePart>
        <Typography variant="h6">Загрузка каталога</Typography>

        <styles.UploadWrapper>
          <LoadingButton
            loading={uploadingCatalog}
            variant="contained"
            component="label"
          >
            Загрузить каталог
            <input
              hidden
              accept=".xml"
              type="file"
              value={fileInputValue}
              onChange={(evt) => fileUploaded(evt.target.files)}
            />
          </LoadingButton>
        </styles.UploadWrapper>

        <HeightWrapper
          isMaxHeight={catalogHistory.length > MAX_ROWS}
          maxHeight={500}
        >
          <DataGrid
            rows={catalogHistory}
            columns={columns}
            sx={styles.dataGridStyles}
            autoHeight={catalogHistory.length <= MAX_ROWS}
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            disableRowSelectionOnClick
            getRowHeight={() => 'auto'}
            paginationMode="server"
            loading={isCatalogLoading}
            rowCount={catalogHistoryTotalCount}
            paginationModel={{ page: page, pageSize: PAGE_SIZE }}
            pageSizeOptions={[PAGE_SIZE]}
            onPaginationModelChange={({ page }) => pageChanged(page)}
            slots={{
              noRowsOverlay: NoData,
              noResultsOverlay: NoData,
            }}
          />
        </HeightWrapper>
      </styles.TablePart>

      <styles.ApiTokenPart>
        <Typography variant="h6">
          Создать API Token для загрузки пользователей и заказов
        </Typography>

        <ApiTokenBody />
      </styles.ApiTokenPart>
    </styles.Wrapper>
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

const ApiTokenBody = variant({
  if: getApiTokenQuery.$pending,
  then: () => (
    <Centered>
      <CircularProgress />
    </Centered>
  ),
  else: reflect({
    view: ({ generatingToken }: { generatingToken: boolean }) => (
      <styles.ApiTokenBody>
        <ApiTokenField />

        <styles.ApiTokenButtons>
          <LoadingButton
            loading={generatingToken}
            variant="contained"
            onClick={() => generateTokenClicked()}
          >
            Создать новый API Token
          </LoadingButton>

          <CopyButton />
        </styles.ApiTokenButtons>
      </styles.ApiTokenBody>
    ),
    bind: { generatingToken: generateApiTokenMutation.$pending },
  }),
});

const CopyButton = variant({
  if: $noApiToken,
  then: () => null,
  else: () => (
    <Button variant="outlined" onClick={() => copyTokenClicked()}>
      Скопировать
    </Button>
  ),
});

const ApiTokenField = variant({
  if: $noApiToken,
  then: () => (
    <Typography color="error" fontSize={18}>
      Токен не найден
    </Typography>
  ),
  else: reflect({
    view: ({ apiToken }: { apiToken: string }) => (
      <TextField fullWidth InputProps={{ readOnly: true }} value={apiToken} />
    ),
    bind: { apiToken: $apiToken },
  }),
});
