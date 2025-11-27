// Tabs Component - Load inline HTML
const tabsHTML = `
<div class="tabs-container">
    <div class="tabs-header">
        <button class="tab-button active" data-tab="favorites">Favoris</button>
        <button class="tab-button" data-tab="apps">Applis</button>
        <button class="tab-button" data-tab="folders">Dossiers</button>
        <button class="tab-button" data-tab="inbox">Réception</button>
    </div>

    <div class="tabs-content">
        <div id="favorites" class="tab-content active"></div>
        <div id="apps" class="tab-content"></div>
        <div id="folders" class="tab-content"></div>
        <div id="inbox" class="tab-content"></div>
    </div>
</div>
`;

document.addEventListener('DOMContentLoaded', function() {
    const root = document.getElementById('tabs-root');
    if (root) {
        root.innerHTML = tabsHTML;
        
        // Load tab contents
        loadTabContents();
        setupTabSwitching();
    }
});

function loadTabContents() {
    // Load favorites content
    const favoritesTab = document.getElementById('favorites');
    const favoritesHTML = `
        <div class="favoris-content">
            <h2>Favoris</h2>
            <div class="items-grid" id="favorites-grid"></div>
        </div>
    `;
    if (favoritesTab) favoritesTab.innerHTML = favoritesHTML;

    // Load applis content
    const appsTab = document.getElementById('apps');
    const appsHTML = `
        <div class="applis-content">
            <div class="applis-header">
                <h2>Applis</h2>
                <button id="manage-apps-btn" class="manage-apps-btn">⚙️ Gérer les apps</button>
            </div>
            <div class="items-grid" id="apps-grid"></div>
        </div>
    `;
    if (appsTab) appsTab.innerHTML = appsHTML;

    // Load folders content
    const foldersTab = document.getElementById('folders');
    const foldersHTML = `
        <div class="dossiers-content">
            <div class="applis-header">
                <h2>Dossiers</h2>
                <button id="manage-folders-btn" class="manage-apps-btn">⚙️ Gérer les dossiers</button>
            </div>
            <div class="items-grid" id="folders-grid"></div>
        </div>
    `;
    if (foldersTab) foldersTab.innerHTML = foldersHTML;

    // Load reception content
    const inboxTab = document.getElementById('inbox');
    const receptionHTML = `
        <div class="reception-content">
            <h2>Réception</h2>
            <div class="content-card">
                <p>Aucun élément pour le moment.</p>
            </div>
        </div>
    `;
    if (inboxTab) inboxTab.innerHTML = receptionHTML;
}

function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

