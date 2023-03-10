import { Button, CircularProgress, Typography } from '@mui/material';
import { Link } from 'atomic-router-react';
import { useForm } from 'effector-forms';
import { useUnit } from 'effector-react';

import { routes } from '@/shared/config/routing';
import { styled } from '@/shared/config/stitches.config';
import { Centered } from '@/shared/ui/centered';
import { FormInput } from '@/shared/ui/form-control/form-input';

import { loginMutation } from '../api';
import { $loginErrors, loginForm } from '../model/model';

// eslint-disable-next-line import/no-default-export
export default function LoginPage() {
  const { fields, submit, eachValid } = useForm(loginForm);
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
          <FormInput field={fields.email} textFieldProps={{ label: 'Email' }} />
          <FormInput
            field={fields.password}
            textFieldProps={{ label: 'Пароль' }}
          />

          {Object.values(loginErrors).some(Boolean) && (
            <Typography sx={{ textAlign: 'center' }} color="error">
              {loginErrors.userNotFound && 'Неправильный email или пароль'}
              {loginErrors.anotherError && 'Произошла ошибка'}
            </Typography>
          )}
        </InputsWrapper>

        <BottomButtonsWrapper>
          <Button
            variant="contained"
            size="large"
            sx={{ width: '100%' }}
            type="submit"
            disabled={!eachValid || isLoggingIn}
            startIcon={
              isLoggingIn ? (
                <CircularProgress sx={{ mr: '10px' }} size={22} />
              ) : null
            }
          >
            Войти
          </Button>

          <Typography>
            <Link to={routes.signUp}>Зарегистрироваться</Link>
          </Typography>
        </BottomButtonsWrapper>
      </LoginWrapper>
    </Centered>
  );
}

const LoginWrapper = styled('form', {
  w: '100%',
  maxW: '400px',
  d: 'flex',
  ai: 'center',
  jc: 'center',
  fd: 'column',
  gap: '40px',
});

const InputsWrapper = styled('div', {
  w: '100%',
  d: 'flex',
  gap: '20px',
  fd: 'column',
});

const BottomButtonsWrapper = styled('div', {
  w: '100%',
  d: 'flex',
  fd: 'column',
  gap: '20px',
  ai: 'center',
  jc: 'center',
});
