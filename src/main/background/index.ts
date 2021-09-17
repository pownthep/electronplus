import { ERROR, SUCCESS } from '../handle/util';
import ipc from 'node-ipc';

interface IBackgroundTask {
  run: (on: any) => void;
  emit: {
    msg: (socket, msg: any, channel?: string) => void;
    err: (socket, msg: any, channel?: string) => void;
  };
}

export default class BackgroundTask implements IBackgroundTask {
  public run: (on: any) => void = () => {};

  constructor() {}

  setup() {
    ipc.config.id = `${process.argv[2]}-background`;
    ipc.config.retry = 1500;
    ipc.serve();
    ipc.server.start();
  }

  on(channel: string, cb: (data: any, socket: any) => void) {
    ipc.server.on(channel, cb);
  }

  public emit = {
    msg: this.resolve,
    err: this.reject
  };

  private resolve(socket: any, msg: any, channel: string = 'message') {
    ipc.server.emit(socket, 
      channel,
      JSON.stringify({
        ...SUCCESS,
        data: msg
      })
    );
  }

  private reject(socket: any, err: any, channel: string = 'message') {
    ipc.server.emit(socket, channel, JSON.stringify({ ...ERROR, err: err }));
  }
}
