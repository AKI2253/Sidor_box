# Sidor_box 工具箱 · 功能开发代码提示词

> 用途：当你要为 Sidor_box 添加新的工具箱功能时，把本文件作为开发提示词交给
> 编程 Agent（或自己作为开发备忘录）。它描述本插件的架构约束、代码模式与
> 必须遵守的静态形态降级规则，避免重复踩坑。

## 一、项目定位与形态

- Sidor_box 是 **DeepSeek Harness Web GUI 的静态持久化插件**（独立附属插件，
  与主皮肤 sidor-ui 互相独立、可并存）。
- **静态形态 = 无 host RPC 通道**：`host.call(...)` 在静态 wrapper 中**一律
  reject**，因此客户端所有 `try { await host.call(...) } catch (e) { /* 静态降级 */ }`
  分支是唯一且预期的宿主交互方式。
- 构建管线：编辑 `src/sidor-box-client.js` → `powershell -ExecutionPolicy Bypass
  -File .\scripts\build-client.ps1`（生成 `lib/client.js`，含语法门禁）→
  `.\scripts\install.ps1` 重装到 profile → **重启 DSH + Ctrl+Shift+R**。
- 产物必须提交：`lib/client.js` 是分发输出（.gitignore 明确不禁用）。

## 二、源码结构约定（src/sidor-box-client.js）

源码是**插件函数体**，形如：

```js
return {
  inject: ['timer'],          // 依赖声明（build 脚本会提取到 bundle 顶层）
  apply(ctx) {
    const slots = ctx.get('slots')
    if (slots === undefined) return
    // ... 功能实现
  },
}
```

- 形参注入面（由 wrapper 提供，勿自行声明）：`React, console, styles, host, harness`。
  另有浏览器全局 `window / document / fetch / setTimeout / AbortController` 可用。
- **禁止**：`import/require/TS/JSX`、`new Function/eval`、直接读写
  `process/Buffer`（静态形态不存在）。
- 生命周期：所有定时器 / observer / 事件监听必须用 `ctx.effect(() => { ...; return () => cleanup })`
  包裹，或用 `ctx.interval / ctx.timeout`（其返回值就是 disposer）。`slots.inject` 的注册
  由 Cordis 管理，无需手动清理。

## 三、新增一个工具箱功能的七步模板

1. **图标**：在文件顶部图标区新增 `ICON_XXX`（16/22 viewBox、stroke=currentColor、
   stroke-width 1.3，风格与官方图标一致）。
2. **store**：新增 `const sidXxx = { enabled, ... }` + `sidXxxListeners/Notify/Subscribe/Toggle`
  四件套；开关状态写入统一偏好 `sidPrefsSave()`（key 见第四节），初始化用
   `sidPrefsGet('xxxEnabled', true)` 恢复。
3. **轨道图标**：`function XxxIcon()` 组件 + `railRegisterModule({ id: 'sidor-xxx',
   order: N, active: () => sidXxx.enabled, render: () => React.createElement(XxxIcon) })`。
  仅 `React.createElement`，勿写 JSX；hover 提示用 `TooltipBox`；需要交互时加
   `onDoubleClick`/`onKeyDown`（参考 GuardIcon 的二级确认弹窗模式）。
4. **设置页卡片**：在 `ToolboxSettingsPage` 的 `.sid-toolbox-grid` 里加
   `<div className="sid-toolbox-card">`（小功能）或 `sid-toolbox-card sid-toolbox-guard`
   （全宽大卡片）。行内控件用 `Toggle / sid-toolbox-card-btn / sid-toolbox-input`。
5. **宿主能力（可选）**：若功能需要读 DSH 文件/环境变量/网络，优先在客户端完成
   （浏览器 fetch + localStorage）；无法客户端完成的，用 `sidPromptAgent('【SIDOR xxx】...')`
   向 agent 发指令（**必须显式触发或加冷却**，勿在自动检查里无脑发消息）。
6. **持久化**：任何用户设置都写入 localStorage（键见第四节），重启后恢复。
7. **样式**：新增 CSS 追加到 `styles.insert(\`...\`)` 模板字符串；**禁止在 CSS
   模板里出现反引号或 `${`**（会破坏模板）；颜色只用 `--dsw-alias-*` / `--dsw-specific-*`
   主题变量，不写死色值；亮暗主题都必须可读（按钮文字色注意对比度）。

## 四、localStorage 键约定（与动态形态共用）

| 键 | 内容 |
|---|---|
| `sidor.box.prefs` | 全部功能开关 + 看门狗计时（priceEnabled / notifyEnabled / approvalEnabled / watchEnabled / watchListenSec / watchKillSec） |
| `sidor.box.guard` | 防崩溃守护配置（enabled / profilePath / archivePath / maxBackups） |
| `sidor.box.upd` | 版本检测（enabled / red / checked / status / dshInstalled / dshLatest / plugins / manualRepos / ghBase / autoUpdate / lastAutoSig / lastChecked / lastAgentScanAt） |
| `sidor.box.notifiedSeq` | 任务完成通知的每会话基线 seq |

新增设置优先并入 `sidor.box.prefs`（统一读写函数 `sidPrefsGet / sidPrefsSave`）。

## 五、静态形态降级规则（重点）

- 所有 `host.call` 必须包在 try/catch；catch 分支写清楚「静态形态：由 agent 代执行」。
- **agent 指令冷却**：显式点击才发（如「立即检查更新」5 分钟冷却）；自动检查/自动
  扫描只更新状态文案，**不向 agent 发消息**。
- **浏览器 fetch 超时**：所有网络请求用 `sidFetchJson(url, timeoutMs)`（内部
  AbortController + race 双保险），禁止裸 `fetch` 无超时。
- **空结果诊断**：host 返回 ok 但数据为空时，状态行要提示可能原因（如沙箱阻止
  读取 profile 外文件），并给出替代路径（agent 代扫 / 手动绑定）。
- **GitHub 检测**：仓库来源优先级 = 手动绑定 `manualRepos[name]` > package.json
  `repository` 字段；支持 `ghBase` 镜像基址（默认 `https://api.github.com`）。
- **自动更新**：仅当 `autoUpdate` 开关开启且存在可更新项时，用快照签名
  `name@latest` 去重后向 agent 发合并更新指令（防重复刷屏）。

## 六、常见坑

- `ctx.timeout/ctx.interval` 在静态 wrapper 有 polyfill（浏览器 setTimeout/setInterval），
  但**依赖声明必须写 `inject: ['timer']`**（build 脚本从源码提取到 bundle 顶层，
  否则 Cordis 不装配 timer）。
- CSS 模板字符串内嵌反引号或 `${` 会导致构建产物语法破坏（node --check 会拦截）。
- React 组件里忘写 key 会在列表渲染时警告；列表项 key 用稳定唯一值。
- 双击/交互图标需 `cursor: pointer`（`.sid-rail-action`）并给键盘 `onKeyDown(Enter)`，
  保持可访问性。
- 状态字段（如看门狗 phase）更新后必须 `sidXxxNotify()` 驱动 UI，否则页面不刷新。
- 修改源码后务必重新构建 + 重装 + 重启 DSH，`lib/client.js` 必须与源码同步提交。
