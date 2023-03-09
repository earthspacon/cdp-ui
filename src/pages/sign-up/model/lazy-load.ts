import { createLazyLoadingModule } from '@/shared/lib/create-lazy-loading-module';

export const { Module: SignUpPage, loadModuleFx: loadSignUpPageFx } =
  createLazyLoadingModule({
    module: () => import('../ui/signup-page'),
  });
