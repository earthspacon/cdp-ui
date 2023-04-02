import { TextField, TextFieldProps } from '@mui/material';
import { Field, useField } from 'effector-forms';

interface FormInputProps {
  field: Field<string>;
  textFieldProps?: TextFieldProps;
}

export function FormInput({ field, textFieldProps }: FormInputProps) {
  const connectedField = useField(field);

  return (
    <TextField
      value={connectedField.value}
      onChange={(evt) => connectedField.onChange(evt.target.value)}
      onBlur={() => connectedField.onBlur()}
      error={connectedField.hasError()}
      helperText={connectedField.errorText()}
      {...textFieldProps}
    />
  );
}
