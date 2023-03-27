import { createLazyLoadingModule } from '@/shared/lib/create-lazy-loading-module';

export const {
  Module: CreateSegmentPage,
  loadModuleFx: loadCreateSegmentPageFx,
} = createLazyLoadingModule({
  module: () => import('../ui/create-segment-page'),
});
