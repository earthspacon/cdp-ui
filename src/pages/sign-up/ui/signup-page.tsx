import { Button, CircularProgress, Typography } from '@mui/material';
import { styled } from '@stitches/react';
import { useForm } from 'effector-forms';
import { useUnit } from 'effector-react';

import { Centered } from '@/shared/ui/centered';
import { FormInput } from '@/shared/ui/form-control/form-input';

import { signupMutation } from '../api';
import { signupForm } from '../model/model';

// eslint-disable-next-line import/no-default-export
export default function SignUpPage() {
  const { fields, submit, eachValid } = useForm(signupForm);
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
          <FormInput field={fields.email} textFieldProps={{ label: 'Email' }} />
          <FormInput
            field={fields.password}
            textFieldProps={{ label: 'Пароль' }}
          />
          <FormInput
            field={fields.confirmPassword}
            textFieldProps={{ label: 'Повторите пароль' }}
          />
          <FormInput
            field={fields.shopUrl}
            textFieldProps={{ label: 'Адрес сайта магазина' }}
          />

          {isSignupFailed && (
            <Typography sx={{ textAlign: 'center' }} color="error">
              Произошла ошибка
            </Typography>
          )}
        </InputsWrapper>

        <BottomButtonsWrapper>
          <Button
            variant="contained"
            size="large"
            sx={{ width: '100%' }}
            type="submit"
            disabled={!eachValid || isSigningUp}
            startIcon={
              isSigningUp ? (
                <CircularProgress sx={{ mr: '10px' }} size={22} />
              ) : null
            }
          >
            Зарегистрироваться
          </Button>
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
