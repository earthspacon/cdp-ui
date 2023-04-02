/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

import {
  STRIPO_ELEMENTS_IDS,
  STRIPO_PLUGIN_BACKEND_URL,
  STRIPO_PLUGIN_SCRIPT_URL,
} from '@/shared/config/constants';

type typedWindow = Window & { Stripo?: any };

declare const window: typedWindow;

interface InitStripoOptions {
  html: string;
  css: string;
  pluginId: string;
  secretKey: string;
}

export async function initStripo(options: InitStripoOptions) {
  const apiRequestData = {
    emailId: Math.random(), // should be some unique identifier
  };

  const stripoScript = document.createElement('script');
  stripoScript.src = STRIPO_PLUGIN_SCRIPT_URL;
  stripoScript.id = STRIPO_ELEMENTS_IDS.stripoScript;
  stripoScript.type = 'text/javascript';

  stripoScript.onload = function () {
    window?.Stripo?.init({
      settingsId: STRIPO_ELEMENTS_IDS.settingsContainer,
      previewId: STRIPO_ELEMENTS_IDS.previewContainer,
      codeEditorButtonId: STRIPO_ELEMENTS_IDS.codeEditor,
      // undoButtonId: 'undoButton', // only in PRO version
      // redoButtonId: 'redoButton',
      locale: 'ru',
      html: options.html,
      css: options.css,
      apiRequestData: apiRequestData,
      getAuthToken: async (callback: (token: string) => void) => {
        const response = await axios.post<{ token: string }>(
          STRIPO_PLUGIN_BACKEND_URL,
          {
            pluginId: options.pluginId,
            secretKey: options.secretKey,
          },
        );

        callback(response.data.token);
      },
    });
  };

  document.body.appendChild(stripoScript);
}

export async function fetchTemplate() {
  // import as raw text
  const htmlResponse = await import('../empty-template/template.html?raw');
  const cssResponse = await import('../empty-template/template.css?raw');

  return {
    html: htmlResponse.default,
    css: cssResponse.default,
  };
}
