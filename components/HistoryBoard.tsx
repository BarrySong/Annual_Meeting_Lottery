import React from 'react';
import { Download, Trash2, Trophy, Clock, Sparkles } from 'lucide-react';
import { Winner, Participant, Prize } from '../types';

interface HistoryBoardProps {
  winners: Winner[];
  participants: Participant[];
  prizes: Prize[];
  onClearHistory: () => void;
}

export const HistoryBoard: React.FC<HistoryBoardProps> = ({ winners, participants, prizes, onClearHistory }) => {
  const enrichedWinners = winners.map(w => {
    const p = participants.find(part => part.id === w.participantId);
    const prize = prizes.find(pr => pr.id === w.prizeId);
    return {
        ...w,
        participantName: p?.name || '未知人员',
        participantCode: p?.code || '---',
        department: p?.department || '---',
        prizeName: prize?.name || '未知奖项',
    };
  }).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="flex flex-col gap-8 h-full pt-8 md:pt-12 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 px-4">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <Sparkles size={20} className="text-brand-primary" />
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">荣耀时刻</h2>
          </div>
          <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-[10px]">Annual Gala Winners History</p>
        </div>
        
        <div className="flex gap-3">
             <button onClick={() => window.print()} className="bg-white/5 hover:bg-white/10 text-white border border-white/5 px-6 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2">
                <Download size={16} /> 导出报表
            </button>
             <button onClick={onClearHistory} className="text-red-400 bg-red-500/10 hover:bg-red-500/20 px-6 py-2.5 rounded-xl font-black text-xs transition-all border border-red-500/20 flex items-center gap-2">
                <Trash2 size={16} /> 重置名单
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col px-4">
        {/* Removed glass-card wrapper to get rid of the white gradient box background */}
        <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 border-b border-white/5 sticky top-0 z-10 backdrop-blur-3xl">
                    <tr>
                        <th className="py-6 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">奖项级别</th>
                        <th className="py-6 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">幸运得主</th>
                        <th className="py-6 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">部门 · 工号</th>
                        <th className="py-6 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">揭晓时间</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {enrichedWinners.length === 0 ? (
                         <tr>
                            <td colSpan={4} className="py-40 text-center">
                                <div className="flex flex-col items-center opacity-20">
                                    <Trophy size={64} className="text-gray-500 mb-6" />
                                    <p className="font-black tracking-[0.4em] uppercase text-sm">虚位以待 · 见证精彩</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        enrichedWinners.map((w, idx) => (
                            <tr key={w.id} className="group hover:bg-brand-primary/5 transition-colors">
                                <td className="py-6 px-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-1.5 h-10 rounded-full ${idx < 3 ? 'bg-brand-primary shadow-[0_0_15px_rgba(15,108,255,0.6)]' : 'bg-gray-700'}`}></div>
                                        <span className={`text-lg font-black ${idx < 3 ? 'text-brand-primary' : 'text-white'}`}>{w.prizeName}</span>
                                    </div>
                                </td>
                                <td className="py-6 px-10">
                                    <span className="text-xl font-black text-white">{w.participantName}</span>
                                </td>
                                <td className="py-6 px-10">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-400 font-bold">{w.department}</span>
                                        <span className="text-[10px] text-gray-500 font-black mt-1 uppercase tracking-widest">{w.participantCode}</span>
                                    </div>
                                </td>
                                <td className="py-6 px-10 text-right">
                                    <div className="flex items-center justify-end gap-2 text-gray-500 text-xs font-black">
                                        <Clock size={14} className="text-brand-primary" />
                                        {new Date(w.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};