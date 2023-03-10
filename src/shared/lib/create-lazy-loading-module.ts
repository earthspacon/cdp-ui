import { createEffect } from 'effector';
import { ComponentType, lazy } from 'react';

type Module<Props> = Promise<{ default: ComponentType<Props> }>;

export function createLazyLoadingModule<ComponentProps>({
  module,
}: {
  module: () => Module<ComponentProps>;
}) {
  const loadModuleFx = createEffect(
    (importedModule: Module<ComponentProps>) => {
      return importedModule;
    },
  );

  const Module = lazy(() => loadModuleFx(module()));

  return { Module, loadModuleFx };
}
