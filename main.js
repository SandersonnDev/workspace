console.log('lancement de workspace 1.0')

const { app, BrowserWindow, screen } = require('electron')

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const win = new BrowserWindow({
    width,
    height
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
