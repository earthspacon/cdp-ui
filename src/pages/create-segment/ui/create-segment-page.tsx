import { Button, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@stitches/react';
import { useForm } from 'effector-forms';
import { useUnit } from 'effector-react';

import {
  genderOptions,
  hasValueOptions,
  loyaltyProgramStatusOptions,
} from '@/shared/api/segments';
import { orderStatusOptions } from '@/shared/api/status-mappings';
import { ChildrenProp } from '@/shared/types/utility';
import { FormDatePicker } from '@/shared/ui/form-control/form-date-picker';
import { FormInput } from '@/shared/ui/form-control/form-input';
import { FormSelect } from '@/shared/ui/form-control/form-select';
import { LoadingButton } from '@/shared/ui/loading-button';

import { formFields, segmentCreationForm } from '../model/form';
import {
  $loyaltyLevelOptions,
  $segmentCode,
  cancelClicked,
  createSegmentMutation,
  loyaltyLevelsQuery,
} from '../model/model';

const inputsWidth = '250px';
const inputsWidthProp = { width: inputsWidth };
const dateFormat = 'DD/MM/YYYY';

// eslint-disable-next-line import/no-default-export
export default function CreateSegmentPage() {
  return (
    <Wrapper>
      <FormWrapper>
        <Stack spacing={10}>
          <Stack spacing={6}>
            <Typography textAlign="center" variant="h4" fontWeight={500}>
              Создание сегмента
            </Typography>

            <Stack spacing={5}>
              <SegmentNameInputs />
              <BuyersInputs />
              <OrdersInputs />
              <LoyaltyProgramInputs />
            </Stack>
          </Stack>

          <Actions />
        </Stack>
      </FormWrapper>
    </Wrapper>
  );
}

function Actions() {
  const { submit, eachValid } = useForm(segmentCreationForm);
  const { isSubmitting } = useUnit({
    isSubmitting: createSegmentMutation.$pending,
  });

  return (
    <Stack spacing={8} direction="row" justifyContent="center" pb={2}>
      <Button
        variant="contained"
        color="error"
        size="large"
        onClick={() => cancelClicked()}
      >
        Отменить
      </Button>

      <LoadingButton
        loading={isSubmitting}
        disabled={!eachValid || isSubmitting}
        variant="contained"
        size="large"
        onClick={() => submit()}
      >
        Сохранить
      </LoadingButton>
    </Stack>
  );
}

function SegmentNameInputs() {
  const segmentCode = useUnit($segmentCode);

  return (
    <Stack spacing={2} width="45%">
      <FormInput
        field={formFields.segmentName}
        textFieldProps={{ label: 'Название сегмента' }}
      />
      <TextField
        label="Код сегмента"
        value={segmentCode}
        InputProps={{ readOnly: true }}
      />
    </Stack>
  );
}

function BuyersInputs() {
  return (
    <FilterWrapper title="Покупатели">
      <Stack spacing={5.5} direction="row">
        <Stack spacing={2} {...inputsWidthProp}>
          <FormSelect
            field={formFields.email}
            label="Email"
            options={hasValueOptions}
          />
          <FormSelect
            field={formFields.gender}
            label="Пол"
            options={genderOptions}
          />
        </Stack>

        <Stack spacing={2}>
          <FormSelect
            field={formFields.phoneNumber}
            label="Номер телефона"
            options={hasValueOptions}
            formControlProps={{ sx: inputsWidthProp }}
          />

          <Stack spacing={2} direction="row" alignItems="baseline">
            <FormDatePicker
              field={formFields.birthDateFrom}
              label="Дата рождения (от)"
              format={dateFormat}
              sx={inputsWidthProp}
              disableFuture
            />

            <Typography>—</Typography>

            <FormDatePicker
              field={formFields.birthDateTo}
              label="Дата рождения (до)"
              format={dateFormat}
              sx={inputsWidthProp}
              disableFuture
            />
          </Stack>
        </Stack>
      </Stack>
    </FilterWrapper>
  );
}

function OrdersInputs() {
  return (
    <FilterWrapper title="Заказы">
      <Stack spacing={5.5} direction="row">
        <Stack spacing={2}>
          <Stack spacing={2} direction="row" alignItems="baseline">
            <FormInput
              field={formFields.ordersNumberFrom}
              textFieldProps={{
                label: 'Количество заказов (от)',
                type: 'number',
                sx: inputsWidthProp,
              }}
            />

            <Typography>—</Typography>

            <FormInput
              field={formFields.ordersNumberTo}
              textFieldProps={{
                label: 'Количество заказов (до)',
                type: 'number',
                sx: inputsWidthProp,
              }}
            />
          </Stack>

          <Stack spacing={2} direction="row" alignItems="baseline">
            <FormInput
              field={formFields.ordersTotalFrom}
              textFieldProps={{
                label: 'Сумма заказов (от)',
                type: 'number',
                sx: inputsWidthProp,
              }}
            />

            <Typography>—</Typography>

            <FormInput
              field={formFields.ordersTotalTo}
              textFieldProps={{
                label: 'Сумма заказов (до)',
                type: 'number',
                sx: inputsWidthProp,
              }}
            />
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Stack spacing={2} direction="row" alignItems="baseline">
            <FormDatePicker
              field={formFields.purchaseDateRangeFrom}
              label="Диапазон дат (от)"
              format={dateFormat}
              sx={inputsWidthProp}
            />

            <Typography>—</Typography>

            <FormDatePicker
              field={formFields.purchaseDateRangeTo}
              label="Диапазон дат (до)"
              format={dateFormat}
              sx={inputsWidthProp}
            />
          </Stack>

          <FormSelect
            field={formFields.ordersStatus}
            label="Статус заказов"
            options={orderStatusOptions}
            formControlProps={{ sx: inputsWidthProp }}
          />
        </Stack>
      </Stack>
    </FilterWrapper>
  );
}

function LoyaltyProgramInputs() {
  const { isLoyaltyLevelsLoading, loyaltyLevelOptions } = useUnit({
    isLoyaltyLevelsLoading: loyaltyLevelsQuery.$pending,
    loyaltyLevelOptions: $loyaltyLevelOptions,
  });

  return (
    <FilterWrapper title="Программа лояльности">
      <Stack spacing={5.5} direction="row">
        <Stack spacing={2} width="320px">
          <FormSelect
            field={formFields.loyaltyProgramLevel}
            label="Уровень в программе лояльности"
            options={loyaltyLevelOptions}
            loading={isLoyaltyLevelsLoading}
          />
          <FormSelect
            field={formFields.loyaltyProgramStatus}
            label="Статус в программе лояльности"
            options={loyaltyProgramStatusOptions}
          />
        </Stack>

        <Stack>
          <Stack spacing={2} direction="row" alignItems="baseline">
            <FormInput
              field={formFields.bonusesBalanceFrom}
              textFieldProps={{
                label: 'Баланс бонусов (от)',
                type: 'number',
                sx: inputsWidthProp,
              }}
            />

            <Typography>—</Typography>

            <FormInput
              field={formFields.bonusesBalanceTo}
              textFieldProps={{
                label: 'Баланс бонусов (до)',
                type: 'number',
                sx: inputsWidthProp,
              }}
            />
          </Stack>
        </Stack>
      </Stack>
    </FilterWrapper>
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
