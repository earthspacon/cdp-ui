import { Button, TextField, Typography } from '@mui/material';
import { Link } from 'atomic-router-react';
import { useForm } from 'effector-forms';

import { routes } from '@/shared/config/routing';
import { styled } from '@/shared/config/stitches.config';
import { Centered } from '@/shared/ui/centered';

import { loginForm } from '../model';

// eslint-disable-next-line import/no-default-export
export default function Login() {
  const { fields, submit, eachValid } = useForm(loginForm);

  return (
    <Centered>
      <LoginWrapper onSubmit={() => submit()}>
        <InputsWrapper>
          <TextField
            label="Email"
            value={fields.email.value}
            onChange={(evt) => fields.email.onChange(evt.target.value)}
            error={fields.email.hasError()}
            helperText={fields.email.errorText()}
          />
          <TextField
            label="Пароль"
            value={fields.password.value}
            onChange={(evt) => fields.password.onChange(evt.target.value)}
            error={fields.password.hasError()}
            helperText={fields.password.errorText()}
          />
        </InputsWrapper>

        <BottomButtonsWrapper>
          <Button variant="contained" sx={{ width: '100%' }} type="submit">
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
