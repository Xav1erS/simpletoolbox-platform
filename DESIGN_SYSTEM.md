# Simple ToolBox Design System

## 结论

这套设计系统延续当前站点的暗色、低噪声、工具导向视觉语言，但将样式拆成可维护的三层：

1. `token` 层：颜色、字号、圆角、间距、容器宽度、动效变量
2. `base` 层：全局 reset、排版、容器、栅格、文本样式
3. `components` 层：导航、卡片、按钮、输入框、pill、标签、通知、表格

入口样式文件：

- [public/styles/design-system.css](C:/Users/Windows11/Documents/GitHub/SimpleToolBox/public/styles/design-system.css)

拆分文件：

- [public/styles/design-tokens.css](C:/Users/Windows11/Documents/GitHub/SimpleToolBox/public/styles/design-tokens.css)
- [public/styles/design-base.css](C:/Users/Windows11/Documents/GitHub/SimpleToolBox/public/styles/design-base.css)
- [public/styles/design-components.css](C:/Users/Windows11/Documents/GitHub/SimpleToolBox/public/styles/design-components.css)

活文档示例页：

- [public/design-system.html](C:/Users/Windows11/Documents/GitHub/SimpleToolBox/public/design-system.html)

## 关键步骤

1. 所有新页面先引入 `styles/design-system.css`
2. 页面只允许覆写业务差异，不重复定义通用按钮、输入框、卡片和字号
3. 新组件先复用现有系统类，确实不够再扩展 `components` 层

## 视觉原则

1. 以深色底和弱对比边框为基础，不做高饱和大面积色块
2. 强调“功能优先”，组件表达清晰，装饰克制
3. 通过 accent 蓝紫色、mono 标签和细边框建立品牌识别
4. 状态变化以边框、底色和轻微位移为主，不依赖重动画

## Token 规范

### 颜色

- 页面底色：`--ds-color-bg`
- 一级面板：`--ds-color-surface`
- hover 面板：`--ds-color-surface-strong`
- 主文字：`--ds-color-text-primary`
- 次文字：`--ds-color-text-secondary`
- 弱提示：`--ds-color-text-muted`
- 主强调：`--ds-color-accent`
- Hover 强调：`--ds-color-accent-hover`
- 成功：`--ds-color-success`
- 危险：`--ds-color-danger`

### 圆角

- `xs = 4px`：微标签、计数角标
- `sm = 6px`：按钮、输入框、控件
- `md = 10px`：标准卡片、列表卡、侧栏卡
- `lg = 16px`：大模块卡
- `xl = 24px`：Hero 大面板

### 间距

- `8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64`
- 页面主内容优先使用 `16 / 20 / 24 / 32`
- 同一模块内不要混用过多 padding 值

## 排版层级

### 标题

- `display`：营销型 Hero 标题
- `h1`：页面主标题
- `h2`：大区块标题
- `h3`：卡片组标题
- `h4`：单卡片标题

### 正文

- `lead`：页面导语，`16px`
- `body`：标准正文，`14px`
- `body-sm`：辅助正文，`13px`
- `caption`：说明信息，`12px`
- `micro`：表头、状态标签，`11px`

### 使用规则

1. 一个页面只允许一个 `h1`
2. 卡片标题统一优先用 `h4`
3. 元信息、统计标签、toolbar 标签统一使用 `caption` 或 `micro`

## 容器与卡片规范

### 页面容器

- 全页：`1200px`
- 主内容：`1100px`
- 阅读型页面：`820px`

### 主内容容器

- 默认使用 `.ds-panel`
- 规格：`10px` 圆角，`1px` 边框，`28px` padding
- 紧凑版使用 `.ds-panel--compact`

### 二级卡片体系

- 标准信息卡：`.ds-card`
  - padding `20px`
  - 标题 `h4`
  - 适合工具卡、功能卡、统计卡
- 侧栏卡：`.ds-sidebar-card`
  - padding `20px`
  - 标题 `h4`
  - 内容更紧凑，推荐列表和提示信息
- 列表卡：`.ds-list-card`
  - padding `20px`
  - 单行信息为主，适合结果摘要和跳转项

## 交互控件规范

### 按钮

- 主按钮：`.ds-btn.ds-btn--primary`
- 次按钮：`.ds-btn.ds-btn--secondary`
- 幽灵按钮：`.ds-btn.ds-btn--ghost`
- 危险按钮：`.ds-btn.ds-btn--danger`

统一规则：

1. 默认高度 `38px`
2. 默认字号 `13px`
3. hover 允许 `translateY(-1px)`
4. focus 统一使用 `--ds-shadow-focus`

### 输入框 / 下拉 / 文本域

- 单行输入：`.ds-input`
- 下拉：`.ds-select`
- 多行：`.ds-textarea`

统一规则：

1. 单行控件高度 `40px`
2. 默认圆角 `6px`
3. 默认背景 `surface-soft`
4. focus 使用 accent 边框和淡色填充
5. 错误状态通过 `aria-invalid="true"` 标记

### Pill / Tag

- 过滤 pill：`.ds-pill`
- 选中状态：`.ds-pill.ds-pill--active`
- 小标签：`.ds-tag`

统一规则：

1. 过滤 pill 高度 `28px`
2. 小标签高度 `20px`
3. tag 统一使用 mono 字体

## 开发约束

1. 不要在单页里重复声明新的 `:root`
2. 不要新造 `btn-primary-2`、`input-dark-alt` 这类临时类名
3. 业务页面若只差 `gap`、`max-width`、布局方向，优先在页面级单独写布局类，不复制组件样式
4. 新控件要先判断是否属于系统已有类别：按钮、卡片、输入、pill、toolbar、notice
5. 只有在两个以上页面会复用时，才升级到 `components` 层

## 推荐迁移顺序

1. 先迁移导航、按钮、输入框、pill
2. 再迁移首页和 `all-tools` 的卡片
3. 最后迁移各工具页内部定制控件

## 最小接入示例

```html
<link rel="stylesheet" href="styles/design-system.css" />
```

```html
<section class="ds-shell ds-stack-6">
  <div class="ds-panel ds-stack-4">
    <h1 class="ds-heading-h1">Page Title</h1>
    <p class="ds-text-lead">Short page description.</p>
    <div class="ds-toolbar">
      <button class="ds-btn ds-btn--primary">Run</button>
      <button class="ds-btn ds-btn--secondary">Reset</button>
    </div>
  </div>
</section>
```
