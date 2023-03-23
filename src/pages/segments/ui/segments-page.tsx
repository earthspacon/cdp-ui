import { reflect } from '@effector/reflect';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Box,
  Button,
  Collapse,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import {
  DataGrid,
  gridClasses,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { styled } from '@stitches/react';
import { useStoreMap } from 'effector-react';
import { useState } from 'react';

import { HeightWrapper } from '@/shared/ui/height-wrapper';
import { NoData } from '@/shared/ui/no-data';

import { LabelValue, MappedSegment } from '../lib';
import {
  $segmentCustomers,
  createSegmentClicked,
  PAGE_SIZE,
  pageChanged,
  segmentsContentStores,
  SegmentsContentStores,
} from '../model/model';

const MAX_ROWS = 2;

const SegmentsPage = reflect({
  view: SegmentsPageContent,
  bind: segmentsContentStores,
});

function SegmentsPageContent({
  page,
  segmentsList,
  segmentsTotalCount,
  isSegmentsLoading,
}: SegmentsContentStores) {
  return (
    <Wrapper>
      <CreateSegmentButton>
        <Button variant="contained" onClick={() => createSegmentClicked()}>
          Создать сегмент
        </Button>
      </CreateSegmentButton>

      <HeightWrapper
        isMaxHeight={segmentsList.length > MAX_ROWS}
        maxHeight={700}
        sx={{ width: '100%' }}
      >
        <DataGrid
          rows={segmentsList}
          columns={columns}
          autoHeight={segmentsList.length <= MAX_ROWS}
          sx={dataGridStyles}
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          paginationMode="server"
          loading={isSegmentsLoading}
          rowCount={segmentsTotalCount}
          paginationModel={{ page: page, pageSize: PAGE_SIZE }}
          pageSizeOptions={[PAGE_SIZE]}
          onPaginationModelChange={({ page }) => pageChanged(page)}
          slots={{ noRowsOverlay: NoData, noResultsOverlay: NoData }}
        />
      </HeightWrapper>
    </Wrapper>
  );
}

const columns: GridColDef<MappedSegment>[] = [
  {
    field: 'name',
    headerName: 'Название сегмента',
    flex: 1,
  },
  {
    field: 'id',
    headerName: 'Клиенты',
    flex: 0.5,
    renderCell: (params) => <Customers params={params} />,
  },
  {
    field: 'filters',
    headerName: 'Параметры сегмента',
    flex: 1.5,
    sortable: false,
    renderCell: (params) => <FilterParameteres params={params} />,
  },
];

function Customers({
  params,
}: {
  params: GridRenderCellParams<MappedSegment>;
}) {
  const id = params.row.id;

  const customer = useStoreMap({
    store: $segmentCustomers,
    keys: [id],
    fn: (customers, [segmentId]) => {
      return customers.find((customer) => customer.id === segmentId);
    },
    defaultValue: { id, loading: false, customersCount: 0 },
  });

  return (
    <Box>
      {customer.loading ? (
        <CircularProgress />
      ) : (
        <Typography>{customer.customersCount}</Typography>
      )}
    </Box>
  );
}

function FilterParameteres({
  params,
}: {
  params: GridRenderCellParams<MappedSegment>;
}) {
  const { customer, loyalty, order } = params.row.filters;
  return (
    <Stack width="100%" spacing={0}>
      <FilterParamDropDown title="Покупатель" filterParam={customer} />
      <FilterParamDropDown title="Заказ" filterParam={loyalty} />
      <FilterParamDropDown title="Программа лояльности" filterParam={order} />
    </Stack>
  );
}

type FilterParamProp = {
  filterParam: Record<string, LabelValue>;
};

function FilterParamDropDown({
  title,
  filterParam,
}: { title: string } & FilterParamProp) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ListItemButton onClick={() => setOpen(!open)} divider>
        <ListItemText
          primary={<Typography fontWeight={500}>{title}</Typography>}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open}>
        <Stack width="100%" spacing={1} pl={3} pt={1}>
          {Object.values(filterParam).map(({ label, value }) => (
            <FilterItem key={label}>
              <FilterTitle>{label}</FilterTitle>
              <Typography>{value}</Typography>
            </FilterItem>
          ))}
        </Stack>
      </Collapse>
    </>
  );
}

const Wrapper = styled('div', {
  width: '90%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '40px',
});

const CreateSegmentButton = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
});

const FilterItem = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  gap: '30px',
});

const FilterTitle = styled(Typography, {
  width: '40%',
});

const dataGridStyles = {
  [`& .${gridClasses.cell}`]: {
    py: 2,
  },
};

// eslint-disable-next-line import/no-default-export
export default SegmentsPage;
