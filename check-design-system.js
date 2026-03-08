const fs = require('fs');
const path = require('path');

const TOOLS_DIR = path.join(__dirname, 'public', 'tools');
const PUBLIC_DIR = path.join(__dirname, 'public');

const checks = {
    customCSSVariables: {
        name: '自定义 CSS 变量检查',
        pattern: /:root\s*\{[^}]*--[a-z]/i,
        shouldPass: false,
        errorMessage: '发现自定义的 :root 变量定义'
    },
    linearVariables: {
        name: '--linear-* 变量使用检查',
        pattern: /--linear-[a-z-]+/i,
        shouldPass: true,
        errorMessage: '未使用 --linear-* 变量'
    },
    actionButtonClass: {
        name: '按钮类名检查',
        pattern: /class="[^"]*action-button[^"]*"/i,
        shouldPass: true,
        errorMessage: '未使用 .action-button 类名'
    },
    forbiddenBtnClass: {
        name: '禁止的 .btn 类名检查',
        pattern: /class="[^"]*\bbtn\b[^"]*"/i,
        shouldPass: false,
        errorMessage: '发现禁止的 .btn 类名'
    },
    themeClass: {
        name: '主题类名检查',
        pattern: /<(html|body)[^>]*class="[^"]*dark[^"]*"/i,
        shouldPass: true,
        errorMessage: '未使用 class="dark" 主题机制'
    },
    dataThemeAttribute: {
        name: 'data-theme 属性检查',
        pattern: /data-(bs-)?theme=/i,
        shouldPass: false,
        errorMessage: '发现禁止的 data-theme 属性'
    },
    stbThemeLocalStorage: {
        name: 'localStorage 键名检查',
        pattern: /localStorage\.(set|get)Item\(['"]stb-theme['"]/i,
        shouldPass: true,
        errorMessage: '未使用 stb-theme 作为 localStorage 键名'
    },
    forbiddenThemeKey: {
        name: '禁止的 theme 键名检查',
        pattern: /localStorage\.(set|get)Item\(['"](?!stb-theme)[a-z_-]*theme[a-z_-]*['"]/i,
        shouldPass: false,
        errorMessage: '发现禁止的自定义 theme localStorage 键名'
    },
    brandName: {
        name: '品牌标识检查',
        pattern: /Simple Toolbox/i,
        shouldPass: true,
        errorMessage: '未找到 "Simple Toolbox" 品牌标识'
    },
    pageLoadedEvent: {
        name: 'pageLoaded 事件监听检查',
        pattern: /addEventListener\s*\(\s*['"]pageLoaded['"]/i,
        shouldPass: true,
        errorMessage: '未监听 pageLoaded 事件'
    },
    designSystemCSS: {
        name: 'design-system.css 引入检查',
        pattern: /link[^>]*href="[^"]*design-system\.css/i,
        shouldPass: true,
        errorMessage: '未引入 design-system.css'
    },
    spaRouterJS: {
        name: 'spa-router.js 引入检查',
        pattern: /script[^>]*src="[^"]*spa-router\.js/i,
        shouldPass: true,
        errorMessage: '未引入 spa-router.js'
    },
    mobileMenuButton: {
        name: '移动端菜单按钮检查',
        pattern: /id="mobile-menu-button"/i,
        shouldPass: true,
        errorMessage: '未找到移动端菜单按钮'
    },
    mobileNavMenu: {
        name: '移动端菜单检查',
        pattern: /id="mobile-nav-menu"/i,
        shouldPass: true,
        errorMessage: '未找到移动端菜单'
    }
};

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const results = {};
    
    for (const [key, check] of Object.entries(checks)) {
        const match = check.pattern.test(content);
        const passed = check.shouldPass ? match : !match;
        results[key] = {
            passed,
            name: check.name,
            message: passed ? '✓ 通过' : `✗ ${check.errorMessage}`
        };
    }
    
    return results;
}

function scanToolsDirectory() {
    const results = {};
    
    if (!fs.existsSync(TOOLS_DIR)) {
        console.error('工具目录不存在:', TOOLS_DIR);
        return results;
    }
    
    const toolDirs = fs.readdirSync(TOOLS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    for (const toolDir of toolDirs) {
        const indexPath = path.join(TOOLS_DIR, toolDir, 'index.html');
        if (fs.existsSync(indexPath)) {
            results[toolDir] = checkFile(indexPath);
        }
    }
    
    return results;
}

function scanPublicDirectory() {
    const results = {};
    
    if (!fs.existsSync(PUBLIC_DIR)) {
        console.error('public 目录不存在:', PUBLIC_DIR);
        return results;
    }
    
    const files = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith('.html'))
        .map(dirent => dirent.name);
    
    for (const file of files) {
        const filePath = path.join(PUBLIC_DIR, file);
        results[file] = checkFile(filePath);
    }
    
    return results;
}

function scanToolsIndexPage() {
    const results = {};
    const toolsIndexPath = path.join(TOOLS_DIR, 'index.html');
    if (fs.existsSync(toolsIndexPath)) {
        results['tools/index'] = checkFile(toolsIndexPath);
    }
    return results;
}

function printResults(results) {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║           设计系统合规性检查报告                                ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    
    let totalChecks = 0;
    let passedChecks = 0;
    
    for (const [toolName, toolResults] of Object.entries(results)) {
        console.log(`\n📁 ${toolName}:`);
        console.log('─'.repeat(60));
        
        for (const [key, result] of Object.entries(toolResults)) {
            totalChecks++;
            if (result.passed) passedChecks++;
            
            const statusIcon = result.passed ? '✅' : '❌';
            console.log(`  ${statusIcon} ${result.name}`);
            if (!result.passed) {
                console.log(`     ${result.message}`);
            }
        }
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log(`\n📊 总结: ${passedChecks}/${totalChecks} 项检查通过`);
    
    if (passedChecks === totalChecks) {
        console.log('\n🎉 所有检查通过！所有页面均符合设计系统规范。');
    } else {
        console.log(`\n⚠️  有 ${totalChecks - passedChecks} 项检查未通过，请查看上面的详细报告。`);
    }
    console.log('');
}

function main() {
    console.log('🔍 正在扫描所有页面...');
    const toolResults = scanToolsDirectory();
    const publicResults = scanPublicDirectory();
    const toolsIndexResults = scanToolsIndexPage();
    
    const allResults = {
        ...publicResults,
        ...toolsIndexResults,
        ...toolResults
    };
    
    if (Object.keys(allResults).length === 0) {
        console.log('未找到任何页面');
        return;
    }
    
    printResults(allResults);
    
    const hasFailures = Object.values(allResults).some(pageResults => 
        Object.values(pageResults).some(result => !result.passed)
    );
    
    process.exit(hasFailures ? 1 : 0);
}

main();
