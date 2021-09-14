import { IpcMain } from 'electron';
import AspectRatioBrowserWindow from 'electron-aspect-ratio-browser-window';
import { CommonHandler, MPVHandler } from './handle';

export default class Handlers {
  public static init(ipcMain: IpcMain, mainWindow: AspectRatioBrowserWindow) {
    CommonHandler.init(ipcMain, mainWindow);
    MPVHandler.init(ipcMain, mainWindow);
  }
}
