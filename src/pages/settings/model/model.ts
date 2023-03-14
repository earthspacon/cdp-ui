import { createStore, sample } from 'effector';

import { routes } from '@/shared/config/routing';

import { StatusMappings, statusMappingsQuery } from '../api';
import { loadSettingsPageFx } from './lazy-load';

export const $statusMappings = createStore<StatusMappings['mappings']>([]);

sample({
  clock: [loadSettingsPageFx.done, routes.settings.opened],
  fn() {
    return;
  },
  target: statusMappingsQuery.start,
});

sample({
  clock: statusMappingsQuery.finished.success,
  fn({ result: mappings }) {
    return mappings.mappings;
  },
  target: $statusMappings,
});
