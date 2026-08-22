/**
 * Sidor_box — Host 半（静态 Cordis 插件空壳）
 *
 * 工具箱独立附属插件的宿主侧服务面。静态形态下无 host RPC：
 * 所有依赖宿主的能力（看门狗 Host 事件、审批 Host 事件、防崩溃守护
 * 文件操作、版本检测文件扫描）均由客户端走「agent 代执行」降级路径完成，
 * 浏览器侧通过官方 /api（session.prompt queue）向 agent 发出指令。
 */
export function apply() {
  // 预留：静态 host 服务面。
}
