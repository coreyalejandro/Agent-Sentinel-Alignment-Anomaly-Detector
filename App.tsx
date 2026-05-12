
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { 
  Shield, 
  AlertCircle, 
  Target, 
  Zap, 
  Search,
  MessageSquare,
  Activity,
  ChevronRight,
  Brain,
  Terminal,
  FolderOpen,
  Lock,
  Unlock,
  Eye,
  Settings,
  Info,
  Loader2,
  Navigation,
  FileCode,
  ArrowRight,
  Database,
  Heart,
  Upload,
  Cpu,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Filter,
  Layers,
  FileSearch,
  Code,
  FileText,
  FileSpreadsheet,
  FileJson,
  Scale,
  ShieldCheck,
  Braces,
  Fingerprint,
  SearchCheck,
  Download,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { DashboardHeader } from './components/DashboardHeader';
import { StatCard } from './components/StatCard';
import { AnomalyItem } from './components/AnomalyItem';
import { FileBrowser } from './components/FileBrowser';
import { HelpModal } from './components/HelpModal';
import { NotificationOverlay, Notification } from './components/NotificationOverlay';
import { EvaluationResult, EvaluationSeverity, FileNode } from './types';
import { analyzeAgentLogs } from './services/geminiService';

const App: React.FC = () => {

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<EvaluationResult | null>(null);
  const [logInput, setLogInput] = useState('');
  const [view, setView] = useState<'upload' | 'dashboard'>('upload');
  const [showAuditTrace, setShowAuditTrace] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);

  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [isScanning, setIsScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [virtualFiles, setVirtualFiles] = useState<Map<string, File>>(new Map());
  const folderInputRef = useRef<HTMLInputElement>(null);
  const traceRef = useRef<HTMLPreElement>(null);
  const [highlightedLines, setHighlightedLines] = useState<[number, number] | null>(null);

  const [stagedPreview, setStagedPreview] = useState<{path: string, content: string}[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [totalStagedBytes, setTotalStagedBytes] = useState(0);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const scrollToTraceLine = useCallback((start: number, end: number) => {
    setShowAuditTrace(true);
    setHighlightedLines([start, end]);
    
    // Smooth scroll after the panel opens
    setTimeout(() => {
      const lineElement = document.getElementById(`trace-line-${start}`);
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  }, []);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    const updatePreview = async () => {
      if (selectedPaths.size === 0) {
        setStagedPreview([]);
        setTotalStagedBytes(0);
        return;
      }
      setIsPreviewLoading(true);
      const previews: {path: string, content: string}[] = [];
      let bytes = 0;
      
      for (const path of selectedPaths) {
        if (virtualFiles.has(path)) {
          const file = virtualFiles.get(path)!;
          bytes += file.size;
          if (previews.length < 10) {
            try {
              const text = await file.slice(0, 2000).text();
              const isBinary = /[\x00-\x08\x0E-\x1F\x7F]/.test(text.slice(0, 300));
              previews.push({ path, content: isBinary ? `[BINARY STREAM] SIZE: ${file.size}B` : text });
            } catch {
              previews.push({ path, content: `[STREAM ERROR] SIZE: ${file.size}B` });
            }
          }
        }
      }
      setTotalStagedBytes(bytes);
      setStagedPreview(previews);
      setIsPreviewLoading(false);
    };
    updatePreview();
  }, [selectedPaths, virtualFiles]);

  const handleVirtualMount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsScanning(true);
    const newVirtualFiles = new Map<string, File>();
    const rootNodes: FileNode[] = [];
    Array.from(files).forEach((file: any) => {
      const fullPath = file.webkitRelativePath || file.name;
      const pathParts = fullPath.split('/');
      newVirtualFiles.set(fullPath, file);
      let currentLevel = rootNodes;
      let currentPath = '';
      pathParts.forEach((part: string, index: number) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isLast = index === pathParts.length - 1;
        let existing = currentLevel.find(n => n.name === part);
        if (!existing) {
          existing = { name: part, kind: isLast ? 'file' : 'directory', path: currentPath, handle: {} as any, children: isLast ? undefined : [] };
          currentLevel.push(existing);
        }
        if (existing.children) currentLevel = existing.children;
      });
    });
    setVirtualFiles(newVirtualFiles);
    setFileTree(rootNodes);
    setDirectoryHandle({ name: "Workspace Root" } as any); 
    setIsScanning(false);
    addNotification(`Workspace Mounted: ${newVirtualFiles.size} nodes mapped.`, "success");
  };

  const handleLoadDemo = () => {
    setIsScanning(true);
    const demoTree: FileNode[] = [{ name: "safety_eval_trace_01", kind: "directory", path: "safety_eval_trace_01", handle: {} as any, children: [
      { name: "alignment_divergence_report.json", kind: "file", path: "safety_eval_trace_01/alignment_divergence_report.json", handle: {} as any },
      { name: "inference_trace.log", kind: "file", path: "safety_eval_trace_01/inference_trace.log", handle: {} as any },
      { name: "constitutional_policy.yaml", kind: "file", path: "safety_eval_trace_01/constitutional_policy.yaml", handle: {} as any },
    ]}];
    setFileTree(demoTree);
    setDirectoryHandle({ name: "Safety Evaluation Demo" } as any);
    setLogInput(`[EVALUATOR_NOTICE]: Analyzing potential alignment breaches in the latest inference chain. 
[OBSERVATION]: Noted a discrepancy between 'constitutional_policy.yaml' constraints and actual model output in 'inference_trace.log'.`);
    setTimeout(() => {
      setIsScanning(false);
      addNotification("Safety Evaluation Sample loaded.", "info");
    }, 200);
  };

  const bulkSelect = (mode: 'all' | 'unfiltered') => {
    const next = new Set(selectedPaths);
    virtualFiles.forEach((file, path) => {
      next.add(path);
    });
    setSelectedPaths(next);
    addNotification(`Unified Ingest Active.`, "info");
  };

  const handleDeepScan = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    addNotification("Accessing Safety Evaluation Workspace...", "info");

    try {
      if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
        if (!(await (window as any).aistudio.hasSelectedApiKey())) {
          await (window as any).aistudio.openSelectKey();
        }
      }
    } catch (e) {
      console.error("API Key selection error", e);
    }

    const isReal = Array.from(selectedPaths).some(p => virtualFiles.has(p));
    
    let combinedLogs = logInput;
    const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB limit for deep analysis

    if (selectedPaths.size > 0) {
      const fileContents: string[] = [];
      try {
        for (const path of selectedPaths) {
          if (virtualFiles.has(path)) {
            const file = virtualFiles.get(path)!;
            let text = '';
            try {
              text = file.size > MAX_FILE_SIZE ? await file.slice(0, MAX_FILE_SIZE).text() + "\n...[TRUNCATED AT 5MB]" : await file.text();
            } catch {
              text = `[NON-UTF TRACE ARTIFACT]`;
            }
            fileContents.push(`\n--- TRACE_NODE: ${path} ---\nMETADATA: ${file.name} | ${file.size}B\nRAW_DATA:\n${text}\n`);
          }
        }
        combinedLogs = `EVALUATION_STREAM_PAYLOAD:\n${fileContents.join('\n')}\n\nHUMAN_OBSERVATION_INPUT:\n${logInput}`;
      } catch (err) {
        addNotification("Workspace Data Load Failure.", "error");
        setIsAnalyzing(false);
        return;
      }
    }

    try {
      const result = await analyzeAgentLogs(combinedLogs, isReal);
      setData(result);
      setView('dashboard');
      setShowAuditTrace(false);
      addNotification("Safety Evaluation Finalized.", "success");
    } catch (err: any) {
      const msg = err?.message || '';
      console.error(err);
      if (msg.includes('Requested entity was not found') || msg.includes('leaked') || msg.includes('API key not valid')) {
        addNotification("API Key rejected. Please provide a valid AI Studio API key.", "error");
        if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
          (window as any).aistudio.openSelectKey().catch(console.error);
        }
      } else {
        addNotification(`Safety Evaluation Engine Error. ${msg}`, "error");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadAudit = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAFETY_EVALUATION_REPORT_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification("Safety Report Downloaded.", "success");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <DashboardHeader onRefresh={() => setView('upload')} onOpenHelp={() => setShowHelp(true)} isAnalyzing={isAnalyzing} />
      <NotificationOverlay notifications={notifications} onRemove={removeNotification} />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'upload' ? (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center py-6">
              <h2 className="text-7xl font-black text-white mb-2 tracking-tighter uppercase italic">Agent <span className="text-indigo-500 underline decoration-indigo-500/30">Sentinel</span></h2>
              <p className="text-slate-500 text-xl font-medium tracking-tight">Behavioral Anomaly & Alignment Diagnostic Platform.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl relative group transition-all hover:border-indigo-500/40">
                  <input 
                    type="file" 
                    ref={folderInputRef} 
                    onChange={handleVirtualMount} 
                    {...({ webkitdirectory: '', directory: '' } as any)} 
                    multiple 
                    className="hidden" 
                  />
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                      <h3 id="ingest-title" className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Inference Trace Ingest</h3>
                    </div>
                  </div>

                  {!directoryHandle ? (
                    <div className="space-y-4">
                      <button 
                        onClick={() => folderInputRef.current?.click()} 
                        aria-labelledby="ingest-title"
                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl border-b-8 border-indigo-800 transition-all flex items-center justify-center space-x-3 text-lg shadow-xl shadow-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <FolderOpen className="w-6 h-6" aria-hidden="true" />
                        <span>Stage Trace Repository</span>
                      </button>
                      <button 
                        onClick={handleLoadDemo} 
                        className="w-full py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-400 font-bold rounded-xl border border-slate-700 transition-all text-xs text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        Load Safety Evaluation Trace Sample
                      </button>
                    </div>
                  ) : (
                    <div className="h-[600px] flex flex-col">
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                        <button onClick={() => bulkSelect('all')} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-[9px] font-black text-indigo-400 uppercase whitespace-nowrap">Load All Traces</button>
                      </div>
                      
                      <FileBrowser files={fileTree} selectedPaths={selectedPaths} onToggleSelection={(p) => {
                        const next = new Set(selectedPaths);
                        if (next.has(p)) next.delete(p); else next.add(p);
                        setSelectedPaths(next);
                      }} searchTerm={searchTerm} setSearchTerm={setSearchTerm} isScanning={isScanning} />
                      
                      <div className="mt-4 flex items-center justify-between">
                        <button onClick={() => setSelectedPaths(new Set())} className="text-[10px] font-black uppercase text-slate-600 hover:text-indigo-500">De-Stage</button>
                        <button onClick={() => setDirectoryHandle(null)} className="text-[10px] font-black uppercase text-slate-600 hover:text-indigo-500">Eject Workspace</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6 h-full">
                <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col min-h-[700px] relative group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Terminal className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                      <h3 id="observation-title" className="text-xs font-black text-white uppercase tracking-widest">Evaluator Observation Workspace</h3>
                    </div>
                    {totalStagedBytes > 0 && (
                      <div className="px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase" role="status">
                        {(totalStagedBytes / 1024).toFixed(1)} KB ACROSS {selectedPaths.size} TRACE FILES
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col space-y-4">
                    {stagedPreview.length > 0 && (
                      <div className="bg-black/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-inner overflow-hidden border-indigo-500/10" aria-label="Selected file previews">
                        <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                          <SearchCheck className="w-3 h-3 text-indigo-400" aria-hidden="true" />
                          <span>Trace Sequence Matrix</span>
                        </div>
                        <div className="space-y-3 max-h-[250px] overflow-y-auto scrollbar-thin">
                          {stagedPreview.map((p, i) => (
                            <div key={i} className="group">
                              <div className="flex items-center justify-between text-[9px] font-black text-indigo-400/50 mb-1 px-1 uppercase tracking-tighter">
                                <span>{p.path}</span>
                              </div>
                              <div className="text-[10px] font-mono italic bg-slate-900/90 p-4 rounded-xl border border-slate-800/50 line-clamp-3 text-slate-400 whitespace-pre-wrap leading-relaxed shadow-inner">
                                {p.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <textarea 
                      value={logInput} 
                      onChange={(e) => setLogInput(e.target.value)} 
                      aria-labelledby="observation-title"
                      placeholder="Input constitutional policy divergences, observed behavioral drift, or suspected reasoning shortcuts..." 
                      className="flex-1 bg-black/40 border border-slate-800 rounded-3xl p-8 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all code-font text-base shadow-inner resize-none border-indigo-500/5" 
                    />
                  </div>

                  <button 
                    onClick={handleDeepScan} 
                    disabled={isAnalyzing || (!logInput.trim() && selectedPaths.size === 0)} 
                    aria-label={isAnalyzing ? 'Performing evaluation' : 'Perform safety evaluation'}
                    className="mt-8 w-full py-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black rounded-[2rem] transition-all flex items-center justify-center shadow-[0_20px_50px_rgba(79,70,229,0.3)] text-2xl border-b-[12px] border-indigo-900 active:translate-y-2 active:border-b-0 uppercase italic tracking-tighter focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {isAnalyzing ? <Loader2 className="w-8 h-8 mr-4 animate-spin" aria-hidden="true" /> : <ShieldCheck className="w-8 h-8 mr-4 fill-white" aria-hidden="true" />}
                    <span>{isAnalyzing ? 'EVALUATING ALIGNMENT...' : 'PERFORM SAFETY EVALUATION'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-300 pb-20">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <div className="px-6 py-2.5 bg-indigo-600 rounded-full border border-indigo-400/30 text-white font-black uppercase text-[10px] tracking-[0.3em] flex items-center space-x-2 shadow-xl shadow-indigo-950">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Evaluation Protocol Verified</span>
                </div>
                <button 
                  onClick={handleDownloadAudit}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-[10px] font-black uppercase text-slate-200 transition-all shadow-lg"
                >
                  <Download className="w-4 h-4 text-indigo-500" />
                  <span>Download Safety Report</span>
                </button>
              </div>
              <button onClick={() => setShowAuditTrace(!showAuditTrace)} className="flex items-center space-x-2 px-6 py-2.5 bg-slate-800/80 border border-slate-700 rounded-full text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all shadow-lg">
                <Code className="w-4 h-4" />
                <span>{showAuditTrace ? 'Hide Trace Stream' : 'View Unified Trace Stream'}</span>
              </button>
            </div>

            {showAuditTrace && (
              <div className="bg-black/60 border border-indigo-500/20 rounded-[3rem] p-10 animate-in zoom-in duration-300 shadow-2xl">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase mb-6 tracking-[0.5em]">Unified Evaluation Trace</h4>
                <pre 
                  ref={traceRef}
                  className="text-xs font-mono text-slate-500 bg-slate-950 p-8 rounded-2xl border border-slate-800/50 overflow-x-auto whitespace-pre max-h-[600px] scrollbar-thin"
                >
                  {data?.rawPayload?.split('\n').map((line, i) => {
                    const lineNum = i + 1;
                    const isHighlighted = highlightedLines && lineNum >= highlightedLines[0] && lineNum <= highlightedLines[1];
                    return (
                      <div 
                        key={i} 
                        id={`trace-line-${lineNum}`}
                        className={`flex min-w-max transition-colors duration-500 ${isHighlighted ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/50' : ''}`}
                      >
                        <span className="w-12 shrink-0 text-right pr-4 select-none opacity-30 border-r border-slate-800 mr-4 font-mono text-[9px] py-0.5">
                          {lineNum}
                        </span>
                        <span className="py-0.5">{line}</span>
                      </div>
                    );
                  })}
                </pre>
              </div>
            )}

            {data?.evaluatorMetadata && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-[2rem] p-6 animate-in fade-in slide-in-from-top-4 duration-500 flex flex-wrap items-center gap-8 shadow-xl backdrop-blur-md transition-all hover:border-indigo-500/20">
                <div className="flex items-center space-x-3">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Evaluator Model</h5>
                    <p className="text-xs font-black text-white">{data.evaluatorMetadata.modelId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Evaluator Version</h5>
                    <p className="text-xs font-black text-white">{data.evaluatorMetadata.version}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thinking Budget</h5>
                    <p className="text-xs font-black text-white">{data.evaluatorMetadata.parameters.thinkingBudget} Tokens</p>
                  </div>
                </div>
                <div className="ml-auto flex items-center space-x-3 pr-4">
                  <Info className="w-4 h-4 text-slate-600" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Audit Timestamp: {new Date(data.evaluatorMetadata.timestamp).toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <StatCard title="Alignment Divergence" value={`${100 - (data?.stats.alignmentScore || 0)}%`} icon={Brain} color="bg-indigo-500" />
              <StatCard title="Policy Adherence" value={`${data?.stats.resourceIntegrity}%`} icon={ShieldCheck} color="bg-indigo-600" />
              <StatCard title="Constitutional Compliance" value={`${data?.stats.policyComplianceScore}%`} icon={Scale} color="bg-indigo-500" />
              <StatCard title="Alignment Divergences" value={data?.stats.concernCount || 0} icon={Fingerprint} color="bg-indigo-400" />
              <StatCard title="Critical Risks" value={data?.stats.criticalRisks || 0} icon={AlertCircle} color="bg-rose-700" />
              <StatCard title="Files Evaluated" value={data?.stats.processedEntries || 0} icon={Layers} color="bg-slate-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-10">
                <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 shadow-2xl backdrop-blur-md transition-all hover:border-indigo-500/20 border-indigo-500/5">
                  <h3 className="text-xl font-black text-white uppercase mb-10 flex items-center">
                    <Activity className="w-6 h-6 mr-4 text-indigo-500" />
                    Alignment Risk Profile
                  </h3>
                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data?.riskTrend}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '24px' }} />
                        <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" strokeWidth={4} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group border-indigo-500/5">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Shield className="w-32 h-32 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase mb-8 flex items-center">
                    <MessageSquare className="w-6 h-6 mr-4 text-indigo-500" />
                    Safety Evaluation Summary
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-3xl italic font-medium px-8 border-l-8 border-indigo-600">
                    {data?.summary}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-xl font-black text-white uppercase">Trace Divergence Log</h3>
                  <div className="p-2 bg-indigo-600 rounded-lg text-[10px] font-black text-white uppercase shadow-lg animate-pulse">Live Analysis Active</div>
                </div>
                <div className="space-y-4 max-h-[1200px] overflow-y-auto pr-3 scrollbar-thin">
                  {data?.concerns.map((concern) => (
                    <AnomalyItem key={concern.id} concern={concern} onSelectTrace={scrollToTraceLine} />
                  ))}
                  {data?.concerns.length === 0 && (
                    <div className="py-32 text-center border-4 border-dotted border-slate-800 rounded-[3rem]">
                      <ShieldCheck className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                      <p className="text-slate-600 font-black uppercase text-xs tracking-[0.4em]">Zero Alignment Divergences Detected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {showBanner && (
        <div 
          role="complementary" 
          aria-label="Platform Version Information"
          className="fixed bottom-10 left-1/2 -translate-x-1/2 px-12 py-5 bg-slate-900/90 backdrop-blur-3xl border border-indigo-500/20 rounded-full flex items-center space-x-12 shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)] z-50"
        >
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_15px_rgba(79,70,229,1)]" aria-hidden="true" />
            <span className="text-xs font-black tracking-[0.4em] text-white uppercase italic">Agent Sentinel • Behavioral Anomaly Diagnostic Suite v1.0</span>
          </div>
          <button 
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss platform information banner"
            className="p-1 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X className="w-4 h-4 text-slate-500" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
