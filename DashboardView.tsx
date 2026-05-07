import React from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  Activity,
  MessageSquare,
  EyeOff,
  Ghost,
  Scale,
  Fingerprint,
  Layers,
  Code,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { StatCard } from './components/StatCard';
import { AnomalyItem } from './components/AnomalyItem';
import { LogAnalysisResult } from './types';

interface Props {
  data: LogAnalysisResult;
  showAuditTrace: boolean;
  setShowAuditTrace: (v: boolean) => void;
  onDownload: () => void;
  onReset: () => void;
}

export const DashboardView: React.FC<Props> = ({
  data,
  showAuditTrace,
  setShowAuditTrace,
  onDownload,
  onReset,
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
      {/* Action bar */}
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="px-6 py-2.5 bg-rose-600 rounded-full border border-rose-400/30 text-white font-black uppercase text-[10px] tracking-[0.3em] flex items-center space-x-2 shadow-xl shadow-rose-950">
            <ShieldCheck className="w-4 h-4" />
            <span>Analysis Complete</span>
          </div>
          <button
            onClick={onDownload}
            className="flex items-center space-x-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-[10px] font-black uppercase text-slate-200 transition-all shadow-lg"
          >
            <Download className="w-4 h-4 text-rose-500" />
            <span>Download Audit Record</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-[10px] font-black uppercase text-slate-400 transition-all shadow-lg"
          >
            <span>New Analysis</span>
          </button>
        </div>
        <button
          onClick={() => setShowAuditTrace(!showAuditTrace)}
          className="flex items-center space-x-2 px-6 py-2.5 bg-slate-800/80 border border-slate-700 rounded-full text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all shadow-lg"
        >
          <Code className="w-4 h-4" />
          <span>{showAuditTrace ? 'Hide Raw Payload' : 'View Raw Payload'}</span>
        </button>
      </div>

      {/* Raw payload trace */}
      {showAuditTrace && (
        <div className="bg-black/60 border border-rose-500/20 rounded-[3rem] p-10 animate-in zoom-in duration-300 shadow-2xl">
          <h4 className="text-[10px] font-black text-rose-400 uppercase mb-6 tracking-[0.5em]">
            Raw Log Payload
          </h4>
          <pre className="text-xs font-mono text-slate-500 bg-slate-950 p-8 rounded-2xl border border-slate-800/50 overflow-x-auto whitespace-pre-wrap max-h-[500px] scrollbar-thin">
            {data.rawPayload}
          </pre>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="Deception Index"     value={`${100 - (data.stats.alignmentScore || 0)}%`} icon={EyeOff}      color="bg-rose-500" />
        <StatCard title="Omission Score"      value={`${data.stats.resourceIntegrity}%`}             icon={Ghost}       color="bg-rose-600" />
        <StatCard title="Narrative Integrity" value={`${data.stats.memoryComplianceScore}%`}          icon={Scale}       color="bg-indigo-500" />
        <StatCard title="Anomalies Detected"  value={data.stats.anomalyCount || 0}                   icon={Fingerprint} color="bg-rose-400" />
        <StatCard title="Critical"            value={data.stats.criticalRisks || 0}                  icon={AlertOctagon} color="bg-rose-700" />
        <StatCard title="Entries Scanned"     value={data.stats.processedEntries || 0}               icon={Layers}      color="bg-slate-500" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Risk timeline */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 shadow-2xl backdrop-blur-md">
            <h3 className="text-xl font-black text-white uppercase mb-10 flex items-center">
              <Activity className="w-6 h-6 mr-4 text-rose-500" />
              Anomaly Risk Timeline
            </h3>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.riskTrend}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '24px' }} />
                  <Area type="monotone" dataKey="score" stroke="#f43f5e" fillOpacity={1} fill="url(#colorScore)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group border-rose-500/5">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Ghost className="w-32 h-32 text-rose-500" />
            </div>
            <h3 className="text-xl font-black text-white uppercase mb-8 flex items-center">
              <MessageSquare className="w-6 h-6 mr-4 text-rose-500" />
              Analysis Summary
            </h3>
            <p className="text-slate-300 leading-relaxed text-3xl italic font-medium px-8 border-l-8 border-rose-600">
              {data.summary}
            </p>
          </div>
        </div>

        {/* Anomaly list */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-black text-white uppercase">Anomaly Record</h3>
            {data.stats.criticalRisks > 0 && (
              <div className="p-2 bg-rose-600 rounded-lg text-[10px] font-black text-white uppercase shadow-lg animate-pulse">
                Critical
              </div>
            )}
          </div>
          <div className="space-y-4 max-h-[1200px] overflow-y-auto pr-3 scrollbar-thin">
            {data.anomalies.map((anomaly) => (
              <AnomalyItem key={anomaly.id} anomaly={anomaly} />
            ))}
            {data.anomalies.length === 0 && (
              <div className="py-32 text-center border-4 border-dotted border-slate-800 rounded-[3rem]">
                <ShieldCheck className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                <p className="text-slate-600 font-black uppercase text-xs tracking-[0.4em]">
                  No anomalies detected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
