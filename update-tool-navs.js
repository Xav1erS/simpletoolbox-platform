const fs = require('fs');
const path = require('path');

const toolPages = [
    'public/tools/image-background-remover/index.html',
    'public/tools/image-resizer-online/index.html',
    'public/tools/pdf-to-word-converter/index.html',
    'public/tools/youtube-thumbnail-downloader/index.html'
];

const newNavDesktop = `                    &lt;nav class="stb-nav-desktop"&gt;
                        &lt;a href="/" class="stb-nav-link"&gt;Home&lt;/a&gt;
                        &lt;div class="stb-nav-dropdown"&gt;
                            &lt;a href="/tools" class="stb-nav-link stb-nav-dropdown-toggle"&gt;
                                Tools &lt;i class="fas fa-chevron-down" style="font-size: 10px;"&gt;&lt;/i&gt;
                            &lt;/a&gt;
                            &lt;div class="stb-nav-dropdown-menu"&gt;
                                &lt;a href="/tools/password-generator" class="stb-nav-dropdown-item"&gt;
                                    &lt;i class="fas fa-key"&gt;&lt;/i&gt; Password Generator
                                &lt;/a&gt;
                                &lt;a href="/tools/unit-converter" class="stb-nav-dropdown-item"&gt;
                                    &lt;i class="fas fa-ruler-combined"&gt;&lt;/i&gt; Unit Converter
                                &lt;/a&gt;
                                &lt;a href="/tools/image-background-remover" class="stb-nav-dropdown-item"&gt;
                                    &lt;i class="fas fa-cut"&gt;&lt;/i&gt; Image Background Remover
                                &lt;/a&gt;
                                &lt;a href="/tools/image-resizer-online" class="stb-nav-dropdown-item"&gt;
                                    &lt;i class="fas fa-expand-alt"&gt;&lt;/i&gt; Image Resizer
                                &lt;/a&gt;
                                &lt;div class="stb-nav-divider"&gt;&lt;/div&gt;
                                &lt;a href="/tools/json-formatter-tool" class="stb-nav-dropdown-item"&gt;
                                    &lt;i class="fas fa-code"&gt;&lt;/i&gt; JSON Formatter
                                &lt;/a&gt;
                                &lt;a href="/tools/random-number-generator" class="stb-nav-dropdown-item"&gt;
                                    &lt;i class="fas fa-dice"&gt;&lt;/i&gt; Random Number Generator
                                &lt;/a&gt;
                                &lt;a href="/tools/word-counter-tool" class="stb-nav-dropdown-item"&gt;
                                    &lt;i class="fas fa-font"&gt;&lt;/i&gt; Word Counter
                                &lt;/a&gt;
                                &lt;a href="/tools/pdf-to-word-converter" class="stb-nav-dropdown-item"&gt;
                                    &lt;i class="fas fa-file-word"&gt;&lt;/i&gt; PDF to Word
                                &lt;/a&gt;
                                &lt;a href="/tools/youtube-thumbnail-downloader" class="stb-nav-dropdown-item"&gt;
                                    &lt;i class="fab fa-youtube"&gt;&lt;/i&gt; YouTube Thumbnail Downloader
                                &lt;/a&gt;
                            &lt;/div&gt;
                        &lt;/div&gt;
                        &lt;a href="/about.html" class="stb-nav-link"&gt;About&lt;/a&gt;
                        &lt;a href="/contact.html" class="stb-nav-link"&gt;Contact&lt;/a&gt;
                    &lt;/nav&gt;`;

const newNavActions = `                    &lt;div class="stb-nav-actions"&gt;
                        &lt;div class="stb-nav-search"&gt;
                            &lt;i class="fas fa-search stb-nav-search-icon"&gt;&lt;/i&gt;
                            &lt;input type="text" class="stb-nav-search-input" placeholder="Search tools..."&gt;
                        &lt;/div&gt;
                        &lt;button class="stb-button stb-button-icon" id="stb-theme-toggle" aria-label="Toggle theme"&gt;
                            &lt;i class="fas fa-moon"&gt;&lt;/i&gt;
                        &lt;/button&gt;
                        &lt;button class="stb-button stb-button-icon stb-mobile-menu-btn" id="stb-mobile-menu-btn" aria-label="Toggle menu"&gt;
                            &lt;i class="fas fa-bars"&gt;&lt;/i&gt;
                        &lt;/button&gt;
                    &lt;/div&gt;`;

const newMobileNav = `            &lt;nav class="stb-mobile-nav-menu" id="stb-mobile-nav-menu"&gt;
                &lt;div class="stb-mobile-nav-links"&gt;
                    &lt;a href="/" class="stb-mobile-nav-link"&gt;Home&lt;/a&gt;
                    &lt;a href="/tools" class="stb-mobile-nav-link"&gt;All Tools&lt;/a&gt;
                    &lt;div style="padding: 8px 12px; font-size: 12px; font-weight: 600; color: var(--linear-text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;"&gt;Popular Tools&lt;/div&gt;
                    &lt;a href="/tools/password-generator" class="stb-mobile-nav-link"&gt;&lt;i class="fas fa-key" style="margin-right: 8px; color: var(--linear-primary);"&gt;&lt;/i&gt; Password Generator&lt;/a&gt;
                    &lt;a href="/tools/unit-converter" class="stb-mobile-nav-link"&gt;&lt;i class="fas fa-ruler-combined" style="margin-right: 8px; color: var(--linear-primary);"&gt;&lt;/i&gt; Unit Converter&lt;/a&gt;
                    &lt;a href="/tools/image-background-remover" class="stb-mobile-nav-link"&gt;&lt;i class="fas fa-cut" style="margin-right: 8px; color: var(--linear-primary);"&gt;&lt;/i&gt; Image Background Remover&lt;/a&gt;
                    &lt;a href="/tools/json-formatter-tool" class="stb-mobile-nav-link"&gt;&lt;i class="fas fa-code" style="margin-right: 8px; color: var(--linear-primary);"&gt;&lt;/i&gt; JSON Formatter&lt;/a&gt;
                    &lt;div style="padding: 8px 12px; font-size: 12px; font-weight: 600; color: var(--linear-text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;"&gt;More Tools&lt;/div&gt;
                    &lt;a href="/tools/image-resizer-online" class="stb-mobile-nav-link"&gt;Image Resizer&lt;/a&gt;
                    &lt;a href="/tools/random-number-generator" class="stb-mobile-nav-link"&gt;Random Number Generator&lt;/a&gt;
                    &lt;a href="/tools/word-counter-tool" class="stb-mobile-nav-link"&gt;Word Counter&lt;/a&gt;
                    &lt;a href="/tools/pdf-to-word-converter" class="stb-mobile-nav-link"&gt;PDF to Word&lt;/a&gt;
                    &lt;a href="/tools/youtube-thumbnail-downloader" class="stb-mobile-nav-link"&gt;YouTube Thumbnail Downloader&lt;/a&gt;
                    &lt;div style="padding: 8px 12px; font-size: 12px; font-weight: 600; color: var(--linear-text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;"&gt;Company&lt;/div&gt;
                    &lt;a href="/about.html" class="stb-mobile-nav-link"&gt;About&lt;/a&gt;
                    &lt;a href="/contact.html" class="stb-mobile-nav-link"&gt;Contact&lt;/a&gt;
                    &lt;a href="/privacy.html" class="stb-mobile-nav-link"&gt;Privacy&lt;/a&gt;
                    &lt;a href="/terms.html" class="stb-mobile-nav-link"&gt;Terms&lt;/a&gt;
                &lt;/div&gt;
            &lt;/nav&gt;`;

const oldNavDesktopPattern = /                    &lt;nav class="stb-nav-desktop"&gt;[\s\S]*?                    &lt;\/nav&gt;/;
const oldNavActionsPattern = /                    &lt;div class="stb-nav-actions"&gt;[\s\S]*?                    &lt;\/div&gt;/;
const oldMobileNavPattern = /            &lt;nav class="stb-mobile-nav-menu" id="stb-mobile-nav-menu"&gt;[\s\S]*?            &lt;\/nav&gt;/;

toolPages.forEach(filePath =&gt; {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        content = content.replace(oldNavDesktopPattern, newNavDesktop);
        content = content.replace(oldNavActionsPattern, newNavActions);
        content = content.replace(oldMobileNavPattern, newMobileNav);
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    } else {
        console.log(`File not found: ${filePath}`);
    }
});

console.log('Navigation update completed!');
