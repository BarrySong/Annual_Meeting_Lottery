
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// 提供的 Firebase 配置信息
const firebaseConfig = {
  apiKey: "AIzaSyC5iFnCP1Trw0gEG4STqMdDu9dPHnE72EA",
  authDomain: "company-prize-draw.firebaseapp.com",
  projectId: "company-prize-draw",
  // 重要：请前往 Firebase Console -> Realtime Database 复制顶部的 https:// 链接
  // 如果是默认美区，通常是以下地址：
  databaseURL: "https://company-prize-draw-default-rtdb.firebaseio.com",
  storageBucket: "company-prize-draw.firebasestorage.app",
  messagingSenderId: "410939862329",
  appId: "1:410939862329:web:c77bd566eb4e304695cce8",
  measurementId: "G-KN6DCP7DQB"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
