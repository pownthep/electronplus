import path from 'path';
import pm2 from '@elife/pm2';
import ipc from 'node-ipc';

interface IBackgroundProcess {
  name: string;
  start: () => void;
  file: string;
  args: string[];
}

export default class BackgroundProcess implements IBackgroundProcess {
  constructor(public name, public file, public args) {
    this.name = name;
    this.file = file;
    this.args = args;
  }

  start() {
    pm2.start({
      script: path.join(__dirname, 'background', this.file),
      args: [this.name, ...this.args],
      name: this.name
    }, (err, pid) => {
      const bgProcessId = `${this.name}-background`;
      ipc.config.id = `${this.name}-main`;
      ipc.config.retry = 2000;
      ipc.connectTo(bgProcessId);
    });
  }

  on(channel: string, cb: (data: any) => any) {
    ipc.of[`${this.name}-background`].on(channel, cb);
  }

  emit(type: string, data) {
    ipc.of[`${this.name}-background`].emit(type, data);
  }

  stop() {
    pm2.stop(this.name);
  }
}
