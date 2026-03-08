// SPA Router for simpletoolbox.dev
// Intercepts internal navigation and loads content via fetch

(function() {
    'use strict';
    
    // 配置
    const config = {
        contentSelectors: ['.main-content-area', '.main', '.tools'],
        navigationSelector: '.navigation-area',
        transitionDuration: 300,
        // 内部链接选择器（排除外部链接和特殊链接）
        internalLinkSelector: 'a[href^="/"]:not([href*="://"]):not([data-no-spa])'
    };
    
    // 当前状态
    let currentUrl = window.location.href;
    let isLoading = false;
    
    // 添加CSS过渡样式
    const style = document.createElement('style');
    style.textContent = `
        .content-transition {
            opacity: 0;
            transform: translateY(10px);
            transition: opacity ${config.transitionDuration}ms ease, transform ${config.transitionDuration}ms ease;
        }
        .content-transition.active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // 获取目标页面的主要内容区域
    async function fetchPageContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            // 尝试使用多个选择器查找内容区域
            let content = null;
            for (const selector of config.contentSelectors) {
                content = doc.querySelector(selector);
                if (content) break;
            }
            
            if (!content) {
                throw new Error('Content area not found');
            }
            
            // 提取页面标题
            const title = doc.querySelector('title').textContent;
            
            return { content: content.innerHTML, title };
        } catch (error) {
            console.error('Failed to fetch page:', error);
            // 回退到整页加载
            window.location.href = url;
            return null;
        }
    }
    
    // 更新页面内容
    function updatePageContent(content, title) {
        // 尝试使用多个选择器查找内容区域
        let contentArea = null;
        for (const selector of config.contentSelectors) {
            contentArea = document.querySelector(selector);
            if (contentArea) break;
        }
        
        if (!contentArea) return;
        
        console.log('Updating page content...');
        
        // 保存当前body和html的class、data属性状态
        const savedBodyClasses = document.body.className;
        const savedBodyAttributes = {};
        for (let i = 0; i < document.body.attributes.length; i++) {
            const attr = document.body.attributes[i];
            if (attr.name.startsWith('data-')) {
                savedBodyAttributes[attr.name] = attr.value;
            }
        }
        
        const savedHtmlClasses = document.documentElement.className;
        const savedHtmlAttributes = {};
        for (let i = 0; i < document.documentElement.attributes.length; i++) {
            const attr = document.documentElement.attributes[i];
            if (attr.name.startsWith('data-')) {
                savedHtmlAttributes[attr.name] = attr.value;
            }
        }
        
        // 直接更新内容，不使用复杂的过渡效果以避免布局问题
        contentArea.innerHTML = content;
        document.title = title;
        
        // 确保body的class和data属性状态保持正确
        if (document.body.className !== savedBodyClasses) {
            console.log('Restoring body classes:', savedBodyClasses);
            document.body.className = savedBodyClasses;
        }
        for (const [name, value] of Object.entries(savedBodyAttributes)) {
            document.body.setAttribute(name, value);
        }
        
        // 确保html元素的class和data属性状态也正确
        if (document.documentElement.className !== savedHtmlClasses) {
            console.log('Restoring HTML classes:', savedHtmlClasses);
            document.documentElement.className = savedHtmlClasses;
        }
        for (const [name, value] of Object.entries(savedHtmlAttributes)) {
            document.documentElement.setAttribute(name, value);
        }
        
        // 确保所有主题相关的属性都正确设置
        if (!document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.add('dark');
        }
        if (!document.body.classList.contains('dark')) {
            document.body.classList.add('dark');
        }
        if (!document.documentElement.getAttribute('data-theme')) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        if (!document.documentElement.getAttribute('data-bs-theme')) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        }
        
        console.log('Page content updated successfully');
    }
    
    // 处理链接点击
    function handleLinkClick(event) {
        // 检查是否应该拦截
        const link = event.target.closest('a');
        if (!link) return;
        
        // 检查是否是内部链接
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
            return;
        }
        
        // 检查是否在同一域名下（相对路径）
        const targetUrl = new URL(href, window.location.origin);
        if (targetUrl.origin !== window.location.origin) {
            return;
        }
        
        // 阻止默认行为
        event.preventDefault();
        
        // 如果正在加载，忽略
        if (isLoading) return;
        
        // 如果已经是当前页面，忽略
        if (targetUrl.href === currentUrl) return;
        
        // 加载新页面
        navigateTo(targetUrl.href);
    }
    
    // 导航到新URL
    async function navigateTo(url) {
        console.log('Navigating to:', url);
        isLoading = true;
        
        // 保存当前页面状态
        const savedBodyClasses = document.body.className;
        const savedBodyAttributes = {};
        for (let i = 0; i < document.body.attributes.length; i++) {
            const attr = document.body.attributes[i];
            if (attr.name.startsWith('data-')) {
                savedBodyAttributes[attr.name] = attr.value;
            }
        }
        
        const savedHtmlClasses = document.documentElement.className;
        const savedHtmlAttributes = {};
        for (let i = 0; i < document.documentElement.attributes.length; i++) {
            const attr = document.documentElement.attributes[i];
            if (attr.name.startsWith('data-')) {
                savedHtmlAttributes[attr.name] = attr.value;
            }
        }
        
        console.log('Saved state - Body classes:', savedBodyClasses, 'HTML classes:', savedHtmlClasses);
        
        // 显示加载指示器（可选）
        showLoadingIndicator();
        
        try {
            const { content, title } = await fetchPageContent(url);
            if (!content) return;
            
            // 更新内容
            updatePageContent(content, title);
            
            // 恢复并确保状态正确
            if (document.body.className !== savedBodyClasses) {
                console.log('Restoring body classes to:', savedBodyClasses);
                document.body.className = savedBodyClasses;
            }
            for (const [name, value] of Object.entries(savedBodyAttributes)) {
                document.body.setAttribute(name, value);
            }
            
            if (document.documentElement.className !== savedHtmlClasses) {
                console.log('Restoring HTML classes to:', savedHtmlClasses);
                document.documentElement.className = savedHtmlClasses;
            }
            for (const [name, value] of Object.entries(savedHtmlAttributes)) {
                document.documentElement.setAttribute(name, value);
            }
            
            // 确保所有主题相关的属性都正确设置
            if (!document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.add('dark');
            }
            if (!document.body.classList.contains('dark')) {
                document.body.classList.add('dark');
            }
            if (!document.documentElement.getAttribute('data-theme')) {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
            if (!document.documentElement.getAttribute('data-bs-theme')) {
                document.documentElement.setAttribute('data-bs-theme', 'dark');
            }
            
            // 更新浏览器历史记录（pushState）
            window.history.pushState({}, title, url);
            currentUrl = url;
            
            // 滚动到顶部
            window.scrollTo(0, 0);
            
            // 重新初始化页面脚本
            setTimeout(() => {
                initializePageScripts();
            }, 100);
            
        } catch (error) {
            console.error('Navigation failed:', error);
            // 回退到整页加载
            window.location.href = url;
        } finally {
            isLoading = false;
            hideLoadingIndicator();
        }
    }
    
    // 初始化页面脚本
    function initializePageScripts() {
        console.log('Initializing page scripts...');
        
        // 首先确保主题一致性
        ensureThemeConsistency();
        
        // 触发自定义事件，让工具页面可以监听
        const customEvent = new CustomEvent('pageLoaded', { 
            detail: { url: window.location.href } 
        });
        document.dispatchEvent(customEvent);
        
        // 检查是否存在页面特定的初始化函数
        const initFunctions = ['init', 'initToolPage', 'initEventListeners', 'initBackgroundSelector', 'loadDefaultModel', 'initEnhancements'];
        initFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                try {
                    console.log(`Calling ${funcName}()`);
                    window[funcName]();
                } catch (e) {
                    console.error(`Error calling ${funcName}:`, e);
                }
            }
        });
        
        // 重新绑定事件监听器
        reattachEventListeners();
        
        console.log('Page scripts initialization complete');
    }
    
    // 确保主题一致性
    function ensureThemeConsistency() {
        console.log('Ensuring theme consistency...');
        
        const savedTheme = localStorage.getItem('stb-theme') || 'dark';
        
        // 确保 body 有正确的 class
        if (!document.body.classList.contains(savedTheme)) {
            document.body.className = savedTheme;
        }
        
        // 确保 html 有正确的 class
        if (!document.documentElement.classList.contains(savedTheme)) {
            document.documentElement.classList.add(savedTheme);
        }
        
        // 确保 html 有正确的 data 属性
        if (!document.documentElement.getAttribute('data-theme')) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
        if (!document.documentElement.getAttribute('data-bs-theme')) {
            document.documentElement.setAttribute('data-bs-theme', savedTheme);
        }
        
        console.log('Theme consistency ensured');
    }
    
    // 重新绑定事件监听器
    function reattachEventListeners() {
        // 这里可以添加通用的事件监听器重新绑定逻辑
        // 例如：按钮点击、表单提交等
        console.log('Event listeners reattached');
    }
    
    // 加载指示器
    function showLoadingIndicator() {
        // 可以添加一个顶部进度条或微调器
        // 这里简单实现一个半透明覆盖层
        let indicator = document.getElementById('spa-loading-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'spa-loading-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background-color: var(--accent-primary);
                z-index: 9999;
                transform: translateX(-100%);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(indicator);
        }
        indicator.style.transform = 'translateX(-50%)';
        setTimeout(() => {
            indicator.style.transform = 'translateX(0)';
        }, 10);
    }
    
    function hideLoadingIndicator() {
        const indicator = document.getElementById('spa-loading-indicator');
        if (indicator) {
            indicator.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }
    }
    
    // 处理浏览器前进/后退
    function handlePopState(event) {
        navigateTo(window.location.href);
    }
    
    // 初始化
    function init() {
        // 监听链接点击
        document.addEventListener('click', handleLinkClick);
        
        // 监听前进/后退
        window.addEventListener('popstate', handlePopState);
        
        // 标记当前页面为SPA启用
        document.documentElement.setAttribute('data-spa', 'enabled');
        
        console.log('SPA router initialized');
        
        // 初始化当前页面的脚本（解决首次加载问题）
        setTimeout(() => {
            console.log('Initializing scripts for initial page load');
            initializePageScripts();
        }, 100);
    }
    
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();