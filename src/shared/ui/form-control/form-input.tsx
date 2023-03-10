import { TextField, TextFieldProps } from '@mui/material';
import { ConnectedField } from 'effector-forms';

interface FormInputProps {
  field: ConnectedField<string>;
  textFieldProps?: TextFieldProps;
}

export function FormInput({ field, textFieldProps }: FormInputProps) {
  return (
    <TextField
      value={field.value}
      onChange={(evt) => field.onChange(evt.target.value)}
      onBlur={() => field.onBlur()}
      error={field.hasError()}
      helperText={field.errorText()}
      {...textFieldProps}
    />
  );
}
