import ClipboardJS from "clipboard";
import { message } from "ant-design-vue";

/**
 * 复制到剪切板
 * @param text 需要复制的文本
 */
export default async function copy(text: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const btn = document.createElement("button");
    btn.className = "hidden";
    btn.setAttribute("data-clipboard-text", text);
    document.body.append(btn);

    const clipboard = new ClipboardJS(btn);

    const destroy = () => {
      // 删除节点
      btn.remove();
      // 销毁clipboard
      clipboard.destroy();
    };

    clipboard.on("success", (e) => {
      destroy();
      e.clearSelection();
      message.success("已复制到剪切板");
      resolve(true);
    });

    clipboard.on("error", (e) => {
      console.error("Action:", e.action);
      console.error("Trigger:", e.trigger);
      destroy();
      reject();
    });
    // 模拟click
    btn.click();
  });
}
