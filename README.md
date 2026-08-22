# Sidor_box · SIDOR 工具箱（独立附属插件）

![DSH 插件](https://img.shields.io/badge/DeepSeek%20Harness-插件-4f86f7?style=flat-square&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNNyAwLjggOC42IDUuNCAxMy4yIDcgOC42IDguNiA3IDEzLjIgNS40IDguNiAwLjggNyA1LjQgNS40IFoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=)
![sidor-box](https://img.shields.io/badge/package-sidor--box-4f86f7?style=flat-square)
![cordis](https://img.shields.io/badge/cordis-plugin-7c6cf0?style=flat-square)
![静态持久化](https://img.shields.io/badge/形态-静态持久化-7c6cf0?style=flat-square)
![MIT](https://img.shields.io/badge/许可-MIT-2ea44f?style=flat-square)

![版本](https://img.shields.io/badge/版本-v1.0.0-4f86f7?style=flat-square)
![依赖](https://img.shields.io/badge/依赖-无%20Host%20RPC-8b5cf6?style=flat-square)
![零 Token](https://img.shields.io/badge/零%20Token-客户端检测-22c55e?style=flat-square)

![功能①峰谷价格](https://img.shields.io/badge/①-峰谷价格提示-f59e0b?style=flat-square)
![功能②完成通知](https://img.shields.io/badge/②-任务完成通知-38bdf8?style=flat-square)
![功能③看门狗](https://img.shields.io/badge/③-任务进度看门狗-ef4444?style=flat-square)
![功能④审批提醒](https://img.shields.io/badge/④-审批通知提醒-34d399?style=flat-square)
![功能⑤防崩溃](https://img.shields.io/badge/⑤-防崩溃守护-6366f1?style=flat-square)
![功能⑥版本检测](https://img.shields.io/badge/⑥-插件%20%26%20DSH%20版本检测-ec4899?style=flat-square)

DeepSeek Harness Web GUI 的 SIDOR 工具箱（独立分发仓库）。
与主皮肤 [Sidor_UI](../Sidor_UI) 是**互相独立的两个插件**——可单独安装，也可并存，
互不干扰（官方插槽 `settings.section` 按 `order` 自动排序共存）。

当前版本：**v1.0.0**（功能①–⑥完整）。

## 效果预览

点击图片可查看完整尺寸。

| 设置页 · 工具箱 | 轨道图标 |
|---|---|
| [![工具箱设置页](preview/tool%20box.png)](preview/tool%20box.png) | [![轨道图标](preview/icon.png)](preview/icon.png) |

## 功能

| # | 功能 | 说明 |
|---|---|---|
| ① | DeepSeek 峰谷价格提示 | 工作区右侧四芒星：高峰时段（北京时间 9:00-12:00、14:00-18:00）红色呼吸辉光，空闲时段白色闪耀呼吸辉光；每 30 秒自动刷新判定 |
| ② | Agent 任务完成提示 | Agent 完成回复时发送系统通知（跨网页提醒）；纯客户端 turnTail 检测，不消耗 token；未授权时改用界面 toast |
| ③ | Agent 任务进度查询（看门狗） | 监听任务是否卡住（运行中且 ≥10 秒无进展），两段倒计时：先浏览器提醒（不掐断、图标标红），再自动掐断 + 要求 Agent 自检；监听时长为 0 时插件不工作 |
| ④ | 审批通知提醒 | 工作区会话需要审批时，弹出系统通知并告知哪个对话需要处理（通知驻留直到处理）；界面审批卡探测 + Host 事件双通道 |
| ⑤ | 防崩溃守护 | 自动检测 DSH profile 路径并创建恢复存档；插件/环境变动前自动备份配置文件，滚动保留历史快照；生成 restore.cmd 一键回退脚本；双击轨道盾牌图标弹出二级确认界面直接备份；启动时环境安全检测，异常自动回退最近安全备份 |
| ⑥ | 插件与 DSH 版本检测 | 检测 DSH 客户端版本，并对用户安装的第三方插件（cordis.patch.yml 中非官方 @deepseek-ai 插件）查询最新版本：npm registry 优先；npm 未命中且有 GitHub 仓库（package.json `repository` 字段或手动绑定）时转查 GitHub releases/tags；可更新时右侧更新箭头图标标红；支持自动更新开关、手动绑定 GitHub 仓库与镜像基址 |

## 安装

### 懒人版

把你的 dsh 打开，对它说：

```
安装一下这个工具箱插件：https://github.com/AKI2253/Sidor_box
```

> 说明：dsh 助手会 `git clone` / 读取该仓库并自动完成安装。

### 本地版（PowerShell，无需 GitHub）

```powershell
cd <Sidor_box 仓库路径>
powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1            # 安装
powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1 -Remove    # 卸载
```

### 命令版（需 pnpm）

```sh
cd <harness 目录>
dsh plugin --profile web add <Sidor_box 仓库路径>
```

安装 = 复制包到 `%USERPROFILE%\.dsh\profiles\web\node_modules\sidor-box`
+ 在 profile 的 `cordis.patch.yml` 追加 `- insert: {id: sidor-box, name: sidor-box}`。
安装后**重启 DSH**，浏览器 `Ctrl+Shift+R` 硬刷新。

> 若此前装过动态形态（sidb-* 会话内插件），安装静态版并重启 DSH 后，
> 动态插件随进程退出自动消失，不会冲突；静态版与动态版的设置（localStorage）
> 共用同一批 key，一次填写即可迁移。

## 静态形态说明

Sidor_box 为**静态持久化插件**（install.ps1 安装到 profile，随 DSH 启动自动加载），
**无 host RPC 通道**。依赖宿主的能力（看门狗 Host 事件、审批 Host 事件、防崩溃
文件操作、版本检测文件扫描）由客户端在检测到 `host.call` 不可用后**自动降级为
「agent 代执行」**——通过官方 `/api`（session.prompt queue，零 token）向 Agent
发出指令，由 Agent 读取文件/执行操作后汇报。版本检测的 npm/GitHub 查询由浏览器
`fetch` 直接完成（静态形态同样可用）。

## 开发

| 文件 | 说明 |
|---|---|
| `src/sidor-box-client.js` | Client 半源码（插件函数体，`return { inject: ['timer'], apply(ctx) }`） |
| `scripts/client-wrapper.template.js` | ModuleLoader bundle 模板（闭包注入 React / styles / host / harness；host.call 一律 reject 触发静态降级） |
| `scripts/build-client.ps1` | 构建：源码内联 → `lib/client.js`（含 `node --check` 语法门禁） |
| `scripts/install.ps1` | 安装 / 卸载（UTF-8 安全读写 patch，可与其他插件并存） |
| `lib/client.js` | 构建产物（提交进仓库作为分发输出） |
| `lib/index.js` | Host 半空壳（静态形态无 host RPC） |
| `cordis.patch.yml` | bundle 补丁声明 |
| `preview/` | 效果截图 |

源码更新流程：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-client.ps1   # 重打 lib/client.js
powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1        # 重装到 profile
# 重启 DSH + Ctrl+Shift+R
```

> 打包注意事项见 [Sidor_UI 打包文档](../Sidor_UI/docs/PACKAGING.md)（同一条构建管线）。
> 后续功能开发的代码提示词见 [`docs/DEVELOPER_PROMPT.md`](docs/DEVELOPER_PROMPT.md)；
> UI 样式设计风格提示词见 [`docs/UI_STYLE_PROMPT.md`](docs/UI_STYLE_PROMPT.md)。

## 未来规划：Sidor 附属插件生态

Sidor_UI 按可扩展平台设计：官方插槽（Slot）的 list 型插槽天然支持多插件共存，
附属插件可无冲突接入设置页（`settings.section`）、侧边栏（`sidebar.footer.action`），
并复用余额数据。Sidor_box 是继 Sidor_UI 之后发布的第二个附属插件，后续功能
持续在「设置页工具箱」分区内以卡片形式扩展。

## 许可

MIT。SIDOR 品牌标识归本项目所有。
