
import React, { useState, useEffect } from 'react';
import { Type, Save, CheckCircle, Sparkles, Calendar, Database, Cloud, AlertCircle, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { SiteConfig, AppState } from '../types';

interface SettingsManagerProps {
  siteConfig: SiteConfig;
  onUpdate: (config: SiteConfig) => void;
  onFullStateUpdate?: (state: AppState) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ siteConfig, onUpdate }) => {
  const [tempConfig, setTempConfig] = useState<SiteConfig>(siteConfig);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setTempConfig(siteConfig);
  }, [siteConfig]);

  const handleSave = () => {
    onUpdate(tempConfig);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 h-full items-center pt-8 md:pt-12 max-w-2xl mx-auto overflow-y-auto custom-scrollbar px-4 pb-20">
      <div className="text-center shrink-0">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles size={20} className="text-brand-primary animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">系统设置</h2>
        </div>
        <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-[10px]">Cloud Branding & System Sync</p>
      </div>

      {/* Brand & Logo Settings */}
      <div className="w-full glass-card rounded-[40px] p-8 md:p-10 border border-white/10 space-y-8 shadow-2xl relative overflow-hidden">
        
        {/* Logo Section */}
        <div className="space-y-4 relative z-10">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <ImageIcon size={14} className="text-brand-primary" />
            品牌标志 (LOGO URL)
          </label>
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group relative">
              {tempConfig.logoUrl ? (
                <img src={tempConfig.logoUrl} alt="Preview" className="w-full h-full object-contain p-2" />
              ) : (
                <ImageIcon size={24} className="text-gray-700" />
              )}
              <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[8px] font-black text-white uppercase">Preview</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="relative">
                <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="https://example.com/logo.png"
                  value={tempConfig.logoUrl || ''}
                  onChange={(e) => setTempConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl font-medium text-sm bg-white/5 border border-white/10 text-white outline-none focus:border-brand-primary/50 transition-colors"
                />
              </div>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight italic">* 请输入透明背景的 PNG 图片链接以获得最佳视觉效果</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Type size={14} className="text-brand-primary" />
            主标题 (品牌名称)
          </label>
          <input
            type="text"
            value={tempConfig.brandName || ''}
            onChange={(e) => setTempConfig(prev => ({ ...prev, brandName: e.target.value }))}
            className="w-full px-6 py-4 rounded-2xl font-black text-xl tracking-tight bg-white/5 border border-white/10 text-white outline-none focus:border-brand-primary/50 transition-colors"
          />
        </div>

        <div className="space-y-3 relative z-10">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Calendar size={14} className="text-brand-primary" />
            副标题 (活动名称)
          </label>
          <input
            type="text"
            value={tempConfig.eventName || ''}
            onChange={(e) => setTempConfig(prev => ({ ...prev, eventName: e.target.value }))}
            className="w-full px-6 py-4 rounded-2xl font-bold text-sm bg-white/5 border border-white/10 text-white outline-none uppercase focus:border-brand-primary/50 transition-colors"
          />
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
              showSuccess ? 'bg-brand-accent text-white' : 'bg-brand-primary text-white shadow-brand-glow hover:scale-[1.02] active:scale-95'
            }`}
          >
            {showSuccess ? <CheckCircle size={24} /> : <Save size={24} />}
            <span className="tracking-widest uppercase">{showSuccess ? '云端已同步' : '更新品牌信息'}</span>
          </button>
        </div>
      </div>

      {/* Firebase Status Info */}
      <div className="w-full glass-card rounded-[40px] p-8 border border-brand-primary/20 bg-brand-primary/5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
            <Cloud size={20} />
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase">CypressCloud 实时同步</h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Firebase Realtime Node: lottery_app</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-[10px] text-gray-400 leading-relaxed">
            <Database size={12} className="shrink-0 mt-0.5 text-brand-accent" />
            <span>所有更改将自动同步至 Firebase 云端，多台大屏幕接入时会实时更新中奖状态。</span>
          </div>
          <div className="flex items-start gap-2 text-[10px] text-gray-400 leading-relaxed">
            <AlertCircle size={12} className="shrink-0 mt-0.5 text-brand-warning" />
            <span>如果您在弱网环境下操作，修改会被排队并于重新联网后自动推送。</span>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};
