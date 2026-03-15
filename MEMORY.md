# SimpleToolBox Project Memory

## Pending Tasks

### [TODO] 抽取共享 nav 组件
将 nav 的 CSS + HTML + 交互逻辑提取到 `public/nav.js`，通过 JS 动态注入，彻底解决各页面 nav 不一致问题。

**执行步骤：**
1. 创建 `public/nav.js`，包含：
   - 注入 nav CSS（canonical 版本）
   - 注入 nav HTML（logo + search + actions）
   - 迁移 nav 交互逻辑（search dropdown、scrolled class、keyboard shortcut）
2. 更新 5 个二级页面（about/all-tools/contact/privacy/terms）：删除内联 nav CSS + HTML，改为 `<script src="nav.js"></script>`
3. 更新 21 个工具页（`public/tools/*.html`）：同上

**背景：**
目前每个页面都内联完整的 nav CSS + HTML，导致反复出现不一致。根本原因是复制粘贴漂移 + 各页面全局 `a { }` 规则不同。

---

## Project Overview
- **Stack**: Vanilla HTML/CSS/JS，无构建步骤
- **Structure**: `public/` 一级（index.html）、二级（about/all-tools/contact/privacy/terms）、三级工具页（`tools/*.html`）
- **Python**: 用 `python`（不是 `python3`，Windows 11 环境 `python3` 返回 exit code 49）

## Nav Canonical CSS
已统一应用到所有页面的 canonical nav 版本见会话历史。关键点：
- `.nav-logo` 需显式设置 `color: var(--text-primary); text-decoration: none;`（防止全局 `a { color: var(--accent); }` 覆盖）
- `.nav-logo:hover { text-decoration: none; }` 需单独声明（防止 `a:hover { text-decoration: underline; }` 覆盖）
- `.nav-logo-icon { background: none !important; ... }` 覆盖去掉渐变方框，显示纯图标
