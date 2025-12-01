# 1️⃣ Intégration Dynamique - Charger HTML Dynamiquement

## 📌 Concept

Une seule `index.html` qui charge d'autres pages **sans rechargement**.

```
Utilisateur clique sur "Accueil"
    ↓
JavaScript récupère "pages/home.html"
    ↓
Le contenu s'affiche dans la page
    ↓
Pas de rechargement = Rapide et fluide
```

---

## 🚀 Quick Start (10 min)

### 1. Structure des Fichiers

```
workspace/
├── index.html              ← Page unique
├── app.js                  ← Logique JavaScript
├── style.css               ← Styles
└── public/
    ├── pages/
    │   ├── home.html
    │   ├── agenda.html
    │   └── dossier.html
    ├── components/
    │   ├── header.html
    │   └── footer.html
    └── assets/
        └── css/
            └── global.css
```

### 2. Code Minimal (app.js)

```javascript
// Charger une page
async function loadPage(pageName) {
    try {
        const response = await fetch(`./public/pages/${pageName}.html`);
        if (!response.ok) throw new Error('Page not found');
        
        const html = await response.text();
        document.getElementById('content').innerHTML = html;
        updateLayout(pageName);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Afficher/masquer header/footer
function updateLayout(pageName) {
    const fullPageLayout = ['login', 'signup'];
    const hideUI = fullPageLayout.includes(pageName);
    
    document.getElementById('header').style.display = hideUI ? 'none' : 'block';
    document.getElementById('footer').style.display = hideUI ? 'none' : 'block';
}

// Au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadPage('home');
    
    // Écouter les clics
    document.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            loadPage(btn.dataset.page);
        });
    });
});
```

### 3. HTML (index.html)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Application</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <header id="header">
        <nav>
            <button data-page="home">Accueil</button>
            <button data-page="agenda">Agenda</button>
            <button data-page="dossier">Dossier</button>
        </nav>
    </header>

    <main id="content"></main>

    <footer id="footer">
        <p>&copy; 2025</p>
    </footer>

    <script src="./app.js"></script>
</body>
</html>
```

### 4. Une Page (public/pages/home.html)

```html
<h1>Accueil</h1>
<p>Bienvenue</p>
```

### 5. Tester Localement

```bash
# Option 1 : Avec Python
python -m http.server 8000

# Option 2 : Avec Node.js
npx http-server

# Puis ouvrir : http://localhost:8000
```

---

## 🔧 Adapter à Electron

### Seule Différence : main.js

Créer `main.js` (processus Electron) :

```javascript
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

### Créer preload.js (optionnel)

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, (event, args) => callback(args))
});
```

### Modifier package.json

```json
{
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  },
  "devDependencies": {
    "electron": "latest",
    "electron-builder": "latest"
  }
}
```

### C'est Tout !

Votre `index.html`, `app.js`, dossier `public/` restent **exactement identiques**.

---

## 💡 Explications

### Fetch API

```javascript
// Récupérer un fichier HTML
const response = await fetch('./public/pages/home.html');
const html = await response.text();  // Récupérer le texte

// Insérer dans la page
document.getElementById('content').innerHTML = html;
```

### data-page Attribute

```html
<!-- Dans index.html -->
<button data-page="home">Accueil</button>

<!-- En JavaScript -->
btn.dataset.page  // Accède à "home"
```

### Affichage Conditionnel

```javascript
// Masquer header/footer pour certaines pages
if (pageName === 'login') {
    document.getElementById('header').style.display = 'none';
}
```

---

## ⚡ Commandes Complètes

### Web

```bash
# Tester localement
python -m http.server 8000
# Puis ouvrir http://localhost:8000
```

### Electron

```bash
# Installation
npm install --save-dev electron electron-builder

# Développement
npm start

# Compiler
npm run build
```

---

## 🎯 Résumé

| Étape | Fichier | Contenu |
|-------|---------|---------|
| 1 | `index.html` | Structure page + boutons |
| 2 | `app.js` | Logique chargement pages |
| 3 | `public/pages/` | Les pages à charger |
| 4 | `style.css` | Styles |
| 5 | `main.js` | (Electron uniquement) |
| 6 | `package.json` | Configuration |

**C'est tout ce qu'il faut !**

---

## ✅ Checklist

- [ ] Structure de dossiers créée
- [ ] `index.html` créé
- [ ] `app.js` créé avec fetch
- [ ] Pages dans `public/pages/`
- [ ] Tests en local (web ou Electron)
- [ ] Header/footer s'affiche correctement

---

## 🐛 Déboguer

```bash
# Erreur "Cannot fetch"
# → Vérifier les chemins relatifs
# → Ouvrir DevTools (F12) et vérifier la console

# Page blanche
# → Vérifier que index.html charge app.js
# → Vérifier le chemin dans fetch

# Boutons ne fonctionnent pas
# → Vérifier data-page="..."
# → Vérifier que app.js charge bien
```

---

**C'est simple : 1 HTML + 1 JS + Des fichiers HTML à charger = SPA ! 🚀**
