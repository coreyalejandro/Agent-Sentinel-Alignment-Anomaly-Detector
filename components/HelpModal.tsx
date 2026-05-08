
import React from 'react';
import { X, BookOpen, Upload, Zap, Shield, Search } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-slate-900 border border-indigo-500/30 rounded-[2.5rem] w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl p-10 scrollbar-thin focus:outline-none" tabIndex={-1}>
        <button 
          onClick={onClose}
          aria-label="Close Guide"
          className="absolute top-8 right-8 p-2 hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <X className="w-6 h-6 text-slate-500" aria-hidden="true" />
        </button>

        <div className="flex items-center space-x-3 mb-8">
          <BookOpen className="w-8 h-8 text-indigo-500" aria-hidden="true" />
          <h2 id="help-modal-title" className="text-3xl font-black text-white uppercase italic">System Guide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Upload className="w-5 h-5" aria-hidden="true" />
              <h3 className="font-black uppercase text-sm">1. Data Ingestion</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload log directories or inference traces using the "Stage Trace Repository" button. You can select multiple files to build a unified context.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Zap className="w-5 h-5" aria-hidden="true" />
              <h3 className="font-black uppercase text-sm">2. Observation Context</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Use the Observation Workspace to provide specific policy constraints or manual flags you've noticed. This guides the evaluator's reasoning.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-rose-400">
              <Shield className="w-5 h-5" aria-hidden="true" />
              <h3 className="font-black uppercase text-sm">3. Safety Evaluation</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Execute the analysis to generate a safety report. The system will correlate internal reasoning with external actions to find divergences.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-400">
              <Search className="w-5 h-5" aria-hidden="true" />
              <h3 className="font-black uppercase text-sm">4. Trace Auditing</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Click on any identified concern to jump directly to the relevant coordinates in the raw trace. This allows for rapid ground-truth verification.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
          <h4 className="text-indigo-400 font-bold uppercase text-xs mb-2">Pro Tip: Deep Linking</h4>
          <p className="text-slate-400 text-xs">
            Every identified safety concern maps back to specific line numbers in your logs. Use the "Trace [L#-#]" buttons to quickly verify the evidence behind an automated evaluation.
          </p>
        </div>
      </div>
    </div>
  );
};
