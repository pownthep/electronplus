import { ipcRenderer, contextBridge, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  minimizeWindow: () => ipcRenderer.invoke('minimizeWindow'),
  toggleMaximize: (maximize: boolean | null = null) =>
    ipcRenderer.invoke('toggleMaximize'),
  togglePip: (flag: boolean) => ipcRenderer.invoke('togglePip', flag),
  fileExist: (filePath: string) => ipcRenderer.invoke('fileExist', filePath),
  setAspectRatio: (ratio: number) =>
    ipcRenderer.invoke('setAspectRatio', ratio),
  unmaximize: () => ipcRenderer.invoke('unmaximize'),
  startIPCServer: () => ipcRenderer.invoke('startIPCServer'),
  mpv: (args: string) => ipcRenderer.invoke('mpv', args),
  ipcOn: (
    channel: string,
    callback: (event: IpcRendererEvent, args: any[]) => void
  ) => ipcRenderer.on(channel, (event, ...args) => callback(event, args)),
  showWindow: () => ipcRenderer.invoke('showWindow')
});
