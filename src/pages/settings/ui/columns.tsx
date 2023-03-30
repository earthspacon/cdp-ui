import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { MenuItem, Select } from '@mui/material';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import {
  OrderStatus,
  orderStatuses,
  orderStatusLabels,
} from '@/shared/api/status-mappings';

import { StatusMappings } from '../lib';
import { cdpStatusChanged, deleteRowClicked } from '../model/model';

export const columns: GridColDef<StatusMappings>[] = [
  {
    field: 'externalStatus',
    headerName: 'Статус в магазине',
    flex: 1,
    editable: true,
  },
  {
    field: 'cdpStatusLabel',
    headerName: 'Статус в CDP',
    flex: 1,
    sortable: false,
    renderCell(params) {
      const id = params.id as string;
      const externalStatus = params.row.externalStatus;
      const statusValue = orderStatusLabels[params.row.cdpStatusLabel];
      return (
        <StatusSelect
          value={statusValue}
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
        />,
      ];
    },
  },
];

interface StatusSelectProps {
  value: OrderStatus;
  onChange: (value: OrderStatus) => void;
}

function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <Select
      value={value}
      onChange={(evt) => onChange(evt.target.value as OrderStatus)}
      fullWidth
    >
      {Object.entries(orderStatuses).map(([status, label]) => (
        <MenuItem key={status} value={status}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
}
