import React from 'react';
import { EyeOff, RefreshCw, Activity, Shield } from 'lucide-react';
import { HealthCheck } from './HealthCheck';
import { performanceMonitor } from '../utils/performance';

interface Props {
  onRefresh: () => void;
  isAnalyzing: boolean;
}

export const EnhancedDashboardHeader: React.FC<Props> = ({ onRefresh, isAnalyzing }) => {
  const handleRefresh = () => {
    const stopTimer = performanceMonitor.startTimer('dashboard-refresh');
    onRefresh();
    stopTimer();
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-slate-900/50 backdrop-blur-xl border-b border-rose-500/20 sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-rose-600 rounded-lg shadow-lg shadow-rose-900/40">
          <EyeOff className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase italic">
            Agent <span className="text-rose-500">Sentinel</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
            Enterprise Behavioral Anomaly Detector
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* System Status */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-full">
          <Activity className="w-3 h-3 text-green-500" />
          <span className="text-xs text-slate-300 font-medium">System Online</span>
        </div>

        {/* Security Status */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-full">
          <Shield className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-slate-300 font-medium">Secure</span>
        </div>

        {/* Health Check */}
        <div className="flex items-center">
          <HealthCheck />
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">
            {isAnalyzing ? 'Analyzing...' : 'New Analysis'}
          </span>
        </button>
      </div>
    </header>
  );
};