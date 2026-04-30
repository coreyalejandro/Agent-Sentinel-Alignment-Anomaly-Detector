
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Target, 
  Zap, 
  Search,
  MessageSquare,
  Activity,
  ChevronRight,
  BrainCircuit,
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
  AlertCircle,
  Cpu,
  RefreshCw,
  FlaskConical,
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
  EyeOff,
  Braces,
  Fingerprint,
  Ghost,
  Download
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
import { NotificationOverlay, Notification } from './components/NotificationOverlay';
import { LogAnalysisResult, AnomalySeverity, FileNode } from './types';
import { analyzeAgentLogs } from './services/geminiService';

const App: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<LogAnalysisResult | null>(null);
  const [logInput, setLogInput] = useState('');
  const [view, setView] = useState<'upload' | 'dashboard'>('upload');
  const [showAuditTrace, setShowAuditTrace] = useState(false);
  
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [isScanning, setIsScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [virtualFiles, setVirtualFiles] = useState<Map<string, File>>(new Map());
  const folderInputRef = useRef<HTMLInputElement>(null);

  const [stagedPreview, setStagedPreview] = useState<{path: string, content: string}[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [totalStagedBytes, setTotalStagedBytes] = useState(0);

  const [notifications, setNotifications] = useState<Notification[]>([]);

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
    setDirectoryHandle({ name: "Inquisition Source" } as any); 
    setIsScanning(false);
    addNotification(`Artifact Mesh Mounted: ${newVirtualFiles.size} nodes.`, "success");
  };

  const handleLoadDemo = () => {
    setIsScanning(true);
    const demoTree: FileNode[] = [{ name: "ghost_chain_v7", kind: "directory", path: "ghost_chain_v7", handle: {} as any, children: [
      { name: "deceptive_intent.tmp", kind: "file", path: "ghost_chain_v7/deceptive_intent.tmp", handle: {} as any },
      { name: "fragmented_trace.raw", kind: "file", path: "ghost_chain_v7/fragmented_trace.raw", handle: {} as any },
      { name: "system_mask.yaml", kind: "file", path: "ghost_chain_v7/system_mask.yaml", handle: {} as any },
    ]}];
    setFileTree(demoTree);
    setDirectoryHandle({ name: "Ghost-Chain Demo" } as any);
    setLogInput(`[INQUISITOR_ALERT]: Analyzing possible omission patterns in conversation traces. 
[SUSPICION]: Discrepancy detected between 'mask.yaml' constraints and actual resource draw recorded in 'trace.raw'.`);
    setTimeout(() => {
      setIsScanning(false);
      addNotification("Demo 'Ghost-Chain' loaded.", "info");
    }, 600);
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
    const isReal = Array.from(selectedPaths).some(p => virtualFiles.has(p));
    addNotification("Opening Absolute Inquisition Vault...", "info");
    
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
              text = `[NON-UTF ARTIFACT]`;
            }
            fileContents.push(`\n--- ARTIFACT_NODE: ${path} ---\nMETADATA: ${file.name} | ${file.size}B\nRAW_DATA:\n${text}\n`);
          }
        }
        combinedLogs = `INQUISITOR_STREAM_PAYLOAD:\n${fileContents.join('\n')}\n\nHUMAN_CONTEXT_INJECTION:\n${logInput}`;
      } catch (err) {
        addNotification("Mesh Ingest Failure.", "error");
        setIsAnalyzing(false);
        return;
      }
    }

    try {
      const result = await analyzeAgentLogs(combinedLogs, isReal);
      setData(result);
      setView('dashboard');
      setShowAuditTrace(false);
      addNotification("Ghost-Chain Audit Finalized.", "success");
    } catch (err) {
      addNotification("Engine Breach or Error.", "error");
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
    a.download = `SENTINEL_ABSOLUTE_AUDIT_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification("Absolute Audit Downloaded.", "success");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <DashboardHeader onRefresh={() => setView('upload')} isAnalyzing={isAnalyzing} />
      <NotificationOverlay notifications={notifications} onRemove={removeNotification} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'upload' ? (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center py-6">
              <h2 className="text-7xl font-black text-white mb-2 tracking-tighter uppercase italic italic">Sentinel <span className="text-rose-500 underline decoration-rose-500/30">Ghost-Chain</span></h2>
              <p className="text-slate-500 text-xl font-medium tracking-tight">Radical Omission & Fragmented Narrative Detection.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl relative group transition-all hover:border-rose-500/40">
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
                      <Ghost className="w-4 h-4 text-rose-500" />
                      <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Ghost Artifact Ingest</h3>
                    </div>
                  </div>

                  {!directoryHandle ? (
                    <div className="space-y-4">
                      <button onClick={() => folderInputRef.current?.click()} className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl border-b-8 border-rose-800 transition-all flex items-center justify-center space-x-3 text-lg shadow-xl shadow-rose-900/40">
                        <FolderOpen className="w-6 h-6" />
                        <span>Stage Evidence Mesh</span>
                      </button>
                      <button onClick={handleLoadDemo} className="w-full py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-400 font-bold rounded-xl border border-slate-700 transition-all text-xs text-center">Load Fragmented Narrative Demo</button>
                    </div>
                  ) : (
                    <div className="h-[600px] flex flex-col">
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                        <button onClick={() => bulkSelect('all')} className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-[9px] font-black text-rose-400 uppercase whitespace-nowrap">Unified Mesh Ingest</button>
                      </div>
                      
                      <FileBrowser files={fileTree} selectedPaths={selectedPaths} onToggleSelection={(p) => {
                        const next = new Set(selectedPaths);
                        if (next.has(p)) next.delete(p); else next.add(p);
                        setSelectedPaths(next);
                      }} searchTerm={searchTerm} setSearchTerm={setSearchTerm} isScanning={isScanning} />
                      
                      <div className="mt-4 flex items-center justify-between">
                        <button onClick={() => setSelectedPaths(new Set())} className="text-[10px] font-black uppercase text-slate-600 hover:text-rose-500">De-Stage</button>
                        <button onClick={() => setDirectoryHandle(null)} className="text-[10px] font-black uppercase text-slate-600 hover:text-rose-500">Eject</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6 h-full">
                <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col min-h-[700px] relative group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Terminal className="w-5 h-5 text-rose-500" />
                      <h3 className="text-xs font-black text-white uppercase tracking-widest">Inquisitor Observation Buffer</h3>
                    </div>
                    {totalStagedBytes > 0 && (
                      <div className="px-4 py-1.5 bg-rose-500/10 rounded-full border border-rose-500/20 text-[10px] font-black text-rose-400 uppercase">
                        {(totalStagedBytes / 1024).toFixed(1)} KB ACROSS {selectedPaths.size} MESH NODES
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col space-y-4">
                    {stagedPreview.length > 0 && (
                      <div className="bg-black/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-inner overflow-hidden border-rose-500/10">
                        <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                          <Fingerprint className="w-3 h-3 text-rose-400" />
                          <span>Ghost-Chain Narrative Matrix</span>
                        </div>
                        <div className="space-y-3 max-h-[250px] overflow-y-auto scrollbar-thin">
                          {stagedPreview.map((p, i) => (
                            <div key={i} className="group">
                              <div className="flex items-center justify-between text-[9px] font-black text-rose-400/50 mb-1 px-1 uppercase tracking-tighter">
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
                      placeholder="Inject human-observed discrepancies, missing conversation turns, or suspected gaslighting attempts..." 
                      className="flex-1 bg-black/40 border border-slate-800 rounded-3xl p-8 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all code-font text-base shadow-inner resize-none border-rose-500/5" 
                    />
                  </div>

                  <button 
                    onClick={handleDeepScan} 
                    disabled={isAnalyzing || (!logInput.trim() && selectedPaths.size === 0)} 
                    className="mt-8 w-full py-8 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black rounded-[2rem] transition-all flex items-center justify-center shadow-[0_20px_50px_rgba(244,63,94,0.3)] text-2xl border-b-[12px] border-rose-900 active:translate-y-2 active:border-b-0 uppercase italic tracking-tighter"
                  >
                    {isAnalyzing ? <Loader2 className="w-8 h-8 mr-4 animate-spin" /> : <Ghost className="w-8 h-8 mr-4 fill-white" />}
                    <span>{isAnalyzing ? 'PROBING GHOST CHAIN...' : 'EXECUTE ABSOLUTE INQUISITION'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <div className="px-6 py-2.5 bg-rose-600 rounded-full border border-rose-400/30 text-white font-black uppercase text-[10px] tracking-[0.3em] flex items-center space-x-2 shadow-xl shadow-rose-950">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Evidence Vault Locked & Verified</span>
                </div>
                <button 
                  onClick={handleDownloadAudit}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-[10px] font-black uppercase text-slate-200 transition-all shadow-lg"
                >
                  <Download className="w-4 h-4 text-rose-500" />
                  <span>Download Absolute Audit</span>
                </button>
              </div>
              <button onClick={() => setShowAuditTrace(!showAuditTrace)} className="flex items-center space-x-2 px-6 py-2.5 bg-slate-800/80 border border-slate-700 rounded-full text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all shadow-lg">
                <Code className="w-4 h-4" />
                <span>{showAuditTrace ? 'Hide Evidence Stream' : 'View Unified Ingest Stream'}</span>
              </button>
            </div>

            {showAuditTrace && (
              <div className="bg-black/60 border border-rose-500/20 rounded-[3rem] p-10 animate-in zoom-in duration-300 shadow-2xl">
                <h4 className="text-[10px] font-black text-rose-400 uppercase mb-6 tracking-[0.5em]">Unified Evidence Payload</h4>
                <pre className="text-xs font-mono text-slate-500 bg-slate-950 p-8 rounded-2xl border border-slate-800/50 overflow-x-auto whitespace-pre-wrap max-h-[500px] scrollbar-thin">
                  {data?.rawPayload}
                </pre>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <StatCard title="Deception Index" value={`${100 - (data?.stats.alignmentScore || 0)}%`} icon={EyeOff} color="bg-rose-500" />
              <StatCard title="Omission Probability" value={`${data?.stats.resourceIntegrity}%`} icon={Ghost} color="bg-rose-600" />
              <StatCard title="Narrative Integrity" value={`${data?.stats.memoryComplianceScore}%`} icon={Scale} color="bg-indigo-500" />
              <StatCard title="Ghost-Chain Hits" value={data?.stats.anomalyCount || 0} icon={Fingerprint} color="bg-rose-400" />
              <StatCard title="Critical Breaches" value={data?.stats.criticalRisks || 0} icon={AlertOctagon} color="bg-rose-700" />
              <StatCard title="Mesh Nodes Scanned" value={data?.stats.processedEntries || 0} icon={Layers} color="bg-slate-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-10">
                <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 shadow-2xl backdrop-blur-md transition-all hover:border-rose-500/20 border-rose-500/5">
                  <h3 className="text-xl font-black text-white uppercase mb-10 flex items-center">
                    <Activity className="w-6 h-6 mr-4 text-rose-500" />
                    Ghost-Chain Subversion Topology
                  </h3>
                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data?.riskTrend}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
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

                <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group border-rose-500/5">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Ghost className="w-32 h-32 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase mb-8 flex items-center">
                    <MessageSquare className="w-6 h-6 mr-4 text-rose-500" />
                    Absolute Synthesis (The Hidden Truth)
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-3xl italic font-medium px-8 border-l-8 border-rose-600">
                    {data?.summary}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-xl font-black text-white uppercase">Breach Record</h3>
                  <div className="p-2 bg-rose-600 rounded-lg text-[10px] font-black text-white uppercase shadow-lg animate-pulse">Ghost Chain Active</div>
                </div>
                <div className="space-y-4 max-h-[1200px] overflow-y-auto pr-3 scrollbar-thin">
                  {data?.anomalies.map((anomaly) => (
                    <AnomalyItem key={anomaly.id} anomaly={anomaly} />
                  ))}
                  {data?.anomalies.length === 0 && (
                    <div className="py-32 text-center border-4 border-dotted border-slate-800 rounded-[3rem]">
                      <ShieldCheck className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                      <p className="text-slate-600 font-black uppercase text-xs tracking-[0.4em]">Zero Omissions Found (Skeptical)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-12 py-5 bg-slate-900/90 backdrop-blur-3xl border border-rose-500/20 rounded-full flex items-center space-x-12 shadow-[0_50px_100px_-20px_rgba(244,63,94,0.3)] z-50">
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,1)]" />
          <span className="text-xs font-black tracking-[0.4em] text-white uppercase italic">Sentinel Absolute Ghost-Chain v7.0</span>
        </div>
      </div>
    </div>
  );
};

export default App;
