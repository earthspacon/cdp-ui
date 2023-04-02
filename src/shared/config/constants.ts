export const API_URL = import.meta.env.VITE_API_URL;
export const STRIPO_PLUGIN_ID = import.meta.env.VITE_PLUGIN_ID;
export const STRIPO_SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const STRIPO_ELEMENTS_IDS = {
  settingsContainer: 'stripo-settings-container',
  previewContainer: 'stripo-preview-container',
  codeEditor: 'stripo-code-editor',
  stripoScript: 'stripo-script',
};

export const STRIPO_PLUGIN_SCRIPT_URL =
  'https://plugins.stripo.email/static/latest/stripo.js';
export const STRIPO_PLUGIN_BACKEND_URL =
  'https://plugins.stripo.email/api/v1/auth';
