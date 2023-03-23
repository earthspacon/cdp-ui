import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { ConnectedField } from 'effector-forms';

type Value = string | number;

type LabelValue = { label: string; value: Value };

interface FormSelectProps {
  label: string;
  options: LabelValue[];
  field: ConnectedField<Value>;
}

export function FormSelect({ label, options, field }: FormSelectProps) {
  return (
    <FormControl error={field.hasError()}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={field.value}
        onChange={(evt) => field.onChange(evt.target.value)}
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
