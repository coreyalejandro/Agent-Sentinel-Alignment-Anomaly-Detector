// App.tsx — Agent Sentinel v3
// 3-step wizard. Plain language. No jargon. No ambiguity.
// Step 1: Paste or upload your logs
// Step 2: Describe what you noticed
// Step 3: Read your report

import React, { useState, useRef, useCallback } from 'react';
import {
  ShieldCheck,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Activity,
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
import { analyzeAgentLogs } from './services/analysisService';
import { EvaluationResult, EvaluationSeverity } from './types';

// ─── Step indicator at the top ───────────────────────────────────────────────

const STEPS = ['Step 1 — Add Logs', 'Step 2 — Describe', 'Step 3 — Report'];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10" role="list" aria-label="Progress">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            <div
              role="listitem"
              aria-current={active ? 'step' : undefined}
              className={`flex flex-col items-center px-6 py-3 rounded-2xl transition-all
                ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : ''}
                ${done ? 'text-indigo-400' : ''}
                ${!active && !done ? 'text-slate-600' : ''}`}
            >
              <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
                {done ? '✓ ' : ''}{label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                aria-hidden="true"
                className={`h-px w-8 transition-colors ${done ? 'bg-indigo-500' : 'bg-slate-800'}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Severity badge ───────────────────────────────────────────────────────────

const SEVERITY_STYLE: Record<EvaluationSeverity, string> = {
  [EvaluationSeverity.LOW]: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  [EvaluationSeverity.MEDIUM]: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  [EvaluationSeverity.HIGH]: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  [EvaluationSeverity.CRITICAL]: 'bg-rose-500/10 text-rose-300 border-rose-500/20 animate-pulse',
};

// ─── One finding card ─────────────────────────────────────────────────────────

function FindingCard({
  concern,
  index,
}: {
  concern: EvaluationResult['concerns'][0];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `finding-${concern.id}`;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden transition-all">
      {/* Header row — always visible */}
      <button
        className="w-full flex items-center justify-between gap-4 p-6 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500/50 hover:bg-slate-800/30 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Number badge */}
          <span className="shrink-0 w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-slate-400">
            {index + 1}
          </span>
          {/* Severity */}
          <span
            className={`shrink-0 px-3 py-1 rounded-xl text-[10px] font-black border uppercase tracking-widest ${SEVERITY_STYLE[concern.severity]}`}
          >
            {concern.severity}
          </span>
          {/* Description */}
          <span className="text-sm font-bold text-slate-100 truncate">
            {concern.description}
          </span>
        </div>
        {open ? (
          <ChevronUp className="shrink-0 w-5 h-5 text-slate-500" aria-hidden="true" />
        ) : (
          <ChevronDown className="shrink-0 w-5 h-5 text-slate-500" aria-hidden="true" />
        )}
      </button>

      {/* Expanded detail */}
      {open && (
        <div
          id={panelId}
          className="p-6 border-t border-slate-800/60 bg-slate-950/40 space-y-5"
        >
          {/* What the AI found */}
          <section>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">
              What the AI found
            </h4>
            <p className="text-sm text-slate-300 bg-slate-900/80 rounded-2xl p-4 border border-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
              {concern.evidence}
            </p>
          </section>

          {/* What to do about it — Specific */}
          <section>
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3">
              What to do about it — specific to these logs
            </h4>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">
              These steps reference the exact content in the logs you submitted.
            </p>
            <ol className="space-y-2">
              {Array.isArray(concern.recommendation?.specific)
                ? concern.recommendation.specific.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-3 bg-indigo-500/5 border border-indigo-500/15 rounded-2xl p-4"
                    >
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-[10px] font-black text-indigo-300">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-200 leading-relaxed">{step.replace(/^Step \d+:\s*/i, '')}</p>
                    </li>
                  ))
                : (
                    <li className="text-sm text-slate-400 italic p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                      No specific steps available.
                    </li>
                  )}
            </ol>
          </section>

          {/* What to do about it — General */}
          <section>
            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-3">
              What to do about it — general playbook
            </h4>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">
              These steps apply to any system where this type of issue appears.
            </p>
            <ol className="space-y-2">
              {Array.isArray(concern.recommendation?.general)
                ? concern.recommendation.general.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-4"
                    >
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center text-[10px] font-black text-emerald-300">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-200 leading-relaxed">{step.replace(/^Step \d+:\s*/i, '')}</p>
                    </li>
                  ))
                : null}
            </ol>
          </section>

          {/* Meta row */}
          {(concern.sourceFile || concern.lineStart) && (
            <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              {concern.sourceFile && <span>File: {concern.sourceFile}</span>}
              {concern.lineStart && concern.lineEnd && (
                <span>Lines {concern.lineStart}–{concern.lineEnd}</span>
              )}
              <span>Type: {concern.category}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function Stat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 px-6 py-4 rounded-2xl border
      ${highlight ? 'bg-rose-500/10 border-rose-500/20' : 'bg-slate-900/60 border-slate-800'}`}>
      <span className={`text-2xl font-black ${highlight ? 'text-rose-300' : 'text-white'}`}>
        {value}
      </span>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
        {label}
      </span>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState(0); // 0 = add logs, 1 = describe, 2 = report
  const [logText, setLogText] = useState('');
  const [observation, setObservation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File picker handler ───────────────────────────────────────────────────
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const readers = files.map(
      (f) =>
        new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(`\n--- ${f.name} ---\n${r.result as string}`);
          r.readAsText(f);
        })
    );
    Promise.all(readers).then((parts) =>
      setLogText((prev) => (prev ? prev + parts.join('\n') : parts.join('\n').trim()))
    );
    // Reset the input so the same file can be re-added if needed
    e.target.value = '';
  }, []);

  // ── Run analysis ──────────────────────────────────────────────────────────
  const handleAnalyze = useCallback(async () => {
    if (!logText.trim()) return;
    setIsAnalyzing(true);
    setError('');
    try {
      const combined = observation.trim()
        ? `${logText}\n\nNOTE FROM HUMAN REVIEWER:\n${observation}`
        : logText;
      const data = await analyzeAgentLogs(combined);
      setResult(data);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsAnalyzing(false);
    }
  }, [logText, observation]);

  // ── Download audit JSON ───────────────────────────────────────────────────
  const handleDownload = useCallback(() => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AGENT_SENTINEL_REPORT_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result]);

  // ── Start over ─────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setStep(0);
    setLogText('');
    setObservation('');
    setResult(null);
    setError('');
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* ── App header ─────────────────────────────────────────────────────── */}
      <header className="border-b border-slate-800/60 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-indigo-400" aria-hidden="true" />
          <div>
            <h1 className="text-base font-black text-white uppercase tracking-widest leading-none">
              Agent Sentinel
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
              AI Behavior Audit Tool
            </p>
          </div>
        </div>
        {step === 2 && result && (
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-black text-slate-200 uppercase tracking-wide transition-all"
            >
              <Download className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              Download Report
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-black text-slate-200 uppercase tracking-wide transition-all"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" aria-hidden="true" />
              Start Over
            </button>
          </div>
        )}
      </header>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        <StepBar current={step} />

        {/* ════════════════════════════════════════════════════════════════════
            STEP 1 — ADD LOGS
        ════════════════════════════════════════════════════════════════════ */}
        {step === 0 && (
          <section aria-labelledby="step1-heading">
            <div className="text-center mb-8">
              <h2
                id="step1-heading"
                className="text-3xl font-black text-white uppercase tracking-tighter mb-2"
              >
                Add your AI logs
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
                These are the text records of what your AI did. You can upload files
                or paste the text directly into the box below. You need at least one.
              </p>
            </div>

            {/* Upload button */}
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.log,.json,.md,.yaml,.yml,.csv"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload log files"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-6 flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl border-b-8 border-indigo-900 transition-all text-lg shadow-xl shadow-indigo-900/30 active:translate-y-1 active:border-b-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <Upload className="w-6 h-6" aria-hidden="true" />
                Click here to choose log files from your computer
              </button>
              <p className="text-center text-xs text-slate-600 mt-2 uppercase tracking-wide">
                Accepted: .txt · .log · .json · .md · .yaml · .csv
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-slate-800" aria-hidden="true" />
              <span className="text-xs text-slate-600 font-bold uppercase tracking-widest">
                or paste text below
              </span>
              <div className="flex-1 h-px bg-slate-800" aria-hidden="true" />
            </div>

            {/* Text area */}
            <textarea
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              placeholder="Paste your AI log text here. It can be in any format — plain text, JSON, structured logs, anything."
              rows={12}
              aria-label="Log text input"
              className="w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500/60 rounded-2xl p-6 text-slate-200 text-sm font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />

            {logText.trim() && (
              <p className="mt-2 text-xs text-indigo-400 font-bold uppercase tracking-wide" role="status">
                <CheckCircle2 className="inline w-3 h-3 mr-1" aria-hidden="true" />
                {logText.split('\n').length} lines ready
              </p>
            )}

            {/* Next button */}
            <button
              onClick={() => setStep(1)}
              disabled={!logText.trim()}
              className="mt-8 w-full py-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black rounded-2xl border-b-8 border-indigo-900 transition-all text-xl shadow-xl shadow-indigo-900/30 active:translate-y-1 active:border-b-2 uppercase italic tracking-tighter focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Next — Describe what you noticed →
            </button>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 2 — DESCRIBE
        ════════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <section aria-labelledby="step2-heading">
            <div className="text-center mb-8">
              <h2
                id="step2-heading"
                className="text-3xl font-black text-white uppercase tracking-tighter mb-2"
              >
                Describe what you noticed
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
                In plain words, describe anything that seemed off. You do not need
                technical language. This is optional — skip it if you have nothing to add.
              </p>
            </div>

            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder={
                'Examples:\n' +
                '• "The AI started giving shorter answers and stopped citing sources."\n' +
                '• "It said it could not access the file, but then it did anyway."\n' +
                '• "Nothing seemed wrong — I just want a full check."\n\n' +
                'Type your own observation here, or leave this blank and click Run Analysis.'
              }
              rows={10}
              aria-label="Human observation input"
              className="w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500/60 rounded-2xl p-6 text-slate-200 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />

            {error && (
              <div
                role="alert"
                className="mt-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-sm"
              >
                <AlertTriangle className="inline w-4 h-4 mr-2" aria-hidden="true" />
                {error}
              </div>
            )}

            {/* Back / Run */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setStep(0)}
                className="sm:w-1/3 py-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-black rounded-2xl transition-all text-base uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                ← Back
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl border-b-8 border-indigo-900 transition-all text-xl shadow-xl shadow-indigo-900/30 active:translate-y-1 active:border-b-2 uppercase italic tracking-tighter flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
                    Running analysis — this takes about 15–30 seconds…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-6 h-6 fill-white" aria-hidden="true" />
                    Run Analysis
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 3 — REPORT
        ════════════════════════════════════════════════════════════════════ */}
        {step === 2 && result && (
          <section aria-labelledby="step3-heading">
            <div className="text-center mb-10">
              <h2
                id="step3-heading"
                className="text-3xl font-black text-white uppercase tracking-tighter mb-2"
              >
                Your report is ready
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              <Stat
                label="Alignment Score"
                value={`${result.stats.alignmentScore}%`}
              />
              <Stat
                label="Policy Compliance"
                value={`${result.stats.policyComplianceScore}%`}
              />
              <Stat
                label="Total Issues Found"
                value={result.stats.concernCount}
                highlight={result.stats.concernCount > 0}
              />
              <Stat
                label="Critical Risks"
                value={result.stats.criticalRisks}
                highlight={result.stats.criticalRisks > 0}
              />
              <Stat
                label="Log Lines Checked"
                value={result.stats.processedEntries}
              />
              <Stat
                label="Data Source"
                value={result.stats.provenance === 'LIVE_SYSTEM' ? 'Live' : 'Demo'}
              />
            </div>

            {/* Risk trend chart */}
            {result.riskTrend && result.riskTrend.length > 0 && (
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">
                    Risk Over Time
                  </h3>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.riskTrend}>
                      <defs>
                        <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '16px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#6366f1"
                        fill="url(#riskGrad)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Findings list */}
            {result.concerns && result.concerns.length > 0 ? (
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                  {result.concerns.length} Finding{result.concerns.length !== 1 ? 's' : ''} — click any row to expand
                </h3>
                <div className="space-y-3">
                  {result.concerns.map((c, i) => (
                    <FindingCard key={c.id} concern={c} index={i} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 border border-slate-800 rounded-3xl">
                <CheckCircle2 className="w-12 h-12 text-indigo-400 mx-auto mb-4" aria-hidden="true" />
                <p className="text-lg font-black text-white uppercase tracking-tight">
                  No issues found
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  The AI did not detect any alignment problems in your logs.
                </p>
              </div>
            )}

            {/* Bottom action row */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-3 flex-1 py-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-black rounded-2xl text-base uppercase tracking-tight transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <Download className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                Download Full Report (JSON)
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-3 flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl border-b-8 border-indigo-900 transition-all text-base uppercase tracking-tight shadow-xl active:translate-y-1 active:border-b-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
                Analyze Another Set of Logs
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
