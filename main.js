// Importer les modules Electron
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

/**
 * Créer la fenêtre principale
 */
function createWindow() {
    console.log('🪟 Création de la fenêtre');
    
    // Créer une fenêtre
    mainWindow = new BrowserWindow({
        width: 1200,           // Largeur
        height: 800,           // Hauteur
        webPreferences: {
            // Sécurité
            nodeIntegration: false,      // N'expose pas Node.js
            contextIsolation: true,      // Isoler le contexte
            preload: path.join(__dirname, 'preload.js')  // Charger preload.js
        }
    });

    // Charger la page HTML
    mainWindow.loadFile('index.html');

    // // Ouvrir les DevTools (à enlever en production)
    // mainWindow.webContents.openDevTools();

    // console.log('✅ Fenêtre créée');

    // // Gérer la fermeture
    // mainWindow.on('closed', () => {
    //     mainWindow = null;
    //     console.log('❌ Fenêtre fermée');
    // });
}

/**
 * Événement : App prête
 * → Créer la fenêtre
 */
app.on('ready', createWindow);

/**
 * Événement : Toutes les fenêtres fermées
 * → Quitter l'app (Windows/Linux)
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {  // darwin = macOS
        app.quit();
    }
});

/**
 * Événement : App réactivée (macOS uniquement)
 * → Recréer la fenêtre
 */
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

console.log('🚀 Electron démarré');