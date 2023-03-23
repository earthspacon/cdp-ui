import { Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@stitches/react';
import { useForm } from 'effector-forms';

import { genderOptions, hasValueOptions } from '@/shared/api/segments';
import { orderStatusOptions } from '@/shared/api/status-mappings';
import { ChildrenProp } from '@/shared/types/utility';
import { FormInput } from '@/shared/ui/form-control/form-input';
import { FormSelect } from '@/shared/ui/form-control/form-select';

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
                <Stack spacing={2} width="30%">
                  <FormSelect
                    field={fields.email}
                    label="Email"
                    options={hasValueOptions}
                  />
                  <FormSelect
                    field={fields.gender}
                    label="Пол"
                    options={genderOptions}
                  />
                </Stack>
                <Stack spacing={2}>
                  <FormSelect
                    field={fields.phoneNumber}
                    label="Номер телефона"
                    options={hasValueOptions}
                  />

                  <Stack spacing={2} direction="row" alignItems="center">
                    <DatePicker label="Дата рождения (от)" />

                    <Typography>—</Typography>

                    <DatePicker label="Дата рождения (до)" />
                  </Stack>
                </Stack>
              </Stack>
            </FilterWrapper>

            <FilterWrapper title="Заказы">
              <Stack spacing={5} direction="row">
                <Stack spacing={2}>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <DatePicker label="Диапазон дат (от)" />

                    <Typography>—</Typography>

                    <DatePicker label="Диапазон дат (до)" />
                  </Stack>

                  <FormSelect
                    field={fields.gender}
                    label="Статус заказов"
                    options={orderStatusOptions}
                  />
                </Stack>

                <Stack spacing={2} width="30%">
                  {/* <FormInput label="Дата рождения (от)" /> */}

                  <Typography>—</Typography>

                  <DatePicker label="Дата рождения (до)" />
                </Stack>
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
    <Stack spacing={3}>
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
