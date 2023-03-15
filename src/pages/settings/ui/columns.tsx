import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  MenuItem,
  Select,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';
import {
  GridActionsCellItem,
  GridColDef,
  GridEditInputCell,
  GridPreProcessEditCellProps,
  GridRenderEditCellParams,
} from '@mui/x-data-grid';

import {
  cdpStatusChanged,
  deleteRowClicked,
  orderStatues,
  OrderStatus,
  orderStatusLabels,
  StatusMappings,
} from '../model/model';

export const columns: GridColDef<StatusMappings>[] = [
  {
    field: 'externalStatus',
    headerName: 'Статус в магазине',
    flex: 1,
    editable: true,
    // preProcessEditCellProps: preProcessEditCellProps,
    // renderEditCell: renderEditStatus,
  },
  {
    field: 'cdpStatusLabel',
    headerName: 'Статус в CDP',
    flex: 1,
    sortable: false,
    renderCell(params) {
      const id = params.id as string;
      const externalStatus = params.row.externalStatus;
      const statusValue = orderStatusLabels[params.value];
      return (
        <StatusSelect
          defaultValue={statusValue}
          onChange={(status) =>
            cdpStatusChanged({ status, externalStatus, id })
          }
        />
      );
    },
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Действия',
    getActions(row) {
      return [
        <GridActionsCellItem
          key={row.id}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => deleteRowClicked({ id: row.id as string })}
          color="inherit"
        />,
      ];
    },
  },
];

interface StatusSelectProps {
  defaultValue: OrderStatus;
  onChange: (value: OrderStatus) => void;
}

function StatusSelect({ defaultValue, onChange }: StatusSelectProps) {
  return (
    <Select
      defaultValue={defaultValue}
      onChange={(evt) => onChange(evt.target.value as OrderStatus)}
      fullWidth
    >
      {Object.entries(orderStatues).map(([status, label]) => (
        <MenuItem key={status} value={status}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
}

function StatusEditInputCell(props: GridRenderEditCellParams) {
  const { error } = props;

  return (
    <StyledTooltip open={!!error} title={error}>
      <GridEditInputCell {...props} />
    </StyledTooltip>
  );
}

function renderEditStatus(params: GridRenderEditCellParams) {
  return <StatusEditInputCell {...params} />;
}

function preProcessEditCellProps(params: GridPreProcessEditCellProps) {
  const hasError = params.props.value.trim().length === 0;
  const errorMessage = hasError ? 'Поле не может быть пустым' : null;

  return { ...params.props, error: errorMessage };
}

const StyledTooltip = muiStyled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));
