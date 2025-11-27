// Navbar Component - Load inline HTML
const navbarHTML = `
<nav class="navbar">
    <div class="navbar-container">
        <div class="navbar-logo">
            <span class="logo-text">📦 La Capsule</span>
        </div>
        
        <div class="navbar-search">
            <input type="text" class="search-input" placeholder="Rechercher..." />
            <span class="search-icon">🔍</span>
        </div>
    </div>
</nav>
`;

document.addEventListener('DOMContentLoaded', function() {
    const root = document.getElementById('navbar-root');
    if (root) {
        root.innerHTML = navbarHTML;
    }
});

