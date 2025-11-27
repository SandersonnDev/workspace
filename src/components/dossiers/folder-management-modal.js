// Folder Management Modal - Load inline HTML
const folderManagementModalHTML = `
<div id="folder-management-modal" class="universal-modal" data-modal-id="folder-management-modal">
    <div class="modal-overlay"></div>
    
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Gestion des Dossiers et Fichiers</h2>
                <button class="modal-close" data-modal-close="folder-management-modal">✕</button>
            </div>
            
            <div class="modal-body">
                <div class="modal-tabs">
                    <button class="modal-tab-button active" data-tab="manage-folder">Mes raccourcis</button>
                    <button class="modal-tab-button" data-tab="create-folder">Créer un raccourci</button>
                </div>
                
                <div class="modal-tab-content active" data-tab="manage-folder">
                    <div id="added-folders-list" class="added-apps-list">
                    </div>
                </div>

                <div class="modal-tab-content" data-tab="create-folder">
                    <form id="create-folder-form" class="create-app-form">
                        <div class="form-group">
                            <label for="folder-name">Nom du raccourci</label>
                            <input type="text" id="folder-name" placeholder="Ex: Mon Dossier" required />
                        </div>
                        
                        <div class="form-group">
                            <label for="folder-path">Sélectionner le dossier ou fichier</label>
                            <div class="form-file-selector">
                                <input type="text" id="folder-path" placeholder="Cliquez sur le bouton pour sélectionner..." readonly />
                                <button type="button" id="browse-folder-path" class="modal-btn modal-btn-secondary">Parcourir</button>
                            </div>
                        </div>
                        
                        <button type="submit" class="modal-btn modal-btn-primary" style="width: 100%;">Créer le raccourci</button>
                    </form>
                </div>
            </div>
            
            <div class="modal-footer">
                <button type="button" class="modal-btn modal-btn-secondary" data-modal-close="folder-management-modal">
                    Fermer
                </button>
            </div>
        </div>
    </div>
</div>
`;

// Inject modal HTML into DOM when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other components to load
    setTimeout(() => {
        if (!document.getElementById('folder-management-modal')) {
            document.body.insertAdjacentHTML('beforeend', folderManagementModalHTML);
        }
    }, 200);
});
