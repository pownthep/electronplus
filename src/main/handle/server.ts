import { IpcMain } from 'electron';
import AspectRatioBrowserWindow from 'electron-aspect-ratio-browser-window';
import getPort from 'get-port';
import BackgroundProcess from '../lib/background-process';
import path from 'path';
import pm2 from '@elife/pm2';

export default class Server {
  private static _instance: BackgroundProcess;
  private static port: number;

  public static async init({ handle }: IpcMain, _: AspectRatioBrowserWindow) {
    Server.port = await getPort({ port: [8000, 8001, 8002, 8003] });
    pm2.start(
      {
        script: path.join(__dirname, 'background', 'server.js'),
        args: [Server.port],
        name: this.name
      },
      (err, pid) => {
        handle('serverPort', () => Server.port);
      }
    );
  }
}
