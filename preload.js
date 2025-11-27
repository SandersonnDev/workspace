const { contextBridge, ipcRenderer } = require('electron')

console.log('Preload.js is loading...')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getFileIcon: (filePath) => ipcRenderer.invoke('get-file-icon', filePath),
  openPath: (filePath) => ipcRenderer.invoke('open-path', filePath)
})

console.log('electronAPI exposed to window')
