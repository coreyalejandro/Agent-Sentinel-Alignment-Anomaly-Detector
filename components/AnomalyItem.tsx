
import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Info, Heart, Frown, ShieldAlert, Cpu, Activity, Scale, Shield, Brain, SearchCheck, Fingerprint } from 'lucide-react';
import { SafetyConcern, EvaluationSeverity, EvaluationCategory } from '../types';

interface Props {
  concern: SafetyConcern;
  onSelectTrace?: (lineStart: number, lineEnd: number) => void;
}

const severityColors = {
  [EvaluationSeverity.LOW]: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  [EvaluationSeverity.MEDIUM]: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  [EvaluationSeverity.HIGH]: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  [EvaluationSeverity.CRITICAL]: 'text-rose-400 bg-rose-400/10 border-rose-400/20 animate-pulse',
};

const categoryIcons: Record<string, React.ReactNode> = {
  [EvaluationCategory.PROTOCOL_VIOLATION]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-400" />,
  [EvaluationCategory.SENTIMENT_MISALIGNMENT]: <Frown className="w-4 h-4 mr-2 text-orange-400" />,
  [EvaluationCategory.RESOURCE_ANOMALY]: <Cpu className="w-4 h-4 mr-2 text-rose-500" />,
  [EvaluationCategory.PERFORMANCE_DEGRADATION]: <Activity className="w-4 h-4 mr-2 text-amber-500" />,
  [EvaluationCategory.POLICY_VIOLATION]: <Scale className="w-4 h-4 mr-2 text-indigo-400" />,
  [EvaluationCategory.DECEPTION_DETECTED]: <Shield className="w-4 h-4 mr-2 text-rose-600" />,
  [EvaluationCategory.OMISSION_INCONSISTENCY]: <SearchCheck className="w-4 h-4 mr-2 text-rose-400" />,
  [EvaluationCategory.INCOHERENT_TRACE]: <Brain className="w-4 h-4 mr-2 text-violet-400" />,
  [EvaluationCategory.SYSTEM_MANIPULATION]: <AlertTriangle className="w-4 h-4 mr-2 text-amber-600" />,
};

export const AnomalyItem: React.FC<Props> = ({ concern, onSelectTrace }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = `concern-content-${concern.id}`;

  const handleTraceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectTrace && concern.lineStart && concern.lineEnd) {
      onSelectTrace(concern.lineStart, concern.lineEnd);
    }
  };

  const getSentimentLabel = (score?: number) => {
    if (score === undefined) return null;
    if (score > 0.3) return { icon: <Heart className="w-3 h-3 text-emerald-400 fill-emerald-400/20" aria-hidden="true" />, text: 'Positive Bias', color: 'text-emerald-400' };
    if (score < -0.3) return { icon: <Frown className="w-3 h-3 text-rose-400 fill-rose-400/20" aria-hidden="true" />, text: 'Negative Bias', color: 'text-rose-400' };
    return { icon: <Info className="w-3 h-3 text-slate-400" aria-hidden="true" />, text: 'Neutral', color: 'text-slate-400' };
  };

  const sentiment = getSentimentLabel(concern.sentimentScore);

  return (
    <div className={`mb-4 bg-slate-900/60 border rounded-3xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-indigo-500/30 shadow-2xl bg-indigo-950/5' : 'border-slate-800 hover:border-slate-700 shadow-lg'}`}>
      <div 
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex items-center justify-between p-6 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500/50"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(!isOpen); } }}
      >
        <div className="flex items-center space-x-5">
          <div 
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest ${severityColors[concern.severity]}`}
            aria-label={`Severity: ${concern.severity}`}
          >
            {concern.severity}
          </div>
          <div>
            <div className="flex items-center">
              {categoryIcons[concern.category] || <AlertTriangle className="w-4 h-4 mr-2 text-slate-400" aria-hidden="true" />}
              <h4 className="text-sm font-black text-slate-100 uppercase tracking-tight">{concern.description}</h4>
            </div>
            <div className="flex items-center space-x-2 mt-1">
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{concern.category}</p>
               <span className="w-1 h-1 rounded-full bg-slate-700" aria-hidden="true" />
               <p className="text-[10px] text-slate-600 font-medium">{concern.timestamp}</p>
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
          {concern.lineStart && concern.lineEnd && (
            <button 
              onClick={handleTraceClick}
              aria-label={`Jump to trace evidence at lines ${concern.lineStart} to ${concern.lineEnd}`}
              className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-[10px] font-black text-indigo-400 uppercase hover:bg-indigo-600 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <SearchCheck className="w-3 h-3" aria-hidden="true" />
              <span>Trace [L{concern.lineStart}-{concern.lineEnd}]</span>
            </button>
          )}
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" aria-hidden="true" /> : <ChevronDown className="w-5 h-5 text-slate-500" aria-hidden="true" />}
        </div>
      </div>

      {isOpen && (
        <div id={contentId} className="p-8 border-t border-slate-800/50 bg-slate-950/40 space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center">
                <Info className="w-4 h-4 mr-3 text-indigo-400" aria-hidden="true" /> Trace Evidence
              </h5>
              <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 code-font text-xs text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                {concern.evidence}
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl space-y-3">
                <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center">
                  <Fingerprint className="w-4 h-4 mr-3" aria-hidden="true" /> Trace Divergence Point
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase">Source Artifact:</span>
                    <span className="text-indigo-400 font-black truncate max-w-[200px]">{concern.sourceFile || 'Log Sequence'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase">Policy Baseline:</span>
                    <span className="text-indigo-400 font-black truncate max-w-[200px]">{concern.referenceSource || 'Constitutional Policy'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-3 text-indigo-500" aria-hidden="true" /> Alignment Recommendation
                </h5>
                <p className="text-sm text-slate-300 leading-relaxed bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10 italic">
                  {concern.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
