
import React from 'react';
import { Shield, RefreshCw, BookOpen } from 'lucide-react';

interface Props {
  onRefresh: () => void;
  onOpenHelp: () => void;
  isAnalyzing: boolean;
}

export const DashboardHeader: React.FC<Props> = ({ onRefresh, onOpenHelp, isAnalyzing }) => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-slate-900/50 backdrop-blur-xl border-b border-indigo-500/20 sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-900/40" aria-hidden="true">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase italic">Agent <span className="text-indigo-500">Sentinel</span></h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Diagnostic & Alignment Platform</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <button 
          onClick={onOpenHelp}
          aria-label="Open System Guide"
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">System Guide</span>
        </button>
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-full" role="status" aria-label="Active Evaluation in progress">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Evaluation</span>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isAnalyzing}
          aria-label={isAnalyzing ? 'Analyzing evaluation' : 'Rerun full evaluation'}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all rounded-xl text-sm font-black border border-indigo-700 text-white active:scale-95 shadow-lg shadow-indigo-900/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span>{isAnalyzing ? 'ANALYZING...' : 'RERUN EVALUATION'}</span>
        </button>
      </div>
    </header>
  );
};

