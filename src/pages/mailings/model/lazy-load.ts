import { createLazyLoadingModule } from '@/shared/lib/create-lazy-loading-module';

export const { Module: MailingsPage, loadModuleFx: loadMailingsPageFx } =
  createLazyLoadingModule({
    module: () => import('../ui/mailings-page'),
  });
