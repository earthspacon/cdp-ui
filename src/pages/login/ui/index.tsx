import { Button, TextField } from '@mui/material';

import { styled } from '@/shared/config/stitches.config';
import { Centered } from '@/shared/ui/centered';

// eslint-disable-next-line import/no-default-export
export default function Login() {
  return (
    <Centered>
      <LoginWrapper>
        <InputsWrapper>
          <TextField label="Email" />
          <TextField label="Пароль" />
        </InputsWrapper>

        <BottomButtonsWrapper>
          <Button variant="contained">Войти</Button>
          <Button variant="contained">Зарегистрироваться</Button>
        </BottomButtonsWrapper>
      </LoginWrapper>
    </Centered>
  );
}

const LoginWrapper = styled('div', {
  w: '30%',
  d: 'flex',
  ai: 'center',
  jc: 'center',
  p: '200px',
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
  fd: 'row',
  jc: 'space-between',
});
