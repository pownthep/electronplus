import { IpcMain } from 'electron';
import AspectRatioBrowserWindow from 'electron-aspect-ratio-browser-window';
import { access } from 'fs';
import { promisify } from 'util';

export default class CommonHandler {
  public static init(ipcMain: IpcMain, mainWindow: AspectRatioBrowserWindow) {
    ipcMain.handle('minimizeWindow', (event, ...args) => {
      if (mainWindow) mainWindow.minimize();
      return true;
    });
    ipcMain.handle('toggleMaximize', (event, ...args) => {
      if (mainWindow) {
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize();
          return false;
        }
        mainWindow.maximize();
        return true;
      }
    });
    ipcMain.handle('unmaximize', (event, ...args) => {
      if (mainWindow) {
        mainWindow.unmaximize();
      }
    });
    ipcMain.handle('togglePip', (event, ...args) => {
      if (mainWindow) {
        mainWindow.setAlwaysOnTop(args[0], 'screen-saver');
      }
    });
    ipcMain.handle('fileExist', async (event, ...args) => {
      try {
        await promisify(access)(args[0]);
        return true;
      } catch (error) {
        return false;
      }
    });
    ipcMain.handle('setAspectRatio', async (event, ...args) => {
      if (mainWindow) {
        mainWindow.setAspectRatio(args[0]);
      }
    });
    ipcMain.handle('showWindow', (event, ...args) => {
      if (mainWindow) {
        mainWindow.show();
      }
    });
  }
}
