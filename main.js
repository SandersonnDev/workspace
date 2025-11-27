const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
const { shell } = require('electron')
const path = require('path')
const fs = require('fs')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  win.loadFile('index.html')
}

// IPC pour sélectionner un fichier
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Tous les fichiers', extensions: ['*'] }
    ]
  })
  
  if (result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

// IPC pour sélectionner un dossier ou un fichier
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory'],
    filters: [
      { name: 'Tous les fichiers', extensions: ['*'] },
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'] },
      { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt', 'xlsx', 'pptx'] }
    ]
  })
  
  if (result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

// IPC pour ouvrir un fichier ou dossier
ipcMain.handle('open-path', async (event, filePath) => {
  console.log('open-path handler called with:', filePath)
  try {
    const result = await shell.openPath(filePath)
    console.log('shell.openPath result:', result)
    return true
  } catch (error) {
    console.error('Erreur lors de l\'ouverture:', error)
    return false
  }
})

console.log('All IPC handlers registered')

// IPC pour récupérer l'icône d'un fichier
ipcMain.handle('get-file-icon', async (event, filePath) => {
  try {
    // Sur Linux/Windows, on retourne le chemin du fichier lui-même
    // Electron affichera l'icône système associée au type de fichier
    if (fs.existsSync(filePath)) {
      return filePath
    }
    return null
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'icône:', error)
    return null
  }
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})