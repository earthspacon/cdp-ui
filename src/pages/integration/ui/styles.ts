import { gridClasses } from '@mui/x-data-grid';
import { styled } from '@stitches/react';

export const dataGridStyles = {
  [`& .${gridClasses.cell}`]: {
    py: 2,
  },
};

export const Wrapper = styled('div', {
  maxWidth: '80%',
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
});

export const TablePart = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
});

export const UploadWrapper = styled('div', {
  display: 'flex',

  label: {
    padding: '8px 25px',
  },
});

export const ApiTokenPart = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
});

export const ApiTokenBody = styled('div', {
  width: '80%',
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
  alignItems: 'center',
  justifyContent: 'center',
});

export const ApiTokenButtons = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '25px',
});
