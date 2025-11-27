// Universal Modal Manager - Electron compatible
class UniversalModal {
    constructor(modalId) {
        this.modalId = modalId;
        this.modal = null;
        this.init();
    }

    init() {
        // Wait for modal to be in DOM
        const checkModal = setInterval(() => {
            this.modal = document.getElementById(this.modalId);
            if (this.modal) {
                clearInterval(checkModal);
                this.setupListeners();
            }
        }, 50);
    }

    setupListeners() {
        if (!this.modal) return;

        // Close button
        const closeBtn = this.modal.querySelector('[data-modal-close]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Overlay click to close
        const overlay = this.modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });

        // Tab buttons
        const tabButtons = this.modal.querySelectorAll('.modal-tab-button');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    open() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    toggle() {
        if (this.modal) {
            this.modal.classList.toggle('active');
        }
    }

    switchTab(tabName) {
        if (!this.modal) return;

        // Hide all tabs
        const tabContents = this.modal.querySelectorAll('.modal-tab-content');
        tabContents.forEach(tab => tab.classList.remove('active'));

        // Remove active from all buttons
        const tabButtons = this.modal.querySelectorAll('.modal-tab-button');
        tabButtons.forEach(btn => btn.classList.remove('active'));

        // Show selected tab
        const selectedTab = this.modal.querySelector(`[data-tab="${tabName}"].modal-tab-content`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Activate selected button
        const selectedBtn = this.modal.querySelector(`[data-tab="${tabName}"].modal-tab-button`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
    }

    showMessage(message, type = 'success') {
        if (!this.modal) return;

        const body = this.modal.querySelector('.modal-body');
        const messageEl = document.createElement('div');
        messageEl.className = `modal-message modal-message-${type}`;
        messageEl.textContent = message;
        body.insertBefore(messageEl, body.firstChild);

        setTimeout(() => messageEl.remove(), 3000);
    }
}

