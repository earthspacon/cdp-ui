import { DatePicker } from '@mui/x-date-pickers';
import { ConnectedField } from 'effector-forms';

import { FormDate } from '@/shared/types/utility';

type DatePickerProps = React.ComponentPropsWithoutRef<typeof DatePicker>;

interface FormDatePickerProps extends DatePickerProps {
  field: ConnectedField<FormDate>;
}

export function FormDatePicker({ field, ...props }: FormDatePickerProps) {
  return (
    <DatePicker
      value={field.value}
      onChange={(date) => field.onChange(date as FormDate)}
      slotProps={{
        textField: {
          error: field.hasError(),
          helperText: field.errorText(),
          onBlur: () => field.onBlur(),
        },
      }}
      {...props}
    />
  );
}
