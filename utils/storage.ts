
export const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * 导出数据为文件 (保留作为紧急备份功能，不强制使用本地存储)
 */
export const exportData = (state: any) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", `lottery_cloud_backup_${new Date().getTime()}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

/**
 * 从 JSON 字符串解析数据
 */
export const importData = (jsonStr: string): any | null => {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.participants && parsed.prizes) {
      return parsed;
    }
    return null;
  } catch (e) {
    console.error("Import failed", e);
    return null;
  }
};
