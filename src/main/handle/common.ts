import { IpcMain } from 'electron';
import AspectRatioBrowserWindow from 'electron-aspect-ratio-browser-window';
import { access } from 'fs';
import { promisify } from 'util';

export const enum COMMON {
  MINIMIZE = `minimizeWindow`,
  TOGGLE_MAXIMIZE = 'toggleMaximize',
  UNMAXIMIZE = 'unmaximize',
  TOGGLE_PIP = 'togglePip',
  FILE_EXIST = 'fileExist',
  SET_AR = 'setAspectRatio',
  SHOW_WINDOW = 'showWindow',
  GET_IMAGE = 'getImage'
}

export default class CommonHandler {
  public static init(
    { handle }: IpcMain,
    mainWindow: AspectRatioBrowserWindow
  ) {
    handle(COMMON.MINIMIZE, () => mainWindow?.minimize());
    handle(COMMON.UNMAXIMIZE, () => mainWindow?.unmaximize());
    handle(COMMON.SET_AR, (_, ratio) => mainWindow?.setAspectRatio(ratio));
    handle(COMMON.SHOW_WINDOW, () => mainWindow?.show());
    handle(COMMON.TOGGLE_PIP, (_, isPip) =>
      mainWindow?.setAlwaysOnTop(isPip, 'screen-saver')
    );
    handle(COMMON.TOGGLE_MAXIMIZE, () => {
      mainWindow?.isMaximized()
        ? mainWindow.unmaximize()
        : mainWindow.maximize();
      return mainWindow.isMaximized();
    });
    handle(COMMON.FILE_EXIST, async (_, path) => {
      try {
        await promisify(access)(path);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
