import { IpcMain } from 'electron';
import AspectRatioBrowserWindow from 'electron-aspect-ratio-browser-window';
import net from 'net';
import xpipe from 'xpipe';

export default class MPVHandler {
  private static _client: net.Socket | null = null;

  public static init(ipcMain: IpcMain, mainWindow: AspectRatioBrowserWindow) {
    ipcMain.handle('startIPCServer', async (event, ...args) => {
      try {
        MPVHandler._client = net.connect(xpipe.eq('/mpvsocket'), () => {
          console.log('Connected to mpv');
        });
        MPVHandler._client.on('data', (res) => {
          if (mainWindow) {
            const data: string = `[${res
              .toString('utf8')
              .trim()
              .replace(/(\r\n|\n|\r)/g, ',')}]`;
            mainWindow.webContents.send('mpvResponse', data);
          }
        });
        return true;
      } catch (error) {
        return false;
      }
    });
    ipcMain.handle('mpv', (event, ...args) => {
      if (MPVHandler._client) {
        MPVHandler._client.write(Buffer.from(args[0] + '\n'));
      }
    });
  }
}
