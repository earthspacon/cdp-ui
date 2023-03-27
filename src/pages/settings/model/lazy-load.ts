import { createLazyLoadingModule } from '@/shared/lib/create-lazy-loading-module';

export const { Module: SettingsPage, loadModuleFx: loadSettingsPageFx } =
  createLazyLoadingModule({
    module: () => import('../ui/settings-page'),
  });
