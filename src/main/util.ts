import { App } from 'electron';
import path from 'path';

export const getHTMLPath = (app: App) => {
  return path.join(app.getAppPath(), 'view', 'index.html');
};

export const getExtraResources = (app: App) => {
  return path
    .join(app.getAppPath(), 'extraResources')
    .replace('dist\\main\\', '')
    .replace('app.asar\\', '');
};
