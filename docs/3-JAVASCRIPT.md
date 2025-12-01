# 3️⃣ JavaScript - Explication de Chaque Fichier

## 📌 Vue d'Ensemble

```
index.html  ← Structure HTML
    ↓
app.js      ← Logique application (CHARGE LES PAGES)
    ↓
main.js     ← Processus Electron (LANCE LA FENÊTRE)
    ↓
preload.js  ← Bridge sécurisé (OPTIONNEL)
```

---

## 1️⃣ app.js - Cœur de l'Application

### 📝 Rôle

- Charge les pages HTML dynamiquement
- Gère la navigation
- Affiche/masque header/footer
- Gère les erreurs

### 💻 Code Complet

```javascript
// ============================================
// app.js - Logique de l'application
// ============================================

/**
 * Classe pour gérer les pages
 */
class PageManager {
    constructor() {
        // Configuration
        this.contentContainer = 'content';
        this.pages = ['home', 'agenda', 'dossier'];
        this.fullPageLayout = ['login', 'signup'];
        
        // Initialiser au démarrage
        this.init();
    }

    /**
     * Initialisation
     */
    init() {
        console.log('🚀 Application démarrée');
        
        // Charger la page par défaut
        this.loadPage('home');
        
        // Attacher les écouteurs d'événements
        this.attachListeners();
    }

    /**
     * Charger une page HTML
     * @param {string} pageName - Nom de la page (sans .html)
     */
    async loadPage(pageName) {
        try {
            console.log(`📄 Chargement de : ${pageName}`);
            
            // Construire le chemin
            const filePath = `./public/pages/${pageName}.html`;
            
            // Récupérer le fichier
            const response = await fetch(filePath);
            
            // Vérifier si la requête est réussie
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Récupérer le texte HTML
            const html = await response.text();
            
            // Insérer le HTML dans la page
            document.getElementById(this.contentContainer).innerHTML = html;
            
            // Mettre à jour l'affichage
            this.updateLayout(pageName);
            
            console.log(`✅ Page chargée : ${pageName}`);
        } catch (error) {
            console.error(`❌ Erreur lors du chargement de ${pageName}:`, error);
            this.showError(pageName);
        }
    }

    /**
     * Afficher/masquer header et footer selon la page
     * @param {string} pageName - Nom de la page
     */
    updateLayout(pageName) {
        const header = document.getElementById('header');
        const footer = document.getElementById('footer');
        
        // Vérifier si c'est une page "full"
        const isFullPage = this.fullPageLayout.includes(pageName);
        
        if (isFullPage) {
            // Masquer header/footer
            header.style.display = 'none';
            footer.style.display = 'none';
            console.log('🔒 Layout full (header/footer masqués)');
        } else {
            // Afficher header/footer
            header.style.display = 'block';
            footer.style.display = 'block';
            console.log('📱 Layout normal (header/footer visibles)');
        }
    }

    /**
     * Afficher message d'erreur
     * @param {string} pageName - Page qui n'a pas pu être chargée
     */
    showError(pageName) {
        const errorHTML = `
            <div style="color: red; padding: 20px;">
                <h2>❌ Erreur de chargement</h2>
                <p>Impossible de charger la page : <strong>${pageName}</strong></p>
                <p>Vérifiez que le fichier existe : <code>public/pages/${pageName}.html</code></p>
            </div>
        `;
        document.getElementById(this.contentContainer).innerHTML = errorHTML;
    }

    /**
     * Attacher les écouteurs d'événements sur les boutons
     */
    attachListeners() {
        // Sélectionner tous les boutons avec data-page
        const buttons = document.querySelectorAll('[data-page]');
        
        console.log(`📌 Trouvé ${buttons.length} boutons de navigation`);
        
        // Pour chaque bouton
        buttons.forEach(button => {
            // Attacher un écouteur de clic
            button.addEventListener('click', (event) => {
                event.preventDefault();
                
                // Récupérer le nom de la page
                const pageName = button.dataset.page;
                
                // Charger la page
                this.loadPage(pageName);
            });
        });
    }
}

// ============================================
// Démarrage de l'application
// ============================================

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    console.log('📖 DOM chargé');
    
    // Créer l'instance du gestionnaire
    window.pageManager = new PageManager();
});
```

### 📖 Explication Détaillée

#### Constructor (Ligne 12-19)
```javascript
constructor() {
    this.contentContainer = 'content';  // ID du div où afficher les pages
    this.pages = ['home', 'agenda', 'dossier'];  // Pages disponibles
    this.fullPageLayout = ['login', 'signup'];  // Pages sans header/footer
    this.init();
}
```
**Rôle** : Initialiser les variables, démarrer l'app

---

#### Fetch API (Ligne 44-48)
```javascript
const response = await fetch(filePath);
if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
const html = await response.text();
```

**Rôle** : Récupérer un fichier HTML du serveur

**Étapes** :
1. `fetch()` - Demander le fichier
2. `response.ok` - Vérifier si ça a marché
3. `response.text()` - Récupérer le texte

---

#### innerHTML (Ligne 50)
```javascript
document.getElementById(this.contentContainer).innerHTML = html;
```

**Rôle** : Insérer le HTML récupéré dans la page

**Attention** : `innerHTML` insère du HTML brut (penser à la sécurité)

---

#### querySelector (Ligne 94)
```javascript
const buttons = document.querySelectorAll('[data-page]');
```

**Rôle** : Trouver tous les boutons avec `data-page`

**Exemple HTML** :
```html
<button data-page="home">Accueil</button>
<button data-page="agenda">Agenda</button>
```

---

#### addEventListener (Ligne 99)
```javascript
button.addEventListener('click', (event) => {
    event.preventDefault();
    const pageName = button.dataset.page;
    this.loadPage(pageName);
});
```

**Rôle** : Écouter les clics sur les boutons

**Processus** :
1. Clic sur bouton
2. Récupérer `data-page`
3. Charger la page

---

#### DOMContentLoaded (Ligne 113-119)
```javascript
document.addEventListener('DOMContentLoaded', () => {
    window.pageManager = new PageManager();
});
```

**Rôle** : Attendre que HTML soit chargé avant d'exécuter du JavaScript

---

## 2️⃣ main.js - Processus Electron

### 📝 Rôle

- Créer la fenêtre Electron
- Gérer le cycle de vie de l'app
- Charger index.html dans la fenêtre

### 💻 Code Complet

```javascript
// ============================================
// main.js - Processus principal Electron
// ============================================

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

    // Ouvrir les DevTools (à enlever en production)
    mainWindow.webContents.openDevTools();

    console.log('✅ Fenêtre créée');

    // Gérer la fermeture
    mainWindow.on('closed', () => {
        mainWindow = null;
        console.log('❌ Fenêtre fermée');
    });
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
```

### 📖 Explication Détaillée

#### require() (Ligne 5-6)
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
```

**Rôle** : Importer les modules

- `app` - Contrôle le cycle de vie
- `BrowserWindow` - Créer les fenêtres
- `path` - Manipuler les chemins de fichiers

---

#### BrowserWindow (Ligne 23-31)
```javascript
mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { ... }
});
```

**Rôle** : Créer une fenêtre Electron

**Options** :
- `width/height` - Taille de la fenêtre
- `nodeIntegration: false` - Sécurité (ne pas exposer Node.js)
- `contextIsolation: true` - Isoler le contexte
- `preload` - Script sécurisé à charger

---

#### loadFile() (Ligne 34)
```javascript
mainWindow.loadFile('index.html');
```

**Rôle** : Charger un fichier HTML dans la fenêtre

**Alternative** :
```javascript
mainWindow.loadURL('http://localhost:3000');  // Charger une URL
```

---

#### openDevTools() (Ligne 37)
```javascript
mainWindow.webContents.openDevTools();
```

**Rôle** : Ouvrir les Developer Tools (F12)

**⚠️ À enlever en production !**

---

#### app.on('ready') (Ligne 52)
```javascript
app.on('ready', createWindow);
```

**Rôle** : Créer la fenêtre au démarrage

**Cycle de vie** :
```
Electron démarre
    ↓
'ready' déclenché
    ↓
createWindow() appelée
    ↓
Fenêtre affichée
```

---

#### process.platform (Ligne 62)
```javascript
if (process.platform !== 'darwin') {
    app.quit();
}
```

**Rôle** : Comportement différent par système

- `darwin` = macOS (garder l'app ouverte)
- `win32` = Windows (quitter)
- `linux` = Linux (quitter)

---

## 3️⃣ preload.js - Bridge Sécurisé

### 📝 Rôle

- Créer une interface sécurisée entre Electron et le web
- Exposer des APIs "sûres" au code web

### 💻 Code Complet

```javascript
// ============================================
// preload.js - Bridge sécurisé
// ============================================

const { contextBridge, ipcRenderer } = require('electron');

/**
 * Exposer une API sécurisée au code web
 * 
 * Accès web : window.electron.send('channel', data);
 */
contextBridge.exposeInMainWorld('electron', {
    /**
     * Envoyer un message au processus principal
     * @param {string} channel - Nom du canal
     * @param {any} data - Données à envoyer
     */
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },

    /**
     * Écouter les messages du processus principal
     * @param {string} channel - Nom du canal
     * @param {function} callback - Fonction à appeler quand un message arrive
     */
    on: (channel, callback) => {
        ipcRenderer.on(channel, (event, args) => {
            callback(args);
        });
    },

    /**
     * Envoyer un message et attendre une réponse (une seule fois)
     * @param {string} channel - Nom du canal
     * @param {function} callback - Fonction à appeler quand la réponse arrive
     */
    once: (channel, callback) => {
        ipcRenderer.once(channel, (event, args) => {
            callback(args);
        });
    },

    /**
     * Invoquer une fonction dans le processus principal
     * @param {string} channel - Nom du canal
     * @param {any} args - Arguments
     * @returns {Promise} Réponse du processus principal
     */
    invoke: (channel, args) => {
        return ipcRenderer.invoke(channel, args);
    }
});

console.log('🔒 Preload script chargé');
```

### 📖 Explication Détaillée

#### contextBridge.exposeInMainWorld() (Ligne 11-45)
```javascript
contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => { ... },
    on: (channel, callback) => { ... }
});
```

**Rôle** : Exposer une API au code web

**Accès depuis le web** :
```javascript
// Dans app.js
window.electron.send('mon-canal', { message: 'Bonjour' });
```

---

#### send() (Ligne 17-20)
```javascript
send: (channel, data) => {
    ipcRenderer.send(channel, data);
}
```

**Rôle** : Envoyer un message au processus principal

**Exemple** :
```javascript
// app.js
window.electron.send('save-file', { content: 'texte' });

// main.js
ipcMain.on('save-file', (event, args) => {
    console.log('Reçu:', args);
});
```

---

#### on() (Ligne 24-28)
```javascript
on: (channel, callback) => {
    ipcRenderer.on(channel, (event, args) => {
        callback(args);
    });
}
```

**Rôle** : Écouter les messages du processus principal

**Exemple** :
```javascript
// app.js
window.electron.on('file-saved', (data) => {
    console.log('Fichier sauvegardé:', data);
});

// main.js
mainWindow.webContents.send('file-saved', { success: true });
```

---

#### invoke() (Ligne 42-46)
```javascript
invoke: (channel, args) => {
    return ipcRenderer.invoke(channel, args);
}
```

**Rôle** : Appeler une fonction et attendre la réponse

**Exemple** :
```javascript
// app.js (web)
const result = await window.electron.invoke('get-file', { path: '/mon/fichier' });
console.log(result);

// main.js
ipcMain.handle('get-file', async (event, args) => {
    return { content: 'Contenu du fichier' };
});
```

---

## 4️⃣ index.html - Structure

### 📝 Rôle

- Structure de la page
- Appeler app.js
- Contenir les boutons de navigation

### 💻 Code Complet

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- Métadonnées -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application</title>
    
    <!-- Styles -->
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <!-- HEADER -->
    <header id="header">
        <nav>
            <!-- Boutons de navigation avec data-page -->
            <button data-page="home">🏠 Accueil</button>
            <button data-page="agenda">📅 Agenda</button>
            <button data-page="dossier">📁 Dossier</button>
        </nav>
    </header>

    <!-- CONTENU PRINCIPAL (où les pages se chargeront) -->
    <main id="content">
        <!-- Les pages HTML s'afficheront ici -->
    </main>

    <!-- FOOTER -->
    <footer id="footer">
        <p>&copy; 2025 - Application</p>
    </footer>

    <!-- SCRIPT PRINCIPAL -->
    <script src="./app.js"></script>
</body>
</html>
```

### 📖 Explication

#### data-page (Ligne 19-21)
```html
<button data-page="home">🏠 Accueil</button>
```

**Rôle** : Attribut personnalisé pour identifier les pages

**Récupération en JS** :
```javascript
button.dataset.page  // Donne "home"
```

---

#### id="content" (Ligne 25)
```html
<main id="content"></main>
```

**Rôle** : Conteneur où app.js insérera les pages

**Utilisation en JS** :
```javascript
document.getElementById('content').innerHTML = html;
```

---

## 🔄 Flux Complet

### Web (Python Server)

```
1. Utilisateur ouvre http://localhost:8000
2. index.html se charge
3. app.js s'exécute (DOMContentLoaded)
4. PageManager.init() appelle loadPage('home')
5. fetch('./public/pages/home.html')
6. home.html s'affiche dans <main id="content">
7. Utilisateur clique sur "Agenda"
8. app.js reçoit le clic → loadPage('agenda')
9. agenda.html s'affiche
```

### Electron

```
1. npm start
2. main.js démarre
3. 'ready' déclenché → createWindow()
4. BrowserWindow crée une fenêtre
5. index.html se charge
6. app.js s'exécute (identique au web)
7. Utilisateur clique → Idem que le web
8. preload.js disponible pour communication
```

---

## 📊 Récapitulatif

| Fichier | Rôle | Quand | Exécuté Par |
|---------|------|------|------------|
| `app.js` | Charger pages | À chaque clic | Navigateur |
| `main.js` | Créer fenêtre | Au démarrage Electron | Electron |
| `preload.js` | Bridge sécurisé | Au chargement | Electron |
| `index.html` | Structure | Au démarrage | Navigateur |

---

## 💡 Concepts Clés

### async/await (app.js Ligne 40)
```javascript
async loadPage(pageName) {
    const response = await fetch(filePath);
    const html = await response.text();
}
```

**Rôle** : Attendre que fetch finisse avant de continuer

---

### try/catch (app.js Ligne 39)
```javascript
try {
    // Code qui peut échouer
} catch (error) {
    // Gérer l'erreur
}
```

**Rôle** : Capturer et gérer les erreurs

---

### Fermeture (Closure) (app.js Ligne 99)
```javascript
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        const pageName = button.dataset.page;  // Accès à la variable
    });
});
```

**Rôle** : Accès aux variables depuis l'intérieur d'une fonction

---

## ✅ Checklist Compréhension

- [ ] Je comprends comment app.js charge les pages
- [ ] Je comprends fetch et async/await
- [ ] Je comprends main.js et le cycle de vie Electron
- [ ] Je comprends preload.js et la sécurité
- [ ] Je peux modifier app.js pour ajouter des pages

---

**C'est tout ! Vous comprenez maintenant tous les fichiers JavaScript ! 🎉**
