import { Typography } from '@mui/material';
import { styled } from '@stitches/react';
import { Link } from 'atomic-router-react';
import { useForm } from 'effector-forms';
import { useUnit } from 'effector-react';

import { routes } from '@/shared/config/routing';
import { Centered } from '@/shared/ui/centered';
import { FormInput } from '@/shared/ui/form-control/form-input';
import { LoadingButton } from '@/shared/ui/loading-button';

import { loginMutation } from '../api';
import { $loginErrors, loginForm } from '../model/model';

// eslint-disable-next-line import/no-default-export
export default function LoginPage() {
  const { submit, eachValid } = useForm(loginForm);
  const isLoggingIn = useUnit(loginMutation.$pending);
  const loginErrors = useUnit($loginErrors);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submit();
  };

  return (
    <Centered>
      <LoginWrapper onSubmit={onSubmit}>
        <InputsWrapper>
          <FormInput
            field={loginForm.fields.email}
            textFieldProps={{ label: 'Email', type: 'email' }}
          />
          <FormInput
            field={loginForm.fields.password}
            textFieldProps={{ label: 'Пароль', type: 'password' }}
          />

          {Object.values(loginErrors).some(Boolean) && (
            <Typography sx={{ textAlign: 'center' }} color="error">
              {loginErrors.userNotFound && 'Неправильный email или пароль'}
              {loginErrors.anotherError && 'Произошла ошибка'}
            </Typography>
          )}
        </InputsWrapper>

        <BottomButtonsWrapper>
          <LoadingButton
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={!eachValid || isLoggingIn}
            loading={isLoggingIn}
          >
            Войти
          </LoadingButton>

          <Typography>
            <Link to={routes.signUp}>Зарегистрироваться</Link>
          </Typography>
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
