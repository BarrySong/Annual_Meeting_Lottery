
import React, { useState, useEffect } from 'react';
import { Layout as LayoutIcon, Image as ImageIcon, Type, Save, CheckCircle, Command, Sparkles, Calendar, Database, Download, Upload, AlertTriangle } from 'lucide-react';
import { SiteConfig, AppState } from '../types';
import { exportData, importData, loadState } from '../utils/storage';

interface SettingsManagerProps {
  siteConfig: SiteConfig;
  onUpdate: (config: SiteConfig) => void;
  // 增加强制更新全量状态的回调
  onFullStateUpdate?: (state: AppState) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ siteConfig, onUpdate, onFullStateUpdate }) => {
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

  const handleExport = () => {
    const currentState = loadState();
    exportData(currentState);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        const imported = importData(result);
        if (imported && onFullStateUpdate) {
          if (window.confirm('导入数据将覆盖当前所有人员和中奖信息，是否继续？')) {
            onFullStateUpdate(imported);
            alert('数据导入成功！');
          }
        } else {
          alert('无效的备份文件');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempConfig({ ...tempConfig, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full items-center pt-8 md:pt-12 max-w-2xl mx-auto overflow-y-auto custom-scrollbar px-4 pb-20">
      <div className="text-center shrink-0">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles size={20} className="text-brand-primary animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">系统设置</h2>
        </div>
        <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-[10px]">System Configuration & Data Backup</p>
      </div>

      {/* Brand Settings */}
      <div className="w-full glass-card rounded-[40px] p-8 md:p-10 border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-3 relative z-10">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Type size={14} className="text-brand-primary" />
            主标题
          </label>
          <input
            type="text"
            value={tempConfig.brandName || ''}
            onChange={(e) => setTempConfig(prev => ({ ...prev, brandName: e.target.value }))}
            className="w-full px-6 py-4 rounded-2xl font-black text-xl tracking-tight bg-white/5 border border-white/10 text-white outline-none"
          />
        </div>

        <div className="space-y-3 relative z-10">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Calendar size={14} className="text-brand-primary" />
            副标题
          </label>
          <input
            type="text"
            value={tempConfig.eventName || ''}
            onChange={(e) => setTempConfig(prev => ({ ...prev, eventName: e.target.value }))}
            className="w-full px-6 py-4 rounded-2xl font-bold text-sm bg-white/5 border border-white/10 text-white outline-none uppercase"
          />
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
              showSuccess ? 'bg-brand-accent text-white' : 'bg-brand-primary text-white shadow-brand-glow'
            }`}
          >
            {showSuccess ? <CheckCircle size={24} /> : <Save size={24} />}
            <span className="tracking-widest uppercase">{showSuccess ? '保存成功' : '保存品牌更改'}</span>
          </button>
        </div>
      </div>

      {/* Data Synchronization Section */}
      <div className="w-full glass-card rounded-[40px] p-8 md:p-10 border border-yellow-500/20 space-y-6 shadow-2xl relative bg-yellow-500/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-yellow-500 uppercase tracking-widest">
            <Database size={16} />
            数据迁移与同步
          </div>
          <div className="flex items-center gap-1 text-[8px] font-black text-yellow-500/50 bg-yellow-500/10 px-2 py-1 rounded">
            <AlertTriangle size={10} />
            跨设备建议使用导出功能
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={handleExport}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <Download className="text-brand-primary group-hover:scale-110 transition-transform" size={32} />
            <div className="text-center">
              <div className="text-white font-black text-xs uppercase">备份当前数据</div>
              <div className="text-[9px] text-gray-500 mt-1">下载 JSON 格式文件</div>
            </div>
          </button>

          <label className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group cursor-pointer">
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            <Upload className="text-brand-accent group-hover:scale-110 transition-transform" size={32} />
            <div className="text-center">
              <div className="text-white font-black text-xs uppercase">恢复备份数据</div>
              <div className="text-[9px] text-gray-500 mt-1">选择 .json 文件导入</div>
            </div>
          </label>
        </div>

        <div className="p-4 bg-black/20 rounded-2xl text-[10px] text-gray-400 font-medium leading-relaxed">
          温馨提示：由于本项目采用浏览器本地存储（LocalStorage），更换设备或清除浏览器缓存会导致数据丢失。请定期点击上方按钮导出备份文件。
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};
