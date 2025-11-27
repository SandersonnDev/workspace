// Favoris Component Logic - Electron compatible
let favorites = [];

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initFavoris();
        setupAddToFavorites();
    }, 900);
});

function initFavoris() {
    loadFavorites();
    updateFavoritesDisplay();
}

function loadFavorites() {
    const saved = localStorage.getItem('favorites');
    if (saved) {
        favorites = JSON.parse(saved);
    }
}

function addToFavorites(item) {
    if (!favorites.find(f => f.id === item.id && f.type === item.type)) {
        favorites.push(item);
        saveFavorites();
        updateFavoritesDisplay();
    }
}

function removeFromFavorites(id, type) {
    favorites = favorites.filter(f => !(f.id === id && f.type === type));
    saveFavorites();
    updateFavoritesDisplay();
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function updateFavoritesDisplay() {
    const favoritesGrid = document.getElementById('favorites-grid');
    
    if (!favoritesGrid) return;
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<div class="empty-favorites"><p>Aucun favori pour le moment. Ajoutez vos apps et dossiers préférés !</p></div>';
    } else {
        favoritesGrid.innerHTML = favorites.map(item => `
            <div class="favoris-item">
                <div class="favoris-item-icon">${item.icon}</div>
                <div class="favoris-item-name">${item.name}</div>
                <button class="remove-favorite" data-id="${item.id}" data-type="${item.type}">✕</button>
            </div>
        `).join('');
        
        document.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromFavorites(btn.dataset.id, btn.dataset.type);
            });
        });
    }
}

function setupAddToFavorites() {
    document.addEventListener('favoriteAdded', () => {
        loadFavorites();
        updateFavoritesDisplay();
    });
}

