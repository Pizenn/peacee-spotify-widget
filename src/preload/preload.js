const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onUpdateTrack: (callback) => ipcRenderer.on('update-track', (event, data) => callback(data))
});