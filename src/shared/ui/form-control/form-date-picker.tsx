import { DatePicker } from '@mui/x-date-pickers';
import { Field, useField } from 'effector-forms';

import { FormDate } from '@/shared/types/utility';

type DatePickerProps = React.ComponentPropsWithoutRef<typeof DatePicker>;

interface FormDatePickerProps extends DatePickerProps {
  field: Field<FormDate>;
}

export function FormDatePicker({ field, ...props }: FormDatePickerProps) {
  const connectedField = useField(field);

  return (
    <DatePicker
      value={connectedField.value}
      onChange={(date) => connectedField.onChange(date as FormDate)}
      slotProps={{
        textField: {
          error: connectedField.hasError(),
          helperText: connectedField.errorText(),
          onBlur: () => connectedField.onBlur(),
        },
      }}
      {...props}
    />
  );
}
