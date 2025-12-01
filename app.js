console.log('lancement de workspace 1.0')

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