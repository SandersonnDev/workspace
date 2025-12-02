# Notes de Développement

## 🔧 Réinstallation des Dépendances

Après avoir cloné le repository, exécutez ces commandes pour réinstaller toutes les dépendances ajoutées aujourd'hui :

### Installation complète
```bash
sudo apt update
sudo apt install npm
```

### Ou installer individuellement les packages clés :

**Electron (application desktop)**
```bash
npm install --save-dev electron@39.2.4
npm install --save-dev electron-builder@26.0.12
```

**Font Awesome (icônes)**
```bash
npm install --save-dev @fortawesome/fontawesome-svg-core@7.1.0
npm install --save-dev @fortawesome/free-solid-svg-icons@7.1.0
npm install --save-dev @fortawesome/free-regular-svg-icons@7.1.0
npm install --save-dev @fortawesome/free-brands-svg-icons@7.1.0
npm install --save-dev @fortawesome/react-fontawesome@3.1.1
```

**React (optionnel)**
```bash
npm install --save-dev react@18.3.1
```

## 📋 Scripts npm disponibles

```bash
npm start        # Lancer l'application Electron
npm run build    # Compiler l'application pour desktop
```

## 📝 Package.json
Toutes les dépendances sont configurées dans `package.json` avec les versions exactes.

## 🚀 Après installation
L'application est prête à fonctionner :
- Navigation dynamique en HTML
- Icônes Font Awesome avec animations
- Application desktop avec Electron
