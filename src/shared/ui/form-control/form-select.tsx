import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { ConnectedField } from 'effector-forms';

import { LabelValue } from '@/shared/types/utility';

type Value = string | number;

type FormControlProps = React.ComponentProps<typeof FormControl>;

interface FormSelectProps<T extends Value> {
  label: string;
  options: LabelValue<T>[];
  field: ConnectedField<T>;
  formControlProps?: FormControlProps;
}

export function FormSelect<T extends Value>({
  label,
  options,
  field,
  formControlProps,
}: FormSelectProps<T>) {
  return (
    <FormControl error={field.hasError()} {...formControlProps}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={field.value}
        onChange={(evt) => field.onChange(evt.target.value as T)}
        onBlur={() => field.onBlur()}
      >
        {options.map(({ label, value }) => (
          <MenuItem key={label} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{field.errorText()}</FormHelperText>
    </FormControl>
  );
}
