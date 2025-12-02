/**
 * ChatSecurityConfig - Configuration centralisée de sécurité du chat
 * 
 * Fichier de développeur pour contrôler facilement les filtres et règles.
 * Modifiez directement ce fichier pour adapter les règles de sécurité.
 */

export const CHAT_SECURITY_CONFIG = {
    // Mode strict : Si true, SEUL les domaines de la whitelist sont autorisés
    strictMode: false,
    
    // Domaines autorisés (whitelist)
    // Ne s'applique que si strictMode = true
    allowedDomains: [
        'github.com',
        'gitlab.com',
        'stackoverflow.com',
        'mdn.org',
        'w3schools.com',
        'example.com'
    ],
    
    // Domaines bloqués (blacklist)
    // S'applique toujours, même si strictMode = false
    blockedDomains: [
        'malware.com',
        'phishing.example.com',
        'spam.example.com'
    ],
    
    // Mots-clés qui rendent le message non-cliquable
    blockedKeywords: [
        'cliquez ici',
        'click here',
        'action urgente',
        'urgent action',
        'vérifiez votre compte',
        'verify your account',
        'confirmer identité',
        'confirm identity',
        'télécharger maintenant',
        'download now',
        'obtenir argent rapidement',
        'get rich quick'
    ],
    
    // Protocoles autorisés
    allowedProtocols: [
        'http',
        'https',
        'mailto',
        'ftp'
    ]
};

/**
 * Fonction helper pour ajouter une règle de blocage
 */
export function blockDomain(domain) {
    if (!CHAT_SECURITY_CONFIG.blockedDomains.includes(domain)) {
        CHAT_SECURITY_CONFIG.blockedDomains.push(domain);
        console.log(`🚫 Domaine bloqué: ${domain}`);
    }
}

/**
 * Fonction helper pour ajouter un mot-clé bloqué
 */
export function blockKeyword(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    if (!CHAT_SECURITY_CONFIG.blockedKeywords.includes(lowerKeyword)) {
        CHAT_SECURITY_CONFIG.blockedKeywords.push(lowerKeyword);
        console.log(`🚫 Mot-clé bloqué: ${keyword}`);
    }
}

/**
 * Fonction helper pour autoriser un domaine
 */
export function allowDomain(domain) {
    if (!CHAT_SECURITY_CONFIG.allowedDomains.includes(domain)) {
        CHAT_SECURITY_CONFIG.allowedDomains.push(domain);
        console.log(`✅ Domaine autorisé: ${domain}`);
    }
}

/**
 * Fonction helper pour basculer en mode strict
 */
export function enableStrictMode(enabled = true) {
    CHAT_SECURITY_CONFIG.strictMode = enabled;
    console.log(`🔐 Mode strict: ${enabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`);
}

/**
 * Afficher la configuration actuelle
 */
export function showSecurityConfig() {
    console.log('📋 Configuration de sécurité actuelle:', CHAT_SECURITY_CONFIG);
    return CHAT_SECURITY_CONFIG;
}

export default CHAT_SECURITY_CONFIG;
