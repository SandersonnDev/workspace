# Proxmox Backend - Configuration & Déploiement

Ce dépôt contient uniquement les fichiers nécessaires au déploiement du backend Proxmox.

## 🚀 Installation Automatique

### Installation en une commande (recommandé)

```bash
curl -fsSL https://raw.githubusercontent.com/SandersonnDev/workspace/proxmox/scripts/proxmox-setup.sh | sudo bash -s install
```

### Installation manuelle

```bash
git clone --branch proxmox https://github.com/SandersonnDev/workspace.git
cd workspace
sudo bash scripts/proxmox-setup.sh install
```

## 📋 Ce que fait l'installation

1. ✅ Vérifie et configure le réseau & DNS
2. ✅ Installe Docker & Docker Compose
3. ✅ Installe Node.js 20 LTS
4. ✅ Clone le projet (branche proxmox)
5. ✅ Installe les dépendances npm
6. ✅ Configure l'environnement (.env)
7. ✅ Crée et active le service systemd
8. ✅ Démarre les services Docker (API + PostgreSQL)
9. ✅ Vérifie la santé des services

## 🎮 Commandes de Gestion

Une fois l'installation terminée, utilisez la commande `proxmox` :

### Service
```bash
proxmox start      # Démarre le backend
proxmox stop       # Arrête le backend
proxmox restart    # Redémarre le backend
proxmox status     # Affiche le statut
```

### Base de données
```bash
proxmox dbreset    # Réinitialise la BDD (supprime toutes les données)
```

### Debug
```bash
proxmox debug on   # Active les logs détaillés (client ↔ serveur)
proxmox debug off  # Désactive les logs détaillés
```

### Logs
```bash
proxmox logs       # Affiche les derniers logs
proxmox logs live  # Affiche les logs en temps réel (Ctrl+C pour arrêter)
```

## 🔧 Configuration

### Variables d'environnement

Le fichier de configuration se trouve dans : `/workspace/workspace/docker/proxmox/.env`

Variables principales :
- `API_PORT=4000` - Port de l'API HTTP/WebSocket
- `DEBUG_MODE=false` - Active/désactive le mode debug
- `LOG_LEVEL=info` - Niveau de log (debug, info, warn, error)
- `DB_HOST=db` - Hôte PostgreSQL
- `DB_NAME=workspace` - Nom de la base de données
- `DB_USER=workspace` - Utilisateur BDD
- `DB_PASSWORD=devpass` - Mot de passe BDD

### Service Systemd

Le service `workspace-proxmox` :
- ✅ Démarre automatiquement au boot
- ✅ Redémarre automatiquement en cas de crash
- ✅ Logs dans journald (`journalctl -u workspace-proxmox`)

## 🌐 Endpoints

Une fois démarré, le backend expose :

- **HTTP API** : `http://<IP>:4000`
- **WebSocket** : `ws://<IP>:4000/ws`
- **Health** : `http://<IP>:4000/api/health`
- **Metrics** : `http://<IP>:4000/api/metrics`

## 📦 Structure

```
workspace/
├── apps/
│   └── proxmox/              # Code source du backend
│       ├── src/              # Code TypeScript
│       ├── package.json      # Dépendances
│       └── tsconfig.json     # Config TypeScript
├── docker/
│   └── proxmox/              # Configuration Docker
│       ├── docker-compose.yml
│       ├── Dockerfile
│       ├── .env             # Variables d'environnement
│       └── postgres.conf    # Config PostgreSQL
└── scripts/
    └── proxmox-setup.sh     # Script d'installation & gestion
```

## 🐛 Dépannage

### Le service ne démarre pas

```bash
# Vérifier les logs
proxmox logs

# Vérifier le statut Docker
cd /workspace/workspace/docker/proxmox
docker compose ps
docker compose logs
```

### L'API ne répond pas

```bash
# Vérifier que les ports sont ouverts
netstat -tlnp | grep 4000

# Vérifier la santé des containers
docker ps
docker inspect <container_id>
```

### Problèmes de réseau

```bash
# Vérifier la résolution DNS
ping github.com
cat /etc/resolv.conf

# Réappliquer la config DNS
cat > /etc/resolv.conf <<EOF
nameserver 8.8.8.8
nameserver 8.8.4.4
EOF
```

### Base de données corrompue

```bash
# Réinitialiser complètement la BDD
proxmox dbreset
```

## 🔄 Mise à jour

```bash
cd /workspace/workspace
git pull origin proxmox
proxmox restart
```

## 🛠️ Développement

### Mode debug

Active les logs détaillés des échanges client ↔ serveur :

```bash
proxmox debug on
proxmox restart
proxmox logs live
```

### Accès direct à la BDD

```bash
cd /workspace/workspace/docker/proxmox
docker compose exec db psql -U workspace -d workspace
```

### Rebuild des images

```bash
cd /workspace/workspace/docker/proxmox
docker compose down
docker compose build --no-cache
docker compose up -d
```

## 📝 Notes

- **Prérequis** : Debian 13 (Trixie) avec accès réseau
- **Permissions** : Nécessite root (sudo)
- **Ports utilisés** : 4000 (API/WS), 5432 (PostgreSQL interne)
- **Espace disque** : ~2GB (images Docker + dépendances)

## 🎯 Objectif

Un environnement Proxmox :
- ✅ Auto-configuré
- ✅ Propre et minimaliste
- ✅ Facile à maintenir
- ✅ Haute disponibilité (24h/24)
- ✅ Redémarrage automatique

---

**Support** : Pour toute question ou problème, vérifiez d'abord les logs avec `proxmox logs`
