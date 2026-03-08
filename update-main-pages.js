const fs = require('fs');
const path = require('path');

const mainPages = [
    'public/about.html',
    'public/contact.html',
    'public/privacy.html',
    'public/terms.html'
];

const newNavDesktop = `                    <nav class="stb-nav-desktop">
                        <a href="/" class="stb-nav-link">Home</a>
                        <div class="stb-nav-dropdown">
                            <a href="/tools" class="stb-nav-link stb-nav-dropdown-toggle">
                                Tools <i class="fas fa-chevron-down" style="font-size: 10px;"></i>
                            </a>
                            <div class="stb-nav-dropdown-menu">
                                <a href="/tools/password-generator" class="stb-nav-dropdown-item">
                                    <i class="fas fa-key"></i> Password Generator
                                </a>
                                <a href="/tools/unit-converter" class="stb-nav-dropdown-item">
                                    <i class="fas fa-ruler-combined"></i> Unit Converter
                                </a>
                                <a href="/tools/image-background-remover" class="stb-nav-dropdown-item">
                                    <i class="fas fa-cut"></i> Image Background Remover
                                </a>
                                <a href="/tools/image-resizer-online" class="stb-nav-dropdown-item">
                                    <i class="fas fa-expand-alt"></i> Image Resizer
                                </a>
                                <div class="stb-nav-divider"></div>
                                <a href="/tools/json-formatter-tool" class="stb-nav-dropdown-item">
                                    <i class="fas fa-code"></i> JSON Formatter
                                </a>
                                <a href="/tools/random-number-generator" class="stb-nav-dropdown-item">
                                    <i class="fas fa-dice"></i> Random Number Generator
                                </a>
                                <a href="/tools/word-counter-tool" class="stb-nav-dropdown-item">
                                    <i class="fas fa-font"></i> Word Counter
                                </a>
                                <a href="/tools/pdf-to-word-converter" class="stb-nav-dropdown-item">
                                    <i class="fas fa-file-word"></i> PDF to Word
                                </a>
                                <a href="/tools/youtube-thumbnail-downloader" class="stb-nav-dropdown-item">
                                    <i class="fab fa-youtube"></i> YouTube Thumbnail Downloader
                                </a>
                            </div>
                        </div>
                        <a href="/about.html" class="stb-nav-link">About</a>
                        <a href="/contact.html" class="stb-nav-link">Contact</a>
                    </nav>`;

const newNavActions = `                    <div class="stb-nav-actions">
                        <div class="stb-nav-search">
                            <i class="fas fa-search stb-nav-search-icon"></i>
                            <input type="text" class="stb-nav-search-input" placeholder="Search tools...">
                        </div>
                        <button class="stb-button stb-button-icon" id="stb-theme-toggle" aria-label="Toggle theme">
                            <i class="fas fa-moon"></i>
                        </button>
                        <button class="stb-button stb-button-icon stb-mobile-menu-btn" id="stb-mobile-menu-btn" aria-label="Toggle menu">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>`;

const newMobileNav = `            <nav class="stb-mobile-nav-menu" id="stb-mobile-nav-menu">
                <div class="stb-mobile-nav-links">
                    <a href="/" class="stb-mobile-nav-link">Home</a>
                    <a href="/tools" class="stb-mobile-nav-link">All Tools</a>
                    <div style="padding: 8px 12px; font-size: 12px; font-weight: 600; color: var(--linear-text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;">Popular Tools</div>
                    <a href="/tools/password-generator" class="stb-mobile-nav-link"><i class="fas fa-key" style="margin-right: 8px; color: var(--linear-primary);"></i> Password Generator</a>
                    <a href="/tools/unit-converter" class="stb-mobile-nav-link"><i class="fas fa-ruler-combined" style="margin-right: 8px; color: var(--linear-primary);"></i> Unit Converter</a>
                    <a href="/tools/image-background-remover" class="stb-mobile-nav-link"><i class="fas fa-cut" style="margin-right: 8px; color: var(--linear-primary);"></i> Image Background Remover</a>
                    <a href="/tools/json-formatter-tool" class="stb-mobile-nav-link"><i class="fas fa-code" style="margin-right: 8px; color: var(--linear-primary);"></i> JSON Formatter</a>
                    <div style="padding: 8px 12px; font-size: 12px; font-weight: 600; color: var(--linear-text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;">More Tools</div>
                    <a href="/tools/image-resizer-online" class="stb-mobile-nav-link">Image Resizer</a>
                    <a href="/tools/random-number-generator" class="stb-mobile-nav-link">Random Number Generator</a>
                    <a href="/tools/word-counter-tool" class="stb-mobile-nav-link">Word Counter</a>
                    <a href="/tools/pdf-to-word-converter" class="stb-mobile-nav-link">PDF to Word</a>
                    <a href="/tools/youtube-thumbnail-downloader" class="stb-mobile-nav-link">YouTube Thumbnail Downloader</a>
                    <div style="padding: 8px 12px; font-size: 12px; font-weight: 600; color: var(--linear-text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;">Company</div>
                    <a href="/about.html" class="stb-mobile-nav-link">About</a>
                    <a href="/contact.html" class="stb-mobile-nav-link">Contact</a>
                    <a href="/privacy.html" class="stb-mobile-nav-link">Privacy</a>
                    <a href="/terms.html" class="stb-mobile-nav-link">Terms</a>
                </div>
            </nav>`;

mainPages.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        content = content.replace(
            /                    <nav class="stb-nav-desktop">[\s\S]*?                    <\/nav>/,
            (match) => {
                if (match.includes('stb-nav-dropdown')) {
                    return match;
                }
                let activeLink = '';
                if (filePath.includes('about.html')) activeLink = ' active';
                if (filePath.includes('contact.html')) activeLink = ' active';
                if (filePath.includes('privacy.html')) activeLink = '';
                if (filePath.includes('terms.html')) activeLink = '';
                
                return newNavDesktop.replace(
                    '<a href="/about.html" class="stb-nav-link">About</a>',
                    filePath.includes('about.html') 
                        ? '<a href="/about.html" class="stb-nav-link active">About</a>'
                        : '<a href="/about.html" class="stb-nav-link">About</a>'
                ).replace(
                    '<a href="/contact.html" class="stb-nav-link">Contact</a>',
                    filePath.includes('contact.html')
                        ? '<a href="/contact.html" class="stb-nav-link active">Contact</a>'
                        : '<a href="/contact.html" class="stb-nav-link">Contact</a>'
                );
            }
        );
        
        content = content.replace(
            /                    <div class="stb-nav-actions">[\s\S]*?                    <\/div>/,
            (match) => {
                if (match.includes('stb-nav-search')) {
                    return match;
                }
                return newNavActions;
            }
        );
        
        content = content.replace(
            /            <nav class="stb-mobile-nav-menu" id="stb-mobile-nav-menu">[\s\S]*?            <\/nav>/,
            (match) => {
                if (match.includes('Popular Tools')) {
                    return match;
                }
                return newMobileNav;
            }
        );
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    } else {
        console.log(`File not found: ${filePath}`);
    }
});

console.log('Main pages navigation update completed!');
