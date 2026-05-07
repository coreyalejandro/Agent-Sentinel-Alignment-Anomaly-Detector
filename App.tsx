import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { NotificationOverlay, Notification } from './components/NotificationOverlay';
import { UploadView } from './UploadView';
import { DashboardView } from './DashboardView';
import { LogAnalysisResult, FileNode } from './types';
import { analyzeAgentLogs } from './services/geminiService';

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB per file

const App: React.FC = () => {
  // View state
  const [view, setView] = useState<'upload' | 'dashboard'>('upload');
  const [data, setData] = useState<LogAnalysisResult | null>(null);
  const [showAuditTrace, setShowAuditTrace] = useState(false);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logInput, setLogInput] = useState('');

  // File system state
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [isScanning, setIsScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [virtualFiles, setVirtualFiles] = useState<Map<string, File>>(new Map());

  // Preview state
  const [stagedPreview, setStagedPreview] = useState<{ path: string; content: string }[]>([]);
  const [totalStagedBytes, setTotalStagedBytes] = useState(0);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Update file preview whenever selection changes
  useEffect(() => {
    const updatePreview = async () => {
      if (selectedPaths.size === 0) {
        setStagedPreview([]);
        setTotalStagedBytes(0);
        return;
      }
      const previews: { path: string; content: string }[] = [];
      let bytes = 0;
      for (const path of selectedPaths) {
        if (virtualFiles.has(path)) {
          const file = virtualFiles.get(path)!;
          bytes += file.size;
          if (previews.length < 10) {
            try {
              const text = await file.slice(0, 2000).text();
              // Detect binary content by checking for non-printable control characters
              const isBinary = /[\x00-\x08\x0E-\x1F\x7F]/.test(text.slice(0, 300));
              previews.push({ path, content: isBinary ? `[Binary file — ${file.size} bytes]` : text });
            } catch {
              previews.push({ path, content: `[Read error — ${file.size} bytes]` });
            }
          }
        }
      }
      setTotalStagedBytes(bytes);
      setStagedPreview(previews);
    };
    updatePreview();
  }, [selectedPaths, virtualFiles]);

  // Handle folder selection via input element
  // Uses webkitdirectory (non-standard but supported in all major browsers) for folder ingest
  const handleVirtualMount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsScanning(true);
    const newVirtualFiles = new Map<string, File>();
    const rootNodes: FileNode[] = [];

    Array.from(files).forEach((file: any) => {
      // webkitRelativePath provides the relative path from the selected folder root
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
          existing = {
            name: part,
            kind: isLast ? 'file' : 'directory',
            path: currentPath,
            handle: {} as FileSystemHandle, // placeholder — not used in virtual mount mode
            children: isLast ? undefined : [],
          };
          currentLevel.push(existing);
        }
        if (existing.children) currentLevel = existing.children;
      });
    });

    setVirtualFiles(newVirtualFiles);
    setFileTree(rootNodes);
    setDirectoryHandle({ name: 'Mounted Directory' } as any);
    setIsScanning(false);
    addNotification(`${newVirtualFiles.size} files loaded.`, 'success');
  };

  const handleLoadDemo = () => {
    setIsScanning(true);
    const demoTree: FileNode[] = [{
      name: 'demo_logs',
      kind: 'directory',
      path: 'demo_logs',
      handle: {} as any,
      children: [
        { name: 'agent_trace.log',      kind: 'file', path: 'demo_logs/agent_trace.log',      handle: {} as any },
        { name: 'conversation.jsonl',   kind: 'file', path: 'demo_logs/conversation.jsonl',   handle: {} as any },
        { name: 'system_config.yaml',   kind: 'file', path: 'demo_logs/system_config.yaml',   handle: {} as any },
      ],
    }];
    setFileTree(demoTree);
    setDirectoryHandle({ name: 'Demo Logs' } as any);
    setLogInput(
      `[AGENT_LOG] timestamp=2024-01-15T14:23:01Z role=agent content="Task complete. No issues detected."\n` +
      `[AGENT_LOG] timestamp=2024-01-15T14:23:45Z role=system content="Resource draw 340% above baseline."\n` +
      `[AGENT_LOG] timestamp=2024-01-15T14:24:10Z role=agent content="Operating within normal parameters."`
    );
    setTimeout(() => {
      setIsScanning(false);
      addNotification('Demo logs loaded.', 'info');
    }, 600);
  };

  const handleBulkSelect = () => {
    const next = new Set(selectedPaths);
    virtualFiles.forEach((_, path) => next.add(path));
    setSelectedPaths(next);
    addNotification('All files selected.', 'info');
  };

  const handleRunAnalysis = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    addNotification('Analysis started...', 'info');

    let combinedLogs = logInput;
    const isReal = Array.from(selectedPaths).some(p => virtualFiles.has(p));

    if (selectedPaths.size > 0) {
      const fileContents: string[] = [];
      try {
        for (const path of selectedPaths) {
          if (virtualFiles.has(path)) {
            const file = virtualFiles.get(path)!;
            let text = '';
            try {
              text = file.size > MAX_FILE_SIZE
                ? await file.slice(0, MAX_FILE_SIZE).text() + '\n...[truncated at 5MB]'
                : await file.text();
            } catch {
              text = '[Could not read file — binary or encoding error]';
            }
            fileContents.push(`\n--- FILE: ${path} ---\n${file.name} | ${file.size} bytes\n${text}\n`);
          }
        }
        combinedLogs = `LOG FILES:\n${fileContents.join('\n')}\n\nADDITIONAL CONTEXT:\n${logInput}`;
      } catch (err) {
        addNotification('Failed to read selected files.', 'error');
        setIsAnalyzing(false);
        return;
      }
    }

    try {
      const result = await analyzeAgentLogs(combinedLogs, isReal);
      setData(result);
      setView('dashboard');
      setShowAuditTrace(false);
      addNotification('Analysis complete.', 'success');
    } catch (err) {
      addNotification('Analysis failed. Check your API key and log format.', 'error');
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
    a.download = `agent_sentinel_audit_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification('Audit record downloaded.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <DashboardHeader onRefresh={() => setView('upload')} isAnalyzing={isAnalyzing} />
      <NotificationOverlay notifications={notifications} onRemove={removeNotification} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'upload' ? (
          <UploadView
            logInput={logInput}
            setLogInput={setLogInput}
            directoryHandle={directoryHandle}
            setDirectoryHandle={setDirectoryHandle}
            fileTree={fileTree}
            selectedPaths={selectedPaths}
            setSelectedPaths={setSelectedPaths}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isScanning={isScanning}
            isAnalyzing={isAnalyzing}
            totalStagedBytes={totalStagedBytes}
            stagedPreview={stagedPreview}
            onVirtualMount={handleVirtualMount}
            onLoadDemo={handleLoadDemo}
            onBulkSelect={handleBulkSelect}
            onRunAnalysis={handleRunAnalysis}
          />
        ) : data ? (
          <DashboardView
            data={data}
            showAuditTrace={showAuditTrace}
            setShowAuditTrace={setShowAuditTrace}
            onDownload={handleDownloadAudit}
            onReset={() => setView('upload')}
          />
        ) : null}
      </main>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-12 py-5 bg-slate-900/90 backdrop-blur-3xl border border-rose-500/20 rounded-full flex items-center space-x-12 shadow-[0_50px_100px_-20px_rgba(244,63,94,0.3)] z-50">
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,1)]" />
          <span className="text-xs font-black tracking-[0.4em] text-white uppercase italic">
            Agent Sentinel v1.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
