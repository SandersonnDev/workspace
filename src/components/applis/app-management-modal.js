// App Management Modal - Load inline HTML
const appManagementModalHTML = `
<div id="app-management-modal" class="universal-modal" data-modal-id="app-management-modal">
    <div class="modal-overlay"></div>
    
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Gestion des Applications</h2>
                <button class="modal-close" data-modal-close="app-management-modal">✕</button>
            </div>
            
            <div class="modal-body">
                <div class="modal-tabs">
                    <button class="modal-tab-button active" data-tab="manage-app">Mes raccourcis</button>
                    <button class="modal-tab-button" data-tab="create-app">Créer un raccourci</button>
                </div>
                
                <div class="modal-tab-content active" data-tab="manage-app">
                    <div id="added-apps-list" class="added-apps-list">
                    </div>
                </div>

                <div class="modal-tab-content" data-tab="create-app">
                    <form id="create-app-form" class="create-app-form">
                        <div class="form-group">
                            <label for="app-name">Nom du raccourci</label>
                            <input type="text" id="app-name" placeholder="Ex: Mon Application" required />
                        </div>
                        
                        <div class="form-group">
                            <label for="app-executable">Sélectionner l'exécutable</label>
                            <div class="form-file-selector">
                                <input type="text" id="app-executable" placeholder="Cliquez sur le bouton pour sélectionner..." readonly />
                                <button type="button" id="browse-executable" class="modal-btn modal-btn-secondary">Parcourir</button>
                            </div>
                        </div>
                        
                        <button type="submit" class="modal-btn modal-btn-primary" style="width: 100%;">Créer le raccourci</button>
                    </form>
                </div>
            </div>
            
            <div class="modal-footer">
                <button type="button" class="modal-btn modal-btn-secondary" data-modal-close="app-management-modal">
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
        if (!document.getElementById('app-management-modal')) {
            document.body.insertAdjacentHTML('beforeend', appManagementModalHTML);
        }
    }, 100);
});

