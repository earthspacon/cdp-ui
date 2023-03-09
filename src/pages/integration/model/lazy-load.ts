import { createLazyLoadingModule } from '@/shared/lib/create-lazy-loading-module';

export const { Module: IntegrationPage, loadModuleFx: loadIntegrationPageFx } =
  createLazyLoadingModule({
    module: () => import('../ui/integration-page'),
  });
