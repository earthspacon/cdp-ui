import { FormControl, InputLabel, Select } from '@mui/material';
import Typography from '@mui/material/Typography/Typography';
import { Stack } from '@mui/system';
import { styled } from '@stitches/react';
import { useForm } from 'effector-forms';

import { ChildrenProp } from '@/shared/types/utility';
import { FormInput } from '@/shared/ui/form-control/form-input';

import { segmentCreationForm } from '../model/form';

// eslint-disable-next-line import/no-default-export
export default function CreateSegmentPageContent() {
  const { fields } = useForm(segmentCreationForm);

  return (
    <Wrapper>
      <FormWrapper>
        <Stack spacing={6}>
          <Typography textAlign="center" variant="h4" fontWeight={500}>
            Создание сегмента
          </Typography>
          <Stack spacing={5}>
            <Stack spacing={2} width="40%">
              <FormInput
                field={fields.segmentName}
                textFieldProps={{ label: 'Название сегмента' }}
              />
              <FormInput
                field={fields.segmentCode}
                textFieldProps={{
                  label: 'Код сегмента',
                  InputProps: { readOnly: true },
                  size: 'small',
                }}
              />
            </Stack>

            <FilterWrapper title="Покупатели">
              <Stack spacing={5} direction="row">
                <Stack>
                  <FormControl>
                    <InputLabel>Email</InputLabel>
                    <Select></Select>
                  </FormControl>
                </Stack>
                <Stack></Stack>
              </Stack>
            </FilterWrapper>
          </Stack>
        </Stack>
      </FormWrapper>
    </Wrapper>
  );
}

function FilterWrapper({ title, children }: { title: string } & ChildrenProp) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={500}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

const Wrapper = styled('div', {
  padding: '30px',
  display: 'flex',
  justifyContent: 'center',
});

const FormWrapper = styled('div', {
  width: '80%',
});
