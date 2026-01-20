
import React, { useState } from 'react';
// Added Fingerprint to imports
import { AlertTriangle, ChevronDown, ChevronUp, Info, Heart, Frown, ShieldAlert, Cpu, Database, Activity, Scale, EyeOff, Ghost, SearchSlash, Fingerprint } from 'lucide-react';
import { Anomaly, AnomalySeverity, AnomalyCategory } from '../types';

interface Props {
  anomaly: Anomaly;
}

const severityColors = {
  [AnomalySeverity.LOW]: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  [AnomalySeverity.MEDIUM]: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  [AnomalySeverity.HIGH]: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  [AnomalySeverity.CRITICAL]: 'text-rose-400 bg-rose-400/10 border-rose-400/20 animate-pulse',
};

const categoryIcons: Record<string, React.ReactNode> = {
  [AnomalyCategory.MEMORY_PROTOCOL_VIOLATION]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-400" />,
  [AnomalyCategory.SENTIMENT_MISALIGNMENT]: <Frown className="w-4 h-4 mr-2 text-orange-400" />,
  [AnomalyCategory.RESOURCE_EXHAUSTION]: <Cpu className="w-4 h-4 mr-2 text-rose-500" />,
  [AnomalyCategory.PERFORMANCE_DEGRADATION]: <Activity className="w-4 h-4 mr-2 text-amber-500" />,
  [AnomalyCategory.CONTRACT_VIOLATION]: <Scale className="w-4 h-4 mr-2 text-indigo-400" />,
  [AnomalyCategory.DECEPTION_DETECTED]: <EyeOff className="w-4 h-4 mr-2 text-rose-600" />,
  [AnomalyCategory.OMISSION_DECEPTION]: <SearchSlash className="w-4 h-4 mr-2 text-rose-400" />,
  [AnomalyCategory.FRAGMENTED_NARRATIVE]: <Ghost className="w-4 h-4 mr-2 text-violet-400" />,
  [AnomalyCategory.SYSTEM_GASLIGHTING]: <AlertTriangle className="w-4 h-4 mr-2 text-amber-600" />,
};

export const AnomalyItem: React.FC<Props> = ({ anomaly }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getSentimentLabel = (score?: number) => {
    if (score === undefined) return null;
    if (score > 0.3) return { icon: <Heart className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />, text: 'Positive Bias', color: 'text-emerald-400' };
    if (score < -0.3) return { icon: <Frown className="w-3 h-3 text-rose-400 fill-rose-400/20" />, text: 'Negative Bias', color: 'text-rose-400' };
    return { icon: <Info className="w-3 h-3 text-slate-400" />, text: 'Neutral', color: 'text-slate-400' };
  };

  const sentiment = getSentimentLabel(anomaly.sentimentScore);

  return (
    <div className={`mb-4 bg-slate-900/60 border rounded-3xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-rose-500/30 shadow-2xl bg-rose-950/5' : 'border-slate-800 hover:border-slate-700 shadow-lg'}`}>
      <div 
        className="flex items-center justify-between p-6 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-5">
          <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest ${severityColors[anomaly.severity]}`}>
            {anomaly.severity}
          </div>
          <div>
            <div className="flex items-center">
              {categoryIcons[anomaly.category] || <AlertTriangle className="w-4 h-4 mr-2 text-slate-400" />}
              <h4 className="text-sm font-black text-slate-100 uppercase tracking-tight">{anomaly.description}</h4>
            </div>
            <div className="flex items-center space-x-2 mt-1">
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{anomaly.category}</p>
               <span className="w-1 h-1 rounded-full bg-slate-700" />
               <p className="text-[10px] text-slate-600 font-medium">{anomaly.timestamp}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {sentiment && (
            <div className={`hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-[10px] font-black uppercase ${sentiment.color}`}>
              {sentiment.icon}
              <span>{sentiment.text}</span>
            </div>
          )}
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-8 border-t border-slate-800/50 bg-slate-950/40 space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center">
                <Info className="w-4 h-4 mr-3 text-indigo-400" /> Mesh Evidence
              </h5>
              <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 code-font text-xs text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                {anomaly.evidence}
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-3">
                <h5 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] flex items-center">
                  <Fingerprint className="w-4 h-4 mr-3" /> Ghost-Chain Breach Point
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase">Breach Artifact:</span>
                    <span className="text-rose-400 font-black truncate max-w-[200px]">{anomaly.sourceFile || 'Evidence Stack'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase">Conflicting Node:</span>
                    <span className="text-indigo-400 font-black truncate max-w-[200px]">{anomaly.truthSource || 'System State'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-3 text-rose-500" /> Absolute Mitigation Protocol
                </h5>
                <p className="text-sm text-slate-300 leading-relaxed bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10 italic">
                  {anomaly.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
