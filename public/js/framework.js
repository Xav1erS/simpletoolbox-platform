
const STBFramework = {
    config: {
        themeStorageKey: 'stb-theme',
        historyStorageKey: 'stb-tool-history',
        favoritesStorageKey: 'stb-tool-favorites'
    },

    init: function() {
        this.initTheme();
        this.initMobileMenu();
        this.initCopyrightYear();
        this.initToastContainer();
        console.log('STB Framework initialized');
    },

    initTheme: function() {
        const themeToggle = document.getElementById('stb-theme-toggle');
        if (!themeToggle) return;

        const savedTheme = localStorage.getItem(this.config.themeStorageKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme(currentTheme);
        
        themeToggle.addEventListener('click', () =&gt; {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.applyTheme(currentTheme);
            localStorage.setItem(this.config.themeStorageKey, currentTheme);
        });
    },

    applyTheme: function(theme) {
        document.body.className = theme;
        document.documentElement.className = theme;
        
        const themeToggle = document.getElementById('stb-theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'fas fa-moon';
                    themeToggle.setAttribute('aria-label', 'Switch to light theme');
                } else {
                    icon.className = 'fas fa-sun';
                    themeToggle.setAttribute('aria-label', 'Switch to dark theme');
                }
            }
        }
    },

    initMobileMenu: function() {
        const mobileMenuBtn = document.getElementById('stb-mobile-menu-btn');
        const mobileNavMenu = document.getElementById('stb-mobile-nav-menu');
        
        if (!mobileMenuBtn || !mobileNavMenu) return;

        mobileMenuBtn.addEventListener('click', () =&gt; {
            mobileNavMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (mobileNavMenu.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });

        document.addEventListener('click', (e) =&gt; {
            if (!mobileMenuBtn.contains(e.target) &amp;&amp; !mobileNavMenu.contains(e.target)) {
                mobileNavMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    },

    initCopyrightYear: function() {
        document.addEventListener('DOMContentLoaded', () =&gt; {
            const copyrightElements = document.querySelectorAll('.stb-footer-copyright, .footer-copyright');
            const currentYear = new Date().getFullYear();
            
            copyrightElements.forEach(el =&gt; {
                const text = el.innerHTML || el.textContent;
                if (text) {
                    el.innerHTML = text.replace(/202\d/, currentYear);
                }
            });
        });
    },

    initToastContainer: function() {
        if (!document.querySelector('.stb-toast-container')) {
            const container = document.createElement('div');
            container.className = 'stb-toast-container';
            document.body.appendChild(container);
        }
    },

    showToast: function(message, duration = 3000) {
        const container = document.querySelector('.stb-toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'stb-toast';
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() =&gt; {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() =&gt; toast.remove(), 300);
        }, duration);
    },

    copyToClipboard: async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!');
            return true;
        } catch (err) {
            console.error('Copy failed:', err);
            this.showToast('Failed to copy');
            return false;
        }
    },

    openSidebar: function(sidebarId) {
        const sidebar = document.getElementById(sidebarId);
        if (sidebar) {
            sidebar.classList.add('open');
        }
    },

    closeSidebar: function(sidebarId) {
        const sidebar = document.getElementById(sidebarId);
        if (sidebar) {
            sidebar.classList.remove('open');
        }
    },

    toggleSidebar: function(sidebarId) {
        const sidebar = document.getElementById(sidebarId);
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
    },

    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
        }
    },

    closeModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('open');
        }
    },

    getHistory: function(toolId) {
        const history = JSON.parse(localStorage.getItem(this.config.historyStorageKey) || '{}');
        return history[toolId] || [];
    },

    addHistory: function(toolId, item) {
        const history = JSON.parse(localStorage.getItem(this.config.historyStorageKey) || '{}');
        if (!history[toolId]) {
            history[toolId] = [];
        }
        history[toolId].unshift({
            ...item,
            id: Date.now(),
            timestamp: new Date().toISOString()
        });
        if (history[toolId].length &gt; 20) {
            history[toolId] = history[toolId].slice(0, 20);
        }
        localStorage.setItem(this.config.historyStorageKey, JSON.stringify(history));
        return history[toolId];
    },

    clearHistory: function(toolId) {
        const history = JSON.parse(localStorage.getItem(this.config.historyStorageKey) || '{}');
        history[toolId] = [];
        localStorage.setItem(this.config.historyStorageKey, JSON.stringify(history));
    },

    getFavorites: function(toolId) {
        const favorites = JSON.parse(localStorage.getItem(this.config.favoritesStorageKey) || '{}');
        return favorites[toolId] || [];
    },

    addFavorite: function(toolId, item) {
        const favorites = JSON.parse(localStorage.getItem(this.config.favoritesStorageKey) || '{}');
        if (!favorites[toolId]) {
            favorites[toolId] = [];
        }
        favorites[toolId].push({
            ...item,
            id: Date.now(),
            created: new Date().toISOString()
        });
        localStorage.setItem(this.config.favoritesStorageKey, JSON.stringify(favorites));
        this.showToast('Added to favorites');
        return favorites[toolId];
    },

    removeFavorite: function(toolId, favoriteId) {
        const favorites = JSON.parse(localStorage.getItem(this.config.favoritesStorageKey) || '{}');
        if (favorites[toolId]) {
            favorites[toolId] = favorites[toolId].filter(f =&gt; f.id !== favoriteId);
            localStorage.setItem(this.config.favoritesStorageKey, JSON.stringify(favorites));
        }
    },

    formatNumber: function(num) {
        if (num === 0) return '0';
        if (Math.abs(num) &gt;= 1000) {
            return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        if (Math.abs(num) &gt;= 0.01) {
            return num.toFixed(4).replace(/\.?0+$/, '');
        }
        return num.toExponential(4);
    },

    validateEmail: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () =&gt; {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    generateFeatureCards: function(features, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        features.forEach(feature =&gt; {
            const card = document.createElement('div');
            card.className = 'stb-feature-card';
            card.innerHTML = `
                &lt;div class="stb-feature-icon-wrapper"&gt;
                    &lt;i class="fas ${feature.icon} stb-feature-icon"&gt;&lt;/i&gt;
                &lt;/div&gt;
                &lt;h3 class="stb-feature-title"&gt;${feature.title}&lt;/h3&gt;
                &lt;p class="stb-feature-description"&gt;${feature.description}&lt;/p&gt;
            `;
            container.appendChild(card);
        });
    },
    
    generateWhyChooseSection: function(toolName, subtitle, features, socialProof = null) {
        const section = document.createElement('section');
        section.className = 'stb-why-choose-section';
        
        let html = `
            &lt;div class="stb-container"&gt;
                &lt;div class="stb-section-header"&gt;
                    &lt;h2 class="stb-section-title"&gt;Why Choose Our ${toolName}?&lt;/h2&gt;
                    &lt;p class="stb-section-subtitle"&gt;${subtitle}&lt;/p&gt;
                &lt;/div&gt;
                &lt;div class="stb-features-grid" id="why-choose-features"&gt;&lt;/div&gt;
        `;
        
        if (socialProof) {
            html += `
                &lt;div class="stb-social-proof"&gt;
                    &lt;div class="stb-proof-item"&gt;
                        &lt;span class="stb-proof-number"&gt;${socialProof.users}+&lt;/span&gt;
                        &lt;span class="stb-proof-label"&gt;Happy Users&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div class="stb-proof-item"&gt;
                        &lt;span class="stb-proof-number"&gt;${socialProof.tools}+&lt;/span&gt;
                        &lt;span class="stb-proof-label"&gt;Free Tools&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div class="stb-proof-item"&gt;
                        &lt;span class="stb-proof-number"&gt;${socialProof.rating}&lt;/span&gt;
                        &lt;span class="stb-proof-label"&gt;Rating&lt;/span&gt;
                    &lt;/div&gt;
                &lt;/div&gt;
            `;
        }
        
        html += '&lt;/div&gt;';
        section.innerHTML = html;
        
        return section;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    STBFramework.init();
});
