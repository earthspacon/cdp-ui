import { createEffect } from 'effector';
import { ComponentType, lazy } from 'react';

type Module = () => Promise<{ default: ComponentType }>;

export function createLazyLoadingModule({ module }: { module: Module }) {
  const loadModuleFx = createEffect(async (importedModule: Module) => {
    const module = await importedModule();
    return module;
  });

  const Module = lazy(() => loadModuleFx(module));

  return { Module, loadModuleFx };
}
