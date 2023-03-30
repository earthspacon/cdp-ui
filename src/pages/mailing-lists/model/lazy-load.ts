import { createLazyLoadingModule } from '@/shared/lib/create-lazy-loading-module';

export const { Module: MailingListsPage, loadModuleFx: loadMailingPageFx } =
  createLazyLoadingModule({
    module: () => import('../ui/mailing-page'),
  });
