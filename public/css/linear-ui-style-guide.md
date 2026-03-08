# Linear UI 风格设计规范与实现指南

## 1. 色彩与背景系统

### 1.1 背景基础
- **主要底色**：采用深黑或深灰作为主要底色，符合软件工程师等目标用户对暗色编程环境的偏好
- **背景层级**：提供3级背景层级区分
  - 一级背景：`--background` (240 10% 3.9%) - 深黑底色
  - 二级背景：`--background-secondary` (240 9% 7.5%) - 稍亮的深灰
  - 三级背景：`--background-tertiary` (240 8% 11%) - 最亮的深灰

### 1.2 颜色一致性
- 确保背景色值在不同设备和光线环境下保持一致性
- 使用HSL颜色模式，确保颜色的可预测性和一致性
- 为亮模式和暗模式分别定义颜色变量，确保视觉一致性

## 2. 光影与质感实现规范

### 2.1 渐变与流光效果
- **渐变系统**：
  - 主渐变：`linear-gradient(135deg, var(--accent-primary), var(--accent-info))`
  - 二级渐变：`linear-gradient(135deg, var(--background-secondary), var(--background-tertiary))`
- **流光效果**：
  - 实现方式：使用CSS动画和线性渐变
  - 动画名称：`linear-glow`
  - 动画时长：2秒
  - 动画曲线：ease-in-out
  - 动画迭代：无限循环

### 2.2 模糊与外发光处理
- **背景模糊(Backdrop Blur)**：
  - 标准模糊：`--backdrop-blur` (blur(20px))
  - 轻度模糊：`--backdrop-blur-light` (blur(10px))
  - 重度模糊：`--backdrop-blur-heavy` (blur(30px))
- **外发光效果**：
  - 主发光：`--glow-primary` (0 0 20px rgba(255, 255, 255, 0.1))
  - 二级发光：`--glow-secondary` (0 0 12px rgba(255, 255, 255, 0.08))
  - 强调发光：`--glow-accent` (0 0 24px rgba(99, 102, 241, 0.3))

### 2.3 微噪点纹理
- **噪点参数**：
  - 透明度：`--noise-opacity` (亮模式: 0.02, 暗模式: 0.05)
  - 大小：`--noise-size` (200px)
- **实现方式**：使用SVG数据URL作为背景图案
- **应用场景**：全局背景，打破纯色单调，不影响内容可读性

## 3. 界面元素设计规范

### 3.1 布局系统
- **布局规则**：极度简洁、对齐严谨的界面布局
- **间距系统**：
  - `--spacing-xs`: 0.25rem
  - `--spacing-sm`: 0.5rem
  - `--spacing-md`: 1rem
  - `--spacing-lg`: 1.5rem
  - `--spacing-xl`: 2rem
  - `--spacing-2xl`: 3rem
  - `--spacing-3xl`: 4rem
- **网格系统**：基于8px网格系统，确保元素对齐和空间一致性

### 3.2 描边标准
- **线条宽度**：统一使用1像素极细线条勾勒元素边界
- **线条颜色**：`--border-color`
- **线条透明度**：通过HSL颜色模式的alpha通道控制
- **圆角半径**：
  - `--radius-sm`: 0.25rem
  - `--radius-md`: 0.5rem
  - `--radius-lg`: 0.75rem
  - `--radius-xl`: 1rem
  - `--radius-full`: 999px

### 3.3 几何元素库
- **基础形状**：直线、直角、圆角矩形
- **使用场景**：
  - 按钮：圆角矩形，`--radius-md`
  - 卡片：圆角矩形，`--radius-lg`
  - 输入框：圆角矩形，`--radius-md`
  - 图标背景：圆角矩形，`--radius-md`

## 4. 动效与排版规范

### 4.1 微动效系统
- **交互反馈**：流畅但克制的交互反馈微动效
- **动效参数**：
  - 快速过渡：`--transition-fast` (0.15s ease)
  - 标准过渡：`--transition-normal` (0.3s ease)
  - 慢速过渡：`--transition-slow` (0.5s ease)
- **状态动效**：
  - 悬停：轻微上浮(2px)、阴影增强、边框颜色变深
  - 点击：轻微下沉(1px)、背景颜色变暗
  - 加载：旋转动画(0.8s linear infinite)

### 4.2 字体系统
- **字体选择**：选用字重较重、风格庄重的无衬线字体
- **字体家族**：
  - 基础字体：`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif`
  - 等宽字体：`'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace`
- **字体层级**：
  - 标题：`--font-size-2xl` (2rem)，字重700
  - 副标题：`--font-size-xl` (1.5rem)，字重600
  - 正文：`--font-size-base` (1rem)，字重400
  - 辅助文字：`--font-size-sm` (0.875rem)，字重400
  - 小号文字：`--font-size-xs` (0.75rem)，字重400
- **行高**：默认1.6，确保良好的可读性

## 5. 组件实现指南

### 5.1 导航组件
- **导航栏**：使用背景模糊效果，固定在顶部或左侧
- **品牌Logo**：使用渐变背景，添加轻微发光效果
- **主题切换按钮**：圆形按钮，悬停时显示发光效果

### 5.2 卡片组件
- **基础卡片**：使用1px边框，圆角半径`--radius-lg`
- **悬停效果**：轻微上浮，阴影增强，添加流光效果
- **内部布局**：使用统一的间距和对齐规则

### 5.3 按钮组件
- **主要按钮**：使用主渐变背景，悬停时显示发光效果
- **次要按钮**：使用背景色和边框，悬停时边框颜色变深
- **按钮高度**：最小高度40px，确保良好的点击区域

### 5.4 输入控件
- **输入框**：1px边框，圆角半径`--radius-md`
- **聚焦效果**：边框颜色变为主色调，添加轻微发光效果
- **输入反馈**：实时验证和错误提示

### 5.5 消息提示
- **错误提示**：红色边框和文字，浅红色背景
- **成功提示**：绿色边框和文字，浅绿色背景
- **提示图标**：使用简单的 emoji 图标增强视觉反馈

## 6. 响应式设计规范

### 6.1 断点设置
- **移动设备**：768px以下
- **平板设备**：768px - 1024px
- **桌面设备**：1024px以上

### 6.2 布局调整
- **移动设备**：垂直布局，导航栏在顶部
- **平板设备**：调整间距和组件大小
- **桌面设备**：三栏布局，导航栏在左侧，示例区在右侧

## 7. 性能优化建议

### 7.1 动画性能
- 使用`transform`和`opacity`属性进行动画，避免重排
- 对于复杂动画，使用`will-change`属性提示浏览器

### 7.2 资源优化
- 内联关键CSS，减少首屏加载时间
- 使用CSS变量减少重复代码，提高维护性
- 优化SVG噪点纹理，确保文件大小合理

## 8. 实现示例

### 8.1 基础布局结构
```html
<div class="layout-container">
  <nav class="navigation-area linear-backdrop-blur">
    <!-- 导航内容 -->
  </nav>
  <main class="main-content-area">
    <!-- 主要内容 -->
  </main>
  <aside class="examples-sidebar linear-backdrop-blur">
    <!-- 示例内容 -->
  </aside>
</div>
```

### 8.2 按钮实现
```html
<button class="action-button primary-action">
  <span>主要按钮</span>
</button>
<button class="action-button secondary-action">
  <span>次要按钮</span>
</button>
```

### 8.3 卡片实现
```html
<div class="card">
  <div class="card-header">
    <h3>卡片标题</h3>
  </div>
  <div class="card-body">
    <p>卡片内容</p>
  </div>
</div>
```

### 8.4 输入框实现
```html
<input type="text" class="input-field" placeholder="请输入内容">
```

## 9. 设计系统维护

### 9.1 变量管理
- 所有颜色、间距、圆角等设计参数通过CSS变量管理
- 暗模式和亮模式使用相同的变量名，通过选择器切换值

### 9.2 组件更新
- 当需要更新组件样式时，优先修改CSS变量
- 确保所有组件使用统一的设计参数，保持视觉一致性

### 9.3 文档更新
- 当设计规范发生变化时，及时更新本指南
- 为新添加的组件和功能添加相应的实现指南

## 10. 最佳实践与反模式

### 10.1 ✅ 最佳实践

#### 10.1.1 CSS 变量使用
- **直接使用设计系统变量**：始终使用 `--linear-*` 变量，不要重新定义
- **变量命名一致性**：遵循 `--linear-{category}-{name}` 的命名规范
- **主题变量统一**：亮模式和暗模式使用相同的变量名，通过选择器切换值

#### 10.1.2 类名使用
- **使用标准组件类名**：
  - 按钮：`.action-button`, `.primary-action`, `.secondary-action`
  - 导航：`.navigation-area`, `.nav-container`, `.nav-links`
  - 卡片：根据具体用途使用标准卡片类
- **避免自定义类名**：除非有特殊需求且经过设计系统审核

#### 10.1.3 主题切换
- **使用标准机制**：
  ```javascript
  // 正确做法
  document.body.className = theme;
  document.documentElement.className = theme;
  localStorage.setItem('stb-theme', theme);
  ```
- **保持一致性**：所有页面使用相同的主题切换逻辑
- **状态保持**：使用 `stb-theme` 作为 localStorage 键名

#### 10.1.4 页面结构
- **复制现有模板**：以 `password-generator` 为标准模板创建新页面
- **完整导航**：包含所有标准导航链接和移动端菜单
- **标准页脚**：使用统一的页脚结构和链接

#### 10.1.5 初始化事件
- **双重监听**：同时监听 `DOMContentLoaded` 和 `pageLoaded` 事件
  ```javascript
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pageLoaded', init);
  ```

### 10.2 ❌ 反模式 (禁止事项)

#### 10.2.1 CSS 变量反模式
- ❌ **不要定义自定义 :root 变量**
  ```css
  /* 错误做法 */
  :root {
      --primary: #165DFF;  /* 应该使用 --linear-primary */
      --bg: #ffffff;        /* 应该使用 --linear-bg */
  }
  ```

- ❌ **不要覆盖设计系统变量**
  ```css
  /* 错误做法 */
  .some-component {
      --linear-primary: #ff0000;  /* 不要修改全局变量 */
  }
  ```

#### 10.2.2 类名反模式
- ❌ **不要使用旧的/自定义按钮类名**
  ```html
  <!-- 错误做法 -->
  <button class="btn btn-primary">按钮</button>
  <button class="btn-outline">按钮</button>
  
  <!-- 正确做法 -->
  <button class="action-button primary-action">按钮</button>
  <button class="action-button secondary-action">按钮</button>
  ```

- ❌ **不要使用非标准的组件类名**

#### 10.2.3 主题切换反模式
- ❌ **不要使用 data-* 属性**
  ```html
  <!-- 错误做法 -->
  <html data-theme="dark">
  
  <!-- 正确做法 -->
  <html class="dark">
  <body class="dark">
  ```

- ❌ **不要使用自定义 localStorage 键名**
  ```javascript
  // 错误做法
  localStorage.setItem('custom_theme', theme);
  localStorage.setItem('unitly_theme', theme);
  
  // 正确做法
  localStorage.setItem('stb-theme', theme);
  ```

#### 10.2.4 导航结构反模式
- ❌ **不要修改品牌标识**
  ```html
  <!-- 错误做法 -->
  <span>Unit Converter</span>
  
  <!-- 正确做法 -->
  <span>Simple Toolbox</span>
  ```

- ❌ **不要省略导航链接或移动端菜单**

#### 10.2.5 页面初始化反模式
- ❌ **不要只监听 DOMContentLoaded**
  ```javascript
  // 错误做法 - SPA 导航时不会触发
  document.addEventListener('DOMContentLoaded', init);
  
  // 正确做法
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pageLoaded', init);
  ```

### 10.3 快速检查清单

在提交新页面之前，请确认：

- [ ] 没有定义自定义的 `:root` 变量
- [ ] 所有颜色使用 `--linear-*` 变量
- [ ] 按钮使用 `.action-button` 相关类名
- [ ] 主题使用 `class="dark"` 而非 `data-*` 属性
- [ ] localStorage 键名为 `stb-theme`
- [ ] 品牌标识为 "Simple Toolbox"
- [ ] 包含完整导航链接和移动端菜单
- [ ] 同时监听 `DOMContentLoaded` 和 `pageLoaded`
- [ ] 正确引入 `design-system.css` 和 `spa-router.js`

## 11. 总结

Linear UI风格通过深黑/深灰背景、柔和的渐变与流光效果、精细的光影处理和微噪点纹理，营造出独特的锋利质感和专业调性。本设计规范提供了详细的实现参数和代码示例，确保开发团队能够准确还原Linear UI风格的视觉效果，为用户提供一致、专业的界面体验。

**关键要点**：
- 始终使用 `--linear-*` CSS 变量，不要自定义
- 遵循标准类名约定
- 保持主题切换机制一致
- 复制现有页面模板确保一致性
- 使用检查清单验证新页面