// Applis Component Logic - Electron compatible
// Utilise l'IPC d'Electron pour accéder au système de fichiers

let appModal = null;
let addedApps = [];
let customApps = {};

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('Applis - DOMContentLoaded, electronAPI available:', !!window.electronAPI);
        if (window.electronAPI) {
            console.log('electronAPI methods:', Object.keys(window.electronAPI));
        }
        initApplis();
    }, 800);
});

function initApplis() {
    loadAddedApps();
    loadCustomApps();
    renderApps();
    setupManageButton();
    loadModal();
}

function loadAddedApps() {
    const saved = localStorage.getItem('addedApps');
    addedApps = saved ? JSON.parse(saved) : [];
}

function saveAddedApps() {
    localStorage.setItem('addedApps', JSON.stringify(addedApps));
}

function loadCustomApps() {
    const saved = localStorage.getItem('customApps');
    customApps = saved ? JSON.parse(saved) : {};
}

function saveCustomApps() {
    localStorage.setItem('customApps', JSON.stringify(customApps));
}

function getAppData(appId) {
    return customApps[appId];
}

function renderApps() {
    const appsGrid = document.getElementById('apps-grid');
    if (!appsGrid) return;

    appsGrid.innerHTML = addedApps.map(appId => {
        const app = getAppData(appId);
        if (!app) return '';

        return `
            <div class="app-item" data-app="${appId}" data-name="${app.name}">
                <div class="app-icon" id="main-icon-${appId}"></div>
                <div class="app-name">${app.name}</div>
                <button class="add-favorite" title="Ajouter aux favoris">⭐</button>
            </div>
        `;
    }).join('');

    // Charger les icônes
    addedApps.forEach(appId => {
        const app = getAppData(appId);
        if (app) {
            const iconEl = document.getElementById(`main-icon-${appId}`);
            if (iconEl && app.icon) {
                iconEl.style.backgroundImage = `url('${app.icon}')`;
                iconEl.style.backgroundPosition = 'center';
                iconEl.style.backgroundSize = 'contain';
                iconEl.style.backgroundRepeat = 'no-repeat';
                iconEl.style.width = '64px';
                iconEl.style.height = '64px';
            }
        }
    });

    setupAppItems();
}

function setupAppItems() {
    const appItems = document.querySelectorAll('.app-item');

    appItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-favorite')) {
                launchApp(this.dataset.app, this.dataset.name);
            }
        });

        const starBtn = item.querySelector('.add-favorite');
        if (starBtn) {
            starBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const app = getAppData(item.dataset.app);
                addAppToFavorites(
                    item.dataset.app,
                    app.icon,
                    app.name
                );
                starBtn.classList.toggle('active');
            });
        }
    });

    updateStarButtons();
}

function launchApp(appId, displayName) {
    console.log(`Launching app: ${displayName}`);
    // TODO: Implémenter l'exécution des applications via Electron IPC
}

function addAppToFavorites(id, icon, name) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (!favorites.find(f => f.id === id && f.type === 'app')) {
        favorites.push({
            id: id,
            type: 'app',
            icon: icon,
            name: name
        });
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    document.dispatchEvent(new CustomEvent('favoriteAdded'));
}

function updateStarButtons() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    document.querySelectorAll('.app-item .add-favorite').forEach(btn => {
        const appItem = btn.closest('.app-item');
        const appId = appItem.dataset.app;

        if (favorites.find(f => f.id === appId && f.type === 'app')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function setupManageButton() {
    const btn = document.getElementById('manage-apps-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            if (appModal) appModal.open();
        });
    }
}

function loadModal() {
    const checkModal = setInterval(() => {
        const modal = document.getElementById('app-management-modal');
        if (modal) {
            clearInterval(checkModal);
            appModal = new UniversalModal('app-management-modal');
            setupModalLogic();
        }
    }, 100);
}

function setupModalLogic() {
    const createForm = document.getElementById('create-app-form');
    const browseBtn = document.getElementById('browse-executable');

    console.log('setupModalLogic called');
    console.log('window.electronAPI:', window.electronAPI);

    if (browseBtn) {
        browseBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Browse button clicked');
            console.log('window.electronAPI:', window.electronAPI);
            
            try {
                // Vérifier que l'API Electron est disponible
                if (window.electronAPI && typeof window.electronAPI.selectFile === 'function') {
                    console.log('Calling selectFile via IPC...');
                    const filePath = await window.electronAPI.selectFile();
                    if (filePath) {
                        document.getElementById('app-executable').value = filePath;
                    }
                } else {
                    console.error('electronAPI.selectFile not available');
                    console.error('window.electronAPI:', window.electronAPI);
                    
                    // Fallback: demander le chemin manuellement
                    const filePath = prompt('Entrez le chemin complet de l\'exécutable (ex: /usr/bin/firefox):');
                    if (filePath && filePath.trim()) {
                        document.getElementById('app-executable').value = filePath.trim();
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la sélection du fichier:', error);
                
                // Fallback on error
                const filePath = prompt('Erreur d\'accès à l\'explorateur. Entrez le chemin manuellement:');
                if (filePath && filePath.trim()) {
                    document.getElementById('app-executable').value = filePath.trim();
                }
            }
        });
    }

    if (createForm) {
        createForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleCreateApp();
        });
    }

    renderAddedApps();
}

function handleCreateApp() {
    const name = document.getElementById('app-name').value.trim();
    const executable = document.getElementById('app-executable').value.trim();

    if (!name || !executable) {
        appModal.showMessage('Le nom et le chemin de l\'exécutable sont requis', 'error');
        return;
    }

    // Générer un ID unique
    const appId = 'custom_' + Date.now();

    // Récupérer l'icône du fichier exécutable
    getFileIcon(executable).then(iconPath => {
        // Ajouter à la base personnalisée
        customApps[appId] = {
            name: name,
            executable: executable,
            icon: iconPath || 'default-icon'
        };

        // Ajouter aux apps affichées
        addedApps.push(appId);

        saveCustomApps();
        saveAddedApps();

        // Réinitialiser le formulaire
        document.getElementById('create-app-form').reset();

        appModal.showMessage(`Raccourci "${name}" créé avec succès !`, 'success');

        // Mettre à jour les listes
        renderApps();
        renderAddedApps();
    });
}

async function getFileIcon(filePath) {
    // Utiliser l'API Electron pour extraire l'icône du fichier
    if (window.electronAPI && window.electronAPI.getFileIcon) {
        try {
            return await window.electronAPI.getFileIcon(filePath);
        } catch (error) {
            console.log('Erreur lors de la récupération de l\'icône:', error);
            return null;
        }
    }
    return null;
}

function renderAddedApps() {
    const list = document.getElementById('added-apps-list');
    if (!list) return;

    if (addedApps.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">Aucun raccourci créé. Créez-en un dans l\'onglet "Créer un raccourci"</div></div>';
        return;
    }

    list.innerHTML = addedApps.map(appId => {
        const app = getAppData(appId);
        if (!app) return '';

        return `
            <div class="app-card added">
                <div class="app-card-icon" id="icon-${appId}"></div>
                <div class="app-card-name">${app.name}</div>
                <div class="app-card-actions">
                    <button class="app-card-btn app-card-btn-danger" data-remove-app="${appId}">
                        ✕ Retirer
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Charger les icônes via JavaScript
    addedApps.forEach(appId => {
        const app = getAppData(appId);
        if (app) {
            const iconEl = document.getElementById(`icon-${appId}`);
            if (iconEl && app.icon) {
                iconEl.style.backgroundImage = `url('${app.icon}')`;
                iconEl.style.backgroundPosition = 'center';
                iconEl.style.backgroundSize = 'contain';
                iconEl.style.backgroundRepeat = 'no-repeat';
                iconEl.style.width = '48px';
                iconEl.style.height = '48px';
            }
        }
    });

    // Setup remove handlers
    document.querySelectorAll('[data-remove-app]').forEach(btn => {
        btn.addEventListener('click', () => {
            const appId = btn.dataset.removeApp;
            const app = getAppData(appId);
            addedApps = addedApps.filter(id => id !== appId);
            saveAddedApps();
            renderApps();
            renderAddedApps();
            appModal.showMessage(`${app.name} retirée !`, 'success');
        });
    });
}
