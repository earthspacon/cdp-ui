import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { ConnectedField } from 'effector-forms';

import { LabelValue } from '@/shared/types/utility';

import { Centered } from '../centered';
import { NoData } from '../no-data';

type Value = string | number;

type FormControlProps = React.ComponentPropsWithoutRef<typeof FormControl>;
type SelectProps = React.ComponentPropsWithoutRef<typeof Select>;

interface FormSelectProps<T extends Value> {
  label: string;
  options: LabelValue<T>[];
  field: ConnectedField<T>;
  formControlProps?: FormControlProps;
  selectProps?: SelectProps;
  loading?: boolean;
}

export function FormSelect<T extends Value>({
  label,
  options,
  field,
  loading,
  formControlProps,
  selectProps,
}: FormSelectProps<T>) {
  return (
    <FormControl error={field.hasError()} {...formControlProps}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={field.value}
        onChange={(evt) => field.onChange(evt.target.value as T)}
        onBlur={() => field.onBlur()}
        {...selectProps}
      >
        {loading ? (
          <Centered css={{ padding: 5 }}>
            <CircularProgress size={30} />
          </Centered>
        ) : options.length > 0 ? (
          options.map(({ label, value }) => (
            <MenuItem key={label} value={value}>
              {label}
            </MenuItem>
          ))
        ) : (
          <NoData />
        )}
      </Select>
      <FormHelperText>{field.errorText()}</FormHelperText>
    </FormControl>
  );
}
