/**
 * ChatManager - Gestion du chat en temps réel avec localStorage
 * Multi-utilisateur sur réseau local via polling localStorage
 */

import ChatSecurityManager from './ChatSecurityManager.js';

class ChatManager {
    constructor(options = {}) {
        // Configuration des éléments
        this.pseudoWrapperId = options.pseudoWrapperId || 'chat-pseudo-input-wrapper';
        this.pseudoDisplayId = options.pseudoDisplayId || 'chat-pseudo-display';
        this.pseudoInputId = options.pseudoInputId || 'chat-pseudo-input';
        this.pseudoConfirmId = options.pseudoConfirmId || 'chat-pseudo-confirm';
        this.pseudoErrorId = options.pseudoErrorId || 'chat-pseudo-error';
        
        this.messagesContainerId = options.messagesContainerId || 'chat-messages';
        this.inputId = options.inputId || 'chat-input';
        this.sendButtonId = options.sendButtonId || 'chat-send';
        this.clearChatBtnId = options.clearChatBtnId || 'chat-clear-btn';
        
        // Configuration
        this.PSEUDO_MIN_LENGTH = 2;
        this.PSEUDO_MAX_LENGTH = 20;
        this.MESSAGE_MAX_LENGTH = 500;
        this.SYNC_INTERVAL = 500;
        this.MAX_MESSAGES = 100;
        this.STORAGE_KEY = 'chat_messages';
        this.PSEUDO_KEY = 'chatPseudo';
        
        // Initialiser le gestionnaire de sécurité
        this.securityManager = new ChatSecurityManager(options.securityConfig || {});
        
        // État
        this.pseudo = localStorage.getItem(this.PSEUDO_KEY) || null;
        this.messages = this.loadMessages();
        
        console.log('🔧 ChatManager créé');
        this.init();
    }

    /**
     * Initialiser le chat
     */
    init() {
        console.log('🚀 ChatManager.init() appelé');
        this.initialize();
    }

    /**
     * Initialisation complète
     */
    initialize() {
        if (this.isInitialized) {
            console.warn('⚠️ ChatManager déjà initialisé');
            return;
        }
        this.isInitialized = true;

        console.log('🔧 Initialisation en cours...');
        this.setupUI();
        this.attachEventListeners();
        this.displayMessages();
        this.startSync();
        
        console.log('✅ ChatManager initialisé avec succès');
    }

    /**
     * Configurer l'interface
     */
    setupUI() {
        console.log('🎨 setupUI()');
        
        const wrapper = document.getElementById(this.pseudoWrapperId);
        const display = document.getElementById(this.pseudoDisplayId);
        const input = document.getElementById(this.pseudoInputId);

        console.log('🔍 Vérification éléments:', {
            wrapper: this.pseudoWrapperId + ' = ' + (wrapper ? '✅' : '❌'),
            display: this.pseudoDisplayId + ' = ' + (display ? '✅' : '❌'),
            input: this.pseudoInputId + ' = ' + (input ? '✅' : '❌')
        });

        if (!wrapper || !display || !input) {
            console.error('❌ Éléments chat introuvables');
            console.log('IDs cherchés:', {
                wrapper: this.pseudoWrapperId,
                display: this.pseudoDisplayId,
                input: this.pseudoInputId
            });
            return;
        }

        if (this.pseudo) {
            console.log('✅ Pseudo trouvé, affichage mode confirmé');
            this.showPseudoConfirmed();
        } else {
            console.log('❌ Pas de pseudo, affichage mode saisie');
            this.showPseudoInput();
        }
    }

    /**
     * Afficher la zone d'entrée du pseudo
     */
    showPseudoInput() {
        const wrapper = document.getElementById(this.pseudoWrapperId);
        const display = document.getElementById(this.pseudoDisplayId);
        const input = document.getElementById(this.pseudoInputId);
        const confirmBtn = document.getElementById(this.pseudoConfirmId);

        if (wrapper) {
            wrapper.classList.remove('disabled');
            wrapper.style.display = 'flex';
        }
        if (display) display.style.display = 'none';
        if (input) {
            input.disabled = false;
            input.focus();
            input.value = this.pseudo || '';
        }
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Confirmer';
        }
    }

    /**
     * Afficher le pseudo confirmé
     */
    showPseudoConfirmed() {
        const wrapper = document.getElementById(this.pseudoWrapperId);
        const display = document.getElementById(this.pseudoDisplayId);
        const input = document.getElementById(this.pseudoInputId);
        const confirmBtn = document.getElementById(this.pseudoConfirmId);

        if (wrapper) {
            wrapper.classList.add('disabled');
            wrapper.style.display = 'flex';
        }
        if (display) {
            display.style.display = 'flex';
            display.innerHTML = `<strong>👤 ${this.escapeHtml(this.pseudo)}</strong>`;
        }

        if (input) {
            input.disabled = true;
            input.value = '';
        }
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Modifier';
        }
    }

    /**
     * Modifier le pseudo
     */
    modifyPseudo() {
        console.log('✏️ modifyPseudo()');
        this.pseudo = null;
        localStorage.removeItem(this.PSEUDO_KEY);
        this.showPseudoInput();
    }

    /**
     * Attacher les écouteurs d'événements
     */
    attachEventListeners() {
        console.log('🔗 Attachement écouteurs...');

        const confirmBtn = document.getElementById(this.pseudoConfirmId);
        const pseudoInput = document.getElementById(this.pseudoInputId);
        const sendBtn = document.getElementById(this.sendButtonId);
        const chatInput = document.getElementById(this.inputId);
        const clearBtn = document.getElementById(this.clearChatBtnId);

        console.log('🔍 Éléments trouvés:', {
            confirmBtn: !!confirmBtn,
            pseudoInput: !!pseudoInput,
            sendBtn: !!sendBtn,
            chatInput: !!chatInput,
            clearBtn: !!clearBtn
        });

        // Pseudo
        if (confirmBtn) {
            confirmBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔵 Clic confirmBtn');
                
                // Vérifier l'action selon le texte du bouton
                if (confirmBtn.textContent === 'Modifier') {
                    this.modifyPseudo();
                } else {
                    this.confirmPseudo();
                }
                return false;
            };
            console.log('✅ confirmBtn écouteur attaché');
        }

        if (pseudoInput) {
            pseudoInput.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    console.log('🔵 Enter pseudoInput');
                    this.confirmPseudo();
                }
            };
            console.log('✅ pseudoInput écouteur attaché');
        }

        // Messages
        if (sendBtn) {
            sendBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔵 Clic sendBtn');
                this.sendMessage();
                return false;
            };
            console.log('✅ sendBtn écouteur attaché');
        }

        if (chatInput) {
            chatInput.onkeypress = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    console.log('🔵 Enter chatInput');
                    this.sendMessage();
                }
            };
            console.log('✅ chatInput écouteur attaché');
        }

        if (clearBtn) {
            clearBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔵 Clic clearBtn');
                this.clearChat();
                return false;
            };
            console.log('✅ clearBtn écouteur attaché');
        }

        console.log('✅ Tous les écouteurs attachés');
    }

    /**
     * Valider le pseudo
     */
    validatePseudo(pseudo) {
        if (!pseudo || pseudo.trim().length < this.PSEUDO_MIN_LENGTH) {
            return `Minimum ${this.PSEUDO_MIN_LENGTH} caractères`;
        }
        if (pseudo.length > this.PSEUDO_MAX_LENGTH) {
            return `Maximum ${this.PSEUDO_MAX_LENGTH} caractères`;
        }
        if (!/^[a-zA-Z0-9_\-éèêëàâäùûüôöîïœæçÉÈÊËÀÂÄÙÛÜÔÖÎÏŒÆÇ ]+$/.test(pseudo)) {
            return 'Caractères non autorisés';
        }
        return null;
    }

    /**
     * Confirmer le pseudo
     */
    confirmPseudo() {
        console.log('🔐 confirmPseudo()');

        const input = document.getElementById(this.pseudoInputId);
        const errorDiv = document.getElementById(this.pseudoErrorId);

        if (!input) {
            console.error('❌ Input pseudo non trouvé');
            return;
        }

        const pseudo = input.value.trim();
        console.log('📝 Pseudo saisi:', pseudo);

        // Valider
        const error = this.validatePseudo(pseudo);
        if (error) {
            console.warn('⚠️ Erreur:', error);
            if (errorDiv) {
                errorDiv.textContent = error;
                errorDiv.style.display = 'block';
            }
            input.focus();
            return;
        }

        // Sauvegarder
        this.pseudo = pseudo;
        localStorage.setItem(this.PSEUDO_KEY, this.pseudo);
        console.log('✅ Pseudo confirmé et sauvegardé:', this.pseudo);

        if (errorDiv) errorDiv.style.display = 'none';

        this.showPseudoConfirmed();
        
        // Re-attacher les écouteurs pour les messages (au cas où)
        this.attachEventListeners();
    }

    /**
     * Envoyer un message
     */
    sendMessage() {
        console.log('📤 sendMessage()');
        console.log('👤 Pseudo:', this.pseudo);

        if (!this.pseudo) {
            console.warn('⚠️ Pseudo non défini');
            return;
        }

        const input = document.getElementById(this.inputId);
        if (!input) {
            console.error('❌ Input #' + this.inputId + ' non trouvé');
            return;
        }

        const message = input.value.trim();
        console.log('💬 Message:', message);

        if (!message) {
            console.warn('⚠️ Message vide');
            return;
        }

        if (message.length > this.MESSAGE_MAX_LENGTH) {
            console.warn('⚠️ Message trop long');
            return;
        }

        // Créer le message
        const msgObj = {
            pseudo: this.pseudo,
            message: message,
            timestamp: new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        };

        console.log('✅ Message créé:', msgObj);

        // Ajouter localement
        this.messages.push(msgObj);
        this.limitMessages();
        this.saveMessages();
        this.displayMessages();

        input.value = '';
        input.focus();

        console.log('✅ Message envoyé et affiché');
    }

    /**
     * Afficher les messages
     */
    displayMessages() {
        const container = document.getElementById(this.messagesContainerId);
        if (!container) return;

        container.innerHTML = '';

        if (this.messages.length === 0) {
            container.innerHTML = '<div class="chat-empty">Aucun message</div>';
        } else {
            this.messages.forEach((msg, idx) => {
                const msgElement = document.createElement('div');
                msgElement.className = msg.pseudo === this.pseudo ? 'chat-message mine' : 'chat-message other';
                
                // Créer les éléments enfants
                const pseudoEl = document.createElement('div');
                pseudoEl.className = 'chat-pseudo';
                pseudoEl.textContent = msg.pseudo;
                
                const contentEl = document.createElement('div');
                contentEl.className = 'chat-content';
                
                // Traiter le message pour les liens sécurisés
                // processMessage() retourne un DocumentFragment
                const messageContent = this.securityManager.processMessage(msg.message);
                contentEl.appendChild(messageContent);
                
                const timeEl = document.createElement('div');
                timeEl.className = 'chat-time';
                timeEl.textContent = msg.timestamp;
                
                msgElement.appendChild(pseudoEl);
                msgElement.appendChild(contentEl);
                msgElement.appendChild(timeEl);
                container.appendChild(msgElement);
            });
        }

        // Scroll vers le bas
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 0);
    }

    /**
     * Synchroniser depuis localStorage
     */
    startSync() {
        setInterval(() => {
            try {
                const stored = localStorage.getItem(this.STORAGE_KEY);
                if (stored) {
                    const messages = JSON.parse(stored);
                    // Si les messages ont changé, mettre à jour
                    if (JSON.stringify(messages) !== JSON.stringify(this.messages)) {
                        console.log('🔄 Synchronisation localStorage');
                        this.messages = messages;
                        this.displayMessages();
                    }
                }
            } catch (error) {
                console.error('❌ Erreur sync:', error);
            }
        }, this.SYNC_INTERVAL);
    }

    /**
     * Limiter le nombre de messages
     */
    limitMessages() {
        if (this.messages.length > this.MAX_MESSAGES) {
            this.messages = this.messages.slice(-this.MAX_MESSAGES);
        }
    }

    /**
     * Effacer le chat
     */
    clearChat() {
        if (!confirm('Effacer tous les messages ?')) return;

        this.messages = [];
        this.saveMessages();
        this.displayMessages();
        console.log('🗑️ Chat effacé');
    }

    /**
     * Sauvegarder les messages
     */
    saveMessages() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.messages));
            console.log('💾 Messages sauvegardés');
        } catch (error) {
            console.error('❌ Erreur sauvegarde:', error);
        }
    }

    /**
     * Charger les messages
     */
    loadMessages() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('❌ Erreur chargement:', error);
            return [];
        }
    }

    /**
     * Échapper les caractères HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

export default ChatManager;
