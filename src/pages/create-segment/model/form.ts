import { createForm } from 'effector-forms';

export const segmentCreationForm = createForm({
  fields: {
    segmentName: {
      init: '',
    },
    segmentCode: {
      init: '',
    },
  },
});
