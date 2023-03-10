import { createEffect } from 'effector';
import { ComponentType, lazy } from 'react';

type Module<Props> = () => Promise<{ default: ComponentType<Props> }>;

export function createLazyLoadingModule<ComponentProps>({
  module,
}: {
  module: Module<ComponentProps>;
}) {
  const loadModuleFx = createEffect(
    async (importedModule: Module<ComponentProps>) => {
      const module = await importedModule();
      return module;
    },
  );

  const Module = lazy(() => loadModuleFx(module));

  return { Module, loadModuleFx };
}
