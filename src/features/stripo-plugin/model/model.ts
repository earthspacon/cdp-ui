/* eslint-disable @typescript-eslint/no-explicit-any */
import { createEffect, createEvent, createStore, sample } from 'effector';

import {
  STRIPO_ELEMENTS_IDS,
  STRIPO_PLUGIN_ID,
  STRIPO_SECRET_KEY,
} from '@/shared/config/constants';

import { fetchTemplate, initStripo } from './init-stripo';

// stripo js api https://stripo.email/ru/plugin-api/#stripo-plugin-js-api
type typedWindow = Window & { StripoApi: any; Stripo: any };

declare const window: typedWindow;

export function createStripoPluginEditorModel() {
  const $isEditorViewOpen = createStore(false);
  const $isInitialized = createStore(false);
  const $emailContentHtml = createStore('');

  const initStripoPlugin = createEvent();
  const closeEditor = createEvent();
  const saveClicked = createEvent();
  const contentSaved = createEvent<string>();
  const resetContent = createEvent();

  const initStripoPluginFx = createEffect(async () => {
    const template = await fetchTemplate();

    await initStripo({
      html: template.html,
      css: template.css,
      pluginId: STRIPO_PLUGIN_ID,
      secretKey: STRIPO_SECRET_KEY,
    });
  });

  const saveEmailContentFx = createEffect(async () => {
    return new Promise<string>((resolve, reject) => {
      window.StripoApi.compileEmail((error: string | null, html: string) => {
        resolve(html);
        if (error !== null) {
          reject(error);
        }
      });
    });
  });

  const resetStripoFx = createEffect(() => {
    const stripoScript = document.getElementById(
      STRIPO_ELEMENTS_IDS.stripoScript,
    );
    if (stripoScript) {
      stripoScript.remove();
    }
  });

  sample({
    clock: initStripoPlugin,
    target: initStripoPluginFx,
  });

  $isEditorViewOpen.on(initStripoPlugin, () => true);

  $isInitialized.on(initStripoPluginFx.done, () => true);

  sample({
    clock: saveClicked,
    target: saveEmailContentFx,
  });

  sample({
    clock: saveEmailContentFx.doneData,
    target: [contentSaved, $emailContentHtml] as const,
  });

  sample({
    clock: resetContent,
    target: [
      $emailContentHtml.reinit!,
      $isInitialized.reinit!,
      $isEditorViewOpen.reinit!,
      closeEditor,
      resetStripoFx,
    ] as const,
  });

  return {
    initStripoPlugin,
    $isInitialized,
    $isEditorViewOpen,
    closeEditor,
    saveEmailContentFx,
    saveClicked,
    contentSaved,
    $emailContentHtml,
    resetContent,
  };
}

export type StripoPluginEditorModel = ReturnType<
  typeof createStripoPluginEditorModel
>;
