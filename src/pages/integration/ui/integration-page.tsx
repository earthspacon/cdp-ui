import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useUnit } from 'effector-react';

import '../model/model';
import { $catalogHistory, $page, CatalogHistory } from '../model/model';

// eslint-disable-next-line import/no-default-export
export default function IntegrationPage() {
  const { catalogHistory, page } = useUnit({
    catalogHistory: $catalogHistory,
    page: $page,
  });

  return (
    <Box sx={{ maxWidth: '80%' }}>
      <Typography variant="h4">Загрузка каталога</Typography>

      <DataGrid
        rows={catalogHistory}
        columns={columns}
        autoHeight
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
      />
    </Box>
  );
}

const columns: GridColDef<CatalogHistory>[] = [
  { field: 'date', headerName: 'Дата', width: 130 },
  {
    field: 'statusLabel',
    headerName: 'Статус загрузки',
    width: 100,
    editable: true,
  },
  {
    field: 'errorDetails',
    headerName: 'Обнаруженные ошибки',
    width: 200,
    editable: true,
  },
];
