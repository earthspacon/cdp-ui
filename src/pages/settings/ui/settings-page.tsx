import { Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { styled } from '@stitches/react';
import { useUnit } from 'effector-react';

import { NoData } from '@/shared/ui/no-data';

import { $statusMappings } from '../model/model';

// eslint-disable-next-line import/no-default-export
export default function SettingsPage() {
  const { statusMappings } = useUnit({ statusMappings: $statusMappings });

  return (
    <Wrapper>
      <Typography variant="h6">Статус заказов</Typography>

      <DataGrid
        rows={statusMappings}
        columns={columns}
        autoHeight
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        disableRowSelectionOnClick
        // loading={isCatalogLoading}
        hideFooterPagination
        slots={{
          noRowsOverlay: NoData,
          noResultsOverlay: NoData,
        }}
      />
    </Wrapper>
  );
}

const columns: GridColDef[] = [
  { field: 'externalStatus', headerName: 'Статус в магазине', flex: 1 },
  { field: 'cdpStatus', headerName: 'Статус в CDP', flex: 1 },
];

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
});
