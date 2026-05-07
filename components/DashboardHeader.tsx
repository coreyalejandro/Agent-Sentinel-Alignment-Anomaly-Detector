
import React from 'react';
import { Shield, RefreshCw, EyeOff } from 'lucide-react';

interface Props {
  onRefresh: () => void;
  isAnalyzing: boolean;
}

export const DashboardHeader: React.FC<Props> = ({ onRefresh, isAnalyzing }) => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-slate-900/50 backdrop-blur-xl border-b border-rose-500/20 sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-rose-600 rounded-lg shadow-lg shadow-rose-900/40">
          <EyeOff className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase italic">Agent <span className="text-rose-500">Sentinel</span></h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Behavioral Anomaly Detector</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-full">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Active Audit</span>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition-all rounded-xl text-sm font-black border border-rose-700 text-white active:scale-95 shadow-lg shadow-rose-900/20"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'ANALYZING...' : 'RUN ANALYSIS'}</span>
        </button>
      </div>
    </header>
  );
};
