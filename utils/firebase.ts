
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// 使用用户提供的最新配置
const firebaseConfig = {
  apiKey: "AIzaSyC5iFnCP1Trw0gEG4STqMdDu9dPHnE72EA",
  authDomain: "company-prize-draw.firebaseapp.com",
  projectId: "company-prize-draw",
  // 核心：Realtime Database 地址
  databaseURL: "https://company-prize-draw-default-rtdb.firebaseio.com",
  storageBucket: "company-prize-draw.firebasestorage.app",
  messagingSenderId: "410939862329",
  appId: "1:410939862329:web:c77bd566eb4e304695cce8",
  measurementId: "G-KN6DCP7DQB"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
