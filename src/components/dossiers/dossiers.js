// Dossiers Component Logic - Electron compatible
// Gestion des raccourcis vers dossiers et fichiers

let folderModal = null;
let addedFolders = [];
let customFolders = {};

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('Dossiers - DOMContentLoaded, electronAPI available:', !!window.electronAPI);
        if (window.electronAPI) {
            console.log('electronAPI methods:', Object.keys(window.electronAPI));
        }
        initDossiers();
    }, 900);
});

function initDossiers() {
    loadAddedFolders();
    loadCustomFolders();
    renderFolders();
    setupManageButton();
    loadModal();
}

function loadAddedFolders() {
    const saved = localStorage.getItem('addedFolders');
    addedFolders = saved ? JSON.parse(saved) : [];
}

function saveAddedFolders() {
    localStorage.setItem('addedFolders', JSON.stringify(addedFolders));
}

function loadCustomFolders() {
    const saved = localStorage.getItem('customFolders');
    customFolders = saved ? JSON.parse(saved) : {};
}

function saveCustomFolders() {
    localStorage.setItem('customFolders', JSON.stringify(customFolders));
}

function getFolderData(folderId) {
    return customFolders[folderId];
}

function renderFolders() {
    const foldersGrid = document.getElementById('folders-grid');
    if (!foldersGrid) return;

    foldersGrid.innerHTML = addedFolders.map(folderId => {
        const folder = getFolderData(folderId);
        if (!folder) return '';

        return `
            <div class="folder-item" data-folder="${folderId}" data-name="${folder.name}">
                <div class="folder-icon" id="main-icon-folder-${folderId}"></div>
                <div class="folder-name">${folder.name}</div>
                <button class="add-favorite" title="Ajouter aux favoris">⭐</button>
            </div>
        `;
    }).join('');

    // Charger les icônes
    addedFolders.forEach(folderId => {
        const folder = getFolderData(folderId);
        if (folder) {
            const iconEl = document.getElementById(`main-icon-folder-${folderId}`);
            if (iconEl && folder.icon) {
                iconEl.style.backgroundImage = `url('${folder.icon}')`;
                iconEl.style.backgroundPosition = 'center';
                iconEl.style.backgroundSize = 'contain';
                iconEl.style.backgroundRepeat = 'no-repeat';
                iconEl.style.width = '64px';
                iconEl.style.height = '64px';
            }
        }
    });

    setupFolderItems();
}

function setupFolderItems() {
    const folderItems = document.querySelectorAll('.folder-item');

    folderItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-favorite')) {
                openFolder(this.dataset.folder, this.dataset.name);
            }
        });

        const starBtn = item.querySelector('.add-favorite');
        if (starBtn) {
            starBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const folder = getFolderData(item.dataset.folder);
                addFolderToFavorites(
                    item.dataset.folder,
                    folder.icon,
                    folder.name
                );
                starBtn.classList.toggle('active');
            });
        }
    });

    updateStarButtons();
}

function openFolder(folderId, displayName) {
    console.log(`Opening folder: ${displayName}`);
    const folder = getFolderData(folderId);
    
    if (folder && window.electronAPI && window.electronAPI.openPath) {
        window.electronAPI.openPath(folder.path).then(success => {
            if (!success) {
                console.error('Impossible d\'ouvrir:', folder.path);
            }
        }).catch(error => {
            console.error('Erreur lors de l\'ouverture:', error);
        });
    } else {
        console.error('openPath non disponible ou dossier non trouvé');
    }
}

function addFolderToFavorites(id, icon, name) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (!favorites.find(f => f.id === id && f.type === 'folder')) {
        favorites.push({
            id: id,
            type: 'folder',
            icon: icon,
            name: name
        });
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    document.dispatchEvent(new CustomEvent('favoriteAdded'));
}

function updateStarButtons() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    document.querySelectorAll('.folder-item .add-favorite').forEach(btn => {
        const folderItem = btn.closest('.folder-item');
        const folderId = folderItem.dataset.folder;

        if (favorites.find(f => f.id === folderId && f.type === 'folder')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function setupManageButton() {
    const btn = document.getElementById('manage-folders-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            if (folderModal) folderModal.open();
        });
    }
}

function loadModal() {
    const checkModal = setInterval(() => {
        const modal = document.getElementById('folder-management-modal');
        if (modal) {
            clearInterval(checkModal);
            folderModal = new UniversalModal('folder-management-modal');
            setupModalLogic();
        }
    }, 100);
}

function setupModalLogic() {
    const createForm = document.getElementById('create-folder-form');
    const browseBtn = document.getElementById('browse-folder-path');

    console.log('setupModalLogic for folders called');
    console.log('window.electronAPI:', window.electronAPI);

    if (browseBtn) {
        browseBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Browse folder button clicked');
            console.log('window.electronAPI:', window.electronAPI);
            
            try {
                // Vérifier que l'API Electron est disponible
                if (window.electronAPI && typeof window.electronAPI.selectFolder === 'function') {
                    console.log('Calling selectFolder via IPC...');
                    const folderPath = await window.electronAPI.selectFolder();
                    if (folderPath) {
                        document.getElementById('folder-path').value = folderPath;
                    }
                } else {
                    console.error('electronAPI.selectFolder not available');
                    console.error('window.electronAPI:', window.electronAPI);
                    
                    // Fallback: demander le chemin manuellement
                    const folderPath = prompt('Entrez le chemin complet du dossier (ex: /home/user/Documents):');
                    if (folderPath && folderPath.trim()) {
                        document.getElementById('folder-path').value = folderPath.trim();
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la sélection du dossier:', error);
                
                // Fallback on error
                const folderPath = prompt('Erreur d\'accès à l\'explorateur. Entrez le chemin manuellement:');
                if (folderPath && folderPath.trim()) {
                    document.getElementById('folder-path').value = folderPath.trim();
                }
            }
        });
    }

    if (createForm) {
        createForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleCreateFolder();
        });
    }

    renderAddedFolders();
}

function handleCreateFolder() {
    const name = document.getElementById('folder-name').value.trim();
    const folderPath = document.getElementById('folder-path').value.trim();

    if (!name || !folderPath) {
        folderModal.showMessage('Le nom et le chemin du dossier sont requis', 'error');
        return;
    }

    // Générer un ID unique
    const folderId = 'custom_folder_' + Date.now();

    // Récupérer l'icône du dossier/fichier
    getFolderIcon(folderPath).then(iconPath => {
        // Ajouter à la base personnalisée
        customFolders[folderId] = {
            name: name,
            path: folderPath,
            icon: iconPath || 'default-icon'
        };

        // Ajouter aux dossiers affichés
        addedFolders.push(folderId);

        saveCustomFolders();
        saveAddedFolders();

        // Réinitialiser le formulaire
        document.getElementById('create-folder-form').reset();

        folderModal.showMessage(`Raccourci "${name}" créé avec succès !`, 'success');

        // Mettre à jour les listes
        renderFolders();
        renderAddedFolders();
    });
}

async function getFolderIcon(folderPath) {
    // Utiliser l'API Electron pour extraire l'icône du dossier
    if (window.electronAPI && window.electronAPI.getFileIcon) {
        try {
            return await window.electronAPI.getFileIcon(folderPath);
        } catch (error) {
            console.log('Erreur lors de la récupération de l\'icône:', error);
            return null;
        }
    }
    return null;
}

function renderAddedFolders() {
    const list = document.getElementById('added-folders-list');
    if (!list) return;

    if (addedFolders.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">Aucun raccourci créé. Créez-en un dans l\'onglet "Créer un raccourci"</div></div>';
        return;
    }

    list.innerHTML = addedFolders.map(folderId => {
        const folder = getFolderData(folderId);
        if (!folder) return '';

        return `
            <div class="app-card added">
                <div class="app-card-icon" id="icon-${folderId}"></div>
                <div class="app-card-name">${folder.name}</div>
                <div class="app-card-actions">
                    <button class="app-card-btn app-card-btn-danger" data-remove-folder="${folderId}">
                        ✕ Retirer
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Charger les icônes
    addedFolders.forEach(folderId => {
        const folder = getFolderData(folderId);
        if (folder) {
            const iconEl = document.getElementById(`icon-${folderId}`);
            if (iconEl && folder.icon) {
                iconEl.style.backgroundImage = `url('${folder.icon}')`;
                iconEl.style.backgroundPosition = 'center';
                iconEl.style.backgroundSize = 'contain';
                iconEl.style.backgroundRepeat = 'no-repeat';
                iconEl.style.width = '48px';
                iconEl.style.height = '48px';
            }
        }
    });

    // Setup remove handlers
    document.querySelectorAll('[data-remove-folder]').forEach(btn => {
        btn.addEventListener('click', () => {
            const folderId = btn.dataset.removeFolder;
            const folder = getFolderData(folderId);
            addedFolders = addedFolders.filter(id => id !== folderId);
            saveAddedFolders();
            renderFolders();
            renderAddedFolders();
            folderModal.showMessage(`${folder.name} retirée !`, 'success');
        });
    });
}
