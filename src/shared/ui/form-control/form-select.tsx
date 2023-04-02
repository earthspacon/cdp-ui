import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Field, useField } from 'effector-forms';

import { LabelValue } from '@/shared/types/utility';

import { Centered } from '../centered';
import { NoData } from '../no-data';

type Value = string | number;

type FormControlProps = React.ComponentPropsWithoutRef<typeof FormControl>;
type SelectProps = React.ComponentPropsWithoutRef<typeof Select>;

interface FormSelectProps<T extends Value> {
  label: string;
  options: LabelValue<T>[];
  field: Field<T>;
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
  const connectedField = useField(field);

  return (
    <FormControl error={connectedField.hasError()} {...formControlProps}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={connectedField.value}
        onChange={(evt) => connectedField.onChange(evt.target.value as T)}
        onBlur={() => connectedField.onBlur()}
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
      <FormHelperText>{connectedField.errorText()}</FormHelperText>
    </FormControl>
  );
}
