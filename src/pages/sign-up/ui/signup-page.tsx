import { Typography } from '@mui/material';
import { styled } from '@stitches/react';
import { useForm } from 'effector-forms';
import { useUnit } from 'effector-react';

import { Centered } from '@/shared/ui/centered';
import { FormInput } from '@/shared/ui/form-control/form-input';
import { LoadingButton } from '@/shared/ui/loading-button';

import { signupMutation } from '../api';
import { signupForm } from '../model/model';

// eslint-disable-next-line import/no-default-export
export default function SignUpPage() {
  const { submit, eachValid } = useForm(signupForm);
  const { isSigningUp, isSignupFailed } = useUnit({
    isSigningUp: signupMutation.$pending,
    isSignupFailed: signupMutation.$failed,
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submit();
  };

  return (
    <Centered>
      <LoginWrapper onSubmit={onSubmit}>
        <InputsWrapper>
          <FormInput
            field={signupForm.fields.email}
            textFieldProps={{ label: 'Email', type: 'email' }}
          />
          <FormInput
            field={signupForm.fields.password}
            textFieldProps={{ label: 'Пароль', type: 'password' }}
          />
          <FormInput
            field={signupForm.fields.confirmPassword}
            textFieldProps={{ label: 'Повторите пароль', type: 'password' }}
          />
          <FormInput
            field={signupForm.fields.shopUrl}
            textFieldProps={{ label: 'Адрес сайта магазина' }}
          />

          {isSignupFailed && (
            <Typography sx={{ textAlign: 'center' }} color="error">
              Произошла ошибка
            </Typography>
          )}
        </InputsWrapper>

        <BottomButtonsWrapper>
          <LoadingButton
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={!eachValid || isSigningUp}
            loading={isSigningUp}
          >
            Зарегистрироваться
          </LoadingButton>
        </BottomButtonsWrapper>
      </LoginWrapper>
    </Centered>
  );
}

const LoginWrapper = styled('form', {
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '40px',
});

const InputsWrapper = styled('div', {
  width: '100%',
  display: 'flex',
  gap: '20px',
  flexDirection: 'column',
});

const BottomButtonsWrapper = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  alignItems: 'center',
  justifyContent: 'center',
});
