import { ipcRenderer, contextBridge } from 'electron';

const { invoke, on } = ipcRenderer;

contextBridge.exposeInMainWorld('electron', {
  minimizeWindow: () => invoke('minimize'),
  toggleMaximize: () => invoke('toggleMaximize'),
  togglePip: (flag: boolean) => invoke('togglePip', flag),
  fileExist: (filePath: string) => invoke('fileExist', filePath),
  setAspectRatio: (ratio: number) => invoke('setAspectRatio', ratio),
  unmaximize: () => invoke('unmaximize'),
  showWindow: () => invoke('showWindow'),
  mpvServer: () => invoke('startServer'),
  mpvRequest: (payload: string) => invoke('mpvRequest', payload),
  startTorrent: (torrentId: any) => invoke('startTorrent', torrentId),
  closeTorrent: (torrentId: any) => invoke('closeTorrent', torrentId),
  ipcOn: on,
  addTorrent: (torrentId: string) => invoke('add_torrent', torrentId),
  streamTorrent: (torrentId: string) => invoke('stream_torrent', torrentId),
  getImage: (url: string) => invoke('getImage', url),
  serverPort: () => invoke('serverPort')
});
