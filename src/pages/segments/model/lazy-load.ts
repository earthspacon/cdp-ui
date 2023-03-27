import { createLazyLoadingModule } from '@/shared/lib/create-lazy-loading-module';

export const { Module: SegmentsPage, loadModuleFx: loadSegmentsPageFx } =
  createLazyLoadingModule({
    module: () => import('../ui/segments-page'),
  });
