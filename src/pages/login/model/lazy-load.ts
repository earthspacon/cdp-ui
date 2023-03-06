import { createLazyLoadingModule } from '@/shared/lib/create-lazy-loading-module';

export const { Module: LoginPage, loadModuleFx: loadLoginPageFx } =
  createLazyLoadingModule({
    module: () => import('../ui'),
  });
