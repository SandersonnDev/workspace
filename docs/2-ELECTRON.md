# 2️⃣ Electron - Application Desktop

## 📌 Qu'est-ce qu'Electron ?

Electron = **Application Desktop** en JavaScript

```
Code Web (HTML/CSS/JS)
    ↓
Electron
    ↓
Application Desktop (.exe / .dmg / .AppImage)
```

---

## ⚡ Installation (5 min)

### Prérequis

- Node.js 16+ ([Télécharger](https://nodejs.org/))
- npm (inclus avec Node.js)

### Commandes

```bash
# 1. Dans votre projet
cd /home/goupil/Développement/workspace

# 2. Initialiser npm (si pas déjà fait)
npm init -y

# 3. Installer Electron
npm install --save-dev electron electron-builder

# 4. Vérifier
npm list electron
```

---

## 🚀 Configuration (10 min)

### 1. Créer main.js (Processus Principal)

```javascript
// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
```

### 2. Créer preload.js (Sécurité)

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, (event, args) => callback(args))
});
```

### 3. Mettre à Jour package.json

```json
{
  "name": "app-dynamique",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux"
  },
  "devDependencies": {
    "electron": "latest",
    "electron-builder": "latest"
  },
  "build": {
    "appId": "com.example.app",
    "productName": "Mon App",
    "files": [
      "main.js",
      "preload.js",
      "index.html",
      "app.js",
      "public/**/*",
      "style.css"
    ],
    "win": {
      "target": ["portable", "nsis"]
    },
    "mac": {
      "target": ["dmg"]
    },
    "linux": {
      "target": ["AppImage"]
    }
  }
}
```

---

## 🎯 Démarrer l'Application

```bash
# Développement
npm start

# Vous devriez voir :
# 1. Fenêtre Electron s'ouvre
# 2. Votre index.html s'affiche
# 3. DevTools s'ouvre automatiquement
```

---

## 📦 Compiler pour Distribution

### Windows (.exe)

```bash
npm run build:win
```

Fichier : `dist/Mon App-1.0.0.exe`

### macOS (.dmg)

```bash
npm run build:mac
```

Fichier : `dist/Mon App-1.0.0.dmg`

### Linux (.AppImage)

```bash
npm run build:linux
```

Fichier : `dist/Mon App-1.0.0.AppImage`

---

## 📁 Structure Finale

```
workspace/
├── main.js                    ← Electron (processus principal)
├── preload.js                ← Sécurité
├── app.js                    ← Logique application (IDENTIQUE à la version web)
├── index.html                ← Page principale (IDENTIQUE à la version web)
├── style.css                 ← Styles (IDENTIQUE à la version web)
├── package.json              ← Configuration
├── public/
│   ├── pages/
│   │   ├── home.html         ← (IDENTIQUE)
│   │   ├── agenda.html       ← (IDENTIQUE)
│   │   └── dossier.html      ← (IDENTIQUE)
│   ├── components/
│   │   ├── header.html       ← (IDENTIQUE)
│   │   └── footer.html       ← (IDENTIQUE)
│   └── assets/
│       └── css/
│           └── global.css    ← (IDENTIQUE)
├── dist/                     ← (Généré après npm run build)
│   ├── Mon App-1.0.0.exe
│   ├── Mon App-1.0.0.dmg
│   └── Mon App-1.0.0.AppImage
└── docs/                     ← Documentation
```

**⚠️ IMPORTANT** : Les fichiers `app.js`, `index.html`, `public/` restent **exactement identiques** entre web et Electron !

---

## 🔄 Workflow Complet

### Phase 1 : Développement Web

```bash
# Tester localement (sans Electron)
python -m http.server 8000

# Ouvrir http://localhost:8000
```

### Phase 2 : Tester avec Electron

```bash
# Installer Electron
npm install --save-dev electron

# Lancer
npm start

# Si erreur, vérifier DevTools (Ctrl+Shift+I)
```

### Phase 3 : Compiler pour Distribution

```bash
# Générer les exécutables
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:linux # Linux

# Les fichiers sont dans dist/
```

---

## 🐛 Dépannage

### "App threw an error during load"

**Solution :**
```bash
npm install
npm start
```

### "Cannot find module 'electron'"

**Solution :**
```bash
npm install --save-dev electron
```

### L'app démarre mais ne s'affiche rien

**Vérifier :**
- Que `index.html` existe
- Les chemins sont relatifs (pas absolus)
- DevTools pour voir les erreurs (F12)

### Les pages ne chargent pas

**Vérifier :**
- Que `public/pages/home.html` existe
- Que `app.js` utilise les bons chemins relatifs
- Ouvrir DevTools et consulter la console

---

## 💡 Commandes Utiles

```bash
# Installation
npm install --save-dev electron electron-builder

# Développement
npm start                 # Lance l'app
npm start -- --help       # Voir les options

# Compilation
npm run build             # Tous les formats
npm run build:win         # Windows seulement
npm run build:mac         # macOS seulement
npm run build:linux       # Linux seulement

# Nettoyage
rm -rf dist node_modules
npm install
npm start
```

---

## 📊 Comparaison Web vs Electron

| Aspect | Web | Electron |
|--------|-----|----------|
| **Déploiement** | URL | Exécutable |
| **Installation** | Aucune | Clic sur l'exe |
| **Offline** | Non | Oui |
| **Taille** | < 1 MB | ~150 MB |
| **Accès Fichiers** | Non | Oui |
| **Performance** | Dépend du serveur | Local (rapide) |

---

## 🎁 Cas d'Usage

✅ Application de bureau  
✅ CRM, Comptabilité, etc.  
✅ Éditeur de texte  
✅ Chat/Messenger  
✅ Lecteur multimédia  
✅ Suite bureautique  

---

## 📚 Ressources

- **Electron Docs** : https://www.electronjs.org/docs
- **Electron Builder** : https://www.electron.build/
- **Node.js** : https://nodejs.org/

---

## ✅ Checklist

- [ ] Node.js installé
- [ ] `npm install` exécuté
- [ ] `main.js` créé
- [ ] `preload.js` créé
- [ ] `package.json` mis à jour
- [ ] `npm start` fonctionne
- [ ] `npm run build` fonctionne

---

## 🚀 Résumé Commandes

```bash
# Installation complète
npm install --save-dev electron electron-builder

# Développement
npm start

# Compilation
npm run build:win
npm run build:mac
npm run build:linux
```

**C'est tout ! Votre app web devient une app desktop ! 🖥️**
