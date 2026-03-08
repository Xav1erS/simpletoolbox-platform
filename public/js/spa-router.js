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
        
        // 添加过渡类
        contentArea.classList.add('content-transition');
        
        // 短暂延迟后更新内容并激活过渡
        setTimeout(() => {
            contentArea.innerHTML = content;
            document.title = title;
            
            // 激活过渡
            setTimeout(() => {
                contentArea.classList.add('active');
            }, 10);
            
            // 移除过渡类（保持活动状态）
            setTimeout(() => {
                contentArea.classList.remove('content-transition');
                contentArea.classList.remove('active');
            }, config.transitionDuration + 50);
        }, 10);
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
        isLoading = true;
        
        // 显示加载指示器（可选）
        showLoadingIndicator();
        
        try {
            const { content, title } = await fetchPageContent(url);
            if (!content) return;
            
            // 更新内容
            updatePageContent(content, title);
            
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
        
        // 方法1: 检查是否存在页面特定的初始化函数
        if (typeof init !== 'undefined' && typeof init === 'function') {
            try {
                console.log('Calling page-specific init() function');
                init();
            } catch (e) {
                console.error('Error initializing page scripts:', e);
            }
        }
        
        // 方法2: 查找并执行所有script标签中的代码
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            // 跳过已执行的脚本（有src属性且非内联）
            if (script.src && !script.hasAttribute('data-reexecutable')) {
                return;
            }
            
            // 对于内联脚本，尝试重新执行（需要谨慎处理）
            if (!script.src && script.textContent.trim()) {
                // 检查是否包含DOMContentLoaded监听器
                if (script.textContent.includes('DOMContentLoaded')) {
                    console.log('Found script with DOMContentLoaded, attempting to re-execute');
                }
            }
        });
        
        // 方法3: 手动触发DOMContentLoaded的替代方案
        // 查找所有可能的初始化函数模式
        try {
            // 检查是否有工具特定的初始化函数
            if (typeof initEventListeners === 'function') {
                console.log('Calling initEventListeners()');
                initEventListeners();
            }
            if (typeof initBackgroundSelector === 'function') {
                console.log('Calling initBackgroundSelector()');
                initBackgroundSelector();
            }
            if (typeof loadDefaultModel === 'function') {
                console.log('Calling loadDefaultModel()');
                loadDefaultModel();
            }
            if (typeof initEnhancements === 'function') {
                console.log('Calling initEnhancements()');
                initEnhancements();
            }
        } catch (e) {
            console.error('Error calling tool-specific init functions:', e);
        }
        
        // 方法4: 触发自定义事件，让工具页面可以监听
        const customEvent = new CustomEvent('pageLoaded', { 
            detail: { url: window.location.href } 
        });
        document.dispatchEvent(customEvent);
        
        // 重新绑定事件监听器
        reattachEventListeners();
        
        console.log('Page scripts initialization complete');
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