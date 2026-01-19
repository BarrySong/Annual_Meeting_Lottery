
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LotteryMachine } from './components/LotteryMachine';
import { ParticipantManager } from './components/ParticipantManager';
import { PrizeManager } from './components/PrizeManager';
import { HistoryBoard } from './components/HistoryBoard';
import { SettingsManager } from './components/SettingsManager';
import { db } from './utils/firebase';
import { ref, onValue, set, update, onDisconnect } from 'firebase/database';
import { AppState, PageView, Participant, Prize, Winner, SiteConfig } from './types';

const INITIAL_PRIZES: Prize[] = [
  { id: '1', name: '特等奖', count: 1, drawnCount: 0, description: '神秘大奖', image: '🎁' },
  { id: '2', name: '一等奖', count: 3, drawnCount: 0, description: '新款智能手机', image: '📱' },
  { id: '3', name: '二等奖', count: 10, drawnCount: 0, description: '降噪耳机', image: '🎧' },
];

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('lottery');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Global State
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ 
    brandName: 'CYPRESSTEL', 
    eventName: 'Annual Gala 2025', 
    logoUrl: '' 
  });

  // 1. Firebase 实时监听
  useEffect(() => {
    const dataRef = ref(db, 'lottery_app');
    
    // 增加超时检测
    const timeoutId = setTimeout(() => {
      if (!isDataLoaded) {
        setConnectionError("连接超时。请检查：1. Firebase Database URL 是否正确；2. 数据库规则是否设为 true；3. 网络是否可访问 Firebase。");
      }
    }, 10000);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setParticipants(data.participants || []);
        setPrizes(data.prizes || []);
        setWinners(data.winners || []);
        setSiteConfig(data.siteConfig || { brandName: 'CYPRESSTEL', eventName: 'Annual Gala 2025' });
      } else {
        // 如果数据库为空，初始化默认值
        const defaultState = {
          participants: [],
          prizes: INITIAL_PRIZES,
          winners: [],
          siteConfig: { brandName: 'CYPRESSTEL', eventName: 'Annual Gala 2025', logoUrl: '' }
        };
        set(dataRef, defaultState);
      }
      setIsDataLoaded(true);
      setConnectionError(null);
      clearTimeout(timeoutId);
    }, (error) => {
      console.error("Firebase Error:", error);
      setConnectionError(`权限错误或连接被拒绝: ${error.message}`);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const syncToCloud = (updates: Partial<AppState>) => {
    update(ref(db, 'lottery_app'), updates);
  };

  const handleUpdateParticipants = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
    syncToCloud({ participants: newParticipants });
  };

  const handleUpdatePrizes = (newPrizes: Prize[]) => {
    setPrizes(newPrizes);
    syncToCloud({ prizes: newPrizes });
  };

  const handleUpdateSiteConfig = (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    syncToCloud({ siteConfig: newConfig });
  };

  const handleFullStateImport = (state: AppState) => {
    set(ref(db, 'lottery_app'), state);
  };

  const handleDrawComplete = (newWinners: Winner[]) => {
    const updatedWinners = [...winners, ...newWinners];
    const winnerIds = new Set(newWinners.map(w => w.participantId));
    const updatedParticipants = participants.map(p => 
        winnerIds.has(p.id) ? { ...p, isWinner: true } : p
    );

    let updatedPrizes = prizes;
    if (newWinners.length > 0) {
        const prizeId = newWinners[0].prizeId;
        updatedPrizes = prizes.map(p => 
            p.id === prizeId ? { ...p, drawnCount: p.drawnCount + newWinners.length } : p
        );
    }

    syncToCloud({
      winners: updatedWinners,
      participants: updatedParticipants,
      prizes: updatedPrizes
    });
  };

  const handleClearHistory = () => {
      if (window.confirm('确定要清空所有中奖记录吗？所有人员将重置为待抽取状态。')) {
          syncToCloud({
            winners: [],
            participants: participants.map(p => ({ ...p, isWinner: false })),
            prizes: prizes.map(p => ({ ...p, drawnCount: 0 }))
          });
      }
  };

  const availableCount = participants.filter(p => !p.isWinner).length;

  if (!isDataLoaded) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-brand-surface p-6 text-center">
        <div className={`w-16 h-16 border-4 ${connectionError ? 'border-red-500' : 'border-brand-primary border-t-transparent animate-spin'} rounded-full mb-6`}></div>
        <p className={`font-black tracking-widest uppercase mb-4 ${connectionError ? 'text-red-500' : 'text-brand-primary animate-pulse'}`}>
          {connectionError ? '连接失败' : 'Connecting to CypressCloud...'}
        </p>
        {connectionError && (
          <div className="max-w-md p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs leading-relaxed font-medium">
            {connectionError}
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 block w-full py-2 bg-red-500 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-red-600 transition-colors"
            >
              重试连接
            </button>
          </div>
        )}
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'lottery':
        return <LotteryMachine participants={participants} prizes={prizes} onDrawComplete={handleDrawComplete} />;
      case 'participants':
        return <ParticipantManager participants={participants} setParticipants={handleUpdateParticipants} />;
      case 'prizes':
        return <PrizeManager prizes={prizes} setPrizes={handleUpdatePrizes} />;
      case 'history':
        return <HistoryBoard winners={winners} participants={participants} prizes={prizes} onClearHistory={handleClearHistory} />;
      case 'settings':
        return <SettingsManager siteConfig={siteConfig} onUpdate={handleUpdateSiteConfig} onFullStateUpdate={handleFullStateImport} />;
      default:
        return <div>Not found</div>;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      onNavigate={setCurrentPage} 
      poolSize={availableCount}
      siteConfig={siteConfig}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
