import { App } from 'electron';
import { MPV } from './bootstrap';

export default class Bootstrapper {
  public static init(app: App) {
    MPV.init(app);
  }
}
