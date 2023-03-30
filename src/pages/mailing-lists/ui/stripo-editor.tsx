import { Button, CircularProgress } from '@mui/material';
import { styled } from '@stitches/react';

import { STRIPO_ELEMENTS_IDS } from '@/shared/config/constants';
import { Centered } from '@/shared/ui/centered';

export function StripoEditor() {
  return (
    <Wrapper>
      <Header>
        <Button id={STRIPO_ELEMENTS_IDS.codeEditor}>code</Button>

        <CancelSaveActions>
          <Button>Cancel</Button>
          <Button>Save</Button>
        </CancelSaveActions>
      </Header>

      <StripoContent>
        <div id={STRIPO_ELEMENTS_IDS.settingsContainer}>
          <Centered>
            <CircularProgress />
          </Centered>
        </div>
        <div id={STRIPO_ELEMENTS_IDS.previewContainer} />
      </StripoContent>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  padding: '30px',
});

const Header = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '30px',
});

const CancelSaveActions = styled('div', {
  display: 'flex',
  gap: '10px',
});

const StripoContent = styled('div', {
  display: 'flex',
});
