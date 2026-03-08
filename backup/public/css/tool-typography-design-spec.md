# Simple Toolbox - Tool Page Typography & Content Layout Design Specification

## Version 1.0
**Last Updated:** March 8, 2026
**Author:** Simple Toolbox Design Team

---

## 1. Overview

This document establishes comprehensive typography and content layout standards for all tool pages on the Simple Toolbox platform. The goal is to ensure consistent, professional, and user-friendly presentation across all tools.

## 2. Core Design Principles

### 2.1 Hierarchy
- Create clear visual distinction between different content types
- Guide users through information in logical reading order
- Emphasize important information without overwhelming the user

### 2.2 Readability
- Optimize line lengths and spacing for comfortable reading
- Ensure sufficient contrast between text and background
- Use appropriate font sizes for different content types

### 2.3 Consistency
- Maintain uniform styling across all tool pages
- Use consistent terminology and formatting
- Apply identical spacing and layout patterns

### 2.4 Scannability
- Break content into digestible sections
- Use headings, bullet points, and visual separators
- Highlight key information for quick reference

---

## 3. Typography System

### 3.1 Font Scale

| Element | Font Size | Font Weight | Line Height | Letter Spacing |
|---------|------------|--------------|-------------|----------------|
| Page Title (H1) | 2.5rem (40px) | 700 | 1.2 | -0.02em |
| Section Heading (H2) | 1.8rem (28.8px) | 700 | 1.3 | -0.01em |
| Subsection Heading (H3) | 1.5rem (24px) | 600 | 1.4 | 0 |
| Sub-subsection (H4) | 1.25rem (20px) | 600 | 1.4 | 0 |
| Body Text | 1rem (16px) | 400 | 1.7 | 0 |
| Small Text | 0.875rem (14px) | 400 | 1.6 | 0 |
| Caption/Tiny Text | 0.75rem (12px) | 400 | 1.5 | 0.01em |

### 3.2 Font Weights

- **Bold (700):** Page titles, section headings
- **Semi-bold (600):** Subsection headings, labels, feature titles
- **Medium (500):** Navigation links, button text
- **Regular (400):** Body text, descriptions, list items

### 3.3 Line Length Guidelines

- **Optimal:** 45-75 characters per line
- **Maximum:** 85 characters per line
- **Minimum:** 30 characters per line

### 3.4 Color System for Text

| Element | Color Variable | Purpose |
|---------|----------------|---------|
| Primary Text | `var(--linear-text)` | Main body text, headings |
| Secondary Text | `var(--linear-text-secondary)` | Descriptions, captions, less important text |
| Tertiary Text | `var(--linear-text-tertiary)` | Hints, disabled text, metadata |
| Accent/Highlight | `var(--linear-primary)` | Important information, links, highlights |
| Inverse Text | `var(--linear-text-inverse)` | Text on colored backgrounds |

---

## 4. Content Structure & Layout

### 4.1 Page Structure

All tool pages must follow this standard structure:

```
┌─────────────────────────────────────────┐
│          Navigation Bar                  │
├─────────────────────────────────────────┤
│  Breadcrumb Navigation                   │
├─────────────────────────────────────────┤
│  Tool Header (Title + Description)      │
├─────────────────────────────────────────┤
│  Main Tool Interface                     │
├─────────────────────────────────────────┤
│  Information Section(s)                  │
├─────────────────────────────────────────┤
│  Features Grid                           │
├─────────────────────────────────────────┤
│  Use Cases / Examples                    │
├─────────────────────────────────────────┤
│          Footer                          │
└─────────────────────────────────────────┘
```

### 4.2 Spacing System

#### Vertical Spacing (Margins)

| Element | Top Margin | Bottom Margin |
|---------|------------|----------------|
| Page Title (H1) | 0 | 1rem (16px) |
| Section Heading (H2) | 3rem (48px) | 1.25rem (20px) |
| Subsection Heading (H3) | 2rem (32px) | 0.75rem (12px) |
| Sub-subsection (H4) | 1.5rem (24px) | 0.5rem (8px) |
| Paragraph | 0 | 1rem (16px) |
| List Item | 0 | 0.5rem (8px) |
| Card/Component | 0 | 1.5rem (24px) |

#### Horizontal Spacing (Gaps)

| Context | Gap Size |
|---------|-----------|
| Grid Columns | 1.5rem (24px) |
| Card Grid | 1.5rem (24px) |
| Button Group | 1rem (16px) |
| Form Elements | 0.75rem (12px) |
| Icon + Text | 0.5rem (8px) |

#### Padding

| Element | Padding |
|---------|---------|
| Section Container | 0 1.5rem (24px) |
| Card | 1.5rem (24px) |
| Form Input | 0.75rem 1rem (12px 16px) |
| Button | 0.75rem 1.5rem (12px 24px) |

### 4.3 Container Widths

| Container | Max Width | Padding |
|-----------|-----------|---------|
| Full Width | None | 0 |
| Page Container | 1200px | 0 1.5rem (24px) |
| Narrow Container | 800px | 0 1.5rem (24px) |
| Tool Interface | 100% | 2rem (32px) |

---

## 5. Content Components

### 5.1 Headings

#### H1 - Page Title
```html
<h1 class="tool-page-title">Tool Name Here</h1>
```
- **Usage:** Once per page, main tool title
- **Styling:** Centered, gradient text option available

#### H2 - Section Heading
```html
<h2 class="section-heading">Section Title</h2>
```
- **Usage:** Major content sections
- **Styling:** Accent color, prominent spacing

#### H3 - Subsection Heading
```html
<h3 class="subsection-heading">Subsection Title</h3>
```
- **Usage:** Subsections within major sections
- **Styling:** Primary text color

#### H4 - Minor Heading
```html
<h4 class="minor-heading">Minor Title</h4>
```
- **Usage:** Smaller groupings, card titles
- **Styling:** Primary text color, medium weight

### 5.2 Paragraphs

```html
<p class="body-text">
    Regular body text goes here. Keep paragraphs concise and focused on a single idea.
</p>
```

**Guidelines:**
- Maximum 4-5 sentences per paragraph
- Aim for 2-3 sentences for better scannability
- Use line breaks between paragraphs

### 5.3 Lists

#### Unordered Lists
```html
<ul class="content-list">
    <li>List item with <strong>highlighted text</strong></li>
    <li>Another important point</li>
    <li>Additional information</li>
</ul>
```

#### Ordered Lists
```html
<ol class="content-list">
    <li>First step in the process</li>
    <li>Second action to take</li>
    <li>Final step complete</li>
</ol>
```

**List Guidelines:**
- Use descriptive list items
- Keep items concise (1-2 lines max)
- Highlight key terms within list items
- Use icons for visual enhancement when appropriate

### 5.4 Cards

#### Feature Card
```html
<div class="feature-card">
    <div class="feature-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <h3 class="feature-title">Feature Name</h3>
    <p class="feature-description">Brief description of the feature and its benefits.</p>
</div>
```

#### Info Card
```html
<div class="info-card">
    <h3 class="info-card-title">Card Title</h3>
    <p class="info-card-content">Card content goes here. Can include multiple paragraphs.</p>
    <ul class="info-card-list">
        <li>List item 1</li>
        <li>List item 2</li>
    </ul>
</div>
```

#### Use Case Card
```html
<div class="use-case-card">
    <div class="use-case-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <h4 class="use-case-title">Use Case Title</h4>
    <p class="use-case-description">Description of how to use the tool in this scenario.</p>
</div>
```

### 5.5 Highlighting & Emphasis

#### Bold Text
```html
<p>Use <strong>bold text</strong> for important keywords and key information.</p>
```
- **Usage:** Key terms, important warnings, critical information

#### Colored Text
```html
<p>Use <span class="accent-text">accent-colored text</span> for highlighting important information.</p>
```
- **Usage:** Links, important notes, callouts

#### Callout Boxes
```html
<div class="callout callout-info">
    <div class="callout-icon">
        <i class="fas fa-info-circle"></i>
    </div>
    <div class="callout-content">
        <strong>Info:</strong> This is an informational callout.
    </div>
</div>
```

**Callout Types:**
- `callout-info` - Blue, informational
- `callout-warning` - Yellow, warning
- `callout-success` - Green, success
- `callout-error` - Red, error/danger

### 5.6 Code Examples

```html
<div class="code-example">
    <h4 class="code-example-title">Example Title</h4>
    <pre><code>Your code here</code></pre>
</div>
```

**Guidelines:**
- Use monospace font for code
- Include syntax highlighting when possible
- Keep code examples focused and relevant
- Add explanations before/after code blocks

---

## 6. Information Sections

### 6.1 "What Is" Section
```html
<section class="info-section">
    <h2 class="section-heading">What Is [Tool Name]?</h2>
    <p class="body-text">
        Clear, concise explanation of what the tool does and its purpose.
    </p>
    <p class="body-text">
        Additional context about why users would need this tool.
    </p>
</section>
```

### 6.2 "How to Use" Section
```html
<section class="info-section">
    <h2 class="section-heading">How to Use This Tool</h2>
    <ol class="content-list">
        <li><strong>First step:</strong> Description of what to do</li>
        <li><strong>Second step:</strong> Next action in the process</li>
        <li><strong>Final step:</strong> Complete the task</li>
    </ol>
</section>
```

### 6.3 "Best Practices" Section
```html
<section class="info-section">
    <h2 class="section-heading">Best Practices</h2>
    <ul class="content-list">
        <li><strong>Practice 1:</strong> Explanation of best practice</li>
        <li><strong>Practice 2:</strong> Another recommendation</li>
        <li><strong>Practice 3:</strong> Additional tip for optimal results</li>
    </ul>
</section>
```

---

## 7. Features Grid

```html
<section class="features-section">
    <h2 class="section-heading">Key Features</h2>
    <div class="features-grid">
        <div class="feature-card">
            <i class="fas fa-icon-name feature-icon"></i>
            <h3 class="feature-title">Feature Name</h3>
            <p class="feature-description">Description of what this feature does and why it's valuable.</p>
        </div>
        <!-- Repeat for 3-6 features -->
    </div>
</section>
```

**Guidelines:**
- 3-6 features per grid
- Use meaningful icons from Font Awesome
- Keep descriptions concise (1-2 sentences)
- Highlight user benefits, not just features

---

## 8. Use Cases / Examples Section

```html
<section class="examples-section">
    <h2 class="section-heading">
        <i class="fas fa-lightbulb"></i> Common Use Cases
    </h2>
    <div class="examples-grid">
        <div class="example-card">
            <div class="example-icon">
                <i class="fas fa-icon-name"></i>
            </div>
            <h4 class="example-title">Use Case Title</h4>
            <p class="example-description">Detailed explanation of how to use the tool in this scenario.</p>
        </div>
        <!-- Repeat for 3-4 use cases -->
    </div>
    
    <div class="quick-tip">
        <h4 class="quick-tip-title">
            <i class="fas fa-graduation-cap"></i> Quick Tip
        </h4>
        <p class="quick-tip-content">Helpful hint or pro tip for getting the most out of the tool.</p>
    </div>
</section>
```

---

## 9. Responsive Design Guidelines

### 9.1 Breakpoints

| Breakpoint | Screen Width | Adjustments |
|------------|--------------|-------------|
| Mobile | < 768px | Stack columns, larger touch targets |
| Tablet | 768-1024px | Adjust grid columns, optimize spacing |
| Desktop | > 1024px | Full multi-column layout |

### 9.2 Typography Adjustments for Mobile

| Element | Desktop | Mobile |
|---------|---------|--------|
| H1 | 2.5rem | 2rem |
| H2 | 1.8rem | 1.5rem |
| H3 | 1.5rem | 1.25rem |
| Body Text | 1rem | 1rem |
| Padding | 1.5rem | 1rem |

### 9.3 Layout Adjustments

- **Grid columns:** Auto-collapse to 1 column on mobile
- **Button groups:** Stack vertically on mobile
- **Two-column layouts:** Stack vertically on mobile
- **Touch targets:** Minimum 44px height/width for interactive elements

---

## 10. Accessibility Guidelines

### 10.1 Contrast Ratios

- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text (18pt+):** Minimum 3:1 contrast ratio
- **Decorative text:** No requirement but still recommended

### 10.2 Semantic HTML

- Use `<h1>` to `<h6>` for headings in order
- Use `<ul>`/`<ol>` for lists
- Use `<nav>` for navigation
- Use `<main>` for main content
- Use `<section>` for content sections
- Use `<button>` for interactive buttons

### 10.3 ARIA Labels & Roles

```html
<button aria-label="Copy to clipboard">
    <i class="fas fa-copy"></i>
</button>

<div role="alert" aria-live="polite">
    Success message here
</div>
```

### 10.4 Keyboard Navigation

- All interactive elements must be reachable via keyboard
- Focus states must be clearly visible
- Tab order follows visual reading order
- Provide keyboard shortcuts for common actions

---

## 11. Implementation Checklist

### 11.1 Before Publishing

- [ ] All headings follow proper hierarchy (H1 > H2 > H3 > H4)
- [ ] Font sizes match the typography scale
- [ ] Spacing follows the spacing system
- [ ] Text colors use the defined color variables
- [ ] Line lengths are within optimal range (45-75 chars)
- [ ] All images have appropriate alt text
- [ ] All interactive elements are keyboard-accessible
- [ ] Contrast ratios meet accessibility standards
- [ ] Responsive design works on all breakpoints
- [ ] Content is scannable with proper section breaks
- [ ] Important information is properly highlighted

### 11.2 Quality Assurance

- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on multiple devices (desktop, tablet, mobile)
- [ ] Test in both light and dark themes
- [ ] Verify all links are working
- [ ] Check for typos and grammatical errors
- [ ] Ensure consistent terminology across all tools

---

## 12. References & Resources

### 12.1 Design System CSS
- File: `css/design-system.css`
- Contains all CSS variables and base styles

### 12.2 Font Awesome Icons
- Website: https://fontawesome.com/icons
- Version: 6.4.0

### 12.3 Additional Resources
- Material Design Typography Guidelines
- Web Content Accessibility Guidelines (WCAG) 2.1
- Nielsen Norman Group Usability Studies

---

## Appendices

### Appendix A: CSS Class Reference

```css
/* Typography Classes */
.tool-page-title { }
.section-heading { }
.subsection-heading { }
.minor-heading { }
.body-text { }
.small-text { }
.accent-text { }

/* Layout Classes */
.content-list { }
.features-grid { }
.examples-grid { }
.info-section { }

/* Component Classes */
.feature-card { }
.info-card { }
.use-case-card { }
.example-card { }
.callout { }
.code-example { }
.quick-tip { }
```

### Appendix B: Color Variables

```css
:root {
    --linear-primary: #6366f1;
    --linear-primary-hover: #4f46e5;
    --linear-text: #18181b;
    --linear-text-secondary: #71717a;
    --linear-text-tertiary: #a1a1aa;
    --linear-text-inverse: #ffffff;
    --linear-bg: #ffffff;
    --linear-bg-secondary: #f4f4f5;
    --linear-bg-tertiary: #e4e4e7;
    --linear-border: #d4d4d8;
    --linear-radius: 8px;
    --linear-radius-md: 12px;
    --linear-radius-lg: 16px;
}

[data-theme="dark"] {
    --linear-text: #f4f4f5;
    --linear-text-secondary: #a1a1aa;
    --linear-text-tertiary: #71717a;
    --linear-bg: #09090b;
    --linear-bg-secondary: #18181b;
    --linear-bg-tertiary: #27272a;
    --linear-border: #3f3f46;
}
```

---

**Document Status:** Final
**Next Review:** March 2027
**Maintainer:** Design Team
