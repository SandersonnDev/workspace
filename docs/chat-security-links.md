# Système de Sécurité des Liens du Chat 🔐

## Vue d'ensemble

Le système de sécurité détecte automatiquement les liens URL dans les messages du chat et les rend cliquables de manière **100% sécurisée** contre les attaques XSS et phishing.

## Fonctionnalités

✅ **Détection automatique des URLs**
- `https://example.com/path`
- `www.example.com`
- `user@example.com`
- Protocoles supportés : `http`, `https`, `mailto`, `ftp`

✅ **Protection contre XSS**
- Pas d'injection de JavaScript
- Pas d'attributs dangereux (`onclick`, `onerror`, etc.)
- Utilisation de `textContent` et création DOM sécurisée

✅ **Ouverture sécurisée**
- Les liens s'ouvrent en `target="_blank"`
- Attribut `rel="noopener noreferrer"` appliqué
- Prévient les attaques `window.opener`

✅ **Logging et suivi**
- Chaque lien cliqué est enregistré dans la console
- Configuration facilement accessible

## Configuration pour les développeurs

### Fichier principal : `/public/assets/js/config/ChatSecurityConfig.js`

```javascript
// Mode strict : SEUL les domaines autorisés peuvent être cliqués
strictMode: false,

// Domaines autorisés (n'applique que si strictMode = true)
allowedDomains: ['github.com', 'stackoverflow.com'],

// Domaines bloqués (toujours appliqué)
blockedDomains: ['malware.com', 'phishing.org'],

// Mots-clés qui rendent le message non-cliquable
blockedKeywords: ['cliquez ici', 'urgent action', 'verify account'],

// Protocoles autorisés
allowedProtocols: ['http', 'https', 'mailto', 'ftp']
```

### Exemples de modification

#### 1. Bloquer un domaine

```javascript
// Dans ChatSecurityConfig.js
blockedDomains: [
    'malware.com',
    'phishing.example.com',
    'spam.example.com'  // <- Ajouter ici
]
```

#### 2. Activer le mode strict (whitelist)

```javascript
// SEUL les domaines autorisés seront cliquables
strictMode: true,
allowedDomains: [
    'github.com',
    'stackoverflow.com',
    'mdn.org'
]
```

#### 3. Bloquer un mot-clé

```javascript
blockedKeywords: [
    'cliquez ici',
    'urgent action',
    'télécharger maintenant'  // <- Ajouter ici
]
```

#### 4. Ajouter un protocole

```javascript
allowedProtocols: ['http', 'https', 'mailto', 'ftp', 'tel']
```

## Utilisation en console de développement

Une fois le chat initialisé, vous pouvez tester en console :

```javascript
// Afficher la configuration actuelle
window.chatManager.securityManager.exportConfig()

// Ajouter une domain bloquée
window.chatManager.securityManager.addBlockedDomain('badsite.com')

// Ajouter un mot-clé bloqué
window.chatManager.securityManager.addBlockedKeyword('download now')

// Vérifier si une URL est valide
window.chatManager.securityManager.isValidUrl('https://github.com')
// Retourne: true ou false
```

## Flux de traitement

```
Message reçu
    ↓
Vérifier mots-clés bloqués?
    ├─ OUI → Retourner texte brut (pas de liens)
    └─ NON
        ↓
        Détecter toutes les URLs
        ↓
        Pour chaque URL:
            - Valider le format
            - Vérifier le domaine (whitelist/blacklist)
            - Vérifier le protocole
            ↓
            ✅ Valide → Créer lien `<a>` sécurisé
            ❌ Invalide → Garder texte brut
        ↓
        Retourner HTML sécurisé
```

## Stylisation CSS

Les liens dans le chat sont stylisés avec les couleurs adaptées :

```css
.chat-content a {
    font-weight: 500;
    text-decoration: underline;
    border-bottom: 2px solid currentColor;
    transition: opacity 0.2s ease;
}

/* Messages reçus : liens en bleu */
.chat-message.other .chat-content a {
    color: var(--bleu1);
}

/* Mes messages : liens en blanc */
.chat-message.mine .chat-content a {
    color: #fff;
}
```

## Scénarios d'utilisation

### Scénario 1 : Configuration par défaut (mode permissif)

**Configuration :**
```javascript
strictMode: false,
blockedDomains: ['malware.com', 'phishing.org']
```

**Résultats :**
- ✅ `https://github.com` → Lien cliquable
- ✅ `https://stackoverflow.com` → Lien cliquable
- ❌ `https://malware.com` → Texte brut
- ❌ `https://phishing.org` → Texte brut

### Scénario 2 : Mode strict (whitelist)

**Configuration :**
```javascript
strictMode: true,
allowedDomains: ['github.com', 'stackoverflow.com']
```

**Résultats :**
- ✅ `https://github.com` → Lien cliquable
- ✅ `https://stackoverflow.com` → Lien cliquable
- ❌ `https://facebook.com` → Texte brut
- ❌ `https://twitter.com` → Texte brut

### Scénario 3 : Filtre par mots-clés

**Configuration :**
```javascript
blockedKeywords: ['cliquez ici', 'urgent']
```

**Résultats :**
- ❌ Message: `"Cliquez ici: https://example.com"` → Texte brut (malgré le lien valide)
- ✅ Message: `"Visitez https://example.com"` → Lien cliquable

## Architecture modulaire

```
ChatManager
    ↓
    imports ChatSecurityManager
        ↓
        Crée instance avec CHAT_SECURITY_CONFIG
            ↓
            displayMessages() appelle securityManager.processMessage()
                ↓
                Retourne HTML sécurisé avec liens
```

## Fichiers concernés

- `/public/assets/js/modules/ChatManager.js` - Intégration
- `/public/assets/js/modules/ChatSecurityManager.js` - Moteur de sécurité
- `/public/assets/js/config/ChatSecurityConfig.js` - Configuration dev
- `/rules/chat-security.mdc` - Documentation complète
- `/public/assets/css/modules/chat.css` - Styles des liens

## Sécurité garantie

- 🔒 **XSS Prevention** : Aucune injection de script possible
- 🔒 **CSRF Protection** : `rel="noopener noreferrer"`
- 🔒 **Phishing Protection** : Validation stricte des domaines
- 🔒 **Malware Protection** : Blacklist configurable
- 🔒 **Audit Trail** : Chaque lien cliqué est loggé

---

**Questions ou modifications ?** Éditez simplement `ChatSecurityConfig.js` !
