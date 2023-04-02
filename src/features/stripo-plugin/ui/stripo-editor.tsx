import { Button, CircularProgress, Stack } from '@mui/material';
import { styled } from '@stitches/react';
import { useUnit } from 'effector-react';

import { STRIPO_ELEMENTS_IDS } from '@/shared/config/constants';
import { Centered } from '@/shared/ui/centered';
import { LoadingButton } from '@/shared/ui/loading-button';

import { StripoPluginEditorModel } from '../model/model';

interface StripoEditorProps {
  model: StripoPluginEditorModel;
}

export function StripoEditor({ model }: StripoEditorProps) {
  const isEditorViewOpen = useUnit(model.$isEditorViewOpen);

  return (
    <>
      {isEditorViewOpen && (
        <Wrapper>
          <Header>
            <Button id={STRIPO_ELEMENTS_IDS.codeEditor} variant="outlined">
              code
            </Button>

            <SaveCancelActions model={model} />
          </Header>

          <StripoContent>
            <StripoSettings id={STRIPO_ELEMENTS_IDS.settingsContainer}>
              <Centered>
                <CircularProgress />
              </Centered>
            </StripoSettings>

            <StripoPreview id={STRIPO_ELEMENTS_IDS.previewContainer}>
              <Centered>
                <CircularProgress />
              </Centered>
            </StripoPreview>
          </StripoContent>
        </Wrapper>
      )}
    </>
  );
}

function SaveCancelActions({ model }: { model: StripoPluginEditorModel }) {
  const isLoading = useUnit(model.saveEmailContentFx.pending);

  return (
    <Stack direction="row" spacing={2}>
      <LoadingButton
        loading={isLoading}
        variant="contained"
        onClick={() => model.saveClicked()}
      >
        Сохранить
      </LoadingButton>
      <Button variant="outlined" onClick={() => model.closeEditor()}>
        Назад
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => model.resetContent()}
      >
        Сбросить
      </Button>
    </Stack>
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

const StripoContent = styled('div', {
  display: 'flex',
  flexDirection: 'row',
});

const StripoPreview = styled('div', {
  width: '70%',
});

const StripoSettings = styled('div', {
  width: '30%',
});
