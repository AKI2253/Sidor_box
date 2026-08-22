# Sidor_box 工具箱 · UI 样式设计风格提示词

> 用途：当你要为 Sidor_box 新增界面元素（卡片、弹窗、轨道图标、toast、开关等）
> 时，把本文件作为样式设计提示词交给 UI Agent（或作为设计备忘录）。
> 目标是让所有新增界面与 SIDOR 既有视觉语言一致，且与 DSH 官方明暗主题无缝融合。

## 一、设计语言总览

SIDOR 工具箱的界面风格 = **官方原生质感 + 星野点缀**：

- 底色/边框/阴影全部走 DSH 主题变量，随官方明暗主题自动切换；
- 圆角统一 12px，小控件（按钮/输入框）8px，胶囊（开关轨道/徽章）999px；
- 文字层级：标题 14-16px/600，正文 12-13px/常规，辅助 12px/次级色；
- 视觉点缀克制：只有「四芒星」价格提示保留呼吸辉光动画（9.2s 周期，与星野皮肤
  同节奏），其余元素不做花哨动画（弹窗/toast 仅 0.16-0.24s 微动效）。

## 二、主题变量使用规范（禁止写死色值）

所有颜色/阴影/背景只允许以下变量（找不到就用括号里的降级值）：

| 用途 | 变量（降级） |
|---|---|
| 主文字 | `var(--dsw-alias-label-primary)` |
| 次级文字 | `var(--dsw-alias-label-secondary)` |
| 弱化文字 | `var(--dsw-alias-label-caption)` / `var(--dsw-alias-label-dimmed, rgba(127,127,127,.55))` |
| 卡片/页面背景 | `var(--dsw-alias-bg-l1, transparent)` / `var(--dsw-alias-bg-base)` |
| 浮层背景（弹窗/toast/tooltip） | `var(--dsw-specific-menu, var(--dsw-alias-bg-overlay, #16181e))` |
| 边框 | 卡片 `var(--dsw-alias-border-l1)`；控件 `var(--dsw-alias-border-l2)`；浮层 `var(--dsw-alias-border-inverted, var(--dsw-alias-border-l2, rgba(128,128,128,.35)))` |
| 阴影 | 浮层 `var(--dsw-shadow-lv3, 0 12px 40px rgba(0,0,0,.35))` |
| 品牌色（开关开启/主按钮/聚焦） | `var(--dsw-alias-brand-primary)` |
| 警示红（图标标红/高峰/低余额） | `var(--dsw-alias-state-error-primary, #e5534b)` |
| 输入框背景 | `var(--dsw-alias-input-bg, var(--dsw-alias-bg-base))` |
| 悬停背景 | `var(--dsw-alias-interactive-bg-hover)` |

**硬规则**：CSS 中不得出现 `#fff`/`#000`/任意十六进制色值（除上面降级值）；
主按钮文字色除外——若品牌色为亮色，按钮文字用 `#000` 以保证亮色主题可读
（已踩过坑：`#fff` 在亮色背景上不可见）。

## 三、组件样式速查

### 设置页卡片（.sid-toolbox-card）
- 布局：flex column，gap 8px，padding 12px 14px；
- 边框 `1px solid var(--dsw-alias-border-l1)`，圆角 12px；
- 小功能卡在 grid 中 `repeat(auto-fill, minmax(220px, 1fr))`；**全宽大卡**
  加 `.sid-toolbox-guard { grid-column: 1 / -1 }`（防崩溃守护、版本检测用）；
- 卡片头：图标（16px，次级色）+ 标题（14px/600）；图标组件 `<span className="sid-toolbox-card-ic">`。

### 行（.sid-toolbox-card-row）
- flex 横排，gap 8px，min-height 24px；
- 标签 `.sid-toolbox-card-row-label`：flex:1，13px，次级色，`word-break: break-all`
  （路径/版本长文本换行）；
- 多行之间纵向由卡片 gap 撑开。

### 按钮（.sid-toolbox-card-btn）
- 高 26px，padding 0 12px，边框 `1px solid var(--dsw-alias-border-l2)`，圆角 8px；
- 背景透明，主文字色；hover `var(--dsw-alias-interactive-bg-hover)`；
- 主操作（确认/重点）加 `.sid-guard-confirm-primary`：品牌色背景 + 黑色文字 + 600 字重。

### 输入框（.sid-toolbox-input）
- 高 30px，padding 0 10px，圆角 8px，输入背景 + 主文字色；
- focus：品牌色边框 + `box-shadow 0 0 0 2px color-mix(in srgb, var(--dsw-alias-brand-primary) 25%, transparent)`；
- 数字窄框 `.sid-toolbox-input-num`（flex 0 1 120-140px，右对齐）。

### 横向开关（.sid-toggle）
- 轨道 34×20，圆角 999px；关闭 `var(--dsw-alias-border-l2)`，开启品牌色；
- 滑块 16×16 白色圆点 + `translateX(14px)`，0.16s cubic-bezier(0.22,0.61,0.36,1)；
- `role="switch"` + aria-checked + aria-label（可访问性必须）。

### 浮层提示框（.sid-tooltip，轨道图标 hover）
- 绝对定位在图标左侧（`right: calc(100% + 10px)`，垂直居中）；
- 菜单背景 + 反转边框 + lv3 阴影 + 12px 圆角；title 600 + line 次级色；
- 入场 0.16s 位移动画；`white-space: nowrap`。

### 弹窗（.sid-guard-confirm-*，参考双击备份确认）
- 遮罩 `.sid-guard-confirm-overlay`：`position: fixed; inset: 0; z-index: 60;`
  `background: color-mix(in srgb, #000 45%, transparent)`，0.18s 淡入，flex 居中；
- 卡片 `.sid-guard-confirm-card`：`min(360px, calc(100vw - 48px))`，菜单背景 + 反转
  边框 + lv3 阴影 + 12px 圆角 + 0.2s 弹入（translateY(8px)+scale(0.98)→0/1）；
- 内容：头（图标+标题）、说明段落（12px 次级色）、等宽路径块
  （`ui-monospace, Consolas, monospace`，输入背景）、状态行、右对齐按钮组；
- 关闭：取消按钮 / 点遮罩（`e.target === e.currentTarget`）/ Esc 键（window keydown）。

### toast（.sid-notify-toast）
- 右上角固定（right 12px, top 16px, z-index 40），最大宽 `min(340px, calc(100vw - 32px))`；
- 菜单背景 + 反转边框 + lv3 阴影 + 12px 圆角，铃铛小图标 + 12px 正文；
- 入场 0.24s 下滑；4.2s 自动消失（ctx.timeout）。

### 右侧轨道（.sid-rail）
- `position: fixed; right: 12px; top: 50%; translateY(-50%); z-index: 10`；
- 图标 22×22 次级色，`pointer-events: none` 容器 + 每项 `auto`；
- 警示态（标红）加 `.warn { color: var(--dsw-alias-state-error-primary, #e5534b) }`；
- 可交互图标加 `.sid-rail-action { cursor: pointer }`。

## 四、动画节奏

- 唯一持续动画：四芒星 `sid-price-breathe`（9.2s）/ `sid-price-breathe-red`（9.2s 高峰）
  / `sid-price-twinkle`（3s）——与 Sidor_UI 星野皮肤呼吸节奏一致；
- 其余均为一次性入场微动效（0.16-0.24s，cubic-bezier(0.22,0.61,0.36,1)）；
- 动画都定义在 styles 模板内，命名 `sid-*` 前缀，避免与官方冲突。

## 五、可访问性与主题适配检查清单

- [ ] 亮色 + 暗色主题都测试：文字对比度（尤其按钮文字/占位符）；
- [ ] 所有交互元素有 `focus-visible` 反馈（开关聚焦环）；
- [ ] 图标有 `role="img"` + `aria-label`，弹窗有 `role="dialog" aria-modal="true"`；
- [ ] 双击交互同时提供键盘路径（Enter）；
- [ ] CSS 无写死色值（可用 grep 检查 `#[0-9a-fA-F]{3,6}` 除降级值外无命中）；
- [ ] CSS 模板字符串内无反引号 / `${`。
