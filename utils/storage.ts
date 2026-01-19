
import { AppState, Participant, Prize, Winner, SiteConfig } from '../types';

const STORAGE_KEY = 'cypresstel_lottery_data_v2';

// 扩展 AppState 类型以支持同步
declare module '../types' {
  interface AppState {
    lastUpdated: number;
    version: string;
  }
}

const INITIAL_STATE: AppState & { lastUpdated: number; version: string } = {
  participants: [],
  prizes: [
    { id: '1', name: '特等奖', count: 1, drawnCount: 0, description: '神秘大奖', image: '🎁' },
    { id: '2', name: '一等奖', count: 3, drawnCount: 0, description: '新款智能手机', image: '📱' },
    { id: '3', name: '二等奖', count: 10, drawnCount: 0, description: '降噪耳机', image: '🎧' },
  ],
  winners: [],
  siteConfig: {
    brandName: 'CYPRESSTEL',
    eventName: 'Annual Gala 2025',
    logoUrl: ''
  },
  lastUpdated: Date.now(),
  version: '2.0.0'
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return INITIAL_STATE;
    }
    const parsed = JSON.parse(serializedState);
    return { ...INITIAL_STATE, ...parsed };
  } catch (err) {
    console.error('Could not load state', err);
    return INITIAL_STATE;
  }
};

export const saveState = (state: AppState) => {
  try {
    const stateToSave = {
      ...state,
      lastUpdated: Date.now()
    };
    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem(STORAGE_KEY, serializedState);
    
    // 模拟云端同步逻辑
    // 如果你有 Firebase REST URL，可以取消下面的注释
    /*
    fetch('https://your-project.firebaseio.com/lottery.json', {
      method: 'PUT',
      body: serializedState
    });
    */
  } catch (err) {
    console.error('Could not save state', err);
  }
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * 导出数据为文件
 */
export const exportData = (state: AppState) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", `lottery_backup_${new Date().getTime()}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

/**
 * 从 JSON 字符串导入数据
 */
export const importData = (jsonStr: string): AppState | null => {
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
