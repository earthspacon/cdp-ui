import { createEffect, createEvent, sample } from 'effector';
import { enqueueSnackbar, OptionsObject } from 'notistack';

interface NotifyParams extends OptionsObject {
  message: string;
}

export const notifyError = createEvent<NotifyParams>();
export const notifySuccess = createEvent<NotifyParams>();
export const notifyWarning = createEvent<NotifyParams>();
export const notifyInfo = createEvent<NotifyParams>();

const notifyEvents = {
  error: notifyError,
  success: notifySuccess,
  warning: notifyWarning,
  info: notifyInfo,
};

type NotifyModel = {
  variant: keyof typeof notifyEvents;
};
function createNotifyModel({ variant }: NotifyModel) {
  const notifyFx = createEffect(({ message, ...others }: NotifyParams) => {
    enqueueSnackbar(message, { variant, ...others });
  });
  const notifyEvent = notifyEvents[variant];

  sample({ clock: notifyEvent, target: notifyFx });
}

createNotifyModel({ variant: 'error' });
createNotifyModel({ variant: 'success' });
createNotifyModel({ variant: 'warning' });
createNotifyModel({ variant: 'info' });
