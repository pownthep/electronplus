import { IpcMain, WebContents } from 'electron';
import AspectRatioBrowserWindow from 'electron-aspect-ratio-browser-window';
import BackgroundProcess from '../lib/background-process';

export const enum TORRENT {
  ADD = 'add_torrent',
  STREAM = 'stream_torrent'
}

export default class Torrent {
  private static client: BackgroundProcess | null = null;

  public static startClient() {
    Torrent.client = new BackgroundProcess('torrent', 'torrent.js', []);
    Torrent.client.start();
  }

  public static init(
    { on, handle }: IpcMain,
    { webContents }: AspectRatioBrowserWindow
  ) {
    Torrent.startClient();
    handle(TORRENT.ADD, (_, torrentId) => {
      return new Promise((resolve) => {
        if (!Torrent.client) Torrent.startClient();
        Torrent.client.on(TORRENT.ADD, (data: any) => {
          resolve(JSON.parse(data));
        });
        Torrent.client.emit(TORRENT.ADD, torrentId);
      });
    });

    handle(TORRENT.STREAM, (_, torrentId) => {
      return new Promise((resolve) => {
        if (!Torrent.client) Torrent.startClient();
        Torrent.client.on(TORRENT.STREAM, (data: any) => {
          resolve(JSON.parse(data));
        });
        Torrent.client.emit(TORRENT.STREAM, torrentId);
      });
    });
  }
}
