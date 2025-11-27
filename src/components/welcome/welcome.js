// Welcome Component - Load inline HTML
const welcomeHTML = `
<section class="welcome-section">
    <h1>Bienvenue</h1>
    <p id="current-date" class="date-text"></p>
</section>
`;

document.addEventListener('DOMContentLoaded', function() {
    const root = document.getElementById('welcome-root');
    if (root) {
        root.innerHTML = welcomeHTML;
        
        // Display current date
        const dateElement = document.getElementById('current-date');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString('fr-FR', options);
    }
});

