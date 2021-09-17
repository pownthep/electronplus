import { IpcMain } from 'electron';
import AspectRatioBrowserWindow from 'electron-aspect-ratio-browser-window';
import net from 'net';
import xpipe from 'xpipe';
import { ERROR, SUCCESS } from './util';

export const enum MPV {
  START_SERVER = 'startServer',
  REQUEST = 'mpvRequest',
  RESPONSE = 'mpvResponse'
}

export default class MPVHandler {
  private static _client: net.Socket | null = null;

  public static init(
    { handle }: IpcMain,
    { webContents }: AspectRatioBrowserWindow
  ) {
    handle(MPV.START_SERVER, () => {
      try {
        MPVHandler._client = net.connect(xpipe.eq('/mpvsocket'));
        MPVHandler._client.on('data', (buffer) => {
          webContents?.send(MPV.RESPONSE, formatData(buffer));
        });
        return SUCCESS;
      } catch (error) {
        return ERROR;
      }
    });
    handle(MPV.REQUEST, (_, payload) => {
      MPVHandler._client?.write(Buffer.from(payload + '\n'));
    });
  }
}

const formatData = (buffer: Buffer): string => {
  return `[${buffer
    .toString('utf8')
    .trim()
    .replace(/(\r\n|\n|\r)/g, ',')}]`;
};
