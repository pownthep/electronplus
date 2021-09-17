import { app, ipcMain } from 'electron';
import AspectRatioBrowserWindow from 'electron-aspect-ratio-browser-window';
import { is } from 'electron-util';
import path from 'path';
import Bootstrapper from './bootstrapper';
import Handlers from './handlers';
import { getHTMLPath } from './util';

Bootstrapper.init(app);

const isDev = is.development;

const DEV_URL = 'http://localhost:3000';

let mainWindow: AspectRatioBrowserWindow | null = null;

async function createMainWindow() {
  mainWindow = new AspectRatioBrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      devTools: isDev,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), 'preload.js'),
      plugins: true,
      sandbox: true,
      webSecurity: !isDev,
      nativeWindowOpen: false
    }
  });
  // require('./background/server.js');
  Handlers.init(ipcMain, mainWindow);

  mainWindow.setAspectRatio(16 / 9);

  mainWindow.loadURL(getUrl()); // load any url you want to use with electron

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function getUrl() {
  return isDev ? DEV_URL : getHTMLPath(app);
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (!is.macos) {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null && app.isReady()) {
    createMainWindow();
  }
});
